import * as THREE from 'three';
import floorDiffuseUrl from '/assets/textures/laminate_floor.jpg';
import {loadTexture } from '../utils/asset.js';


export function createGround(lengthX, lengthZ){
  const material = new THREE.MeshPhongMaterial();

  loadTexture(floorDiffuseUrl).then((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(lengthX, lengthZ);
    material.map = texture;
    material.needsUpdate = true;
  });

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(lengthX, lengthZ), material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}