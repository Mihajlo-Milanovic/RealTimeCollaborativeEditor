import * as Y from "yjs"

export type FSNode = {
    id: string
    type: 'folder' | 'file'
    name: string
    parentId: string | null
    children: Y.Array<string>   // ordered child IDs
    createdAt: number
}