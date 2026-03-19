// app/EditorPage.tsx
'use client';

import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import FileExplorer from "./file-explorer/FileExplorer";
import CommentsPanel from "@/features/comments/ui/CommentsPanel";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {UserView} from "@/models/UserView";
import {useCallback, useEffect, useState} from "react";
import {getRequestSingle, putRequest} from "@/app/api/serverRequests/methods";
import {OrganizationView} from "@/models/OrganizationView";
import {MessageSquare, LogOut, PanelLeftClose, PanelLeftOpen, X, Plus, UserPlus} from "lucide-react";

type OrganizationRole = "admin" | "editor" | "viewer";

type OrganizationMember = UserView & {
    role: OrganizationRole;
};

const roleClasses: Record<OrganizationRole, string> = {
    admin: "text-red-300 bg-red-500/10 border-red-500/30",
    editor: "text-blue-300 bg-blue-500/10 border-blue-500/30",
    viewer: "text-slate-300 bg-slate-500/10 border-slate-500/30",
};

export default function EditorPage() {
    const {data: session, status} = useSession();
    const router = useRouter();

    const [user, updateUser] = useState<UserView | null>(null);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [explorerWidth, setExplorerWidth] = useState(320);
    const [commentsWidth, setCommentsWidth] = useState(384);
    const [isResizingExplorer, setIsResizingExplorer] = useState(false);
    const [isResizingComments, setIsResizingComments] = useState(false);
    const [explorerCollapsed, setExplorerCollapsed] = useState(false);

    const [organizationsRefreshKey, setOrganizationsRefreshKey] = useState(0);
    const [membersModalOrganization, setMembersModalOrganization] = useState<OrganizationView | null>(null);
    const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const [memberForRoleChange, setMemberForRoleChange] = useState<OrganizationMember | null>(null);
    const [selectedRole, setSelectedRole] = useState<OrganizationRole>("viewer");
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [newMemberUsername, setNewMemberUsername] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<OrganizationRole>("viewer");

    useEffect(() => {
        if (status !== "authenticated") return;

        const fetchUser = async () => {
            if (!session?.user?.email) return;
            const u = await UserView.getUserByEmail(session.user.email);
            updateUser(u);
        };

        fetchUser();
    }, [status, session]);

    const loadOrganizationMembers = useCallback(async (org: OrganizationView) => {
        const orgDetailsRes = await getRequestSingle(`organizations/${org.id}`);
        if (orgDetailsRes.ok) {

            const orgDetailsPayload = await orgDetailsRes.json();
            const orgDetails = (orgDetailsPayload?.data ?? null) as OrganizationView | null;

            if (orgDetails) {

                let orgMemMap: Map<string, OrganizationRole>;

                if (orgDetails.members instanceof Map) {
                    orgMemMap = orgDetails.members as Map<string, OrganizationRole>;
                } else if (orgDetails.members) {
                    orgMemMap = new Map(Object.entries(orgDetails.members));
                } else {
                    orgMemMap = new Map();
                }

                if (orgMemMap.size) {

                    const params = new URLSearchParams();
                    orgMemMap.keys().forEach(id => params.append('userIds', id.toString()));

                    const urlWithParams = `users/?${params.toString()}`;

                    const userRes = await getRequestSingle(urlWithParams);
                    if (userRes.ok) {

                        const payload = await userRes.json();
                        const users = payload?.data as UserView[] | null;
                        if (users) {
                            const members = users.map(u=> {
                                return {...u, role: orgMemMap.get(u.id) || "viewer"} as OrganizationMember;
                            });
                            members.sort((a, b) => a.username.localeCompare(b.username));
                            setOrganizationMembers([...members]);
                            return;
                        }
                    }
                }
            }
        }
        setOrganizationMembers([]);
        return;
    }, []);

    const openMembersModal = async (org: OrganizationView) => {
        setMembersModalOrganization(org);
        setIsMembersLoading(true);
        await loadOrganizationMembers(org);
        setIsMembersLoading(false);
    };

    const closeMembersModal = () => {
        setMembersModalOrganization(null);
        setOrganizationMembers([]);
        setMemberForRoleChange(null);
        setIsAddMemberDialogOpen(false);
        setNewMemberUsername("");
        setNewMemberRole("viewer");
    };

    const handleChangeMemberRole = async () => {
        if (!membersModalOrganization || !memberForRoleChange || !user?.id) return;

        const res = await putRequest(
            `organizations/${membersModalOrganization.id}/addMembers`,
            {
                members: [
                    {
                        userId: memberForRoleChange.id,
                        role: selectedRole,
                    },
                ],
            }
        );

        if (!res.ok) {
            alert("Could not update role.");
            return;
        }

        await loadOrganizationMembers(membersModalOrganization);
        setOrganizationsRefreshKey((prev) => prev + 1);
        setMemberForRoleChange(null);
    };

    const handleRemoveMember = async (member: OrganizationMember) => {
        if (!membersModalOrganization || !user?.id) return;

        const confirmed = confirm(`Remove ${member.username} from ${membersModalOrganization.name}?`);
        if (!confirmed) return;

        const res = await putRequest(
            `organizations/${membersModalOrganization.id}/removeMembers`,
            {
                members: [member.id],
                applicantId: user.id,
            }
        );

        if (!res.ok) {
            alert("Could not remove member.");
            return;
        }

        await loadOrganizationMembers(membersModalOrganization);
        setOrganizationsRefreshKey((prev) => prev + 1);
    };

    const handleAddMemberFromDialog = async () => {
        if (!membersModalOrganization || !user?.id) return;

        const username = newMemberUsername.trim();
        if (!username) {
            alert("Username is required.");
            return;
        }

        const res = await putRequest(
            `organizations/${membersModalOrganization.id}/addMembersByUsername`,
            {
                members: [
                    {
                        username,
                        role: newMemberRole,
                    },
                ],
            }
        );

        if (!res.ok) {
            alert("Could not add member.");
            return;
        }

        setNewMemberUsername("");
        setNewMemberRole("viewer");
        setIsAddMemberDialogOpen(false);
        await loadOrganizationMembers(membersModalOrganization);
        setOrganizationsRefreshKey((prev) => prev + 1);
    };

    const handleLogout = async (): Promise<void> => {
        updateUser(null);
        await signOut({redirect: false});
        router.push("/");
    };

    const resize = (e: React.MouseEvent) => {
        if (isResizingExplorer) {
            setExplorerWidth(Math.max(200, Math.min(600, e.clientX)));
        }
        if (isResizingComments) {
            const newWidth = window.innerWidth - e.clientX;
            setCommentsWidth(Math.max(250, Math.min(800, newWidth)));
        }
    };

    return (user != null) && (
        <div
            className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden select-none"
            onMouseMove={resize}
            onMouseUp={() => {
                setIsResizingExplorer(false);
                setIsResizingComments(false);
            }}
        >
            {!explorerCollapsed ? (
                <aside
                    style={{width: explorerWidth}}
                    className="border-r border-slate-800 bg-slate-900/50 flex flex-col relative shrink-0"
                >
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-slate-800 rounded text-red-400"
                            title="Logout"
                        >
                            <LogOut size={20}/>
                        </button>
                        <p className="text-sm text-slate-400">${user?.username || ""}</p>
                        <button
                            onClick={() => setExplorerCollapsed(true)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400"
                        >
                            <PanelLeftClose size={18}/>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <FileExplorer
                            user={user}
                            onSelectFile={setSelectedFileId}
                            onOpenMembersManager={(organization) => {
                                void openMembersModal(organization);
                            }}
                            organizationsRefreshKey={organizationsRefreshKey}
                        />
                    </div>

                    <div className="p-4 border-t border-slate-800 space-y-2">
                        <button
                            onClick={() => setShowComments((p) => !p)}
                            disabled={!selectedFileId}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                        >
                            Komentari
                        </button>
                    </div>

                    <div
                        onMouseDown={() => setIsResizingExplorer(true)}
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize"
                    />
                </aside>
            ) : (
                <aside className="w-16 border-r border-slate-800 bg-slate-900/80 flex flex-col items-center py-4 gap-4 shrink-0">
                    <button
                        onClick={() => setExplorerCollapsed(false)}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400"
                        title="Open Explorer"
                    >
                        <PanelLeftOpen size={20}/>
                    </button>

                    <button
                        onClick={() => setShowComments((p) => !p)}
                        disabled={!selectedFileId}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-40"
                        title="Comments"
                    >
                        <MessageSquare size={20}/>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-slate-800 rounded text-red-400"
                        title="Logout"
                    >
                        <LogOut size={20}/>
                    </button>
                </aside>
            )}

            <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
                {selectedFileId ? (
                    <SimpleEditor key={selectedFileId} fileId={selectedFileId}/>
                ) : (
                    <div className="flex-2 flex items-center justify-center text-slate-500">
                        Izaberite fajl za uređivanje
                    </div>
                )}

                {membersModalOrganization && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <div className="w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-100">{membersModalOrganization.name}</h3>
                                    {/*<p className="text-xs text-slate-400"></p>*/}
                                </div>

                                <div>
                                    <button
                                        onClick={() => setIsAddMemberDialogOpen(true)}
                                        className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                        title="Add member"
                                    >
                                        <UserPlus size={16}/>
                                    </button>

                                    <button
                                        onClick={closeMembersModal}
                                        className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                        title="Close members window"
                                    >
                                        <X size={16}/>
                                    </button>
                                </div>
                            </div>

                            {isMembersLoading ? (
                                <div className="text-xs text-slate-400">Loading members...</div>
                            ) : organizationMembers.length === 0 ? (
                                <div className="text-xs text-slate-400">No members found.</div>
                            ) : (
                                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                                    {organizationMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2"
                                        >
                                            <div className="min-w-0">
                                                <div className="truncate text-sm text-slate-200">{member.username}</div>
                                                <div className="text-[11px] text-slate-500">{member.id}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${roleClasses[member.role]}`}
                                            >
                                                {member.role}
                                            </span>
                                                <button
                                                    onClick={() => {
                                                        setMemberForRoleChange(member);
                                                        setSelectedRole(member.role);
                                                    }}
                                                    className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                                                >
                                                    Change role
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        void handleRemoveMember(member);
                                                    }}
                                                    className="rounded-md border border-red-900/60 px-2 py-1 text-xs text-red-300 hover:bg-red-950/60 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {membersModalOrganization && memberForRoleChange && (
                            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
                                <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-4">
                                    <h4 className="text-sm font-semibold text-slate-100 mb-1">Change Role</h4>
                                    <p className="text-xs text-slate-400 mb-3">{memberForRoleChange.username}</p>
                                    <div className="space-y-2">
                                        {(["admin", "editor", "viewer"] as OrganizationRole[]).map((roleOption) => (
                                            <label key={roleOption} className="flex items-center gap-2 text-sm text-slate-200">
                                                <input
                                                    type="radio"
                                                    name="member-role"
                                                    value={roleOption}
                                                    checked={selectedRole === roleOption}
                                                    onChange={() => setSelectedRole(roleOption)}
                                                />
                                                <span className="capitalize">{roleOption}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => setMemberForRoleChange(null)}
                                            className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                void handleChangeMemberRole();
                                            }}
                                            className="rounded-md border border-slate-500 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-700 transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </main>

            {showComments && selectedFileId && (
                <aside
                    style={{width: commentsWidth}}
                    className="border-l border-slate-800 bg-slate-900/50 flex flex-col relative shrink-0"
                >
                    <div
                        onMouseDown={() => setIsResizingComments(true)}
                        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize"
                    />

                    <div className="p-4 border-b border-slate-800 flex justify-between">
                        <h2 className="font-semibold">Komentari</h2>
                        <button onClick={() => setShowComments(false)}>✕</button>
                    </div>

                    <CommentsPanel fileId={selectedFileId}/>
                </aside>
            )}

            {/*{Add member dialog}*/}
            {membersModalOrganization && isAddMemberDialogOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-4">
                        <h4 className="text-sm font-semibold text-slate-100 mb-3">Add Member</h4>
                        <label className="mb-3 block">
                            <span className="mb-1 block text-xs text-slate-400">Username</span>
                            <input
                                type="text"
                                value={newMemberUsername}
                                onChange={(e) => setNewMemberUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
                            />
                        </label>

                        <div className="space-y-2">
                            <div className="text-xs text-slate-400">Role</div>
                            {(["admin", "editor", "viewer"] as OrganizationRole[]).map((roleOption) => (
                                <label key={roleOption} className="flex items-center gap-2 text-sm text-slate-200">
                                    <input
                                        type="radio"
                                        name="new-member-role"
                                        value={roleOption}
                                        checked={newMemberRole === roleOption}
                                        onChange={() => setNewMemberRole(roleOption)}
                                    />
                                    <span className="capitalize">{roleOption}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsAddMemberDialogOpen(false);
                                    setNewMemberUsername("");
                                    setNewMemberRole("viewer");
                                }}
                                className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    void handleAddMemberFromDialog();
                                }}
                                className="rounded-md border border-slate-500 bg-slate-800 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
