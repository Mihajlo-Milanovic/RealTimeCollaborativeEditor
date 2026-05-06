import type {FileNode} from '@/models/interfaces/FileNode';
import {NodeType} from "@/models/types/NodeType";

const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {

    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {'Content-Type': 'application/json'},
        ...options,
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`API error ${res.status}: ${error}`);
    }

    // 204 No Content — return null cast to T
    if (res.status === 204) return null as T;

    return res.json();
}

// ── File tree ────────────────────────────────────────────────────────

export const apiClient = {

    deleteNode(id: string, type: NodeType): Promise<FileNode | null> {

        let endpoint = "";
        switch (type) {
            case NodeType.DIR:
                endpoint = `directories/${encodeURIComponent(id)}`;
                break;
            case NodeType.FILE:
                endpoint = `files/${encodeURIComponent(id)}`;
                break;
            case NodeType.ORG:
                endpoint = `organizations/${encodeURIComponent(id)}`;
                break;
            default:
                throw new Error("Invalid node type");
        }

        return request<FileNode>(endpoint, {method: 'DELETE'}).then(it => {
            if (it)
                return {
                    id: it.id,
                    name: it.name,
                    parentId: null,
                    type: "dir"
                } as FileNode
            else
                return null;
        });
    },

    createNode(name: string, type: NodeType, parentDirId: string | null){

    },


    files: {
        list(): Promise<FileNode[]> {
            return request('/api/files')
        },

        create(
            name: string,
            type: 'file' | 'folder',
            parentId: string,
            ownerId: string,
        ): Promise<FileNode> {
            return request('/api/files', {
                method: 'POST',
                body: JSON.stringify({name, type, parentId}),
            })
        },

        rename(id: string, name: string): Promise<void> {
            return request(`/api/files/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({name}),
            })
        },

        delete(id: string): Promise<{ deleted: string[] }> {
            return request(`/api/files/${id}`, {method: 'DELETE'})
        },
    },

    dir: {
        getRoot(userId: string) {
            let root: FileNode | null = null;
            request<FileNode>(`directories/${encodeURIComponent(userId)}/root`).then(it =>
                root = {
                    id: it.id,
                    name: it.name,
                    parentId: null,
                    type: "dir"
                } as FileNode
            )
            return root;
        }
    }
}