import * as THREE from 'three';
import floorDiffuseUrl from '/assets/textures/laminate_floor.jpg';
import {loadTexture } from '../utils/asset.js';


export function createGround(){
  const material = new THREE.MeshPhongMaterial();

  loadTexture(floorDiffuseUrl).then((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(50, 50);
    material.map = texture;
    material.needsUpdate = true;
  });

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
}