"use client";

import React, {useState} from "react";
import {Folder, FolderOpen, FileText, Trash2, FolderPlus, FilePlus} from "lucide-react";
import {TFileItem} from "@/core/types/elementTypes/TFileItem";
import {useFetchChildren} from "@/hooks/useFetchChildren";
import {prompts} from "@/filesystem/services/prompts";


export default function FileItem(
    {
        organization,
        user,
        node,
        onSelectFile,
        onRefreshAction,
    }: TFileItem
) {

    const [isOpen, setIsOpen] = useState(false);
    
    const [canEdit] = useState(organization == null || (organization.members.get(user.id) || "viewer") != "viewer");
    const [showCreate] = useState(canEdit && node.isDirectory);

    const {
        items,
        isLoading,
        refresh
    } = useFetchChildren(node.id)

    const handleOpenFolder = async () => {
        if (node.isDirectory) {
            if (!isOpen) {
                refresh()
            }
            setIsOpen(!isOpen);
        } else {
            onSelectFile?.(node.id);
        }
    };

    return (
        <div className="flex flex-col">
            <div
                className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors group ${
                    node.isDirectory ? "hover:bg-slate-800" : "hover:bg-blue-500/10"
                }`}
            >
                <div
                    className="flex flex-1 items-center gap-2.5 min-w-0"
                    onClick={handleOpenFolder}
                >
                    <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
                        {node.isDirectory ? (
                            isOpen ? (
                                <FolderOpen
                                    size={16}
                                    fill="currentColor"
                                    className="fill-blue-500/20"
                                />
                            ) : (
                                <Folder
                                    size={16}
                                    fill="currentColor"
                                    className="fill-slate-500/20"
                                />
                            )
                        ) : (
                            <FileText size={16}/>
                        )}
                    </div>

                    <span
                        className="truncate text-slate-300 group-hover:text-white transition-colors"
                        title={node.name}
                    >
                        {node.name}
                    </span>
                </div>

                <div
                    className={`flex gap-1.5 transition-opacity ${ isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100" }`}
                >
                    {canEdit && (
                        <button
                            onClick={() => prompts.deleteFileNode(node, onRefreshAction)}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={14}/>
                        </button>
                    )}

                    {showCreate && (
                        <button
                            onClick={() => prompts.addFolderToFileNode(node, user.id, refresh)}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-green-400 transition-colors"
                            title="New Folder"
                        >
                            <FolderPlus size={14}/>
                        </button>
                    )}
                    {canEdit && node.isDirectory && (
                        <button
                            onClick={() => prompts.addFileToFileNode(node, user.id, refresh)}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors"
                            title="New File"
                        >
                            <FilePlus size={14}/>
                        </button>
                    )}
                </div>
            </div>

            {isOpen && items && (
                <div className="pl-4 border-l border-slate-800 ml-4">
                    {items.map(item => (
                        <FileItem
                            organization={organization}
                            key={item.id}
                            node={item}
                            user={user}
                            onSelectFile={onSelectFile}
                            onRefreshAction={refresh}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
