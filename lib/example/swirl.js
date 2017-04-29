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
function getCirclePoint(i, length, radius) {
    var angle = (i % length) / length * 2 * Math.PI;
    var ret = {
        x: 0.5 + radius * Math.cos(angle),
        y: 0.5 + radius * Math.sin(angle)
    };
    return ret;
}
var Swirl = (function (_super) {
    __extends(Swirl, _super);
    function Swirl(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    Swirl.prototype.render = function () {
        var _a = this.props, /*animate, */ animationIndex = _a.animationIndex, width = _a.width, height = _a.height;
        // console.log(`height: ${height} width: ${width} ${animationIndex}`)
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "blue", height: height, width: width, overflow: "hidden" } },
            React.createElement(react_motion_1.Motion, { key: "roote", defaultStyle: {
                    pos1x: 0.9,
                    pos1y: 0.9,
                    pos2x: 0.1,
                    pos2y: 0.5,
                    pos3x: 0.1,
                    pos3y: 0.5,
                    pos4x: 0.1,
                    pos4y: 0.5
                }, style: {
                    pos1x: react_motion_1.spring(getCirclePoint(animationIndex, 40, 0.4).x, { stiffness: 100, damping: 5 }),
                    pos1y: react_motion_1.spring(getCirclePoint(animationIndex, 40, 0.4).y, { stiffness: 100, damping: 5 }),
                    pos2x: react_motion_1.spring(getCirclePoint(animationIndex, 10, 0.2).x, { stiffness: 100, damping: 5 }),
                    pos2y: react_motion_1.spring(getCirclePoint(animationIndex, 10, 0.2).y, { stiffness: 100, damping: 5 }),
                    pos3x: react_motion_1.spring(getCirclePoint(animationIndex + 5, 10, 0.2).x, { stiffness: 100, damping: 5 }),
                    pos3y: react_motion_1.spring(getCirclePoint(animationIndex + 5, 10, 0.2).y, { stiffness: 100, damping: 5 }),
                    pos4x: react_motion_1.spring(getCirclePoint(animationIndex + 20, 40, 0.4).x, { stiffness: 100, damping: 5 }),
                    pos4y: react_motion_1.spring(getCirclePoint(animationIndex + 20, 40, 0.4).y, { stiffness: 100, damping: 5 }),
                } }, function (style) {
                return React.createElement(__1.ParticleCanvas, { key: "demo-particles", style: {
                        height: height,
                        width: width,
                        backgroundColor: "#302010",
                    }, run: true },
                    React.createElement(__1.ParticleEdge, { key: "node1", p2: { x: style.pos1x, y: style.pos1y }, p1: { x: style.pos2x, y: style.pos2y }, p0: { x: 0.5, y: 0.2 }, p3: { x: 0.5, y: 0.5 }, particleStyle: {
                            color: "rgb(" + ((animationIndex * 10 % 200) + 50) + "," + (200 - (animationIndex * 20 % 200) + 40) + ",190 )",
                            endingColor: "rgb(" + (200 - (animationIndex * 10 % 200) + 50) + "," + ((animationIndex * 20 % 200) + 40) + ",190 )",
                            roundness: 0.6,
                            size: 12,
                            variationMin: -0.4,
                            variationMax: 0.4,
                        }, ratePerSecond: (animationIndex % 7) * 20 + 4 }),
                    React.createElement(__1.ParticleEdge, { key: "node2", p0: { x: style.pos4x, y: style.pos4y }, p1: { x: style.pos3x, y: style.pos3y }, p2: { x: 0.5, y: 0.7 }, p3: { x: 0.5, y: 0.5 }, particleStyle: {
                            endingColor: "rgb(" + ((animationIndex * 10 % 200) + 50) + "," + (200 - (animationIndex * 20 % 200) + 40) + ",190 )",
                            color: "rgb(" + (200 - (animationIndex * 10 % 200) + 50) + "," + ((animationIndex * 20 % 200) + 40) + ",190 )",
                            roundness: 0.6,
                            size: 12,
                            variationMin: -0.4,
                            variationMax: 0.4,
                        }, ratePerSecond: (animationIndex % 8) * 50 + 5 }));
            }));
    };
    return Swirl;
}(React.Component));
exports.default = Swirl;
//# sourceMappingURL=swirl.js.map