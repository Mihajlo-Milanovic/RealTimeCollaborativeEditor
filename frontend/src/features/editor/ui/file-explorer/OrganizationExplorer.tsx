"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Plus, Search } from "lucide-react"
import { getRequestSingle, postRequest } from "@/app/api/serverRequests/methods"
import { UserView } from "@/models/user"
import { FileTreeItem, FileNode } from "./FileTreeItem"

type OrganizationNode = FileNode & {
  scope: "organization"
  isOrganizationRoot: true
  organizationId: string
  isOwner: boolean
}

export default function OrganizationExplorer({
  onSelectFile,
}: {
  onSelectFile?: (id: string) => void
}) {
  const [organizations, setOrganizations] = useState<OrganizationNode[]>([])
  const [visibleOrganizations, setVisibleOrganizations] = useState<
    OrganizationNode[]
  >([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session, status } = useSession()

  const toOrganizationNode = useCallback(
    (org: any, userId: string): OrganizationNode => {
      const organizationId = org.id ?? org._id
      const organizerId =
        typeof org.organizer === "string"
          ? org.organizer
          : org.organizer?.id ?? org.organizer?._id

      return {
        id: organizationId,
        name: org.name,
        type: "folder",
        scope: "organization",
        isOrganizationRoot: true,
        organizationId,
        isOwner: String(organizerId) === String(userId),
      }
    },
    []
  )

  const fetchOrganizations = useCallback(async () => {
    const userId = UserView.getInstance().id
    if (!userId) return

    const res = await getRequestSingle(`organizations/user/${userId}`)
    if (!res.ok) return

    const payload = await res.json()
    const list = payload?.data ?? []
    const mapped = list.map((org: any) => toOrganizationNode(org, userId))

    setOrganizations(mapped)
    setVisibleOrganizations(mapped)
  }, [toOrganizationNode])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return

    UserView.getInstance().fillFromSession(session.user)
    fetchOrganizations()
  }, [status, session, fetchOrganizations])

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
    setSearchQuery("")
  }

  const searchOrganizationsByName = useCallback(async () => {
    const query = searchQuery.trim()
    if (!query) {
      setVisibleOrganizations(organizations)
      return
    }

    const res = await getRequestSingle(
      `organizations/name/${encodeURIComponent(query)}`
    )

    if (!res.ok) {
      setVisibleOrganizations([])
      return
    }

    const payload = await res.json()
    const org = payload?.data
    const userId = UserView.getInstance().id
    if (!org || !userId) {
      setVisibleOrganizations([])
      return
    }

    setVisibleOrganizations([toOrganizationNode(org, userId)])
  }, [organizations, searchQuery, toOrganizationNode])

  const handleSearchOrganizations = async () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true)
      return
    }

    await searchOrganizationsByName()
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
            onClick={handleSearchOrganizations}
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

              if (!value.trim()) {
                setVisibleOrganizations(organizations)
              }
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                await searchOrganizationsByName()
              }
            }}
            placeholder="Search organizations..."
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>
      )}

      {visibleOrganizations.length === 0 ? (
        <div className="px-2 py-1 text-xs text-slate-500">
          Nema organizacija.
        </div>
      ) : (
        <div className="space-y-1">
          {visibleOrganizations.map((org) => (
            <FileTreeItem
              key={org.id}
              node={org}
              onSelectFile={onSelectFile}
              onRefresh={fetchOrganizations}
            />
          ))}
        </div>
      )}
    </div>
  )
}
