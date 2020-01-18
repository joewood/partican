import * as React from "react";
import { keyBy, map } from "lodash";
import Particles from "./particles";
import { ParticleScheduleState } from "./particle-edge";
export class ParticleCanvas extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.edgeState = {};
        this.setupParticles = (props) => {
            if (!this.canvas)
                return;
            const edgeChildren = keyBy(React.Children.toArray(props.children), c => c.key);
            map(edgeChildren, (v, k) => {
                const style = Object.assign(Object.assign({}, this.props.particleStyle), v.props.particleStyle);
                if (!this.edgeState[k]) {
                    this.edgeState[k] = new ParticleScheduleState(Object.assign(Object.assign({}, v.props), { particleStyle: style }));
                }
                else {
                    this.edgeState[k].updateProps(Object.assign(Object.assign({}, v.props), { particleStyle: style }));
                }
            });
            this.particles.updateBuffers(Object.values(this.edgeState), props.style.width, props.style.height);
            this.particles.draw();
            if (props.run)
                this.particles.start();
        };
        this.lostContext = event => {
            event.preventDefault();
            const particles = this.particles;
            this.particles = null;
            particles.stop();
            console.log("CONTEXT LOST IN CODE");
        };
        this.setupNewCanvas = (canvas) => {
            if (this.canvas === canvas || !canvas)
                return;
            if (this.canvas !== canvas) {
                this.canvas = canvas;
                this.canvas.addEventListener("webglcontextlost", this.lostContext, false);
                this.canvas.addEventListener("webglcontextrestored", () => this.setupNewCanvas(this.canvas), false);
            }
            if (this.particles) {
                this.particles.stop();
                this.particles = null;
            }
            if (!this.particles) {
                this.particles = new Particles({ canvas: this.canvas, size: 2 });
            }
            this.setupParticles(this.props);
        };
    }
    componentWillReceiveProps(newProps) {
        if (!!this.particles) {
            if (this.props.children !== newProps.children ||
                this.props.style.width != newProps.style.width ||
                this.props.style.height != newProps.style.height) {
                this.setupParticles(newProps);
            }
            if (newProps.run !== this.props.run) {
                if (newProps.run)
                    this.particles.start();
                else
                    this.particles.stop();
            }
        }
    }
    shouldComponentUpdate(newProps, _newState) {
        // if just run changes then don't update
        if (newProps.children == this.props.children &&
            newProps.style.backgroundColor === this.props.style.backgroundColor &&
            newProps.style.height === this.props.style.height &&
            newProps.style.width === this.props.style.width)
            return false;
        return true;
    }
    componentWillUnmount() {
        if (!!this.particles) {
            this.particles.stop();
        }
    }
    render() {
        const { width, height, backgroundColor } = this.props.style;
        return (React.createElement("canvas", { key: "webgl-canvas", style: { pointerEvents: "none", backgroundColor: backgroundColor || "#200020" }, ref: this.setupNewCanvas, width: width, height: height }));
    }
}
//# sourceMappingURL=particle-canvas.js.map