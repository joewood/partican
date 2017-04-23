import Igloo, { Program } from "igloo-ts";
const vertexShader = require("../loader/raw-loader!../shaders/vertex.glsl");
const pixelShader = require("../loader/raw-loader!../shaders/pixel.glsl");
import Color = require("color");
import TextureData from "./texture-data";
import { IEdge as IModelEdge, IPoint } from "./model"
import { ParticleScheduleState } from "./particle-edge"

export interface IParticleEdge extends IModelEdge {
}

// texture buffer used to hold vertex information
const COLOR_ROW = 0;
const VERTEX_ROW = 1;
const VARIATION_ROW = 2;
const SIZE_ROUNDNESS_ROW = 3;
const END_COLOR_ROW = 4;
const BEZIER_ROW = 5;
const START_END_TIME_ROW = 6;
const edgeRows = 7;

export interface IProps {
    color?: string;
    running?: boolean;
    backgroundColor?: string;//{ r: number, g: number, b: number };
    canvas: HTMLCanvasElement;
    size?: number;
};

/** returns the time in milliseconds with max 2^16 - 65536. x is LSW */
function getTime65536(date?: Date): { x: number, y: number } {
    const now = (date || new Date()).valueOf(); // in milliseconds
    return { y: Math.floor(now / 65536) % 65536, x: now % 65536 };
}

export default class Particles {
    private igloo: Igloo;
    private program: Program;
    private raf: number = 0;
    private worldsize: Float32Array;

    private count: number;
    private textureData: TextureData;
    private backgroundColor: { r: number, g: number, b: number };

    private props: IProps = null;
    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    constructor(props: IProps) {
        this.updateProps(props);
    }

    public updateProps(props: IProps) {
        this.props = {
            size: props.size || 8,
            canvas: props.canvas,
            color: props.color || "white",
            backgroundColor: props.backgroundColor || "black",//{ r: 0, g: 0, b: 0 },
            running: false,
        }
        const igloo = this.igloo = new Igloo(this.props.canvas);
        const vertexShaderText = vertexShader;
        const pixelShaderText = pixelShader;

        this.program = this.igloo.program(vertexShaderText, pixelShaderText);
        const gl = igloo.gl;

        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_float');
        const w = this.props.canvas.width;
        const h = this.props.canvas.height;
        gl.disable(gl.DEPTH_TEST);
        this.worldsize = new Float32Array([w, h]);
        this.textureData = new TextureData(edgeRows, 1);
        this.backgroundColor = { r: Color(this.backgroundColor).red(), g: Color(this.backgroundColor).green(), b: Color(this.backgroundColor).blue() };
        /* Drawing parameters. */
        console.log("Initialized Particle system")
    }

    public get isRunning() {
        return this.props.running;
    }


