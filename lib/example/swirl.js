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
// import { range } from "lodash";
var __1 = require("..");
var react_motion_1 = require("react-motion");
var Swirl = /** @class */ (function (_super) {
    __extends(Swirl, _super);
    function Swirl(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    Swirl.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height, points = _a.points;
        return React.createElement("div", { key: "particle", style: { display: "inline-block", backgroundColor: "blue", height: height, width: width, overflow: "hidden" } },
            React.createElement(react_motion_1.Motion, { key: "roote", defaultStyle: {
                    pos1x: 0.01,
                    pos1y: points.p0,
                    pos2x: 0.3,
                    pos2y: points.p1,
                    pos3x: 0.6,
                    pos3y: points.p2,
                    pos4x: 0.99,
                    pos4y: points.p3
                }, style: {
                    pos1x: react_motion_1.spring(0.01),
                    pos1y: react_motion_1.spring(points.p0),
                    pos2x: react_motion_1.spring(0.3),
                    pos2y: react_motion_1.spring(points.p1),
                    pos3x: react_motion_1.spring(0.6),
                    pos3y: react_motion_1.spring(points.p2),
                    pos4x: react_motion_1.spring(0.99),
                    pos4y: react_motion_1.spring(points.p3),
                } }, function (style) {
                return React.createElement(__1.ParticleCanvas, { key: "demo-particles", style: {
                        height: height,
                        width: width,
                        backgroundColor: "#101820",
                    }, particleStyle: {
                        color: _this.props.startingColor,
                        endingColor: _this.props.endingColor,
                        roundness: _this.props.roundness,
                        size: _this.props.size,
                        variationMin: _this.props.minVariation,
                        variationMax: _this.props.maxVariation,
                    }, run: true },
                    React.createElement(__1.ParticleEdge, { key: "node1", p0: { x: style.pos1x, y: style.pos1y }, p1: { x: style.pos2x, y: style.pos2y }, p2: { x: style.pos3x, y: style.pos3y }, p3: { x: style.pos4x, y: style.pos4y }, ratePerSecond: _this.props.rate }),
                    React.createElement(__1.ParticleEdge, { key: "node2", p0: { y: style.pos1x, x: style.pos1y }, p1: { y: style.pos2x, x: style.pos2y }, p2: { y: style.pos3x, x: style.pos3y }, p3: { y: style.pos4x, x: style.pos4y }, ratePerSecond: _this.props.rate }));
            }));
    };
    return Swirl;
}(React.PureComponent));
exports.default = Swirl;
//# sourceMappingURL=swirl.js.map