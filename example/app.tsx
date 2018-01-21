import * as React from "react"
import * as ReactDOM from 'react-dom'
import Swirl from "./swirl"
import Editor, { IPoints, INext } from "./form"

const PANEL_WIDTH = 300;


interface IState {
    width?: number;
    height?: number;
    animate?: boolean;
    current: INext;
    next: INext;
    points: IPoints;
    nextRate: number;
}

class App extends React.Component<any, IState> {
    // private resizeHandler: EventListenerOrEventListenerObject;
    private div: HTMLDivElement;
    private timer: number;

    constructor(p: any) {
        super(p);
        const state: INext = {
            startingColor: "#a0f0a0",
            endingColor: "#9090ff",
            rate: 100,
            roundness: 0.3,
            size:8,
            minVariation: -0.2,
            maxVariation: 0.2,
        };
        this.state = {
            height: 0,
            width: 0,
            animate: true,
            current: state,
            next: {...state},
            points: {
                p0: 0.5,
                p1: 0.5,
                p2: 0.5,
                p3: 0.5
            },
            nextRate: 100,
        }
    }

    private onResize = () => {
        console.log("resize");
        this.setState({
            width: document.getElementById("root").clientWidth,
            height: document.getElementById("root").clientHeight
        });
    }

    public componentDidMount() {
        this.timer = window.setInterval(this.moveNext, 1000)
        window.addEventListener("resize", this.onResize);
        this.setState({
            width: document.getElementById("root").clientWidth,
            height: document.getElementById("root").clientHeight
        });
    }

    public componentWillUnmount() {
        window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    }

    private moveNext = () => {
        if (!this.state.animate) return;
        this.setState({ current: { ... this.state.next } });
    }

    public render() {
        const { width, height } = this.state;
        const { animate } = this.state;
        return (<div key="root"
            style={{ backgroundColor: "black", overflow: "hidden" }}
            ref={div => this.div = div}>
            {
                width && <Swirl key='swirl'
                    animate={animate}
                    height={height}
                    width={width - PANEL_WIDTH}
                    startingColor={this.state.current.startingColor}
                    endingColor={this.state.current.endingColor}
                    minVariation={this.state.current.minVariation}
                    maxVariation={this.state.current.maxVariation}
                    roundness={this.state.current.roundness}
                    size={this.state.current.size}
                    rate={this.state.current.rate}
                    points={this.state.points}
                />
            }
            <Editor key="editor"
                width={PANEL_WIDTH}
                points={this.state.points}
                current={this.state.current}
                next={this.state.next}
                onPointsChange={points => this.setState({ points: points })}
                onNextChange={(nextRate => this.setState({ next: nextRate }))}
            />
        </div>
        )
    }
}


document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(<App />, document.getElementById("root"));
});