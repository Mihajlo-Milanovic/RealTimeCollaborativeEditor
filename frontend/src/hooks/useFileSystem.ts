import { useState, useEffect } from "react"
import { FileNode } from "@/core/types/FileNode"
import {fsService} from "@/filesystem/services/fsService";
import {OrganizationView} from "@/core/types/OrganizationView";
import {FSNode} from "@/collaboration/FSNode";
import {fsTree} from "@/collaboration/y";

export function useFileSystem(userId: string, organization: OrganizationView | null) {
    const [root, setRoot] = useState<FileNode | null>(null)
    const [items, setItems] = useState<FileNode[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchRoot = async () => {

        setIsLoading(true)

        if(organization != null){
            const rootNode: FileNode  = {
                id: organization.id,
                name: organization.name,
                isDirectory: true
            }
            setRoot(rootNode)
            const children = await fsService.getChildrenForOrganization(organization.id)
            setItems(children)
        }
        else {
            const rootNode = await fsService.getRootDirectory(userId)
            if (rootNode) {
                setRoot(rootNode)
                const children = await fsService.getChildrenForDirectory(rootNode.id)
                setItems(children)
            }
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (userId)
            fetchRoot()
    }, [userId, organization])

    return { root, items, isLoading, refresh: fetchRoot }
}
