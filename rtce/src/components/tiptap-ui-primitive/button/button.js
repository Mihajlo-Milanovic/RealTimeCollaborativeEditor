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
exports.Button = exports.ShortcutDisplay = exports.parseShortcutKeys = exports.formatShortcutKey = exports.MAC_SYMBOLS = void 0;
var React = require("react");
var tooltip_1 = require("@/components/tiptap-ui-primitive/tooltip");
require("@/components/tiptap-ui-primitive/button/button-colors.scss");
require("@/components/tiptap-ui-primitive/button/button-group.scss");
require("@/components/tiptap-ui-primitive/button/button.scss");
exports.MAC_SYMBOLS = {
    ctrl: "⌘",
    alt: "⌥",
    shift: "⇧",
};
var formatShortcutKey = function (key, isMac) {
    if (isMac) {
        var lowerKey = key.toLowerCase();
        return exports.MAC_SYMBOLS[lowerKey] || key.toUpperCase();
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
};
exports.formatShortcutKey = formatShortcutKey;
var parseShortcutKeys = function (shortcutKeys, isMac) {
    if (!shortcutKeys)
        return [];
    return shortcutKeys
        .split("-")
        .map(function (key) { return key.trim(); })
        .map(function (key) { return (0, exports.formatShortcutKey)(key, isMac); });
};
exports.parseShortcutKeys = parseShortcutKeys;
var ShortcutDisplay = function (_a) {
    var shortcuts = _a.shortcuts;
    if (shortcuts.length === 0)
        return null;
    return (<div>
      {shortcuts.map(function (key, index) { return (<React.Fragment key={index}>
          {index > 0 && <kbd>+</kbd>}
          <kbd>{key}</kbd>
        </React.Fragment>); })}
    </div>);
};
exports.ShortcutDisplay = ShortcutDisplay;
exports.Button = React.forwardRef(function (_a, ref) {
    var _b = _a.className, className = _b === void 0 ? "" : _b, children = _a.children, tooltip = _a.tooltip, _c = _a.showTooltip, showTooltip = _c === void 0 ? true : _c, shortcutKeys = _a.shortcutKeys, ariaLabel = _a["aria-label"], props = __rest(_a, ["className", "children", "tooltip", "showTooltip", "shortcutKeys", "aria-label"]);
    var isMac = React.useMemo(function () {
        return typeof navigator !== "undefined" &&
            navigator.platform.toLowerCase().includes("mac");
    }, []);
    var shortcuts = React.useMemo(function () { return (0, exports.parseShortcutKeys)(shortcutKeys, isMac); }, [shortcutKeys, isMac]);
    if (!tooltip || !showTooltip) {
        return (<button className={"tiptap-button ".concat(className).trim()} ref={ref} aria-label={ariaLabel} {...props}>
          {children}
        </button>);
    }
    return (<tooltip_1.Tooltip delay={200}>
        <tooltip_1.TooltipTrigger className={"tiptap-button ".concat(className).trim()} ref={ref} aria-label={ariaLabel} {...props}>
          {children}
        </tooltip_1.TooltipTrigger>
        <tooltip_1.TooltipContent>
          {tooltip}
          <exports.ShortcutDisplay shortcuts={shortcuts}/>
        </tooltip_1.TooltipContent>
      </tooltip_1.Tooltip>);
});
exports.Button.displayName = "Button";
exports.default = exports.Button;
