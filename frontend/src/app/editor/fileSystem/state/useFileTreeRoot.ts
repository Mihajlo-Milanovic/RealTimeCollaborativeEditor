import {useEffect, useState} from "react"
import {FileNode} from "../../../../models/interfaces/FileNode"
import {OrganizationView} from "../../../../models/types/views/OrganizationView";
import {NodeType} from "../../../../models/types/NodeType";
import {apiClient} from "../../../../lib/apiClient";
import {useHocuspocusProvider} from "@hocuspocus/provider-react";
import {fileSystemStore} from "../../../../store/fileSystem";


export function useFileTreeRoot(userId: string, organization: OrganizationView | null) {

    const [root, setRoot] = useState<FileNode | null>(null);
    const [loading, setLoading] = useState(true);

    const provider = useHocuspocusProvider();
    const [synced, setSynced] = useState(false);

    useEffect(() => {
        if (!provider) return;
        provider.on("synced", () => setSynced(true));
    }, [provider]);

    useEffect(() => {
        if (!userId) return;

        fileSystemStore.init(provider.document);

        //Fetch root
        setLoading(true);

        let rootNode: FileNode;

        if (organization != null) {
            rootNode = {
                id: organization.id,
                name: organization.name,
                type: NodeType.ORG,
                parents: "",
            };

            fileSystemStore.fsMap?.set("", [rootNode]);
            setRoot(rootNode);
            setLoading(false);

        } else
            apiClient.explorer.getRootDirectory().then((rootNode) => {
                if (rootNode) {

                    fileSystemStore.fsMap?.set("", [rootNode]);
                    setRoot(rootNode);
                    setLoading(false);
                }
            });

        // Zavisnost je organization?.id (ne ceo objekat): realtime promena uloge
        // zameni objekat organizacije novim (isti id), a stablo ne treba ponovo
        // učitavati — menja se samo prikaz dugmadi po ulozi.
    }, [userId, organization?.id, provider.document]);

    return {
        root,
        isLoading: loading || !synced,
    };


}
