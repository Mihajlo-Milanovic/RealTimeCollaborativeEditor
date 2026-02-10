"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailingNode = void 0;
var react_1 = require("@tiptap/react");
var state_1 = require("@tiptap/pm/state");
function nodeEqualsType(_a) {
    var types = _a.types, node = _a.node;
    if (!node)
        return false;
    if (Array.isArray(types)) {
        return types.includes(node.type);
    }
    return node.type === types;
}
exports.TrailingNode = react_1.Extension.create({
    name: "trailingNode",
    addOptions: function () {
        return {
            node: "paragraph",
            notAfter: ["paragraph"],
        };
    },
    addProseMirrorPlugins: function () {
        var _this = this;
        var plugin = new state_1.PluginKey(this.name);
        var disabledNodes = Object.entries(this.editor.schema.nodes)
            .map(function (_a) {
            var value = _a[1];
            return value;
        })
            .filter(function (node) { return _this.options.notAfter.includes(node.name); });
        return [
            new state_1.Plugin({
                key: plugin,
                appendTransaction: function (_, __, state) {
                    var doc = state.doc, tr = state.tr, schema = state.schema;
                    var shouldInsertNodeAtEnd = plugin.getState(state);
                    var endPosition = doc.content.size;
                    var type = schema.nodes[_this.options.node];
                    if (!shouldInsertNodeAtEnd) {
                        return null;
                    }
                    if (type) {
                        return tr.insert(endPosition, type.create());
                    }
                    return null;
                },
                state: {
                    init: function (_, state) {
                        var lastNode = state.tr.doc.lastChild;
                        return !nodeEqualsType({ node: lastNode, types: disabledNodes });
                    },
                    apply: function (tr, value) {
                        if (!tr.docChanged) {
                            return value;
                        }
                        var lastNode = tr.doc.lastChild;
                        return !nodeEqualsType({ node: lastNode, types: disabledNodes });
                    },
                },
            }),
        ];
    },
});
exports.default = exports.TrailingNode;