    /** If the vertices have changed then update the buffers   */
    public updateBuffers(edges: ParticleScheduleState[], width: number, height: number) {
        try {
            const gl = this.igloo.gl;
            const edgeWithSchedule = edges.map(e => {
                return e.getParticles();
            });

            const particleCount = edgeWithSchedule.reduce((p, c) => (c.ratePerSecond || 0) + p + (c.last && c.last.ratePerSecond), 0);
            // const edgeCount = edges.length;
            this.worldsize = new Float32Array([width, height]);

            // const scale = { x: width, y: height };
            const convertBezierPoints = (edgePoint: IPoint, defaultPoint: IPoint) =>
                edgePoint ? { x: edgePoint.x, y: edgePoint.y } : { x: defaultPoint.x, y: defaultPoint.y };

            // if the total particle count has changed then we need to change the associations
            // between the particle and the vertex data (edge) 
            // if (particleCount != this.count) {
            // console.log("Updating Edge Data: " + particleCount);
            this.count = particleCount;
            let i = 0;
            const edgeIndexArray = new Float32Array(particleCount);
            const timeOffsetArray = new Float32Array(particleCount);
            // deal with incremental ratePerSecond
            // if the new rate is higher than the old rate

            let edgeIndex = 0;

            const edgeArrayWithPrevious: { from: Date, ratePerSecond: number, props: IParticleEdge, end: Date, particles:number[] }[] = [];

            for (let edge of edgeWithSchedule) {
                if (edge.ratePerSecond > 0) {
                    for (let n = 0; n < edge.ratePerSecond; n++) {
                        timeOffsetArray[i] = edge.particles[n];
                        edgeIndexArray[i] = edgeIndex;
                        i++;
                    }
                    edgeArrayWithPrevious.push({
                        from: new Date(edge.appliesFrom.valueOf()+1000),
                        end: null,
                        props: edge.props,
                        particles: edge.particles,
                        ratePerSecond: edge.ratePerSecond
                    });
                    edgeIndex++;
                }
                if (edge.last && edge.last.ratePerSecond > 0) {
                    for (let n = 0; n < edge.last.ratePerSecond; n++) {
                        timeOffsetArray[i] = edge.last.particles[n];
                        edgeIndexArray[i] = edgeIndex;
                        i++;
                    }
                    edgeArrayWithPrevious.push({
                        from: edge.last.appliesFrom,
                        end: edge.last.end,
                        props: edge.props,
                        particles: edge.particles,
                        ratePerSecond: edge.last.ratePerSecond
                    });
                    edgeIndex++;
                }
            }
            // consolekc.log("Edge Schedule", edgeArrayWithPrevious)
            this.program.use();
            // update time
            const timeBuffer = this.igloo.array(timeOffsetArray, gl.STATIC_DRAW);
            timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
            this.program.attrib('time', timeBuffer, 1);
            // update edge Index
            const edgeIndexBuffer = this.igloo.array(edgeIndexArray, gl.STATIC_DRAW);
            edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
            this.program.attrib('edgeIndex', edgeIndexBuffer, 1);
            const edgeCount = edgeArrayWithPrevious.length;
            if (this.textureData.length != edgeCount) {
                this.textureData = new TextureData(edgeRows, edgeCount);
                // console.log(`Allocated Texture ${this.textureData.lengthPower2} x ${this.textureData.rowsPower2}`)
            }
            edgeIndex = 0;
            // update the texture Data, each row is a different attribute of the edge
            for (let pd of edgeArrayWithPrevious) {
                const edge = pd.props;
                const variationMin = (edge.particleStyle.variationMin === undefined) ? -0.01 : edge.particleStyle.variationMin;
                const variationMax = (edge.particleStyle.variationMax === undefined) ? 0.01 : edge.particleStyle.variationMax;
                // set-up vertices in edgedata
                this.textureData.setVec2(VERTEX_ROW, edgeIndex,
                    convertBezierPoints(edge.p0, edge.p0),
                    convertBezierPoints(edge.p3, edge.p3));
                // random variation of the particles
                this.textureData.setValue(VARIATION_ROW, edgeIndex, variationMin, variationMax, variationMax - variationMin, pd.particles[0]);
                // set-up color in edge Data
                this.textureData.setColor(COLOR_ROW, edgeIndex, edge.particleStyle.color || this.props.color);
                this.textureData.setColor(END_COLOR_ROW, edgeIndex, edge.particleStyle.endingColor || edge.particleStyle.color || this.props.color);
                // set-up shape
                this.textureData.setValue(SIZE_ROUNDNESS_ROW, edgeIndex, (edge.particleStyle.size || this.props.size || 8.0) / 256, edge.particleStyle.roundness || 0.0, 0.0, 0.0);
                // bezier
                this.textureData.setVec2(BEZIER_ROW, edgeIndex,
                    convertBezierPoints(edge.p1, edge.p1),
                    convertBezierPoints(edge.p2, edge.p2));
                const start = pd.from ? getTime65536(pd.from) : { x: 0, y: 0 };//new Date(new Date().valueOf() - 2000));
                const end = pd.end ? getTime65536(pd.end) : { x: 0, y: 0 };// || new Date(new Date().valueOf() + 2000));
                this.textureData.setValue(START_END_TIME_ROW, edgeIndex, start.x / 65536, start.y / 65536, end.x / 65536, end.y / 65536)
                // console.log("Start",(start.x+start.y*65536)/1000);
                // console.log("Start--s",(new Date().valueOf())/1000);s
                edgeIndex++;
            }
            this.program.use();

            this.program.uniform('edgeCount', this.textureData.lengthPower2);
            this.program.uniform('variationRow', (VARIATION_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('colorRow', (COLOR_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('vertexRow', (VERTEX_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('endColorRow', (END_COLOR_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('sizeRoundnessRow', (SIZE_ROUNDNESS_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('bezierRow', (BEZIER_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('startEndTimeRow', (START_END_TIME_ROW + 0.5) / this.textureData.rowsPower2);

            this.textureData.bindTexture(this.igloo.gl, gl.TEXTURE0);

            this.program.uniform('edgeData', 0, true);
        }
        catch (e) {
            console.error("UpdateBuffers", e);
        }
    };

    /** Draw the current simulation state to the display. */
    public draw() {
        const igloo = this.igloo;
        const gl = igloo.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        igloo.defaultFramebuffer.bind();
        gl.viewport(0, 0, this.worldsize[0], this.worldsize[1]);

        gl.clearColor(this.backgroundColor.r / 256, this.backgroundColor.g / 256, this.backgroundColor.b / 256, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.program.use();
        const time65536 = getTime65536(new Date());
        // const clockSeconds = (time65536.x + time65536.y * 65536.0) / 1000.0;
        //(new Date().valueOf() % 10000)/1000.0;
        this.program.uniform('clockLsf', time65536.x / 65536);//;
        this.program.uniform('clockMsf', time65536.y / 65536);//;
        this.program.uniform('worldsize', this.worldsize);
        // this.drawProgram.uniform('size', this.size);
        this.program.uniform('edgeData', 0, true);

        const background = Color(this.props.color).array();
        this.program.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]);
        if (this.count > 0) this.program.draw(gl.POINTS, this.count);
        return this;
    };

    /** Register with requestAnimationFrame to step and draw a frame.*/
    public frame() {
        this.raf = window.requestAnimationFrame(() => {
            try {
                if (this.props.running) {
                    this.draw();
                    this.frame();
                } else {
                    console.log("Stopped");
                }
            }
            catch (e) {
                console.error("Exception drawing", e);
                this.props.running = false;
            }
        });
    };

    /** Start animating the simulation if it isn't already.*/
    public start() {
        if (!this.props.running) {
            this.props.running = true;
            this.frame();
        }
    };

    /** Immediately stop the animation. */
    public stop() {
        this.props.running = false;
        if (this.raf) window.cancelAnimationFrame(this.raf);
    }
}