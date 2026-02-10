"use client";
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkContent = exports.LinkButton = exports.useLinkHandler = void 0;
exports.LinkPopover = LinkPopover;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var corner_down_left_icon_1 = require("@/components/tiptap-icons/corner-down-left-icon");
var external_link_icon_1 = require("@/components/tiptap-icons/external-link-icon");
var link_icon_1 = require("@/components/tiptap-icons/link-icon");
var trash_icon_1 = require("@/components/tiptap-icons/trash-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
var button_1 = require("@/components/tiptap-ui-primitive/button");
var popover_1 = require("@/components/tiptap-ui-primitive/popover");
var separator_1 = require("@/components/tiptap-ui-primitive/separator");
// --- Styles ---
require("@/components/tiptap-ui/link-popover/link-popover.scss");
var useLinkHandler = function (props) {
    var editor = props.editor, onSetLink = props.onSetLink, onLinkActive = props.onLinkActive;
    var _a = React.useState(null), url = _a[0], setUrl = _a[1];
    React.useEffect(function () {
        if (!editor)
            return;
        // Get URL immediately on mount
        var href = editor.getAttributes("link").href;
        if (editor.isActive("link") && url === null) {
            setUrl(href || "");
            onLinkActive === null || onLinkActive === void 0 ? void 0 : onLinkActive();
        }
    }, [editor, onLinkActive, url]);
    React.useEffect(function () {
        if (!editor)
            return;
        var updateLinkState = function () {
            var href = editor.getAttributes("link").href;
            setUrl(href || "");
            if (editor.isActive("link") && url !== null) {
                onLinkActive === null || onLinkActive === void 0 ? void 0 : onLinkActive();
            }
        };
        editor.on("selectionUpdate", updateLinkState);
        return function () {
            editor.off("selectionUpdate", updateLinkState);
        };
    }, [editor, onLinkActive, url]);
    var setLink = React.useCallback(function () {
        if (!url || !editor)
            return;
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        setUrl(null);
        onSetLink === null || onSetLink === void 0 ? void 0 : onSetLink();
    }, [editor, onSetLink, url]);
    var removeLink = React.useCallback(function () {
        if (!editor)
            return;
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .unsetLink()
            .setMeta("preventAutolink", true)
            .run();
        setUrl("");
    }, [editor]);
    return {
        url: url || "",
        setUrl: setUrl,
        setLink: setLink,
        removeLink: removeLink,
        isActive: (editor === null || editor === void 0 ? void 0 : editor.isActive("link")) || false,
    };
};
exports.useLinkHandler = useLinkHandler;
exports.LinkButton = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<button_1.Button type="button" className={className} data-style="ghost" role="button" tabIndex={-1} aria-label="Link" tooltip="Link" ref={ref} {...props}>
        {children || <link_icon_1.LinkIcon className="tiptap-button-icon"/>}
      </button_1.Button>);
});
var LinkContent = function (_a) {
    var providedEditor = _a.editor;
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var linkHandler = (0, exports.useLinkHandler)({
        editor: editor,
    });
    return <LinkMain {...linkHandler}/>;
};
exports.LinkContent = LinkContent;
var LinkMain = function (_a) {
    var url = _a.url, setUrl = _a.setUrl, setLink = _a.setLink, removeLink = _a.removeLink, isActive = _a.isActive;
    var handleKeyDown = function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            setLink();
        }
    };
    var handleOpenLink = function () {
        if (!url)
            return;
        var safeUrl = (0, tiptap_utils_1.sanitizeUrl)(url, window.location.href);
        if (safeUrl !== "#") {
            window.open(safeUrl, "_blank", "noopener,noreferrer");
        }
    };
    return (<>
      <input type="url" placeholder="Paste a link..." value={url} onChange={function (e) { return setUrl(e.target.value); }} onKeyDown={handleKeyDown} autoComplete="off" autoCorrect="off" autoCapitalize="off" className="tiptap-input tiptap-input-clamp"/>

      <div className="tiptap-button-group" data-orientation="horizontal">
        <button_1.Button type="button" onClick={setLink} title="Apply link" disabled={!url && !isActive} data-style="ghost">
          <corner_down_left_icon_1.CornerDownLeftIcon className="tiptap-button-icon"/>
        </button_1.Button>
      </div>

      <separator_1.Separator />

      <div className="tiptap-button-group" data-orientation="horizontal">
        <button_1.Button type="button" onClick={handleOpenLink} title="Open in new window" disabled={!url && !isActive} data-style="ghost">
          <external_link_icon_1.ExternalLinkIcon className="tiptap-button-icon"/>
        </button_1.Button>

        <button_1.Button type="button" onClick={removeLink} title="Remove link" disabled={!url && !isActive} data-style="ghost">
          <trash_icon_1.TrashIcon className="tiptap-button-icon"/>
        </button_1.Button>
      </div>
    </>);
};
function LinkPopover(_a) {
    var _b;
    var providedEditor = _a.editor, _c = _a.hideWhenUnavailable, hideWhenUnavailable = _c === void 0 ? false : _c, onOpenChange = _a.onOpenChange, _d = _a.autoOpenOnLinkActive, autoOpenOnLinkActive = _d === void 0 ? true : _d, props = __rest(_a, ["editor", "hideWhenUnavailable", "onOpenChange", "autoOpenOnLinkActive"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var linkInSchema = (0, tiptap_utils_1.isMarkInSchema)("link", editor);
    var _e = React.useState(false), isOpen = _e[0], setIsOpen = _e[1];
    var onSetLink = function () {
        setIsOpen(false);
    };
    var onLinkActive = function () { return setIsOpen(autoOpenOnLinkActive); };
    var linkHandler = (0, exports.useLinkHandler)({
        editor: editor,
        onSetLink: onSetLink,
        onLinkActive: onLinkActive,
    });
    var isDisabled = React.useMemo(function () {
        var _a, _b;
        if (!editor)
            return true;
        if (editor.isActive("codeBlock"))
            return true;
        return !((_b = (_a = editor.can()).setLink) === null || _b === void 0 ? void 0 : _b.call(_a, { href: "" }));
    }, [editor]);
    var canSetLink = React.useMemo(function () {
        if (!editor)
            return false;
        try {
            return editor.can().setMark("link");
        }
        catch (_a) {
            return false;
        }
    }, [editor]);
    var isActive = (_b = editor === null || editor === void 0 ? void 0 : editor.isActive("link")) !== null && _b !== void 0 ? _b : false;
    var handleOnOpenChange = React.useCallback(function (nextIsOpen) {
        setIsOpen(nextIsOpen);
        onOpenChange === null || onOpenChange === void 0 ? void 0 : onOpenChange(nextIsOpen);
    }, [onOpenChange]);
    var show = React.useMemo(function () {
        if (!linkInSchema || !editor) {
            return false;
        }
        if (hideWhenUnavailable) {
            if ((0, react_1.isNodeSelection)(editor.state.selection) || !canSetLink) {
                return false;
            }
        }
        return true;
    }, [linkInSchema, hideWhenUnavailable, editor, canSetLink]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (<popover_1.Popover open={isOpen} onOpenChange={handleOnOpenChange}>
      <popover_1.PopoverTrigger asChild>
        <exports.LinkButton disabled={isDisabled} data-active-state={isActive ? "on" : "off"} data-disabled={isDisabled} {...props}/>
      </popover_1.PopoverTrigger>

      <popover_1.PopoverContent>
        <LinkMain {...linkHandler}/>
      </popover_1.PopoverContent>
    </popover_1.Popover>);
}
exports.LinkButton.displayName = "LinkButton";
