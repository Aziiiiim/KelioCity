import * as THREE from 'three';
import diamondURL from '/assets/textures/diamond.png';
export function createSpinningCube() {
  const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const texture = new THREE.TextureLoader().load(diamondURL);
  const material = new THREE.MeshBasicMaterial({map:texture});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0.3,0.7,-2.3);

  function update() {
    mesh.rotation.y += 0.01 ;
  }

  return { mesh, update };
}
