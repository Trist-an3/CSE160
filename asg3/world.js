//vertex shader
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

//fragment shader
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;

    uniform sampler2D u_Sampler0; 
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform sampler2D u_Sampler4;
    uniform sampler2D u_Sampler5;
    uniform sampler2D u_Sampler6;
    uniform sampler2D u_Sampler7;
    uniform int u_whichTexture;

    void main() {
    
        if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor;
        } else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        } else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        } else if (u_whichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);
        } else if (u_whichTexture == 2) {
            gl_FragColor = texture2D(u_Sampler2, v_UV);
        } else if (u_whichTexture == 3) {
            gl_FragColor = texture2D(u_Sampler3, v_UV);
        } else if (u_whichTexture == 4) {
            gl_FragColor = texture2D(u_Sampler4, v_UV);
        } else if (u_whichTexture == 5) {
            gl_FragColor = texture2D(u_Sampler5, v_UV);
        } else if (u_whichTexture == 6) {
            gl_FragColor = texture2D(u_Sampler6, v_UV);
        } else if (u_whichTexture == 7) {
            gl_FragColor = texture2D(u_Sampler7, v_UV);
        } else {
            gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
        }
    }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_whichTexture;
let u_ViewMatrix;
let u_ProjectionMatrix;
let camera;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_Sampler7;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');

  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV =  gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of whichTexture');
    return false;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotation
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  //cobblestone
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  //dirt
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_Sampler2
  //grass
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // Get the storage location of u_Sampler3
  //sky
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  // Get the storage location of u_Sampler4
  //tree leaves
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }

  //get storage of u_sampler 5
  //wood
  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return false;
  }

  //get storage of u_sampler 6
  //brick
  u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
  if (!u_Sampler6) {
    console.log('Failed to get the storage location of u_Sampler6');
    return false;
  }

  //get storage of u_sampler7
  //stone
  u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
  if (!u_Sampler7) {
    console.log('Failed to get the storage location of u_Sampler7');
    return false;
  }

  // Set an initial value for this matrix to identity
  let identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  let viewMat = new Matrix4().lookAt(0, 0, 5,  0, 0, 0,  0, 1, 0);
  let projMat = new Matrix4().setPerspective(50, canvas.width / canvas.height, 0.1, 100);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

}

function initTextures() {
    //cobblstone
    var image0 = new Image();
    if(!image0) {
        console.log('Failed to create the image object');
        return false;
    }

    image0.onload = function(){
      console.log("Successfully loaded:", image0.src); 
       sendImageToTEXTURE0(image0); };

       image0.onerror = function() {
        console.error("Failed to load texture:", image0.src);
    };
    image0.src = 'textures/cobblestone.png';
    

    //dirt
    var image1 = new Image();
    if(!image1) {
        console.log('Failed to create the image object');
        return false;
    }

    image1.onload = function(){ sendImageToTEXTURE1(image1); };
    image1.src = 'textures/dirt.png';

    //grass
    var image2 = new Image();
    if(!image0) {
        console.log('Failed to create the image object');
        return false;
    }

    image2.onload = function(){ sendImageToTEXTURE2(image2); };
    image2.src = 'textures/grass.png';

    //sky
    var image3 = new Image();
    if(!image3) {
        console.log('Failed to create the image object');
        return false;
    }

    image3.onload = function(){ sendImageToTEXTURE3(image3); };
    image3.src = 'textures/sky.png';

    //tree leaves
    var image4= new Image();
    if(!image4) {
        console.log('Failed to create the image object');
        return false;
    }
    
    image4.onload = function(){ sendImageToTEXTURE4(image4); };
    image4.src = 'textures/tree_leaves.png';


    //wood 
    var image5= new Image();
    if(!image5) {
        console.log('Failed to create the image object');
        return false;
    }

    image5.onload = function(){ sendImageToTEXTURE5(image5); };
    image5.src = 'textures/wood.png';

    //brick 
    var image6= new Image();
    if(!image6) {
        console.log('Failed to create the image object');
        return false;
    }

    image6.onload = function(){ sendImageToTEXTURE6(image6); };
    image6.src = 'textures/brick.png';

    //nice stone
    var image7= new Image();
    if(!image7) {
        console.log('Failed to create the image object');
        return false;
    }

    image7.onload = function(){ sendImageToTEXTURE7(image7); };
    image7.src = 'textures/stone.png';

}

//cobblestone
function sendImageToTEXTURE0(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  console.log('finished loadTexture0');
}

//dirt
function sendImageToTEXTURE1(image) {
    // Create a texture object
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler1, 1);

    console.log('finished loadTexture1');
}

//grass
function sendImageToTEXTURE2(image) {
    // Create a texture object
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler2, 2);

    console.log('finished loadTexture2');
}

