/// <reference types="react" />
export interface IPoints {
    p0: number;
    p1: number;
    p2: number;
    p3: number;
}
export interface IColors {
    start: string;
    end: string;
}
export interface INext {
    startingColor?: string;
    endingColor?: string;
    minVariation?: number;
    maxVariation?: number;
    roundness: number;
    size: number;
    rate: number;
}
export interface IProps {
    points: IPoints;
    width: number;
    current: INext;
    next: INext;
    onPointsChange: (points: IPoints) => void;
    onNextChange: (next: INext) => void;
}
export default function (this: void, {points, width, current, next, ...props}: IProps): JSX.Element;
