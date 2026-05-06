"use client"

import * as React from "react"
import {EditorContent, EditorContext, useEditor} from "@tiptap/react"
import {useSession} from "next-auth/react"

// --- Tiptap Core Extensions ---
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

// --- UI Primitives ---
import {Button} from "@/components/tiptap-ui-primitive/button"
import {Spacer} from "@/components/tiptap-ui-primitive/spacer"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Styles ---
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-templates/simple/simple-editor.scss"

// --- Tiptap UI ---
import {HeadingDropdownMenu} from "@/components/tiptap-ui/heading-dropdown-menu"
import {ListDropdownMenu} from "@/components/tiptap-ui/list-dropdown-menu"
import {BlockquoteButton} from "@/components/tiptap-ui/blockquote-button"
import {CodeBlockButton} from "@/components/tiptap-ui/code-block-button"
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/tiptap-ui/link-popover"
import {MarkButton} from "@/components/tiptap-ui/mark-button"
import {TextAlignButton} from "@/components/tiptap-ui/text-align-button"
import {UndoRedoButton} from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import {ArrowLeftIcon} from "@/components/tiptap-icons/arrow-left-icon"
import {HighlighterIcon} from "@/components/tiptap-icons/highlighter-icon"
import {LinkIcon} from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import {useMobile} from "@/hooks/use-mobile"
import {useWindowSize} from "@/hooks/use-window-size"
import {useCursorVisibility} from "@/hooks/use-cursor-visibility"

// --- Yjs ---
import * as Y from "yjs"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import {WebsocketProvider} from "y-websocket"
import {CollabAwarenessLocalState, createCollabProvider, syncState} from "@/lib/yjsProvider";
import {useEffect, useRef, useState} from "react";


const MainToolbarContent = (
    {
        onHighlighterClick,
        onLinkClick,
        isMobile,
    }: {
        onHighlighterClick: () => void
        onLinkClick: () => void
        isMobile: boolean
    }) => {
    return (
        <>
            <Spacer/>

            <ToolbarGroup>
                <UndoRedoButton action="undo"/>
                <UndoRedoButton action="redo"/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]}/>
                <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]}/>
                <BlockquoteButton/>
                <CodeBlockButton/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <MarkButton type="bold"/>
                <MarkButton type="italic"/>
                <MarkButton type="strike"/>
                <MarkButton type="code"/>
                <MarkButton type="underline"/>
                {!isMobile ? (
                    <ColorHighlightPopover/>
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick}/>
                )}
                {!isMobile ? <LinkPopover/> : <LinkButton onClick={onLinkClick}/>}
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <MarkButton type="superscript"/>
                <MarkButton type="subscript"/>
            </ToolbarGroup>

            <ToolbarSeparator/>

            <ToolbarGroup>
                <TextAlignButton align="left"/>
                <TextAlignButton align="center"/>
                <TextAlignButton align="right"/>
                <TextAlignButton align="justify"/>
            </ToolbarGroup>

            <Spacer/>
        </>
    )
}

const MobileToolbarContent = (
    {
        type,
        onBack,
    }: {
        type: "highlighter" | "link"
        onBack: () => void
    }) => (
    <>
        <ToolbarGroup>
            <Button data-style="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon"/>
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon"/>
                ) : (
                    <LinkIcon className="tiptap-button-icon"/>
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator/>

        {type === "highlighter" ? (
            <ColorHighlightPopoverContent/>
        ) : (
            <LinkContent/>
        )}
    </>
)

export function SimpleEditor(
    {
        fileId,
        username,
    }: {
        fileId: string,
        username: string
    }
) {

    const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
    const [provider, setProvider] = useState<WebsocketProvider | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const dirtyRef = React.useRef(false);

    useEffect(() => {

        if (!fileId) return;
        const collabProvider = createCollabProvider(fileId, username);
        setYDoc(collabProvider.yDoc);
        setProvider(collabProvider.provider);

        const onUpdate = () => {
            dirtyRef.current = true;
        }

        yDoc?.on("update", onUpdate);

        return () => {
            // clearInterval(interval);
            console.log("Deleting document for file: ", fileId);
            yDoc?.off("update", onUpdate);
            provider?.destroy();
            yDoc?.destroy();
            dirtyRef.current = false;
        }
    }, [fileId])

    useEffect(() => {
        setIsLoading(true);
        if (!fileId || !yDoc) return;
        syncState(fileId, yDoc).then(() => setIsLoading(false));

        return () => {
            yDoc.destroy();
        }
    }, [yDoc]);

    // Track WebSocket connection status
    useEffect(() => {

        if (!provider) return;
        const handleStatus = ({status}: { status: string }) => {
            setIsConnected(status === 'connected');
        };

        provider.on('status', handleStatus);

        return () => {
            provider.off('status', handleStatus);
        };
    }, [provider]);

    if (!fileId) {
        return <div className="p-4 text-sm text-gray-400">Collaborate with ease</div>
    }

    if (isLoading) {
        return <div className="p-4 text-sm text-gray-400">Loading document...</div>
    }
    if (yDoc && provider) {
        return <EditorInner fileId={fileId} yDoc={yDoc} provider={provider}/>
    }
}

function EditorInner(
    {
        fileId,
        yDoc,
        provider,
    }: {
        fileId: string
        yDoc: Y.Doc
        provider: WebsocketProvider
    }) {
    const isMobile = useMobile()
    const windowSize = useWindowSize()
    const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main")
    const toolbarRef = React.useRef<HTMLDivElement>(null)

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
                document: yDoc,

            }),
            CollaborationCursor.configure({
                provider,
                user: {
                    username: (provider.awareness.getLocalState() as CollabAwarenessLocalState).username || "Anonymous",
                    color: (provider.awareness.getLocalState() as CollabAwarenessLocalState).color || '#ff0000',
                },
            }),
        ],
    })

    const bodyRect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    })

    React.useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main")
        }
    }, [isMobile, mobileView])

    if (!editor) {
        return <div className="p-4 text-sm text-gray-400">Loading editor…</div>
    }

    return (
        <EditorContext.Provider value={{editor}}>
            <Toolbar
                ref={toolbarRef}
                style={
                    isMobile
                        ? {
                            bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
                        }
                        : {}
                }
            >
                {mobileView === "main" ? (
                    <MainToolbarContent
                        onHighlighterClick={() => setMobileView("highlighter")}
                        onLinkClick={() => setMobileView("link")}
                        isMobile={isMobile}
                    />
                ) : (
                    <MobileToolbarContent
                        type={mobileView === "highlighter" ? "highlighter" : "link"}
                        onBack={() => setMobileView("main")}
                    />
                )}
            </Toolbar>

            <div className="content-wrapper">
                <EditorContent editor={editor} role="presentation" className="simple-editor-content"/>
            </div>
        </EditorContext.Provider>
    )
}