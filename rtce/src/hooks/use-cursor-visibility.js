"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCursorVisibility = useCursorVisibility;
var React = require("react");
var use_window_size_1 = require("@/hooks/use-window-size");
/**
 * Custom hook that ensures the cursor remains visible when typing in a TipTap editor.
 * Automatically scrolls the window when the cursor would be hidden by the toolbar.
 *
 * This is particularly useful for long-form content editing where the cursor
 * might move out of the visible area as the user types.
 *
 * @param options Configuration options for cursor visibility behavior
 * @returns void
 */
function useCursorVisibility(_a) {
    var editor = _a.editor, _b = _a.overlayHeight, overlayHeight = _b === void 0 ? 0 : _b, _c = _a.elementRef, elementRef = _c === void 0 ? null : _c;
    var windowHeight = (0, use_window_size_1.useWindowSize)().height;
    var _d = React.useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }), rect = _d[0], setRect = _d[1];
    var updateRect = React.useCallback(function () {
        var _a;
        var element = (_a = elementRef === null || elementRef === void 0 ? void 0 : elementRef.current) !== null && _a !== void 0 ? _a : document.body;
        var _b = element.getBoundingClientRect(), x = _b.x, y = _b.y, width = _b.width, height = _b.height;
        setRect({ x: x, y: y, width: width, height: height });
    }, [elementRef]);
    React.useEffect(function () {
        var _a;
        var element = (_a = elementRef === null || elementRef === void 0 ? void 0 : elementRef.current) !== null && _a !== void 0 ? _a : document.body;
        updateRect();
        var resizeObserver = new ResizeObserver(function () {
            window.requestAnimationFrame(updateRect);
        });
        resizeObserver.observe(element);
        window.addEventListener("scroll", updateRect, { passive: true });
        return function () {
            resizeObserver.disconnect();
            window.removeEventListener("scroll", updateRect);
        };
    }, [elementRef, updateRect]);
    React.useEffect(function () {
        var ensureCursorVisibility = function () {
            if (!editor)
                return;
            var state = editor.state, view = editor.view;
            if (!view.hasFocus())
                return;
            // Get current cursor position coordinates
            var from = state.selection.from;
            var cursorCoords = view.coordsAtPos(from);
            if (windowHeight < rect.height) {
                if (cursorCoords) {
                    // Check if there's enough space between cursor and bottom of window
                    var availableSpace = windowHeight - cursorCoords.top - overlayHeight > 0;
                    // If not enough space, scroll to position cursor in the middle of viewport
                    if (!availableSpace) {
                        var targetScrollY = 
                        // TODO: Needed?
                        //   window.scrollY + (cursorCoords.top - windowHeight / 2)
                        cursorCoords.top - windowHeight / 2;
                        window.scrollTo({
                            top: targetScrollY,
                            behavior: "smooth",
                        });
                    }
                }
            }
        };
        ensureCursorVisibility();
    }, [editor, overlayHeight, windowHeight, rect.height]);
    return rect;
}
