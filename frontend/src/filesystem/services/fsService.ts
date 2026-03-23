import {deleteRequest, getRequestSingle, postRequest} from "@/core/api/serverRequests/methods";
import {FileNode} from "@/core/types/FileNode";

export const fsService = {

    async getRootDirectory(userId: string): Promise<FileNode | null> {

        const res = await getRequestSingle(`directories/${userId}/root`);
        if (!res.ok) return null;
        const payload = await res.json();
        const rootDir = payload?.data ?? payload;
        if (!rootDir?.id) return null;
        return {
            id: rootDir.id,
            name: rootDir.name,
            isDirectory: true,
        };
    },

    async createFile(fileName: string, parentId: string, ownerId: string): Promise<boolean> {
        const res = await postRequest("files", {
            owner: ownerId,
            parent: parentId,
            name: fileName
        });
        return res.ok;
    },

    async createFolder(folderName: string, parentId: string | null, ownerId: string): Promise<boolean> {
        const res = await postRequest("directories", {
            owner: ownerId,
            parents: parentId ? [parentId] : [],
            name: folderName
        });
        return res.ok;
    },

    async deleteNode(id: string, isDirectory: boolean): Promise<boolean> {
        const endpoint = isDirectory ? `directories/${id}` : `files/${id}`;
        const res = await deleteRequest(endpoint);
        return res.ok;
    },

    async getChildrenForDirectory(dirId: string): Promise<FileNode[]> {
        const res = await getRequestSingle(`directories/${dirId}/children&files`);
        if (!res.ok) return [];
        const payload = await res.json();
        const data = payload?.data ?? payload;
        if (!data) return [];

        const folders: FileNode[] = (data.children || []).map((child: any) => ({
            id: child.id,
            name: child.name,
            isDirectory: true,
        }));

        const files: FileNode[] = (data.files || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            isDirectory: false,
        }));

        return [...folders, ...files].sort((a, b) => a.name.localeCompare(b.name));
    },

    async getChildrenForOrganization(orgId: string): Promise<FileNode[]> {
        const res = await getRequestSingle(`organizations/${orgId}`);
        if (!res.ok) return [];
        const payload = await res.json();
        const data = payload?.data ?? payload;
        if (!data) return [];

        const folders: FileNode[] = (data.children || []).map((child: any) => ({
            id: child.id,
            name: child.name,
            isDirectory: true,
        }));

        const projections: FileNode[] = (data.projections || []).map((file: any) => ({
            id: file.id,
            name: file.name,
            isDirectory: true,
        }));

        return [...folders, ...projections].sort((a, b) => a.name.localeCompare(b.name));
    }
};
