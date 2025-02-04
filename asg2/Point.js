class Point {
    constructor() {
        this.type = 'point'; 
        this.position = [0.0, 0.0]; 
        this.color = [1.0, 1.0, 1.0, 1.0]; // Defaultd
        this.size = 5.0; // Default
    }

    render() {
        var [x, y] = this.position; 
        var rgba = this.color; 
        var size = this.size;

        gl.disableVertexAttribArray(a_Position);

        // Pass the position to the shader
        gl.vertexAttrib3f(a_Position, x, y, 0.0);

        // Pass the color to the shader
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the size to the shader
        gl.uniform1f(u_Size, size);

        // Draw the point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}