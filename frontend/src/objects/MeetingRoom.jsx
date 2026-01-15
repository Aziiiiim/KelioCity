import * as THREE from 'three';
import { makeInstance, loadTexture } from '../utils/asset.js';
import {createHighlighter} from "../utils/highlight.js";

export function createMeetingRoom(initDoor) {
    const elements = new THREE.Group();
    let  x = 4.3;
    let z = 6;

    // We load each desk and chair for both row of tables
    for (let i=0; i<5; i++) {
        makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
            desk.scale.set(1, 1, 1);
            desk.position.set(x + i * 1.6, 0.35, z - 2.4);
            elements.add(desk);
        });

        makeInstance('/assets/models/OfficeChair.glb').then((chair) => {
            chair.scale.set(1, 1, 1);
            chair.position.set(x + i * 1.6, 0, z - 3);
            elements.add(chair);
        });

        // Row 2 (z + 2.4 / chairs z + 3)
        makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
            desk.scale.set(1, 1, 1);
            desk.position.set(x + i * 1.6, 0.35, z + 2.4);
            elements.add(desk);
        });

        makeInstance('/assets/models/OfficeChair.glb').then((chair) => {
            chair.scale.set(1, 1, 1);
            chair.position.set(x + i * 1.6, 0, z + 3);
            chair.rotation.y = Math.PI;
            elements.add(chair);
        });
    }
    // We load the last row of tables
    for (let i=0; i<3; i++) {
        makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
            desk.scale.set(1, 1, 1);
            desk.rotation.y = Math.PI/2;
            desk.position.set(x+7.6, 0.35, z-1.65+i*1.6);
            elements.add(desk);
        });
        makeInstance('/assets/models/OfficeChair.glb').then((chair) => {
            chair.scale.set(1, 1, 1);
            chair.position.set(x+8.2, 0, z-1.65+i*1.6);
            chair.rotation.y = -Math.PI/2;
            elements.add(chair);
        });
    }
    // Projector screen
    makeInstance('/assets/models/ProjectorScreen.glb').then((proj) => {
        proj.scale.set(2, 3, 4);
        proj.position.set(x - 4.1, 2.35, z);
        elements.add(proj);
    });

    // Door (avec cache)
    let doorPivot = null;
    let doorOpen = false;
    let doorProgress = 0;
    makeInstance('/assets/models/door.glb').then((doorObj) => {
        doorObj.scale.set(4, 4, 4);

        doorPivot = new THREE.Group();
        doorPivot.position.set(x + 10.7, 1.5, z - 5.88);

        // même offset que toi
        doorObj.position.set(-0.88, 0, 0);

        doorPivot.add(doorObj);
        doorPivot.rotation.y = Math.PI / 2;

        elements.add(doorPivot);
        initDoor(doorPivot, toggleDoor);
    });

    loadTexture('/assets/textures/painted_plaster.jpg').then((wallTexture) => {
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

        /*const wallRight = wallLeft.clone();
        wallRight.rotation.y = Math.PI/2;
        wallRight.position.set(x+10.7, 2.45, z);
        elements.add(wallRight);*/
        const wallRight1 = new THREE.Mesh(
        new THREE.PlaneGeometry(10.3, 5),
        wallMaterial
        );
        wallRight1.rotation.y = Math.PI/2;
        wallRight1.position.set(x+10.7, 2.45, z+0.85);
        elements.add(wallRight1);
        const wallRight2 = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 1.9),
        wallMaterial
        );
        wallRight2.rotation.y = Math.PI/2;
        wallRight2.position.set(x+10.7, 4, z-5.1);
        elements.add(wallRight2);
        const wallRight3 = new THREE.Mesh(
        new THREE.PlaneGeometry(0.1, 5),
        wallMaterial
        );
        wallRight3.rotation.y = Math.PI/2;
        wallRight3.position.set(x+10.7, 2.45, z-5.95);
        elements.add(wallRight3);
    });

    function openDoor(delta) {
        if (!doorPivot) return; // porte pas encore chargée

        const target = doorOpen ? 1 : 0;

        doorProgress += (target - doorProgress) * delta;
        doorProgress = THREE.MathUtils.clamp(doorProgress, 0, 1);

        doorPivot.rotation.y = (1-doorProgress) * Math.PI / 2;
    }
    function toggleDoor() {
        doorOpen = !doorOpen;
    }


    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);

    const endX = x+10.7;
    const endZ = z+6;

    elements.focusPosition = new THREE.Vector3(0, 9, 4);
    return {elements, endX, endZ, openDoor, doorPivot };
}
