// vertex shader
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
}`

//fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
}`

//global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;

let g_globalAngle = 0;
let g_bodyAngle = 0;
let g_headAngle = 0;
let g_feetAngle = 0;

let g_bodyAnimation = false;
let g_headAnimation = false;
let g_feetAnimation= false;

let g_mouseX = 0;
let g_globalAngleX = 0;

let g_nodAngle = 0;
let g_nodAnimation = false;

let g_cartwheelAngle = 0;
let g_cartwheelAnimation = false;
let g_cartwheelStartTime = 0;

let g_armAngle = 0;
let g_armAnimation = false;

function setupWebGL() {
    //retrieve <canvas> element
    canvas = document.getElementById('webgl');

    //get rendering context for webgl
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if(!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
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

    //get storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    //get storage location of u_ModelMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }


    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function addActionsForHtmlUI() {
    // Button Events 
    
    //body
    document.getElementById('AnimationBodyOnButton').onclick = function() { g_bodyAnimation = true; }
    document.getElementById('AnimationBodyOffButton').onclick = function() { g_bodyAnimation = false; }
    //head
    document.getElementById('AnimationHeadOnButton').onclick = function() { g_headAnimation = true;
        playHeadSound(); // Play the head sound
    }
    document.getElementById('AnimationHeadOffButton').onclick = function() { g_headAnimation = false;
        stopHeadSound(); // Stop the head sound
    }

    document.getElementById('AnimationNodOnButton').onclick = function() { g_nodAnimation = true; 
        playHissSound(); // Play the hiss sound
    }
    document.getElementById('AnimationNodOffButton').onclick = function() { g_nodAnimation = false;
        stopHissSound(); // Stop the hiss sound
    }

    //arms
    document.getElementById('AnimationArmOnButton').onclick = function() { g_armAnimation = true; }
    document.getElementById('AnimationArmOffButton').onclick = function() { g_armAnimation = false; }

    //music
    document.getElementById('musicButton').onclick = playMusic;

    //sliders
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngleX  = this.value; renderAllShapes(); });
    document.getElementById('bodySlide').addEventListener('mousemove', function() {g_bodyAngle = this.value; renderAllShapes(); });
    document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderAllShapes(); });

    // Mouse events for rotation
    canvas.addEventListener('mousedown', function(ev) {
        g_mouseDown = true;
        g_lastMouseX = ev.clientX;
        g_lastMouseY = ev.clientY;
    });

    canvas.addEventListener('mousemove', function(ev) {
        let rect = ev.target.getBoundingClientRect();
        g_mouseX = ev.clientX - rect.left;
        g_mouseY = ev.clientY - rect.top;
        updateRotationFromMouse();
        renderAllShapes();
    });

        // Canvas click for cartwheel animation
        canvas.addEventListener('click', function() {
            g_cartwheelAnimation = true;
            g_cartwheelStartTime = performance.now() / 1000.0;
            playFlipSound(); // Play the flip sound
        });
}
function updateRotationFromMouse() {
    let canvasWidth = canvas.width;

    // Calculate rotation angle based on mouse position
    g_globalAngleX = (g_mouseX / canvasWidth) * 360;
}
function main() {

    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.53, 0.81, 0.92, 1.0);

    requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick() {
    g_seconds = performance.now()/1000.0-g_startTime;

    updateAnimationAngles();

    renderAllShapes();

    requestAnimationFrame(tick);
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

function playMusic() {
    var audio = document.getElementById("music");
    audio.play();
}

function playHeadSound() {
    var audio = document.getElementById("headSound");
    audio.volume = .5;
    audio.play();
}

function stopHeadSound() {
    var audio = document.getElementById("headSound");
    audio.pause();
    audio.currentTime = 0; // Reset the sound
}

function playHissSound() {
    var audio = document.getElementById("nodSound");
    audio.play();
}

function stopHissSound() {
    var audio = document.getElementById("nodSound");
    audio.pause();
    audio.currentTime = 0; // Reset the sound
}

function playFlipSound() {
    var audio = document.getElementById("flipSound");
    audio.play();
}

function updateAnimationAngles() {
    if(g_bodyAnimation) {
        g_bodyAngle = 45*Math.sin(g_seconds);
    }

    if(g_headAnimation) {
        g_headAngle = 30*Math.sin(3*g_seconds);
    }

    if(g_feetAnimation){
        g_feetAngle = 45*Math.sin(g_seconds);
    }

    if(g_nodAnimation) {
        g_nodAngle = 16 * Math.sin(3 * g_seconds); // Adjust the speed and amplitude as needed
    }

    if(g_armAnimation) {
        g_armAngle = 25 * Math.sin(2 * g_seconds); // Adjust the speed and amplitude as needed
    }

    if(g_cartwheelAnimation) {
        let elapsed = performance.now() / 1000.0 - g_cartwheelStartTime;
        g_cartwheelAngle = 360 * elapsed; // Complete a full rotation in 1 second
        if (elapsed >= 1) {
            g_cartwheelAnimation = false; // Stop the animation after 1 second
            g_cartwheelAngle = 0; // Reset the angle
        }
    }
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

    // Check the time at the start of this function
    var startTime = performance.now();

    var globalRotMat = new Matrix4().setTranslate(0, -0.2, 0).rotate(g_globalAngleX, 0, 1, 0);

    if (g_cartwheelAnimation) {
        globalRotMat.rotate(g_cartwheelAngle, 1, 0, 0); // Apply cartwheel rotation
    }

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>   
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

   // Create the body
   var body = new Cube();
   body.color = [0.3, 0.9, 0.3, 1.0];
   body.matrix.setTranslate(0, -0.5, 0.0);
   body.matrix.rotate(-5, 1, 0, 0);
   body.matrix.rotate(-g_bodyAngle, 0, 0, 1);
   var yellowCoordinatesMat = new Matrix4(body.matrix); // Store the body transformation matrix
   body.matrix.scale(0.50, 1.1, 0.5);
   body.matrix.translate(-0.6, -0.35, 0);
   body.render();

   // Create the first leg
   var leg1 = new Cube();
   leg1.color = [0.1, 0.5, 0.1, 1.0]; // Green color for the creeper
   leg1.matrix = new Matrix4(yellowCoordinatesMat); // Use the body transformation matrix as the base
   leg1.matrix.translate(-0.5 , -0.4, -0.1); // Position the first leg relative to the body
   leg1.matrix.scale(0.3, 0.3, 0.3); // Scale the first leg
   leg1.render();

   // Create the second leg
   var leg2 = new Cube();
   leg2.color = [0.1, 0.5, 0.1, 1.0]; // Green color for the creeper
   leg2.matrix = new Matrix4(yellowCoordinatesMat); // Use the body transformation matrix as the base
   leg2.matrix.translate(0.1, -0.4, -0.1); // Position the second leg relative to the body
   leg2.matrix.scale(0.3, 0.3, 0.3); // Scale the second leg
   leg2.render();

   //third leg
   var leg3 = new Cube();
   leg3.color = [0.1, 0.5, 0.1, 1.0]; 
   leg3.matrix = new Matrix4(yellowCoordinatesMat); 
   leg3.matrix.translate(0.1, -0.4, 0.4); 
   leg3.matrix.scale(0.3, 0.3, 0.3); 
   leg3.render();
   
   //fourth leg
   var leg4 = new Cube();
   leg4.color = [0.1, 0.5, 0.1, 1.0]; 
   leg4.matrix = new Matrix4(yellowCoordinatesMat); 
   leg4.matrix.translate(-0.5 , -0.4, 0.4); 
   leg4.matrix.scale(0.3, 0.3, 0.3);
   leg4.render();

    // Create the arm 
    var arm = new Cube();
    arm.color = [0.1, 0.5, 0.1, 1.0]; // Green color for the creeper
    arm.matrix = new Matrix4(yellowCoordinatesMat); // Use the body transformation matrix as the base
    arm.matrix.translate(-0.45 , 0.15, -0.26); // Position the arm relative to the body
    arm.matrix.rotate(g_armAngle, 0, 0, 1); // Apply the waving angle
    arm.matrix.scale(0.3, 0.3, 0.3); // Scale the arm
    arm.render();

    var armCoordinatesMat = new Matrix4(arm.matrix);

    // Create the torch base
    var stick = new Cube();
    stick.color = [0.6, 0.3, 0.0, 1.0]; // Brown color for the stick
    stick.matrix = new Matrix4(armCoordinatesMat); // Use the arm transformation matrix as the base
    stick.matrix.translate(0.15, 0.1, .15); // Position the stick relative to the arm
    stick.matrix.scale(0.2, 2.0, 0.1); // Scale the stick
    stick.render();

    //torch tip
    var torchTip = new Cube();
    torchTip.color = [1.0, 0.5, 0.0, 1.0]; // Orange color
    torchTip.matrix = new Matrix4(stick.matrix); // Inherit from stick
    torchTip.matrix.translate(-0.05, 1.0, -0.05); // Move to the top of the stick
    torchTip.matrix.scale(1.2, 0.2, 1.2); // Make it slightly larger for a flame effect
    torchTip.render();
    
   // Create the head
   var head = new Cube();
   head.color = [0.2, 0.7, 0.2, 1.0];
   head.matrix = new Matrix4(yellowCoordinatesMat); // Use the body transformation matrix as the base
   head.matrix.translate(0, 0.65, 0);
   head.matrix.rotate(-g_headAngle, 0, 0, 1);
   head.matrix.rotate(g_nodAngle, 1, 0, 0); // Apply the nodding angle
   head.matrix.scale(0.7, 0.6, 0.7);
   head.matrix.translate(-0.56, -0.1, -0.15);
   head.render();


   // Create the face (eyes)
   var faceMatrix = new Matrix4(head.matrix); // Attach face to the head

   // Left Eye
   var leftEye = new Cube();
   leftEye.color = [0, 0, 0, 1]; // Black color
   leftEye.matrix = new Matrix4(faceMatrix);
   leftEye.matrix.translate(.2, 0.7, -0.01); // Position on face
   leftEye.matrix.scale(0.13, 0.2, 0.01); // Small cube
   leftEye.render();

    // Right Eye
   var rightEye = new Cube();
   rightEye.color = [0, 0, 0, 1]; // Black color
   rightEye.matrix = new Matrix4(faceMatrix);
   rightEye.matrix.translate(.65, 0.7, -0.01); // Position on face
   rightEye.matrix.scale(0.13, 0.2, 0.01); // Small cube
   rightEye.render();

   //Top mouth
    var mouthTop = new Cube();
    mouthTop.color = [0, 0, 0, 1]; // Black
    mouthTop.matrix = new Matrix4(faceMatrix);
    mouthTop.matrix.translate(0.4, 0.29, -0.01); // Position slightly below the eyes
    mouthTop.matrix.scale(0.2, 0.25, 0.01); // Wide rectangle
    mouthTop.render();


    // Mid Mouth 
    var mouthMid = new Cube();
    mouthMid.color = [0, 0, 0, 1]; // Black
    mouthMid.matrix = new Matrix4(faceMatrix);
    mouthMid.matrix.translate(0.25, 0.17, -0.01); // Position slightly below the eyes
    mouthMid.matrix.scale(0.5, 0.25, 0.01); // Wide rectangle
    mouthMid.render();

    // Bottom Left Mouth
    var mouthLeft = new Cube();
    mouthLeft.color = [0, 0, 0, 1]; // Black
    mouthLeft.matrix = new Matrix4(faceMatrix);
    mouthLeft.matrix.translate(0.25, 0.05, -0.01); // Move lower left
    mouthLeft.matrix.scale(0.15, 0.15, 0.01); // Small square
    mouthLeft.render();

    // Bottom Right Mouth
    var mouthRight = new Cube();
    mouthRight.color = [0, 0, 0, 1]; // Black
    mouthRight.matrix = new Matrix4(faceMatrix);
    mouthRight.matrix.translate(0.6, 0.05, -0.01); // Move lower right
    mouthRight.matrix.scale(0.15, 0.15, 0.01); // Small square
    mouthRight.render();
   
    var duration = performance.now() - startTime;
    sendTextToHtml(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");
}

function sendTextToHtml(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm) {
        console.log("Failed to get " + htmlID + " from the HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

