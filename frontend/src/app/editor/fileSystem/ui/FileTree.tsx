"use client";

import {useRef} from "react";
import {FilePlus, FolderPlus, X} from "lucide-react";
import {TFileTree} from "@/models/elementTypes/TFileTree";
import FileItem from "@/app/editor/fileSystem/ui/FileItem";
import {useFileTree} from "@/app/editor/fileSystem/state/useFileTree";
import {prompts} from "@/app/editor/fileSystem/services/prompts";

export default function FileTree(
    {
        user,
        organization,
        onSelectFile,
        onCloseCurrentOrganizationFSAction
    }: TFileTree
) {

    const {
        root,
        items,
        isLoading,
        refresh
    } = useFileTree(user.id, organization)

    const containerRef = useRef<HTMLDivElement | null>(null);

    // if (isLoading) return <div>Loading...</div>

    return (
        <div ref={containerRef} className="flex flex-col h-full">
            <div className="overflow-y-auto flex flex-col">

                {organization ?
                    (<div className="mb-2 flex items-center justify-between px-1">
                        <div className="text-sm font-semibold text-slate-500">
                            {organization.name}
                        </div>

                        {isLoading && (<span
                                className="text-xs font-semibold text-slate-800 tracking-wider"
                                title="Loading..."
                            >
                                Loading...
                            </span>
                        )}

                        <div className="flex items-center gap-1">
                            {organization.members.get(user.id) != "viewer" && ( <span>

                                    <button
                                        onClick={() => {
                                            if (root)
                                                prompts.addFolderToFileNode(root, user.id, refresh, true)
                                        }}
                                        className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                        title="New folder"
                                        aria-label="New folder"
                                    >
                                        <FolderPlus size={14}/>
                                    </button>

                                     {/*<button*/}
                                     {/*    onClick={(e) => {*/}
                                     {/*        console.log("ADD PROJECTIONS :::: NO IMPLEMENTATION");*/}
                                     {/*    }}*/}
                                     {/*    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400 transition-colors"*/}
                                     {/*    title="Add projection from personal folders"*/}
                                     {/*>*/}
                                     {/*    <Folder />*/}
                                     {/*</button>*/}
                                </span>
                            )}
                            <button
                                onClick={() => onCloseCurrentOrganizationFSAction() }
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
                            <div className="text-sm font-semibold text-slate-500">
                                Personal Workspace
                            </div>

                            {isLoading && (<span
                                    className="text-xs font-semibold text-slate-800 tracking-wider"
                                    title="Loading..."
                                >
                                Loading...
                            </span>
                            )}

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => {
                                        if (root)
                                            prompts.addFolderToFileNode(root, user.id, refresh)
                                    }}
                                    className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    title="New folder"
                                    aria-label="New folder"
                                >
                                    <FolderPlus size={14}/>
                                </button>

                                <button
                                    onClick={() => {
                                        if (root)
                                            prompts.addFileToFileNode(root, user.id, refresh)
                                    }}
                                    className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                    title="New file"
                                    aria-label="New file"
                                >
                                    <FilePlus size={14}/>
                                </button>
                            </div>
                        </div>
                    )}

                {root && (<div className="space-y-1">
                        {items.map((item) => (
                            <FileItem
                                organization={organization}
                                user={user}
                                key={item.id}
                                node={item}
                                onSelectFile={onSelectFile}
                                onRefreshAction={refresh}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
