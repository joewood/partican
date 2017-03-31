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
    width: number;
    height: number;
    children?: ParticleEdge[];
    run?: boolean;
    backgroundColor?: string;
}

export class ParticleCanvas extends React.PureComponent<IProps, any> {
    private canvas: HTMLCanvasElement;
    private particles: Particles;

    private setupParticles(props: IProps) {
        if (!this.canvas) return;
        if (!this.particles) this.particles = new Particles(this.canvas, 2);
        const background = Color(props.backgroundColor);
        // this.particles.stop();
        const flowsAny = React.Children.map(props.children, c => (c as any).props.style ? (c as any).valueOf() : c) || [];
        const flows = flowsAny.map(fa => fa.props as IParticleEdge);
        this.particles.backgroundColor = { r: background.red(), g: background.green(), b: background.blue() };
        this.particles.updateBuffers(flows, props.width, props.height);
        this.particles.draw();
        if (props.run) this.particles.start();
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (!!this.particles) {
            if (this.props.children !== newProps.children || this.props.width != newProps.width || this.props.height != newProps.height) {
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
            newProps.backgroundColor === this.props.backgroundColor &&
            newProps.height === this.props.height &&
            newProps.width === this.props.width) return false;
        return true;
    }

    public componentWillUnmount() {
        if (!!this.particles) {
            this.particles.stop();
        }
    }

    public render() {
        const { width, height } = this.props;
        // const running = this.particles && this.particles.isRunning;
        return (
            <canvas key="canva"
                style={{ pointerEvents: "none" }}
                ref={canvas => {
                    if (this.canvas === canvas || !canvas) return;
                    this.canvas = canvas;
                    console.log("New Canvas");
                    if (this.particles) {
                        this.particles.stop();
                        this.particles = null;
                    }
                    this.setupParticles(this.props);
                }} width={width} height={height}>
            </canvas>);
    }
}

