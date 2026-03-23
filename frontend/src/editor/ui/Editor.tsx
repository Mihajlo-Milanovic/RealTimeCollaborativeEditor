'use client';

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {UserView} from "@/core/types/UserView";
import {OrganizationView} from "@/core/types/OrganizationView";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {MembersModal} from "@/filesystem/organization/MembersModal";
import CommentsPanel from "@/filesystem/comments/CommentsPanel";
import {getRequestSingle} from "@/core/api/serverRequests/methods";
import Sidebar from "@/filesystem/Sidebar";
import {X} from "lucide-react";
import OrganizationExplorer from "@/filesystem/organization/OrganizationExplorer";

export default function Editor() {
    const {data: session, status} = useSession();
    const [user, setUser] = useState<UserView | null>(null);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [explorerWidth, setExplorerWidth] = useState(320);
    const [commentsWidth, setCommentsWidth] = useState(384);
    const [isResizingExplorer, setIsResizingExplorer] = useState(false);
    const [isResizingComments, setIsResizingComments] = useState(false);
    const [explorerCollapsed, setExplorerCollapsed] = useState(false);
    const [organizationsRefreshKey, setOrganizationsRefreshKey] = useState(0);
    const [membersModalOrganization, setMembersModalOrganization] = useState<OrganizationView | null>(null);

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.email) return;
        const fetchUser = async () => {
            const res = await getRequestSingle(`users/email/${encodeURIComponent(session.user!.email!)}`);
            if (res.ok) {
                const data = await res.json();
                setUser(data.data);
            }
        };
        fetchUser();
    }, [status, session]);

    const resize = (e: React.MouseEvent) => {
        if (isResizingExplorer) {
            setExplorerWidth(Math.max(200, Math.min(600, e.clientX)));
        }
        if (isResizingComments) {
            const newWidth = window.innerWidth - e.clientX;
            setCommentsWidth(Math.max(250, Math.min(800, newWidth)));
        }
    };

    if (!user) return null;

    return (
        <div
            className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden select-none"
            onMouseMove={resize}
            onMouseUp={() => {
                setIsResizingExplorer(false);
                setIsResizingComments(false);
            }}
        >
            <Sidebar
                user={user}
                collapsed={explorerCollapsed}
                width={explorerWidth}
                onToggleCollapse={() => setExplorerCollapsed(!explorerCollapsed)}
                onResizeStart={() => setIsResizingExplorer(true)}
                showComments={showComments}
                onToggleComments={() => setShowComments(!showComments)}
                selectedFileId={selectedFileId}
            >
                <div className="overflow-y-auto flex flex-col">
                    <div className="flex-1">
                        <OrganizationExplorer
                            user={user}
                            onSelectFileAction={setSelectedFileId}
                            onOpenMembersManagerAction={setMembersModalOrganization}
                            organizationsRefreshKey={organizationsRefreshKey}
                        />
                    </div>
                </div>

            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
                {selectedFileId ? (
                    <SimpleEditor key={selectedFileId} fileId={selectedFileId}/>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        Choose a file for editing
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
                        <h2 className="font-semibold">Comments</h2>
                        <button onClick={() => setShowComments(false)}>
                            <X/>
                        </button>
                    </div>
                    <CommentsPanel
                        fileId={selectedFileId}
                    />
                </aside>
            )}

            {membersModalOrganization && (
                <MembersModal
                    organization={membersModalOrganization}
                    currentUserId={user.id}
                    onClose={() => setMembersModalOrganization(null)}
                    onRefreshOrganizations={() => setOrganizationsRefreshKey(k => k + 1)}
                />
            )}
        </div>
    );
}
