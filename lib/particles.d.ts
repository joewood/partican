import { IEdge as IModelEdge } from "./model";
import { ParticleScheduleState } from "./particle-edge";
export interface IParticleEdge extends IModelEdge {
}
export interface IProps {
    color?: string;
    running?: boolean;
    backgroundColor?: string;
    canvas: HTMLCanvasElement;
    size?: number;
}
export default class Particles {
    private igloo;
    private program;
    private raf;
    private worldsize;
    private count;
    private textureData;
    private backgroundColor;
    private texture;
    private props;
    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    constructor(props: IProps);
    updateProps(props: IProps): void;
    readonly isRunning: boolean;
    /** If the vertices have changed then update the buffers   */
    updateBuffers(edges: ParticleScheduleState[], width: number, height: number): void;
    /** Draw the current simulation state to the display. */
    draw(): this;
    /** Register with requestAnimationFrame to step and draw a frame.*/
    frame(): void;
    /** Start animating the simulation if it isn't already.*/
    start(): void;
    /** Immediately stop the animation. */
    stop(): void;
}
