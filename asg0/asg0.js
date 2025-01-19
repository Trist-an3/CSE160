// DrawTriangle.js (c) 2012 matsuda
//global variables so i dont need 2 define them for each fnction
var canvas, ctx;
function main() {  
    // Retrieve <canvas> element
    // var canvas = document.getElementById('cnv1');  
    canvas = document.getElementById('cnv1');

    if (!canvas) { 
      console.log('Failed to retrieve the <canvas> element');
      return false; 
    } 
  
    // Get the rendering context for 2DCG
    // var ctx = canvas.getContext('2d');
    ctx = canvas.getContext('2d');

    // Draw a blue rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color
    
}

function drawVector(v, color) {
    //console.log("`Drawing vector`:", v.elements, "Color:", color); DEBUGGING
    ctx.strokeStyle = color;
    let cx = canvas.width/2;
    let cy = canvas.height/2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
    ctx.stroke();
}

function handleDrawEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
    ctx.fillRect(0, 0, 400, 400);

    var x = document.getElementById('v1x').value;
    var y = document.getElementById('v1y').value;
  
    var v1 = new Vector3([x, y, 0.0]);
    drawVector(v1, "red");
  
    var x2 = document.getElementById('v2x').value;
    var y2 = document.getElementById('v2y').value;
  
    var v2 = new Vector3([x2, y2, 0.0]);
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
    ctx.fillRect(0, 0, 400, 400);

    // Read the values of the text boxes to create v1
    let v1x = (document.getElementById('v1x').value);
    let v1y = (document.getElementById('v1y').value);
    let v1 = new Vector3([v1x, v1y, 0.0]);

    // Call drawVector(v1, "red")  DEBUGGING
    // console.log("Drawing v1:", v1.elements);

    drawVector(v1, "red");

    // Read the values of the text boxes to create v2
    let v2x = (document.getElementById('v2x').value);
    let v2y = (document.getElementById('v2y').value);
    let v2 = new Vector3([v2x, v2y, 0.0]);

    // Call drawVector(v2, "blue")
    // console.log("Drawing v2:", v2.elements);  DEBUGGING

    drawVector(v2, "blue");

    //now getting to the operation stuff
    let operation = document.getElementById('Operation-Select').value;
    let scalar = (document.getElementById('scalar').value);
    // DEBUGGING
    // console.log("Selected operation:", operation);
    // console.log("Scalar value:", scalar);
    
    // Perform the selected operation and draw the resulting vectors
    switch (operation) {
        case 'add':
            let v3_add = v1.add(v2);
            // console.log("v3_add:", v3_add.elements);  DEBUGGING
            drawVector(v3_add, "green");
            break;
        case 'sub':
            let v3_sub = v1.sub(v2);
            drawVector(v3_sub, "green");
            break;
        case 'mult':
            let v3_mult = v1.mul(scalar);
            let v4_mult = v2.mul(scalar);
            drawVector(v3_mult, "green");
            drawVector(v4_mult, "green");
            break;
        case 'div':
            let v3_div = v1.div(scalar);
            let v4_div = v2.div(scalar);
            drawVector(v3_div, "green");
            drawVector(v4_div, "green");
            break;
        case 'angleBet':
            let v3 = angleBetween(v1, v2);
            console.log("Angle: ", v3)
            break;
        case 'mag':
            console.log('Magnitude v1:', v1.magnitude());
            console.log('Magnitude v2:', v2.magnitude());
            break;
        case 'norm':
            v1.normalize();
            v2.normalize();
            drawVector(v1, 'green', ctx); 
            drawVector(v2, 'green', ctx); 
            break;
        case 'area':
            let area = areaTriangle(v1, v2)
            console.log('Area of the Triangle is:', area);
            break;
        default:
            console.log("Invalid operation");
    }

}

function angleBetween(v1, v2) {
  // Calculate the dot product of v1 and v2
  let dotProduct = Vector3.dot(v1, v2);
  
  // Find the magnitudes of v1 and v2
  let magnitude1 = v1.magnitude();
  let magnitude2 = v2.magnitude();
  
  // Use the dot product formula to find the cosine of the angle
  let cosAngle = dotProduct / (magnitude1 * magnitude2);
  
  // Use the inverse cosine function to find the angle in radians
  let angleRadians = Math.acos(cosAngle);
  
  // Convert the angle from radians to degrees
  let angleDegrees = angleRadians * (180 / Math.PI);
  
  return angleDegrees;
}

function areaTriangle(v1, v2) {
    //use cross function from vector3
    let crossProduct = Vector3.cross(v1, v2);

    //formula to get area
    let area = crossProduct.magnitude() / 2;
    return area;
}
