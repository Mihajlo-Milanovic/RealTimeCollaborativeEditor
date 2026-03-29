import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import Highlight from "@tiptap/extension-highlight"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"

export function getEditorExtensions(ydoc: Y.Doc, provider: WebsocketProvider, user: any){
  return [
    StarterKit.configure({
      history: false,
    }),
    TextAlign.configure({types: ["heading", "paragraph"]}),
    Underline,
    TaskList,
    TaskItem.configure({nested: true}),
    Highlight.configure({multicolor: true}),
    Image,
    Typography,
    Superscript,
    Subscript,
    Link.configure({
      openOnClick: false,
    }),
    Collaboration.configure({
      document: ydoc,
    }),
    CollaborationCursor.configure({
      provider,
      user: user,
    }),
  ]
}
