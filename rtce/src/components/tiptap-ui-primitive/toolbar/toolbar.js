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
exports.ToolbarSeparator = exports.ToolbarGroup = exports.Toolbar = void 0;
var React = require("react");
var separator_1 = require("@/components/tiptap-ui-primitive/separator");
require("@/components/tiptap-ui-primitive/toolbar/toolbar.scss");
var mergeRefs = function (refs) {
    return function (value) {
        refs.forEach(function (ref) {
            if (typeof ref === "function") {
                ref(value);
            }
            else if (ref != null) {
                ;
                ref.current = value;
            }
        });
    };
};
var useObserveVisibility = function (ref, callback) {
    React.useEffect(function () {
        var element = ref.current;
        if (!element)
            return;
        var isMounted = true;
        if (isMounted) {
            requestAnimationFrame(callback);
        }
        var observer = new MutationObserver(function () {
            if (isMounted) {
                requestAnimationFrame(callback);
            }
        });
        observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
        });
        return function () {
            isMounted = false;
            observer.disconnect();
        };
    }, [ref, callback]);
};
var useToolbarKeyboardNav = function (toolbarRef) {
    React.useEffect(function () {
        var toolbar = toolbarRef.current;
        if (!toolbar)
            return;
        var getFocusableElements = function () {
            return Array.from(toolbar.querySelectorAll('button:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]:not([disabled])'));
        };
        var navigateToIndex = function (e, targetIndex, elements) {
            var _a;
            e.preventDefault();
            var nextIndex = targetIndex;
            if (nextIndex >= elements.length) {
                nextIndex = 0;
            }
            else if (nextIndex < 0) {
                nextIndex = elements.length - 1;
            }
            (_a = elements[nextIndex]) === null || _a === void 0 ? void 0 : _a.focus();
        };
        var handleKeyDown = function (e) {
            var focusableElements = getFocusableElements();
            if (!focusableElements.length)
                return;
            var currentElement = document.activeElement;
            var currentIndex = focusableElements.indexOf(currentElement);
            if (!toolbar.contains(currentElement))
                return;
            var keyActions = {
                ArrowRight: function () {
                    return navigateToIndex(e, currentIndex + 1, focusableElements);
                },
                ArrowDown: function () {
                    return navigateToIndex(e, currentIndex + 1, focusableElements);
                },
                ArrowLeft: function () {
                    return navigateToIndex(e, currentIndex - 1, focusableElements);
                },
                ArrowUp: function () { return navigateToIndex(e, currentIndex - 1, focusableElements); },
                Home: function () { return navigateToIndex(e, 0, focusableElements); },
                End: function () {
                    return navigateToIndex(e, focusableElements.length - 1, focusableElements);
                },
            };
            var action = keyActions[e.key];
            if (action) {
                action();
            }
        };
        var handleFocus = function (e) {
            var target = e.target;
            if (toolbar.contains(target)) {
                target.setAttribute("data-focus-visible", "true");
            }
        };
        var handleBlur = function (e) {
            var target = e.target;
            if (toolbar.contains(target)) {
                target.removeAttribute("data-focus-visible");
            }
        };
        toolbar.addEventListener("keydown", handleKeyDown);
        toolbar.addEventListener("focus", handleFocus, true);
        toolbar.addEventListener("blur", handleBlur, true);
        var focusableElements = getFocusableElements();
        focusableElements.forEach(function (element) {
            element.addEventListener("focus", handleFocus);
            element.addEventListener("blur", handleBlur);
        });
        return function () {
            toolbar.removeEventListener("keydown", handleKeyDown);
            toolbar.removeEventListener("focus", handleFocus, true);
            toolbar.removeEventListener("blur", handleBlur, true);
            var focusableElements = getFocusableElements();
            focusableElements.forEach(function (element) {
                element.removeEventListener("focus", handleFocus);
                element.removeEventListener("blur", handleBlur);
            });
        };
    }, [toolbarRef]);
};
var useToolbarVisibility = function (ref) {
    var _a = React.useState(true), isVisible = _a[0], setIsVisible = _a[1];
    var isMountedRef = React.useRef(false);
    React.useEffect(function () {
        isMountedRef.current = true;
        return function () {
            isMountedRef.current = false;
        };
    }, []);
    var checkVisibility = React.useCallback(function () {
        if (!isMountedRef.current)
            return;
        var toolbar = ref.current;
        if (!toolbar)
            return;
        // Check if any group has visible children
        var hasVisibleChildren = Array.from(toolbar.children).some(function (child) {
            if (!(child instanceof HTMLElement))
                return false;
            if (child.getAttribute("role") === "group") {
                return child.children.length > 0;
            }
            return false;
        });
        setIsVisible(hasVisibleChildren);
    }, [ref]);
    useObserveVisibility(ref, checkVisibility);
    return isVisible;
};
var useGroupVisibility = function (ref) {
    var _a = React.useState(true), isVisible = _a[0], setIsVisible = _a[1];
    var isMountedRef = React.useRef(false);
    React.useEffect(function () {
        isMountedRef.current = true;
        return function () {
            isMountedRef.current = false;
        };
    }, []);
    var checkVisibility = React.useCallback(function () {
        if (!isMountedRef.current)
            return;
        var group = ref.current;
        if (!group)
            return;
        var hasVisibleChildren = Array.from(group.children).some(function (child) {
            if (!(child instanceof HTMLElement))
                return false;
            return true;
        });
        setIsVisible(hasVisibleChildren);
    }, [ref]);
    useObserveVisibility(ref, checkVisibility);
    return isVisible;
};
var useSeparatorVisibility = function (ref) {
    var _a = React.useState(true), isVisible = _a[0], setIsVisible = _a[1];
    var isMountedRef = React.useRef(false);
    React.useEffect(function () {
        isMountedRef.current = true;
        return function () {
            isMountedRef.current = false;
        };
    }, []);
    var checkVisibility = React.useCallback(function () {
        if (!isMountedRef.current)
            return;
        var separator = ref.current;
        if (!separator)
            return;
        var prevSibling = separator.previousElementSibling;
        var nextSibling = separator.nextElementSibling;
        if (!prevSibling || !nextSibling) {
            setIsVisible(false);
            return;
        }
        var areBothGroups = prevSibling.getAttribute("role") === "group" &&
            nextSibling.getAttribute("role") === "group";
        var haveBothChildren = prevSibling.children.length > 0 && nextSibling.children.length > 0;
        setIsVisible(areBothGroups && haveBothChildren);
    }, [ref]);
    useObserveVisibility(ref, checkVisibility);
    return isVisible;
};
exports.Toolbar = React.forwardRef(function (_a, ref) {
    var children = _a.children, className = _a.className, _b = _a.variant, variant = _b === void 0 ? "fixed" : _b, props = __rest(_a, ["children", "className", "variant"]);
    var toolbarRef = React.useRef(null);
    var isVisible = useToolbarVisibility(toolbarRef);
    useToolbarKeyboardNav(toolbarRef);
    if (!isVisible)
        return null;
    return (<div ref={mergeRefs([toolbarRef, ref])} role="toolbar" aria-label="toolbar" data-variant={variant} className={"tiptap-toolbar ".concat(className || "")} {...props}>
        {children}
      </div>);
});
exports.Toolbar.displayName = "Toolbar";
exports.ToolbarGroup = React.forwardRef(function (_a, ref) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    var groupRef = React.useRef(null);
    var isVisible = useGroupVisibility(groupRef);
    if (!isVisible)
        return null;
    return (<div ref={mergeRefs([groupRef, ref])} role="group" className={"tiptap-toolbar-group ".concat(className || "")} {...props}>
        {children}
      </div>);
});
exports.ToolbarGroup.displayName = "ToolbarGroup";
exports.ToolbarSeparator = React.forwardRef(function (_a, ref) {
    var props = __rest(_a, []);
    var separatorRef = React.useRef(null);
    var isVisible = useSeparatorVisibility(separatorRef);
    if (!isVisible)
        return null;
    return (<separator_1.Separator ref={mergeRefs([separatorRef, ref])} orientation="vertical" decorative {...props}/>);
});
exports.ToolbarSeparator.displayName = "ToolbarSeparator";
