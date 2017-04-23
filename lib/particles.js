"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var igloo_ts_1 = require("igloo-ts");
var vertexShader = require("../loader/raw-loader!../shaders/vertex.glsl");
var pixelShader = require("../loader/raw-loader!../shaders/pixel.glsl");
var Color = require("color");
var texture_data_1 = require("./texture-data");
// texture buffer used to hold vertex information
var COLOR_ROW = 0;
var VERTEX_ROW = 1;
var VARIATION_ROW = 2;
var SIZE_ROUNDNESS_ROW = 3;
var END_COLOR_ROW = 4;
var BEZIER_ROW = 5;
var START_END_TIME_ROW = 6;
var edgeRows = 7;
;
/** returns the time in milliseconds with max 2^16 - 65536. x is LSW */
function getTime65536(date) {
    var now = (date || new Date()).valueOf(); // in milliseconds
    return { y: Math.floor(now / 65536) % 65536, x: now % 65536 };
}
var Particles = (function () {
    /**
     * @param nparticles initial particle count
     * @param [size=5] particle size in pixels
     */
    function Particles(props) {
        this.raf = 0;
        this.props = null;
        this.updateProps(props);
    }
    Particles.prototype.updateProps = function (props) {
        this.props = {
            size: props.size || 8,
            canvas: props.canvas,
            color: props.color || "white",
            backgroundColor: props.backgroundColor || "black",
            running: false,
        };
        var igloo = this.igloo = new igloo_ts_1.default(this.props.canvas);
        var vertexShaderText = vertexShader;
        var pixelShaderText = pixelShader;
        this.program = this.igloo.program(vertexShaderText, pixelShaderText);
        var gl = igloo.gl;
        gl.getExtension('OES_texture_float_linear');
        gl.getExtension('OES_texture_float');
        var w = this.props.canvas.width;
        var h = this.props.canvas.height;
        gl.disable(gl.DEPTH_TEST);
        this.worldsize = new Float32Array([w, h]);
        this.textureData = new texture_data_1.default(edgeRows, 1);
        this.backgroundColor = { r: Color(this.backgroundColor).red(), g: Color(this.backgroundColor).green(), b: Color(this.backgroundColor).blue() };
        /* Drawing parameters. */
        console.log("Initialized Particle system");
    };
    Object.defineProperty(Particles.prototype, "isRunning", {
        get: function () {
            return this.props.running;
        },
        enumerable: true,
        configurable: true
    });
    /** If the vertices have changed then update the buffers   */
    Particles.prototype.updateBuffers = function (edges, width, height) {
        try {
            var gl = this.igloo.gl;
            var edgeWithSchedule = edges.map(function (e) {
                return e.getParticles();
            });
            var particleCount = edgeWithSchedule.reduce(function (p, c) { return (c.ratePerSecond || 0) + p + (c.last && c.last.ratePerSecond); }, 0);
            // const edgeCount = edges.length;
            this.worldsize = new Float32Array([width, height]);
            // const scale = { x: width, y: height };
            var convertBezierPoints = function (edgePoint, defaultPoint) {
                return edgePoint ? { x: edgePoint.x, y: edgePoint.y } : { x: defaultPoint.x, y: defaultPoint.y };
            };
            // if the total particle count has changed then we need to change the associations
            // between the particle and the vertex data (edge) 
            // if (particleCount != this.count) {
            // console.log("Updating Edge Data: " + particleCount);
            this.count = particleCount;
            var i = 0;
            var edgeIndexArray = new Float32Array(particleCount);
            var timeOffsetArray = new Float32Array(particleCount);
            // deal with incremental ratePerSecond
            // if the new rate is higher than the old rate
            var edgeIndex = 0;
            var edgeArrayWithPrevious = [];
            for (var _i = 0, edgeWithSchedule_1 = edgeWithSchedule; _i < edgeWithSchedule_1.length; _i++) {
                var edge = edgeWithSchedule_1[_i];
                if (edge.ratePerSecond > 0) {
                    for (var n = 0; n < edge.ratePerSecond; n++) {
                        timeOffsetArray[i] = edge.particles[n];
                        edgeIndexArray[i] = edgeIndex;
                        i++;
                    }
                    edgeArrayWithPrevious.push({
                        from: new Date(edge.appliesFrom.valueOf() + 1000),
                        end: null,
                        props: edge.props,
                        particles: edge.particles,
                        ratePerSecond: edge.ratePerSecond
                    });
                    edgeIndex++;
                }
                if (edge.last && edge.last.ratePerSecond > 0) {
                    for (var n = 0; n < edge.last.ratePerSecond; n++) {
                        timeOffsetArray[i] = edge.last.particles[n];
                        edgeIndexArray[i] = edgeIndex;
                        i++;
                    }
                    edgeArrayWithPrevious.push({
                        from: edge.last.appliesFrom,
                        end: edge.last.end,
                        props: edge.props,
                        particles: edge.particles,
                        ratePerSecond: edge.last.ratePerSecond
                    });
                    edgeIndex++;
                }
            }
            // consolekc.log("Edge Schedule", edgeArrayWithPrevious)
            this.program.use();
            // update time
            var timeBuffer = this.igloo.array(timeOffsetArray, gl.STATIC_DRAW);
            timeBuffer.update(timeOffsetArray, gl.STATIC_DRAW);
            this.program.attrib('time', timeBuffer, 1);
            // update edge Index
            var edgeIndexBuffer = this.igloo.array(edgeIndexArray, gl.STATIC_DRAW);
            edgeIndexBuffer.update(edgeIndexArray, gl.STATIC_DRAW);
            this.program.attrib('edgeIndex', edgeIndexBuffer, 1);
            var edgeCount = edgeArrayWithPrevious.length;
            if (this.textureData.length != edgeCount) {
                this.textureData = new texture_data_1.default(edgeRows, edgeCount);
                // console.log(`Allocated Texture ${this.textureData.lengthPower2} x ${this.textureData.rowsPower2}`)
            }
            edgeIndex = 0;
            // update the texture Data, each row is a different attribute of the edge
            for (var _a = 0, edgeArrayWithPrevious_1 = edgeArrayWithPrevious; _a < edgeArrayWithPrevious_1.length; _a++) {
                var pd = edgeArrayWithPrevious_1[_a];
                var edge = pd.props;
                var variationMin = (edge.particleStyle.variationMin === undefined) ? -0.01 : edge.particleStyle.variationMin;
                var variationMax = (edge.particleStyle.variationMax === undefined) ? 0.01 : edge.particleStyle.variationMax;
                // set-up vertices in edgedata
                this.textureData.setVec2(VERTEX_ROW, edgeIndex, convertBezierPoints(edge.p0, edge.p0), convertBezierPoints(edge.p3, edge.p3));
                // random variation of the particles
                this.textureData.setValue(VARIATION_ROW, edgeIndex, variationMin, variationMax, variationMax - variationMin, pd.particles[0]);
                // set-up color in edge Data
                this.textureData.setColor(COLOR_ROW, edgeIndex, edge.particleStyle.color || this.props.color);
                this.textureData.setColor(END_COLOR_ROW, edgeIndex, edge.particleStyle.endingColor || edge.particleStyle.color || this.props.color);
                // set-up shape
                this.textureData.setValue(SIZE_ROUNDNESS_ROW, edgeIndex, (edge.particleStyle.size || this.props.size || 8.0) / 256, edge.particleStyle.roundness || 0.0, 0.0, 0.0);
                // bezier
                this.textureData.setVec2(BEZIER_ROW, edgeIndex, convertBezierPoints(edge.p1, edge.p1), convertBezierPoints(edge.p2, edge.p2));
                var start = pd.from ? getTime65536(pd.from) : { x: 0, y: 0 }; //new Date(new Date().valueOf() - 2000));
                var end = pd.end ? getTime65536(pd.end) : { x: 0, y: 0 }; // || new Date(new Date().valueOf() + 2000));
                this.textureData.setValue(START_END_TIME_ROW, edgeIndex, start.x / 65536, start.y / 65536, end.x / 65536, end.y / 65536);
                // console.log("Start",(start.x+start.y*65536)/1000);
                // console.log("Start--s",(new Date().valueOf())/1000);s
                edgeIndex++;
            }
            this.program.use();
            this.program.uniform('edgeCount', this.textureData.lengthPower2);
            this.program.uniform('variationRow', (VARIATION_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('colorRow', (COLOR_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('vertexRow', (VERTEX_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('endColorRow', (END_COLOR_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('sizeRoundnessRow', (SIZE_ROUNDNESS_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('bezierRow', (BEZIER_ROW + 0.5) / this.textureData.rowsPower2);
            this.program.uniform('startEndTimeRow', (START_END_TIME_ROW + 0.5) / this.textureData.rowsPower2);
            this.textureData.bindTexture(this.igloo.gl, gl.TEXTURE0);
            this.program.uniform('edgeData', 0, true);
        }
        catch (e) {
            console.error("UpdateBuffers", e);
        }
    };
    ;
    /** Draw the current simulation state to the display. */
    Particles.prototype.draw = function () {
        var igloo = this.igloo;
        var gl = igloo.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        igloo.defaultFramebuffer.bind();
        gl.viewport(0, 0, this.worldsize[0], this.worldsize[1]);
        gl.clearColor(this.backgroundColor.r / 256, this.backgroundColor.g / 256, this.backgroundColor.b / 256, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.program.use();
        var time65536 = getTime65536(new Date());
        // const clockSeconds = (time65536.x + time65536.y * 65536.0) / 1000.0;
        //(new Date().valueOf() % 10000)/1000.0;
        this.program.uniform('clockLsf', time65536.x / 65536); //;
        this.program.uniform('clockMsf', time65536.y / 65536); //;
        this.program.uniform('worldsize', this.worldsize);
        // this.drawProgram.uniform('size', this.size);
        this.program.uniform('edgeData', 0, true);
        var background = Color(this.props.color).array();
        this.program.uniform('color', [background[0] / 255, background[1] / 255, background[2] / 255, 1.0]);
        if (this.count > 0)
            this.program.draw(gl.POINTS, this.count);
        return this;
    };
    ;
    /** Register with requestAnimationFrame to step and draw a frame.*/
    Particles.prototype.frame = function () {
        var _this = this;
        this.raf = window.requestAnimationFrame(function () {
            try {
                if (_this.props.running) {
                    _this.draw();
                    _this.frame();
                }
                else {
                    console.log("Stopped");
                }
            }
            catch (e) {
                console.error("Exception drawing", e);
                _this.props.running = false;
            }
        });
    };
    ;
    /** Start animating the simulation if it isn't already.*/
    Particles.prototype.start = function () {
        if (!this.props.running) {
            this.props.running = true;
            this.frame();
        }
    };
    ;
    /** Immediately stop the animation. */
    Particles.prototype.stop = function () {
        this.props.running = false;
        if (this.raf)
            window.cancelAnimationFrame(this.raf);
    };
    return Particles;
}());
exports.default = Particles;
//# sourceMappingURL=particles.js.map