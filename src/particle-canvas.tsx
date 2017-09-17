import * as React from "react";
import { keyBy, map, Dictionary } from "lodash";
import Particles,{ IParticleEdge } from "./particles";
import { IParticleStyle } from "./model";

import ParticleEdge, { ParticleScheduleState } from "./particle-edge";

export interface IProps {
	style: {
		width: number;
		height: number;
		backgroundColor?: string;
	};
	/** The default values for the particle style in each edge  */
	particleStyle?: IParticleStyle;
	defaultRatePerSecond?: number;
	children?: ParticleEdge[];
	run?: boolean;
}

export interface IState {}

export class ParticleCanvas extends React.PureComponent<IProps, IState> {
	private canvas: HTMLCanvasElement;
	private particles: Particles;
	private edgeState: Dictionary<ParticleScheduleState> = {};

	private setupParticles = (props: IProps) => {
		if (!this.canvas) return;
		const edgeChildren = keyBy(
			React.Children.toArray(props.children) as { key: string; props: IParticleEdge }[],
			c => c.key
		);
		map(edgeChildren, (v, k) => {
			const style = { ...this.props.particleStyle, ...v.props.particleStyle };
			if (!this.edgeState[k]) {
				this.edgeState[k] = new ParticleScheduleState({ ...v.props, particleStyle: style });
			} else {
				this.edgeState[k].updateProps({ ...v.props, particleStyle: style });
			}
		});
		this.particles.updateBuffers(Object.values(this.edgeState), props.style.width, props.style.height);
		this.particles.draw();
		if (props.run) this.particles.start();
	};

	public componentWillReceiveProps(newProps: IProps) {
		if (!!this.particles) {
			if (
				this.props.children !== newProps.children ||
				this.props.style.width != newProps.style.width ||
				this.props.style.height != newProps.style.height
			) {
				this.setupParticles(newProps);
			}
			if (newProps.run !== this.props.run) {
				if (newProps.run) this.particles.start();
				else this.particles.stop();
			}
		}
	}

	public shouldComponentUpdate(newProps: IProps, _newState: IState) {
		// if just run changes then don't update
		if (
			newProps.children == this.props.children &&
			newProps.style.backgroundColor === this.props.style.backgroundColor &&
			newProps.style.height === this.props.style.height &&
			newProps.style.width === this.props.style.width
		)
			return false;
		return true;
	}

	public componentWillUnmount() {
		if (!!this.particles) {
			this.particles.stop();
		}
	}

	private lostContext = event => {
		event.preventDefault();
		const particles = this.particles;
		this.particles = null;
		particles.stop();
		console.log("CONTEXT LOST IN CODE");
	};

	private setupNewCanvas = (canvas: HTMLCanvasElement) => {
		if (this.canvas === canvas || !canvas) return;
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

	public render() {
		const { width, height, backgroundColor } = this.props.style;
		return (
			<canvas
				key="webgl-canvas"
				style={{ pointerEvents: "none", backgroundColor: backgroundColor || "#200020" }}
				ref={this.setupNewCanvas}
				width={width}
				height={height}
			/>
		);
	}
}
