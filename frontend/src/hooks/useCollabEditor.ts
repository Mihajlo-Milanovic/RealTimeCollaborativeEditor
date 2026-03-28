// import { useEditor } from '@tiptap/react'
// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
// import StarterKit from '@tiptap/starter-kit'
// import {createFileDoc} from "@/collaboration/y";
//
// function useCollabEditor(fileId: string) {
//     const { yDoc, provider } = createFileDoc(fileId)
//
//     return useEditor({
//         extensions: [
//             StarterKit.configure({ history: false }),  // Y.js handles undo
//             Collaboration.configure({ document: yDoc }),
//             CollaborationCursor.configure({
//                 provider,
//                 user: { name: currentUser.name, color: currentUser.color }
//             }),
//         ]
//     })
// }