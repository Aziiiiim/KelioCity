import * as THREE from 'three';
import floorDiffuseUrl from '/assets/textures/laminate_floor.jpg';
import {loadTexture } from '../utils/asset.js';


export function createGround(lengthX, lengthZ, holes){
  const material = new THREE.MeshPhongMaterial();

  loadTexture(floorDiffuseUrl).then((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(lengthX, lengthZ);
    material.map = texture;
    material.needsUpdate = true;
  });

  // Créer la forme rectangulaire pour le sol
  const shape = new THREE.Shape();
  shape.moveTo(-lengthX/2, -lengthZ/2);
  shape.lineTo(-lengthX/2, lengthZ/2);
  shape.lineTo(lengthX/2, lengthZ/2);
  shape.lineTo(lengthX/2, -lengthZ/2);
  shape.lineTo(-lengthX/2, -lengthZ/2);

  // Ajouter les trous
  for (let hole of holes) {
    shape.holes.push(hole);
  }
  
  const geometry = new THREE.ShapeGeometry(shape);
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}