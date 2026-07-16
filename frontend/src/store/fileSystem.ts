import * as Y from "yjs";
import {FileNode} from "../models/interfaces/FileNode";
import {YMapEvent} from "yjs";

class FileSystemStore {
    private static instance: FileSystemStore;

    private _doc: Y.Doc | null = null;
    private _map: Y.Map<FileNode[]> | null = null;
    private _observers = new Map<() => void, (event: YMapEvent<FileNode[]>) => void>();
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

    subscribe(nodeId: string, observer: () => void) {
        this._observers.set(observer, (event: YMapEvent<FileNode[]>) => {
            event.keys.forEach((_, key) => {
                if (key == nodeId)
                    observer()
            });
        });
        const o = this._observers.get(observer);
        if (o) {
            this._map!.observe(o);
        }
    }

    unsubscribe(observer: () => void) {
        const o = this._observers.get(observer);
        if (o) {
            this._map!.unobserve(o);
            this._observers!.delete(observer);
        }
    }

    notifyObservers() {
        // this._observers.keys().forEach(o => o())
    }
}

export const fileSystemStore = FileSystemStore.getInstance();
