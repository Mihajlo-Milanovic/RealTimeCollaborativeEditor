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
exports.TextAlignButton = exports.textAlignLabels = exports.textAlignShortcutKeys = exports.textAlignIcons = void 0;
exports.hasSetTextAlign = hasSetTextAlign;
exports.checkTextAlignExtension = checkTextAlignExtension;
exports.canSetTextAlign = canSetTextAlign;
exports.isTextAlignActive = isTextAlignActive;
exports.setTextAlign = setTextAlign;
exports.isTextAlignButtonDisabled = isTextAlignButtonDisabled;
exports.shouldShowTextAlignButton = shouldShowTextAlignButton;
exports.useTextAlign = useTextAlign;
var React = require("react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var align_center_icon_1 = require("@/components/tiptap-icons/align-center-icon");
var align_justify_icon_1 = require("@/components/tiptap-icons/align-justify-icon");
var align_left_icon_1 = require("@/components/tiptap-icons/align-left-icon");
var align_right_icon_1 = require("@/components/tiptap-icons/align-right-icon");
var button_1 = require("@/components/tiptap-ui-primitive/button");
exports.textAlignIcons = {
    left: align_left_icon_1.AlignLeftIcon,
    center: align_center_icon_1.AlignCenterIcon,
    right: align_right_icon_1.AlignRightIcon,
    justify: align_justify_icon_1.AlignJustifyIcon,
};
exports.textAlignShortcutKeys = {
    left: "Ctrl-Shift-l",
    center: "Ctrl-Shift-e",
    right: "Ctrl-Shift-r",
    justify: "Ctrl-Shift-j",
};
exports.textAlignLabels = {
    left: "Align left",
    center: "Align center",
    right: "Align right",
    justify: "Align justify",
};
function hasSetTextAlign(commands) {
    return "setTextAlign" in commands;
}
function checkTextAlignExtension(editor) {
    if (!editor)
        return false;
    var hasExtension = editor.extensionManager.extensions.some(function (extension) { return extension.name === "textAlign"; });
    if (!hasExtension) {
        console.warn("TextAlign extension is not available. " +
            "Make sure it is included in your editor configuration.");
    }
    return hasExtension;
}
function canSetTextAlign(editor, align, alignAvailable) {
    if (!editor || !alignAvailable)
        return false;
    try {
        return editor.can().setTextAlign(align);
    }
    catch (_a) {
        return false;
    }
}
function isTextAlignActive(editor, align) {
    if (!editor)
        return false;
    return editor.isActive({ textAlign: align });
}
function setTextAlign(editor, align) {
    if (!editor)
        return false;
    var chain = editor.chain().focus();
    if (hasSetTextAlign(chain)) {
        return chain.setTextAlign(align).run();
    }
    return false;
}
function isTextAlignButtonDisabled(editor, alignAvailable, canAlign, userDisabled) {
    if (userDisabled === void 0) { userDisabled = false; }
    if (!editor || !alignAvailable)
        return true;
    if (userDisabled)
        return true;
    if (!canAlign)
        return true;
    return false;
}
function shouldShowTextAlignButton(editor, canAlign, hideWhenUnavailable) {
    if (!(editor === null || editor === void 0 ? void 0 : editor.isEditable))
        return false;
    if (hideWhenUnavailable && !canAlign)
        return false;
    return true;
}
function useTextAlign(editor, align, disabled, hideWhenUnavailable) {
    if (disabled === void 0) { disabled = false; }
    if (hideWhenUnavailable === void 0) { hideWhenUnavailable = false; }
    var alignAvailable = React.useMemo(function () { return checkTextAlignExtension(editor); }, [editor]);
    var canAlign = React.useMemo(function () { return canSetTextAlign(editor, align, alignAvailable); }, [editor, align, alignAvailable]);
    var isDisabled = isTextAlignButtonDisabled(editor, alignAvailable, canAlign, disabled);
    var isActive = isTextAlignActive(editor, align);
    var handleAlignment = React.useCallback(function () {
        if (!alignAvailable || !editor || isDisabled)
            return false;
        return setTextAlign(editor, align);
    }, [alignAvailable, editor, isDisabled, align]);
    var shouldShow = React.useMemo(function () { return shouldShowTextAlignButton(editor, canAlign, hideWhenUnavailable); }, [editor, canAlign, hideWhenUnavailable]);
    var Icon = exports.textAlignIcons[align];
    var shortcutKey = exports.textAlignShortcutKeys[align];
    var label = exports.textAlignLabels[align];
    return {
        alignAvailable: alignAvailable,
        canAlign: canAlign,
        isDisabled: isDisabled,
        isActive: isActive,
        handleAlignment: handleAlignment,
        shouldShow: shouldShow,
        Icon: Icon,
        shortcutKey: shortcutKey,
        label: label,
    };
}
exports.TextAlignButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, align = _a.align, text = _a.text, _b = _a.hideWhenUnavailable, hideWhenUnavailable = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c, disabled = _a.disabled, onClick = _a.onClick, children = _a.children, buttonProps = __rest(_a, ["editor", "align", "text", "hideWhenUnavailable", "className", "disabled", "onClick", "children"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useTextAlign(editor, align, disabled, hideWhenUnavailable), isDisabled = _d.isDisabled, isActive = _d.isActive, handleAlignment = _d.handleAlignment, shouldShow = _d.shouldShow, Icon = _d.Icon, shortcutKey = _d.shortcutKey, label = _d.label;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && !disabled) {
            handleAlignment();
        }
    }, [onClick, disabled, handleAlignment]);
    if (!shouldShow || !editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button type="button" className={className.trim()} disabled={isDisabled} data-style="ghost" data-active-state={isActive ? "on" : "off"} data-disabled={isDisabled} role="button" tabIndex={-1} aria-label={label} aria-pressed={isActive} tooltip={label} shortcutKeys={shortcutKey} onClick={handleClick} {...buttonProps} ref={ref}>
        {children || (<>
            <Icon className="tiptap-button-icon"/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.TextAlignButton.displayName = "TextAlignButton";
exports.default = exports.TextAlignButton;
