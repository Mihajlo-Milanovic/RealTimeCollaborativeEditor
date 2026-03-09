"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  getRequestSingle,
  postRequest,
} from "@/app/api/serverRequests/methods"
import { UserView } from "../../models/user"
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

  const handleCreateOrganization = async () => {
    const name = prompt("Unesite ime organizacije:")
    if (!name) return

    const userId = UserView.getInstance().id
    if (!userId) return

    const res = await postRequest("organizations/create", {
      name,
      organizer: userId,
      members: {},
      children: [],
      files: [],
    })

    if (!res.ok) {
      alert("Kreiranje organizacije nije uspelo.")
      return
    }

    await fetchOrganizations()
  }

  if (status === "loading") return null
  if (!session) return null

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Organizations
        </div>

        <button
          onClick={handleCreateOrganization}
          className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Create organization"
        >
          + Organization
        </button>
      </div>

      {organizations.length === 0 ? (
        <div className="px-2 py-1 text-xs text-slate-500">
          Nema organizacija.
        </div>
      ) : (
        <div className="space-y-1">
          {organizations.map((org) => (
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