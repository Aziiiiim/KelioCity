import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createMeetingRoom() {
    var toLoad = [];

    // We load each element of our meeting room
    const loader = new GLTFLoader();

    // We load each desk and chair for both row of tables
    for (let i=0; i<5; i++) {
        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(i*1.6, 0, -2.4);
            toLoad.push(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(i*1.6, -0.35, -3);
            toLoad.push(chair);
        });

        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(i*1.6, 0, 2.4);
            toLoad.push(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(i*1.6, -0.35, 3);
            chair.rotation.y = Math.PI;
            toLoad.push(chair);
        });
    }
    // We load the last row of tables
    for (let i=0; i<3; i++) {
        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.rotation.y = Math.PI/2;
            desk.position.set(7.6, 0, -1.65+i*1.6);
            toLoad.push(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(8.2, -0.35, -1.65+i*1.6);
            chair.rotation.y = -Math.PI/2;
            toLoad.push(chair);
        });
    }
    // We load the projector screen
    loader.load('./assets/models/ProjectorScreen.glb', (gltf) => {
        const proj = gltf.scene;
        proj.scale.set(2, 3, 4);
        proj.position.set(-4.1, 2, 0);
        toLoad.push(proj);
    });
    // We load one person
    loader.load('./assets/models/BusinessMan.glb', (gltf) => {
        const employee = gltf.scene;
        employee.scale.set(1.3, 1.3, 1.3);
        employee.position.set(-3, -0.35, -2);
        toLoad.push(employee);
    });

    const wallTexture = new THREE.TextureLoader().load('./assets/textures/painted_plaster.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 4);
    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
    const wallBack = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 5),
      wallMaterial
    );
    wallBack.position.set(3.2, 2.1, -7.5);
    toLoad.push(wallBack);

    const wallFront = wallBack.clone();
    wallFront.position.z = 7.5;
    wallFront.rotation.y = Math.PI;
    toLoad.push(wallFront);

    const wallLeft = wallBack.clone();
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-4.3, 2.1, 0);
    toLoad.push(wallLeft);

    const wallRight = wallBack.clone();
    wallRight.rotation.y = -Math.PI / 2;
    wallRight.position.set(10.7, 2.1, 0);
    toLoad.push(wallRight);
  return toLoad;
}
