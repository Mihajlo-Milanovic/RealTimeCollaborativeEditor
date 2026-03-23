import { useState, useEffect } from "react"
import { FileNode } from "@/core/types/FileNode"
import {fsService} from "@/filesystem/services/fsService";


// export function useFileSystem(userId: string) {
//     const [root, setRoot] = useState<FileNode | null>(null)
//     const [items, setItems] = useState<FileNode[]>([])
//     const [isLoading, setIsLoading] = useState(false)
//
//     const fetchRoot = async () => {
//         setIsLoading(true)
//         const rootNode = await fsService.getRoot(userId)
//         setRoot(rootNode)
//         if (rootNode) {
//             const children = await fsService.getChildren(rootNode.id)
//             setItems(children)
//         }
//         setIsLoading(false)
//     }
//
//     useEffect(() => {
//         if (userId) {
//             fetchRoot()
//         }
//     }, [userId])
//
//     return { root, items, isLoading, refresh: fetchRoot }
// }
