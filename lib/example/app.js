"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var swirl_1 = require("./swirl");
var form_1 = require("./form");
// import Paint from "../test/paint"
var PANEL_WIDTH = 300;
var App = (function (_super) {
    __extends(App, _super);
    function App(p) {
        var _this = _super.call(this, p) || this;
        _this.onResize = function () {
            console.log("resize");
            _this.setState({
                width: document.getElementById("root").clientWidth,
                height: document.getElementById("root").clientHeight
            });
        };
        _this.moveNext = function () {
            if (!_this.state.animate)
                return;
            _this.setState({ current: __assign({}, _this.state.next) });
        };
        var state = {
            startingColor: "#a0f0a0",
            endingColor: "#9090ff",
            rate: 100,
            roundness: 0.3,
            size: 8,
            minVariation: -0.2,
            maxVariation: 0.2,
        };
        _this.state = {
            height: 0,
            width: 0,
            animate: true,
            current: state,
            next: __assign({}, state),
            points: {
                p0: 0.5,
                p1: 0.5,
                p2: 0.5,
                p3: 0.5
            },
            nextRate: 100,
        };
        return _this;
    }
    App.prototype.componentDidMount = function () {
        this.timer = window.setInterval(this.moveNext, 1000);
        window.addEventListener("resize", this.onResize);
        this.setState({
            width: document.getElementById("root").clientWidth,
            height: document.getElementById("root").clientHeight
        });
    };
    App.prototype.componentWillUnmount = function () {
        window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.state, width = _a.width, height = _a.height;
        var animate = this.state.animate;
        return (React.createElement("div", { key: "root", style: { backgroundColor: "orange", overflow: "hidden" }, ref: function (div) { return _this.div = div; } },
            width && React.createElement(swirl_1.default, { key: 'swirl', animate: animate, height: height, width: width - PANEL_WIDTH, startingColor: this.state.current.startingColor, endingColor: this.state.current.endingColor, minVariation: this.state.current.minVariation, maxVariation: this.state.current.maxVariation, roundness: this.state.current.roundness, size: this.state.current.size, rate: this.state.current.rate, points: this.state.points }),
            React.createElement(form_1.default, { key: "editor", width: PANEL_WIDTH, points: this.state.points, current: this.state.current, next: this.state.next, onPointsChange: function (points) { return _this.setState({ points: points }); }, onNextChange: (function (nextRate) { return _this.setState({ next: nextRate }); }) })));
    };
    return App;
}(React.Component));
// {width && <Paint width={width} height={height} />}
document.addEventListener("DOMContentLoaded", function () {
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
});
//# sourceMappingURL=app.js.map