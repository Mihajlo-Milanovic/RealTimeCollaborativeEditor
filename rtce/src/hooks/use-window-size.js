"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowSize = useWindowSize;
var React = require("react");
/**
 * Custom hook to track window size and viewport information
 * @returns Current window dimensions and offsetTop
 */
function useWindowSize() {
    var _a = React.useState({
        width: 0,
        height: 0,
        offsetTop: 0,
    }), windowSize = _a[0], setWindowSize = _a[1];
    React.useEffect(function () {
        handleResize();
        function handleResize() {
            if (typeof window === "undefined")
                return;
            var vp = window.visualViewport;
            if (!vp)
                return;
            var _a = vp.width, width = _a === void 0 ? 0 : _a, _b = vp.height, height = _b === void 0 ? 0 : _b, _c = vp.offsetTop, offsetTop = _c === void 0 ? 0 : _c;
            // Only update state if values have changed
            setWindowSize(function (state) {
                if (width === state.width &&
                    height === state.height &&
                    offsetTop === state.offsetTop) {
                    return state;
                }
                return { width: width, height: height, offsetTop: offsetTop };
            });
        }
        var visualViewport = window.visualViewport;
        if (visualViewport) {
            visualViewport.addEventListener("resize", handleResize);
            visualViewport.addEventListener("scroll", handleResize);
        }
        return function () {
            if (visualViewport) {
                visualViewport.removeEventListener("resize", handleResize);
                visualViewport.removeEventListener("scroll", handleResize);
            }
        };
    }, []);
    return windowSize;
}
