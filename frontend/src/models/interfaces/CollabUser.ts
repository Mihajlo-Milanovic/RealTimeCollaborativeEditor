import {CollabUser as HPCollabUser} from "@hocuspocus/provider-react"

export interface CollabUser extends HPCollabUser {
    username: string,
    color: string
}