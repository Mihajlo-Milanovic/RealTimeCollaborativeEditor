"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { FilePlus, FolderPlus } from "lucide-react";
import { getRequestSingle, postRequest } from "@/app/api/serverRequests/methods";
import { UserView } from "@/models/user";
import { FileTreeItem, FileNode } from "./FileTreeItem";
import OrganizationExplorer from "./OrganizationExplorer";

type RootContentsResponse = {
  children?: Array<{ id: string; name: string }>;
  files?: Array<{ id: string; name: string }>;
};

export default function FileExplorer({ onSelectFile }: { onSelectFile?: (id: string) => void }) {
  const [root, setRoot] = useState<FileNode | null>(null);
  const [rootItems, setRootItems] = useState<FileNode[]>([]);
  const [workspaceHeightPercent, setWorkspaceHeightPercent] = useState(33);
  const { data: session, status } = useSession();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isResizingRef = useRef(false);

  const fetchRootContents = async (rootId: string) => {
    const res = await getRequestSingle(`directories/${rootId}/children&files`);
    if (!res.ok) return;

    const payload = await res.json();
    const raw = payload?.data ?? payload;
    const data = (Array.isArray(raw) ? raw[0] : raw) as RootContentsResponse | null;
    if (!data) return;

    const folders: FileNode[] = (data.children || []).map((child) => ({
      id: child.id,
      name: child.name,
      type: "folder",
    }));

    const files: FileNode[] = (data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      type: "file",
    }));

    setRootItems([...folders, ...files]);
  };

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    UserView.getInstance().fillFromSession(session.user);

    const fetchRoot = async () => {
      const userId = UserView.getInstance().id;
      const res = await getRequestSingle(`directories/${userId}/root`);
      if (!res.ok) return;

      const payload = await res.json();
      const raw = payload?.data ?? payload;
      const rootDir = Array.isArray(raw) ? raw[0] : raw;

      if (!rootDir?.id) return;

      const rootNode: FileNode = { id: rootDir.id, name: rootDir.name, type: "folder" };
      setRoot(rootNode);
      await fetchRootContents(rootNode.id);
    };

    fetchRoot();
  }, [status, session]);

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

  const startResize = () => {
    isResizingRef.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  const handleAddFolderToRoot = async () => {
    if (!root?.id) return;

    const folderName = prompt("Enter folder name:");
    if (!folderName?.trim()) return;

    const ownerId = UserView.getInstance().id;
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

    const ownerId = UserView.getInstance().id;
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

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>No session, user is not logged in.</p>;
  if (!root) return <p>Loading root directory...</p>;

  return (
    <div ref={containerRef} className="w-full h-full text-[13px] p-3 flex flex-col min-h-0">
      <div
        className="min-h-0 overflow-y-auto custom-scrollbar"
        style={{ flexBasis: `${workspaceHeightPercent}%` }}
      >
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Personal Workspace
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleAddFolderToRoot}
              className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="New folder"
              aria-label="New folder"
            >
              <FolderPlus size={14} />
            </button>
            <button
              onClick={handleAddFileToRoot}
              className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="New file"
              aria-label="New file"
            >
              <FilePlus size={14} />
            </button>
          </div>
        </div>

        {rootItems.length === 0 ? (
          <div className="px-2 py-1 text-xs text-slate-500">No files or folders.</div>
        ) : (
          <div className="space-y-1">
            {rootItems.map((item) => (
              <FileTreeItem
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
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize sections"
        onMouseDown={startResize}
        className="h-2 my-1 cursor-row-resize rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
      />

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <OrganizationExplorer onSelectFile={onSelectFile} />
      </div>
    </div>
  );
}
