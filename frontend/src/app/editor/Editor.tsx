'use client';

import {getRandomColor} from "@/lib/yjsProvider";
import {EditorInner} from "@/app/editor/components/tiptap-templates/simple/simple-editor";
import {useEffect, useRef, useState} from "react";
import {useHocuspocusProvider} from "@hocuspocus/provider-react";


//Tiptap
import {useEditor} from "@tiptap/react";
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
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Collaboration from "@tiptap/extension-collaboration";
import {syncState} from "@/lib/yjsProvider";

export default function Editor(
    {
        selectedFileId,
        username
    }: {
        selectedFileId: string | null,
        username: string
    }
) {

    const [isLoading, setIsLoading] = useState(true);
    // const [isConnected, setIsConnected] = useState(false);
    // const dirtyRef = useRef(false);

    const provider = useHocuspocusProvider();

    const editor = useEditor({
        immediatelyRender: false,
        editable: true,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor-content prose prose-invert max-w-none min-h-[400px] p-4 outline-none",
            },
        },
        extensions: [
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
                document: provider.document,

            }),
            CollaborationCursor.configure({
                provider,
                user: {
                    name: username || 'Anonymous',
                    color: getRandomColor(username) || '#ff0000',
                },

            }),
        ],
    })

    // useEffect(() => {
    //
    //     if (!selectedFileId) return;
    //     // const collabProvider = createCollabProvider(fileId, username);
    //     // setYDoc(collabProvider.yDoc);
    //     // setProvider(collabProvider.provider);
    //
    //     const onUpdate = () => {
    //         dirtyRef.current = true;
    //     }
    //
    //     yDoc?.on("update", onUpdate);
    //
    //     // return () => {
    //     //     // clearInterval(interval);
    //     //     console.log("Deleting document for file: ", selectedFileId);
    //     //     yDoc?.off("update", onUpdate);
    //     //     provider?.destroy();
    //     //     yDoc?.destroy();
    //     //     dirtyRef.current = false;
    //     // }
    // }, [selectedFileId])

    useEffect(() => {
        setIsLoading(true);
        if (!selectedFileId || !provider.document) return;
        syncState(selectedFileId, provider.document).then(() => setIsLoading(false));

    }, [provider.document]);

    // Track WebSocket connection status
    // useEffect(() => {
    //
    //     console.log("Provider: ", provider);
    //
    //     if (!provider || !provider.awareness) return;
    //
    //     provider.awareness.setLocalStateField("username", username);
    //     provider.awareness.setLocalStateField("color", getRandomColor(username));
    //     // const handleStatus = ({status}: { status: string }) => {
    //     //     setIsConnected(status === 'connected');
    //     // };
    //     //
    //     // provider.on('status', handleStatus);
    //     //
    //     // return () => {
    //     //     provider.off('status', handleStatus);
    //     // };
    // }, [provider]);

    return (
        <div className="editor-wrapper">

            {isLoading && (
                <div className="p-4 text-sm text-gray-400">Loading document...</div>
            )}

            {provider && (
                <EditorInner editor={editor}/>
            )}
        </div>
    );
}
