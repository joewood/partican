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
var particles_1 = require("./particles");
var lodash_1 = require("lodash");
var particle_edge_1 = require("./particle-edge");
var ParticleCanvas = (function (_super) {
    __extends(ParticleCanvas, _super);
    function ParticleCanvas() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.edgeState = {};
        _this.setupParticles = function (props) {
            if (!_this.canvas)
                return;
            console.log("Setting up particles");
            //set-up canvas
            // this.particles.stop();
            var flowsAny = lodash_1.keyBy(React.Children.toArray(props.children), function (c) { return c.key; });
            lodash_1.map(flowsAny, function (v, k) {
                if (!_this.edgeState[k]) {
                    _this.edgeState[k] = new particle_edge_1.ParticleScheduleState(v.props);
                }
                else {
                    _this.edgeState[k].updateProps(v.props);
                }
            });
            // this.particles.updateProps({ backgroundColor: props.style.backgroundColor, canvas: this.canvas });
            _this.particles.updateBuffers(Object.values(_this.edgeState), props.style.width, props.style.height);
            _this.particles.draw();
            if (props.run)
                _this.particles.start();
        };
        _this.lostContext = function (event) {
            event.preventDefault();
            console.log("CONTEXT LOST IN CODE");
            _this.particles.stop();
            _this.particles = null;
        };
        _this.setupNewCanvas = function (canvas) {
            // if (this.canvas === canvas || !canvas) return;
            console.log("New Canvas");
            if (_this.canvas !== canvas) {
                _this.canvas = canvas;
                _this.canvas.addEventListener("webglcontextlost", _this.lostContext, false);
                _this.canvas.addEventListener("webglcontextrestored", function () {
                    return _this.setupNewCanvas(_this.canvas);
                }, false);
            }
            if (_this.particles) {
                _this.particles.stop();
                _this.particles = null;
            }
            if (!_this.particles) {
                _this.particles = new particles_1.default({ canvas: _this.canvas, size: 2 });
            }
            _this.setupParticles(_this.props);
        };
        return _this;
    }
    ParticleCanvas.prototype.componentWillReceiveProps = function (newProps) {
        if (!!this.particles) {
            if (this.props.children !== newProps.children || this.props.style.width != newProps.style.width || this.props.style.height != newProps.style.height) {
                this.setupParticles(newProps);
            }
            if (newProps.run !== this.props.run) {
                if (newProps.run)
                    this.particles.start();
                else
                    this.particles.stop();
            }
        }
    };
    ParticleCanvas.prototype.shouldComponentUpdate = function (newProps, _newState) {
        // if just run changes then don't update
        if (newProps.children == this.props.children &&
            newProps.style.backgroundColor === this.props.style.backgroundColor &&
            newProps.style.height === this.props.style.height &&
            newProps.style.width === this.props.style.width)
            return false;
        return true;
    };
    ParticleCanvas.prototype.componentWillUnmount = function () {
        if (!!this.particles) {
            this.particles.stop();
        }
    };
    ParticleCanvas.prototype.render = function () {
        var _a = this.props.style, width = _a.width, height = _a.height;
        return (React.createElement("canvas", { key: "canva", style: { pointerEvents: "none" }, ref: this.setupNewCanvas, width: width, height: height }));
    };
    return ParticleCanvas;
}(React.PureComponent));
exports.ParticleCanvas = ParticleCanvas;
//# sourceMappingURL=particle-canvas.js.map