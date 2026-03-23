

export interface FileNode {
    id: string;
    name: string;
    type: "file" | "folder";
    parentId?: string;
}