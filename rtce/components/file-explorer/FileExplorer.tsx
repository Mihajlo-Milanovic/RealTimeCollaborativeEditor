"use client";

import { useEffect, useState } from "react";
import { Folder, FolderOpen, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import { getRequestSingle } from "../../src/app/api/serverRequests/methods";
import { UserView } from "../../models/user";

// folder / file
interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
}

interface FolderResponse {
  _id: string;
  name: string;
  children: Array<{ _id: string; name: string }>; // folderi
  files: Array<{ _id: string; name: string }>;    // fajlovi
}

interface FileItemProps {
  node: FileNode;
}

function FileItem({ node }: FileItemProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FileNode[] | null>(null);

  const isDirectory = node.type === "folder";

  const handleToggle = async () => {
    if (!open && isDirectory && !items) {
      const res = await getRequestSingle(
        "directory/getChildrenAndFilesForDirectory",
        "dirId",
        node.id
      );

      if (res.ok) {
        const data: FolderResponse = await res.json();

        const folders = (data.children || []).map((child) => ({
          id: child._id,
          name: child.name,
          type: "folder" as const,
        }));

        const files = (data.files || []).map((file) => ({
          id: file._id,
          name: file.name,
          type: "file" as const,
        }));

        setItems([...folders, ...files]);
      }
    }

    setOpen(!open);
  };

  if (node.type === "file") {
    return (
      <div className="flex items-center gap-2 pl-2 py-1 hover:bg-blue-200 rounded cursor-pointer">
        <FileText size={16} />
        {node.name}
      </div>
    );
  }

  // Folder
  return (
    <div className="pl-2">
      <div
        className="flex items-center gap-2 py-1 hover:bg-blue-400 rounded cursor-pointer"
        onClick={handleToggle}
      >
        {open ? <FolderOpen size={16} /> : <Folder size={16} />}
        {node.name}
      </div>

      {open && items && (
        <div className="pl-4">
          {items.map((child) => (
            <FileItem key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const [root, setRoot] = useState<FileNode | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      UserView.getInstance().fillFromSession(session.user);

      const fetchRoot = async () => {
        const userId = UserView.getInstance().id;
        const res = await getRequestSingle(
          "directory/getUserRootDirectory",
          "uuid",
          userId
        );

        if (res.ok) {
          const data: FolderResponse = await res.json();
          setRoot({
            id: data._id,
            name: data.name,
            type: "folder",
          });
        }
      };

      fetchRoot();
    }
  }, [status, session]);

  if (status === "loading") return <p>Loading session...</p>;
  if (!session) return <p>No session, user is not logged in.</p>;
  if (!root) return <p>Loading root directory...</p>;

  return (
    <div className="w-full h-full text-sm font-mono overflow-y-auto p-2">
      <FileItem node={root} />
    </div>
  );
}
