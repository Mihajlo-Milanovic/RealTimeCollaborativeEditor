import {useEffect, useState} from "react";
import {FileNode} from "../../../../models/interfaces/FileNode";
import {fileSystemStore} from "../../../../store/fileSystem";


export function useChildrenItems(parent: FileNode | null, isLoading: boolean) {

    const [children, setChildren] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isLoading || !parent)
            return;

        const observer = () => {
            setChildren(fileSystemStore.fsMap?.get(parent.id) || []);
        }

        fileSystemStore.subscribe(parent.id, observer);
        console.log("children for: ", parent.id, " => ", children);

        return () => {

            try {
                setChildren([]);
                fileSystemStore.unsubscribe(observer);
            } catch (e) {
                console.log("[Subscription] ", e);
            } finally {
                console.log("[Subscription] for: ", parent.id, " destroyed");
            }
        };
    }, [parent, isLoading]);

    return {
        children,
        loadingChildren: loading,
        refresh: () => {
            setLoading(true);
            // setChildren(fileSystemStore.fsMap.get(parent.id));
            setLoading(false);
        }
    }
}
