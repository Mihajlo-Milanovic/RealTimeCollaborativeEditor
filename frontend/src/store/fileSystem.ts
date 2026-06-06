import * as Y from "yjs";
import {FileNode} from "../models/interfaces/FileNode";

class FileSystemStore {
    private static instance: FileSystemStore;

    private _doc: Y.Doc | null;
    private _map: Y.Map<FileNode> | null;

    // private constructor() {
    //     this._doc = new Y.Doc();
    // }

    static getInstance(): FileSystemStore {
        if (!FileSystemStore.instance) {
            FileSystemStore.instance = new FileSystemStore();
            this.instance._doc = null;
            this.instance._map = null;
        }
        return FileSystemStore.instance;
    }

    init(doc: Y.Doc): void {
        this._doc = doc;
        this._map = this._doc.getMap("fileSystem");
    }

    get initialized(): boolean {
        return !!this._doc;
    }

    private checkInitialized(): void {
        if (!this.initialized) {
            throw new Error("FileSystemStore is not initialized. Call init() first.");
        }
    }

    get doc(): Y.Doc | null {
        return this._doc;
    }

    get fsMap() {
        this.checkInitialized();
        return this._map;
    }


    // testObserver(event : Y.YMapEvent<FileNode>){
    //     if (event.target !== this._map) return;
    //     // => true
    //
    //     // Find out what changed:
    //     // Option 1: A set of keys that changed
    //     // event.keysChanged // => Set<strings>
    //     // Option 2: Compute the differences
    //     //event.changes.keys // => Map<string, { action: 'add'|'update'|'delete', oldValue: any}>
    //
    //     // sample code.
    //     event.changes.keys.forEach((change, key) => {
    //         if (change.action === 'add') {
    //             console.log(`Property "${key}" was added. Initial value: "${this._map.get(key)}".`);
    //         } else if (change.action === 'update') {
    //             console.log(`Property "${key}" was updated. New value: "${this._map.get(key)}". Previous value: "${change.oldValue}".`);
    //         } else if (change.action === 'delete') {
    //             console.log(`Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`);
    //         }
    //     });
    // }
    //
    // test(){
    //     this._map.observe(this.testObserver);
    //
    //     this._map.set('key', {
    //         id: "testId",
    //         type: "dir",
    //         parentId: null,
    //         name: "TEST"
    //     } as FileNode) // => Property "key" was added. Initial value: "value".
    //
    //     this._map.set('key',  {
    //         id: "newID",
    //         type: "org",
    //         parentId: null,
    //         name: "NOTHING_HERE"
    //     } as FileNode) // => Property "key" was updated. New value: "new". Previous value: "value".
    //
    //     this._map.delete('key') // => Property "key" was deleted. New value: undefined. Previous Value: "new".
    //
    //     this._map.unobserve(this.testObserver);
    // }
}

export const fileSystemStore = FileSystemStore.getInstance();
