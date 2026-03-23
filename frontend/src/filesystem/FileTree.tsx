"use client";

import {useEffect, useRef, useState} from "react";
import {FileNode} from "@/core/types/FileNode";
import {fsService} from "@/filesystem/services/fsService";
import {FilePlus, FolderPlus, X} from "lucide-react";
import {TFileTree} from "@/core/types/elementTypes/TFileTree";
import FileItem from "@/filesystem/FileItem";
import {OrganizationView} from "@/core/types/OrganizationView";

export default function FileTree(
    {
        user,
        organization,
        onSelectFile,
        refreshKey,
    }: TFileTree
) {

    const [org, setOrg] = useState<OrganizationView | null>(organization);
    const [root, setRoot] = useState<FileNode | null>(null);
    const [rootItems, setRootItems] = useState<FileNode[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setOrg(organization);
    }, [organization]);

    useEffect(() => {
        fetchRoot();
    }, [user, refreshKey, org]);

    useEffect(() => {
        if ( !root ) return;
        fetchRootContents(root.id);
    }, [root]);

    const fetchRoot = async () => {
        if (org) {
            setRoot({
                ...org,
                isDirectory: true,
            });
        }
        else{
            setRoot(user.rootDir)
        }
    };

    // useEffect(() => {
    //     const handleMouseMove = (event: MouseEvent) => {
    //         if (!isResizingRef.current || !containerRef.current) return;
    //         const bounds = containerRef.current.getBoundingClientRect();
    //         const relativeY = event.clientY - bounds.top;
    //         const ratio = (relativeY / bounds.height) * 100;
    //         const clampedRatio = Math.max(20, Math.min(80, ratio));
    //         setWorkspaceHeightPercent(clampedRatio);
    //     };
    //
    //     const handleMouseUp = () => {
    //         isResizingRef.current = false;
    //         document.body.style.cursor = "";
    //         document.body.style.userSelect = "";
    //     };
    //
    //     window.addEventListener("mousemove", handleMouseMove);
    //     window.addEventListener("mouseup", handleMouseUp);
    //     return () => {
    //         window.removeEventListener("mousemove", handleMouseMove);
    //         window.removeEventListener("mouseup", handleMouseUp);
    //     };
    // }, []);

    const fetchRootContents = async (nodeId: string) => {

        if (org)
            setRootItems( await fsService.getChildrenForOrganization(org.id) );
        else
            setRootItems( await fsService.getChildrenForDirectory(nodeId) );
    };

    // const handleAddFolderToRoot = async () => {
    //     if (!root?.id) return;
    //
    //     const folderName = prompt("Enter folder name:");
    //     if (!folderName?.trim()) return;
    //
    //     const ownerId = user.id;
    //     const res = await postRequest("directories/create", {
    //         name: folderName.trim(),
    //         owner: ownerId,
    //         parents: [root.id],
    //         children: [],
    //         files: [],
    //         collaborators: [],
    //         organization: null,
    //     });
    //
    //     if (res.ok) {
    //         await fetchRootContents(root.id);
    //     }
    // };

    // const handleAddFileToRoot = async () => {
    //     if (!root?.id) return;
    //
    //     const fileName = prompt("Enter file name:");
    //     if (!fileName?.trim()) return;
    //
    //     const ownerId = user.id;
    //     const res = await postRequest("files/create", {
    //         parent: root.id,
    //         owner: ownerId,
    //         name: fileName.trim(),
    //         collaborators: [],
    //         organization: null,
    //     });
    //
    //     if (res.ok) {
    //         await fetchRootContents(root.id);
    //     }
    // };

    // const startResize = () => {
    //     isResizingRef.current = true;
    //     document.body.style.cursor = "row-resize";
    //     document.body.style.userSelect = "none";
    // };

    return (
        <div ref={containerRef} className="flex flex-col h-full">
            <div className="overflow-y-auto flex flex-col">

                {org ?
                    (<div className="mb-2 flex items-center justify-between px-1">
                        <div className="text-sm font-semibold text-slate-500 tracking-wider">
                            {org.name}
                        </div>
                        <div className="flex items-center gap-1">
                            {org.members.get(user.id) != "viewer" && (
                                <button
                                    onClick={ () => {}}
                                    className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    title="New folder"
                                    aria-label="New folder"
                                >
                                    <FolderPlus size={14}/>
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setOrg(null);
                                }}
                                className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                title="Close organization explorer"
                                aria-label="Close organization explorer"
                            >
                                <X size={14}/>
                            </button>
                        </div>
                    </div>)
                    :
                    (<div className="mb-2 flex items-center justify-between px-1">
                            <div className="text-sm font-semibold text-slate-500 tracking-wider">
                                Personal Workspace
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={ () => {/*TODO: ADD FOLDER TO ROOT*/}}
                                    className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    title="New folder"
                                    aria-label="New folder"
                                >
                                    <FolderPlus size={14}/>
                                </button>

                                <button
                                    onClick={ () => {}}
                                    className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    title="New file"
                                    aria-label="New file"
                                >
                                    <FilePlus size={14}/>
                                </button>
                            </div>
                        </div>
                    )}

                {root != null && (<div className="space-y-1">
                        {rootItems.map((item) => (
                            <FileItem
                                organization={org}
                                user={user}
                                key={item.id}
                                node={item}
                                onSelectFile={onSelectFile}
                                onRefreshAction={
                                    () => {}
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
