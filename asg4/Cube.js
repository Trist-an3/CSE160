class Cube {
    constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = -2;
      this.verts = [
        // Front
        0, 0, 0, 1, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 1, 1, 0,
        // Top
        0, 1, 0, 0, 1, 1, 1, 1, 1,
        0, 1, 0, 1, 1, 1, 1, 1, 0,
        // Bottom
        0, 0, 0, 1, 0, 1, 0, 0, 1,
        0, 0, 0, 1, 0, 0, 1, 0, 1,
        // Left
        1, 0, 0, 1, 1, 1, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 1, 1,
        // Right 
        0, 0, 0, 0, 1, 1, 0, 1, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 1,
        // Back
        0, 0, 1, 1, 1, 1, 0, 1, 1,
        0, 0, 1, 1, 0, 1, 1, 1, 1
      ];
      this.uvVerts = [
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1
      ];
      this.normals = [
        // Front (pointing out of screen)
        0, 0, 1,  0, 0, 1,  0, 0, 1,
        0, 0, 1,  0, 0, 1,  0, 0, 1,
        // Back (pointing into screen)
        0, 0, -1,  0, 0, -1,  0, 0, -1,
        0, 0, -1,  0, 0, -1,  0, 0, -1,
        // Top (pointing up)
        0, 1, 0,  0, 1, 0,  0, 1, 0,
        0, 1, 0,  0, 1, 0,  0, 1, 0,
        // Bottom (pointing down)
        0, -1, 0,  0, -1, 0,  0, -1, 0,
        0, -1, 0,  0, -1, 0,  0, -1, 0,
        // Left (pointing left)
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
        // Right (pointing right)
        1, 0, 0,  1, 0, 0,  1, 0, 0,
        1, 0, 0,  1, 0, 0,  1, 0, 0,
      ];
    
    }
  
    render() {
      const rgba = this.color;
      gl.uniform1i(u_whichTexture, this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      const faces = [
        { verts: [0, 0, 0, 1, 1, 0, 1, 0, 0], uv: [0, 0, 1, 1, 1, 0], normals: [0, 0, 1, 0, 0, 1, 0, 0, 1] },
        { verts: [0, 0, 0, 0, 1, 0, 1, 1, 0], uv: [0, 0, 0, 1, 1, 1], normals: [0, 0, 1, 0, 0, 1, 0, 0, 1] },
        { verts: [0, 1, 0, 1, 1, 1, 1, 1, 0], uv: [0, 0, 1, 1, 1, 0], normals: [0, 1, 0, 0, 1, 0, 0, 1, 0], color: 0.9 },
        { verts: [0, 1, 0, 0, 1, 1, 1, 1, 1], uv: [0, 0, 0, 1, 1, 1], normals: [0, 1, 0, 0, 1, 0, 0, 1, 0], color: 0.9 },
        { verts: [0, 0, 0, 1, 0, 1, 0, 0, 1], uv: [0, 0, 1, 1, 1, 0], normals: [0, -1, 0, 0, -1, 0, 0, -1, 0], color: 0.9 },
        { verts: [0, 0, 0, 1, 0, 0, 1, 0, 1], uv: [0, 0, 0, 1, 1, 1], normals: [0, -1, 0, 0, -1, 0, 0, -1, 0], color: 0.9 },
        { verts: [1, 0, 0, 1, 1, 1, 1, 1, 0], uv: [0, 0, 1, 1, 1, 0], normals: [1, 0, 0, 1, 0, 0, 1, 0, 0], color: 0.8 },
        { verts: [1, 0, 0, 1, 0, 1, 1, 1, 1], uv: [0, 0, 0, 1, 1, 1], normals: [1, 0, 0, 1, 0, 0, 1, 0, 0], color: 0.8 },
        { verts: [0, 0, 0, 0, 1, 1, 0, 1, 0], uv: [0, 0, 1, 1, 1, 0], normals: [-1, 0, 0, -1, 0, 0, -1, 0, 0], color: 0.8 },
        { verts: [0, 0, 0, 0, 0, 1, 0, 1, 1], uv: [0, 0, 0, 1, 1, 1], normals: [-1, 0, 0, -1, 0, 0, -1, 0, 0], color: 0.8 },
        { verts: [0, 0, 1, 1, 1, 1, 0, 1, 1], uv: [0, 0, 1, 1, 1, 0], normals: [0, 0, 1, 0, 0, 1, 0, 0, 1], color: 0.7 },
        { verts: [0, 0, 1, 1, 0, 1, 1, 1, 1], uv: [0, 0, 0, 1, 1, 1], normals: [0, 0, 1, 0, 0, 1, 0, 0, 1], color: 0.7 }
      ];
  
      faces.forEach(face => {
        if (face.color) {
          gl.uniform4f(u_FragColor, rgba[0] * face.color, rgba[1] * face.color, rgba[2] * face.color, rgba[3]);
        }
        drawTriangle3DUVNormal(face.verts, face.uv, face.normals);
      });
    }
  
    renderfaster() {
      const rgba = this.color;
      gl.uniform1i(u_whichTexture, this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      drawTriangle3DUVNormal(this.verts, this.uvVerts,this.normals);
    }
  }