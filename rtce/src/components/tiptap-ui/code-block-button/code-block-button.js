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
exports.CodeBlockButton = void 0;
exports.canToggleCodeBlock = canToggleCodeBlock;
exports.isCodeBlockActive = isCodeBlockActive;
exports.toggleCodeBlock = toggleCodeBlock;
exports.isCodeBlockButtonDisabled = isCodeBlockButtonDisabled;
exports.shouldShowCodeBlockButton = shouldShowCodeBlockButton;
exports.useCodeBlockState = useCodeBlockState;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var code_block_icon_1 = require("@/components/tiptap-icons/code-block-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
var button_1 = require("@/components/tiptap-ui-primitive/button");
function canToggleCodeBlock(editor) {
    if (!editor)
        return false;
    try {
        return editor.can().toggleNode("codeBlock", "paragraph");
    }
    catch (_a) {
        return false;
    }
}
function isCodeBlockActive(editor) {
    if (!editor)
        return false;
    return editor.isActive("codeBlock");
}
function toggleCodeBlock(editor) {
    if (!editor)
        return false;
    return editor.chain().focus().toggleNode("codeBlock", "paragraph").run();
}
function isCodeBlockButtonDisabled(editor, canToggle, userDisabled) {
    if (userDisabled === void 0) { userDisabled = false; }
    if (!editor)
        return true;
    if (userDisabled)
        return true;
    if (!canToggle)
        return true;
    return false;
}
function shouldShowCodeBlockButton(params) {
    var editor = params.editor, hideWhenUnavailable = params.hideWhenUnavailable, nodeInSchema = params.nodeInSchema, canToggle = params.canToggle;
    if (!nodeInSchema || !editor) {
        return false;
    }
    if (hideWhenUnavailable) {
        if ((0, react_1.isNodeSelection)(editor.state.selection) || !canToggle) {
            return false;
        }
    }
    return Boolean(editor === null || editor === void 0 ? void 0 : editor.isEditable);
}
function useCodeBlockState(editor, disabled, hideWhenUnavailable) {
    if (disabled === void 0) { disabled = false; }
    if (hideWhenUnavailable === void 0) { hideWhenUnavailable = false; }
    var nodeInSchema = (0, tiptap_utils_1.isNodeInSchema)("codeBlock", editor);
    var canToggle = canToggleCodeBlock(editor);
    var isDisabled = isCodeBlockButtonDisabled(editor, canToggle, disabled);
    var isActive = isCodeBlockActive(editor);
    var shouldShow = React.useMemo(function () {
        return shouldShowCodeBlockButton({
            editor: editor,
            hideWhenUnavailable: hideWhenUnavailable,
            nodeInSchema: nodeInSchema,
            canToggle: canToggle,
        });
    }, [editor, hideWhenUnavailable, nodeInSchema, canToggle]);
    var handleToggle = React.useCallback(function () {
        if (!isDisabled && editor) {
            return toggleCodeBlock(editor);
        }
        return false;
    }, [editor, isDisabled]);
    var shortcutKey = "Ctrl-Alt-c";
    var label = "Code Block";
    return {
        nodeInSchema: nodeInSchema,
        canToggle: canToggle,
        isDisabled: isDisabled,
        isActive: isActive,
        shouldShow: shouldShow,
        handleToggle: handleToggle,
        shortcutKey: shortcutKey,
        label: label,
    };
}
exports.CodeBlockButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, text = _a.text, _b = _a.hideWhenUnavailable, hideWhenUnavailable = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c, disabled = _a.disabled, onClick = _a.onClick, children = _a.children, buttonProps = __rest(_a, ["editor", "text", "hideWhenUnavailable", "className", "disabled", "onClick", "children"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useCodeBlockState(editor, disabled, hideWhenUnavailable), isDisabled = _d.isDisabled, isActive = _d.isActive, shouldShow = _d.shouldShow, handleToggle = _d.handleToggle, shortcutKey = _d.shortcutKey, label = _d.label;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && !isDisabled) {
            handleToggle();
        }
    }, [onClick, isDisabled, handleToggle]);
    if (!shouldShow || !editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button type="button" className={className.trim()} disabled={isDisabled} data-style="ghost" data-active-state={isActive ? "on" : "off"} data-disabled={isDisabled} role="button" tabIndex={-1} aria-label="codeBlock" aria-pressed={isActive} tooltip={label} shortcutKeys={shortcutKey} onClick={handleClick} {...buttonProps} ref={ref}>
        {children || (<>
            <code_block_icon_1.CodeBlockIcon className="tiptap-button-icon"/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.CodeBlockButton.displayName = "CodeBlockButton";
exports.default = exports.CodeBlockButton;
