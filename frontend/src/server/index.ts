import { startNextServer } from './next';
import { startWebSocketServer } from './websocket';

(async () => {
    startWebSocketServer();   // WS_PORT — Hocuspocus only
    await startNextServer();  // PORT    — Next.js only
})();