"use client";

import React, {useState} from "react";
import {Folder, FolderOpen, FileText, Trash2, FolderPlus, FilePlus} from "lucide-react";
import {FileNode} from "@/core/types/FileNode";
import {fsService} from "@/filesystem/services/fsService";
import {TFileItem} from "@/core/types/elementTypes/TFileItem";


export default function FileItem(
    {
        organization,
        user,
        node,
        onSelectFile,
        onRefreshAction
    }: TFileItem
) {

    const [isOpen, setIsOpen] = useState(false);
    const [children, setChildren] = useState<FileNode[]>([]);

    const handleOpenFolder = async () => {
        if (node.isDirectory) {
            if (!isOpen) {
                onRefreshAction(node.id, setChildren);
            }
            setIsOpen(!isOpen);
        } else {
            onSelectFile?.(node.id);
        }
    };

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete ${node.isDirectory ? 'directory' : 'file'} "${node.name}"?`)) {
            const success = await fsService.deleteNode(node.id, node.isDirectory);
            if (success) onRefreshAction(node.id, setChildren);
        }
    };

    const handleAddFolder = async () => {
        const folderName = (prompt("Enter folder name:") || "")?.trim();
        if (!folderName) return;
        const success = await fsService.createFolder(folderName, node.id, user.id);
        if (success) onRefreshAction(node.id, setChildren);
    }

    const handleAddFile = async () => {
        const fileName = (prompt("Enter file name:") || "")?.trim();
        if (!fileName) return;
        const success = await fsService.createFile(fileName, node.id, user.id);
        if (success) onRefreshAction(node.id, setChildren);
    }

    const canEdit = organization == null || (organization.members.get(user.id) || "viewer") != "viewer";
    const showCreate = canEdit && node.isDirectory;

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
                        ) : (<FileText size={16}/>)}
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
                            onClick={handleDelete}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={14}/>
                        </button>
                    )}

                    {showCreate && (
                        <button
                            onClick={handleAddFolder}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-green-400 transition-colors"
                            title="New Folder"
                        >
                            <FolderPlus size={14}/>
                        </button>
                    )}
                    {canEdit && node.isDirectory && (
                        <button
                            onClick={handleAddFile}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors"
                            title="New File"
                        >
                            <FilePlus size={14}/>
                        </button>
                    )}
                </div>
            </div>

            {isOpen && children && (
                <div className="pl-4 border-l border-slate-800 ml-4">
                    {children.map(child => (
                        <FileItem
                            organization={organization}
                            key={child.id}
                            node={child}
                            user={user}
                            onSelectFile={onSelectFile}
                            onRefreshAction={onRefreshAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
