"use strict";
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
exports.Link = void 0;
var extension_link_1 = require("@tiptap/extension-link");
var react_1 = require("@tiptap/react");
var state_1 = require("@tiptap/pm/state");
exports.Link = extension_link_1.default.extend({
    inclusive: false,
    parseHTML: function () {
        return [
            {
                tag: 'a[href]:not([data-type="button"]):not([href *= "javascript:" i])',
            },
        ];
    },
    addProseMirrorPlugins: function () {
        var _a;
        var editor = this.editor;
        return __spreadArray(__spreadArray([], (((_a = this.parent) === null || _a === void 0 ? void 0 : _a.call(this)) || []), true), [
            new state_1.Plugin({
                props: {
                    handleKeyDown: function (_, event) {
                        var selection = editor.state.selection;
                        if (event.key === "Escape" && selection.empty !== true) {
                            editor.commands.focus(selection.to, { scrollIntoView: false });
                        }
                        return false;
                    },
                    handleClick: function (view, pos) {
                        var _a = view.state, schema = _a.schema, doc = _a.doc, tr = _a.tr;
                        var range;
                        if (schema.marks.link) {
                            range = (0, react_1.getMarkRange)(doc.resolve(pos), schema.marks.link);
                        }
                        if (!range) {
                            return;
                        }
                        var from = range.from, to = range.to;
                        var start = Math.min(from, to);
                        var end = Math.max(from, to);
                        if (pos < start || pos > end) {
                            return;
                        }
                        var $start = doc.resolve(start);
                        var $end = doc.resolve(end);
                        var transaction = tr.setSelection(new state_1.TextSelection($start, $end));
                        view.dispatch(transaction);
                    },
                },
            }),
        ], false);
    },
});
exports.default = exports.Link;
