import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';
import * as ywsUtils from 'y-websocket/bin/utils';
import type { ExplorerEvent } from './models/types/ExplorerEvent';
import {ExplorerSocket} from "@/models/interfaces/ExplorerSocket";

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer( async (req: IncomingMessage, res: ServerResponse) => {

        // ── Internal broadcast endpoint ──────────────────────────────
        // Called by the backend after every file mutation.
        // Bind to localhost only in production, so it's never
        // reachable from the public internet.

        if (req.method === 'POST' && req.url === '/internal/broadcast') {
            const secret = req.headers['x-internal-secret'];

            if (secret !== process.env.INTERNAL_BROADCAST_SECRET) {
                res.writeHead(401);
                res.end();
                return;
            }

            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
                try {
                    const event: ExplorerEvent = JSON.parse(body);
                    broadcastToExplorerClients(wss, event);
                    res.writeHead(204);
                } catch {
                    res.writeHead(400);
                }
                res.end();
            });
            return;
        }

        // ── Health check ─────────────────────────────────────────────
        if (req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response: 'ok' }));
            return;
        }

        // ── Everything else goes to Next.js ──────────────────────────
        const parsedUrl = parse(req.url ?? '/', true);
        handle(req, res, parsedUrl);
    })

    const wss = new WebSocketServer({ server });

    wss.on('connection', (conn: ExplorerSocket, req: IncomingMessage) => {
        const url  = req.url ?? "";

        if (url === "ws/explorer"){
            conn.__isExplorer = true;
            return;
        }

        if (url.startsWith('/ws/')) {
            ywsUtils.setupWSConnection(conn, req, {
                gc: url.slice(1) !== 'ws/prosemirror-versions',
            });
        }
    });

    server.listen(3000, () => {
        console.log(`> Ready on http://localhost:3000 [${dev ? 'dev' : 'production'}]`);
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