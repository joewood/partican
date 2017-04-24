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
        console.log(`height: ${height} width: ${width} ${animationIndex}`)
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "blue", height: height, width: width, overflow: "hidden" }}>
            <Motion key="roote"
                defaultStyle={{
                    pos1: 0.9,
                    pos2: 0.1
                }}
                style={{
                    pos1: spring(0.9 - (animationIndex % 5) / 20),
                    pos2: spring(0.15 + (animationIndex % 8) / 30)
                }}>{
                    (style) =>
                        <ParticleCanvas key="demo-particles"
                            style={{
                                height: height * 0.8 - 20,
                                width: width * 0.8,
                                backgroundColor: "red",
                            }}
                            run={true}>
                            <ParticleEdge key="node1"
                                p0={{ x: style.pos2, y: 0.50 }}
                                p1={{ x: 0.5, y: 0.0 }}
                                p2={{ x: 0.200, y: 0.0 }}
                                p3={{ x: style.pos1, y: 0.5 }}
                                particleStyle={{
                                    color: (animationIndex % 3) ? "pink" : "cyan",
                                    roundness: 0.6,
                                    size: 12,
                                    variationMin: -0.2,
                                    variationMax: 0.2,
                                }}
                                ratePerSecond={(animationIndex % 3) * 200 + 100}
                            />
                            <ParticleEdge key="node2"
                                p0={{ x: style.pos2, y: 0.50 }}
                                p1={{ x: 0.5, y: 0.99 }}
                                p2={{ x: 0.2, y: 0.99 }}
                                p3={{ x: style.pos1, y: 0.5 }}
                                particleStyle={{
                                    color: (animationIndex % 2) ? "pink" : "cyan",
                                    roundness: 0.6,
                                    size: 12,
                                    variationMin: -0.2,
                                    variationMax: 0.2,
                                }}
                                ratePerSecond={(animationIndex % 2) * 300 + 100}
                            />

                        </ParticleCanvas>
                }
            </Motion>
        </div >;
    }
}