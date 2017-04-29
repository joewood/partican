import * as React from "react"
// import { range } from "lodash";
import { ParticleEdge, ParticleCanvas } from ".."
import { Motion, spring } from "react-motion"

export interface IState {
}

export interface IProps {
    width: number;
    height: number;
    animationIndex: number;
    animate: boolean;
}

function getCirclePoint(i: number, length: number, radius: number): { x: number, y: number } {
    const angle = (i % length) / length * 2 * Math.PI;
    const ret = {
        x: 0.5 + radius * Math.cos(angle),
        y: 0.5 + radius * Math.sin(angle)
    };
    return ret;
}


export default class Swirl extends React.Component<IProps, IState> {

    constructor(p: any) {
        super(p);
        this.state = {
        };
    }

    render() {
        const { /*animate, */animationIndex, width, height } = this.props;
        // console.log(`height: ${height} width: ${width} ${animationIndex}`)
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "blue", height: height, width: width, overflow: "hidden" }}>
            <Motion key="roote"
                defaultStyle={{
                    pos1x: 0.9,
                    pos1y: 0.9,
                    pos2x: 0.1,
                    pos2y: 0.5,
                    pos3x: 0.1,
                    pos3y: 0.5,
                    pos4x: 0.1,
                    pos4y: 0.5
                }}
                style={{
                    pos1x: spring(getCirclePoint(animationIndex, 40, 0.4).x, { stiffness: 100, damping: 5 }),
                    pos1y: spring(getCirclePoint(animationIndex, 40, 0.4).y, { stiffness: 100, damping: 5 }),
                    pos2x: spring(getCirclePoint(animationIndex, 10, 0.2).x, { stiffness: 100, damping: 5 }),
                    pos2y: spring(getCirclePoint(animationIndex, 10, 0.2).y, { stiffness: 100, damping: 5 }),
                    pos3x: spring(getCirclePoint(animationIndex+5, 10, 0.2).x, { stiffness: 100, damping: 5 }),
                    pos3y: spring(getCirclePoint(animationIndex+5, 10, 0.2).y, { stiffness: 100, damping: 5 }),
                    pos4x: spring(getCirclePoint(animationIndex+20, 40, 0.4).x, { stiffness: 100, damping: 5 }),
                    pos4y: spring(getCirclePoint(animationIndex+20, 40, 0.4).y, { stiffness: 100, damping: 5 }),
                }}>{
                    (style) => {
                        return <ParticleCanvas key="demo-particles"
                            style={{
                                height: height,
                                width: width,
                                backgroundColor: "#302010",
                            }}
                            run={true}>
                            <ParticleEdge key="node1"
                                p2={{ x: style.pos1x , y: style.pos1y }}
                                p1={{ x: style.pos2x, y: style.pos2y }}
                                p0={{ x: 0.5, y: 0.2 }}
                                p3={{ x: 0.5, y: 0.5 }}
                                particleStyle={{
                                    color: `rgb(${(animationIndex * 10 % 200) + 50},${200 - (animationIndex * 20 % 200) + 40},190 )`,
                                    endingColor: `rgb(${200 - (animationIndex * 10 % 200) + 50},${(animationIndex * 20 % 200) + 40},190 )`,
                                    roundness: 0.6,
                                    size: 12,
                                    variationMin: -0.4,
                                    variationMax: 0.4,
                                }}
                                ratePerSecond={(animationIndex % 7) * 20+4}
                            />
                            <ParticleEdge key="node2"
                                p0={{ x: style.pos4x, y: style.pos4y }}
                                p1={{ x: style.pos3x, y: style.pos3y }}
                                p2={{ x: 0.5, y: 0.7 }}
                                p3={{ x: 0.5, y: 0.5 }}
                                particleStyle={{
                                    endingColor: `rgb(${(animationIndex * 10 % 200) + 50},${200 - (animationIndex * 20 % 200) + 40},190 )`,
                                    color: `rgb(${200 - (animationIndex * 10 % 200) + 50},${(animationIndex * 20 % 200) + 40},190 )`,
                                    roundness: 0.6,
                                    size: 12,
                                    variationMin: -0.4,
                                    variationMax: 0.4,
                                }}
                                ratePerSecond={(animationIndex % 8) * 50+5}
                            />

                        </ParticleCanvas>;
                    }
                }
            </Motion>
        </div >;
    }
}