import * as Y from 'yjs';
import {WebsocketProvider} from 'y-websocket';
import {getBinary} from "@/app/api/serverRequests/methods";


export interface CollabProvider {
    yDoc: Y.Doc
    provider: WebsocketProvider
}

export interface CollabAwarenessLocalState {
    username: string;
    color: string;
}

function getRandomColor(seed: string): string {

    const colors = [
        '#F98181', '#FBBC88', '#FAF594',
        '#94FADB', '#B9F18D', "#f97316",
        "#22c55e", "#eab308", "#ef4444"
    ];

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
    }
    return colors[Math.abs(hash) % colors.length];
    // return colors[Math.floor(Math.random() * colors.length)];
}

export function createCollabProvider(fileId: string, username: string): CollabProvider {
    const yDoc = new Y.Doc()

    const wsBase = typeof window !== 'undefined' ?
        `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}` :
        'ws://localhost:3000';

    try {

    } catch (e) {
        console.error("Load state failed:", e);
    }

    const provider = new WebsocketProvider(wsBase, `ws/${fileId}`, yDoc, {connect: true})

    // Set local user awareness state — this is what drives cursor presence
    provider.awareness.setLocalStateField("username", username);
    provider.awareness.setLocalStateField("color", getRandomColor(username));
    console.log("Local state set", provider.awareness.getLocalState());

    return {yDoc, provider}
}

export async function syncState(fileId: string, yDoc: Y.Doc) {
    console.log("Syncing state for file: ", fileId);
    const state = await getBinary(`files/${fileId}/state`);
    if (state.byteLength > 0) {
        Y.applyUpdate(yDoc, state);
    }
}

