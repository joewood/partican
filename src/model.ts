


export interface IPoint {
    x: number;
    y: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IParticleStyle {
    color?: string;
    roundness?: number;
    size?: number;
    variationMin?: number;
    variationMax?: number;
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


