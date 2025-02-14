// vertex shader
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
}`

//fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
}`

//constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

//starting stuff
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedSegments = 10;
let g_selectedType = POINT;

function playMusic() {
    var audio = document.getElementById("music");
    audio.play();
}

function setupWebGL() {
    //retrieve <canvas> element
    canvas = document.getElementById('webgl');

    //get rendering context for webgl
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if(!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    //initialize shaders 
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position'); 
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }

}

function addActionsForHtmlUI() {
    // Button Events 
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick   = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('clear').onclick = function() {
        g_shapesList = [];
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color to black
        gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas
        // console.log('Canvas cleared and reset to black');
    };    
    document.getElementById('musicButt').onclick = function() { playMusic(); };

    document.getElementById('points').onclick = function() {g_selectedType = POINT; };
    document.getElementById('triangles').onclick = function() {g_selectedType = TRIANGLE; };
    document.getElementById('circles').onclick = function() {g_selectedType = CIRCLE; };
    document.getElementById('sunflower').onclick = function() {
        const flower = new Sunflower();
        flower.render();
    };




    // Sliders for colors
    document.getElementById('redSlide').addEventListener('mouseup', function() { 
        g_selectedColor[0] = this.value / 100; 
        console.log('Red slider changed, g_selectedColor:', g_selectedColor);
    });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { 
        g_selectedColor[1] = this.value / 100; 
        console.log('Green slider changed, g_selectedColor:', g_selectedColor);
    });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { 
        g_selectedColor[2] = this.value / 100; 
        console.log('Blue slider changed, g_selectedColor:', g_selectedColor);
    });

    //slider for size and segments
    document.getElementById('shapeSizeSlider').addEventListener('mouseup', function() {g_selectedSize = this.value; });
    document.getElementById('segmentCountSlider').addEventListener('mouseup', function() {g_selectedSegments = this.value; });
}

function main() {

    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev) } };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {

    // Exctract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordinatesEventToGL(ev);

    // Create and store the new point
    let point;
    if (g_selectedType == POINT) {
        point = new Point();
    }
    else if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    }
    else if (g_selectedType == CIRCLE) {
        point = new Circle();
        point.segments = g_selectedSegments;
    }
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
    renderAllShapes();

}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
  
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

    // Check the time at the start of this function
    var startTime = performance.now();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // var len = g_points.length;
    var len = g_shapesList.length;

    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}
