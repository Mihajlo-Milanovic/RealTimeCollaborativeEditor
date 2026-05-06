import {WebSocket} from "ws";


export interface ExplorerSocket extends WebSocket {
    __isExplorer?: boolean
}