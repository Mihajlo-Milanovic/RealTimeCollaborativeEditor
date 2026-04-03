import {useState, useEffect} from "react"
import {FileNode} from "@/app/core/types/FileNode"
import {fsService} from "@/app/editor/fileSystem/services/fsService";


export function useFetchChildrenItems(node: FileNode) {

    const [items, setItems] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchChildren = async () => {
        if (!node.isDirectory) return;

        console.log("Fetching children for directory: ", node.id);

        setIsLoading(true);
        const children = await fsService.getChildrenForDirectory(node.id);
        setItems(children);
        setIsLoading(false);
    }

    useEffect(() => {
            fetchChildren();
    }, [node.id]);

    return {items, isLoading, refresh: fetchChildren};
}
