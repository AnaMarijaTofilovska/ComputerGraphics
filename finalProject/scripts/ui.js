// HERE THE UI-CREATE THE PANEL FOR CONTROLS ON THE GAME
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { resources } from './blocks';



export function createUI(scene,world,player){
    const gui=new GUI();

    const sceneFolder=gui.addFolder('Scene');
    sceneFolder.add(scene.fog,'near',1,200,1).name('Fog Near');
    sceneFolder.add(scene.fog,'far',1,200,1).name('Fog Far');

    const playerFolder=gui.addFolder('Player');
    playerFolder.add(player,'maxSpeed',1,20).name('Max Speed');
    playerFolder.add(player.cameraHelper,'visible').name('Show Camera Helper');


    const terrainFolder= gui.addFolder('Terrain');
    terrainFolder.add(world,'asyncLoading').name('Async Chunk Loading');
    terrainFolder.add(world,'drawDistance', 0,5,1).name('Draw Distance');
    terrainFolder.add(world.params,'seed',0,10000).name('Seed'); //Changes the seed of world
    terrainFolder.add(world.params.terrain,'scale',10,100).name('Scale'); //Changes feature of the world
    terrainFolder.add(world.params.terrain,'magnitude',0,1).name('Magnitude'); // Changes height of hills
    terrainFolder.add(world.params.terrain,'offset',0,1).name('Offset'); //

    const resourcesFolder=gui.addFolder('Resources');

    resources.forEach(resource=>{
        const resourceFolder=resourcesFolder.addFolder(resource.name); //create subfolder for each folder
        resourceFolder.add(resource,'scarcity',0,1).name('Scarcity'); 

        const scaleFolder=resourceFolder.addFolder('Scale');
        scaleFolder.add(resource.scale,'x',10,100).name('X Scale');
        scaleFolder.add(resource.scale,'y',10,100).name('Y Scale');
        scaleFolder.add(resource.scale,'z',10,100).name('Z Scale');

    });
   

    //to automattically change by controls (not clicking generate anymore)
    gui.onChange(()=>{
        world.generate(true);
    });


    
}