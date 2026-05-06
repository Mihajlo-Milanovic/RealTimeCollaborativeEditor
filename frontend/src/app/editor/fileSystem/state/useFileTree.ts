import {useEffect, useState} from "react"
import {FileNode} from "@/models/interfaces/FileNode"
import {fsService} from "@/app/editor/fileSystem/services/fsService";
import {OrganizationView} from "@/models/types/views/OrganizationView";
import {NodeType} from "@/models/types/NodeType";

export function useFileTree(userId: string, organization: OrganizationView | null) {
    const [root, setRoot] = useState<FileNode | null>(null)
    const [items, setItems] = useState<FileNode[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchRoot = async () => {

        setIsLoading(true)

        if(organization != null){
            const rootNode: FileNode  = {
                id: organization.id,
                name: organization.name,
                type: NodeType.ORG,
                parentId: organization.id,
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
