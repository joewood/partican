import * as React from "react";
import Particles from "./particles";
import Color = require("color");
import { IParticleEdge } from './particles'

export class ParticleEdge extends React.Component<IParticleEdge, any> {
    public render() {
        return null;
    }
}

export interface IProps {
    style:{
        width:number;
        height:number;
        backgroundColor?: string;
    }
    children?: ParticleEdge[];
    run?: boolean;
}

export class ParticleCanvas extends React.PureComponent<IProps, any> {
    private canvas: HTMLCanvasElement;
    private particles: Particles;

    private setupParticles = (props: IProps) => {
        if (!this.canvas) return;
        console.log("Setting up particles")
        //set-up canvas
        const background = Color(props.style.backgroundColor);
        // this.particles.stop();
        const flowsAny = React.Children.map(props.children, c => (c as any).props.style ? (c as any).valueOf() : c) || [];
        const flows = flowsAny.map(fa => fa.props as IParticleEdge);
        this.particles.backgroundColor = { r: background.red(), g: background.green(), b: background.blue() };
        this.particles.updateBuffers(flows, props.style.width, props.style.height);
        this.particles.draw();
        if (props.run) this.particles.start();
    }

    public componentWillReceiveProps(newProps: IProps) {
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
    }

    public shouldComponentUpdate(newProps: IProps/*, newState: any*/) {
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
        // if (this.canvas === canvas || !canvas) return;
        console.log("New Canvas");
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
            this.particles = new Particles(this.canvas, 2);
        }
        this.setupParticles(this.props);
    }


    public render() {
        const { width, height } = this.props.style;
        return (
            <canvas key="canva"
                style={{ pointerEvents: "none" }}
                ref={this.setupNewCanvas}
                width={width}
                height={height}>
            </canvas>);
    }
}