//sky
function sendImageToTEXTURE3(image) {
    // Create a texture object
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE3);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler3, 3);

    console.log('finished loadTexture3');
}

//tree leaves
function sendImageToTEXTURE4(image) {
    // Create a texture object
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }

    // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE4);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler4, 4);

    console.log('finished loadTexture4');
}

//wood 
function sendImageToTEXTURE5(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE5);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler5, 5);

  console.log('finished loadTexture5');
}

//brick
function sendImageToTEXTURE6(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE6);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler6, 6);

  console.log('finished loadTexture6');
}

//nice stone
function sendImageToTEXTURE7(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE7);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler7, 7);

  console.log('finished loadTexture7');
}


function addActionsForHtmlUI() {
  canvas.addEventListener('mousedown', (ev) => {
    isMouseDown = true;
    prevMouseX = ev.clientX;
    prevMouseY = ev.clientY;
  });

  canvas.addEventListener('mouseup', (ev) => {
    isMouseDown = false;
  });

  canvas.addEventListener('mousemove', (ev) => {
    if (isMouseDown) {
      let deltaX = ev.clientX - prevMouseX;
      let deltaY = ev.clientY - prevMouseY;
      camera.panRight(deltaX * 0.2); // Adjust the sensitivity as needed
      camera.lookUp(deltaY * 0.2); // Adjust the sensitivity as needed
      prevMouseX = ev.clientX;
      prevMouseY = ev.clientY;
      renderAllShapes();
    }
  });

  canvas.addEventListener('click', function(ev) {
    if (distanceToModel() < 2) { // If within 2 block radius
        console.log("Model clicked! Starting cartwheel animation.");
        playFlipSound();
        playWinSound();
        g_cartwheelAnimation = true;
        g_cartwheelStartTime = performance.now() / 1000.0;
    }
  });

  // FOV slider
  document.getElementById('fovSlider').oninput = function() {
    let fov = this.value;
    camera.projMat.setPerspective(fov, canvas.width / canvas.height, 0.1, 100);
    renderAllShapes();
  };

  
  //music
  document.getElementById('musicButton').onclick = playMusic;

}

function playMusic() {
  var audio = document.getElementById("music");
  audio.play();
}

function playFlipSound() {
  var audio = document.getElementById("flipSound");
  audio.play();
}

function playWinSound() {
  var audio = document.getElementById("winSound");
  audio.play();
}

