import * as React from "react"
// import { range } from "lodash";
import { ParticleEdge, ParticleCanvas } from ".."

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
        const { animate, animationIndex, width, height } = this.props;
        console.log(`height: ${height} width: ${width} ${animationIndex}`)
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height, width: width, overflow: "hidden" }}>
            <ParticleCanvas key="demo-particles"
                style={{
                    height: height * 0.8 - 20,
                    width: width * 0.8
                }}
                run={animate}>
                <ParticleEdge key="node1"
                    p0={{ x: 0.9, y: 0.40 }}
                    p1={{ x: 0.500, y: 0.99 }}
                    p2={{ x: 0.200, y: 0.15 }}
                    p3={{ x: 0.150, y: 0.40 }}
                    particleStyle={{
                        color: "orange",
                        endingColor: "purple",
                        roundness: 0.3,
                        size: 10,
                        variationMin: -0.1,
                        variationMax: 0.1,
                    }}
                    ratePerSecond={(animationIndex % 3) * 15 + 5}
                />

                <ParticleEdge key="node2"
                    p0={{ x: 0.05, y: 0.30 }}
                    p1={{ x: 0.300, y: 0.700 }}
                    p2={{ x: 0.800, y: 0.350 }}
                    p3={{ x: 0.950, y: 0.250 }}
                    particleStyle={{
                        color: "white",
                        endingColor: "yellow",
                        roundness: 0.6,
                        size: 10,
                        variationMin: -0.2,
                        variationMax: 0.2,
                    }}
                    ratePerSecond={(3 - (animationIndex % 3)) * 7}
                />
            </ParticleCanvas>
        </div >;
    }
}