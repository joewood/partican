/// <reference types="react" />
import * as React from "react";
import { IPoints } from "./form";
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
    constructor(p: any);
    render(): JSX.Element;
}
