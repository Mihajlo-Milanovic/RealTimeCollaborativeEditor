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
    {
        editor,
    }: {
        editor: Editor | null,
    }
) {

    const isMobile = useMobile()
    const windowSize = useWindowSize()
    const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main")
    const toolbarRef = React.useRef<HTMLDivElement>(null)

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