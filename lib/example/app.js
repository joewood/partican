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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var swirl_1 = require("./swirl");
// import Paint from "../test/paint"
var Screen;
(function (Screen) {
    Screen[Screen["SWIRL"] = 0] = "SWIRL";
    Screen[Screen["SIMPLE"] = 1] = "SIMPLE";
    Screen[Screen["PARTITION"] = 2] = "PARTITION";
    Screen[Screen["NETWORK"] = 3] = "NETWORK";
})(Screen || (Screen = {}));
;
var App = (function (_super) {
    __extends(App, _super);
    function App(p) {
        var _this = _super.call(this, p) || this;
        _this.onResize = function () {
            console.log("resize");
            _this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight });
        };
        _this.moveNext = function () {
            if (!_this.state.animate)
                return;
            var animationIndex = _this.state.animationIndex + 1;
            _this.setState({ animationIndex: animationIndex });
        };
        _this.state = {
            screen: Screen.NETWORK,
            height: 0,
            width: 0,
            animate: true,
            animationIndex: 0
        };
        return _this;
    }
    App.prototype.componentDidMount = function () {
        this.timer = window.setInterval(this.moveNext, 1000);
        window.addEventListener("resize", this.onResize);
        this.setState({ width: document.getElementById("root").clientWidth, height: document.getElementById("root").clientHeight - 20 });
    };
    App.prototype.componentWillUnmount = function () {
        window.clearInterval(this.timer);
        window.removeEventListener("resize", this.onResize);
    };
    App.prototype.render = function () {
        var _this = this;
        var _a = this.state, width = _a.width, height = _a.height;
        var _b = this.state, animate = _b.animate, animationIndex = _b.animationIndex;
        console.log("resize", this.state);
        return (React.createElement("div", { key: "root", id: "root", style: { backgroundColor: "black", overflow: "hidden" }, ref: function (div) { return _this.div = div; } }, width && React.createElement(swirl_1.default, { animate: animate, animationIndex: animationIndex, height: height - 60, width: width })));
    };
    return App;
}(React.Component));
// {width && <Paint width={width} height={height} />}
document.addEventListener("DOMContentLoaded", function () {
    ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
});
//# sourceMappingURL=app.js.map