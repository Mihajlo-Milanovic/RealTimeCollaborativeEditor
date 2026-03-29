import { useEditor as useTiptapEditor, Editor } from "@tiptap/react"
import { getEditorExtensions } from "@/editor/editor"
import {Doc} from "yjs"
import { WebsocketProvider } from "y-websocket"
import {UserView} from "@/app/core/types/UserView";

export function useEditor(ydoc: Doc, provider: WebsocketProvider, user: UserView): Editor | null {
  return useTiptapEditor({
    immediatelyRender: false,
    editable: true,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: "simple-editor-content prose prose-invert max-w-none min-h-[400px] p-4 outline-none",
      },
    },
    extensions: getEditorExtensions(ydoc, provider, user),
  })
}
