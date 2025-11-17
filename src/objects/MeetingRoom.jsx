import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createMeetingRoom() {
    var toLoad = new THREE.Group();

    // We load each element of our meeting room
    const loader = new GLTFLoader();

    // We load each desk and chair for both row of tables
    for (let i=0; i<5; i++) {
        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(i*1.6, 0, -2.4);
            toLoad.add(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(i*1.6, -0.35, -3);
            toLoad.add(chair);
        });

        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(i*1.6, 0, 2.4);
            toLoad.add(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(i*1.6, -0.35, 3);
            chair.rotation.y = Math.PI;
            toLoad.add(chair);
        });
    }
    // We load the last row of tables
    for (let i=0; i<3; i++) {
        loader.load('./assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.rotation.y = Math.PI/2;
            desk.position.set(7.6, 0, -1.65+i*1.6);
            toLoad.add(desk);
        });
        loader.load('./assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(8.2, -0.35, -1.65+i*1.6);
            chair.rotation.y = -Math.PI/2;
            toLoad.add(chair);
        });
    }
    // We load the projector screen
    loader.load('./assets/models/ProjectorScreen.glb', (gltf) => {
        const proj = gltf.scene;
        proj.scale.set(2, 3, 4);
        proj.position.set(-4.1, 2, 0);
        toLoad.add(proj);
    });
    // We load one person
    loader.load('./assets/models/BusinessMan.glb', (gltf) => {
        const employee = gltf.scene;
        employee.scale.set(1.3, 1.3, 1.3);
        employee.position.set(-3, -0.35, -2);
        toLoad.add(employee);
    });

    const wallTexture = new THREE.TextureLoader().load('./assets/textures/painted_plaster.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 4);
    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture});
    const wallBack = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 5),
      wallMaterial
    );
    wallBack.position.set(3.2, 2.1, -7.5);
    toLoad.add(wallBack);

    const wallFront = wallBack.clone();
    wallFront.position.z = 5;
    wallFront.rotation.y = Math.PI;
    toLoad.add(wallFront);

    const wallLeft = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 5),
      wallMaterial
    );
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-4.3, 2.1, -1.25);
    toLoad.add(wallLeft);

    const wallRight = wallLeft.clone();
    wallRight.rotation.y = -Math.PI / 2;
    wallRight.position.set(10.7, 2.1, -1.25);
    toLoad.add(wallRight);

  return toLoad;
}
