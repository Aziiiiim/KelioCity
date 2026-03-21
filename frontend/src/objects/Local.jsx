import * as THREE from 'three';
import { makeInstance } from '../utils/asset.js'; 

// Simple local room
export function createLocal() {
    
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "Local";

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(6, 3.49);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0x2F4680 } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(3,0.01,1.745)
    elements.add(floorMesh);

    const wallGeo1 = new THREE.PlaneGeometry(6, 4);
    const wallGeo2 = new THREE.PlaneGeometry(3.49, 4);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0xD6D3D2, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(3,2,0.01);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(5.99,2,1.745);
    elements.add(wallMesh2);

    const wallFrontLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(0.38, 4),
        wallMat
    );
    wallFrontLeft.rotation.y = Math.PI * 0.5;
    wallFrontLeft.position.set(0, 2, 0.2);
    elements.add(wallFrontLeft);
    const wallFrontTop = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 0.96),
        wallMat
    );
    wallFrontTop.rotation.y = Math.PI * 0.5;
    wallFrontTop.position.set(0, 3.52, 1.5);
    elements.add(wallFrontTop);
    const wallFrontRight = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 4),
        wallMat
    );
    wallFrontRight.rotation.y = Math.PI * 0.5;
    wallFrontRight.position.set(0, 2, 2.74);
    elements.add(wallFrontRight);

    const wallMesh4 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh4.rotation.y = Math.PI ;
    wallMesh4.position.set(3,2,3.49);
    elements.add(wallMesh4);

    let doorPivot = null;
    let doorOpen = false;
    let doorProgress = 0;

    // Shelf 1
    makeInstance('/assets/models/containerShelf.glb')
        .then((shelf) => {
        shelf.position.set(3, 1.51, 3.1);
        shelf.scale.set(0.056, 0.04, 0.03);
        elements.add(shelf);
        })
        .catch(console.error);

    // Shelf 2
    makeInstance('/assets/models/containerShelf.glb')
        .then((shelf) => {
        shelf.position.set(5.6, 1.51, 1.75);
        shelf.scale.set(0.06, 0.04, 0.03);
        shelf.rotation.y = Math.PI/2;
        elements.add(shelf);
        })
        .catch(console.error);

    // Message Board
    makeInstance('/assets/models/messageBoard.glb')
        .then((board) => {
        board.position.set(3.1, 1.51, 0.1);
        board.scale.set(0.02, 0.02, 0.02);
        board.rotation.y = -Math.PI/2;
        elements.add(board);
        })
        .catch(console.error);


    // Door and functions to open the door
    makeInstance('/assets/models/door.glb')
        .then((doorObj) => {
        doorObj.scale.set(4, 4, 4);

        doorPivot = new THREE.Group();
        doorPivot.userData.kind = "door";
        doorPivot.userData.action = "toggleDoor";
        doorPivot.userData.toggleDoor = toggleDoor;

        doorPivot.position.set(0, 1.5, 2);
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