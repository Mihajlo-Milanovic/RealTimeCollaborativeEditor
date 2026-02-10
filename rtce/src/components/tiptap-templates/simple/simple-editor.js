"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleEditor = SimpleEditor;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Tiptap Core Extensions ---
var starter_kit_1 = require("@tiptap/starter-kit");
var extension_image_1 = require("@tiptap/extension-image");
var extension_task_item_1 = require("@tiptap/extension-task-item");
var extension_task_list_1 = require("@tiptap/extension-task-list");
var extension_text_align_1 = require("@tiptap/extension-text-align");
var extension_typography_1 = require("@tiptap/extension-typography");
var extension_highlight_1 = require("@tiptap/extension-highlight");
var extension_subscript_1 = require("@tiptap/extension-subscript");
var extension_superscript_1 = require("@tiptap/extension-superscript");
var extension_underline_1 = require("@tiptap/extension-underline");
// --- Custom Extensions ---
var link_extension_1 = require("@/components/tiptap-extension/link-extension");
var selection_extension_1 = require("@/components/tiptap-extension/selection-extension");
var trailing_node_extension_1 = require("@/components/tiptap-extension/trailing-node-extension");
// --- UI Primitives ---
var button_1 = require("@/components/tiptap-ui-primitive/button");
var spacer_1 = require("@/components/tiptap-ui-primitive/spacer");
var toolbar_1 = require("@/components/tiptap-ui-primitive/toolbar");
// --- Tiptap Node ---
var image_upload_node_extension_1 = require("@/components/tiptap-node/image-upload-node/image-upload-node-extension");
require("@/components/tiptap-node/code-block-node/code-block-node.scss");
require("@/components/tiptap-node/list-node/list-node.scss");
require("@/components/tiptap-node/image-node/image-node.scss");
require("@/components/tiptap-node/paragraph-node/paragraph-node.scss");
// --- Tiptap UI ---
var heading_dropdown_menu_1 = require("@/components/tiptap-ui/heading-dropdown-menu");
var image_upload_button_1 = require("@/components/tiptap-ui/image-upload-button");
var list_dropdown_menu_1 = require("@/components/tiptap-ui/list-dropdown-menu");
var blockquote_button_1 = require("@/components/tiptap-ui/blockquote-button");
var code_block_button_1 = require("@/components/tiptap-ui/code-block-button");
var color_highlight_popover_1 = require("@/components/tiptap-ui/color-highlight-popover");
var link_popover_1 = require("@/components/tiptap-ui/link-popover");
var mark_button_1 = require("@/components/tiptap-ui/mark-button");
var text_align_button_1 = require("@/components/tiptap-ui/text-align-button");
var undo_redo_button_1 = require("@/components/tiptap-ui/undo-redo-button");
// --- Icons ---
var arrow_left_icon_1 = require("@/components/tiptap-icons/arrow-left-icon");
var highlighter_icon_1 = require("@/components/tiptap-icons/highlighter-icon");
var link_icon_1 = require("@/components/tiptap-icons/link-icon");
// --- Hooks ---
var use_mobile_1 = require("@/hooks/use-mobile");
var use_window_size_1 = require("@/hooks/use-window-size");
var use_cursor_visibility_1 = require("@/hooks/use-cursor-visibility");
// --- Components ---
var theme_toggle_1 = require("@/components/tiptap-templates/simple/theme-toggle");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
// --- Styles ---
require("@/components/tiptap-templates/simple/simple-editor.scss");
var content_json_1 = require("@/components/tiptap-templates/simple/data/content.json");
// ---  Y.JS BY FILIP PETROVIC ---
var Y = require("yjs");
var y_webrtc_1 = require("y-webrtc");
var extension_collaboration_1 = require("@tiptap/extension-collaboration");
var extension_collaboration_cursor_1 = require("@tiptap/extension-collaboration-cursor");
var ydoc = new Y.Doc();
var provider = new y_webrtc_1.WebrtcProvider("my-local-room", ydoc);
var MainToolbarContent = function (_a) {
    var onHighlighterClick = _a.onHighlighterClick, onLinkClick = _a.onLinkClick, isMobile = _a.isMobile;
    return (<>
      <spacer_1.Spacer />

      <toolbar_1.ToolbarGroup>
        <undo_redo_button_1.UndoRedoButton action="undo"/>
        <undo_redo_button_1.UndoRedoButton action="redo"/>
      </toolbar_1.ToolbarGroup>

      <toolbar_1.ToolbarSeparator />

      <toolbar_1.ToolbarGroup>
        <heading_dropdown_menu_1.HeadingDropdownMenu levels={[1, 2, 3, 4]}/>
        <list_dropdown_menu_1.ListDropdownMenu types={["bulletList", "orderedList", "taskList"]}/>
        <blockquote_button_1.BlockquoteButton />
        <code_block_button_1.CodeBlockButton />
      </toolbar_1.ToolbarGroup>

      <toolbar_1.ToolbarSeparator />

      <toolbar_1.ToolbarGroup>
        <mark_button_1.MarkButton type="bold"/>
        <mark_button_1.MarkButton type="italic"/>
        <mark_button_1.MarkButton type="strike"/>
        <mark_button_1.MarkButton type="code"/>
        <mark_button_1.MarkButton type="underline"/>
        {!isMobile ? (<color_highlight_popover_1.ColorHighlightPopover />) : (<color_highlight_popover_1.ColorHighlightPopoverButton onClick={onHighlighterClick}/>)}
        {!isMobile ? <link_popover_1.LinkPopover /> : <link_popover_1.LinkButton onClick={onLinkClick}/>}
      </toolbar_1.ToolbarGroup>

      <toolbar_1.ToolbarSeparator />

      <toolbar_1.ToolbarGroup>
        <mark_button_1.MarkButton type="superscript"/>
        <mark_button_1.MarkButton type="subscript"/>
      </toolbar_1.ToolbarGroup>

      <toolbar_1.ToolbarSeparator />

      <toolbar_1.ToolbarGroup>
        <text_align_button_1.TextAlignButton align="left"/>
        <text_align_button_1.TextAlignButton align="center"/>
        <text_align_button_1.TextAlignButton align="right"/>
        <text_align_button_1.TextAlignButton align="justify"/>
      </toolbar_1.ToolbarGroup>

      <toolbar_1.ToolbarSeparator />

      <toolbar_1.ToolbarGroup>
        <image_upload_button_1.ImageUploadButton text="Add"/>
      </toolbar_1.ToolbarGroup>

      <spacer_1.Spacer />

      {isMobile && <toolbar_1.ToolbarSeparator />}

      <toolbar_1.ToolbarGroup>
        <theme_toggle_1.ThemeToggle />
      </toolbar_1.ToolbarGroup>
    </>);
};
var MobileToolbarContent = function (_a) {
    var type = _a.type, onBack = _a.onBack;
    return (<>
    <toolbar_1.ToolbarGroup>
      <button_1.Button data-style="ghost" onClick={onBack}>
        <arrow_left_icon_1.ArrowLeftIcon className="tiptap-button-icon"/>
        {type === "highlighter" ? (<highlighter_icon_1.HighlighterIcon className="tiptap-button-icon"/>) : (<link_icon_1.LinkIcon className="tiptap-button-icon"/>)}
      </button_1.Button>
    </toolbar_1.ToolbarGroup>

    <toolbar_1.ToolbarSeparator />

    {type === "highlighter" ? (<color_highlight_popover_1.ColorHighlightPopoverContent />) : (<link_popover_1.LinkContent />)}
  </>);
};
function SimpleEditor() {
    var _a, _b;
    var isMobile = (0, use_mobile_1.useMobile)();
    var windowSize = (0, use_window_size_1.useWindowSize)();
    var _c = React.useState("main"), mobileView = _c[0], setMobileView = _c[1];
    var toolbarRef = React.useRef(null);
    var editor = (0, react_1.useEditor)({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
            },
        },
        extensions: [
            starter_kit_1.StarterKit,
            extension_text_align_1.TextAlign.configure({ types: ["heading", "paragraph"] }),
            extension_underline_1.Underline,
            extension_task_list_1.TaskList,
            extension_task_item_1.TaskItem.configure({ nested: true }),
            extension_highlight_1.Highlight.configure({ multicolor: true }),
            extension_image_1.Image,
            extension_typography_1.Typography,
            extension_superscript_1.Superscript,
            extension_subscript_1.Subscript,
            selection_extension_1.Selection,
            image_upload_node_extension_1.ImageUploadNode.configure({
                accept: "image/*",
                maxSize: tiptap_utils_1.MAX_FILE_SIZE,
                limit: 3,
                upload: tiptap_utils_1.handleImageUpload,
                onError: function (error) { return console.error("Upload failed:", error); },
            }),
            trailing_node_extension_1.TrailingNode,
            link_extension_1.Link.configure({ openOnClick: false }),
            // Y.JS EKSTENZIJE 
            extension_collaboration_1.default.configure({
                document: ydoc,
            }),
            extension_collaboration_cursor_1.default.configure({
                provider: provider,
                user: {
                    name: "OPREM DOBRO" + Math.floor(Math.random() * 1000),
                    color: "#f783ac",
                },
            }),
            // ...
        ],
        content: content_json_1.default,
    });
    var bodyRect = (0, use_cursor_visibility_1.useCursorVisibility)({
        editor: editor,
        overlayHeight: (_b = (_a = toolbarRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().height) !== null && _b !== void 0 ? _b : 0,
    });
    React.useEffect(function () {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);
    return (<react_1.EditorContext.Provider value={{ editor: editor }}>
      <toolbar_1.Toolbar ref={toolbarRef} style={isMobile
            ? {
                bottom: "calc(100% - ".concat(windowSize.height - bodyRect.y, "px)"),
            }
            : {}}>
        {mobileView === "main" ? (<MainToolbarContent onHighlighterClick={function () { return setMobileView("highlighter"); }} onLinkClick={function () { return setMobileView("link"); }} isMobile={isMobile}/>) : (<MobileToolbarContent type={mobileView === "highlighter" ? "highlighter" : "link"} onBack={function () { return setMobileView("main"); }}/>)}
      </toolbar_1.Toolbar>

      <div className="content-wrapper">
        <react_1.EditorContent editor={editor} role="presentation" className="simple-editor-content"/>
      </div>
    </react_1.EditorContext.Provider>);
}
