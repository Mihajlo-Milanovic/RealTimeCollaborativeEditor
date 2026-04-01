import {deleteRequest, getRequestSingle, postRequest, putRequest} from "@/app/api/serverRequests/methods";
import {FileNode} from "@/app/core/types/FileNode";
import {OrganizationView} from "@/app/core/types/OrganizationView";
import {OrganizationRole} from "@/app/core/types/OrganizationRole";

export const fsService = {

    async getRootDirectory(userId: string): Promise<FileNode | null> {

        const res = await getRequestSingle(`directories/${encodeURIComponent(userId)}/root`);
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

    async createFolderInFolder(folderName: string, parentId: string | null, ownerId: string, parentIsOrganization: boolean): Promise<boolean> {
        let res = await postRequest("directories", {
            owner: ownerId,
            parents: parentId ? [parentId] : [],
            name: folderName
        });

        if (parentIsOrganization && res.ok && parentId) {
            const payload = await res.json();
            const data = payload?.data ?? payload;
            return await this.addFolderToOrganization(data.id, parentId);
        }

        return res.ok;
    },

    async addFolderToOrganization(folderId: string, organizationId: string): Promise<boolean> {
        const res = await putRequest(`organizations/${encodeURIComponent(organizationId)}/addChildren`, {
            children: [folderId],
        });
        return res.ok;
    },

    async deleteNode(id: string, isDirectory: boolean): Promise<boolean> {
        const endpoint = isDirectory ? `directories/${encodeURIComponent(id)}` : `files/${encodeURIComponent(id)}`;
        const res = await deleteRequest(endpoint);
        return res.ok;
    },

    async getChildrenForDirectory(dirId: string): Promise<FileNode[]> {
        const res = await getRequestSingle(`directories/${encodeURIComponent(dirId)}/children&files`);
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
        const res = await getRequestSingle(`organizations/${encodeURIComponent(orgId)}`);
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
    },

    async deleteOrganization(organizationId: string, userId: string,) {

        const res = await deleteRequest(`organizations/${organizationId}/${userId}`);
        console.log(res);
        return (res).ok;
    },

    async getOrganizationsForUser(userId: string) {
        const membershipsRes = await getRequestSingle(`users/${encodeURIComponent(userId)}/organizations`);

        if (!membershipsRes.ok)
            return new Map<string, OrganizationRole>();

        const membershipsPayload = await membershipsRes.json();
        return new Map<string, OrganizationRole>(Object.entries(membershipsPayload?.data ?? {}));
    },

    async getOrganizationsByNames(names: string[]) {

        const params = new URLSearchParams();
        names.forEach(name => params.append('names', name));

        const urlWithParams = `organizations/names?${params.toString()}`;
        const organizationsRes = await getRequestSingle(urlWithParams);
        if (organizationsRes.ok) {
            const payload = await organizationsRes.json();
            const organizations = payload?.data as OrganizationView[] | null;
            if (organizations != null) {
                return organizations.map(o => ({
                    id: o.id,
                    name: o.name,
                    members: new Map(Object.entries(o.members ?? {})),
                    organizer: o.organizer,
                    children: o.children,
                } as OrganizationView));
            }
        }
        return [];
    },

    async createOrganization(organizationName: string, userId: string){
        const res = await postRequest("organizations", {
            name: organizationName,
            organizer: userId,
        })

        return res.ok;
    }
};
