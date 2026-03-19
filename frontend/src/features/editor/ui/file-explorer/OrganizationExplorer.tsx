"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { FolderPlus, Plus, Search, X } from "lucide-react"
import {
  getRequestSingle,
  postRequest,
  putRequest,
} from "@/app/api/serverRequests/methods"
import { UserView } from "@/models/user"
import { FileNode, FileTreeItem } from "./FileTreeItem"

type OrganizationRole = "admin" | "editor" | "viewer"

type UserOrganizationsPayload = {
  organizations?: Record<string, string>
}

type OrganizationRecord = {
  id: string
  name: string
  role: OrganizationRole
}

type OrganizationDetails = {
  id?: string
  _id?: string
  name: string
  organizer?: string | { id?: string; _id?: string }
  children?: Array<{ id: string; name: string }>
}

const roleClasses: Record<OrganizationRole, string> = {
  admin: "text-red-300 bg-red-500/10 border-red-500/30",
  editor: "text-blue-300 bg-blue-500/10 border-blue-500/30",
  viewer: "text-slate-300 bg-slate-500/10 border-slate-500/30",
}

export default function OrganizationExplorer({
  onSelectFile,
}: {
  onSelectFile?: (id: string) => void
}) {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [visibleOrganizations, setVisibleOrganizations] = useState<OrganizationRecord[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [openedOrganization, setOpenedOrganization] =
    useState<OrganizationRecord | null>(null)
  const [openedOrganizationItems, setOpenedOrganizationItems] = useState<FileNode[]>([])
  const { data: session, status } = useSession()

  const filterOrganizations = useCallback(
    (query: string, source: OrganizationRecord[] = organizations) => {
      const normalized = query.trim().toLowerCase()
      if (!normalized) {
        setVisibleOrganizations(source)
        return
      }

      setVisibleOrganizations(
        source.filter((org) => org.name.toLowerCase().includes(normalized))
      )
    },
    [organizations]
  )

  const fetchOrganizations = useCallback(async () => {
    const userId = UserView.getInstance().id
    if (!userId) return

    const membershipsRes = await getRequestSingle(`users/${userId}/organizations`)
    if (!membershipsRes.ok) {
      setOrganizations([])
      setVisibleOrganizations([])
      return
    }

    const membershipsPayload = await membershipsRes.json()
    const userData = (membershipsPayload?.data ?? {}) as UserOrganizationsPayload

    const memberships = Object.entries(userData.organizations ?? {}).map(
      ([name, role]) => ({ name, role: role as OrganizationRole })
    )

    const orgsWithIds = await Promise.all(
      memberships.map(async ({ name, role }) => {
        const detailsRes = await getRequestSingle(
          `organizations/name/${encodeURIComponent(name)}`
        )

        if (!detailsRes.ok) return null
        const detailsPayload = await detailsRes.json()
        const details = (detailsPayload?.data ?? null) as OrganizationDetails | null
        if (!details) return null

        const id = String(details.id ?? details._id ?? "")
        if (!id) return null

        return { id, name, role }
      })
    )

    const mapped = orgsWithIds
      .filter((org): org is OrganizationRecord => Boolean(org))
      .sort((a, b) => a.name.localeCompare(b.name))

    setOrganizations(mapped)
    setVisibleOrganizations(mapped)
  }, [])

  const fetchOrganizationRootItems = useCallback(async (organization: OrganizationRecord) => {
    const detailsRes = await getRequestSingle(`organizations/${organization.id}`)
    if (!detailsRes.ok) {
      setOpenedOrganizationItems([])
      return
    }

    const payload = await detailsRes.json()
    const details = (payload?.data ?? null) as OrganizationDetails | null
    if (!details) {
      setOpenedOrganizationItems([])
      return
    }

    const canManage = organization.role !== "viewer"

    const folders: FileNode[] = (details.children ?? []).map((child) => ({
      id: child.id,
      name: child.name,
      type: "folder",
      scope: "organization",
      organizationId: organization.id,
      isOwner: canManage,
    }))

    setOpenedOrganizationItems(folders)
  }, [])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return

    UserView.getInstance().fillFromSession(session.user)
    fetchOrganizations()
  }, [status, session, fetchOrganizations])

  const handleToggleSearch = () => {
    const nextSearchOpen = !isSearchOpen
    setIsSearchOpen(nextSearchOpen)

    if (!nextSearchOpen) {
      setSearchQuery("")
      setVisibleOrganizations(organizations)
      return
    }

    filterOrganizations(searchQuery)
  }

  const handleCreateOrganization = async () => {
    const name = prompt("Enter organization name:")
    if (!name?.trim()) return

    const userId = UserView.getInstance().id
    if (!userId) return

    const res = await postRequest("organizations/create", {
      name: name.trim(),
      organizer: userId,
    })

    if (!res.ok) {
      alert("Could not create organization.")
      return
    }

    await fetchOrganizations()
  }

  const handleOpenOrganization = async (organization: OrganizationRecord) => {
    if (openedOrganization?.id === organization.id) {
      setOpenedOrganization(null)
      setOpenedOrganizationItems([])
      return
    }

    setOpenedOrganization(organization)
    await fetchOrganizationRootItems(organization)
  }

  const handleAddFolderToOrganization = async () => {
    if (!openedOrganization) return
    if (openedOrganization.role === "viewer") return

    const folderName = prompt("Enter folder name:")
    if (!folderName?.trim()) return

    const userId = UserView.getInstance().id
    if (!userId) return

    const createRes = await postRequest("directories/create", {
      name: folderName.trim(),
      owner: userId,
      parents: [],
      children: [],
      files: [],
      collaborators: [],
      organization: openedOrganization.id,
    })

    if (!createRes.ok) {
      alert("Could not create folder.")
      return
    }

    const createPayload = await createRes.json()
    const createdDir = createPayload?.data ?? createPayload
    const createdDirId = createdDir?.id

    if (!createdDirId) {
      alert("Could not resolve created folder id.")
      return
    }

    const attachRes = await putRequest(
      `organizations/${openedOrganization.id}/addChildren`,
      { children: [createdDirId] }
    )

    if (!attachRes.ok) {
      alert("Could not attach folder to organization.")
      return
    }

    await fetchOrganizationRootItems(openedOrganization)
  }

  if (status === "loading") return null
  if (!session) return null

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Organizations
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCreateOrganization}
            className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Create organization"
            aria-label="Create organization"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={handleToggleSearch}
            className={`rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${
              isSearchOpen ? "bg-slate-800 text-white" : ""
            }`}
            title="Search organizations"
            aria-label="Search organizations"
          >
            <Search size={14} />
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="px-1 pb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value
              setSearchQuery(value)
              filterOrganizations(value)
            }}
            placeholder="Search organizations..."
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>
      )}

      {visibleOrganizations.length === 0 ? (
        <div className="px-2 py-1 text-xs text-slate-500">No organizations.</div>
      ) : (
        <ul className="space-y-1 px-1">
          {visibleOrganizations.map((organization) => (
            <li
              key={organization.id}
              className="rounded-lg px-2 py-1.5 hover:bg-slate-800 transition-colors"
            >
              <button
                onClick={() => {
                  void handleOpenOrganization(organization)
                }}
                className="flex w-full items-center justify-between gap-2 text-left"
                title={organization.name}
              >
                <span className="truncate text-slate-300 hover:text-white transition-colors">
                  {organization.name}
                </span>
                <span
                  className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    roleClasses[organization.role]
                  }`}
                >
                  {organization.role}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {openedOrganization && (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-2">
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="truncate text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {openedOrganization.name}
            </div>
            <div className="flex items-center gap-1">
              {openedOrganization.role !== "viewer" && (
                <button
                  onClick={handleAddFolderToOrganization}
                  className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  title="New folder"
                  aria-label="New folder"
                >
                  <FolderPlus size={14} />
                </button>
              )}
              <button
                onClick={() => {
                  setOpenedOrganization(null)
                  setOpenedOrganizationItems([])
                }}
                className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Close organization explorer"
                aria-label="Close organization explorer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {openedOrganizationItems.length === 0 ? (
            <div className="px-2 py-1 text-xs text-slate-500">No folders.</div>
          ) : (
            <div className="space-y-1">
              {openedOrganizationItems.map((item) => (
                <FileTreeItem
                  key={item.id}
                  node={item}
                  onSelectFile={onSelectFile}
                  onRefresh={() => fetchOrganizationRootItems(openedOrganization)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
