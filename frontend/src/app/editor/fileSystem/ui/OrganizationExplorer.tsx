"use client"

import {
    Edit,
    Plus,
    Search,
    Trash2,
    User,
} from "lucide-react";
import {OrganizationRole} from "@/models/types/OrganizationRole";
import FileTree from "@/app/editor/fileSystem/ui/FileTree";
import {ImExit} from "react-icons/im";
import {AiOutlineDown, AiOutlineRight} from "react-icons/ai";
import {TOrganizationExplorer} from "@/models/elementTypes/TOrganizationExplorer";
import {prompts} from "@/app/editor/fileSystem/prompts";
import {useOrganizationExplorer} from "@/app/editor/fileSystem/state/useOrganizationExplorer";
import {HocuspocusProviderWebsocketComponent, HocuspocusRoom} from "@hocuspocus/provider-react";

const roleClasses: Record<OrganizationRole, string> = {
    admin: "text-red-300 bg-red-500/10 border-red-500/30",
    editor: "text-blue-300 bg-blue-500/10 border-blue-500/30",
    viewer: "text-slate-300 bg-slate-500/10 border-slate-500/30",
}

const WS_BASE_URL = "ws://localhost:3000";

export default function OrganizationExplorer(
    {
        user,
        onSelectFileAction,
        selectedFileId,
        onOpenMembersManagerAction,
        organizationsRefreshKey = 0,
    }: TOrganizationExplorer
) {

    const {
        organizationExplorerCollapsed,
        organizations,
        query,
        selected,
        isSearchOpen,
        isLoading,
        toggleSearch,
        queryOrganizations,
        selectOrganization,
        toggleOrganizationExplorer,
        refresh,
    } = useOrganizationExplorer(user.id);

    return (
        <div className="mt-4">
            <div className="mb-2 flex items-center justify-between px-1"
                 onClick={() => toggleOrganizationExplorer()}
            >
                <div className="mb-2 flex items-center justify-around px-1">
                    {organizationExplorerCollapsed ? (<AiOutlineDown/>) : (<AiOutlineRight/>)}
                    <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Organizations
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => prompts.createOrganization(user.id, refresh)}
                        className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        title="Create organization"
                        aria-label="Create organization"
                    >
                        <Plus size={14}/>
                    </button>
                    <button
                        onClick={toggleSearch}
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
                        value={query}
                        onChange={(e) => queryOrganizations(e.target.value)}
                        placeholder="Search organizations..."
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
                    />
                </div>
            )}
            <div
                className={`transition-all duration-300 overflow-hidden ${
                    organizationExplorerCollapsed ? "max-h-125" : "max-h-0"
                }`}
            >
                {organizations.length === 0 ? (
                    <div className="px-2 py-1 text-xs text-slate-500">No organizations.</div>
                ) : (
                    <ul className="space-y-1 px-1">
                        {organizations.map((organization) => {
                            const role = organization.members.get(user.id)
                            return (
                                <li
                                    key={organization.id}
                                    className="rounded-lg px-2 py-1.5 hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => selectOrganization(organization)}
                                            className="flex flex-1 items-center justify-between gap-2 text-left"
                                            title={organization.name}
                                        >
                                            <span
                                                className="w-1/2 truncate text-slate-300 hover:text-white transition-colors">
                                                {organization.name}
                                            </span>
                                        </button>

                                        <div className="flex gap-1 ml-2">
                                            {role === "admin" && (<span>
                                                <button
                                                    onClick={() => prompts.editOrganization(user.id, refresh)}
                                                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-orange-400 transition-colors"
                                                    title="Edit organization"
                                                >
                                                    <Edit size={14}/>
                                                </button>

                                                <button
                                                    onClick={() => prompts.deleteOrganization(organization, user.id, refresh)}
                                                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete organization"
                                                >
                                                    <Trash2 size={14}/>
                                                </button>

                                            </span>
                                            )}

                                            <button
                                                onClick={(e) => onOpenMembersManagerAction?.(organization)}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-green-500 transition-colors"
                                                title="Manage members"
                                            >
                                                <User size={14}/>
                                            </button>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                                role
                                                    ? roleClasses[role as OrganizationRole]
                                                    : "bg-gray-500"
                                            }`}
                                        >
                                            {role ?? "unknown"}
                                        </span>

                                        <button
                                            onClick={() => {
                                                // TODO: handleLeaveOrganization();
                                            }}
                                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                                            title="Leave organization"
                                        >
                                            <ImExit size={14}/>
                                        </button>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            <HocuspocusProviderWebsocketComponent url={`${WS_BASE_URL}/fileTree`}>
                <HocuspocusRoom name={`${selected?.id || user.id}`}>
                    <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                        <FileTree
                            user={user}
                            organization={selected}
                            onSelectFile={onSelectFileAction}
                            selectedFileId={selectedFileId}
                            onCloseCurrentOrganizationFSAction={() => selectOrganization(null)}
                        />
                    </div>
                </HocuspocusRoom>
            </HocuspocusProviderWebsocketComponent>
        </div>
    )
}
