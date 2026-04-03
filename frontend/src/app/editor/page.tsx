'use client'

import Editor from "@/app/editor/Editor";
import {useEffect, useState} from "react";
import {getRequestSingle} from "@/app/api/serverRequests/methods";
import { OrganizationView } from "@/app/core/types/OrganizationView";
import {useSession} from "next-auth/react";
import {UserView} from "@/app/core/types/UserView";
import OrganizationExplorer from "@/app/editor/fileSystem/ui/OrganizationExplorer";
import Sidebar from "@/app/editor/Sidebar";
import CommentsPanel from "@/app/editor/comments/ui/CommentsPanel";
import {OrganizationMembers} from "@/app/editor/fileSystem/ui/OrganizationMembers";
import {X} from "lucide-react";

export default function EditorPage() {

    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [explorerCollapsed, setExplorerCollapsed] = useState(false);
    const [explorerWidth, setExplorerWidth] = useState(320);
    const [isResizingExplorer, setIsResizingExplorer] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentsWidth, setCommentsWidth] = useState(384);
    const [isResizingComments, setIsResizingComments] = useState(false);
    const [organizationsRefreshKey, setOrganizationsRefreshKey] = useState(0);
    const [organizationForMemberList, setOrganizationForMemberList] = useState<OrganizationView | null>(null);

    const {data: session, status} = useSession();
    const [user, setUser] = useState<UserView | null>(null);

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

    if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return <div
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
                        onSelectFileAction={ (fileId: string) =>{
                            if (selectedFileId != fileId)
                                setSelectedFileId(fileId); //Open
                            else
                                setSelectedFileId(null); //Close
                        }}
                        onOpenMembersManagerAction={setOrganizationForMemberList}
                        organizationsRefreshKey={organizationsRefreshKey}
                    />
                </div>
            </div>

        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
            <Editor
                username={user.username}
            selectedFileId={selectedFileId}
            />
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
                    userId={user.id}
                    fileId={selectedFileId}
                />
            </aside>
        )}

        {organizationForMemberList && (
            <OrganizationMembers
                organization={organizationForMemberList}
                currentUserId={user.id}
                onClose={() => setOrganizationForMemberList(null)}
                onRefreshOrganizations={() => setOrganizationsRefreshKey(k => k + 1)}
            />
        )}
    </div>
}