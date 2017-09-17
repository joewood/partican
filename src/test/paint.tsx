import * as React from "react";
// import Particles from "../../particles";
// import Color = require("color");
// import { keyBy, map, Dictionary } from "lodash"
import Igloo, { Program } from "igloo-ts";
const vertexShader = require("../../loader/raw-loader!../../shaders/vertex.glsl");
const pixelShader = require("../../loader/raw-loader!../../shaders/pixel.glsl");
// import Color = require("color");
import TextureData from "../texture-data";

// texture buffer used to hold vertex information
const COLOR_ROW = 0;
const VERTEX_ROW = 1;
const VARIATION_ROW = 2;
const SIZE_ROUNDNESS_ROW = 3;
const END_COLOR_ROW = 4;
const BEZIER_ROW = 5;
const START_END_TIME_ROW = 6;
const edgeRows = 7;

/** returns the time in milliseconds with max 2^16 - 65536. x is LSW */
function getTime65536(date?: Date | number): { x: number; y: number } {
	let now = new Date().valueOf();
	if (date instanceof Date) {
		now = date.valueOf();
	} else {
		if (date) now = date;
	}
	return { y: Math.floor(now / 65536) % 65536, x: now % 65536 };
}

interface IPoint { x: number; y: number }

export interface IProps {
	width: number;
	height: number;
}

export interface IState {
	now: number;
}

export default class ParticleCanvas extends React.PureComponent<IProps, IState> {
	private canvas: HTMLCanvasElement;
	private igloo: Igloo;
	private program: Program;
	private worldsize: Float32Array;
	private textureData: TextureData;
	private readonly edgeCount = 6;
	private readonly particlesPerEdge = 20;
	private readonly baseTime = new Date().valueOf();

	constructor(p: IProps) {
		super(p);
		this.state = { now: 2000 };
	}

	private lostContext = event => {
		event.preventDefault();
		console.log("CONTEXT LOST IN CODE");
	};

