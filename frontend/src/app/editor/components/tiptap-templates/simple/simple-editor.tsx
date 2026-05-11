"use client"

import * as React from "react";
import {Editor, EditorContent, EditorContext, useEditor} from "@tiptap/react";
import * as CustomToolbar from "@/app/editor/components/Toolbar"

// --- UI Primitives ---
import {Button} from "@/app/editor/components/tiptap-ui-primitive/button"
import {Spacer} from "@/app/editor/components/tiptap-ui-primitive/spacer"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/app/editor/components/tiptap-ui-primitive/toolbar"

// --- Styles ---
import "@/app/editor/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/app/editor/components/tiptap-node/list-node/list-node.scss"
import "@/app/editor/components/tiptap-node/image-node/image-node.scss"
import "@/app/editor/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/app/editor/components/tiptap-templates/simple/simple-editor.scss"

// --- Tiptap UI ---
import {HeadingDropdownMenu} from "@/app/editor/components/tiptap-ui/heading-dropdown-menu"
import {ListDropdownMenu} from "@/app/editor/components/tiptap-ui/list-dropdown-menu"
import {BlockquoteButton} from "@/app/editor/components/tiptap-ui/blockquote-button"
import {CodeBlockButton} from "@/app/editor/components/tiptap-ui/code-block-button"
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/app/editor/components/tiptap-ui/color-highlight-popover"
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/app/editor/components/tiptap-ui/link-popover"
import {MarkButton} from "@/app/editor/components/tiptap-ui/mark-button"
import {TextAlignButton} from "@/app/editor/components/tiptap-ui/text-align-button"
import {UndoRedoButton} from "@/app/editor/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import {ArrowLeftIcon} from "@/app/editor/components/tiptap-icons/arrow-left-icon"
import {HighlighterIcon} from "@/app/editor/components/tiptap-icons/highlighter-icon"
import {LinkIcon} from "@/app/editor/components/tiptap-icons/link-icon"

// --- Hooks ---
import {useMobile} from "@/hooks/use-mobile"
import {useWindowSize} from "@/hooks/use-window-size"
import {useCursorVisibility} from "@/hooks/use-cursor-visibility"
import {useEffect, useRef, useState} from "react";
import {from} from "lib0/set";
import {HocuspocusRoom, useHocuspocusProvider} from "@hocuspocus/provider-react";
import {getRandomColor, syncState} from "@/lib/yjsProvider";
import {useSelectedFile} from "@/store/selectedFile";


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

export function EditorInner(
    {username}: { username: string }
) {

    const isMobile = useMobile()
    const windowSize = useWindowSize()
    const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main")
    const toolbarRef = React.useRef<HTMLDivElement>(null)

    const {selectedFileId} = useSelectedFile();
    const provider = useHocuspocusProvider();

    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
        setIsLoading(true);
        if (!selectedFileId || !provider.document) return;
        syncState(selectedFileId, provider.document).then(() => setIsLoading(false));

    }, [provider]);

    const bodyRect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    })

    useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main")
        }
    }, [isMobile, mobileView])

    if (!editor) {
        return <div className="p-4 text-sm text-gray-400">Loading editor…</div>
    }

    if (isLoading)
        return <div className="p-4 text-sm text-gray-400">Loading document...</div>;

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

            {/*<CustomToolbar.default/>*/}

            <div className="content-wrapper">
                <EditorContent editor={editor} role="presentation" className="simple-editor-content"/>
            </div>
        </EditorContext.Provider>
    )
}