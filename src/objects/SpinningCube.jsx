import * as THREE from 'three';
import diamondURL from '/assets/textures/diamond.png';
export function createSpinningCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const texture = new THREE.TextureLoader().load(diamondURL);
  const material = new THREE.MeshBasicMaterial({map:texture});
  const mesh = new THREE.Mesh(geometry, material);

  function update() {
    //mesh.rotation.x += 0.01 ;
    //mesh.rotation.y += 0.01 ;
  }

  return { mesh, update };
}
