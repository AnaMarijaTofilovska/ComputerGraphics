import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(1, 1, 5);
scene.add(camera);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); 
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8); 
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 10, 2); 
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0xffffff, 6, 1, 1); 
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(0xffffff, 4.5, 10, Math.PI * 0.1, 0.25, 1); // White spotlight
spotLight.position.set(0, 2, 3);
spotLight.target.position.set(0, 0, 0);
spotLight.angle = Math.PI * 0.2; // Wider spotlight
scene.add(spotLight);
scene.add(spotLight.target);

// Load the 3D model
const loader = new GLTFLoader();
loader.load(
  '/models/car.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error);
  }
);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
animate();
