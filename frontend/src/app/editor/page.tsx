'use client'

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {HocuspocusProviderWebsocketComponent, HocuspocusRoom} from "@hocuspocus/provider-react";
import Editor from "./Editor";
import Sidebar from "./Sidebar";
import OrganizationExplorer from "./fileSystem/ui/OrganizationExplorer";
import {HOST, WS_PORT, WS_PROTOCOL} from "../../config/config";
import {user} from "../../store/user";
import {useSelectedFile} from "../../store/selectedFile";

export default function EditorPage() {

    const [isLoading, setIsLoading] = useState(true);
    const [roomName, setRoomName] = useState<string | null>(null);
    const session = useSession();
    const {selectedFileId} = useSelectedFile();

    useEffect(() => {

        switch (session.status) {

            case "unauthenticated":
                console.log("unauthenticated");
                return;
            case "loading":
                console.log("loading");
                return;

            case "authenticated":
                if (session.data)
                    user.load(session.data).then(
                        () => {
                            setIsLoading(false);
                            console.log(user.isLoaded);
                            console.log(user);
                            console.log(`${WS_PROTOCOL}://${HOST}:${WS_PORT}`);
                        },
                    );
            // break;
        }
        console.log(session);
    }, [session, session.status]);


    useEffect(() => {
        setRoomName(selectedFileId);
    }, [selectedFileId]);


    return <>
        {isLoading && (<div className="flex items-center justify-center h-screen">Loading...</div>)}

        {!isLoading && (
            <HocuspocusProviderWebsocketComponent url={`${WS_PROTOCOL}://${HOST}:${WS_PORT}`}>
                <div
                    className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden select-none"
                >
                    <Sidebar
                        // user={user}
                    >
                        <div className="overflow-y-auto flex flex-col">
                            <div className="flex-1">
                                <OrganizationExplorer/>
                            </div>
                        </div>

                    </Sidebar>

                    <main className="flex-1 flex flex-col min-w-0 bg-slate-950">

                        {!roomName && (
                            <div className="p-4 text-sm text-gray-400">Collaborate with ease</div>
                        )}

                        {roomName && (

                            <HocuspocusRoom
                                name={roomName}
                            >
                                <Editor/>
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
        )}
    </>
}