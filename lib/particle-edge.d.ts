import * as React from "react";
import { IParticleEdge } from "./particles";
/**
 * Design:
 * Canvas has multiple edges
 * Particle Positions start negative - not shown
 * Particles at regular intervals
 * Reduction in rate- reduce the particles
 * At time  (p+i mod t)/t mark as invisible
 * Add a new edge with expiring particles
 * increate in rate
 *
 *
 */
export interface IParticleSchedule {
    appliesFrom: Date;
    particles: number[];
    ratePerSecond: number;
    props: IParticleEdge;
    last: {
        appliesFrom: Date;
        end: Date;
        ratePerSecond: number;
        particles: number[];
    };
}
export default class ParticleEdge extends React.Component<IParticleEdge, any> {
    constructor(props: IParticleEdge);
    render(): null;
}
/** Holds the historic state of ParticleEdge property changes. Offers a schedule of properties changes
 * for animations to gradually be applied.
 */
export declare class ParticleScheduleState {
    private last;
    private randomSample;
    private edge;
    constructor(props: IParticleEdge);
    getParticles(): IParticleSchedule;
    /** Property change has occurred */
    updateProps(newProps: IParticleEdge): void;
}
