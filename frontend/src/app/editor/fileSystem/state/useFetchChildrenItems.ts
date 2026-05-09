import {useEffect, useState} from "react"
import {FileNode} from "@/models/interfaces/FileNode"
import {NodeType} from "@/models/types/NodeType";
import {apiClient} from "@/lib/apiClient";


export function useFetchChildrenItems(node: FileNode) {

    const [items, setItems] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchChildren = async () => {
        if (node.type != NodeType.DIR) return;

        setIsLoading(true);
        console.log("Fetching children for directory: ", node.id);
        const children = await apiClient.explorer.getChildren(node.id, node.type);
        setItems(children);
        setIsLoading(false);
    }

    useEffect(() => {
            fetchChildren();
    }, [node.id]);

    return {items, isLoading, refresh: fetchChildren};
}
