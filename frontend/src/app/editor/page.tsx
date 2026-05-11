'use client'

import Editor from "@/app/editor/Editor";
import {OrganizationView} from "@/models/types/views/OrganizationView";
import OrganizationExplorer from "@/app/editor/fileSystem/ui/OrganizationExplorer";
import Sidebar from "@/app/editor/Sidebar";
import {
    HocuspocusProviderWebsocketComponent,
    HocuspocusRoom
} from "@hocuspocus/provider-react";
import {HOST, WS_PORT, WS_PROTOCOL} from "@/config/config";
import {user} from "@/store/user"
import {User} from "lucide-react";
import {session} from "next-auth/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/authOptions";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

export default function EditorPage() {

    const session = useSession();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session.data)
             user.load(session.data).then(
                 () => {
                     setIsLoading(user.isLoaded)
                     console.log(user.isLoaded);
                     console.log(user);
                 },
                 // () => setIsLoading(false)
             );
    });

    // console.log(user.isLoaded);
    // console.log(user);

    if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    console.log(`${WS_PROTOCOL}://${HOST}:${WS_PORT}`);

    return <HocuspocusProviderWebsocketComponent url={`${WS_PROTOCOL}://${HOST}:${WS_PORT}`}>
        <div
            className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden select-none"
        >
            <Sidebar
                // user={user}
            >
                <div className="overflow-y-auto flex flex-col">
                    <div className="flex-1">
                        <OrganizationExplorer
                            userId={user.id}
                            // onOpenMembersManagerAction={setOrganizationForMemberList}
                            // organizationsRefreshKey={organizationsRefreshKey}
                        />
                    </div>
                </div>

            </Sidebar>

            <main className="flex-1 flex flex-col min-w-0 bg-slate-950">

                <Editor
                    username={user.username}
                />
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

            {/*{organizationForMemberList && (*/}
            {/*    <OrganizationMembers*/}
            {/*        organization={organizationForMemberList}*/}
            {/*        currentUserId={user.id}*/}
            {/*        onClose={() => setOrganizationForMemberList(null)}*/}
            {/*        onRefreshOrganizations={() => setOrganizationsRefreshKey(k => k + 1)}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    </HocuspocusProviderWebsocketComponent>
}