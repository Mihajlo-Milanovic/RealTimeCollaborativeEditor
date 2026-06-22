import {NodeType} from "../types/NodeType";


export interface FileNode {
    id: string;
    name: string;
    type: NodeType;
    parents: string | string[];   // null = root level
    // createdAt: string;
    // updatedAt: string;
}