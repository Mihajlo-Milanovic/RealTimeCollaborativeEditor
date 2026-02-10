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
exports.HeadingDropdownMenu = HeadingDropdownMenu;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var chevron_down_icon_1 = require("@/components/tiptap-icons/chevron-down-icon");
var heading_icon_1 = require("@/components/tiptap-icons/heading-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
// --- Tiptap UI ---
var heading_button_1 = require("@/components/tiptap-ui/heading-button/heading-button");
var button_1 = require("@/components/tiptap-ui-primitive/button");
var dropdown_menu_1 = require("@/components/tiptap-ui-primitive/dropdown-menu");
function HeadingDropdownMenu(_a) {
    var _b;
    var providedEditor = _a.editor, _c = _a.levels, levels = _c === void 0 ? [1, 2, 3, 4, 5, 6] : _c, _d = _a.hideWhenUnavailable, hideWhenUnavailable = _d === void 0 ? false : _d, onOpenChange = _a.onOpenChange, props = __rest(_a, ["editor", "levels", "hideWhenUnavailable", "onOpenChange"]);
    var _e = React.useState(false), isOpen = _e[0], setIsOpen = _e[1];
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var headingInSchema = (0, tiptap_utils_1.isNodeInSchema)("heading", editor);
    var handleOnOpenChange = React.useCallback(function (open) {
        setIsOpen(open);
        onOpenChange === null || onOpenChange === void 0 ? void 0 : onOpenChange(open);
    }, [onOpenChange]);
    var getActiveIcon = React.useCallback(function () {
        if (!editor)
            return <heading_icon_1.HeadingIcon className="tiptap-button-icon"/>;
        var activeLevel = levels.find(function (level) {
            return editor.isActive("heading", { level: level });
        });
        if (!activeLevel)
            return <heading_icon_1.HeadingIcon className="tiptap-button-icon"/>;
        var ActiveIcon = heading_button_1.headingIcons[activeLevel];
        return <ActiveIcon className="tiptap-button-icon"/>;
    }, [editor, levels]);
    var canToggleAnyHeading = React.useCallback(function () {
        if (!editor)
            return false;
        return levels.some(function (level) {
            return editor.can().toggleNode("heading", "paragraph", { level: level });
        });
    }, [editor, levels]);
    var isDisabled = !canToggleAnyHeading();
    var isAnyHeadingActive = (_b = editor === null || editor === void 0 ? void 0 : editor.isActive("heading")) !== null && _b !== void 0 ? _b : false;
    var show = React.useMemo(function () {
        if (!headingInSchema || !editor) {
            return false;
        }
        if (hideWhenUnavailable) {
            if ((0, react_1.isNodeSelection)(editor.state.selection) || !canToggleAnyHeading()) {
                return false;
            }
        }
        return true;
    }, [headingInSchema, editor, hideWhenUnavailable, canToggleAnyHeading]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (<dropdown_menu_1.DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <dropdown_menu_1.DropdownMenuTrigger asChild>
        <button_1.Button type="button" disabled={isDisabled} data-style="ghost" data-active-state={isAnyHeadingActive ? "on" : "off"} data-disabled={isDisabled} role="button" tabIndex={-1} aria-label="Format text as heading" aria-pressed={isAnyHeadingActive} tooltip="Heading" {...props}>
          {getActiveIcon()}
          <chevron_down_icon_1.ChevronDownIcon className="tiptap-button-dropdown-small"/>
        </button_1.Button>
      </dropdown_menu_1.DropdownMenuTrigger>

      <dropdown_menu_1.DropdownMenuContent>
        <dropdown_menu_1.DropdownMenuGroup>
          {levels.map(function (level) { return (<dropdown_menu_1.DropdownMenuItem key={"heading-".concat(level)} asChild>
              <heading_button_1.HeadingButton editor={editor} level={level} text={(0, heading_button_1.getFormattedHeadingName)(level)} tooltip={""}/>
            </dropdown_menu_1.DropdownMenuItem>); })}
        </dropdown_menu_1.DropdownMenuGroup>
      </dropdown_menu_1.DropdownMenuContent>
    </dropdown_menu_1.DropdownMenu>);
}
exports.default = HeadingDropdownMenu;
