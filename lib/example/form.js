"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function Slider(_a) {
    var width = _a.width, p = _a.p, onChange = _a.onChange, name = _a.name, _b = _a.max, max = _b === void 0 ? 1.0 : _b, _c = _a.min, min = _c === void 0 ? 0.0 : _c;
    return React.createElement("div", { style: { width: width - 10, verticalAlign: "top", height: 40 } },
        React.createElement("span", { style: { width: 40, textAlign: "left", paddingRight: 10, height: "100%", verticalAlign: "middle" } }, name),
        React.createElement("input", { key: "slider", type: "range", style: { width: width - 80, height: "100%", verticalAlign: "middle" }, value: p, min: min, max: max, step: Math.abs((max - min) / 100), onChange: function (evt) { return onChange(parseFloat(evt.target["value"])); } }));
}
function default_1(_a) {
    var points = _a.points, width = _a.width, current = _a.current, next = _a.next, props = __rest(_a, ["points", "width", "current", "next"]);
    var onChange = function (vertex, p) {
        props.onPointsChange(__assign({}, points, (_a = {}, _a[vertex] = p, _a)));
        var _a;
    };
    var onNextChange = function (prop, p) {
        props.onNextChange(__assign({}, next, (_a = {}, _a[prop] = p, _a)));
        var _a;
    };
    return React.createElement("div", { style: { color: "white", width: width - 10, display: "inline-block", verticalAlign: "top", padding: 5, margin: 0, backgroundColor: "#404040" } },
        React.createElement("div", null,
            React.createElement("p", null,
                "Rate Per Second:",
                Math.floor(current.rate)),
            React.createElement(Slider, { key: "p0", p: next.rate, width: width - 10, max: 1000, onChange: onNextChange.bind(this, "rate"), name: "rate" })),
        React.createElement("div", null,
            React.createElement("p", null,
                "Variation: ",
                current.minVariation,
                " to ",
                current.maxVariation),
            React.createElement(Slider, { key: "min", p: next.minVariation, width: width - 10, min: -0.8, max: 0.0, onChange: onNextChange.bind(this, "minVariation"), name: "min" }),
            React.createElement(Slider, { key: "max", p: next.maxVariation, width: width - 10, min: 0.0, max: 0.8, onChange: onNextChange.bind(this, "maxVariation"), name: "max" })),
        React.createElement("div", null,
            React.createElement("p", null,
                "Size: ",
                current.size),
            React.createElement(Slider, { key: "max", p: next.size, width: width - 10, min: 0.0, max: 20, onChange: onNextChange.bind(this, "size"), name: "size" })),
        React.createElement("div", null,
            React.createElement("p", null,
                "Roundness: ",
                current.roundness),
            React.createElement(Slider, { key: "rnd", p: next.roundness, width: width - 10, min: 0.0, max: 1.0, onChange: onNextChange.bind(this, "roundness"), name: "round" })),
        React.createElement("div", { style: { width: width - 10, display: "block", padding: 0 } },
            React.createElement("p", null, "Bezier Points"),
            React.createElement(Slider, { key: "p0", p: points.p0, width: width, onChange: onChange.bind(null, "p0"), name: "p0" }),
            React.createElement(Slider, { key: "p1", p: points.p1, width: width, onChange: onChange.bind(null, "p1"), min: -1.0, max: 2.0, name: "p1" }),
            React.createElement(Slider, { key: "p2", p: points.p2, width: width, onChange: onChange.bind(null, "p2"), min: -1.0, max: 2.0, name: "p2" }),
            React.createElement(Slider, { key: "p3", p: points.p3, width: width, onChange: onChange.bind(null, "p3"), name: "p3" })));
}
exports.default = default_1;
//# sourceMappingURL=form.js.map