class Cube {

    // Constructor
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //Front
        drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0] );
        drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0] );
        //pass the color o a point to u_fragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0] *.9, rgba[1] *.9, rgba[2] *.9, rgba[3]);

        //Top
        drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
        drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
        gl.uniform4f(u_FragColor, rgba[0] *.8, rgba[1] *.8, rgba[2] *.8, rgba[3]);


        //back
        drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
        drawTriangle3D([0,0,1, 1,1,1, 0,1,1]);
        gl.uniform4f(u_FragColor, rgba[0] *.7, rgba[1] *.7, rgba[2] *.7, rgba[3]);

        //left
        drawTriangle3D([0,0,0, 0,1,0, 0,1,1]);
        drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
        gl.uniform4f(u_FragColor, rgba[0] *.6, rgba[1] *.6, rgba[2] *.6, rgba[3]);

        //right
        drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);
        drawTriangle3D([1,0,0, 1,1,1, 1,0,1]);
        gl.uniform4f(u_FragColor, rgba[0] *.5, rgba[1] *.5, rgba[2] *.5, rgba[3]);

        //bottom
        drawTriangle3D([0,0,0, 1,0,1, 0,0,1]);
        drawTriangle3D([0,0,0, 1,0,0, 1,0,1]);
    }
}
