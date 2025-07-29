"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ColorHighlightButton = exports.HIGHLIGHT_COLORS = void 0;
exports.canToggleHighlight = canToggleHighlight;
exports.isHighlightActive = isHighlightActive;
exports.toggleHighlight = toggleHighlight;
exports.isColorHighlightButtonDisabled = isColorHighlightButtonDisabled;
exports.shouldShowColorHighlightButton = shouldShowColorHighlightButton;
exports.useHighlightState = useHighlightState;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
var button_1 = require("@/components/tiptap-ui-primitive/button");
// --- Styles ---
require("@/components/tiptap-ui/color-highlight-button/color-highlight-button.scss");
exports.HIGHLIGHT_COLORS = [
    {
        label: "Default background",
        value: "var(--tt-bg-color)",
        border: "var(--tt-bg-color-contrast)",
    },
    {
        label: "Gray background",
        value: "var(--tt-color-highlight-gray)",
        border: "var(--tt-color-highlight-gray-contrast)",
    },
    {
        label: "Brown background",
        value: "var(--tt-color-highlight-brown)",
        border: "var(--tt-color-highlight-brown-contrast)",
    },
    {
        label: "Orange background",
        value: "var(--tt-color-highlight-orange)",
        border: "var(--tt-color-highlight-orange-contrast)",
    },
    {
        label: "Yellow background",
        value: "var(--tt-color-highlight-yellow)",
        border: "var(--tt-color-highlight-yellow-contrast)",
    },
    {
        label: "Green background",
        value: "var(--tt-color-highlight-green)",
        border: "var(--tt-color-highlight-green-contrast)",
    },
    {
        label: "Blue background",
        value: "var(--tt-color-highlight-blue)",
        border: "var(--tt-color-highlight-blue-contrast)",
    },
    {
        label: "Purple background",
        value: "var(--tt-color-highlight-purple)",
        border: "var(--tt-color-highlight-purple-contrast)",
    },
    {
        label: "Pink background",
        value: "var(--tt-color-highlight-pink)",
        border: "var(--tt-color-highlight-pink-contrast)",
    },
    {
        label: "Red background",
        value: "var(--tt-color-highlight-red)",
        border: "var(--tt-color-highlight-red-contrast)",
    },
];
/**
 * Checks if highlight can be toggled in the current editor state
 */
function canToggleHighlight(editor) {
    if (!editor)
        return false;
    try {
        return editor.can().setMark("highlight");
    }
    catch (_a) {
        return false;
    }
}
/**
 * Checks if highlight is active in the current selection
 */
function isHighlightActive(editor, color) {
    if (!editor)
        return false;
    return editor.isActive("highlight", { color: color });
}
/**
 * Toggles highlight on the current selection or specified node
 */
function toggleHighlight(editor, color, node, nodePos) {
    if (!editor)
        return;
    try {
        var chain = editor.chain().focus();
        if ((0, tiptap_utils_1.isEmptyNode)(node)) {
            chain.toggleMark("highlight", { color: color }).run();
        }
        else if (nodePos !== undefined && nodePos !== null && nodePos !== -1) {
            chain.setNodeSelection(nodePos).toggleMark("highlight", { color: color }).run();
        }
        else if (node) {
            var foundPos = (0, tiptap_utils_1.findNodePosition)({ editor: editor, node: node });
            if (foundPos) {
                chain
                    .setNodeSelection(foundPos.pos)
                    .toggleMark("highlight", { color: color })
                    .run();
            }
            else {
                chain.toggleMark("highlight", { color: color }).run();
            }
        }
        else {
            chain.toggleMark("highlight", { color: color }).run();
        }
        editor.chain().setMeta("hideDragHandle", true).run();
    }
    catch (error) {
        console.error("Failed to apply highlight:", error);
    }
}
/**
 * Determines if the highlight button should be disabled
 */
function isColorHighlightButtonDisabled(editor, userDisabled) {
    if (userDisabled === void 0) { userDisabled = false; }
    if (!editor || userDisabled)
        return true;
    var isIncompatibleContext = editor.isActive("code") ||
        editor.isActive("codeBlock") ||
        editor.isActive("imageUpload");
    return isIncompatibleContext || !canToggleHighlight(editor);
}
/**
 * Determines if the highlight button should be shown
 */
function shouldShowColorHighlightButton(editor, hideWhenUnavailable, highlightInSchema) {
    if (!highlightInSchema || !editor)
        return false;
    if (hideWhenUnavailable) {
        if ((0, react_1.isNodeSelection)(editor.state.selection) ||
            !canToggleHighlight(editor)) {
            return false;
        }
    }
    return true;
}
/**
 * Custom hook to manage highlight button state
 */
function useHighlightState(editor, color, disabled, hideWhenUnavailable) {
    if (disabled === void 0) { disabled = false; }
    if (hideWhenUnavailable === void 0) { hideWhenUnavailable = false; }
    var highlightInSchema = (0, tiptap_utils_1.isMarkInSchema)("highlight", editor);
    var isDisabled = isColorHighlightButtonDisabled(editor, disabled);
    var isActive = isHighlightActive(editor, color);
    var shouldShow = React.useMemo(function () {
        return shouldShowColorHighlightButton(editor, hideWhenUnavailable, highlightInSchema);
    }, [editor, hideWhenUnavailable, highlightInSchema]);
    return {
        highlightInSchema: highlightInSchema,
        isDisabled: isDisabled,
        isActive: isActive,
        shouldShow: shouldShow,
    };
}
/**
 * ColorHighlightButton component for TipTap editor
 */
exports.ColorHighlightButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, node = _a.node, nodePos = _a.nodePos, color = _a.color, text = _a.text, _b = _a.hideWhenUnavailable, hideWhenUnavailable = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c, disabled = _a.disabled, onClick = _a.onClick, onApplied = _a.onApplied, children = _a.children, style = _a.style, buttonProps = __rest(_a, ["editor", "node", "nodePos", "color", "text", "hideWhenUnavailable", "className", "disabled", "onClick", "onApplied", "children", "style"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useHighlightState(editor, color, disabled, hideWhenUnavailable), isDisabled = _d.isDisabled, isActive = _d.isActive, shouldShow = _d.shouldShow;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && !isDisabled && editor) {
            toggleHighlight(editor, color, node, nodePos);
            onApplied === null || onApplied === void 0 ? void 0 : onApplied(color);
        }
    }, [color, editor, isDisabled, node, nodePos, onClick, onApplied]);
    var buttonStyle = React.useMemo(function () {
        return (__assign(__assign({}, style), { "--highlight-color": color }));
    }, [color, style]);
    if (!shouldShow || !editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button type="button" className={className.trim()} disabled={isDisabled} data-style="ghost" data-active-state={isActive ? "on" : "off"} data-disabled={isDisabled} role="button" tabIndex={-1} aria-label={"".concat(color, " highlight color")} aria-pressed={isActive} onClick={handleClick} style={buttonStyle} {...buttonProps} ref={ref}>
        {children || (<>
            <span className="tiptap-button-highlight" style={{ "--highlight-color": color }}/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.ColorHighlightButton.displayName = "ColorHighlightButton";
exports.default = exports.ColorHighlightButton;
