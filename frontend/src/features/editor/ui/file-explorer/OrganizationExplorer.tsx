"use client"

import {useCallback, useEffect, useState} from "react"
import {useSession} from "next-auth/react"
import {Edit, FolderPlus, Plus, Search, Trash2, User, X} from "lucide-react"
import {deleteRequest, getRequestSingle, postRequest, putRequest,} from "@/app/api/serverRequests/methods"
import {UserView} from "@/models/UserView"
import {FileNode, FileTreeItem} from "./FileTreeItem"
import {OrganizationView} from "@/models/OrganizationView"

type OrganizationRole = "admin" | "editor" | "viewer"

const roleClasses: Record<OrganizationRole, string> = {
    admin: "text-red-300 bg-red-500/10 border-red-500/30",
    editor: "text-blue-300 bg-blue-500/10 border-blue-500/30",
    viewer: "text-slate-300 bg-slate-500/10 border-slate-500/30",
}

export default function OrganizationExplorer({
    user,
    onSelectFile,
    onOpenMembersManager,
    organizationsRefreshKey = 0,
}: {
    user: UserView,
    onSelectFile?: (id: string) => void,
    onOpenMembersManager?: (organization: OrganizationView) => void,
    organizationsRefreshKey?: number,
}) {
    const [organizations, setOrganizations] = useState<OrganizationView[]>([])
    const [visibleOrganizations, setVisibleOrganizations] = useState<OrganizationView[]>([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [openedOrganization, setOpenedOrganization] = useState<OrganizationView | null>(null)
    const [openedOrganizationItems, setOpenedOrganizationItems] = useState<FileNode[]>([])
    const {data: session, status} = useSession()

    const filterOrganizations = useCallback(
        (query: string, source: OrganizationView[] = organizations) => {
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
        if (!user.id) return

        const membershipsRes = await getRequestSingle(`users/${user.id}/organizations`)
        if (!membershipsRes.ok) {
            setOrganizations([])
            setVisibleOrganizations([])
            return
        }

        const membershipsPayload = await membershipsRes.json()
        const userOrganizations = new Map(Object.entries(membershipsPayload?.data ?? {}))

        const nextOrganizations: Array<OrganizationView> = []
        for (const orgName of userOrganizations.keys()) {
            const orgViewResponse = await getRequestSingle(
                `organizations/name/${encodeURIComponent(orgName)}`
            )

            if (orgViewResponse.ok) {
                const orgViewPayload = await orgViewResponse.json()
                if (orgViewPayload != null && orgViewPayload.data != null) {
                    nextOrganizations.push({
                        ...orgViewPayload.data,
                        members: new Map(Object.entries(orgViewPayload.data.members ?? {})),
                    })
                }
            }
        }

        const mapped = nextOrganizations.sort((a, b) => a.name.localeCompare(b.name))

        setOrganizations(mapped)
        setVisibleOrganizations(mapped)
    }, [user.id])

    const fetchOrganizationRootItems = useCallback(async (organization: OrganizationView) => {
        const detailsRes = await getRequestSingle(`organizations/${organization.id}`)
        if (!detailsRes.ok) {
            setOpenedOrganizationItems([])
            return
        }

        const payload = await detailsRes.json()
        const details = (payload?.data ?? null) as OrganizationView | null
        if (details == null) {
            setOpenedOrganizationItems([])
            return
        }

        const folders: FileNode[] = (details.children ?? []).map((child) => ({
            id: child.id,
            name: child.name,
            type: "folder",
            scope: "organization",
            organizationId: organization.id,
        }))

        setOpenedOrganizationItems(folders)
    }, [])

    useEffect(() => {
        if (status !== "authenticated" || !session?.user) return
        fetchOrganizations()
    }, [status, session, fetchOrganizations, organizationsRefreshKey])

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

        const userId = user.id
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

    const handleEditOrganization = async () => {
        // TODO: prompt for new name and owner
    }

    const handleDeleteOrganization = async (organization: OrganizationView) => {
        const confirmDelete = confirm(`Are you sure you want to delete ${organization.name}?`)
        if (!confirmDelete) return

        const res = await deleteRequest(`organizations/${organization.id}/delete/userId/${user.id}`)

        if (res.ok) {
            await fetchOrganizations()
        }
    }

    const handleOpenOrganization = async (organization: OrganizationView) => {
        if (openedOrganization?.id == organization.id) {
            setOpenedOrganization(null)
            setOpenedOrganizationItems([])
            return
        }

        setOpenedOrganization(organization)
        await fetchOrganizationRootItems(organization)
    }

    const handleAddFolderToOrganization = async () => {
        if (!openedOrganization) return
        if (openedOrganization.members.get(user.id) == "viewer") return

        const folderName = (prompt("Enter folder name:") || "").trim()
        if (!folderName) return

        if (!user.id) return

        const createRes = await postRequest("directories/create", {
            name: folderName.trim(),
            owner: user.id,
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
            {children: [createdDirId]}
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
                        <Plus size={14}/>
                    </button>
                    <button
                        onClick={handleToggleSearch}
                        className={`rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${
                            isSearchOpen ? "bg-slate-800 text-white" : ""
                        }`}
                        title="Search organizations"
                        aria-label="Search organizations"
                    >
                        <Search size={14}/>
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
                    {visibleOrganizations.map((organization) => {
                        const role = organization.members.get(user.id)
                        return (
                            <li
                                key={organization.id}
                                className="rounded-lg px-2 py-1.5 hover:bg-slate-800 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => {
                                            void handleOpenOrganization(organization)
                                        }}
                                        className="flex flex-1 items-center justify-between gap-2 text-left"
                                        title={organization.name}
                                    >
                                        <span className="truncate text-slate-300 hover:text-white transition-colors">
                                            {organization.name}
                                        </span>
                                    </button>

                                    {role === "admin" && (
                                        <div className="flex gap-1 ml-2">
                                            <button
                                                onClick={() => handleEditOrganization()}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                                                title="Edit organization"
                                            >
                                                <Edit size={14}/>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrganization(organization)}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete organization"
                                            >
                                                <Trash2 size={14}/>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onOpenMembersManager?.(organization)
                                                }}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-purple-400 transition-colors"
                                                title="Manage members"
                                            >
                                                <User size={14}/>
                                            </button>
                                        </div>
                                    )}

                                    <span
                                        className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                            role
                                                ? roleClasses[role as OrganizationRole]
                                                : "bg-gray-500"
                                        }`}
                                    >
                                        {role ?? "unknown"}
                                    </span>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {openedOrganization && (
                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                    <div className="mb-2 flex items-center justify-between px-1">
                        <div className="truncate text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            {openedOrganization.name}
                        </div>
                        <div className="flex items-center gap-1">
                            {openedOrganization.members.get(user.id) != "viewer" && (
                                <button
                                    onClick={handleAddFolderToOrganization}
                                    className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    title="New folder"
                                    aria-label="New folder"
                                >
                                    <FolderPlus size={14}/>
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
                                <X size={14}/>
                            </button>
                        </div>
                    </div>

                    {openedOrganizationItems.length === 0 ? (
                        <div className="px-2 py-1 text-xs text-slate-500">No folders.</div>
                    ) : (
                        <div className="space-y-1">
                            {openedOrganizationItems.map((item) => (
                                <FileTreeItem
                                    org={openedOrganization}
                                    user={user}
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
