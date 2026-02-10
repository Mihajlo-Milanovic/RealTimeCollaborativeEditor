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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorHighlightPopoverButton = exports.DEFAULT_HIGHLIGHT_COLORS = void 0;
exports.ColorHighlightPopoverContent = ColorHighlightPopoverContent;
exports.ColorHighlightPopover = ColorHighlightPopover;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_menu_navigation_1 = require("@/hooks/use-menu-navigation");
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var ban_icon_1 = require("@/components/tiptap-icons/ban-icon");
var highlighter_icon_1 = require("@/components/tiptap-icons/highlighter-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
var button_1 = require("@/components/tiptap-ui-primitive/button");
var popover_1 = require("@/components/tiptap-ui-primitive/popover");
var separator_1 = require("@/components/tiptap-ui-primitive/separator");
// --- Tiptap UI ---
var color_highlight_button_1 = require("@/components/tiptap-ui/color-highlight-button");
// --- Styles ---
require("@/components/tiptap-ui/color-highlight-popover/color-highlight-popover.scss");
exports.DEFAULT_HIGHLIGHT_COLORS = [
    {
        label: "Green",
        value: "var(--tt-color-highlight-green)",
        border: "var(--tt-color-highlight-green-contrast)",
    },
    {
        label: "Blue",
        value: "var(--tt-color-highlight-blue)",
        border: "var(--tt-color-highlight-blue-contrast)",
    },
    {
        label: "Red",
        value: "var(--tt-color-highlight-red)",
        border: "var(--tt-color-highlight-red-contrast)",
    },
    {
        label: "Purple",
        value: "var(--tt-color-highlight-purple)",
        border: "var(--tt-color-highlight-purple-contrast)",
    },
    {
        label: "Yellow",
        value: "var(--tt-color-highlight-yellow)",
        border: "var(--tt-color-highlight-yellow-contrast)",
    },
];
exports.ColorHighlightPopoverButton = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<button_1.Button type="button" className={className} data-style="ghost" data-appearance="default" role="button" tabIndex={-1} aria-label="Highlight text" tooltip="Highlight" ref={ref} {...props}>
    {children || <highlighter_icon_1.HighlighterIcon className="tiptap-button-icon"/>}
  </button_1.Button>);
});
exports.ColorHighlightPopoverButton.displayName = "ColorHighlightPopoverButton";
function ColorHighlightPopoverContent(_a) {
    var providedEditor = _a.editor, _b = _a.colors, colors = _b === void 0 ? exports.DEFAULT_HIGHLIGHT_COLORS : _b, onClose = _a.onClose;
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var containerRef = React.useRef(null);
    var removeHighlight = React.useCallback(function () {
        if (!editor)
            return;
        editor.chain().focus().unsetMark("highlight").run();
        onClose === null || onClose === void 0 ? void 0 : onClose();
    }, [editor, onClose]);
    var menuItems = React.useMemo(function () { return __spreadArray(__spreadArray([], colors, true), [{ label: "Remove highlight", value: "none" }], false); }, [colors]);
    var selectedIndex = (0, use_menu_navigation_1.useMenuNavigation)({
        containerRef: containerRef,
        items: menuItems,
        orientation: "both",
        onSelect: function (item) {
            if (item.value === "none") {
                removeHighlight();
            }
            onClose === null || onClose === void 0 ? void 0 : onClose();
        },
        onClose: onClose,
        autoSelectFirstItem: false,
    }).selectedIndex;
    return (<div ref={containerRef} className="tiptap-color-highlight-content" tabIndex={0}>
      <div className="tiptap-button-group" data-orientation="horizontal">
        {colors.map(function (color, index) { return (<color_highlight_button_1.ColorHighlightButton key={color.value} editor={editor} color={color.value} aria-label={"".concat(color.label, " highlight color")} tabIndex={index === selectedIndex ? 0 : -1} data-highlighted={selectedIndex === index} onClick={onClose}/>); })}
      </div>

      <separator_1.Separator />

      <div className="tiptap-button-group">
        <button_1.Button onClick={removeHighlight} aria-label="Remove highlight" tabIndex={selectedIndex === colors.length ? 0 : -1} type="button" role="menuitem" data-style="ghost" data-highlighted={selectedIndex === colors.length}>
          <ban_icon_1.BanIcon className="tiptap-button-icon"/>
        </button_1.Button>
      </div>
    </div>);
}
function ColorHighlightPopover(_a) {
    var _b;
    var providedEditor = _a.editor, _c = _a.colors, colors = _c === void 0 ? exports.DEFAULT_HIGHLIGHT_COLORS : _c, _d = _a.hideWhenUnavailable, hideWhenUnavailable = _d === void 0 ? false : _d, props = __rest(_a, ["editor", "colors", "hideWhenUnavailable"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _e = React.useState(false), isOpen = _e[0], setIsOpen = _e[1];
    var _f = React.useState(false), isDisabled = _f[0], setIsDisabled = _f[1];
    var markAvailable = (0, tiptap_utils_1.isMarkInSchema)("highlight", editor);
    React.useEffect(function () {
        if (!editor)
            return;
        var updateIsDisabled = function () {
            var isDisabled = false;
            if (!markAvailable || !editor) {
                isDisabled = true;
            }
            var isInCompatibleContext = editor.isActive("code") ||
                editor.isActive("codeBlock") ||
                editor.isActive("imageUpload");
            if (isInCompatibleContext) {
                isDisabled = true;
            }
            setIsDisabled(isDisabled);
        };
        editor.on("selectionUpdate", updateIsDisabled);
        editor.on("update", updateIsDisabled);
        return function () {
            editor.off("selectionUpdate", updateIsDisabled);
            editor.off("update", updateIsDisabled);
        };
    }, [editor, markAvailable]);
    var isActive = (_b = editor === null || editor === void 0 ? void 0 : editor.isActive("highlight")) !== null && _b !== void 0 ? _b : false;
    var shouldShow = React.useMemo(function () {
        if (!hideWhenUnavailable || !editor)
            return true;
        return !((0, react_1.isNodeSelection)(editor.state.selection) || !(0, color_highlight_button_1.canToggleHighlight)(editor));
    }, [hideWhenUnavailable, editor]);
    if (!shouldShow || !editor || !editor.isEditable) {
        return null;
    }
    return (<popover_1.Popover open={isOpen} onOpenChange={setIsOpen}>
      <popover_1.PopoverTrigger asChild>
        <exports.ColorHighlightPopoverButton disabled={isDisabled} data-active-state={isActive ? "on" : "off"} data-disabled={isDisabled} aria-pressed={isActive} {...props}/>
      </popover_1.PopoverTrigger>

      <popover_1.PopoverContent aria-label="Highlight colors">
        <ColorHighlightPopoverContent editor={editor} colors={colors} onClose={function () { return setIsOpen(false); }}/>
      </popover_1.PopoverContent>
    </popover_1.Popover>);
}
exports.default = ColorHighlightPopover;
