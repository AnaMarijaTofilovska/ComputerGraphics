import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { WorldChunk } from './worldChunk';
import { Player } from './player';
import { createUI } from './ui';
import { or } from 'three/tsl';
import { Physics } from './physics';
import {World } from './world';
import { blocks } from './blocks.js';
import { ModelLoader } from './modelLoader.js';
import { Tool } from './tool';



// UI Setup
const stats = new Stats();
document.body.appendChild(stats.dom);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x80a0e0);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);


//Camera setup 
const orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
orbitCamera.position.set(-32,16,-32);

//Enabling rotation by mouse and zoom in/out
const controls = new OrbitControls(orbitCamera, renderer.domElement);
controls.target.set(16,0,16);
controls.update();


//Scene setup and world cration
const scene = new THREE.Scene();
scene.fog= new THREE.Fog(0x80a0e0, 50,100);
const world= new World();
world.generate();
scene.add(world);





//Creating instance of player
const player=new Player(scene);
const physics=new Physics(scene);

const modelLoader=new ModelLoader();
modelLoader.loadModels((models)=>{
    //Add the model to player
    //set mesh to tool 
    player.tool.setMesh(models.pickaxe);
 

});


const sun= new THREE.DirectionalLight();
//Lights setup
function setupLights(){
   
    sun.position.set(50,50,50);
    sun.castShadow=true;
    sun.shadow.camera.left=-100;
    sun.shadow.camera.right=100;
    sun.shadow.camera.bottom=-100;
    sun.shadow.camera.top=100;
    sun.shadow.camera.near=0.1;
    sun.shadow.camera.far=200;
    sun.shadow.bias=-0.0001;
    sun.shadow.mapSize=new THREE.Vector2(2048,2048);

    scene.add(sun);
    scene.add(sun.target);

    //const shadowHelper=new THREE.CameraHelper(sun.shadow.camera);
    //scene.add(shadowHelper);

    const ambient= new THREE.AmbientLight();
    ambient.intensity=0.1;
    scene.add(ambient);
}

function onMouseDown(event){
    if(player.controls.isLocked && player.selectedCoords ){
        if(player.activeBlockId===blocks.empty.id){
        console.log(`Removing blocks at ${JSON.stringify(player.selectedCoords)}`)
        world.removeBlock(
           player.selectedCoords.x,
           player.selectedCoords.y,
           player.selectedCoords.z
        );
        player.tool.startAnimation();
    }
    else{
        console.log(`Add block at ${JSON.stringify(player.selectedCoords)}`)
    world.addBlock(
       player.selectedCoords.x,
       player.selectedCoords.y,
       player.selectedCoords.z,
       player.activeBlockId
    );
        

    }
    }
}
document.addEventListener('mousedown',onMouseDown);

let previousTime=performance.now();
//Render loop
function animate(){
    let currentTime=performance.now();
    let dt= (currentTime- previousTime) / 1000;

    requestAnimationFrame(animate);

    if(player.controls.isLocked){
        physics.update(dt,player,world); //passing physics
        player.update(world);
        world.update(player);

        sun.position.copy(player.position);
        sun.position.sub(new THREE.Vector3(-50,-50,-50));
        sun.target.position.copy(player.position);
    }
  
   
    renderer.render(scene,player.controls.isLocked ? player.camera: orbitCamera ); //we use the player camera
    stats.update(); 

    previousTime=currentTime; 
}


// Resizing the window
window.addEventListener('resize', () => {
    // Resize camera aspect ratio and renderer size to the new window size
    orbitCamera.aspect = window.innerWidth / window.innerHeight;
    orbitCamera.updateProjectionMatrix();

    player.camera.aspect = window.innerWidth / window.innerHeight;
    player.camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);


  });


  setupLights();
  createUI(scene,world,player);
  animate();