import {parse} from 'url';
import next from 'next';
import {WebSocketServer, WebSocket} from 'ws';
import type {ExplorerEvent} from './models/types/ExplorerEvent';
import {ExplorerSocket} from "@/models/interfaces/ExplorerSocket";
import {Server} from '@hocuspocus/server';
import {ENV, WS_PORT} from "@/config/config";

const dev = ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {

    // const ws = new WebSocket("ws://localhost:3000");

    const server = new Server({
        address: "localhost",
        name: 'hocuspocus',
        port: 3000,
        timeout: 60000,
        debounce: 5000,
        maxDebounce: 30000,
        quiet: true,
        websocketOptions: {maxPayload: 1024 * 1024},
        // async onConnect({request, instance}) {
        //     const url = request.url ?? '';
        //     if (url.startsWith('ws/') || url.startsWith('wss/')) {
        //         instance.handleConnection(ws, request);
        //     }
        // },
        async onRequest({request, response}) {

        // ── Health check ─────────────────────────────────────────────
        if (request.url === '/health') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({response: 'ok'}));
            return;
        }

        // ── Everything else goes to Next.js ──────────────────────────
        const parsedUrl = parse(request.url ?? '/', true);
        await handle(request, response, parsedUrl);
    }
    });

    server.listen().then(() => {
        console.log(`> Ready on http://localhost:3000`);
    });
});

function broadcastToExplorerClients(wss: WebSocketServer, event: ExplorerEvent) {
    const message = JSON.stringify(event);
    wss.clients.forEach((client) => {
        const socket = client as ExplorerSocket;
        if (socket.__isExplorer && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    })
}