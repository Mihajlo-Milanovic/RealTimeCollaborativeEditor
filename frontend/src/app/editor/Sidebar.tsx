'use client'

import React, {useState} from 'react';
import {LogOut, PanelLeftClose, PanelLeftOpen, MessageSquare} from "lucide-react";
import {UserView} from "../../models/types/views/UserView";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useSelectedFile} from "../../store/selectedFile";
import {user} from "../../store/user"

interface SidebarProps {
    // user: UserView;
    // selectedFileId: string | null;
    children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = (
    {
        children
    }
) => {

    const [explorerCollapsed, setExplorerCollapsed] = useState(false);
    const [explorerWidth, setExplorerWidth] = useState(320);
    const [isResizingExplorer, setIsResizingExplorer] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentsWidth, setCommentsWidth] = useState(384);
    const [isResizingComments, setIsResizingComments] = useState(false);

    const {selectedFileId} = useSelectedFile();

    const resize = (e: React.MouseEvent) => {
        if (isResizingExplorer) {
            setExplorerWidth(Math.max(200, Math.min(600, e.clientX)));
        }
        if (isResizingComments) {
            const newWidth = window.innerWidth - e.clientX;
            setCommentsWidth(Math.max(250, Math.min(800, newWidth)));
        }
    };

    const router = useRouter();

    const handleLogout = async () => {
        await signOut({redirect: false});
        user.reset()
        router.replace("/login");
    };

    return (<>
        {/*// <div className={"border-r flex"}*/}
        {/*//         style={{width: explorerWidth}}*/}
        {/*// onMouseMove={resize}*/}
        {/*// onMouseUp={() => {*/}
        {/*//     setIsResizingExplorer(false);*/}
        {/*//     setIsResizingComments(false);*/}
        {/*// }}>*/}
        {explorerCollapsed && (<aside
                className="w-16 border-r border-slate-800 bg-slate-900/80 flex flex-col items-center py-4 gap-4 shrink-0"
            >
                <button
                    onClick={() => setExplorerCollapsed(!explorerCollapsed)}
                    className="p-2 hover:bg-slate-800 rounded text-slate-400"
                    title="Open Explorer"
                >
                    <PanelLeftOpen size={20}/>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
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


        {!explorerCollapsed && (<aside
                style={{width: explorerWidth}}
                className="min-w-sm w-sm border-r border-slate-800 bg-slate-900/50 flex flex-col relative shrink-0"
            >
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-slate-800 rounded text-red-400"
                        title="Logout"
                    >
                        <LogOut size={20}/>
                    </button>
                    <p className="text-sm text-slate-400">{user.username}</p>
                    <button
                        onClick={() => setExplorerCollapsed(!explorerCollapsed)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400"
                    >
                        <PanelLeftClose size={18}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        disabled={!selectedFileId}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                    >
                        Comments
                    </button>
                </div>

                <div
                    onMouseDown={() => setIsResizingExplorer(true)}
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize"
                />
            </aside>
        )}
    {/*</div>*/}
        </>
    )
}

export default Sidebar;
