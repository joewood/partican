import * as React from "react"
// import { range } from "lodash";
import { ParticleEdge, ParticleCanvas } from "partican"
import { Motion, spring } from "react-motion"
import { IPoints } from "./form"

export interface IState {
}

export interface IProps {
    width: number;
    height: number;
    animate: boolean;
    startingColor: string;
    endingColor: string;
    minVariation: number;
    maxVariation: number;
    rate: number;
    roundness: number;
    size: number;
    points: IPoints;
}



export default class Swirl extends React.PureComponent<IProps, IState> {

    constructor(p: any) {
        super(p);
        this.state = {
        };
    }

    render() {
        const { width, height, points } = this.props;
        return <div key="particle"
            style={{ display: "inline-block", backgroundColor: "blue", height: height, width: width, overflow: "hidden" }}>
            <Motion key="roote"
                defaultStyle={{
                    pos1x: 0.01,
                    pos1y: points.p0,
                    pos2x: 0.3,
                    pos2y: points.p1,
                    pos3x: 0.6,
                    pos3y: points.p2,
                    pos4x: 0.99,
                    pos4y: points.p3
                }}
                style={{
                    pos1x: spring(0.01),
                    pos1y: spring(points.p0),
                    pos2x: spring(0.3),
                    pos2y: spring(points.p1),
                    pos3x: spring(0.6),
                    pos3y: spring(points.p2),
                    pos4x: spring(0.99),
                    pos4y: spring(points.p3),
                }}>{
                    (style) => {
                        return <ParticleCanvas key="demo-particles"
                            style={{
                                height: height,
                                width: width,
                                backgroundColor: "#101820",
                            }}
                            particleStyle={{
                                color: this.props.startingColor,
                                endingColor: this.props.endingColor,
                                roundness: this.props.roundness,
                                size: this.props.size,
                                variationMin: this.props.minVariation,
                                variationMax: this.props.maxVariation,
                            }}
                            run={true}>
                            <ParticleEdge key="node1"
                                p0={{ x: style.pos1x, y: style.pos1y }}
                                p1={{ x: style.pos2x, y: style.pos2y }}
                                p2={{ x: style.pos3x, y: style.pos3y }}
                                p3={{ x: style.pos4x, y: style.pos4y }}
                                ratePerSecond={this.props.rate}
                            />
                            <ParticleEdge key="node2"
                                p0={{ y: style.pos1x, x: style.pos1y }}
                                p1={{ y: style.pos2x, x: style.pos2y }}
                                p2={{ y: style.pos3x, x: style.pos3y }}
                                p3={{ y: style.pos4x, x: style.pos4y }}
                                ratePerSecond={this.props.rate}
                            />

                        </ParticleCanvas>;
                    }
                }
            </Motion>
        </div >;
    }
}