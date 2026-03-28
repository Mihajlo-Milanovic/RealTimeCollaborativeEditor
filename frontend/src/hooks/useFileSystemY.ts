// import {useEffect, useState} from "react"
// import {FSNode} from "@/collaboration/FSNode";
// import {fsDoc, fsTree} from "@/collaboration/y";
//
//
// export function useFileSystemY() {
//     const [nodes, setNodes] = useState<Map<string, FSNode>>(new Map())
//
//     useEffect(() => {
//         const sync = () => setNodes(new Map(fsTree.entries()))
//         fsTree.observe(sync)
//         sync()
//         return () => fsTree.unobserve(sync)
//     }, [])
//
//     const createFile = (name: string, parentId: string | null) => {
//         fsDoc.transact(() => {
//             const id = crypto.randomUUID()
//             const node: FSNode = { id, type: 'file', name, parentId, children: new Y.Array(), createdAt: Date.now() }
//             fsTree.set(id, node)
//             if (parentId) {
//                 const parent = fsTree.get(parentId)
//                 parent?.children.push([id])
//             }
//         })
//     }
//
//     const renameNode = (id: string, name: string) => {
//         fsDoc.transact(() => {
//             const node = fsTree.get(id)
//             if (node) fsTree.set(id, { ...node, name })
//         })
//     }
//
//     // deleteNode, moveNode follow the same transact() pattern
//
//     return { nodes, createFile, renameNode }
// }
