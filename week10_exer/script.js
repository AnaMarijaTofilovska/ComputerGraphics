// Import Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Add fog
scene.fog = new THREE.FogExp2('#262837', 0.4);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Materials
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.8 });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.4 });
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.4 });
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.4 });

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), sphereMaterial);
sphere.position.set(0, 0.5, 0);
sphere.castShadow = true;
scene.add(sphere);

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), planeMaterial);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = 0;
plane.receiveShadow = true;
scene.add(plane);

// Cube
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial);
cube.position.set(2, 0.5, 0);
cube.castShadow = true;
scene.add(cube);

// Cone
const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 32), coneMaterial);
cone.position.set(-2, 0.5, 0);
cone.castShadow = true;
scene.add(cone);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 4, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.radius = 10;
scene.add(directionalLight);

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI * 0.3);
spotLight.position.set(0, 2, 2);
spotLight.castShadow = true;
scene.add(spotLight);

// Spot Light Helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(1, 2, 5);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation loop
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Move objects
    sphere.position.x = Math.sin(elapsedTime) * 1.5;
    sphere.position.z = Math.cos(elapsedTime) * 1.5;
    cube.position.x = Math.cos(elapsedTime) * 1.5;
    cube.position.z = Math.sin(elapsedTime) * 1.5;
    cone.position.x = Math.sin(elapsedTime + Math.PI) * 1.5;
    cone.position.z = Math.cos(elapsedTime + Math.PI) * 1.5;

    // Ensure objects stay on the plane
    sphere.position.y = 0.5;
    cube.position.y = 0.5;
    cone.position.y = 0.5;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

tick();
