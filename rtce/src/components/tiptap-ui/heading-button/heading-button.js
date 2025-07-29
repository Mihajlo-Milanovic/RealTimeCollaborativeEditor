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
exports.HeadingButton = exports.headingShortcutKeys = exports.headingIcons = void 0;
exports.canToggleHeading = canToggleHeading;
exports.isHeadingActive = isHeadingActive;
exports.toggleHeading = toggleHeading;
exports.isHeadingButtonDisabled = isHeadingButtonDisabled;
exports.shouldShowHeadingButton = shouldShowHeadingButton;
exports.getFormattedHeadingName = getFormattedHeadingName;
exports.useHeadingState = useHeadingState;
var React = require("react");
var react_1 = require("@tiptap/react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var heading_one_icon_1 = require("@/components/tiptap-icons/heading-one-icon");
var heading_two_icon_1 = require("@/components/tiptap-icons/heading-two-icon");
var heading_three_icon_1 = require("@/components/tiptap-icons/heading-three-icon");
var heading_four_icon_1 = require("@/components/tiptap-icons/heading-four-icon");
var heading_five_icon_1 = require("@/components/tiptap-icons/heading-five-icon");
var heading_six_icon_1 = require("@/components/tiptap-icons/heading-six-icon");
// --- Lib ---
var tiptap_utils_1 = require("@/lib/tiptap-utils");
var button_1 = require("@/components/tiptap-ui-primitive/button");
exports.headingIcons = {
    1: heading_one_icon_1.HeadingOneIcon,
    2: heading_two_icon_1.HeadingTwoIcon,
    3: heading_three_icon_1.HeadingThreeIcon,
    4: heading_four_icon_1.HeadingFourIcon,
    5: heading_five_icon_1.HeadingFiveIcon,
    6: heading_six_icon_1.HeadingSixIcon,
};
exports.headingShortcutKeys = {
    1: "Ctrl-Alt-1",
    2: "Ctrl-Alt-2",
    3: "Ctrl-Alt-3",
    4: "Ctrl-Alt-4",
    5: "Ctrl-Alt-5",
    6: "Ctrl-Alt-6",
};
function canToggleHeading(editor, level) {
    if (!editor)
        return false;
    try {
        return editor.can().toggleNode("heading", "paragraph", { level: level });
    }
    catch (_a) {
        return false;
    }
}
function isHeadingActive(editor, level) {
    if (!editor)
        return false;
    return editor.isActive("heading", { level: level });
}
function toggleHeading(editor, level) {
    if (!editor)
        return;
    if (editor.isActive("heading", { level: level })) {
        editor.chain().focus().setNode("paragraph").run();
    }
    else {
        editor.chain().focus().toggleNode("heading", "paragraph", { level: level }).run();
    }
}
function isHeadingButtonDisabled(editor, level, userDisabled) {
    if (userDisabled === void 0) { userDisabled = false; }
    if (!editor)
        return true;
    if (userDisabled)
        return true;
    if (!canToggleHeading(editor, level))
        return true;
    return false;
}
function shouldShowHeadingButton(params) {
    var editor = params.editor, hideWhenUnavailable = params.hideWhenUnavailable, headingInSchema = params.headingInSchema;
    if (!headingInSchema || !editor) {
        return false;
    }
    if (hideWhenUnavailable) {
        if ((0, react_1.isNodeSelection)(editor.state.selection)) {
            return false;
        }
    }
    return true;
}
function getFormattedHeadingName(level) {
    return "Heading ".concat(level);
}
function useHeadingState(editor, level, disabled) {
    if (disabled === void 0) { disabled = false; }
    var headingInSchema = (0, tiptap_utils_1.isNodeInSchema)("heading", editor);
    var isDisabled = isHeadingButtonDisabled(editor, level, disabled);
    var isActive = isHeadingActive(editor, level);
    var Icon = exports.headingIcons[level];
    var shortcutKey = exports.headingShortcutKeys[level];
    var formattedName = getFormattedHeadingName(level);
    return {
        headingInSchema: headingInSchema,
        isDisabled: isDisabled,
        isActive: isActive,
        Icon: Icon,
        shortcutKey: shortcutKey,
        formattedName: formattedName,
    };
}
exports.HeadingButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, level = _a.level, text = _a.text, _b = _a.hideWhenUnavailable, hideWhenUnavailable = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c, disabled = _a.disabled, onClick = _a.onClick, children = _a.children, buttonProps = __rest(_a, ["editor", "level", "text", "hideWhenUnavailable", "className", "disabled", "onClick", "children"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useHeadingState(editor, level, disabled), headingInSchema = _d.headingInSchema, isDisabled = _d.isDisabled, isActive = _d.isActive, Icon = _d.Icon, shortcutKey = _d.shortcutKey, formattedName = _d.formattedName;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && !isDisabled && editor) {
            toggleHeading(editor, level);
        }
    }, [onClick, isDisabled, editor, level]);
    var show = React.useMemo(function () {
        return shouldShowHeadingButton({
            editor: editor,
            level: level,
            hideWhenUnavailable: hideWhenUnavailable,
            headingInSchema: headingInSchema,
        });
    }, [editor, level, hideWhenUnavailable, headingInSchema]);
    if (!show || !editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button type="button" className={className.trim()} disabled={isDisabled} data-style="ghost" data-active-state={isActive ? "on" : "off"} data-disabled={isDisabled} role="button" tabIndex={-1} aria-label={formattedName} aria-pressed={isActive} tooltip={formattedName} shortcutKeys={shortcutKey} onClick={handleClick} {...buttonProps} ref={ref}>
        {children || (<>
            <Icon className="tiptap-button-icon"/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.HeadingButton.displayName = "HeadingButton";
exports.default = exports.HeadingButton;
