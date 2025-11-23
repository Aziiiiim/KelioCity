import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createOpenspace(x,z, nb_desks) {
  const elements = new THREE.Group();
  x += 1.28;
  z += 1.35;

  // We load each element of our openspace desks
  const loader = new GLTFLoader();

  // First external wall of the first desk
  let fst_wall_between = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 2),
      new THREE.MeshPhongMaterial({color: 0xdedede, side: THREE.DoubleSide })
  );
  fst_wall_between.position.set(x+1.9 + 2.55 * -1, 1, z+0.37);
  fst_wall_between.rotation.y = Math.PI / 2;
  elements.add(fst_wall_between);
  // For each desk, we load the desk, its computer, its chair and the wall between 2 desks
  for (let i=0; i<nb_desks; i++) {
    for (let j=-1; j<1; j++) {
      loader.load('./assets/models/Desk.glb', (gltf) => {
        const desk = gltf.scene;
        desk.scale.set(2, 2, 2);
        desk.position.set(x+2.52 * i - j*1.28, 0, z+1+j*1.25);
        desk.rotation.y = Math.PI * j;
        elements.add(desk);
      });
      loader.load('./assets/models/Computer.glb', (gltf) => {
        const computer = gltf.scene;
        computer.scale.set(0.002, 0.002, 0.002);
        computer.position.set(x+2.52 * i - j*0.7 + 0.3, 0.87, z+1+j*1.25);
        computer.rotation.y = Math.PI * j;
        elements.add(computer);
      });
      loader.load('./assets/models/OpenChair.glb', (gltf) => {
        const chair = gltf.scene;
        chair.scale.set(1.5, 1.5, 1.5);
        chair.position.set(x+2.52 * i - j*0.5 + 0.4, 0.5, z+2.3+j*3.85);
        chair.rotation.y = Math.PI * (1+j);
        elements.add(chair);
      });
    }
    let wall_between = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 2),
        new THREE.MeshPhongMaterial({color: 0xdedede, side: THREE.DoubleSide })
    );
    wall_between.position.set(x+1.9 + 2.52 * i, 1, z+0.37);
    wall_between.rotation.y = Math.PI / 2;
    elements.add(wall_between);
  }
  // Wall between 2 rows of desks
  let wall_long = new THREE.Mesh(
      new THREE.PlaneGeometry(nb_desks*2.52, 2),
      new THREE.MeshPhongMaterial({color: 0xdedede, side: THREE.DoubleSide })
  );
  wall_long.position.set(x+nb_desks*1.26-0.6, 1, z+0.37);
  elements.add(wall_long);

  return elements;
};
