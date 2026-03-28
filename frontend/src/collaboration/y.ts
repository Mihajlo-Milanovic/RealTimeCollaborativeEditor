import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import {FSNode} from "@/collaboration/FSNode";

// One doc per file being edited
export function createFileDoc(fileId: string) {
    const yDoc = new Y.Doc()

    // Persistence (offline support)
    new IndexeddbPersistence(`file-${fileId}`, yDoc)

    // Sync (real-time collab)
    const provider = new WebsocketProvider(
        'wss://your-server',
        `file-${fileId}`,
        yDoc
    )

    // The shared types
    const content = yDoc.getXmlFragment('content')      // → Tiptap
    const meta    = yDoc.getMap('meta')               // title, createdAt, etc.

    return { yDoc, provider, content, meta }
}

// Separate doc (or top-level map) for the file system
export const fsDoc = new Y.Doc()
export const fsTree = fsDoc.getMap<FSNode>('fs')    // entire tree lives here