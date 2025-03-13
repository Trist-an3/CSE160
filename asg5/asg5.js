/*
Extras = 
    Shadows
    Billboard
    Fog

Lights = 
    Spotlight
    directional light
    ambient light


 */
import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';


console.log('asg5.js is loaded');

// const scene = new THREE.Scene();

// Ensure the DOM is fully loaded before running the script
window.addEventListener('load', () => {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


    const skyboxScene = new THREE.Scene();

    // Position the camera above the plane and look at the center of the scene
    camera.position.set(10, 5, 0);
    camera.lookAt(0, 0, 0);
    
    // Create a renderer and set the canvas element
    const canvas = document.getElementById('webgl');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: softer shadows

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Add lighting to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true; // Enable shadows for the directional light

    // Increase shadow camera range for higher objects
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;


    scene.add(directionalLight);


    // Add a bright red spotlight to the tower
    const spotLight = new THREE.SpotLight(0xff0000, 20); // Higher intensity for brightness
    spotLight.position.set(20, 50, 20); // Position the light higher to create a cone effect
    spotLight.castShadow = true;

    spotLight.angle = Math.PI / 8; 
    spotLight.penumbra = 0.1;
    spotLight.decay = 1;
    spotLight.distance = 100; // Adjust distance so the light covers the floor correctly

    // Create a target object for the spotlight
    const spotLightTarget = new THREE.Object3D();
    spotLightTarget.position.set(20, 0, 20); // Aim at the floor under the tower
    scene.add(spotLightTarget);

    spotLight.target = spotLightTarget;

    scene.add(spotLight);

    // Add a helper to visualize the spotlight
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    // Function to update the spotlight helper when scene changes
    function updateSpotLight() {
        spotLightHelper.update();
    }




    // Load the grass texture
    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('textures/grass.png'); // Update the path to your grass texture

    // Create a plane geometry and apply the grass texture
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, side: THREE.DoubleSide });


    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
    plane.receiveShadow = true; // Enable shadows for the plane
    scene.add(plane);

    // Create a geometry and a material, then combine them into a mesh
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(-5, 20, 5);

    cube.castShadow = true; // Enable shadows for the cube

    // Add the mesh to the scene
    scene.add(cube);

    // Create a pedestal for the duck
    const pedestalGeometry = new THREE.BoxGeometry(7, 5.9, 5);
    const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray color

    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);

    pedestal.position.set(5, 3, 0); // Position the pedestal under the duck
    pedestal.castShadow = true; // Enable shadows for the pedestal
    pedestal.receiveShadow = true; // Enable shadows for the pedestal
    scene.add(pedestal);


   // Load the skybox image
   const BlueSkyTexture = textureLoader.load('textures/BlueSkySkybox.png'); 
   const dirtTexture = textureLoader.load('textures/dirt.png'); 
   const GreenSkyTexture = textureLoader.load('textures/GreenSky.png'); 
   const PurpleSkyTexture = textureLoader.load('textures/PurplyBlueSky.png');
   const SkySkyTexture = textureLoader.load('textures/SkySkybox.png');
   const SunsetSkyTexture = textureLoader.load('textures/SunsetSky.png'); 


   
   // Create an array of materials for the skybox
   const skyboxMaterials = [
       new THREE.MeshBasicMaterial({ map: BlueSkyTexture, side: THREE.BackSide }), // right
       new THREE.MeshBasicMaterial({ map: GreenSkyTexture, side: THREE.BackSide }), // left
       new THREE.MeshBasicMaterial({ map: PurpleSkyTexture, side: THREE.BackSide }), // top
       new THREE.MeshBasicMaterial({ map: dirtTexture, side: THREE.BackSide }), // bottom
       new THREE.MeshBasicMaterial({ map: SkySkyTexture, side: THREE.BackSide }), // front
       new THREE.MeshBasicMaterial({ map: SunsetSkyTexture, side: THREE.BackSide })  // back
   ];

   let duck;

   // Create a skybox geometry and apply the skybox materials
   const skyboxGeometry = new THREE.BoxGeometry(500, 500, 500);
   const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
   skyboxScene.add(skybox); 

    // Load the duck.mtl file and then the duck.obj file
    const mtlLoader = new MTLLoader();
    mtlLoader.load('textures/12248_Bird_v1_L2.mtl', (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('textures/12248_Bird_v1_L2.obj', (object) => {
            object.position.set(5, 6, 0); // Adjust the position as needed
            object.scale.set(0.1, 0.1, 0.1); // Scale the object down
            object.rotation.x = -Math.PI / 2; // Rotate the object to stand on its feet
            object.castShadow = true; // Enable shadows for the object
            object.receiveShadow = true; // Enable shadows for the object
            scene.add(object);
            duck = object;
        });
    }, undefined, (error) => {
        console.error('Error loading MTL file:', error);
    });

    // Create a sphere and position it on the floor
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-20, 5, -20); // Position the sphere on the floor
    sphere.castShadow = true; // Enable shadows for the sphere
    sphere.receiveShadow = true; // Enable shadows for the sphere
    scene.add(sphere);


    const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 10, 32);
    const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(20, 5, -20); // Position the cylinder on the floor
    cylinder.castShadow = true; // Enable shadows for the cylinder
    cylinder.receiveShadow = true; // Enable shadows for the cylinder
    scene.add(cylinder);

    // Create a cone and position it on the floor
    const coneGeometry = new THREE.ConeGeometry(5, 10, 32);
    const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);

    cone.position.set(0, 5, -20); // Position the cone on the floor
    cone.castShadow = true; // Enable shadows for the cone
    cone.receiveShadow = true; // Enable shadows for the cone
    scene.add(cone);

    // Create the base cylinder
    const towerCylinderGeometry = new THREE.CylinderGeometry(5, 5, 10, 32);
    const towerCylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const towerCylinder = new THREE.Mesh(towerCylinderGeometry, towerCylinderMaterial);
    towerCylinder.position.set(20, 5, 20); // Position the cylinder as the base
    towerCylinder.castShadow = true; // Enable shadows for the cylinder
    towerCylinder.receiveShadow = true; // Enable shadows for the cylinder
    scene.add(towerCylinder);

    // Create the middle sphere
    const towerSphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const towerSphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const towerSphere = new THREE.Mesh(towerSphereGeometry, towerSphereMaterial);
    towerSphere.position.set(20, 15, 20); // Position the sphere on top of the cylinder
    towerSphere.castShadow = true; // Enable shadows for the sphere
    towerSphere.receiveShadow = true; // Enable shadows for the sphere
    scene.add(towerSphere);

    // Create the top cone
    const towerConeGeometry = new THREE.ConeGeometry(5, 10, 32);
    const towerConeMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const towerCone = new THREE.Mesh(towerConeGeometry, towerConeMaterial);
    towerCone.position.set(20, 23, 20); // Position the cone on top of the sphere
    towerCone.castShadow = true; // Enable shadows for the cone
    towerCone.receiveShadow = true; // Enable shadows for the cone
    scene.add(towerCone);

    // House Walls (Cube)
    const houseWallGeometry = new THREE.BoxGeometry(8, 6, 8);
    const houseWallMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const houseWalls = new THREE.Mesh(houseWallGeometry, houseWallMaterial);
    houseWalls.position.set(-5, 3, 10);
    houseWalls.castShadow = true;
    houseWalls.receiveShadow = true;
    scene.add(houseWalls);

    // House Roof (Pyramid)s
    const houseRoofGeometry = new THREE.ConeGeometry(6, 4, 4);
    const houseRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const houseRoof = new THREE.Mesh(houseRoofGeometry, houseRoofMaterial);
    houseRoof.position.set(-5, 8, 10);
    houseRoof.rotation.y = Math.PI / 4; // Rotate to align with cube
    houseRoof.castShadow = true;
    houseRoof.receiveShadow = true;
    scene.add(houseRoof);

    // House Door (Cube)
    const houseDoorGeometry = new THREE.BoxGeometry(2, 3, 0.1);
    const houseDoorMaterial = new THREE.MeshStandardMaterial({ color: 0x663300 });
    const houseDoor = new THREE.Mesh(houseDoorGeometry, houseDoorMaterial);
    houseDoor.position.set(-5, 1.5, 14);
    houseDoor.castShadow = true;
    houseDoor.receiveShadow = true;
    scene.add(houseDoor);

    // House Windows (Thin Cubes)
    const windowGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.1);
    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff });

    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-7, 3, 14);
    scene.add(window1);

    const window2 = window1.clone();
    window2.position.set(-3, 3, 14);
    scene.add(window2);

    // Tree Trunk (Cylinder)
    const trunkGeometry = new THREE.CylinderGeometry(1, 1, 8, 32);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(22, 4, 0); // Adjust the position as needed
    trunk.castShadow = true; // Enable shadows for the trunk
    trunk.receiveShadow = true; // Enable shadows for the trunk
    scene.add(trunk);

    // Tree Leaves (Cones)
    const leafGeometry = new THREE.ConeGeometry(3, 5, 16);
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });

    const leaf1 = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf1.position.set(22, 9, 0); // Position on top of the trunk
    leaf1.castShadow = true; // Enable shadows for the leaves
    leaf1.receiveShadow = true; // Enable shadows for the leaves
    scene.add(leaf1);

    const leaf2 = leaf1.clone();
    leaf2.scale.set(0.8, 0.8, 0.8);
    leaf2.position.set(22, 12, 0); // Position above the first leaf
    leaf2.castShadow = true; // Enable shadows for the leaves
    leaf2.receiveShadow = true; // Enable shadows for the leaves
    scene.add(leaf2);

    const leaf3 = leaf1.clone();
    leaf3.scale.set(0.6, 0.6, 0.6);
    leaf3.position.set(22, 14, 0); // Position above the second leaf
    leaf3.castShadow = true; // Enable shadows for the leaves
    leaf3.receiveShadow = true; // Enable shadows for the leaves
    scene.add(leaf3);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(30, 3, -20); 
    torus.castShadow = true;
    torus.receiveShadow = true;
    scene.add(torus);

    // Dodecahedron
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(2);
    const dodecahedronMaterial = new THREE.MeshStandardMaterial({ color: 0x8A2BE2 });
    const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
    dodecahedron.position.set(35, 4, -20); 
    dodecahedron.castShadow = true;
    dodecahedron.receiveShadow = true;
    scene.add(dodecahedron);

    // Tetrahedron
    const tetrahedronGeometry = new THREE.TetrahedronGeometry(2);
    const tetrahedronMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
    tetrahedron.position.set(40, 4, -20); 
    tetrahedron.castShadow = true;
    tetrahedron.receiveShadow = true;
    scene.add(tetrahedron);

    // Add fog to the main scene
    const color = 0xFFFFFF;  // white
    const density = 0.03; // Increase the density 
    const near = 10;
    const far = 100;
    scene.fog = new THREE.FogExp2(color, density);

    // Create a canvas element for the billboard
    const billboardCanvas = document.createElement('canvas');
    billboardCanvas.width = 450;
    billboardCanvas.height = 128;
    const context = billboardCanvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, billboardCanvas.width, billboardCanvas.height);
    context.fillStyle = 'black';
    context.font = '48px Arial';
    context.fillText('Legendary Duck', 10, 64);

    // Create a texture from the canvas
    const billboardTexture = new THREE.CanvasTexture(billboardCanvas);

    // Create a plane geometry for the billboard
    const billboardGeometry = new THREE.PlaneGeometry(5, 2.5);
    const billboardMaterial = new THREE.MeshBasicMaterial({ map: billboardTexture, side: THREE.DoubleSide });
    const billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);

    // Position the billboard on the pedestal
    billboard.position.set(5, 3, 2.6); // Adjust the position as needed
    scene.add(billboard);


    // Position the camera
    camera.position.z = 5;

    // Create an animation loop
    function animate() {
        requestAnimationFrame(animate);


        updateSpotLight();

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        if (duck) { // Check if the bird object is loaded
            // duck.rotation.x += 0.01;
            duck.rotation.z += 0.03;
        
        }
        controls.update(); // Update controls

        // Render the skybox scene without fog
        renderer.autoClear = false; 
        renderer.clear();
        renderer.render(skyboxScene, camera); 

                
        renderer.render(scene, camera);
    }

    // Start the animation loop
    animate();
});

