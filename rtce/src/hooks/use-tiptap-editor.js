"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTiptapEditor = useTiptapEditor;
var React = require("react");
var react_1 = require("@tiptap/react");
function useTiptapEditor(providedEditor) {
    var coreEditor = (0, react_1.useCurrentEditor)().editor;
    return React.useMemo(function () { return providedEditor || coreEditor; }, [providedEditor, coreEditor]);
}
