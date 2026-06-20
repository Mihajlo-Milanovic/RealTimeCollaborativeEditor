import {Server as Hocuspocus} from '@hocuspocus/server';
import {WS_PORT} from '../config/config';

export function startWebSocketServer() {
    const hocuspocus = new Hocuspocus({
        name: 'hocuspocus',
        timeout: 60_000,
        debounce: 5_000,
        maxDebounce: 30_000,
        quiet: true,
        websocketOptions: {maxPayload: 1024 * 1024},
    });

    hocuspocus.listen(WS_PORT, () => {
        console.log(`> Hocuspocus WebSocket server ready on ${hocuspocus.URL}`);
    });

    return hocuspocus;
}