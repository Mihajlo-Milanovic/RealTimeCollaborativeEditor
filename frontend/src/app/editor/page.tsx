'use client'

import Editor from "@/app/editor/Editor";
import {useEffect, useState} from "react";
import {getRequestSingle} from "@/app/api/serverRequests/methods";
import {OrganizationView} from "@/models/types/views/OrganizationView";
import {useSession} from "next-auth/react";
import {UserView} from "@/models/types/views/UserView";
import OrganizationExplorer from "@/app/editor/fileSystem/ui/OrganizationExplorer";
import Sidebar from "@/app/editor/Sidebar";
import {OrganizationMembers} from "@/app/editor/fileSystem/ui/OrganizationMembers";
import {X} from "lucide-react";
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom
} from "@hocuspocus/provider-react";
import {HOST, WS_PORT, WS_PROTOCOL} from "@/config/config";

export default function EditorPage() {

    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
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

    if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    console.log(`${WS_PROTOCOL}://${HOST}:${WS_PORT}`);
    return <HocuspocusProviderWebsocketComponent url={`${WS_PROTOCOL}://${HOST}:${WS_PORT}`}>
        <div
            className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden select-none"
        >
            <Sidebar
                user={user}
                selectedFileId={selectedFileId}
            >
                <div className="overflow-y-auto flex flex-col">
                    <div className="flex-1">
                        <OrganizationExplorer
                            user={user}
                            onSelectFileAction={(fileId: string) => {
                                if (selectedFileId != fileId)
                                    setSelectedFileId(fileId); //Open
                                else
                                    setSelectedFileId(null); //Close
                            }}
                            selectedFileId={selectedFileId}
                            onOpenMembersManagerAction={setOrganizationForMemberList}
                            organizationsRefreshKey={organizationsRefreshKey}
                        />
                    </div>
                </div>

            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0 bg-slate-950">


                {!selectedFileId && (
                    <div className="p-4 text-sm text-gray-400">Collaborate with ease</div>
                )}

                {selectedFileId && (<HocuspocusRoom name={selectedFileId}>
                        <Editor
                            username={user.username}
                            selectedFileId={selectedFileId}
                        />
                    </HocuspocusRoom>
                )}

            </main>

            {/*{showComments && selectedFileId && (*/}
            {/*    <aside*/}
            {/*        style={{width: commentsWidth}}*/}
            {/*        className="border-l border-slate-800 bg-slate-900/50 flex flex-col relative shrink-0"*/}
            {/*    >*/}
            {/*        <div*/}
            {/*            onMouseDown={() => setIsResizingComments(true)}*/}
            {/*            className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize"*/}
            {/*        />*/}
            {/*        <div className="p-4 border-b border-slate-800 flex justify-between">*/}
            {/*            <h2 className="font-semibold">Comments</h2>*/}
            {/*            <button onClick={() => setShowComments(false)}>*/}
            {/*                <X/>*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*        <CommentsPanel*/}
            {/*            userId={user.id}*/}
            {/*            fileId={selectedFileId}*/}
            {/*        />*/}
            {/*    </aside>*/}
            {/*)}*/}

            {organizationForMemberList && (
                <OrganizationMembers
                    organization={organizationForMemberList}
                    currentUserId={user.id}
                    onClose={() => setOrganizationForMemberList(null)}
                    onRefreshOrganizations={() => setOrganizationsRefreshKey(k => k + 1)}
                />
            )}
        </div>
    </HocuspocusProviderWebsocketComponent>
}