import React from 'react';
import { LogOut, PanelLeftClose, PanelLeftOpen, MessageSquare } from "lucide-react";
import { UserView } from "@/core/types/UserView";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    user: UserView;
    collapsed: boolean;
    width: number;
    onToggleCollapse: () => void;
    onResizeStart: () => void;
    showComments: boolean;
    onToggleComments: () => void;
    selectedFileId: string | null;
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({
    user,
    collapsed,
    width,
    onToggleCollapse,
    onResizeStart,
    showComments,
    onToggleComments,
    selectedFileId,
    children
}) => {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    if (collapsed) {
        return (
            <aside className="w-16 border-r border-slate-800 bg-slate-900/80 flex flex-col items-center py-4 gap-4 shrink-0">
                <button
                    onClick={onToggleCollapse}
                    className="p-2 hover:bg-slate-800 rounded text-slate-400"
                    title="Open Explorer"
                >
                    <PanelLeftOpen size={20} />
                </button>

                <button
                    onClick={onToggleComments}
                    disabled={!selectedFileId}
                    className="p-2 hover:bg-slate-800 rounded text-slate-400 disabled:opacity-40"
                    title="Comments"
                >
                    <MessageSquare size={20} />
                </button>

                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-slate-800 rounded text-red-400"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </aside>
        );
    }

    return (
        <aside 
            style={{ width }}
            className="min-w-sm w-sm border-r border-slate-800 bg-slate-900/50 flex flex-col relative shrink-0"
        >
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-slate-800 rounded text-red-400"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
                <p className="text-sm text-slate-400">{user.username}</p>
                <button
                    onClick={onToggleCollapse}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400"
                >
                    <PanelLeftClose size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {children}
            </div>

            <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                    onClick={onToggleComments}
                    disabled={!selectedFileId}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                >
                    Komentari
                </button>
            </div>

            <div 
                onMouseDown={onResizeStart}
                className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize"
            />
        </aside>
    );
};

export default Sidebar;
