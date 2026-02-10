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
exports.UndoRedoButton = exports.historyActionLabels = exports.historyShortcutKeys = exports.historyIcons = void 0;
exports.canExecuteHistoryAction = canExecuteHistoryAction;
exports.executeHistoryAction = executeHistoryAction;
exports.isHistoryActionDisabled = isHistoryActionDisabled;
exports.useHistoryAction = useHistoryAction;
var React = require("react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var redo2_icon_1 = require("@/components/tiptap-icons/redo2-icon");
var undo2_icon_1 = require("@/components/tiptap-icons/undo2-icon");
var button_1 = require("@/components/tiptap-ui-primitive/button");
exports.historyIcons = {
    undo: undo2_icon_1.Undo2Icon,
    redo: redo2_icon_1.Redo2Icon,
};
exports.historyShortcutKeys = {
    undo: "Ctrl-z",
    redo: "Ctrl-Shift-z",
};
exports.historyActionLabels = {
    undo: "Undo",
    redo: "Redo",
};
/**
 * Checks if a history action can be executed.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to check
 * @returns Whether the action can be executed
 */
function canExecuteHistoryAction(editor, action) {
    if (!editor)
        return false;
    return action === "undo" ? editor.can().undo() : editor.can().redo();
}
/**
 * Executes a history action on the editor.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to execute
 * @returns Whether the action was executed successfully
 */
function executeHistoryAction(editor, action) {
    if (!editor)
        return false;
    var chain = editor.chain().focus();
    return action === "undo" ? chain.undo().run() : chain.redo().run();
}
/**
 * Determines if a history action should be disabled.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to check
 * @param userDisabled Whether the action is explicitly disabled by the user
 * @returns Whether the action should be disabled
 */
function isHistoryActionDisabled(editor, action, userDisabled) {
    if (userDisabled === void 0) { userDisabled = false; }
    if (userDisabled)
        return true;
    return !canExecuteHistoryAction(editor, action);
}
/**
 * Hook that provides all the necessary state and handlers for a history action.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to handle
 * @param disabled Whether the action is explicitly disabled
 * @returns Object containing state and handlers for the history action
 */
function useHistoryAction(editor, action, disabled) {
    if (disabled === void 0) { disabled = false; }
    var canExecute = React.useMemo(function () { return canExecuteHistoryAction(editor, action); }, [editor, action]);
    var isDisabled = isHistoryActionDisabled(editor, action, disabled);
    var handleAction = React.useCallback(function () {
        if (!editor || isDisabled)
            return;
        executeHistoryAction(editor, action);
    }, [editor, action, isDisabled]);
    var Icon = exports.historyIcons[action];
    var actionLabel = exports.historyActionLabels[action];
    var shortcutKey = exports.historyShortcutKeys[action];
    return {
        canExecute: canExecute,
        isDisabled: isDisabled,
        handleAction: handleAction,
        Icon: Icon,
        actionLabel: actionLabel,
        shortcutKey: shortcutKey,
    };
}
/**
 * Button component for triggering undo/redo actions in a TipTap editor.
 */
exports.UndoRedoButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, action = _a.action, text = _a.text, _b = _a.className, className = _b === void 0 ? "" : _b, disabled = _a.disabled, onClick = _a.onClick, children = _a.children, buttonProps = __rest(_a, ["editor", "action", "text", "className", "disabled", "onClick", "children"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _c = useHistoryAction(editor, action, disabled), isDisabled = _c.isDisabled, handleAction = _c.handleAction, Icon = _c.Icon, actionLabel = _c.actionLabel, shortcutKey = _c.shortcutKey;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && !disabled) {
            handleAction();
        }
    }, [onClick, disabled, handleAction]);
    if (!editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button ref={ref} type="button" className={className.trim()} disabled={isDisabled} data-style="ghost" data-disabled={isDisabled} role="button" tabIndex={-1} aria-label={actionLabel} tooltip={actionLabel} shortcutKeys={shortcutKey} onClick={handleClick} {...buttonProps}>
        {children || (<>
            <Icon className="tiptap-button-icon"/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.UndoRedoButton.displayName = "UndoRedoButton";
exports.default = exports.UndoRedoButton;
