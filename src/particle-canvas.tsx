import * as React from "react";
import Particles from "./particles";
// import Color = require("color");
import { IParticleEdge } from './particles'
import { IParticleStyle } from "./model"
import { keyBy, map, Dictionary } from "lodash"

import ParticleEdge, { ParticleScheduleState } from "./particle-edge"

export interface IProps {
    style: {
        width: number;
        height: number;
        backgroundColor?: string;
    }
    defaultParticleStyle?: IParticleStyle;
    defaultRatePerSecond?: number;
    children?: ParticleEdge[];
    run?: boolean;
}

export interface IState {
}

export class ParticleCanvas extends React.PureComponent<IProps, IState> {
    private canvas: HTMLCanvasElement;
    private particles: Particles;
    private edgeState: Dictionary<ParticleScheduleState> = {};


    private setupParticles = (props: IProps) => {
        if (!this.canvas) return;
        //set-up canvas
        // this.particles.stop();
        const flowsAny = keyBy(React.Children.toArray(props.children) as { key: string, props: IParticleEdge }[], c => c.key);
        map(flowsAny, (v, k) => {
            if (!this.edgeState[k]) {
                this.edgeState[k] = new ParticleScheduleState(v.props);
            } else {
                this.edgeState[k].updateProps(v.props);
            }
        });
        // this.particles.updateProps({ backgroundColor: props.style.backgroundColor, canvas: this.canvas });
        this.particles.updateBuffers(Object.values(this.edgeState), props.style.width, props.style.height);
        this.particles.draw();
        if (props.run) this.particles.start();
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (!!this.particles) {
            if (this.props.children !== newProps.children || this.props.style.width != newProps.style.width || this.props.style.height != newProps.style.height) {
                // console.log("New Props for canvas ", this.props)
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

    public shouldComponentUpdate(newProps: IProps, _newState: IState) {
        // if just run changes then don't update
        if (newProps.children == this.props.children &&
            newProps.style.backgroundColor === this.props.style.backgroundColor &&
            newProps.style.height === this.props.style.height &&
            newProps.style.width === this.props.style.width) return false;
        return true;
    }

    public componentWillUnmount() {
        if (!!this.particles) {
            this.particles.stop();
        }
    }

    private lostContext = (event) => {
        event.preventDefault();
        console.log("CONTEXT LOST IN CODE");
        this.particles.stop();
        this.particles = null;
    }

    private setupNewCanvas = (canvas: HTMLCanvasElement) => {
        if (this.canvas === canvas || !canvas) return;
        if (this.canvas !== canvas) {
            this.canvas = canvas;
            this.canvas.addEventListener("webglcontextlost", this.lostContext, false);
            this.canvas.addEventListener("webglcontextrestored", () =>
                this.setupNewCanvas(this.canvas), false);
        }
        if (this.particles) {
            this.particles.stop();
            this.particles = null;
        }
        if (!this.particles) {
            this.particles = new Particles({ canvas: this.canvas, size: 2 });
        }
        this.setupParticles(this.props);
    }

    public render() {
        const { width, height } = this.props.style;
        return (
            <canvas key="webgl-canvas"
                style={{ pointerEvents: "none", backgroundColor:"#200020" }}
                ref={this.setupNewCanvas}
                width={width}
                height={height}>
            </canvas>);
    }
}

