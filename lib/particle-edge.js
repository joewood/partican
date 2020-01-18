import * as React from "react";
export default class ParticleEdge extends React.Component {
    constructor(props) {
        super(props);
        console.log("New Particle Edge");
    }
    render() {
        return null;
    }
}
/** Holds the historic state of ParticleEdge property changes. Offers a schedule of properties changes
 * for animations to gradually be applied.
 */
export class ParticleScheduleState {
    constructor(props) {
        this.last = null;
        this.edge = Object.assign({}, props);
        this.randomSample = [];
        for (let n = 10000; n >= 0; n--) {
            this.randomSample[n] = Math.random();
        }
        this.last = null;
    }
    getParticles() {
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
    updateProps(newProps) {
        const now = new Date();
        if (newProps.ratePerSecond != this.edge.ratePerSecond) {
            this.last = {
                ratePerSecond: this.edge.ratePerSecond,
                start: (this.last && this.last.end) || new Date(now.valueOf() - 1000),
                end: now
            };
        }
        this.edge = Object.assign(Object.assign({}, this.edge), newProps);
    }
}
//# sourceMappingURL=particle-edge.js.map