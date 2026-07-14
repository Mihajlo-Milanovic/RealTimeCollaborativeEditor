import {useEffect, useState} from "react";
import {fileSystemStore} from "../../../../store/fileSystem";


export function useFileSystemMap(selectedFile: string) {

    const [currentFile, setCurrentFile] = useState<string>("");

    useEffect(() => {

        if (!fileSystemStore.initialized || !selectedFile) {
            setCurrentFile("");
            return;
        }

        setCurrentFile(fileSystemStore.fsMap.has(selectedFile) ? selectedFile : "");

        const observer = () => {
            const fileExists = fileSystemStore.fsMap.has(selectedFile);
            setCurrentFile(fileExists ? selectedFile : "");
        };

        fileSystemStore.subscribe(selectedFile, observer);

        return () => {
            try {
                fileSystemStore.unsubscribe(observer);
            } catch (e) {
                console.log("[Subscription] ", e);
            } finally {
                console.log("[Subscription] for: ", selectedFile, " destroyed");
            }
        };

    }, [selectedFile]);

    return {currentFile};
}
