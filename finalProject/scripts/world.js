//HERE WE CREATE BUNCH OF WORLD THREE JS OBJECTS 
import * as THREE from 'three';
import {WorldChunk} from './worldChunk';
import { blocks } from './blocks.js';
import { DataStore } from './dataStore';


export class World extends THREE.Group{

    //Whether or not we want to load chunks asynchronously 
    asyncLoading=true;
    //number of chunks to render around the player.
    //When this is set to 0, the chunk the player is on  is the only one that is rendered.
    // If it is set to 1, the adjacent chunks are rendered;
    // if set to 2, thechunks adjacent to those are rendered, and so on.

  drawDistance = 3;

    chunkSize={
        width: 64,
         height: 32
        };

     params={
        seed:0,
        terrain:{
            scale:30,       //
            magnitude:0.5,  //size of hills
            offset:0.2      //offset for random number
        }
    };

    dataStore = new DataStore();

    constructor(seed=0){
        super();
        this.seed=seed;
        
      //OPTION TO SAVE  PREVIOUSLY BUILT CITY/DATA
        document.addEventListener('keydown', (ev) => {
          switch (ev.code) {
            case 'F1':
              this.save();
              break;
            case 'F2':
              this.load();
              break;
          }
        });
    }

    // Saves the world data to local storage
    save() {
      localStorage.setItem('minecraft_params', JSON.stringify(this.params));
      localStorage.setItem('minecraft_data', JSON.stringify(this.dataStore.data));
      document.getElementById('status').innerHTML = 'GAME SAVED';
      setTimeout(() => document.getElementById('status').innerHTML = '', 3000);
    }

  // Loads the game from disk
    load() {
      this.params = JSON.parse(localStorage.getItem('minecraft_params'));
      this.dataStore.data = JSON.parse(localStorage.getItem('minecraft_data'));
      document.getElementById('status').innerHTML = 'GAME LOADED';
      setTimeout(() => document.getElementById('status').innerHTML = '', 3000);
      this.generate();
    }
    


    //Regenerate the world data model and the meshes
    generate(clearCache=false){
        if(clearCache){
        this.disposeChunks();
        }

        for(let x=-this.drawDistance;x<=this.drawDistance;x++){
            for(let z=-this.drawDistance;z<=this.drawDistance;z++){
                const chunk= new WorldChunk(this.chunkSize,this.params, this.dataStore);
                chunk.position.set(x* this.chunkSize.width,0, z* this.chunkSize.width);
                chunk.userData={x,z};
                chunk.generate();
                this.add(chunk);
            }
        }
    }

    //Updates the visible portions of the world based on the current player position
    update(player) {
        //1.Find visible chunks based on players current position
        const visibleChunks = this.getVisibleChunks(player);
       // 2. Compare with the current set of chunks
        const chunksToAdd = this.getChunksToAdd(visibleChunks);
        //3. Remove chunks that are no longer visible
       this.removeUnusedChunks(visibleChunks);
      
    
       // 4.Add new chunks that came into view
       for (const chunk of chunksToAdd) {
         this.generateChunk(chunk.x, chunk.z);
        }
      }

      //Returns an array containing the coordinates of the chunks that  are currently visible to the player
      getVisibleChunks(player) {
        const visibleChunks = [];
    
        const coords = this.worldToChunkCoords(
          player.position.x,
          player.position.y,
          player.position.z
        );
    

       const chunkX = coords.chunk.x;
       const chunkZ = coords.chunk.z;
    
       for (let x = chunkX - this.drawDistance; x <= chunkX + this.drawDistance; x++) {
        for (let z = chunkZ - this.drawDistance; z <= chunkZ + this.drawDistance; z++) {
         visibleChunks.push({ x, z });
         }
        }
    
        return visibleChunks;
      }

      // Returns an array containing the coordinates of the chunks that are not yet loaded and need to be added to the scene
      getChunksToAdd(visibleChunks) {
        // Filter visible chunks to those not already in the world
        return visibleChunks.filter((chunk) => {
          const chunkExists = this.children
            .map((obj) => obj.userData)
            .find(({ x, z }) => (
              chunk.x === x && chunk.z === z
            ));
    
          return !chunkExists;
        })
      }

