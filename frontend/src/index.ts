import { startNextServer } from './server/next';
import { startWebSocketServer } from './server/websocket';

(async () => {

    const hp = startWebSocketServer();
    console.log(hp.address);
    console.log(hp.URL);
    await startNextServer();  // PORT    — Next.js only
})();