import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(1, 1, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

// Textures
const textureLoader = new THREE.TextureLoader();
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.position.set(2, 2, -1);
scene.add(directionalLight);

// Helper for Directional Light (White)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2, 0xffffff);
scene.add(directionalLightHelper);

// Directional Light Shadow Camera Helper (White)
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.material.color.set(0xffffff);
scene.add(directionalLightCameraHelper);

const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

// Helper for Point Light (White)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2, 0xffffff);
scene.add(pointLightHelper);

// Point Light Shadow Camera Helper (White)
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.material.color.set(0xffffff);
scene.add(pointLightCameraHelper);

// Material (Gray/White for cube and plane)
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.7, metalness: 0 });
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.8, metalness: 0 });

// Objects
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), cubeMaterial);
cube.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

const cubeShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
    })
);
cubeShadow.rotation.x = -Math.PI * 0.5;
cubeShadow.position.y = plane.position.y + 0.01;

scene.add(cube, cubeShadow, plane);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Resize handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Cube animation
    cube.position.x = Math.cos(elapsedTime) * 1.5;
    cube.position.z = Math.sin(elapsedTime) * 1.5;
    cube.position.y = Math.abs(Math.sin(elapsedTime * 3));

    // Shadow animation
    cubeShadow.position.x = cube.position.x;
    cubeShadow.position.z = cube.position.z;
    cubeShadow.material.opacity = (1 - cube.position.y) * 0.3;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
