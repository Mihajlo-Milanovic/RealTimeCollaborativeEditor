import { Server as Hocuspocus } from '@hocuspocus/server';
import { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
import { IncomingMessage } from 'node:http';
import {COLLABORATION_PATH, WS_PORT, HOST, WS_PROTOCOL} from '@/config/config';

function toWebRequest(req: IncomingMessage): Request {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        Array.isArray(value)
            ? value.forEach((v) => headers.append(key, v))
            : headers.set(key, value);
    }

    return new Request(url, {
        method: req.method ?? 'GET',
        headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? (req as any) : null,
    });
}

export function startWebSocketServer() {
    const hocuspocus = new Hocuspocus({
        name: 'hocuspocus',
        timeout: 60_000,
        debounce: 5_000,
        maxDebounce: 30_000,
        quiet: true,
        websocketOptions: { maxPayload: 1024 * 1024 },
    });

    const wss = new WebSocketServer({ noServer: true });

    const server = createServer((req, res) => {
        if (req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok' }));
            return;
        }
        res.writeHead(404);
        res.end();
    });

    server.on('upgrade', (request, socket, head) => {
        const pathname = new URL(
            request.url ?? '/',
            `http://${request.headers.host ?? 'localhost'}`
        ).pathname;

        // if (pathname !== COLLABORATION_PATH) {
        //     socket.destroy();
        //     return;
        // }

        wss.handleUpgrade(request, socket, head, (ws) => {
            hocuspocus.hocuspocus.handleConnection(ws, toWebRequest(request));
        });
    });

    server.listen(WS_PORT, () => {
        console.log(`> WebSocket server ready on ${WS_PROTOCOL}://${HOST}:${WS_PORT}`);
    });

    return server;
}