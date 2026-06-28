import {Server as Hocuspocus} from '@hocuspocus/server';
import * as Y from 'yjs';
import {WS_PORT} from '../config/config';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';

export function startWebSocketServer() {
    const hocuspocus = new Hocuspocus({
        name: 'hocuspocus',
        timeout: 60_000,
        debounce: 5_000,
        maxDebounce: 30_000,
        quiet: true,
        websocketOptions: {maxPayload: 1024 * 1024},

        // Učitavanje trajno sačuvanog Yjs stanja iz backenda kada se dokument
        // prvi put otvori. Koristi POSTOJEĆI mehanizam: GET /files/:id/state
        // (-> file.yDocState). documentName == fileId (ime sobe editora).
        async onLoadDocument({documentName, document}) {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/files/${encodeURIComponent(documentName)}/state`
                );
                if (res.ok) {
                    const buffer = await res.arrayBuffer();
                    if (buffer.byteLength > 0) {
                        Y.applyUpdate(document, new Uint8Array(buffer));
                    }
                }
            } catch {
                // Dokumenti koji nisu fajl (fs-tree soba = org/user id) nemaju
                // File zapis -> nema šta da se učita; nastavi sa praznim doc-om.
            }
            return document;
        },

        // Trajno čuvanje Yjs stanja u backend. Koristi POSTOJEĆI mehanizam:
        // POST /files/:id/state (-> setStateForFileWithId). Hocuspocus ovo zove
        // debounce-ovano i pre unload-a dokumenta (kada se svi klijenti odjave),
        // pa se poslednje stanje sačuva i kada svi zatvore dokument.
        async onStoreDocument({documentName, document}) {
            try {
                const update = Y.encodeStateAsUpdate(document);
                await fetch(
                    `${BACKEND_URL}/files/${encodeURIComponent(documentName)}/state`,
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/octet-stream'},
                        body: Buffer.from(update),
                    }
                );
            } catch {
                // Ne-fajl dokumenti / mrežne greške -> preskoči, ne ruši server.
            }
        },
    });

    hocuspocus.listen(WS_PORT, () => {
        console.log(`> Hocuspocus WebSocket server ready on ${hocuspocus.URL}`);
    });

    return hocuspocus;
}
