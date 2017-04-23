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
        const { /*animate, */animationIndex, width, height } = this.props;
        console.log(`height: ${height} width: ${width} ${animationIndex}`)
        return <div key="root"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch", backgroundColor: "black", height: height, width: width, overflow: "hidden" }}>
            <ParticleCanvas key="demo-particles"
                style={{
                    height: height * 0.8 - 20,
                    width: width * 0.8
                }}
                run={true}>
                <ParticleEdge key="node1"
                    p0={{ x: 0.9, y: 0.40 }}
                    p1={{ x: 0.500, y: 0.99 }}
                    p2={{ x: 0.200, y: 0.15 }}
                    p3={{ x: 0.150, y: 0.40 }}
                    particleStyle={{
                        color: (animationIndex %2) ? "pink" : "pink",
                        roundness: 0.3,
                        size: 10,
                        variationMin: -0.1,
                        variationMax: 0.1,
                    }}
                    ratePerSecond={(animationIndex % 4) * 10 + 1}
                />

            </ParticleCanvas>
        </div >;
    }
}