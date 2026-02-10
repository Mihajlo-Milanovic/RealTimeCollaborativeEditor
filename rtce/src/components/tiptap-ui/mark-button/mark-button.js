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
exports.MarkButton = exports.markShortcutKeys = exports.markIcons = void 0;
exports.canToggleMark = canToggleMark;
exports.isMarkActive = isMarkActive;
exports.toggleMark = toggleMark;
exports.isMarkButtonDisabled = isMarkButtonDisabled;
exports.shouldShowMarkButton = shouldShowMarkButton;
exports.getFormattedMarkName = getFormattedMarkName;
exports.useMarkState = useMarkState;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var bold_icon_1 = require("@/components/tiptap-icons/bold-icon");
var code2_icon_1 = require("@/components/tiptap-icons/code2-icon");
var italic_icon_1 = require("@/components/tiptap-icons/italic-icon");
var strike_icon_1 = require("@/components/tiptap-icons/strike-icon");
var subscript_icon_1 = require("@/components/tiptap-icons/subscript-icon");
var superscript_icon_1 = require("@/components/tiptap-icons/superscript-icon");
var underline_icon_1 = require("@/components/tiptap-icons/underline-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
var button_1 = require("@/components/tiptap-ui-primitive/button");
exports.markIcons = {
    bold: bold_icon_1.BoldIcon,
    italic: italic_icon_1.ItalicIcon,
    underline: underline_icon_1.UnderlineIcon,
    strike: strike_icon_1.StrikeIcon,
    code: code2_icon_1.Code2Icon,
    superscript: superscript_icon_1.SuperscriptIcon,
    subscript: subscript_icon_1.SubscriptIcon,
};
exports.markShortcutKeys = {
    bold: "Ctrl-b",
    italic: "Ctrl-i",
    underline: "Ctrl-u",
    strike: "Ctrl-Shift-s",
    code: "Ctrl-e",
    superscript: "Ctrl-.",
    subscript: "Ctrl-,",
};
function canToggleMark(editor, type) {
    if (!editor)
        return false;
    try {
        return editor.can().toggleMark(type);
    }
    catch (_a) {
        return false;
    }
}
function isMarkActive(editor, type) {
    if (!editor)
        return false;
    return editor.isActive(type);
}
function toggleMark(editor, type) {
    if (!editor)
        return;
    editor.chain().focus().toggleMark(type).run();
}
function isMarkButtonDisabled(editor, type, userDisabled) {
    if (userDisabled === void 0) { userDisabled = false; }
    if (!editor)
        return true;
    if (userDisabled)
        return true;
    if (editor.isActive("codeBlock"))
        return true;
    if (!canToggleMark(editor, type))
        return true;
    return false;
}
function shouldShowMarkButton(params) {
    var editor = params.editor, type = params.type, hideWhenUnavailable = params.hideWhenUnavailable, markInSchema = params.markInSchema;
    if (!markInSchema || !editor) {
        return false;
    }
    if (hideWhenUnavailable) {
        if ((0, react_1.isNodeSelection)(editor.state.selection) ||
            !canToggleMark(editor, type)) {
            return false;
        }
    }
    return true;
}
function getFormattedMarkName(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}
function useMarkState(editor, type, disabled) {
    if (disabled === void 0) { disabled = false; }
    var markInSchema = (0, tiptap_utils_1.isMarkInSchema)(type, editor);
    var isDisabled = isMarkButtonDisabled(editor, type, disabled);
    var isActive = isMarkActive(editor, type);
    var Icon = exports.markIcons[type];
    var shortcutKey = exports.markShortcutKeys[type];
    var formattedName = getFormattedMarkName(type);
    return {
        markInSchema: markInSchema,
        isDisabled: isDisabled,
        isActive: isActive,
        Icon: Icon,
        shortcutKey: shortcutKey,
        formattedName: formattedName,
    };
}
exports.MarkButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, type = _a.type, text = _a.text, _b = _a.hideWhenUnavailable, hideWhenUnavailable = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c, disabled = _a.disabled, onClick = _a.onClick, children = _a.children, buttonProps = __rest(_a, ["editor", "type", "text", "hideWhenUnavailable", "className", "disabled", "onClick", "children"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useMarkState(editor, type, disabled), markInSchema = _d.markInSchema, isDisabled = _d.isDisabled, isActive = _d.isActive, Icon = _d.Icon, shortcutKey = _d.shortcutKey, formattedName = _d.formattedName;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && !isDisabled && editor) {
            toggleMark(editor, type);
        }
    }, [onClick, isDisabled, editor, type]);
    var show = React.useMemo(function () {
        return shouldShowMarkButton({
            editor: editor,
            type: type,
            hideWhenUnavailable: hideWhenUnavailable,
            markInSchema: markInSchema,
        });
    }, [editor, type, hideWhenUnavailable, markInSchema]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button type="button" className={className.trim()} disabled={isDisabled} data-style="ghost" data-active-state={isActive ? "on" : "off"} data-disabled={isDisabled} role="button" tabIndex={-1} aria-label={type} aria-pressed={isActive} tooltip={formattedName} shortcutKeys={shortcutKey} onClick={handleClick} {...buttonProps} ref={ref}>
        {children || (<>
            <Icon className="tiptap-button-icon"/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.MarkButton.displayName = "MarkButton";
exports.default = exports.MarkButton;
