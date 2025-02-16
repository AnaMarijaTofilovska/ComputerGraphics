//HERE WE KEEP THE CHANGES WE MAKE TO THE WORLD , LIKE THE THINGS WE BUILD
export class DataStore {
    constructor() {
      // Object to store placed blocks using unique keys
      this.data = {};
    }

    // Clears all stored block data (resets the world changes)
    clear() {
      this.data = {};
    }

    // Checks if a block exists at the given coordinates
    contains(chunkX, chunkZ, blockX, blockY, blockZ) {
      const key = this.#getKey(chunkX, chunkZ, blockX, blockY, blockZ);
      return this.data[key] !== undefined;
    }
  
    // Retrieves the block ID at the given coordinates (returns undefined if no block is set)
    get(chunkX, chunkZ, blockX, blockY, blockZ) {
      const key = this.#getKey(chunkX, chunkZ, blockX, blockY, blockZ);
      const blockId = this.data[key];
      return blockId; 
    }  
  
    // Stores a block ID at the given coordinates
    set(chunkX, chunkZ, blockX, blockY, blockZ, blockId) {
      const key = this.#getKey(chunkX, chunkZ, blockX, blockY, blockZ);
      this.data[key] = blockId;
      console.log(`setting key ${key} to ${blockId}`);
    }
  
     // Generates a unique key for each block based on its position in the world
    #getKey(chunkX, chunkZ, blockX, blockY, blockZ) {
      return `${chunkX},${chunkZ},${blockX},${blockY},${blockZ}`;
    } 
  }