import {useCallback, useEffect, useRef, useState} from "react";
import {fileSystemStore} from "../../../../store/fileSystem";
import {FileNode} from "../../../../models/interfaces/FileNode";
import {YMapEvent} from "yjs";
import {apiClient} from "../../../../lib/apiClient";
import {NodeType} from "../../../../models/types/NodeType";


export function useFileSystem(parentId: string, parentType: NodeType) {

    const childrenMap = useRef<Map<string, FileNode>>(new Map<string, FileNode>());
    const [children, setChildren] = useState<FileNode[]>([]);

    const fsObserver = useCallback((event: YMapEvent<FileNode>) => {

        event.changes.keys.forEach((change, key) => {
            switch (change.action) {
                case 'add':

                    const newNode = fileSystemStore.fsMap.get(key);
                    if (newNode && parentId === newNode.parentId)
                        childrenMap.current.set(key, newNode);
                    // console.log(`Node "${key}" was added. Initial value: "${fileSystemStore.fsMap.get(key)}".`);
                    break;

                case 'update':

                    const updatedNode = fileSystemStore.fsMap.get(key);
                    if (updatedNode && parentId === updatedNode.parentId)
                        childrenMap.current.set(key, updatedNode);
                    else
                        childrenMap.current.delete(key);

                    // console.log(`Node "${key}" was updated. New value: "${fileSystemStore.fsMap.get(key)}". Previous value: "${change.oldValue}".`);
                    break;

                case 'delete':

                    childrenMap.current.delete(key);
                // console.log(`Node "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`);
            }
        });

        setChildren(Array.from(childrenMap.current.values()));
    }, [parentId]);

    useEffect(() => {
        if (!fileSystemStore.doc ||
            !parentId ||
            !(parentType === NodeType.DIR || parentType === NodeType.ORG)
        )
            return;

        fileSystemStore.fsMap.observe(fsObserver);
        console.log("[OBSERVER] set");

        console.log("Fetching children for directory: ", parentId);
        apiClient.explorer.getChildren(parentId, parentType);

        const globalMapForCleanup = fileSystemStore.fsMap;
        const localMapForCleanup = childrenMap.current;

        return () => {

            try {
                setChildren([]);
                localMapForCleanup.clear();
                globalMapForCleanup.unobserve(fsObserver);
            } catch (e) {
                console.log("[OBSERVER] ", e);
            } finally {
                console.log("[OBSERVER] destroyed");
            }
        };
    }, [parentId, fileSystemStore.doc]);

    return {
        children
    }


}
