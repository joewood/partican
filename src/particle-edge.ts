import * as THREE from "three";
import { IParticleEdge } from "./particles";
import { FunctionComponent } from "react"

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

const ParticleEdge :  FunctionComponent<IParticleEdge> = ({}) {
  constructor(props: IParticleEdge) {
    super(props);
    console.log("New Particle Edge");
  }

  public render() {
    return null;
  }
}

/** Holds the historic state of ParticleEdge property changes. Offers a schedule of properties changes
 * for animations to gradually be applied.
 */
export class ParticleScheduleState {
  private last: {
    ratePerSecond: number;
    end: Date;
    start: Date;
  } = null;
  private randomSample: number[];

  private edge: IParticleEdge;

  constructor(props: IParticleEdge) {
    this.edge = Object.assign({}, props);
    this.randomSample = [];
    for (let n = 10000; n >= 0; n--) {
      this.randomSample[n] = Math.random();
    }
    this.last = null;
  }

  public getParticles(): IParticleSchedule {
    return {
      appliesFrom: (this.last && this.last.end) || new Date(new Date().valueOf() - 0),
      particles: this.randomSample,
      ratePerSecond: this.edge.ratePerSecond,
      props: this.edge,
      last: this.last && {
        appliesFrom: this.last.start,
        end: this.last.end,
        ratePerSecond: this.last.ratePerSecond,
        particles: this.randomSample
      }
    };
  }

  /** Property change has occurred */
  public updateProps(newProps: IParticleEdge) {
    const now = new Date();
    if (newProps.ratePerSecond != this.edge.ratePerSecond) {
      this.last = {
        ratePerSecond: this.edge.ratePerSecond,
        start: (this.last && this.last.end) || new Date(now.valueOf() - 1000),
        end: now
      };
    }
    this.edge = { ...this.edge, ...newProps };
  }
}
