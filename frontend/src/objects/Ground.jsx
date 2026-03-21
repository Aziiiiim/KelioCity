import * as THREE from 'three';
import floorDiffuseUrl from '/assets/textures/laminate_floor.jpg'; // floor texture
import { loadTexture } from '../utils/asset.js';

// create a rectangular floor with texture and holes for stairs
export function createGround(lengthX, lengthZ, holes){
  const material = new THREE.MeshPhongMaterial();

  loadTexture(floorDiffuseUrl).then((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(lengthX, lengthZ);
    material.map = texture;
    material.needsUpdate = true;
  });

  // Create the rectangular shape for the floor
  const shape = new THREE.Shape();
  shape.moveTo(-lengthX/2, -lengthZ/2);
  shape.lineTo(-lengthX/2, lengthZ/2);
  shape.lineTo(lengthX/2, lengthZ/2);
  shape.lineTo(lengthX/2, -lengthZ/2);
  shape.lineTo(-lengthX/2, -lengthZ/2);

  // Add holes for stairs
  for (let hole of holes) {
    shape.holes.push(hole);
  }
  
  const geometry = new THREE.ShapeGeometry(shape);
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}