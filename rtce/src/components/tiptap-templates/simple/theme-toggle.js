"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeToggle = ThemeToggle;
var React = require("react");
// --- UI Primitives ---
var button_1 = require("@/components/tiptap-ui-primitive/button");
// --- Icons ---
var moon_star_icon_1 = require("@/components/tiptap-icons/moon-star-icon");
var sun_icon_1 = require("@/components/tiptap-icons/sun-icon");
function ThemeToggle() {
    var _a = React.useState(true), isDarkMode = _a[0], setIsDarkMode = _a[1];
    React.useEffect(function () {
        var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        var handleChange = function () { return setIsDarkMode(mediaQuery.matches); };
        mediaQuery.addEventListener("change", handleChange);
        return function () { return mediaQuery.removeEventListener("change", handleChange); };
    }, []);
    React.useEffect(function () {
        var initialDarkMode = !!document.querySelector('meta[name="color-scheme"][content="dark"]') ||
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(initialDarkMode);
    }, []);
    React.useEffect(function () {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);
    var toggleDarkMode = function () { return setIsDarkMode(function (isDark) { return !isDark; }); };
    return (<button_1.Button onClick={toggleDarkMode} aria-label={"Switch to ".concat(isDarkMode ? "light" : "dark", " mode")} data-style="ghost">
      {isDarkMode ? (<moon_star_icon_1.MoonStarIcon className="tiptap-button-icon"/>) : (<sun_icon_1.SunIcon className="tiptap-button-icon"/>)}
    </button_1.Button>);
}
