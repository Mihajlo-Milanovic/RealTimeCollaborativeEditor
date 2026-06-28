import type {FileNode} from '../models/interfaces/FileNode';
import {NodeType} from "../models/types/NodeType";
import {OrganizationRole} from "../models/types/OrganizationRole";
import {OrganizationView} from "../models/types/views/OrganizationView";
import {UserView} from "../models/types/views/UserView";
import {fileSystemStore} from "../store/fileSystem";
import {user} from "../store/user";
import {useSelectedFile} from "../store/selectedFile";

const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {

    const res = await fetch(`${BASE_URL}/${path}`, {
        headers: {'Content-Type': 'application/json'},
        ...options,
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`API [${BASE_URL}/${path}] error ${res.status}: ${error}`);
    }

    // 204 No Content — return null cast to T
    if (res.status === 204) return null as T;

    return (await res.json()).data as T;
}

// ── File tree ────────────────────────────────────────────────────────

export const apiClient = {

    explorer: {

        /**
         * Directories and files need to have parentId and parentType specified
         */
        async createNode(
            ownerId: string,
            name: string,
            type: NodeType,
            parentId: string = "",
            parentType: NodeType = NodeType.DIR,
        ) {

            let fileNode: FileNode;

            switch (type) {
                case NodeType.FILE:
                    const file = await request<FileNode>('files', {
                        method: 'POST',
                        body: JSON.stringify({
                            name,
                            owner: ownerId,
                            parent: parentId
                        }),
                    });
                    fileNode = {
                        ...file,
                        parents: parentId,
                        type: NodeType.FILE,
                    } as FileNode;
                    break;

                case NodeType.DIR:
                    const dir = await request<FileNode>('directories', {
                        method: 'POST',
                        body: JSON.stringify({
                            name,
                            owner: ownerId,
                            parents: parentId ? [parentId] : [],
                        }),
                    });

                    if (parentType == NodeType.ORG && dir) {
                        await request(`organizations/${encodeURIComponent(parentId)}/addChildren`,
                            {
                                method: "PUT",
                                body: JSON.stringify({
                                    children: [dir.id]
                                })
                            }
                        );
                    }

                    fileNode = {
                        ...dir,
                        parents: parentId,
                        type: NodeType.DIR
                    } as FileNode;
                    break;

                case NodeType.ORG:
                    const org = await request<FileNode>("organizations",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                name,
                                organizer: ownerId,
                            })
                        }
                    )
                    fileNode = {
                        ...org,
                        type: NodeType.ORG
                    } as FileNode;
                    break;
            }

            if (Array.isArray(fileNode.parents))
                fileNode.parents.forEach(parent => {
                    const childrenArray = fileSystemStore.fsMap.get(parent);
                    if (childrenArray)
                        fileSystemStore.fsMap.set(parent, [...childrenArray, fileNode]);
                    else {
                        fileSystemStore.fsMap.set(parent, [fileNode]);
                    }
                });
            else {
                const childrenArray = fileSystemStore.fsMap.get(fileNode.parents);
                if (childrenArray)
                    fileSystemStore.fsMap.set(fileNode.parents, [...childrenArray, fileNode]);
                else {
                    fileSystemStore.fsMap.set(fileNode.parents, [fileNode]);
                }
            }
            return true;
        },

        async deleteNode(
            id: string,
            type: NodeType,
            userId: string
        ) {

            let endpoint = "";
            switch (type) {
                case NodeType.DIR:
                    endpoint = `directories/${encodeURIComponent(id)}`;

                    const resDir = (await request<{
                        deleted: FileNode & { parents: string[] }
                        directoriesDeleted: number
                        filesDeleted: number
                    }>(endpoint, {method: 'DELETE'}));

                    const deletedDir = resDir.deleted

                    if (deletedDir) {

                        deletedDir.parents.forEach(parent => {
                            const childrenArray = fileSystemStore.fsMap.get(parent);
                            if (childrenArray)
                                fileSystemStore.fsMap.set(parent, [...childrenArray.filter(c => c.id !== id)]);
                        });

                        return true;
                    }
                    break;

                case NodeType.FILE:
                    endpoint = `files/${encodeURIComponent(id)}`;
                    // Backend (toFileView) vraća roditelja kao "parentId", ne "parents".
                    const resFile = (await request<FileNode & { parentId: string }>(endpoint, {method: 'DELETE'}));
                    console.log("deleted file: ", resFile)

                    if (resFile) {
                        const parentId = resFile.parentId;
                        const childrenArray = fileSystemStore.fsMap.get(parentId);
                        if (childrenArray)
                            fileSystemStore.fsMap.set(parentId, childrenArray.filter(c => c.id !== id));
                        return true;
                    }
                    break;
                case NodeType.ORG:
                    endpoint = `organizations/${encodeURIComponent(id)}/${encodeURIComponent(userId)}`;
                    const resOrg = (await request<FileNode>(endpoint, {method: 'DELETE'}));
                    console.log("deleted file: ", resOrg)

                    if (resOrg) {
                        return true
                    }
                    break;
                default:
                    throw new Error("Invalid node type");
            }

            return false
        },

        async getRootDirectory() {

            const res = await request<FileNode>(
                `directories/${encodeURIComponent(user.id)}/root`,
                {method: 'GET'}
            );
            if (!res) return null;
            return {
                ...res,
                type: NodeType.DIR,
            } as FileNode;
        },

        async getOrganizationsForUser(userId: string) {

            const org = await request<Map<string, OrganizationRole>>(
                `users/${encodeURIComponent(userId)}/organizations`,
                {method: "GET"}
            );

            return new Map<string, OrganizationRole>(Object.entries(org));
        },

        async getChildren(nodeId: string, nodeType: NodeType) {

            let children: FileNode[] = [];

            switch (nodeType) {
                case NodeType.FILE:
                    return;
                case NodeType.DIR:
                    const dir = await request<{ children: FileNode[], files: FileNode[] }>(
                        `directories/${encodeURIComponent(nodeId)}/children&files`,
                        {method: "GET"}
                    );

                    const dirFolders: FileNode[] = (dir.children || []).map(child => ({
                            ...child,
                            type: NodeType.DIR,
                            parents: nodeId
                        } as FileNode
                    ));

                    const dirFiles: FileNode[] = (dir.files || []).map(file => ({
                            ...file,
                            type: NodeType.FILE,
                            parents: nodeId
                        } as FileNode
                    ));

                    children = [...dirFolders, ...dirFiles];
                    break;
                case NodeType.ORG:

                    const org = await request<{ children: FileNode[], projections: FileNode[] }>(
                        `organizations/${encodeURIComponent(nodeId)}`,
                        {method: "GET"}
                    );

                    const orgFolders: FileNode[] = (org.children || []).map(child => ({
                            ...child,
                            type: NodeType.DIR,
                            parents: nodeId
                        } as FileNode
                    ));

                    const orgProjections: FileNode[] = (org.projections || []).map(proj => ({
                            ...proj,
                            type: NodeType.DIR,
                            parents: nodeId
                        } as FileNode
                    ));

                    children = [...orgFolders, ...orgProjections];
                    break;
            }

            // console.log("CHILDREN :::::: >>>>>", children)

            // const childrenArray = fileSystemStore.fsMap.get(nodeId)
            const sorted = children.sort((a, b) => a.name.localeCompare(b.name));

            fileSystemStore.fsMap.set(nodeId, sorted)

            //fileSystemStore.notifyObservers()
        },

        async getOrganizationsByNames(names: string[]) {

            const params = new URLSearchParams();
            names.forEach(name => params.append('names', name));

            const urlWithParams = `organizations/names?${params.toString()}`;

            const organizations = await request<OrganizationView[]>(urlWithParams, {method: "GET"});

            return organizations.map(o => ({
                    ...o,
                    members: new Map(Object.entries(o.members ?? {})),
                } as OrganizationView
            ));
        },

        async removeMember(orgId: string, memberId: string, applicantId: string): Promise<boolean> {
            try {
                await request(`organizations/${encodeURIComponent(orgId)}/removeMembers`, {
                    method: "PUT",
                    body: JSON.stringify({
                        members: [memberId],
                        applicantId,
                    }),
                });
                return true;
            } catch (e) {
                console.error("removeMember failed:", e);
                return false;
            }
        }
    },

    file: {

        async getState(fileId: string) {

            const response = await fetch(`${BASE_URL}/files/${encodeURIComponent(fileId)}/state`, {method: "GET"});
            if (!response.ok) throw new Error(`GET ${BASE_URL}/files/${encodeURIComponent(fileId)}/state failed: ${response.status} ${response.statusText}`);

            const buffer = await response.arrayBuffer();
            return new Uint8Array(buffer);
        },

        async saveState(fileId: string, bytes: Uint8Array) {
            const copy = new Uint8Array(bytes);
            const body: ArrayBuffer = copy.buffer;

            return fetch(
                `${BASE_URL}/files/${encodeURIComponent(fileId)}/state`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/octet-stream"},
                    body,
                });
        },
    },

    user: {
        async getByEmail(email: string) {

            const res = await request<UserView>(
                `users/email/${encodeURIComponent(email)}`,
                {method: 'GET'}
            );

            if (!res) return null;

            return {
                ...res,
            } as UserView;
        }
    },

}