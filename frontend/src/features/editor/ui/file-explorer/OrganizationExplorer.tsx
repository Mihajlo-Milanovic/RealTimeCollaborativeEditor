"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Plus, Search } from "lucide-react"
import { getRequestSingle } from "@/app/api/serverRequests/methods"
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session, status } = useSession()

  const fetchOrganizations = useCallback(async () => {
    const userId = UserView.getInstance().id
    if (!userId) return

    const res = await getRequestSingle(`organizations/user/${userId}`)
    if (!res.ok) return

    const payload = await res.json()
    const list = payload?.data ?? []

    setOrganizations(
      list.map((org: any) => ({
        id: org._id,
        name: org.name,
        type: "folder",
        scope: "organization",
        isOrganizationRoot: true,
        organizationId: org._id,
        isOwner: String(org.organizer) === String(userId),
      }))
    )
  }, [])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return

    UserView.getInstance().fillFromSession(session.user)
    fetchOrganizations()
  }, [status, session, fetchOrganizations])

  const handleCreateOrganization = () => {
    // TODO: Implement create organization flow
  }

  const handleSearchOrganizations = () => {
    setIsSearchOpen((prev) => !prev)
    // TODO: Implement organization search flow
  }

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  )

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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizations..."
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          />
        </div>
      )}

      {filteredOrganizations.length === 0 ? (
        <div className="px-2 py-1 text-xs text-slate-500">
          Nema organizacija.
        </div>
      ) : (
        <div className="space-y-1">
          {filteredOrganizations.map((org) => (
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