	private setupNewCanvas = (canvas: HTMLCanvasElement) => {
		// if (this.canvas === canvas || !canvas) return;
		console.log("New Canvas");
		if (this.canvas !== canvas) {
			this.canvas = canvas;
			this.canvas.addEventListener("webglcontextlost", this.lostContext, false);
			this.canvas.addEventListener("webglcontextrestored", () => this.setupNewCanvas(this.canvas), false);
		}
		const igloo = (this.igloo = new Igloo(this.canvas));
		const vertexShaderText = vertexShader;
		const pixelShaderText = pixelShader;

		this.program = this.igloo.program(vertexShaderText, pixelShaderText);
		const gl = igloo.gl;

		gl.getExtension("OES_texture_float_linear");
		gl.getExtension("OES_texture_float");
		const w = this.canvas.width;
		const h = this.canvas.height;
		console.log(`w ${w} h ${h}`);
		gl.disable(gl.DEPTH_TEST);
		this.worldsize = new Float32Array([w, h]);
		this.textureData = new TextureData(edgeRows, 1);
		const backgroundColor = { r: 0.12, g: 0, b: 0.2 };

		// const edgeCount = edges.length;
		this.worldsize = new Float32Array([w, h]);

		// const scale = { x: width, y: height };
		const convertBezierPoints = (edgePoint: IPoint, defaultPoint: IPoint) =>
			edgePoint ? { x: edgePoint.x, y: edgePoint.y } : { x: defaultPoint.x, y: defaultPoint.y };

		const particleCount = this.edgeCount * this.particlesPerEdge;

		// if the total particle count has changed then we need to change the associations
		// between the particle and the vertex data (edge)
		// if (particleCount != this.count) {
		// console.log("Updating Edge Data: " + particleCount);
		// let i = 0;
		const edgeIndexArray = new Float32Array(particleCount);
		const timeOffsetArray = new Float32Array(particleCount);
		// deal with incremental ratePerSecond
		// if the new rate is higher than the old rate
		this.textureData = new TextureData(edgeRows, this.edgeCount);

		// update the texture Data, each row is a different attribute of the edge
		for (let edgeIndex = 0; edgeIndex < this.edgeCount; edgeIndex++) {
			const evenIndex = Math.floor(edgeIndex / 2) * 2;
			const isEven = !(edgeIndex % 2);

			for (let n = 0; n < this.particlesPerEdge; n++) {
				edgeIndexArray[edgeIndex * this.particlesPerEdge + n] = edgeIndex;
				timeOffsetArray[edgeIndex * this.particlesPerEdge + n] = n / this.particlesPerEdge;
			}

			const variationMin = 0.0;
			const variationMax = 0.0;
			const from = { x: 0.05, y: (isEven ? 0.3 : 0.28) + 0.5 * evenIndex / (this.edgeCount - 1) };
			const to = { x: 0.95, y: 0.3 + 0.5 * evenIndex / (this.edgeCount - 1) };
			// set-up vertices in edgedata
			this.textureData.setVec2(
				VERTEX_ROW,
				edgeIndex,
				convertBezierPoints(from, from),
				convertBezierPoints(to, to)
			);
			// random variation of the particles
			this.textureData.setValue(
				VARIATION_ROW,
				edgeIndex,
				variationMin,
				variationMax,
				variationMax - variationMin,
				0.0
			);
			// set-up color in edge Data
			this.textureData.setColor(COLOR_ROW, edgeIndex, isEven ? "pink" : "red");
			this.textureData.setColor(END_COLOR_ROW, edgeIndex, isEven ? "pink" : "red");
			// set-up shape
			this.textureData.setValue(SIZE_ROUNDNESS_ROW, edgeIndex, isEven ? 6.0 / 256.0 : 12.0 / 256, 0.0, 0.0, 0.0);
			// bezier
			this.textureData.setVec2(
				BEZIER_ROW,
				edgeIndex,
				convertBezierPoints(from, from),
				convertBezierPoints(to, to)
			);
			let start = getTime65536(this.baseTime); //new Date(new Date().valueOf() - 2000));
			let end = { x: 0, y: 0 }; //getTime65536(this.baseTime + 2000 + (edgeIndex * 500));// || new Date(new Date().valueOf() + 2000));
			if (!isEven) {
				start = getTime65536(this.baseTime - 10000);
				end = getTime65536(this.baseTime + 2000);
			} else {
				start = getTime65536(this.baseTime + 3000);
				end = { x: 0, y: 0 };
			}
			this.textureData.setValue(
				START_END_TIME_ROW,
				edgeIndex,
				start.x / 65536,
				start.y / 65536,
				end.x / 65536,
				end.y / 65536
			);
		}

		this.program.use();
		// update time
		const timeBuffer = this.igloo.array(timeOffsetArray, gl.STATIC_DRAW);
		timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
		this.program.attrib("time", timeBuffer, 1);
		// update edge Index
		const edgeIndexBuffer = this.igloo.array(edgeIndexArray, gl.STATIC_DRAW);
		edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
		this.program.attrib("edgeIndex", edgeIndexBuffer, 1);

		this.program.uniform("edgeCount", this.textureData.lengthPower2);
		this.program.uniform("variationRow", (VARIATION_ROW + 0.5) / this.textureData.rowsPower2);
		this.program.uniform("colorRow", (COLOR_ROW + 0.5) / this.textureData.rowsPower2);
		this.program.uniform("vertexRow", (VERTEX_ROW + 0.5) / this.textureData.rowsPower2);
		this.program.uniform("endColorRow", (END_COLOR_ROW + 0.5) / this.textureData.rowsPower2);
		this.program.uniform("sizeRoundnessRow", (SIZE_ROUNDNESS_ROW + 0.5) / this.textureData.rowsPower2);
		this.program.uniform("bezierRow", (BEZIER_ROW + 0.5) / this.textureData.rowsPower2);
		this.program.uniform("startEndTimeRow", (START_END_TIME_ROW + 0.5) / this.textureData.rowsPower2);

		this.textureData.bindTexture(this.igloo.gl, gl.TEXTURE0);

		this.program.uniform("edgeData", 0, true);

		// DRAW
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		igloo.defaultFramebuffer.bind();
		gl.viewport(0, 0, this.worldsize[0], this.worldsize[1]);

		gl.clearColor(backgroundColor.r / 256, backgroundColor.g / 256, backgroundColor.b / 256, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		this.program.use();
		const time65536 = getTime65536(new Date(this.baseTime + this.state.now));
		// const clockSeconds = (time65536.x + time65536.y * 65536.0) / 1000.0;
		//(new Date().valueOf() % 10000)/1000.0;
		this.program.uniform("clockLsf", time65536.x / 65536); //;
		this.program.uniform("clockMsf", time65536.y / 65536); //;
		this.program.uniform("worldsize", this.worldsize);
		// this.drawProgram.uniform('size', this.size);
		this.program.uniform("edgeData", 0, true);

		this.program.uniform("color", [0.02, 0.02, 0.0, 1.0]);
		this.program.draw(gl.POINTS, particleCount);
		return this;
	};

	private timeChange = (x: any) => {
		const particleCount = this.edgeCount * this.particlesPerEdge;
		const now = parseInt(x.target.value);
		this.program.use();
		const time65536 = getTime65536(this.baseTime + now);
		// const clockSeconds = (time65536.x + time65536.y * 65536.0) / 1000.0;
		//(new Date().valueOf() % 10000)/1000.0;
		this.program.uniform("clockLsf", time65536.x / 65536); //;
		this.program.uniform("clockMsf", time65536.y / 65536); //;
		this.program.uniform("worldsize", this.worldsize);
		// this.drawProgram.uniform('size', this.size);
		this.program.uniform("edgeData", 0, true);

		this.program.uniform("color", [0, 0, 0, 1.0]);
		this.program.draw(this.igloo.gl.POINTS, particleCount);
		this.setState({ now: now });
	};

	public render() {
		const width = this.props.width;
		const height = this.props.height;
		return (
			<div key="test" style={{ backgroundColor: "#002020" }}>
				<div style={{ color: "white", padding: 5 }}>
					<input
						type="range"
						onChange={this.timeChange}
						min={0}
						max={4000}
						defaultValue={this.state.now.toString()}
						style={{ width: width * 0.5, marginLeft: 100, height: 50, display: "inline-block" }}
					/>
					<span>{this.state.now / 1000}</span>
				</div>
				<canvas
					key="canva"
					style={{ pointerEvents: "none", backgroundColor: "black" }}
					ref={this.setupNewCanvas}
					width={width}
					height={height - 50}
				/>
			</div>
		);
	}
}
