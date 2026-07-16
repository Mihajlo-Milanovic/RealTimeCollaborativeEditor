'use client'

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {HocuspocusProviderWebsocketComponent, HocuspocusRoom} from "@hocuspocus/provider-react";
import {X} from "lucide-react";
import Editor from "./Editor";
import Sidebar from "./Sidebar";
import OrganizationExplorer from "./fileSystem/ui/OrganizationExplorer";
import CommentsPanel from "./comments/ui/CommentsPanel";
import {useCommentsResize} from "./comments/hooks/useCommentsResize";
import {HOST, WS_PORT, WS_PROTOCOL} from "../../config/config";
import {user} from "../../store/user";
import {useSelectedFile} from "../../store/selectedFile";
import {useFileSystemMap} from "./fileSystem/state/useFileSystemMap";

export default function EditorPage() {

    const [isLoading, setIsLoading] = useState(true);
    // const [roomName, setRoomName] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);
    const session = useSession();
    const {selectedFileId} = useSelectedFile();

    // sva logika za promenu širine panela je izdvojena u hook
    const {width: commentsWidth, startResize} = useCommentsResize();
    const {currentFile} = useFileSystemMap(selectedFileId ?? "");

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


    // useEffect(() => {
    //     console.log(currentFile)
    //    setRoomName(currentFile)
    // }, [currentFile]);


    return <>
        {isLoading && (<div className="flex items-center justify-center h-screen">Loading...</div>)}

        {!isLoading && (
            <HocuspocusProviderWebsocketComponent url={`${WS_PROTOCOL}://${HOST}:${WS_PORT}`}>
                <div
                    className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden select-none"
                >
                    <Sidebar
                        showComments={showComments}
                        onToggleComments={() => setShowComments((prev) => !prev)}
                    >
                        <div className="overflow-y-auto flex flex-col">
                            <div className="flex-1">
                                <OrganizationExplorer/>
                            </div>
                        </div>

                    </Sidebar>

                    {!currentFile && (
                        <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
                            <div className="p-4 text-sm text-gray-400">Collaborate with ease</div>
                        </main>
                    )}

                    {/* Editor i panel sa komentarima dele ISTU HocuspocusRoom (isti
                        provider.document), pa komentari koriste isti realtime sync
                        kao file system. HocuspocusRoom ne dodaje DOM wrapper, pa
                        <main> i <aside> ostaju flex susedi i layout je netaknut. */}
                    {currentFile && (
                        <HocuspocusRoom
                            name={currentFile}
                        >
                            <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
                                <Editor/>
                            </main>

                            {showComments && selectedFileId && (
                                <aside
                                    style={{width: commentsWidth}}
                                    className="border-l border-slate-800 bg-slate-900/50 flex flex-col relative shrink-0"
                                >
                                    <div
                                        onMouseDown={startResize}
                                        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50"
                                    />
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                        <h2 className="font-semibold">Comments</h2>
                                        <button
                                            onClick={() => setShowComments(false)}
                                            className="p-1 hover:bg-slate-800 rounded text-slate-400"
                                            title="Close comments"
                                        >
                                            <X size={18}/>
                                        </button>
                                    </div>
                                    <CommentsPanel
                                        userId={user.id}
                                        fileId={selectedFileId}
                                    />
                                </aside>
                            )}
                        </HocuspocusRoom>
                    )}

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