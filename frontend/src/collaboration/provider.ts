import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"

const WS_URL = process.env.NEXT_PUBLIC_YJS_WS_URL || "ws://localhost:1234"

export function createProvider(fileId: string, doc: Y.Doc): WebsocketProvider {
    return new WebsocketProvider(WS_URL, `file:${fileId}`, doc, { connect: true })
}
