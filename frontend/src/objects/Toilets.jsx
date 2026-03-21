import * as THREE from 'three';
import {loadTexture, makeInstance} from '../utils/asset.js';

// Toilets room
export function createToilets() {
    
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "Office1DeskB2";

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(6, 3.167);
    loadTexture('/assets/textures/tiles.jpg').then((wallTexture) => {
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(2, 1);
        const floorMaterial = new THREE.MeshPhongMaterial({map: wallTexture, side: THREE.DoubleSide});
        const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);

        floorMesh.rotation.x = Math.PI * -.5;
        floorMesh.position.set(3, 0.01, 1.5835)
        elements.add(floorMesh);
    });

    const wallGeo1 = new THREE.PlaneGeometry(6, 4);
    const wallGeo2 = new THREE.PlaneGeometry(3.167, 4);
    loadTexture('/assets/textures/painted_plaster.jpg').then((wallTexture) => {
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 4);
        const wallMaterial = new THREE.MeshPhongMaterial({map: wallTexture, side: THREE.DoubleSide});


        const wallMesh1 = new THREE.Mesh(wallGeo1, wallMaterial);
        wallMesh1.position.set(3, 2, 0.01);
        elements.add(wallMesh1);

        const wallMesh2 = new THREE.Mesh(wallGeo2, wallMaterial);
        wallMesh2.rotation.y = Math.PI * -.5;
        wallMesh2.position.set(5.99, 2, 1.5835);
        elements.add(wallMesh2);

        const wallFrontLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(1.38, 4),
            wallMaterial
        );
        wallFrontLeft.rotation.y = Math.PI * 0.5;
        wallFrontLeft.position.set(0, 2, 0.7);
        elements.add(wallFrontLeft);
        const wallFrontTop = new THREE.Mesh(
            new THREE.PlaneGeometry(2.3, 0.96),
            wallMaterial
        );
        wallFrontTop.rotation.y = Math.PI * 0.5;
        wallFrontTop.position.set(0, 3.52, 2);
        elements.add(wallFrontTop);
        const wallFrontRight = new THREE.Mesh(
            new THREE.PlaneGeometry(0.18, 4),
            wallMaterial
        );
        wallFrontRight.rotation.y = Math.PI * 0.5;
        wallFrontRight.position.set(0, 2, 3.08);
        elements.add(wallFrontRight);

        const wallMesh4 = new THREE.Mesh(wallGeo1, wallMaterial);
        wallMesh4.rotation.y = Math.PI;
        wallMesh4.position.set(3, 2, 3.167);
        elements.add(wallMesh4);

        const wallFrontLeft2 = new THREE.Mesh(
            new THREE.PlaneGeometry(1.38, 4),
            wallMaterial
        );
        wallFrontLeft2.rotation.y = Math.PI * 0.5;
        wallFrontLeft2.position.set(4, 2, 0.7);
        elements.add(wallFrontLeft2);
        const wallFrontTop2 = new THREE.Mesh(
            new THREE.PlaneGeometry(2.3, 0.96),
            wallMaterial
        );
        wallFrontTop2.rotation.y = Math.PI * 0.5;
        wallFrontTop2.position.set(4, 3.52, 2);
        elements.add(wallFrontTop2);
        const wallFrontRight2 = new THREE.Mesh(
            new THREE.PlaneGeometry(0.18, 4),
            wallMaterial
        );
        wallFrontRight2.rotation.y = Math.PI * 0.5;
        wallFrontRight2.position.set(4, 2, 3.08);
        elements.add(wallFrontRight2);

    });

    let doorPivot = null;
    let doorOpen = false;
    let doorProgress = 0;

    // Bin
    makeInstance('/assets/models/Bin.glb')
        .then((bin) => {
            bin.position.set(0.5, 0.39, 0.5);
            bin.scale.set(0.5, 0.5, 1);
            bin.rotation.y = Math.PI;
            elements.add(bin);
        })
        .catch(console.error);

    // Sink
    makeInstance('/assets/models/Sink.glb')
        .then((sink) => {
            sink.position.set(1.8, 0, 0.3);
            sink.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.set(0xFFFFFF);
                }
            });
            elements.add(sink);
        })
        .catch(console.error);

    // Door toilets
    makeInstance('/assets/models/door.glb')
        .then((doorObj) => {
            doorObj.scale.set(4, 4, 4);
            doorObj.position.set(4, 1.5, 2.25);
            doorObj.rotation.y = Math.PI/2;
            elements.add(doorObj);
        })
        .catch(console.error);

    // Sink
    makeInstance('/assets/models/Toilet.glb')
        .then((toilet) => {
            toilet.position.set(5, 0, 0.9);
            toilet.scale.set(0.15, 0.15, 0.15);
            elements.add(toilet);
        })
        .catch(console.error);

    // PaperTowel
    makeInstance('/assets/models/PaperTowel.glb')
        .then((pt) => {
            pt.position.set(5.74, 1.3, 1.5);
            pt.rotation.y = Math.PI/2;
            pt.scale.set(1.5, 1.5, 1.5);
            elements.add(pt);
        })
        .catch(console.error);

    // WallPaperTowel
    makeInstance('/assets/models/WallPapertowel.glb')
        .then((pt) => {
            pt.position.set(3.22, 1.7, 0.05);
            pt.scale.set(0.7, 0.7, 0.7);
            elements.add(pt);
        })
        .catch(console.error);

    // Door
    makeInstance('/assets/models/door.glb')
        .then((doorObj) => {
            doorObj.scale.set(4, 4, 4);

            doorPivot = new THREE.Group();
            doorPivot.userData.kind = "door";
            doorPivot.userData.action = "toggleDoor";
            doorPivot.userData.toggleDoor = toggleDoor;

            doorPivot.position.set(0, 1.5, 3);
            doorObj.position.set(-0.88, 0, 0);

            doorPivot.add(doorObj);
            doorPivot.rotation.y = Math.PI;

            elements.add(doorPivot);
        })
        .catch(console.error);

    function openDoor(delta) {
        if (!doorPivot) return; // door not loaded

        const target = doorOpen ? 1 : 0;

        doorProgress += (target - doorProgress) * delta;
        doorProgress = THREE.MathUtils.clamp(doorProgress, 0, 1);

        doorPivot.rotation.y = -(1-doorProgress) * Math.PI / 2;
    }
    function toggleDoor() {
        doorOpen = !doorOpen;
    }

    // center the room
    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);
    elements.focusPosition = new THREE.Vector3(0, 8, 3);

    return {elements, openDoor, doorPivot};
}