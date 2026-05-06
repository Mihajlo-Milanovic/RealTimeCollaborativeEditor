declare module 'y-websocket/bin/utils' {
    import { WebSocket } from 'ws'
    import { IncomingMessage } from 'http'

    interface SetupOptions {
        gc?: boolean
        pingTimeout?: number
        docName?: string
    }

    export function setupWSConnection(
        conn: WebSocket,
        req: IncomingMessage,
        options?: SetupOptions
    ): void;
}