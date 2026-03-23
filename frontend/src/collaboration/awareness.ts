import { WebsocketProvider } from "y-websocket"

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ef4444"]

export function pickColor(seed: string) {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i)
    }
    return COLORS[Math.abs(hash) % COLORS.length]
}

export function setupAwareness(provider: WebsocketProvider, user: { name: string; color: string }) {
    provider.awareness.setLocalStateField("user", user)
}
