import {useState, useEffect} from "react"
import {FileNode} from "@/core/types/FileNode"
import {fsService} from "@/filesystem/services/fsService";


export function useFetchChildren(dirId: string) {

    const [items, setItems] = useState<FileNode[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchChildren = async () => {

        setIsLoading(true)

        const children = await fsService.getChildrenForDirectory(dirId)
        setItems(children)

        setIsLoading(false)
    }

    useEffect(() => {
            fetchChildren()
    }, [dirId])

    return {items, isLoading, refresh: fetchChildren}
}
