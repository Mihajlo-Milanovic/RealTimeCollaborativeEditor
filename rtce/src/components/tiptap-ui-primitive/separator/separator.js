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
exports.Separator = void 0;
var React = require("react");
require("@/components/tiptap-ui-primitive/separator/separator.scss");
exports.Separator = React.forwardRef(function (_a, ref) {
    var decorative = _a.decorative, _b = _a.orientation, orientation = _b === void 0 ? "vertical" : _b, _c = _a.className, className = _c === void 0 ? "" : _c, divProps = __rest(_a, ["decorative", "orientation", "className"]);
    var ariaOrientation = orientation === "vertical" ? orientation : undefined;
    var semanticProps = decorative
        ? { role: "none" }
        : { "aria-orientation": ariaOrientation, role: "separator" };
    return (<div className={"tiptap-separator ".concat(className).trim()} data-orientation={orientation} {...semanticProps} {...divProps} ref={ref}/>);
});
exports.Separator.displayName = "Separator";
