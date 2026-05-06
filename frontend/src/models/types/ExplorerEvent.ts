import {FileNode} from "@/models/interfaces/FileNode";


export type ExplorerEvent =
    | { type: 'node:created'; node: FileNode }
    | { type: 'node:renamed'; id: string; name: string }
    | { type: 'node:deleted'; id: string };