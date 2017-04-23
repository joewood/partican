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
var ParticleEdge = (function (_super) {
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
var ParticleScheduleState = (function () {
    function ParticleScheduleState(props) {
        this.previous = null;
        this.props = Object.assign({}, props);
        this.randomSample = [];
        for (var n = 10000; n >= 0; n--) {
            this.randomSample[n] = Math.random();
        }
        // this.randomSample = this.randomSample.sort((a, b) => a - b);
        this.previous = null;
    }
    ParticleScheduleState.prototype.getParticles = function () {
        return {
            appliesFrom: (this.previous && this.previous.end) || new Date(new Date().valueOf() - 0),
            particles: this.randomSample,
            ratePerSecond: this.props.ratePerSecond,
            props: this.props,
            last: this.previous && {
                appliesFrom: this.previous.start,
                end: this.previous.end,
                ratePerSecond: this.previous.ratePerSecond,
                particles: this.randomSample
            }
        };
    };
    ParticleScheduleState.prototype.updateProps = function (newProps, force) {
        if (force === void 0) { force = false; }
        var now = new Date();
        if (force || newProps.ratePerSecond != this.props.ratePerSecond) {
            this.previous = {
                ratePerSecond: this.props.ratePerSecond,
                start: (this.previous && this.previous.end) || new Date(now.valueOf() - 1000),
                end: now
            };
            this.props = Object.assign({}, this.props, newProps);
        }
    };
    return ParticleScheduleState;
}());
exports.ParticleScheduleState = ParticleScheduleState;
//# sourceMappingURL=particle-edge.js.map