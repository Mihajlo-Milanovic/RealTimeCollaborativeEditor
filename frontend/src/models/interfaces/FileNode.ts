import {NodeType} from "@/models/types/NodeType";


export interface FileNode {
    id: string;
    name: string;
    type: NodeType;
    parentId: string | null;   // null = root level
    // createdAt: string;
    // updatedAt: string;
}