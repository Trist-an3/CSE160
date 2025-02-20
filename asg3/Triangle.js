class Triangle {
  constructor() {
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.size = 5.0;
  }

  render() {
    const rgba = this.color;
    const size = this.size;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]); // Pass the color of point to u_FragColor
    gl.uniform1f(u_Size, size); // Pass the size of point to u_Size

    const d = this.size / 200.0; // side length
    drawTriangle([0, 0, d, 0, 0, d]); // Draw triangle with selected verts
  }
}

function createBuffer(data, num, type, attribute) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(attribute, num, type, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
  return buffer;
}

function drawTriangle(vertices) {
  const n = 3; // The number of vertices
  createBuffer(vertices, 2, gl.FLOAT, a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

let g_vertexBuffer = null;

function initTriangle3D() {
  g_vertexBuffer = gl.createBuffer();
  if (!g_vertexBuffer) {
    console.log('Failed to create the buffer object');
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
}

function drawTriangle3D(vertices) {
  const n = vertices.length / 3;
  if (!g_vertexBuffer) {
    initTriangle3D();
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
  const n = vertices.length / 3; // The number of vertices
  createBuffer(vertices, 3, gl.FLOAT, a_Position);
  createBuffer(uv, 2, gl.FLOAT, a_UV);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}