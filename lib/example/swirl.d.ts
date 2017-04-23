/// <reference types="react" />
import * as React from "react";
export interface IState {
}
export interface IProps {
    width: number;
    height: number;
    animationIndex: number;
    animate: boolean;
}
export default class Swirl extends React.Component<IProps, IState> {
    constructor(p: any);
    render(): JSX.Element;
}
