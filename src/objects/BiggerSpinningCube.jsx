import * as THREE from 'three';
import diamondURL from '/assets/textures/diamond.png';

export function createBiggerSpinningCube() {
  const geometry = new THREE.BoxGeometry(6, 6, 6);
  const texture = new THREE.TextureLoader().load(diamondURL);
  const material = new THREE.MeshBasicMaterial({map:texture});
  const mesh = new THREE.Mesh(geometry, material);
  
  function update() {
    //mesh.rotation.x += 0.01 ;
    //mesh.rotation.y += 0.01 ;
  }

  mesh.position.x = -3 ;
  mesh.position.y = -3 ;
  mesh.position.z = -3 ;
  

  return { mesh, update };
}