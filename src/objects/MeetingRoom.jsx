import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createMeetingRoom(x,z) {
    const elements = new THREE.Group();
    x = x+4.3;
    z = z+6;

    // We load each element of our meeting room
    const loader = new GLTFLoader();

    // We load each desk and chair for both row of tables
    for (let i=0; i<5; i++) {
        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(x+i*1.6, 0.35, z-2.4);
            elements.add(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(x+i*1.6, 0, z-3);
            elements.add(chair);
        });

        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(x+i*1.6, 0.35, z+2.4);
            elements.add(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(x+i*1.6, 0, z+3);
            chair.rotation.y = Math.PI;
            elements.add(chair);
        });
    }
    // We load the last row of tables
    for (let i=0; i<3; i++) {
        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.rotation.y = Math.PI/2;
            desk.position.set(x+7.6, 0.35, z-1.65+i*1.6);
            elements.add(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(x+8.2, 0, z-1.65+i*1.6);
            chair.rotation.y = -Math.PI/2;
            elements.add(chair);
        });
    }
    // We load the projector screen
    loader.load('./assets/models/ProjectorScreen.glb', (gltf) => {
        const proj = gltf.scene;
        proj.scale.set(2, 3, 4);
        proj.position.set(x-4.1, 2.35, z);
        elements.add(proj);
    });
    // We load one person
    loader.load('./assets/models/BusinessMan.glb', (gltf) => {
        const employee = gltf.scene;
        employee.scale.set(1.3, 1.3, 1.3);
        employee.position.set(x-3, 0, z-2);
        elements.add(employee);
    });

    const wallTexture = new THREE.TextureLoader().load('./assets/textures/painted_plaster.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 4);
    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture, side: THREE.DoubleSide });
    const wallBack = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 5),
      wallMaterial
    );
    wallBack.position.set(x+3.2, 2.45, z-6);
    elements.add(wallBack);

    const wallFront = wallBack.clone();
    wallFront.position.z = z+6;
    wallFront.rotation.y = Math.PI;
    elements.add(wallFront);

    const wallLeft = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 5),
      wallMaterial
    );
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(x-4.3, 2.45, z);
    elements.add(wallLeft);

    const wallRight = wallLeft.clone();
    wallRight.rotation.y = Math.PI/2;
    wallRight.position.set(x+10.7, 2.45, z);
    elements.add(wallRight);

  const endX = x+10.7;
  const endZ = z+6;
  return {elements, endX, endZ};
}
