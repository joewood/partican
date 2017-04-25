export interface IPoint {
    x: number;
    y: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IParticleStyle {
    /** Color of the particle, using any valid color string */
    color?: string;
    /** Roundness factor from 0.0 to 1.0. 0.0 being square, 1.1 being a circle. */
    roundness?: number;
    /** Size in logical pixels */
    size?: number;
    /** Fractional variation below the path */
    variationMin?: number;
    /** Fractional variation above the path */
    variationMax?: number;
    /** If specified then the color at the end of the route, `color` becomes the starting color. */
    endingColor?: string;
}
export interface IPositionlessEdge {
    ratePerSecond?: number;
    particleStyle?: IParticleStyle;
    nonrandom?: boolean;
}
export interface IEdge extends IPositionlessEdge {
    /** Optional source, defaults to the source node */
    p0?: IPoint;
    /** Used for bezier cubic curve */
    p1?: IPoint;
    /** Used for bezier cubic curve */
    p2?: IPoint;
    /** Optional target, use target node by default */
    p3?: IPoint;
}
