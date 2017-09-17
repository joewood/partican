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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ParticleEdge = /** @class */ (function (_super) {
    __extends(ParticleEdge, _super);
    function ParticleEdge(props) {
        var _this = _super.call(this, props) || this;
        console.log("New Particle Edge");
        return _this;
    }
    ParticleEdge.prototype.render = function () {
        return null;
    };
    return ParticleEdge;
}(React.Component));
exports.default = ParticleEdge;
/** Holds the historic state of ParticleEdge property changes. Offers a schedule of properties changes
 * for animations to gradually be applied.
 */
var ParticleScheduleState = /** @class */ (function () {
    function ParticleScheduleState(props) {
        this.last = null;
        this.edge = Object.assign({}, props);
        this.randomSample = [];
        for (var n = 10000; n >= 0; n--) {
            this.randomSample[n] = Math.random();
        }
        this.last = null;
    }
    ParticleScheduleState.prototype.getParticles = function () {
        return {
            appliesFrom: (this.last && this.last.end) || new Date(new Date().valueOf() - 0),
            particles: this.randomSample,
            ratePerSecond: this.edge.ratePerSecond,
            props: this.edge,
            last: this.last && {
                appliesFrom: this.last.start,
                end: this.last.end,
                ratePerSecond: this.last.ratePerSecond,
                particles: this.randomSample
            }
        };
    };
    /** Property change has occurred */
    ParticleScheduleState.prototype.updateProps = function (newProps) {
        var now = new Date();
        if (newProps.ratePerSecond != this.edge.ratePerSecond) {
            this.last = {
                ratePerSecond: this.edge.ratePerSecond,
                start: (this.last && this.last.end) || new Date(now.valueOf() - 1000),
                end: now
            };
        }
        this.edge = __assign({}, this.edge, newProps);
    };
    return ParticleScheduleState;
}());
exports.ParticleScheduleState = ParticleScheduleState;
//# sourceMappingURL=particle-edge.js.map