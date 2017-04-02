"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var lodash_1 = require("lodash");
var __1 = require("..");
var radius = 200;
function circlePoint(i, length) {
    console.log("Circle " + i + " " + length);
    var angle = (i % length) / length * 2 * Math.PI;
    return {
        x: radius + radius * Math.cos(angle),
        y: radius + radius * Math.sin(angle)
    };
}
var Swirl = (function (_super) {
    __extends(Swirl, _super);
    function Swirl(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {
            points: lodash_1.range(0, 24).map(function (_pt, i) { return circlePoint(i, 24); }),
        };
        return _this;
    }
    Swirl.prototype.componentWillReceiveProps = function (newProps) {
        var points = this.state.points.map(function (pt, i, arr) { return circlePoint(i + (pt && newProps.animationIndex), arr.length); });
        this.setState({ points: points });
    };
    Swirl.prototype.render = function () {
        var _a = this.props, animate = _a.animate, width = _a.width, height = _a.height;
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height, width: width, overflow: "hidden" } },
            React.createElement(__1.ParticleCanvas, { height: height * 0.8 - 20, width: width * 0.8, run: animate },
                React.createElement(__1.ParticleEdge, { key: "node" + 1, p0: { x: 10, y: 20 }, p1: { x: 50, y: 100 }, p2: { x: 200, y: 150 }, p3: { x: 250, y: 250 }, particleStyle: {
                        color: "red", endingColor: "blue", roundness: 0.5, size: 10,
                        variationMin: -0.1,
                        variationMax: 0.1,
                    }, ratePerSecond: 7, linkTo: "ee" })));
    };
    return Swirl;
}(React.Component));
exports.default = Swirl;
//# sourceMappingURL=swirl.js.map