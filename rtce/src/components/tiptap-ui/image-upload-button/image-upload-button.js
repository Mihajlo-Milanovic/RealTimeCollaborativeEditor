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
exports.ImageUploadButton = void 0;
exports.isImageActive = isImageActive;
exports.insertImage = insertImage;
exports.useImageUploadButton = useImageUploadButton;
var React = require("react");
// --- Hooks ---
var use_tiptap_editor_1 = require("@/hooks/use-tiptap-editor");
// --- Icons ---
var image_plus_icon_1 = require("@/components/tiptap-icons/image-plus-icon");
var button_1 = require("@/components/tiptap-ui-primitive/button");
function isImageActive(editor, extensionName) {
    if (!editor)
        return false;
    return editor.isActive(extensionName);
}
function insertImage(editor, extensionName) {
    if (!editor)
        return false;
    return editor
        .chain()
        .focus()
        .insertContent({
        type: extensionName,
    })
        .run();
}
function useImageUploadButton(editor, extensionName, disabled) {
    if (extensionName === void 0) { extensionName = "imageUpload"; }
    if (disabled === void 0) { disabled = false; }
    var isActive = isImageActive(editor, extensionName);
    var handleInsertImage = React.useCallback(function () {
        if (disabled)
            return false;
        return insertImage(editor, extensionName);
    }, [editor, extensionName, disabled]);
    return {
        isActive: isActive,
        handleInsertImage: handleInsertImage,
    };
}
exports.ImageUploadButton = React.forwardRef(function (_a, ref) {
    var providedEditor = _a.editor, _b = _a.extensionName, extensionName = _b === void 0 ? "imageUpload" : _b, text = _a.text, _c = _a.className, className = _c === void 0 ? "" : _c, disabled = _a.disabled, onClick = _a.onClick, children = _a.children, buttonProps = __rest(_a, ["editor", "extensionName", "text", "className", "disabled", "onClick", "children"]);
    var editor = (0, use_tiptap_editor_1.useTiptapEditor)(providedEditor);
    var _d = useImageUploadButton(editor, extensionName, disabled), isActive = _d.isActive, handleInsertImage = _d.handleInsertImage;
    var handleClick = React.useCallback(function (e) {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        if (!e.defaultPrevented && !disabled) {
            handleInsertImage();
        }
    }, [onClick, disabled, handleInsertImage]);
    if (!editor || !editor.isEditable) {
        return null;
    }
    return (<button_1.Button ref={ref} type="button" className={className.trim()} data-style="ghost" data-active-state={isActive ? "on" : "off"} role="button" tabIndex={-1} aria-label="Add image" aria-pressed={isActive} tooltip="Add image" onClick={handleClick} {...buttonProps}>
        {children || (<>
            <image_plus_icon_1.ImagePlusIcon className="tiptap-button-icon"/>
            {text && <span className="tiptap-button-text">{text}</span>}
          </>)}
      </button_1.Button>);
});
exports.ImageUploadButton.displayName = "ImageUploadButton";
exports.default = exports.ImageUploadButton;
