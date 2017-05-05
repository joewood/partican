import * as React from "react"

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
    // colors: IColors;
    // roundness: number;
    width: number;
    // rate: number;
    current: INext;
    next: INext;
    // currentRate: number;
    onPointsChange: (points: IPoints) => void;
    onNextChange: (next: INext) => void;
    // onColorsChange: (colors: IColors) => void;
    // onRateChange: (newRate: number) => void;
    // onRoundnessChange: (roundness: number) => void;
}

function Slider(this: void, { width, p, onChange, name, max = 1.0, min = 0.0 }:
    {
        p: number,
        onChange: (p: number) => void,
        width: number,
        name: string,
        max?: number,
        min?: number,
    }) {
    return <div style={{ width: width - 10, verticalAlign: "top", height: 40 }}>
        <span style={{ width: 40, textAlign: "left", paddingRight: 10, height: "100%", verticalAlign: "middle" }}>{name}</span>
        <input key="slider"
            type="range"
            style={{ width: width - 80, height: "100%", verticalAlign: "middle" }}
            value={p}
            min={min}
            max={max}
            step={Math.abs((max - min) / 100)}
            onChange={(evt) => onChange(parseFloat(evt.target["value"]))} />
    </div>

}

export default function (this: void, { points, width, current, next, ...props }: IProps) {

    const onChange = (vertex: string, p: number) => {
        props.onPointsChange({ ...points, [vertex]: p });
    }

    const onNextChange = (prop: string, p: number) => {
        props.onNextChange({ ...next, [prop]: p })
    }

    return <div style={{ color: "white", width: width - 10, display: "inline-block", verticalAlign: "top", padding: 5, margin: 0, backgroundColor: "#404040" }}>
        <div key="rate" >
            <p>Rate Per Second:{Math.floor(current.rate)}</p>
            <Slider key="p0" p={next.rate} width={width - 10} max={1000} onChange={onNextChange.bind(this, "rate")} name="rate" />
        </div>

        <div key="max">
            <p>Variation: {current.minVariation} to {current.maxVariation}</p>
            <Slider key="min" p={next.minVariation} width={width - 10} min={-0.8} max={0.0} onChange={onNextChange.bind(this, "minVariation")} name="min" />
            <Slider key="max" p={next.maxVariation} width={width - 10} min={0.0} max={0.8} onChange={onNextChange.bind(this, "maxVariation")} name="max" />
        </div>

        <div key="size" >
            <p>Size: {current.size}</p>
            <Slider key="max" p={next.size} width={width - 10} min={0.0} max={20} onChange={onNextChange.bind(this, "size")} name="size" />
        </div>

        <div key="roundness">
            <p>Roundness: {current.roundness}</p>
            <Slider key="rnd" p={next.roundness} width={width - 10} min={0.0} max={1.0} onChange={onNextChange.bind(this, "roundness")} name="round" />
        </div>

        <div key='points' style={{ width: width - 10, display: "block", padding: 0 }}>
            <p>Bezier Points</p>
            <Slider key="p0" p={points.p0} width={width} onChange={onChange.bind(null, "p0")} name="p0" />
            <Slider key="p1" p={points.p1} width={width} onChange={onChange.bind(null, "p1")} min={-1.0} max={2.0} name="p1" />
            <Slider key="p2" p={points.p2} width={width} onChange={onChange.bind(null, "p2")} min={-1.0} max={2.0} name="p2" />
            <Slider key="p3" p={points.p3} width={width} onChange={onChange.bind(null, "p3")} name="p3" />
        </div>
    </div>
}