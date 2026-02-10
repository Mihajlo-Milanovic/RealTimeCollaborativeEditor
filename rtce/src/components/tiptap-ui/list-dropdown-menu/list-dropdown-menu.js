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
exports.canToggleAnyList = canToggleAnyList;
exports.isAnyListActive = isAnyListActive;
exports.getFilteredListOptions = getFilteredListOptions;
exports.shouldShowListDropdown = shouldShowListDropdown;
exports.useListDropdownState = useListDropdownState;
exports.useActiveListIcon = useActiveListIcon;
exports.ListDropdownMenu = ListDropdownMenu;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var chevron_down_icon_1 = require("@/components/tiptap-icons/chevron-down-icon");
var list_icon_1 = require("@/components/tiptap-icons/list-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
// --- Tiptap UI ---
var list_button_1 = require("@/components/tiptap-ui/list-button/list-button");
var button_1 = require("@/components/tiptap-ui-primitive/button");
var dropdown_menu_1 = require("@/components/tiptap-ui-primitive/dropdown-menu");
function canToggleAnyList(editor, listTypes) {
    if (!editor)
        return false;
    return listTypes.some(function (type) { return (0, list_button_1.canToggleList)(editor, type); });
}
function isAnyListActive(editor, listTypes) {
    if (!editor)
        return false;
    return listTypes.some(function (type) { return (0, list_button_1.isListActive)(editor, type); });
}
function getFilteredListOptions(availableTypes) {
    return list_button_1.listOptions.filter(function (option) { return !option.type || availableTypes.includes(option.type); });
}
function shouldShowListDropdown(params) {
    var editor = params.editor, hideWhenUnavailable = params.hideWhenUnavailable, listInSchema = params.listInSchema, canToggleAny = params.canToggleAny;
    if (!listInSchema || !editor) {
        return false;
    }
    if (hideWhenUnavailable) {
        if ((0, react_1.isNodeSelection)(editor.state.selection) || !canToggleAny) {
            return false;
        }
    }
    return true;
}
function useListDropdownState(editor, availableTypes) {
    var _a = React.useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var listInSchema = availableTypes.some(function (type) {
        return (0, tiptap_utils_1.isNodeInSchema)(type, editor);
    });
    var filteredLists = React.useMemo(function () { return getFilteredListOptions(availableTypes); }, [availableTypes]);
    var canToggleAny = canToggleAnyList(editor, availableTypes);
    var isAnyActive = isAnyListActive(editor, availableTypes);
    var handleOpenChange = React.useCallback(function (open, callback) {
        setIsOpen(open);
        callback === null || callback === void 0 ? void 0 : callback(open);
    }, []);
    return {
        isOpen: isOpen,
        setIsOpen: setIsOpen,
        listInSchema: listInSchema,
        filteredLists: filteredLists,
        canToggleAny: canToggleAny,
        isAnyActive: isAnyActive,
        handleOpenChange: handleOpenChange,
    };
}
function useActiveListIcon(editor, filteredLists) {
    return React.useCallback(function () {
        var activeOption = filteredLists.find(function (option) {
            return (0, list_button_1.isListActive)(editor, option.type);
        });
        return activeOption ? (<activeOption.icon className="tiptap-button-icon"/>) : (<list_icon_1.ListIcon className="tiptap-button-icon"/>);
    }, [editor, filteredLists]);
}
function ListDropdownMenu(_a) {
    var providedEditor = _a.editor, _b = _a.types, types = _b === void 0 ? ["bulletList", "orderedList", "taskList"] : _b, _c = _a.hideWhenUnavailable, hideWhenUnavailable = _c === void 0 ? false : _c, onOpenChange = _a.onOpenChange, props = __rest(_a, ["editor", "types", "hideWhenUnavailable", "onOpenChange"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useListDropdownState(editor, types), isOpen = _d.isOpen, listInSchema = _d.listInSchema, filteredLists = _d.filteredLists, canToggleAny = _d.canToggleAny, isAnyActive = _d.isAnyActive, handleOpenChange = _d.handleOpenChange;
    var getActiveIcon = useActiveListIcon(editor, filteredLists);
    var show = React.useMemo(function () {
        return shouldShowListDropdown({
            editor: editor,
            listTypes: types,
            hideWhenUnavailable: hideWhenUnavailable,
            listInSchema: listInSchema,
            canToggleAny: canToggleAny,
        });
    }, [editor, types, hideWhenUnavailable, listInSchema, canToggleAny]);
    var handleOnOpenChange = React.useCallback(function (open) { return handleOpenChange(open, onOpenChange); }, [handleOpenChange, onOpenChange]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (<dropdown_menu_1.DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <dropdown_menu_1.DropdownMenuTrigger asChild>
        <button_1.Button type="button" data-style="ghost" data-active-state={isAnyActive ? "on" : "off"} role="button" tabIndex={-1} aria-label="List options" tooltip="List" {...props}>
          {getActiveIcon()}
          <chevron_down_icon_1.ChevronDownIcon className="tiptap-button-dropdown-small"/>
        </button_1.Button>
      </dropdown_menu_1.DropdownMenuTrigger>

      <dropdown_menu_1.DropdownMenuContent>
        <dropdown_menu_1.DropdownMenuGroup>
          {filteredLists.map(function (option) { return (<dropdown_menu_1.DropdownMenuItem key={option.type} asChild>
              <list_button_1.ListButton editor={editor} type={option.type} text={option.label} hideWhenUnavailable={hideWhenUnavailable} tooltip={""}/>
            </dropdown_menu_1.DropdownMenuItem>); })}
        </dropdown_menu_1.DropdownMenuGroup>
      </dropdown_menu_1.DropdownMenuContent>
    </dropdown_menu_1.DropdownMenu>);
}
exports.default = ListDropdownMenu;
