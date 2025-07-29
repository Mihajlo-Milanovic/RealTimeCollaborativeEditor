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
exports.ListButton = exports.listShortcutKeys = exports.listOptions = void 0;
exports.canToggleList = canToggleList;
exports.isListActive = isListActive;
exports.toggleList = toggleList;
exports.getListOption = getListOption;
exports.shouldShowListButton = shouldShowListButton;
exports.useListState = useListState;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var list_icon_1 = require("@/components/tiptap-icons/list-icon");
var list_ordered_icon_1 = require("@/components/tiptap-icons/list-ordered-icon");
var list_todo_icon_1 = require("@/components/tiptap-icons/list-todo-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
var button_1 = require("@/components/tiptap-ui-primitive/button");
exports.listOptions = [
    {
        label: "Bullet List",
        type: "bulletList",
        icon: list_icon_1.ListIcon,
    },
    {
        label: "Ordered List",
        type: "orderedList",
        icon: list_ordered_icon_1.ListOrderedIcon,
    },
    {
        label: "Task List",
        type: "taskList",
        icon: list_todo_icon_1.ListTodoIcon,
    },
];
exports.listShortcutKeys = {
    bulletList: "Ctrl-Shift-8",
    orderedList: "Ctrl-Shift-7",
    taskList: "Ctrl-Shift-9",
};
function canToggleList(editor, type) {
    if (!editor) {
        return false;
    }
    switch (type) {
        case "bulletList":
            return editor.can().toggleBulletList();
        case "orderedList":
            return editor.can().toggleOrderedList();
        case "taskList":
            return editor.can().toggleList("taskList", "taskItem");
        default:
            return false;
    }
}
function isListActive(editor, type) {
    if (!editor)
        return false;
    switch (type) {
        case "bulletList":
            return editor.isActive("bulletList");
        case "orderedList":
            return editor.isActive("orderedList");
        case "taskList":
            return editor.isActive("taskList");
        default:
            return false;
    }
}
function toggleList(editor, type) {
    if (!editor)
        return;
    switch (type) {
        case "bulletList":
            editor.chain().focus().toggleBulletList().run();
            break;
        case "orderedList":
            editor.chain().focus().toggleOrderedList().run();
            break;
        case "taskList":
            editor.chain().focus().toggleList("taskList", "taskItem").run();
            break;
    }
}
function getListOption(type) {
    return exports.listOptions.find(function (option) { return option.type === type; });
}
function shouldShowListButton(params) {
    var editor = params.editor, type = params.type, hideWhenUnavailable = params.hideWhenUnavailable, listInSchema = params.listInSchema;
    if (!listInSchema || !editor) {
        return false;
    }
    if (hideWhenUnavailable) {
        if ((0, react_1.isNodeSelection)(editor.state.selection) ||
            !canToggleList(editor, type)) {
            return false;
        }
    }
    return true;
}
function useListState(editor, type) {
    var listInSchema = (0, tiptap_utils_1.isNodeInSchema)(type, editor);
    var listOption = getListOption(type);
    var isActive = isListActive(editor, type);
    var shortcutKey = exports.listShortcutKeys[type];
    return {
        listInSchema: listInSchema,
        listOption: listOption,
        isActive: isActive,
        shortcutKey: shortcutKey,
    };
}
exports.ListButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, type = _a.type, _b = _a.hideWhenUnavailable, hideWhenUnavailable = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c, onClick = _a.onClick, text = _a.text, children = _a.children, buttonProps = __rest(_a, ["editor", "type", "hideWhenUnavailable", "className", "onClick", "text", "children"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useListState(editor, type), listInSchema = _d.listInSchema, listOption = _d.listOption, isActive = _d.isActive, shortcutKey = _d.shortcutKey;
    var Icon = (listOption === null || listOption === void 0 ? void 0 : listOption.icon) || list_icon_1.ListIcon;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && editor) {
            toggleList(editor, type);
        }
    }, [onClick, editor, type]);
    var show = React.useMemo(function () {
        return shouldShowListButton({
            editor: editor,
            type: type,
            hideWhenUnavailable: hideWhenUnavailable,
            listInSchema: listInSchema,
        });
    }, [editor, type, hideWhenUnavailable, listInSchema]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button type="button" className={className.trim()} data-style="ghost" data-active-state={isActive ? "on" : "off"} role="button" tabIndex={-1} aria-label={(listOption === null || listOption === void 0 ? void 0 : listOption.label) || type} aria-pressed={isActive} tooltip={(listOption === null || listOption === void 0 ? void 0 : listOption.label) || type} shortcutKeys={shortcutKey} onClick={handleClick} {...buttonProps} ref={ref}>
        {children || (<>
            <Icon className="tiptap-button-icon"/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.ListButton.displayName = "ListButton";
exports.default = exports.ListButton;
