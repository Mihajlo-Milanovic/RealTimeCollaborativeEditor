"use client"

import * as React from "react";
import {EditorContent, EditorContext, useEditor} from "@tiptap/react";

// --- UI Primitives ---
import {Button} from "../../tiptap-ui-primitive/button"
import {Spacer} from "../../tiptap-ui-primitive/spacer"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "../../tiptap-ui-primitive/toolbar"

// --- Styles ---
import "../../tiptap-node/code-block-node/code-block-node.scss"
import "../../tiptap-node/list-node/list-node.scss"
import "../../tiptap-node/image-node/image-node.scss"
import "../../tiptap-node/paragraph-node/paragraph-node.scss"
import "../../tiptap-templates/simple/simple-editor.scss"

// --- Tiptap UI ---
import {HeadingDropdownMenu} from "../../tiptap-ui/heading-dropdown-menu"
import {ListDropdownMenu} from "../../tiptap-ui/list-dropdown-menu"
import {BlockquoteButton} from "../../tiptap-ui/blockquote-button"
import {CodeBlockButton} from "../../tiptap-ui/code-block-button"
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "../../tiptap-ui/color-highlight-popover"
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "../../tiptap-ui/link-popover"
import {MarkButton} from "../../tiptap-ui/mark-button"
import {TextAlignButton} from "../../tiptap-ui/text-align-button"
import {UndoRedoButton} from "../../tiptap-ui/undo-redo-button"

// --- Icons ---
import {ArrowLeftIcon} from "../../tiptap-icons/arrow-left-icon"
import {HighlighterIcon} from "../../tiptap-icons/highlighter-icon"
import {LinkIcon} from "../../tiptap-icons/link-icon"

// --- Hooks ---
import {useMobile} from "../../../../../hooks/use-mobile"
import {useWindowSize} from "../../../../../hooks/use-window-size"
import {useCursorVisibility} from "../../../../../hooks/use-cursor-visibility"
import {useEffect} from "react";
import {useHocuspocusProvider} from "@hocuspocus/provider-react";


// --- Tiptap ---
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
import {useSelectedFile} from "../../../../../store/selectedFile"
import {CollabUser} from "../../../../../models/interfaces/CollabUser";
import {user} from "../../../../../store/user";
import {getRandomColor} from "../../../../../lib/awarenessColors";
import {useCanAccess} from "../../../../../lib/access/useCanAccess";



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

export function EditorInner() {

    const isMobile = useMobile()
    const windowSize = useWindowSize()
    const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main")
    const toolbarRef = React.useRef<HTMLDivElement>(null)

    const provider = useHocuspocusProvider();
    const userAwareness = provider.awareness?.getLocalState() as CollabUser | null;
    // const awareness = useHocuspocusAwareness();
    const {selectedFileId} = useSelectedFile();

    // Ista boja i username koji se već koriste u OnlineUsers.tsx:
    // - prvo uzmemo vrednost iz awareness-a (mehanizam koji već postoji),
    // - ako awareness još nije postavljen, deterministički je izvedemo istom
    //   funkcijom getRandomColor(username) kao i u Editor.tsx, pa je boja
    //   zagarantovano identična svuda (lista korisnika, kursor, selekcija).
    const cursorUsername = userAwareness?.username ?? user.username ?? "Anonymous";
    const cursorColor = userAwareness?.color ?? getRandomColor(cursorUsername);

    // Odluku o pravu na izmenu dokumenta donosi Proxy (kontrola pristupa).
    // Viewer dobija read-only editor (lokalne Yjs transakcije se ne kreiraju).
    const canEdit = useCanAccess("document:edit");

    // const [isLoading, setIsLoading] = useState(true);
    const editor = useEditor({
        immediatelyRender: false,
        editable: canEdit,
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
                    name: cursorUsername,
                    username: cursorUsername,
                    color: cursorColor,
                },
                // Eksplicitno crtamo kursor udaljenih korisnika:
                // - vertikalna linija u boji korisnika,
                // - label sa username-om, pozadina = boja korisnika, beo tekst.
                // Boja NIJE hardkodovana – uzima se iz renderedUser.color koji
                // dolazi iz awareness "user" polja (isti izvor kao OnlineUsers).
                render: (renderedUser: { name?: string; color: string }) => {
                    const cursor = document.createElement("span");
                    cursor.classList.add("collaboration-cursor__caret");
                    cursor.setAttribute("style", `border-color: ${renderedUser.color}`);

                    const label = document.createElement("div");
                    label.classList.add("collaboration-cursor__label");
                    label.setAttribute(
                        "style",
                        `background-color: ${renderedUser.color}; color: #ffffff;`
                    );
                    label.insertBefore(
                        document.createTextNode(renderedUser.name ?? "Anonymous"),
                        null
                    );

                    cursor.insertBefore(label, null);
                    return cursor;
                },
            }),
        ],
    })

    // Ako se uloga promeni dok je editor otvoren, ažuriraj read-only stanje.
    useEffect(() => {
        editor?.setEditable(canEdit);
    }, [editor, canEdit]);

    useEffect(() => {
        // setIsLoading(true);
        if (!selectedFileId || !provider.document) return;
        // syncState(selectedFileId, provider.document).then(() => setIsLoading(false));

    }, [provider, selectedFileId]);

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

    // if (isLoading)
    //     return <div className="p-4 text-sm text-gray-400">Loading document...</div>;

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