function playStoneSound() {
  var audio = document.getElementById("blockSound");
  if (audio) {
    audio.currentTime = 0; // Reset the audio to the beginning
    audio.play().catch(error => {
      console.log("Audio play failed:", error);
    });
  } else {
    console.log("Audio element not found");
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_globalAngle = 0;
let g_bodyAngle = 0;
let g_headAngle = 0;
let g_feetAngle = 0;

let g_bodyAnimation = false;
let g_headAnimation = true;
let g_feetAnimation= false;

let g_mouseX = 0;
let g_globalAngleX = 0;

let g_nodAngle = 0;
let g_nodAnimation = false;

let g_cartwheelAngle = 0;
let g_cartwheelAnimation = false;
let g_cartwheelStartTime = 0;

let g_armAngle = 0;
let g_armAnimation = true;

let prevMouseX = 0;
let prevMouseY = 0;
let isMouseDown = false;

let g_modelX = 0;
let g_modelAnimation = false;


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

  initTextures();

  camera = new Camera();

  document.onkeydown = keydown;

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
  let error = gl.getError();
  if (error !== gl.NO_ERROR) {
      console.log("WebGL Error:", error);
  }
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

  if(g_modelAnimation) {
    g_modelX = 5 * Math.sin(g_seconds); // Move back and forth along the X-axis
  }
}

function distanceToStone(stone, position) {
  let dx = position.x - stone.x;
  let dy = position.y - stone.y;
  let dz = position.z - stone.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function handleStoneAction() {
  let offset = 2.0; // Distance in front of the camera
  let direction = new Vector3([
    camera.at.elements[0] - camera.eye.elements[0],
    camera.at.elements[1] - camera.eye.elements[1],
    camera.at.elements[2] - camera.eye.elements[2]
  ]);
  direction.normalize();
  let targetPosition = {
    x: camera.eye.elements[0] + direction.elements[0] * offset,
    y: camera.eye.elements[1] + direction.elements[1] * offset - 1.3, // Adjust y position to be on the ground
    z: camera.eye.elements[2] + direction.elements[2] * offset
  };

  let closestStone = stones.find(stone => distanceToStone(stone, targetPosition) < 1);
  if (closestStone) {
    stones = stones.filter(stone => stone !== closestStone);
    console.log("Stone removed!");
    playStoneSound();
  } else {
    stones.push(targetPosition);

    console.log("Stone added!");
    playStoneSound();
  }
  renderAllShapes();
}


function distanceToModel() {
  let dx = camera.eye.elements[0] - (-3);  // Model's X position
  let dy = camera.eye.elements[1] - (-0.5); // Model's Y position
  let dz = camera.eye.elements[2] - (-8);  // Model's Z position
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}



function keydown(ev) {
  if (ev.keyCode == 32) { // Space key
    ev.preventDefault(); // Prevents page scrolling xd
  }
  
  if(ev.keyCode == 38 || ev.keyCode == 87) { // W standard wasd movement
    camera.moveForward();
  } else if (ev.keyCode == 40 || ev.keyCode == 83) { //  S standard wasd movement
    camera.moveBackwards();
  } else if (ev.keyCode == 37 || ev.keyCode == 65) { // A standard wasd movement
    camera.moveLeft();
  } else if (ev.keyCode == 39 || ev.keyCode == 68) { // D standard wasd movement
    camera.moveRight();
  } else if (ev.keyCode == 81) { // Q tilt left side 
  camera.panLeft(10);
  } else if (ev.keyCode == 69) { // E tilt right side
    camera.panRight(10);
  }else if (ev.keyCode == 90) { // Z tilt up 
    camera.lookUp(10);
  } else if (ev.keyCode == 88) { // X tilt down
    camera.lookDown(10);
  }  else if (ev.keyCode == 32) { // Space fly up lol
    camera.moveUp();
  } else if (ev.keyCode == 17 && camera.eye.elements[1] > 0) { // Left control
    camera.moveDown();
  } else if (ev.keyCode == 80) { // P key for adding/removing bushes
  handleStoneAction();
  }

  renderAllShapes();
  //console.log(ev.keyCode);

}


var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];


function drawMap() {
  let offsetX = g_map.length / 2 - 0.5;
  let offsetY = g_map[0].length / 2 - 0.5;

  for (let x = 0; x < g_map.length; x++) {
    for (let y = 0; y < g_map[x].length; y++) {
      if (g_map[x][y] == 1) {
        var wall = new Cube();
        wall.textureNum = 1; // Dirt texture
        wall.matrix.translate(x - offsetX, -1.5, y - offsetY); // Adjust the height to be on the floor
        wall.matrix.scale(1, 4, 1); // Scale the wall to be one block high
        wall.render();
      }
    }
  }
}

function drawTree(x, y, z) {
  // Draw the trunk
  var trunk = new Cube();
  trunk.color = [0.6, 0.3, 0.0, 1.0]; // Brown color for the trunk
  trunk.textureNum = -2; // Use color instead of texture
  trunk.matrix.translate(x, y, z);
  trunk.matrix.scale(0.5, 2.0, 0.5); // Scale the trunk
  trunk.render();

  // Draw the leaves
  var leaves = new Cube();
  leaves.textureNum = 4; // Use the tree leaves texture
  leaves.matrix.translate(x - 0.75, y + 2.0, z - 0.75);
  leaves.matrix.scale(2.0, 2.0, 2.0); // Scale the leaves
  leaves.render();
}

let stones = [];
function drawStones() {
  stones.forEach(stone => {
    var s = new Cube();
    s.textureNum = 7; // Use the stone texture
    s.matrix.translate(stone.x, stone.y, stone.z);
    s.matrix.scale(1.0, 1.0, 1.0);
    s.render();
  });
}

let bushes = [
  { x: 2, y: -1.3, z: -2 },
  { x: -2, y: -1.3, z: 2 },
  { x: -3, y: -1.3, z: -3.5 },
  { x: -3, y: -1.3, z: 7 },
  { x: 3, y: -1.3, z: 9 },
  { x: 4, y: -1.3, z: 7 }
];

function drawBushes() {
  bushes.forEach(bush => {
    var b = new Cube();
    b.textureNum = 4; // Use the tree leaves texture
    b.matrix.translate(bush.x, bush.y, bush.z);
    b.matrix.scale(1.0, 1.0, 1.0);
    b.render();
  });
}

function drawRockHouse(x, y, z) {
  // Draw the base of the house
  var base = new Cube();
  base.textureNum = 0; // Cobblestone texture
  base.matrix.translate(x, y, z);
  base.matrix.scale(4, 4, 4); // Scale the base
  base.render();

  // create roof 
  let roofHeight = 4; // How tall the roof should be
  for (let i = 0; i < roofHeight; i++) {
    var roofLayer = new Cube();
    roofLayer.color = [0.5, 0.25, 0.0, 1.0]; // Brown color for the roof
    roofLayer.textureNum = -2; // Use color instead of texture
    
    // Each layer gets smaller as it goes up
    let layerSize = 5 - i; // Shrinks by 1 each time
    roofLayer.matrix.translate(x - (layerSize - 4) / 2, y + 4 + i, z - (layerSize - 4) / 2);
    roofLayer.matrix.scale(layerSize, 1, layerSize); // Make it slightly smaller each level
    roofLayer.render();
  }
}

function drawWoodHouse(x, y, z) {
  // Draw the base of the house
  var base = new Cube();
  base.textureNum = 5; // Use the wood texture
  base.matrix.translate(x, y, z);
  base.matrix.scale(4, 4, 4); // Scale the base
  base.render();

  // Draw the roof of the house
  let roofHeight = 4; // How tall the roof should be
  for (let i = 0; i < roofHeight; i++) {
    var roofLayer = new Cube();
    roofLayer.color = [0.5, 0.25, 0.0, 1.0]; // Brown color for the roof
    roofLayer.textureNum = -2; // Use color instead of texture
    
    // Each layer gets smaller as it goes up
    let layerSize = 5 - i; // Shrinks by 1 each time
    roofLayer.matrix.translate(x - (layerSize - 4) / 2, y + 4 + i, z - (layerSize - 4) / 2);
    roofLayer.matrix.scale(layerSize, 1, layerSize); // Make it slightly smaller each level
    roofLayer.render();
  }
}

function drawBrickHouse(x, y, z) {
  // Draw the base of the house
  var base = new Cube();
  base.textureNum = 6; // Use the brick texture
  base.matrix.translate(x, y, z);
  base.matrix.scale(4, 4, 4); // Scale the base
  base.render();

  // Draw the roof of the house
  let roofHeight = 4; // How tall the roof should be
  for (let i = 0; i < roofHeight; i++) {
    var roofLayer = new Cube();
    roofLayer.color = [0.5, 0.25, 0.0, 1.0]; // Brown color for the roof
    roofLayer.textureNum = -2; // Use color instead of texture
    
    // Each layer gets smaller as it goes up
    let layerSize = 5 - i; // Shrinks by 1 each time
    roofLayer.matrix.translate(x - (layerSize - 4) / 2, y + 4 + i, z - (layerSize - 4) / 2);
    roofLayer.matrix.scale(layerSize, 1, layerSize); // Make it slightly smaller each level
    roofLayer.render();
  }
}


// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // console.log("Rendering frame...");


  // Check the time at the start of this function
  var startTime = performance.now();

  var globalRotMat = new Matrix4().setTranslate(0, -0.2, 0).rotate(g_globalAngleX, 0, 1, 0);


  camera.viewMat.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
  );

  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMat.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projMat.elements);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>   
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.clear(gl.COLOR_BUFFER_BIT);

  //floor
  var floor = new Cube();
  floor.color = [0.45, 0.35, 0.24, 1.0];
  floor.textureNum = 2;
  floor.matrix.translate(0.0, -1.56, 0.0);
  floor.matrix.scale(34, 0.01, 34);
  floor.matrix.translate(-0.325, 0.0, -0.475);
  floor.render();

  // sky
  var sky = new Cube();
  sky.color = [1, 0, 0, 1];
  sky.textureNum = 3;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();

  //map
  drawMap();

  //trees
  drawTree(5, -1.3, -4);
  drawTree(-5, -1.3, 8);
  drawTree(-8, -1.3, -7);
  drawTree(3, -1.3, -9);
  drawTree(3, -1.3, 6.5);
  drawTree(7, -1.3, 2);



  //houses
  drawRockHouse(-5, -1.3, -10);
  drawWoodHouse(5, -1.3, 10);
  drawBrickHouse(5, -1.3, -10);

  // Draw bushes
  // drawBush(2, -1.3, -2);
  // drawBush(-2, -1.3, 2);
  // drawBush(-3, -1.3, -3.5);
  // drawBush(-3, -1.3, 7);
  // drawBush(3, -1.3, 9);
  // drawBush(4, -1.3, 7);

  drawBushes();

  drawStones();

 // Create the body
 var body = new Cube();
 body.color = [0.3, 0.9, 0.3, 1.0];
 body.matrix.setTranslate(-3, -.5, -8);
 body.matrix.rotate(180, 0, 1, 0); // Rotate the model by 90 degrees around the Y-axis
 body.matrix.rotate(-5, 1, 0, 0);
//  body.matrix.rotate(-g_bodyAngle, 0, 0, 1);

body.matrix.rotate(-g_bodyAngle, 0, 0, 1);
body.matrix.rotate(g_cartwheelAngle, 1, 0, 0); // Apply cartwheel rotation


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

function sendTextToHtml(text, htmlID){
  var htmlElem = document.getElementById(htmlID);
  if (!htmlElem){
      console.log("Failed to get " + htmlElem + " from HTML");
      return;
  }
  htmlElem.innerHTML = text;
}