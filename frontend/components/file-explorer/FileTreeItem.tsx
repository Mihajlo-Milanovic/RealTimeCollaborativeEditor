"use client";

import { useState } from "react";
import {
  Trash2,
  FilePlus,
  FolderPlus,
  Folder,
  FolderOpen,
  FileText,
  UserPlus,
  LogOut,
} from "lucide-react";
import {
  getRequestSingle,
  postRequest,
  deleteRequest,
} from "@/app/api/serverRequests/methods";
import { UserView } from "../../models/user";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  parent_id?: string;
  scope?: "personal" | "organization";
  isOrganizationRoot?: boolean;
  organizationId?: string;
  isOwner?: boolean;
};

type FolderResponse = {
  id: string;
  name: string;
  children?: Array<{ id: string; name: string }>;
  files?: Array<{ id: string; name: string }>;
};

type Props = {
  node: FileNode;
  onSelectFile?: (id: string) => void;
  onRefresh?: () => void | Promise<void>;
};

export function FileTreeItem({ node, onSelectFile, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FileNode[] | null>(null);

  const isDirectory = node.type === "folder";
  const isOrganizationRoot = !!node.isOrganizationRoot;
  const isOrganizationNode = node.scope === "organization";
  const canManageOrganization = isOrganizationRoot && !!node.isOwner;
  const canLeaveOrganization = isOrganizationRoot && !node.isOwner;

  const fetchChildren = async (dirId: string = node.id) => {
    const endpoint =
      isOrganizationNode && isOrganizationRoot
        ? `organizations/${node.organizationId ?? node.id}`
        : `directories/${dirId}/children&files`;

    const res = await getRequestSingle(endpoint);
    if (!res.ok) return;

    const payload = await res.json();
    const raw = payload?.data ?? payload;
    const data = (Array.isArray(raw) ? raw[0] : raw) as FolderResponse | null;
    if (!data) return;

    const folders: FileNode[] = (data.children || []).map((child) => ({
      id: child.id,
      name: child.name,
      type: "folder",
      parent_id: dirId,
      scope: node.scope,
      organizationId: node.organizationId,
      isOwner: node.isOwner,
    }));

    const files: FileNode[] = (data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      type: "file",
      parent_id: dirId,
      scope: node.scope,
      organizationId: node.organizationId,
      isOwner: node.isOwner,
    }));

    setItems([...folders, ...files]);
  };

  const handleClick = async () => {
    if (node.type === "file") {
      onSelectFile?.(node.id);
      return;
    }

    if (!open && isDirectory && !items) {
      await fetchChildren();
    }

    setOpen(!open);
  };

  const handleAddMemberByUsername = async () => {
    if (!node.organizationId || !node.isOwner) return;

    const username = prompt("Enter username:");
    if (!username) return;

    const res = await postRequest(
      `organizations/${node.organizationId}/addMemberByUsername`,
      {
        username,
        applicantId: UserView.getInstance().id,
      }
    );

    if (!res.ok) {
      alert("Could not add member.");
      return;
    }

    await onRefresh?.();
  };

  const handleLeaveOrganization = async () => {
    if (!node.organizationId || node.isOwner) return;

    const confirmLeave = confirm(`Leave organization "${node.name}"?`);
    if (!confirmLeave) return;

    const res = await deleteRequest(
      `organizations/${node.organizationId}/leave/userId/${UserView.getInstance().id}`
    );

    if (res.ok) {
      await onRefresh?.();
    }
  };

  const handleDeleteOrganization = async () => {
    if (!node.organizationId || !node.isOwner) return;

    const confirmDelete = confirm(`Delete organization "${node.name}"?`);
    if (!confirmDelete) return;

    const res = await deleteRequest(
      `organizations/${node.organizationId}/delete/userId/${UserView.getInstance().id}`
    );

    if (res.ok) {
      await onRefresh?.();
    }
  };

  const handleAddFile = async () => {
    if (!isDirectory) return;

    // Na organization root-u ne dozvoljavamo dodavanje fajlova
    if (isOrganizationRoot && isOrganizationNode) return;

    const fileName = prompt("Enter file name:");
    if (!fileName) return;

    const ownerId = UserView.getInstance().id;

    const res = await postRequest("files/create", {
      parent: node.id,
      owner: ownerId,
      name: fileName,
      collaborators: [],
      organization: node.organizationId ?? null,
    });

    if (res.ok) {
      await fetchChildren();
    }
  };

  const handleAddFolder = async () => {
    if (!isDirectory) return;

    const folderName = prompt("Enter folder name:");
    if (!folderName) return;

    const ownerId = UserView.getInstance().id;

    const res = await postRequest("directories/create", {
      name: folderName,
      owner: ownerId,
      parents: [node.id],
      children: [],
      files: [],
      collaborators: [],
      organization: node.organizationId ?? null,
    });

    if (res.ok) {
      await fetchChildren();
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete ${node.name}?`);
    if (!confirmDelete) return;

    const endpoint =
      node.type === "folder"
        ? `directories/${node.id}/delete`
        : `files/${node.id}/delete`;

    const res = await deleteRequest(endpoint);

    if (res.ok) {
      await onRefresh?.();
    }
  };

  // U svim folderima može folder
  const canCreateFolder =
    isDirectory && (!isOrganizationNode || !!node.isOwner);

  // Fajl može svuda kao i do sada, osim na samom organization root-u
  const canCreateFile =
    isDirectory &&
    !isOrganizationRoot &&
    (!isOrganizationNode || !!node.isOwner);

  const showRegularDelete = !isOrganizationRoot;

  return (
    <div className="pl-1">
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors group ${
          isDirectory ? "hover:bg-slate-800" : "hover:bg-blue-500/10"
        }`}
      >
        <div
          className="flex flex-1 items-center gap-2.5 min-w-0"
          onClick={handleClick}
        >
          <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
            {isDirectory ? (
              open ? (
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
              <FileText size={16} />
            )}
          </div>

          <span
            className="truncate text-slate-300 group-hover:text-white transition-colors"
            title={node.name}
          >
            {node.name}
          </span>
        </div>

        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {canCreateFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddFolder();
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-green-400 transition-colors"
              title="New Folder"
            >
              <FolderPlus size={14} />
            </button>
          )}

          {canCreateFile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddFile();
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors"
              title="New File"
            >
              <FilePlus size={14} />
            </button>
          )}

          {canManageOrganization && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddMemberByUsername();
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-purple-400 transition-colors"
              title="Add member"
            >
              <UserPlus size={14} />
            </button>
          )}

          {canLeaveOrganization && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLeaveOrganization();
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-orange-400 transition-colors"
              title="Leave organization"
            >
              <LogOut size={14} />
            </button>
          )}

          {canManageOrganization && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteOrganization();
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
              title="Delete organization"
            >
              <Trash2 size={14} />
            </button>
          )}

          {showRegularDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {open && items && (
        <div className="ml-3.5 pl-3 border-l border-slate-800 mt-0.5 space-y-0.5">
          {items.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              onRefresh={() => fetchChildren()}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}