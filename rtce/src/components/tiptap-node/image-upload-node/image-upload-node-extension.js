"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploadNode = void 0;
var react_1 = require("@tiptap/react");
var react_2 = require("@tiptap/react");
var image_upload_node_1 = require("@/components/tiptap-node/image-upload-node/image-upload-node");
/**
 * A TipTap node extension that creates an image upload component.
 * @see registry/tiptap-node/image-upload-node/image-upload-node
 */
exports.ImageUploadNode = react_1.Node.create({
    name: "imageUpload",
    group: "block",
    draggable: true,
    selectable: true,
    atom: true,
    addOptions: function () {
        return {
            accept: "image/*",
            limit: 1,
            maxSize: 0,
            upload: undefined,
            onError: undefined,
            onSuccess: undefined,
        };
    },
    addAttributes: function () {
        return {
            accept: {
                default: this.options.accept,
            },
            limit: {
                default: this.options.limit,
            },
            maxSize: {
                default: this.options.maxSize,
            },
        };
    },
    parseHTML: function () {
        return [{ tag: 'div[data-type="image-upload"]' }];
    },
    renderHTML: function (_a) {
        var HTMLAttributes = _a.HTMLAttributes;
        return [
            "div",
            (0, react_1.mergeAttributes)({ "data-type": "image-upload" }, HTMLAttributes),
        ];
    },
    addNodeView: function () {
        return (0, react_2.ReactNodeViewRenderer)(image_upload_node_1.ImageUploadNode);
    },
    addCommands: function () {
        var _this = this;
        return {
            setImageUploadNode: function (options) {
                if (options === void 0) { options = {}; }
                return function (_a) {
                    var commands = _a.commands;
                    return commands.insertContent({
                        type: _this.name,
                        attrs: options,
                    });
                };
            },
        };
    },
    /**
     * Adds Enter key handler to trigger the upload component when it's selected.
     */
    addKeyboardShortcuts: function () {
        return {
            Enter: function (_a) {
                var editor = _a.editor;
                var selection = editor.state.selection;
                var nodeAfter = selection.$from.nodeAfter;
                if (nodeAfter &&
                    nodeAfter.type.name === "imageUpload" &&
                    editor.isActive("imageUpload")) {
                    var nodeEl = editor.view.nodeDOM(selection.$from.pos);
                    if (nodeEl && nodeEl instanceof HTMLElement) {
                        // Since NodeViewWrapper is wrapped with a div, we need to click the first child
                        var firstChild = nodeEl.firstChild;
                        if (firstChild && firstChild instanceof HTMLElement) {
                            firstChild.click();
                            return true;
                        }
                    }
                }
                return false;
            },
        };
    },
});
exports.default = exports.ImageUploadNode;
