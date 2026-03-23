import { useEffect } from "react"
import { WebsocketProvider } from "y-websocket"
import { setupAwareness, pickColor } from "@/collaboration/awareness"

export function useAwareness(provider: WebsocketProvider | null, user: any) {
    useEffect(() => {
        if (provider && user) {
            setupAwareness(provider, {
                name: user.username || user.email || "Anonymous",
                color: pickColor(String(user.id || user.email || "anonymous")),
            })
        }
    }, [provider, user])
}
