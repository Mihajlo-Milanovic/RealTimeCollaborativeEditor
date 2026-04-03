import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import next from 'next'
import { WebSocketServer, WebSocket } from 'ws'
import * as ywsUtils from 'y-websocket/bin/utils'

const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ response: 'ok' }))
            return
        }

        const parsedUrl = parse(req.url ?? '/', true)
        handle(req, res, parsedUrl)
    })

    const wss = new WebSocketServer({ server })

    wss.on('connection', (conn: WebSocket, req: IncomingMessage) => {
        if (!req.url?.startsWith('/ws/')) return

        ywsUtils.setupWSConnection(conn, req, {
            gc: req.url.slice(1) !== 'ws/prosemirror-versions',
        })
    })

    server.listen(3000, () => {
        console.log(`> Ready on http://localhost:3000 [${dev ? 'dev' : 'production'}]`)
    })
})