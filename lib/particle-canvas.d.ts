/// <reference types="react" />
import * as React from "react";
import { IParticleStyle } from "./model";
import ParticleEdge from "./particle-edge";
export interface IProps {
    style: {
        width: number;
        height: number;
        backgroundColor?: string;
    };
    /** The default values for the particle style in each edge  */
    particleStyle?: IParticleStyle;
    defaultRatePerSecond?: number;
    children?: ParticleEdge[];
    run?: boolean;
}
export interface IState {
}
export declare class ParticleCanvas extends React.PureComponent<IProps, IState> {
    private canvas;
    private particles;
    private edgeState;
    private setupParticles;
    componentWillReceiveProps(newProps: IProps): void;
    shouldComponentUpdate(newProps: IProps, _newState: IState): boolean;
    componentWillUnmount(): void;
    private lostContext;
    private setupNewCanvas;
    render(): JSX.Element;
}
