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
exports.TooltipContent = exports.TooltipTrigger = void 0;
exports.Tooltip = Tooltip;
var React = require("react");
var react_1 = require("@floating-ui/react");
require("@/components/tiptap-ui-primitive/tooltip/tooltip.scss");
function useTooltip(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.initialOpen, initialOpen = _c === void 0 ? false : _c, _d = _b.placement, placement = _d === void 0 ? "top" : _d, controlledOpen = _b.open, setControlledOpen = _b.onOpenChange, _e = _b.delay, delay = _e === void 0 ? 600 : _e, _f = _b.closeDelay, closeDelay = _f === void 0 ? 0 : _f;
    var _g = React.useState(initialOpen), uncontrolledOpen = _g[0], setUncontrolledOpen = _g[1];
    var open = controlledOpen !== null && controlledOpen !== void 0 ? controlledOpen : uncontrolledOpen;
    var setOpen = setControlledOpen !== null && setControlledOpen !== void 0 ? setControlledOpen : setUncontrolledOpen;
    var data = (0, react_1.useFloating)({
        placement: placement,
        open: open,
        onOpenChange: setOpen,
        whileElementsMounted: react_1.autoUpdate,
        middleware: [
            (0, react_1.offset)(4),
            (0, react_1.flip)({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "start",
                padding: 4,
            }),
            (0, react_1.shift)({ padding: 4 }),
        ],
    });
    var context = data.context;
    var hover = (0, react_1.useHover)(context, {
        mouseOnly: true,
        move: false,
        restMs: delay,
        enabled: controlledOpen == null,
        delay: {
            close: closeDelay,
        },
    });
    var focus = (0, react_1.useFocus)(context, {
        enabled: controlledOpen == null,
    });
    var dismiss = (0, react_1.useDismiss)(context);
    var role = (0, react_1.useRole)(context, { role: "tooltip" });
    var interactions = (0, react_1.useInteractions)([hover, focus, dismiss, role]);
    return React.useMemo(function () { return (__assign(__assign({ open: open, setOpen: setOpen }, interactions), data)); }, [open, setOpen, interactions, data]);
}
var TooltipContext = React.createContext(null);
function useTooltipContext() {
    var context = React.useContext(TooltipContext);
    if (context == null) {
        throw new Error("Tooltip components must be wrapped in <TooltipProvider />");
    }
    return context;
}
function Tooltip(_a) {
    var _b, _c;
    var children = _a.children, props = __rest(_a, ["children"]);
    var tooltip = useTooltip(props);
    if (!props.useDelayGroup) {
        return (<TooltipContext.Provider value={tooltip}>
        {children}
      </TooltipContext.Provider>);
    }
    return (<react_1.FloatingDelayGroup delay={{ open: (_b = props.delay) !== null && _b !== void 0 ? _b : 0, close: (_c = props.closeDelay) !== null && _c !== void 0 ? _c : 0 }} timeoutMs={props.timeout}>
      <TooltipContext.Provider value={tooltip}>
        {children}
      </TooltipContext.Provider>
    </react_1.FloatingDelayGroup>);
}
exports.TooltipTrigger = React.forwardRef(function TooltipTrigger(_a, propRef) {
    var children = _a.children, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["children", "asChild"]);
    var context = useTooltipContext();
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
            "data-tooltip-state": context.open ? "open" : "closed",
        };
        return React.cloneElement(children, context.getReferenceProps(__assign(__assign(__assign({ ref: ref }, props), (typeof children.props === "object" ? children.props : {})), dataAttributes)));
    }
    return (<button ref={ref} data-tooltip-state={context.open ? "open" : "closed"} {...context.getReferenceProps(props)}>
      {children}
    </button>);
});
exports.TooltipContent = React.forwardRef(function TooltipContent(_a, propRef) {
    var style = _a.style, children = _a.children, _b = _a.portal, portal = _b === void 0 ? true : _b, _c = _a.portalProps, portalProps = _c === void 0 ? {} : _c, props = __rest(_a, ["style", "children", "portal", "portalProps"]);
    var context = useTooltipContext();
    var ref = (0, react_1.useMergeRefs)([context.refs.setFloating, propRef]);
    if (!context.open)
        return null;
    var content = (<div ref={ref} style={__assign(__assign({}, context.floatingStyles), style)} {...context.getFloatingProps(props)} className="tiptap-tooltip">
      {children}
    </div>);
    if (portal) {
        return <react_1.FloatingPortal {...portalProps}>{content}</react_1.FloatingPortal>;
    }
    return content;
});
Tooltip.displayName = "Tooltip";
exports.TooltipTrigger.displayName = "TooltipTrigger";
exports.TooltipContent.displayName = "TooltipContent";
