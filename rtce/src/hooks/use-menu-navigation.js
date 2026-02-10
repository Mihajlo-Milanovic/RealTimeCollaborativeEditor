"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMenuNavigation = useMenuNavigation;
var React = require("react");
function useMenuNavigation(_a) {
    var editor = _a.editor, containerRef = _a.containerRef, query = _a.query, items = _a.items, onSelect = _a.onSelect, onClose = _a.onClose, _b = _a.orientation, orientation = _b === void 0 ? "vertical" : _b, _c = _a.autoSelectFirstItem, autoSelectFirstItem = _c === void 0 ? true : _c;
    var _d = React.useState(autoSelectFirstItem ? 0 : -1), selectedIndex = _d[0], setSelectedIndex = _d[1];
    React.useEffect(function () {
        var handleKeyboardNavigation = function (event) {
            if (!items.length)
                return false;
            var moveNext = function () {
                return setSelectedIndex(function (currentIndex) {
                    if (currentIndex === -1)
                        return 0;
                    return (currentIndex + 1) % items.length;
                });
            };
            var movePrev = function () {
                return setSelectedIndex(function (currentIndex) {
                    if (currentIndex === -1)
                        return items.length - 1;
                    return (currentIndex - 1 + items.length) % items.length;
                });
            };
            switch (event.key) {
                case "ArrowUp": {
                    if (orientation === "horizontal")
                        return false;
                    event.preventDefault();
                    movePrev();
                    return true;
                }
                case "ArrowDown": {
                    if (orientation === "horizontal")
                        return false;
                    event.preventDefault();
                    moveNext();
                    return true;
                }
                case "ArrowLeft": {
                    if (orientation === "vertical")
                        return false;
                    event.preventDefault();
                    movePrev();
                    return true;
                }
                case "ArrowRight": {
                    if (orientation === "vertical")
                        return false;
                    event.preventDefault();
                    moveNext();
                    return true;
                }
                case "Tab": {
                    event.preventDefault();
                    if (event.shiftKey) {
                        movePrev();
                    }
                    else {
                        moveNext();
                    }
                    return true;
                }
                case "Home": {
                    event.preventDefault();
                    setSelectedIndex(0);
                    return true;
                }
                case "End": {
                    event.preventDefault();
                    setSelectedIndex(items.length - 1);
                    return true;
                }
                case "Enter": {
                    if (event.isComposing)
                        return false;
                    event.preventDefault();
                    if (selectedIndex !== -1 && items[selectedIndex]) {
                        onSelect === null || onSelect === void 0 ? void 0 : onSelect(items[selectedIndex]);
                    }
                    return true;
                }
                case "Escape": {
                    event.preventDefault();
                    onClose === null || onClose === void 0 ? void 0 : onClose();
                    return true;
                }
                default:
                    return false;
            }
        };
        var targetElement = null;
        if (editor) {
            targetElement = editor.view.dom;
        }
        else if (containerRef === null || containerRef === void 0 ? void 0 : containerRef.current) {
            targetElement = containerRef.current;
        }
        if (targetElement) {
            targetElement.addEventListener("keydown", handleKeyboardNavigation, true);
            return function () {
                targetElement === null || targetElement === void 0 ? void 0 : targetElement.removeEventListener("keydown", handleKeyboardNavigation, true);
            };
        }
        return undefined;
    }, [
        editor,
        containerRef,
        items,
        selectedIndex,
        onSelect,
        onClose,
        orientation,
    ]);
    React.useEffect(function () {
        if (query) {
            setSelectedIndex(autoSelectFirstItem ? 0 : -1);
        }
    }, [query, autoSelectFirstItem]);
    return {
        selectedIndex: items.length ? selectedIndex : undefined,
        setSelectedIndex: setSelectedIndex,
    };
}
