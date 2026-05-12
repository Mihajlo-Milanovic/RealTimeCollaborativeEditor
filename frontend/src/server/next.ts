import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { ENV, PORT, HOST } from '../config/config';

export async function startNextServer() {
    const dev = ENV !== 'production';
    const app = next({ dev });
    const handle = app.getRequestHandler();

    await app.prepare();

    const server = createServer(
        (req, res) => {
        handle(req, res, parse(req.url ?? '/', true));
    });

    // Hand HMR (and any other Next.js WS) upgrades back to Next
    server.on('upgrade', app.getUpgradeHandler());

    server.listen(PORT, () => {
        console.log(`> Next.js ready on http://${HOST}:${PORT} [${dev ? 'dev' : 'production'}]`);
    });

    return server;
}