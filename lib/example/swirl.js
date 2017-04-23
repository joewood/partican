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
        return React.createElement("div", { key: "root", style: { display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height, width: width, overflow: "hidden" } },
            React.createElement(__1.ParticleCanvas, { key: "demo-particles", style: {
                    height: height * 0.8 - 20,
                    width: width * 0.8
                }, run: true },
                React.createElement(__1.ParticleEdge, { key: "node1", p0: { x: 0.9, y: 0.40 }, p1: { x: 0.500, y: 0.0 }, p2: { x: 0.200, y: 0.0 }, p3: { x: 0.150, y: 0.30 }, particleStyle: {
                        color: (animationIndex % 2) ? "pink" : "pink",
                        roundness: 0.3,
                        size: 10,
                        variationMin: -0.1,
                        variationMax: 0.1,
                    }, ratePerSecond: (animationIndex % 4) * 10 + 1 }),
                React.createElement(__1.ParticleEdge, { key: "node2", p0: { x: 0.9, y: 0.80 }, p1: { x: 0.500, y: 0.99 }, p2: { x: 0.200, y: 0.75 }, p3: { x: 0.150, y: 0.90 }, particleStyle: {
                        color: "white",
                        roundness: 0.3,
                        size: 5,
                        variationMin: -0.2,
                        variationMax: 0.2,
                    }, ratePerSecond: (animationIndex % 2) * 1000 + 10 })));
    };
    return Swirl;
}(React.Component));
exports.default = Swirl;
//# sourceMappingURL=swirl.js.map