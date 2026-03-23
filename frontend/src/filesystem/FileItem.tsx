"use client";

import React, {useState} from "react";
import {Folder, FolderOpen, FileText, Trash2, FolderPlus, FilePlus, LogOut} from "lucide-react";
import {FileNode} from "@/core/types/FileNode";
import {UserView} from "@/core/types/UserView";
import {filesystemService} from "@/filesystem/services";
import {cn} from "@/core/utils";
import OrganizationExplorer from "@/filesystem/organization/OrganizationExplorer";
import {OrganizationView} from "@/core/types/OrganizationView";
import Link from "next/link";

interface FileItemProps {
    org: OrganizationView | null;
    user: UserView;
    node: FileNode;
    onSelectFile?: (id: string) => void;
    onRefresh?: () => void;
}

export default function FileItem({org, user, node, onSelectFile, onRefresh}: FileItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [children, setChildren] = useState<FileNode[]>([]);
    const isDirectory = node.type === "folder";

    const handleClick = async () => {
        if (isDirectory) {
            if (!isOpen) {
                const fetchedChildren = await filesystemService.getChildren(node.id);
                setChildren(fetchedChildren);
            }
            setIsOpen(!isOpen);
        } else {
            onSelectFile?.(node.id);
        }
    };

    const handleDelete = async () => {
        if (confirm(`Delete ${node.name}?`)) {
            const success = await filesystemService.deleteNode(node.id, node.type);
            if (success) onRefresh?.();
        }
    };

    const handleAddFolder = async () => {
        const folderName = (prompt("Enter folder name:") || "")?.trim();
        if (!folderName) return;
        const success = await filesystemService.createFolder(folderName, node.id);
        if (success) onRefresh?.();
    }

    const handleAddFile = async () => {
        const fileName = (prompt("Enter file name:") || "")?.trim();
        if (!fileName) return;
        const success = await filesystemService.createFile(fileName, node.id);
        if (success) onRefresh?.();
    }

    const canEdit = org == null || (org.members.get(user.id) || "viewer") != "viewer";
    const showCreate = canEdit && isDirectory;

    return (
        <div className="flex flex-col">
            <div
                onClick={handleClick}
                className="group flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 cursor-pointer transition-colors"
            >
                {isDirectory ? (
                    isOpen ? <FolderOpen size={16} className="text-blue-400"/> :
                        <Folder size={16} className="text-blue-400"/>
                ) : (
                    <FileText size={16} className="text-slate-400"/>
                )}
                <span className="flex-1 text-sm truncate">{node.name}</span>

                {canEdit && (
                    <button
                        onClick={() => {
                            handleDelete();
                        }}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14}/>
                    </button>
                )}

                {showCreate && (
                    <button
                        onClick={() => {
                            handleAddFolder();
                        }}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-green-400 transition-colors"
                        title="New Folder"
                    >
                        <FolderPlus size={14}/>
                    </button>
                )}
                {canEdit && (
                    <button
                        onClick={() => {
                            handleAddFile();
                        }}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors"
                        title="New File"
                    >
                        <FilePlus size={14}/>
                    </button>
                )}
            </div>

            {isOpen && children.length > 0 && (
                <div className="pl-4 border-l border-slate-800 ml-4">
                    {children.map(child => (
                        <FileItem
                            org={org}
                            key={child.id}
                            node={child}
                            user={user}
                            onSelectFile={onSelectFile}
                            onRefresh={onRefresh}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
