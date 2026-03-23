"use client";

import {useEffect, useRef, useState} from "react";
import {UserView} from "@/core/types/UserView";
import {OrganizationView} from "@/core/types/OrganizationView";
import {FileNode} from "@/core/types/FileNode";
import {filesystemService} from "@/filesystem/services";
import FileItem from "./FileItem";
import OrganizationExplorer from "@/filesystem/organization/OrganizationExplorer";
import {FilePlus, FolderPlus} from "lucide-react";
import {getRequestSingle, postRequest} from "@/core/api/serverRequests/methods";

interface FileTreeProps {
    user: UserView;
    onSelectFile?: (id: string) => void;
    onOpenMembersManager?: (organization: OrganizationView) => void;
    refreshKey?: number;
}

export default function FileTree({
                                     user,
                                     onSelectFile,
                                     onOpenMembersManager,
                                     refreshKey,
                                 }: FileTreeProps) {
    const [root, setRoot] = useState<FileNode | null>(null);
    const [rootItems, setRootItems] = useState<FileNode[]>([]);
    const [workspaceHeightPercent, setWorkspaceHeightPercent] = useState(33);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isResizingRef = useRef(false);

    const fetchRoot = async () => {
        const rootNode = await filesystemService.getRoot(user.id);
        if (rootNode) {
            setRoot(rootNode);
            const children = await filesystemService.getChildren(rootNode.id);
            setRootItems(children);
        }
    };

    useEffect(() => {
        fetchRoot();
    }, [user, refreshKey]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!isResizingRef.current || !containerRef.current) return;
            const bounds = containerRef.current.getBoundingClientRect();
            const relativeY = event.clientY - bounds.top;
            const ratio = (relativeY / bounds.height) * 100;
            const clampedRatio = Math.max(20, Math.min(80, ratio));
            setWorkspaceHeightPercent(clampedRatio);
        };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const fetchRootContents = async (rootId: string) => {
        const res = await getRequestSingle(`directories/${rootId}/children&files`);
        if (!res.ok) return;

        const payload = await res.json();
        const raw = payload?.data ?? payload;
        const data = (Array.isArray(raw) ? raw[0] : raw);
        if (!data) return;

        const folders: FileNode[] = (data.children || []).map((child: FileNode) => ({
            id: child.id,
            name: child.name,
            type: "folder",
        }));

        const files: FileNode[] = (data.files || []).map((file: FileNode) => ({
            id: file.id,
            name: file.name,
            type: "file",
        }));

        setRootItems([...folders, ...files]);
    };

    const handleAddFolderToRoot = async () => {
        if (!root?.id) return;

        const folderName = prompt("Enter folder name:");
        if (!folderName?.trim()) return;

        const ownerId = user.id;
        const res = await postRequest("directories/create", {
            name: folderName.trim(),
            owner: ownerId,
            parents: [root.id],
            children: [],
            files: [],
            collaborators: [],
            organization: null,
        });

        if (res.ok) {
            await fetchRootContents(root.id);
        }
    };

    const handleAddFileToRoot = async () => {
        if (!root?.id) return;

        const fileName = prompt("Enter file name:");
        if (!fileName?.trim()) return;

        const ownerId = user.id;
        const res = await postRequest("files/create", {
            parent: root.id,
            owner: ownerId,
            name: fileName.trim(),
            collaborators: [],
            organization: null,
        });

        if (res.ok) {
            await fetchRootContents(root.id);
        }
    };

    const startResize = () => {
        isResizingRef.current = true;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full">
            <div style={{height: `${workspaceHeightPercent}%`}} className="overflow-y-auto flex flex-col">

                <div className="mb-2 flex items-center justify-between px-1">
                    <div className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Personal Workspace
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleAddFolderToRoot}
                            className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            title="New folder"
                            aria-label="New folder"
                        >
                            <FolderPlus size={14}/>
                        </button>
                        <button
                            onClick={handleAddFileToRoot}
                            className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            title="New file"
                            aria-label="New file"
                        >
                            <FilePlus size={14}/>
                        </button>
                    </div>
                </div>

                {root != null && (<div className="space-y-1">
                        {rootItems.map((item) => (
                            <FileItem
                                // org={new OrganizationView()}
                                user={user}
                                key={item.id}
                                node={item}
                                onSelectFile={onSelectFile}
                                onRefresh={() => fetchRootContents(root.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div
                onMouseDown={startResize}
                className="h-1 bg-slate-800 hover:bg-blue-500/50 cursor-row-resize transition-colors"
            />

            <div style={{height: `${100 - workspaceHeightPercent}%`}} className="overflow-y-auto flex flex-col">
                <div className="flex-1">
                    <OrganizationExplorer
                        user={user}
                        onSelectFile={onSelectFile}
                        onOpenMembersManager={onOpenMembersManager}
                        organizationsRefreshKey={refreshKey}
                    />
                </div>
            </div>
        </div>
    );
}
