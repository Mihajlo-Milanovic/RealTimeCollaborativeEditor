import {useEffect, useState} from "react"
import {FileNode} from "../../../../models/interfaces/FileNode"
import {OrganizationView} from "../../../../models/types/views/OrganizationView";
import {NodeType} from "../../../../models/types/NodeType";
import {apiClient} from "../../../../lib/apiClient";
import {useHocuspocusProvider} from "@hocuspocus/provider-react";
import {fileSystemStore} from "../../../../store/fileSystem";
import {useFileSystem} from "./useFileSystem";


export function useFileTree(userId: string, organization: OrganizationView | null) {

    const [root, setRoot] = useState<FileNode | null>(null);
    const [childrenItems, setChildrenItems] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const provider = useHocuspocusProvider();
    const [synced, setSynced] = useState(false);

    const {children} = useFileSystem(root?.id || "", root?.type || "");

    useEffect(() => {
        if (!provider) return;
        provider.on("synced", () => setSynced(true));
    }, [provider]);

    useEffect(() => {
        if (!userId) return;

        fileSystemStore.init(provider.document);
        fetchRoot();

    }, [userId, organization]);

    useEffect(() => {
        if (root)
            setChildrenItems(children);
    }, [children, root]);

    return {
        root,
        children: childrenItems,
        isLoading: isLoading && synced,
    };

    async function fetchRoot(){

        setIsLoading(true);

        let rootNode: FileNode;

        if (organization != null)
            rootNode = {
                id: organization.id,
                name: organization.name,
                type: NodeType.ORG,
                parentId: organization.id,
            };
        else
            rootNode = await apiClient.explorer.getRootDirectory();

        if (rootNode) {

            fileSystemStore.fsMap.set(rootNode.id, rootNode);

            await apiClient.explorer.getChildren(rootNode.id, rootNode.type);
            setRoot(rootNode);

            setIsLoading(false);
        }
    }
}