      //Find and Removes current loaded chunks that are no longer visible to the player
      removeUnusedChunks(visibleChunks) {
        // Filter down the visible chunks to those not already in the world
        const chunksToRemove = this.children.filter((chunk) => {
          const { x, z } = chunk.userData;
          const chunkExists = visibleChunks
            .find((visibleChunk) => (
              visibleChunk.x === x && visibleChunk.z === z
            ));
    
          return !chunkExists;
        });
    
        for (const chunk of chunksToRemove) {
          chunk.disposeInstances();
          this.remove(chunk);
          console.log(`Removing chunk at X: ${chunk.userData.x} Z: ${chunk.userData.z}`);
        }
      }

      //Generates the chunk at the (x, z) coordinates
      generateChunk(x, z) {
        const chunk = new WorldChunk(this.chunkSize, this.params, this.dataStore);
        chunk.position.set(
          x * this.chunkSize.width * 1.01,
          0,
          z * this.chunkSize.width * 1.01);
        chunk.userData = { x, z };
    
       if (this.asyncLoading) {
         requestIdleCallback(chunk.generate.bind(chunk), { timeout: 1000 });
        } else {
        chunk.generate();
        }
    
        this.add(chunk);
        console.log(`Adding chunk at X: ${x} Z: ${z}`);
      }


    //Get block data at xyz
    getBlock(x, y, z) {
        const coords = this.worldToChunkCoords(x, y, z);
        const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    
        if (chunk && chunk.loaded) {
          return chunk.getBlock(
            coords.block.x,
            coords.block.y,
            coords.block.z
          );
        }
         else {
          return null;
        }
      }

    // Returns the coordinates of the block at world (x,y,z)
    // `chunk` is the coordinates of the chunk containing the block
    // `block` is the coordinates of the block relative to the chunk
    worldToChunkCoords(x, y, z) {
        const chunkCoords = {
          x: Math.floor(x / this.chunkSize.width),
          z: Math.floor(z / this.chunkSize.width)
        };
    
        const blockCoords = {
          x: x - this.chunkSize.width * chunkCoords.x,
          y,
          z: z - this.chunkSize.width * chunkCoords.z
        };
    
        return {
          chunk: chunkCoords,
          block: blockCoords
        }
      }

    //Returns the WorldChunk object at the specified coordinates
    getChunk(chunkX, chunkZ) {
        return this.children.find((chunk) => (
          chunk.userData.x === chunkX &&
          chunk.userData.z === chunkZ
        ));
      }
    
    disposeChunks() {
        this.traverse((chunk) => {
          if (chunk.disposeInstances) {
            chunk.disposeInstances();
          }
        });
        this.clear();
      }

      //Adds a new block at xyz of type blockId
      addBlock(x, y, z, blockId) {
        const coords = this.worldToChunkCoords(x, y, z);
        const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    
        if (chunk) {
          chunk.addBlock(
            coords.block.x,
            coords.block.y,
            coords.block.z,
            blockId
          );
    
          // Hide neighboring blocks if they are completely obscured
          this.hideBlock(x - 1, y, z);
          this.hideBlock(x + 1, y, z);
          this.hideBlock(x, y - 1, z);
          this.hideBlock(x, y + 1, z);
          this.hideBlock(x, y, z - 1);
          this.hideBlock(x, y, z + 1);
        }
      }

      //Removes the block at xyz and set it to emptu
      removeBlock(x, y, z) {
        const coords = this.worldToChunkCoords(x, y, z);
        const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    
        // Don't allow removing the first layer of blocks
       if (coords.block.y === 0) return;
    
        if (chunk) {
          console.log(coords);
          chunk.removeBlock(
            coords.block.x,
            coords.block.y,
            coords.block.z
          );
    
          // Reveal adjacent neighbors if they are hidden
          this.revealBlock(x - 1, y, z);
          this.revealBlock(x + 1, y, z);
          this.revealBlock(x, y - 1, z);
          this.revealBlock(x, y + 1, z);
          this.revealBlock(x, y, z - 1);
          this.revealBlock(x, y, z + 1); 
        }
      }

      //Reveals the block at (x,y,z) by adding a new mesh instance
      revealBlock(x, y, z) {
        const coords = this.worldToChunkCoords(x, y, z);
        const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    
        if (chunk) {
          chunk.addBlockInstance(
            coords.block.x,
            coords.block.y,
            coords.block.z
          )
        }
      }

      //Hides block at xyz by removing mesh instance
      hideBlock(x, y, z) {
        const coords = this.worldToChunkCoords(x, y, z);
        const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    
        if (chunk && chunk.isBlockObscured( coords.block.x,  coords.block.y,  coords.block.z)) {
          chunk.deleteBlockInstance(
            coords.block.x,
            coords.block.y,
            coords.block.z
          )
        }
      }
    
}