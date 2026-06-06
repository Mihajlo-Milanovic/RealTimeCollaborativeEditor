import {useEffect, useState} from "react"
import {FileNode} from "../../../../models/interfaces/FileNode"
import {NodeType} from "../../../../models/types/NodeType";
import {apiClient} from "../../../../lib/apiClient";


export function useFetchChildrenItems(node: FileNode) {

    const [items, setItems] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchChildren() {
        if (node.type != NodeType.DIR) return;

        setIsLoading(true);
        console.log("Fetching children for directory: ", node.name);
        const children = await apiClient.explorer.getChildren(node.id, node.type);
        // setItems(children);

    }

    useEffect(() => {
        fetchChildren().then(() => {
            if (node) {
                // setItems(fileNodeChildren(node.id));
                setIsLoading(false);
            }
        });
    }, [node]);


    return {
        items,
        isLoading,
        refresh: () => {

            setIsLoading(true);
            // setItems(fileNodeChildren(node.id));
            setIsLoading(false);
        }
    };
}
