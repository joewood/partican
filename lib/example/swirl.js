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
var Swirl = (function (_super) {
    __extends(Swirl, _super);
    function Swirl(p) {
        var _this = _super.call(this, p) || this;
        _this.state = {};
        return _this;
    }
    Swirl.prototype.render = function () {
        var _a = this.props, /*animate, */ animationIndex = _a.animationIndex, width = _a.width, height = _a.height;
        console.log("height: " + height + " width: " + width + " " + animationIndex);
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "blue", height: height, width: width, overflow: "hidden" } },
            React.createElement(react_motion_1.Motion, { key: "roote", defaultStyle: {
                    pos1: 0.9,
                    pos2: 0.1
                }, style: {
                    pos1: react_motion_1.spring(0.9 - (animationIndex % 5) / 20),
                    pos2: react_motion_1.spring(0.15 + (animationIndex % 8) / 30)
                } }, function (style) {
                return React.createElement(__1.ParticleCanvas, { key: "demo-particles", style: {
                        height: height * 0.8 - 20,
                        width: width * 0.8,
                        backgroundColor: "red",
                    }, run: true },
                    React.createElement(__1.ParticleEdge, { key: "node1", p0: { x: style.pos2, y: 0.50 }, p1: { x: 0.5, y: 0.0 }, p2: { x: 0.200, y: 0.0 }, p3: { x: style.pos1, y: 0.5 }, particleStyle: {
                            color: (animationIndex % 3) ? "pink" : "cyan",
                            roundness: 0.6,
                            size: 12,
                            variationMin: -0.2,
                            variationMax: 0.2,
                        }, ratePerSecond: (animationIndex % 3) * 200 + 100 }),
                    React.createElement(__1.ParticleEdge, { key: "node2", p0: { x: style.pos2, y: 0.50 }, p1: { x: 0.5, y: 0.99 }, p2: { x: 0.2, y: 0.99 }, p3: { x: style.pos1, y: 0.5 }, particleStyle: {
                            color: (animationIndex % 2) ? "pink" : "cyan",
                            roundness: 0.6,
                            size: 12,
                            variationMin: -0.2,
                            variationMax: 0.2,
                        }, ratePerSecond: (animationIndex % 2) * 300 + 100 }));
            }));
    };
    return Swirl;
}(React.Component));
exports.default = Swirl;
//# sourceMappingURL=swirl.js.map