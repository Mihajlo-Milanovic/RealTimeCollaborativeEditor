"use client";

import React, {useState} from "react";
import {FilePlus, FileText, Folder, FolderOpen, FolderPlus, Trash2} from "lucide-react";
import {TFileItem} from "../../../../models/elementTypes/TFileItem";
import {prompts} from "../prompts";
import {NodeType} from "../../../../models/types/NodeType";
import {useSelectedFile} from "../../../../store/selectedFile";
import {user} from "../../../../store/user";
import {useFileSystem} from "../state/useFileSystem";


export default function FileItem(
    {
        organization,
        node,
    }: TFileItem
) {

    const [isOpen, setIsOpen] = useState(false);
    const [canEdit] = useState(organization == null || (organization.members.get(user.id) || "viewer") != "viewer");
    const [showCreate] = useState(canEdit && node.type == NodeType.DIR);

    const {
        selectedFileId,
        setSelectedFileId,
        clearSelectedFileId
    } = useSelectedFile();

    // const {
    //     // items,
    //     // isLoading,
    //     // refresh
    // } = useFetchChildrenItems(node);

    const {children} = useFileSystem(node.id, NodeType.DIR);

    const handleOpenFolder = async () => {
        if (node.type == NodeType.DIR) {
            setIsOpen(!isOpen);
        } else {
            if (selectedFileId != node.id)
                setSelectedFileId(node.id);
            else
                clearSelectedFileId();
        }
    };

    return (
        <div className="flex flex-col">
            <div
                className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors group ${
                    node.type == NodeType.DIR ? "hover:bg-slate-800" : "hover:bg-blue-500/10"
                }`}
            >
                <div
                    className="flex flex-1 items-center gap-2.5 min-w-0"
                    onClick={handleOpenFolder}
                >
                    <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
                        {node.type == NodeType.DIR ? (
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

                    {/*{ selectedFileId == node.id && (*/}
                    {/*   <OnlineUsers/>*/}
                    {/*)}*/}
                </div>

                <div
                    className={`flex gap-1.5 transition-opacity ${ isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100" }`}
                >
                    {canEdit && (
                        <button
                            onClick={() => prompts.deleteFileNode(node, user.id)}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={14}/>
                        </button>
                    )}

                    {showCreate && (
                        <button
                            onClick={() => prompts.addFolderToFileNode(node, user.id)}
                            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-green-400 transition-colors"
                            title="New Folder"
                        >
                            <FolderPlus size={14}/>
                        </button>
                    )}
                    {canEdit && node.type == NodeType.DIR && (
                        <button
                            onClick={() => prompts.addFileToFileNode(node, user.id)}
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
