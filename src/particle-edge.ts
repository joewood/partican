import * as React from "react";
import { IParticleEdge } from './particles'

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
        particles: number[]
    }
}

export default class ParticleEdge extends React.Component<IParticleEdge, any> {

    constructor(props: IParticleEdge) {
        super(props);
        console.log("New Particle Edge")
    }

    public render() {
        return null;
    }
}


export class ParticleScheduleState {

    private previous: {
        ratePerSecond: number;
        end: Date;
        start: Date;
    } = null;
    private randomSample: number[];

    private props: IParticleEdge;

    constructor(props: IParticleEdge) {
        this.props = Object.assign({},props);
        this.randomSample = [];
        for (let n = 10000; n >= 0; n--) { this.randomSample[n] = Math.random(); }
        // this.randomSample = this.randomSample.sort((a, b) => a - b);
        this.previous = null;
    }

    public getParticles(): IParticleSchedule {
        return {
            appliesFrom: (this.previous && this.previous.end) || new Date( new Date().valueOf()-0),
            particles: this.randomSample,
            ratePerSecond: this.props.ratePerSecond,
            props: this.props,
            last: this.previous && {
                appliesFrom: this.previous.start,
                end: this.previous.end,
                ratePerSecond: this.previous.ratePerSecond,
                particles: this.randomSample
            }
        }
    }

    public updateProps(newProps: IParticleEdge, force = false) {
        const now = new Date();
        if (force || newProps.ratePerSecond != this.props.ratePerSecond) {
            this.previous = {
                ratePerSecond: this.props.ratePerSecond,
                start: (this.previous && this.previous.end) || new Date( now.valueOf()-1000),
                end: now
            };
            this.props = Object.assign({},this.props,  newProps);
        }
    }

}