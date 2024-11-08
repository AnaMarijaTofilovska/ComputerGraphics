// First, I import the essential libraries from THREE.js to help me create my 3D scene.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// I start by creating a new scene where I can add all my 3D objects.
const scene = new THREE.Scene();
// I set the background color of the scene to white.
scene.background = new THREE.Color(0xFFFFFF);

// Next, I make a camera for the perspective view of my scene.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Now, I set up the renderer to display everything in my scene.
const renderer = new THREE.WebGLRenderer();
// I adjust the renderer size to fit the entire window.
renderer.setSize(window.innerWidth, window.innerHeight);
// I add the renderer to the HTML document so I can see my scene.
document.getElementById('canvas-container').appendChild(renderer.domElement);

// To make navigating the scene easier, I create orbit controls for my camera.
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // This makes the camera movement smoother.
controls.dampingFactor = 0.25; // I set the smoothness of movement.
controls.enableZoom = true; // This allows me to zoom in and out with the camera.


// I create a function to add edges to any mesh I make, which helps with visibility.
function createEdges(mesh, color) {
    const edges = new THREE.EdgesGeometry(mesh.geometry); // I get the edges of the mesh.
    const edgeMaterial = new THREE.LineBasicMaterial({ color: color }); // I create a material for the edges.
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial); // I make the edge lines.
    mesh.add(edgeLines); // I add the edge lines to the mesh.
}

// I start building the scene by creating a grass plane to act as the ground.
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x4CAF50 }); // I choose a green material for the grass.
const grassPlane = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 10), grassMaterial); // I create a flat box to represent the grass.
grassPlane.position.y = -0.05; // I position it slightly below center.
scene.add(grassPlane); // I add the grass plane to my scene.
createEdges(grassPlane, 0x888888); // I add edges to the grass for better visibility.

// Next, I create the first road using a dark gray color.
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x696969 }); // I define a dark gray material for the road.
const roadThickness = 0.08; // I set the thickness of the road.

// Now, I create the first road and position it in the scene.
const road1 = new THREE.Mesh(new THREE.BoxGeometry(10, roadThickness, 1), roadMaterial); // I make a long, flat box for the road.
road1.position.y = roadThickness / 2; // I raise it to ground level.
road1.position.z = 0; // I center it on the Z-axis.
scene.add(road1); // I add the first road to my scene.
createEdges(road1, 0x888888); // I add edges to the road.


// I create a second road that will cross the first road.
const road2 = new THREE.Mesh(new THREE.BoxGeometry(1, roadThickness, 10), roadMaterial); // I make a short, wide box for the second road.
road2.position.y = roadThickness / 2; // I raise it to ground level.
road2.position.x = 0; // I center it on the X-axis.
scene.add(road2); // I add the second road to my scene.
createEdges(road2, 0x888888); // I add edges to the second road.

// Now, I define materials for the buildings.
const lightGrayMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3 }); // I use light gray for regular buildings.
const blueBuildingMaterial = new THREE.MeshBasicMaterial({ color: 0x0056b3 }); // I use dark blue for special buildings.

// I create Building 304 and place it in the scene.
const building304 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 1.5), lightGrayMaterial); // I create Building 304 with light gray material.
building304.position.set(-2, 0.75, 2); // I set its position in the scene.
scene.add(building304); // I add Building 304 to my scene.
createEdges(building304, 0x888888); // I add edges to Building 304 for visibility.

// I create Building 305 and position it next.
const building305 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 1.5), lightGrayMaterial); // I create another building.
building305.position.set(2, 0.75, 2); // I set its position in the scene.
scene.add(building305); // I add Building 305 to my scene.
createEdges(building305, 0x888888); // I add edges to Building 305.


// I create the first blue building and place it in the scene.
const blueBuilding1 = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), blueBuildingMaterial); // I create the first blue building.
blueBuilding1.position.set(2.5, 0.5, -4); // I set its position.
scene.add(blueBuilding1); // I add Blue Building 1 to my scene.
createEdges(blueBuilding1, 0x888888); // I add edges to Blue Building 1.

// I create the second blue building and position it next.
const blueBuilding2 = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), blueBuildingMaterial); // I create the second blue building.
blueBuilding2.rotation.y = Math.PI / 2; // I rotate it to face a different direction.
blueBuilding2.position.set(-1.5, 0.5, -2.5); // I set its position in the scene.
scene.add(blueBuilding2); // I add Blue Building 2 to my scene.
createEdges(blueBuilding2, 0x888888); // I add edges to Blue Building 2.

// Now, I create an animated cylinder to add some motion to the scene.
const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32); // I define the shape of the cylinder.
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 }); // I set the color to orange.
const animatedCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial); // I create the cylinder mesh.
animatedCylinder.position.set(-4, 0.2, 0); // I set the starting position of the cylinder.
scene.add(animatedCylinder); // I add the animated cylinder to my scene.


// Function to animate the cylinder
function animateCylinder() {
    // Move from the start of road1 to the end of road1
    gsap.to(animatedCylinder.position, {
        duration: 3,
        x: 4, // Move to the end of road1
        z: 0, // Stay on road1 (z = 0)
        ease: "power1.inOut",
        onComplete: () => {
            // Move back to the middle of road1
            gsap.to(animatedCylinder.position, {
                duration: 3,
                x: 0, // Go back to the middle of road1
                z: 0, // Stay on road1
                ease: "power1.inOut",
                onComplete: () => {
                    // Move from the middle of road1 to the start of road2
                    gsap.to(animatedCylinder.position, {
                        duration: 3,
                        x: 0, // Stay in the middle of road1
                        z: 4, // Move to the start of road2
                        ease: "power1.inOut",
                        onComplete: () => {
                            // Move to the end of road2
                            gsap.to(animatedCylinder.position, {
                                duration: 3,
                                x: 0, // Stay at the middle (x = 0)
                                z: -4, // Move to the end of road2
                                ease: "power1.inOut",
                                onComplete: () => {
                                    // Move back to the start of road2
                                    gsap.to(animatedCylinder.position, {
                                        duration: 3,
                                        x: 0, // Stay in the middle
                                        z: 0, // Move back to the middle of road1
                                        ease: "power1.inOut",
                                        onComplete: animateCylinder // Loop the animation
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// Start the animation for the cylinder
animateCylinder();




// Next, I set the camera position for a good view of the scene.
camera.position.set(5, 5, 5); // I position the camera.
camera.lookAt(0, 0, 0); // I make it look at the center of the scene.

// I create a loop to render the scene and update the controls.
function animate() {
    requestAnimationFrame(animate); // I request the next animation frame.
    controls.update(); // I update the controls for smooth interaction.
    renderer.render(scene, camera); // I render the scene from the camera's perspective.
}

// I start the animation loop.
animate();

// Finally, I handle window resizing to keep the scene fitting correctly.
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight); // I adjust the renderer size to the new window size.
    camera.aspect = window.innerWidth / window.innerHeight; // I update the camera's aspect ratio.
    camera.updateProjectionMatrix(); // I update the camera's projection matrix to fit the new aspect ratio.
});
