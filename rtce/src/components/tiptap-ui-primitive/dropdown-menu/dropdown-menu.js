"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.DropdownMenuSeparator = exports.DropdownMenuGroup = exports.DropdownMenuItem = exports.DropdownMenuContent = exports.DropdownMenuTrigger = void 0;
exports.DropdownMenu = DropdownMenu;
var React = require("react");
var react_1 = require("@floating-ui/react");
require("@/components/tiptap-ui-primitive/dropdown-menu/dropdown-menu.scss");
var separator_1 = require("@/components/tiptap-ui-primitive/separator");
var DropdownMenuContext = React.createContext(null);
function useDropdownMenuContext() {
    var context = React.useContext(DropdownMenuContext);
    if (!context) {
        throw new Error("DropdownMenu components must be wrapped in <DropdownMenu />");
    }
    return context;
}
function useDropdownMenu(_a) {
    var _b = _a.initialOpen, initialOpen = _b === void 0 ? false : _b, controlledOpen = _a.open, setControlledOpen = _a.onOpenChange, _c = _a.side, side = _c === void 0 ? "bottom" : _c, _d = _a.align, align = _d === void 0 ? "start" : _d;
    var _e = React.useState(initialOpen), uncontrolledOpen = _e[0], setUncontrolledOpen = _e[1];
    var _f = React.useState("".concat(side, "-").concat(align)), currentPlacement = _f[0], setCurrentPlacement = _f[1];
    var _g = React.useState(null), activeIndex = _g[0], setActiveIndex = _g[1];
    var open = controlledOpen !== null && controlledOpen !== void 0 ? controlledOpen : uncontrolledOpen;
    var setOpen = setControlledOpen !== null && setControlledOpen !== void 0 ? setControlledOpen : setUncontrolledOpen;
    var elementsRef = React.useRef([]);
    var labelsRef = React.useRef([]);
    var floating = (0, react_1.useFloating)({
        open: open,
        onOpenChange: setOpen,
        placement: currentPlacement,
        middleware: [(0, react_1.offset)({ mainAxis: 4 }), (0, react_1.flip)(), (0, react_1.shift)({ padding: 4 })],
        whileElementsMounted: react_1.autoUpdate,
    });
    var context = floating.context;
    var interactions = (0, react_1.useInteractions)([
        (0, react_1.useClick)(context, {
            event: "mousedown",
            toggle: true,
            ignoreMouse: false,
        }),
        (0, react_1.useRole)(context, { role: "menu" }),
        (0, react_1.useDismiss)(context, {
            outsidePress: true,
            outsidePressEvent: "mousedown",
        }),
        (0, react_1.useListNavigation)(context, {
            listRef: elementsRef,
            activeIndex: activeIndex,
            onNavigate: setActiveIndex,
            loop: true,
        }),
        (0, react_1.useTypeahead)(context, {
            listRef: labelsRef,
            onMatch: open ? setActiveIndex : undefined,
            activeIndex: activeIndex,
        }),
    ]);
    var updatePosition = React.useCallback(function (newSide, newAlign) {
        setCurrentPlacement("".concat(newSide, "-").concat(newAlign));
    }, []);
    return React.useMemo(function () { return (__assign(__assign({ open: open, setOpen: setOpen, activeIndex: activeIndex, setActiveIndex: setActiveIndex, elementsRef: elementsRef, labelsRef: labelsRef, updatePosition: updatePosition }, interactions), floating)); }, [open, setOpen, activeIndex, interactions, floating, updatePosition]);
}
function DropdownMenu(_a) {
    var children = _a.children, options = __rest(_a, ["children"]);
    var dropdown = useDropdownMenu(options);
    return (<DropdownMenuContext.Provider value={dropdown}>
      <react_1.FloatingList elementsRef={dropdown.elementsRef} labelsRef={dropdown.labelsRef}>
        {children}
      </react_1.FloatingList>
    </DropdownMenuContext.Provider>);
}
exports.DropdownMenuTrigger = React.forwardRef(function (_a, propRef) {
    var children = _a.children, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["children", "asChild"]);
    var context = useDropdownMenuContext();
    var childrenRef = React.isValidElement(children)
        ? parseInt(React.version, 10) >= 19
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                children.props.ref
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                children.ref
        : undefined;
    var ref = (0, react_1.useMergeRefs)([context.refs.setReference, propRef, childrenRef]);
    if (asChild && React.isValidElement(children)) {
        var dataAttributes = {
            "data-state": context.open ? "open" : "closed",
        };
        return React.cloneElement(children, context.getReferenceProps(__assign(__assign(__assign(__assign({ ref: ref }, props), (typeof children.props === "object" ? children.props : {})), { "aria-expanded": context.open, "aria-haspopup": "menu" }), dataAttributes)));
    }
    return (<button ref={ref} aria-expanded={context.open} aria-haspopup="menu" data-state={context.open ? "open" : "closed"} {...context.getReferenceProps(props)}>
      {children}
    </button>);
});
exports.DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
exports.DropdownMenuContent = React.forwardRef(function (_a, propRef) {
    var _b, _c;
    var style = _a.style, className = _a.className, _d = _a.orientation, orientation = _d === void 0 ? "vertical" : _d, _e = _a.side, side = _e === void 0 ? "bottom" : _e, _f = _a.align, align = _f === void 0 ? "start" : _f, _g = _a.portal, portal = _g === void 0 ? true : _g, _h = _a.portalProps, portalProps = _h === void 0 ? {} : _h, props = __rest(_a, ["style", "className", "orientation", "side", "align", "portal", "portalProps"]);
    var context = useDropdownMenuContext();
    var ref = (0, react_1.useMergeRefs)([context.refs.setFloating, propRef]);
    React.useEffect(function () {
        context.updatePosition(side, align);
    }, [context, side, align]);
    if (!context.open)
        return null;
    var content = (<react_1.FloatingFocusManager context={context.context} modal={false} initialFocus={0} returnFocus={true}>
        <div ref={ref} className={"tiptap-dropdown-menu ".concat(className || "")} style={__assign({ position: context.strategy, top: (_b = context.y) !== null && _b !== void 0 ? _b : 0, left: (_c = context.x) !== null && _c !== void 0 ? _c : 0, outline: "none" }, style)} aria-orientation={orientation} data-orientation={orientation} data-state={context.open ? "open" : "closed"} data-side={side} data-align={align} {...context.getFloatingProps(props)}>
          {props.children}
        </div>
      </react_1.FloatingFocusManager>);
    if (portal) {
        return <react_1.FloatingPortal {...portalProps}>{content}</react_1.FloatingPortal>;
    }
    return content;
});
exports.DropdownMenuContent.displayName = "DropdownMenuContent";
exports.DropdownMenuItem = React.forwardRef(function (_a, ref) {
    var children = _a.children, disabled = _a.disabled, _b = _a.asChild, asChild = _b === void 0 ? false : _b, onSelect = _a.onSelect, className = _a.className, props = __rest(_a, ["children", "disabled", "asChild", "onSelect", "className"]);
    var context = useDropdownMenuContext();
    var item = (0, react_1.useListItem)({ label: disabled ? null : children === null || children === void 0 ? void 0 : children.toString() });
    var isActive = context.activeIndex === item.index;
    var handleSelect = React.useCallback(function (event) {
        var _a;
        if (disabled)
            return;
        onSelect === null || onSelect === void 0 ? void 0 : onSelect();
        (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
        context.setOpen(false);
    }, [context, disabled, onSelect, props]);
    var itemProps = __assign({ ref: (0, react_1.useMergeRefs)([item.ref, ref]), role: "menuitem", className: className, tabIndex: isActive ? 0 : -1, "data-highlighted": isActive, "aria-disabled": disabled }, context.getItemProps(__assign(__assign({}, props), { onClick: handleSelect })));
    if (asChild && React.isValidElement(children)) {
        var childProps_1 = children.props;
        // Create merged props without adding onClick directly to the props object
        var mergedProps = __assign(__assign({}, itemProps), (typeof children.props === "object" ? children.props : {}));
        // Handle onClick separately based on the element type
        var eventHandlers = {
            onClick: function (event) {
                var _a;
                // Cast the event to make it compatible with handleSelect
                handleSelect(event);
                (_a = childProps_1.onClick) === null || _a === void 0 ? void 0 : _a.call(childProps_1, event);
            },
        };
        return React.cloneElement(children, __assign(__assign({}, mergedProps), eventHandlers));
    }
    return <div {...itemProps}>{children}</div>;
});
exports.DropdownMenuItem.displayName = "DropdownMenuItem";
exports.DropdownMenuGroup = React.forwardRef(function (_a, ref) {
    var children = _a.children, label = _a.label, className = _a.className, props = __rest(_a, ["children", "label", "className"]);
    return (<div {...props} ref={ref} role="group" aria-label={label} className={"tiptap-button-group ".concat(className || "")}>
      {children}
    </div>);
});
exports.DropdownMenuGroup.displayName = "DropdownMenuGroup";
exports.DropdownMenuSeparator = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<separator_1.Separator ref={ref} className={"tiptap-dropdown-menu-separator ".concat(className || "")} {...props}/>);
});
exports.DropdownMenuSeparator.displayName = separator_1.Separator.displayName;
