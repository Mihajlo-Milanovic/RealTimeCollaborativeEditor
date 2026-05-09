import {createServer} from 'node:http';
import {parse} from 'node:url';
import next from 'next';
import {Server as Hocuspocus} from '@hocuspocus/server';
import {ENV, PORT, COLLABORATION_PATH, HOST} from '@/config/config';
import {WebSocketServer} from "ws";
import {IncomingMessage} from "http";

const dev = ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {

    const hocuspocus = new Hocuspocus({
        name: 'hocuspocus',
        timeout: 60_000,
        debounce: 5_000,
        maxDebounce: 30_000,
        quiet: true,
        websocketOptions: {maxPayload: 1024 * 1024},
    });

    const wss = new WebSocketServer({noServer: true});

    const server = createServer((req, res) => {
        if (req.url === '/health') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'ok'}));
            return;
        }

        handle(req, res, parse(req.url ?? '/', true));
    });

// Route WebSocket upgrades — Next.js HMR vs Hocuspocus stay completely separate
    server.on('upgrade', (request, socket, head) => {
        const url = request.url ?? '/';

        if (url.slice(1).startsWith(COLLABORATION_PATH)) {
            wss.handleUpgrade(request, socket, head, (ws) => {
                hocuspocus.hocuspocus.handleConnection(ws, toWebRequest(request));
            });
        } else {
            // Let Next.js handle its own upgrades (e.g. HMR in dev)
            app.getUpgradeHandler()(request, socket, head);
        }
    });

    server.listen(PORT, () => {
        console.log(`> Ready on http://${HOST} [${dev ? 'dev' : 'production'}]`);
    });
});

function toWebRequest(req: IncomingMessage): Request {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
        } else {
            headers.set(key, value);
        }
    }

    return new Request(url, {
        method: req.method ?? 'GET',
        headers,
        // GET/HEAD must not have a body
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req as any : null,
    });
}