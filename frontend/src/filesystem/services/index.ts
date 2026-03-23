import { getRequestSingle, postRequest, deleteRequest, putRequest } from "@/core/api/serverRequests/methods";
import { FileNode } from "@/core/types/FileNode";

export const filesystemService = {
    async getRoot(userId: string): Promise<FileNode | null> {
        const res = await getRequestSingle(`directories/${userId}/root`);
        if (!res.ok) return null;
        const payload = await res.json();
        const raw = payload?.data ?? payload;
        const rootDir = Array.isArray(raw) ? raw[0] : raw;
        if (!rootDir?.id) return null;
        return { id: rootDir.id, name: rootDir.name, type: "folder" };
    },

    async getChildren(dirId: string): Promise<FileNode[]> {
        const res = await getRequestSingle(`directories/${dirId}/children&files`);
        if (!res.ok) return [];
        const payload = await res.json();
        const raw = payload?.data ?? payload;
        const data = Array.isArray(raw) ? raw[0] : raw;
        if (!data) return [];

        const folders: FileNode[] = (data.children || []).map((child: any) => ({
            id: child.id,
            name: child.name,
            type: "folder",
            parentId: dirId,
        }));

        const files: FileNode[] = (data.files || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            type: "file",
            parentId: dirId,
        }));

        return [...folders, ...files];
    },

    async createFile(name: string, parentId: string): Promise<boolean> {
        const res = await postRequest("files", { name, parentId });
        return res.ok;
    },

    async createFolder(name: string, parentId: string): Promise<boolean> {
        const res = await postRequest("directories", { name, parentId });
        return res.ok;
    },

    async deleteNode(id: string, type: "file" | "folder"): Promise<boolean> {
        const endpoint = type === "file" ? `files/${id}` : `directories/${id}`;
        const res = await deleteRequest(endpoint);
        return res.ok;
    }
};
