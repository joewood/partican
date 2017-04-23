import * as React from "react"
import * as ReactDOM from 'react-dom'
import Swirl from "./swirl"
// import Paint from "../test/paint"

enum Screen { SWIRL, SIMPLE, PARTITION, NETWORK };

interface IState {
    screen: Screen;
    width?: number;
    height?: number;
    animate?: boolean;
    animationIndex: number;
}

class App extends React.Component<any, IState> {
    // private resizeHandler: EventListenerOrEventListenerObject;
    private div: HTMLDivElement;
    private timer: number;

    constructor(p: any) {
        super(p);
        this.state = {
            screen: Screen.NETWORK,
            height: 0,
            width: 0,
            animate: true,
            animationIndex: 0
        }
    }

    private onResize = () => {
        console.log("resize");
        this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight });
    }

    public componentDidMount() {
        this.timer = window.setInterval(this.moveNext, 1000)
        window.addEventListener("resize", this.onResize);
        this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight - 20 });
    }

    public componentWillUnmount() {
        window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    }

    private moveNext = () => {
        if (!this.state.animate) return;
        const animationIndex = this.state.animationIndex + 1;
        this.setState({ animationIndex: animationIndex });
    }

    public render() {
        const { width, height } = this.state;
        const { animate, animationIndex } = this.state;
        console.log("resize", this.state);
        return (<div key="root" id="root"
            style={{ backgroundColor: "black", overflow: "hidden" }}
            ref={div => this.div = div}>
            {width && <Swirl animate={animate} animationIndex={animationIndex} height={height - 60} width={width} />}
        </div>
        )
    }
}

// {width && <Paint width={width} height={height} />}


document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(<App />, document.getElementById("root"));
});