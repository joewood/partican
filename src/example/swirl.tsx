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
                    pos1: 0.9,
                    pos2: 0.1,
                    vpos:0.5
                }}
                style={{
                    pos1: spring(0.9 - (animationIndex % 5) / 20, { stiffness: 100, damping: 5 }),
                    pos2: spring(0.15 + (animationIndex % 8) / 30, { damping: 5, stiffness: 100 }),
                    vpos: spring( (animationIndex % 10) / 20, { damping: 5, stiffness: 100 })
                }}>{
                    (style) =>
                        <ParticleCanvas key="demo-particles"
                            style={{
                                height: height,
                                width: width,
                                backgroundColor: "red",
                            }}
                            run={true}>
                            <ParticleEdge key="node1"
                                p0={{ x: style.pos2, y: 0.50 }}
                                p1={{ x: 0.5, y: 0.5-style.vpos }}
                                p2={{ x: 0.200, y: 0.5-style.vpos }}
                                p3={{ x: style.pos1, y: 0.5 }}
                                particleStyle={{
                                    color: `rgb(${(animationIndex * 10 % 200) + 50},${200 - (animationIndex * 20 % 200) + 40},190 )`,
                                    endingColor: `rgb(${200-(animationIndex * 10 % 200) + 50},${ (animationIndex * 20 % 200) + 40},190 )`,
                                    roundness: 0.6,
                                    size: 12,
                                    variationMin: -0.4,
                                    variationMax: 0.4,
                                }}
                                ratePerSecond={(animationIndex % 7) * 200 }
                            />
                            <ParticleEdge key="node2"
                                p0={{ x: style.pos2, y: 0.50 }}
                                p1={{ x: 0.5, y: 0.5+style.vpos }}
                                p2={{ x: 0.2, y: 0.5+style.vpos }}
                                p3={{ x: style.pos1, y: 0.5 }}
                                particleStyle={{
                                    endingColor: `rgb(${(animationIndex * 10 % 200) + 50},${200 - (animationIndex * 20 % 200) + 40},190 )`,
                                    color: `rgb(${200-(animationIndex * 10 % 200) + 50},${ (animationIndex * 20 % 200) + 40},190 )`,
                                    roundness: 0.6,
                                    size: 12,
                                    variationMin: -0.4,
                                    variationMax: 0.4,
                                }}
                                ratePerSecond={(animationIndex % 8) * 300 }
                            />

                        </ParticleCanvas>
                }
            </Motion>
        </div >;
    }
}