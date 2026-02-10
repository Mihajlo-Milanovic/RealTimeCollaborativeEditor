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
exports.PopoverContent = exports.PopoverTrigger = void 0;
exports.Popover = Popover;
/* eslint-disable @typescript-eslint/no-explicit-any */
var React = require("react");
var react_1 = require("@floating-ui/react");
require("@/components/tiptap-ui-primitive/popover/popover.scss");
var PopoverContext = React.createContext(null);
function usePopoverContext() {
    var context = React.useContext(PopoverContext);
    if (!context) {
        throw new Error("Popover components must be wrapped in <Popover />");
    }
    return context;
}
function usePopover(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.initialOpen, initialOpen = _c === void 0 ? false : _c, modal = _b.modal, controlledOpen = _b.open, setControlledOpen = _b.onOpenChange, _d = _b.side, side = _d === void 0 ? "bottom" : _d, _e = _b.align, align = _e === void 0 ? "center" : _e, _f = _b.sideOffset, sideOffset = _f === void 0 ? 4 : _f, _g = _b.alignOffset, alignOffset = _g === void 0 ? 0 : _g;
    var _h = React.useState(initialOpen), uncontrolledOpen = _h[0], setUncontrolledOpen = _h[1];
    var _j = React.useState(), labelId = _j[0], setLabelId = _j[1];
    var _k = React.useState(), descriptionId = _k[0], setDescriptionId = _k[1];
    var _l = React.useState("".concat(side, "-").concat(align)), currentPlacement = _l[0], setCurrentPlacement = _l[1];
    var _m = React.useState({ sideOffset: sideOffset, alignOffset: alignOffset }), offsets = _m[0], setOffsets = _m[1];
    var open = controlledOpen !== null && controlledOpen !== void 0 ? controlledOpen : uncontrolledOpen;
    var setOpen = setControlledOpen !== null && setControlledOpen !== void 0 ? setControlledOpen : setUncontrolledOpen;
    var middleware = React.useMemo(function () { return [
        (0, react_1.offset)({
            mainAxis: offsets.sideOffset,
            crossAxis: offsets.alignOffset,
        }),
        (0, react_1.flip)({
            fallbackAxisSideDirection: "end",
            crossAxis: false,
        }),
        (0, react_1.shift)({
            limiter: (0, react_1.limitShift)({ offset: offsets.sideOffset }),
        }),
    ]; }, [offsets.sideOffset, offsets.alignOffset]);
    var floating = (0, react_1.useFloating)({
        placement: currentPlacement,
        open: open,
        onOpenChange: setOpen,
        whileElementsMounted: react_1.autoUpdate,
        middleware: middleware,
    });
    var interactions = (0, react_1.useInteractions)([
        (0, react_1.useClick)(floating.context),
        (0, react_1.useDismiss)(floating.context),
        (0, react_1.useRole)(floating.context),
    ]);
    var updatePosition = React.useCallback(function (newSide, newAlign, newSideOffset, newAlignOffset) {
        setCurrentPlacement("".concat(newSide, "-").concat(newAlign));
        if (newSideOffset !== undefined || newAlignOffset !== undefined) {
            setOffsets({
                sideOffset: newSideOffset !== null && newSideOffset !== void 0 ? newSideOffset : offsets.sideOffset,
                alignOffset: newAlignOffset !== null && newAlignOffset !== void 0 ? newAlignOffset : offsets.alignOffset,
            });
        }
    }, [offsets.sideOffset, offsets.alignOffset]);
    return React.useMemo(function () { return (__assign(__assign(__assign({ open: open, setOpen: setOpen }, interactions), floating), { modal: modal, labelId: labelId, descriptionId: descriptionId, setLabelId: setLabelId, setDescriptionId: setDescriptionId, updatePosition: updatePosition })); }, [
        open,
        setOpen,
        interactions,
        floating,
        modal,
        labelId,
        descriptionId,
        updatePosition,
    ]);
}
function Popover(_a) {
    var children = _a.children, _b = _a.modal, modal = _b === void 0 ? false : _b, options = __rest(_a, ["children", "modal"]);
    var popover = usePopover(__assign({ modal: modal }, options));
    return (<PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>);
}
var PopoverTrigger = React.forwardRef(function PopoverTrigger(_a, propRef) {
    var children = _a.children, _b = _a.asChild, asChild = _b === void 0 ? false : _b, props = __rest(_a, ["children", "asChild"]);
    var context = usePopoverContext();
    var childrenRef = React.isValidElement(children)
        ? parseInt(React.version, 10) >= 19
            ? children.props.ref
            : children.ref
        : undefined;
    var ref = (0, react_1.useMergeRefs)([context.refs.setReference, propRef, childrenRef]);
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, context.getReferenceProps(__assign(__assign(__assign({ ref: ref }, props), children.props), { "data-state": context.open ? "open" : "closed" })));
    }
    return (<button ref={ref} data-state={context.open ? "open" : "closed"} {...context.getReferenceProps(props)}>
        {children}
      </button>);
});
exports.PopoverTrigger = PopoverTrigger;
var PopoverContent = React.forwardRef(function PopoverContent(_a, propRef) {
    var _b, _c;
    var className = _a.className, _d = _a.side, side = _d === void 0 ? "bottom" : _d, _e = _a.align, align = _e === void 0 ? "center" : _e, sideOffset = _a.sideOffset, alignOffset = _a.alignOffset, style = _a.style, _f = _a.portal, portal = _f === void 0 ? true : _f, _g = _a.portalProps, portalProps = _g === void 0 ? {} : _g, _h = _a.asChild, asChild = _h === void 0 ? false : _h, children = _a.children, props = __rest(_a, ["className", "side", "align", "sideOffset", "alignOffset", "style", "portal", "portalProps", "asChild", "children"]);
    var context = usePopoverContext();
    var childrenRef = React.isValidElement(children)
        ? parseInt(React.version, 10) >= 19
            ? children.props.ref
            : children.ref
        : undefined;
    var ref = (0, react_1.useMergeRefs)([context.refs.setFloating, propRef, childrenRef]);
    React.useEffect(function () {
        context.updatePosition(side, align, sideOffset, alignOffset);
    }, [context, side, align, sideOffset, alignOffset]);
    if (!context.context.open)
        return null;
    var contentProps = __assign({ ref: ref, style: __assign({ position: context.strategy, top: (_b = context.y) !== null && _b !== void 0 ? _b : 0, left: (_c = context.x) !== null && _c !== void 0 ? _c : 0 }, style), "aria-labelledby": context.labelId, "aria-describedby": context.descriptionId, className: "tiptap-popover ".concat(className || ""), "data-side": side, "data-align": align, "data-state": context.context.open ? "open" : "closed" }, context.getFloatingProps(props));
    var content = asChild && React.isValidElement(children) ? (React.cloneElement(children, __assign(__assign({}, contentProps), children.props))) : (<div {...contentProps}>{children}</div>);
    var wrappedContent = (<react_1.FloatingFocusManager context={context.context} modal={context.modal}>
        {content}
      </react_1.FloatingFocusManager>);
    if (portal) {
        return <react_1.FloatingPortal {...portalProps}>{wrappedContent}</react_1.FloatingPortal>;
    }
    return wrappedContent;
});
exports.PopoverContent = PopoverContent;
PopoverTrigger.displayName = "PopoverTrigger";
PopoverContent.displayName = "PopoverContent";
