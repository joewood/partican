/** Simple abstraction over a WebGL Texture */
export default class TextureData {
    constructor(rows, length) {
        this.rows = rows;
        this.length = length;
        this.rowsPower2 = Math.pow(2, Math.ceil(Math.log2(this.rows)));
        this.lengthPower2 = Math.pow(2, Math.ceil(Math.log2(length)));
        this.data = new Float32Array(this.rowsPower2 * this.lengthPower2 * 4);
    }
    /** Set the data in the texture
     * @param value1 must be 0->1.0
     * @param value2 must be 0->1.0
     * @param value3 must be 0->1.0
     * @param value3 must be 0->1.0
     */
    setValue(row, index, value1, value2, value3, value4) {
        this.data[row * this.lengthPower2 * 4 + index * 4 + 0] = value1;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 1] = value2;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 2] = value3;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 3] = value4;
    }
    /** Set the data in the texture
     * @param vec1 must be (0->1.0,0->1.0)
     * @param vec2 must be (0->1.0,0->1.0)
     */
    setVec2(row, index, vec1, vec2) {
        this.data[row * this.lengthPower2 * 4 + index * 4 + 0] = vec1.x;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 1] = vec1.y;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 2] = vec2.x;
        this.data[row * this.lengthPower2 * 4 + index * 4 + 3] = vec2.y;
    }
    setColor(row, index, color) {
        const colorObj = Color(color);
        const colorarray = colorObj.array();
        this.setValue(row, index, colorarray[0] / 256, colorarray[1] / 256, colorarray[2] / 256, colorObj.alpha());
    }
    getData() {
        return this.data;
    }
    bindTexture(gl, register) {
        var oldActive = gl.getParameter(gl.ACTIVE_TEXTURE);
        if (this.texture)
            gl.deleteTexture(this.texture);
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.lengthPower2, this.rowsPower2, 0, gl.RGBA, gl.FLOAT, this.data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(register); // working register 31, thanks.
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(oldActive);
        return this.texture;
    }
}
//# sourceMappingURL=texture-data.js.map