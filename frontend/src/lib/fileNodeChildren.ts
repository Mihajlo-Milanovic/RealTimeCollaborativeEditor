import {fileSystemStore} from "../store/fileSystem";


export function fileNodeChildren(root: string){

    return [...fileSystemStore.fsMap.values()]
        .filter(it => it.parentId == root)
        .sort((a, b) => a.name.localeCompare(b.name));
}

// export function useFileNodeChildren(root: FileNode){
//
//     const [children, setChildren] = useState<FileNode[]>([]);
//
//     useEffect(() => {
//         if (!root) return;
//         setChildren(fileNodeChildren(root.id));
//         console.log("FS_MAP_SIZE ::::: >>>>>", children.length);
//     }, [root]);
//
//     return { children };
// }
