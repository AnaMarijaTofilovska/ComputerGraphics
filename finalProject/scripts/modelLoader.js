// HERE WE LOAD THE 3D MODELS IN OUR GAME 

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelLoader {
  // Create a new instance of the GLTFLoader to load 3D models
  loader = new GLTFLoader();

  // Object to store loaded models
  models = {
    pickaxe: undefined
  };


  // Function to load models into memory
  loadModels(onLoad) {
    this.loader.load('./models/pickaxe.glb', (model) => {
      const mesh = model.scene; // Extract the scene (3D object) from the loaded model
      this.models.pickaxe = mesh; // Store the pickaxe model
      onLoad(this.models); // Call the provided function once loading is complete
    });
  }
}