'use client'

import React, {useState} from 'react';
import {LogOut, PanelLeftClose, PanelLeftOpen, MessageSquare} from "lucide-react";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useSelectedFile} from "../../store/selectedFile";
import {user} from "../../store/user"
import {useCommentsResize} from "./comments/hooks/useCommentsResize";

interface SidebarProps {
    // user: UserView;
    // selectedFileId: string | null;
    children: React.ReactNode;
    showComments: boolean;
    onToggleComments: () => void;
}

export const Sidebar: React.FC<SidebarProps> = (
    {
        children,
        showComments,
        onToggleComments
    }
) => {

    const [explorerCollapsed, setExplorerCollapsed] = useState(false);

    const {selectedFileId} = useSelectedFile();

    // isti hook kao za panel sa komentarima, samo prikačen uz levu ivicu
    const {width: explorerWidth, startResize: startExplorerResize} = useCommentsResize({
        initialWidth: 320,
        minWidth: 200,
        maxWidth: 600,
        side: "left",
    });

    const router = useRouter();

    const handleLogout = async () => {
        await signOut({redirect: false});
        user.reset()
        router.replace("/login");
    };

    return (<>
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
                    onClick={onToggleComments}
                    disabled={!selectedFileId}
                    className={`p-2 hover:bg-slate-800 rounded disabled:opacity-40 ${showComments ? "text-blue-400" : "text-slate-400"}`}
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
                        onClick={onToggleComments}
                        disabled={!selectedFileId}
                        className={`w-full px-3 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 ${showComments ? "bg-blue-600" : "bg-slate-800"}`}
                    >
                        Comments
                    </button>
                </div>

                <div
                    onMouseDown={startExplorerResize}
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50"
                />
            </aside>
        )}
        </>
    )
}

export default Sidebar;
