import * as THREE from 'three';
import { makeInstance, loadTexture } from '../utils/asset.js';

export function createOffice1Desk(initDoor) {
    const elements = new THREE.Group();
    let x = 3;
    let z = 3;

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(6, 4);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xdedede } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(x,0.01,-1+z)
    elements.add(floorMesh);

    const wallGeo1 = new THREE.PlaneGeometry(6, 5);
    const wallGeo2 = new THREE.PlaneGeometry(4, 5);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0x99a88c, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(x,2.5,-3+z);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(3+x,2.5,-1+z);
    elements.add(wallMesh2);

    const wallMesh3 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh3.rotation.y = Math.PI * .5;
    wallMesh3.position.set(-3+x,2.5,-1+z);
    elements.add(wallMesh3);

    const wallFrontLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 5),
        wallMat
    );
    wallFrontLeft.rotation.y = Math.PI;
    wallFrontLeft.position.set(x-1.31, 2.5, 1+z);
    elements.add(wallFrontLeft);
    const wallFrontTop = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 1.98),
        wallMat
    );
    wallFrontTop.rotation.y = Math.PI;
    wallFrontTop.position.set(x+1, 4.01, 1+z);
    elements.add(wallFrontTop);
    const wallFrontRight = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 5),
        wallMat
    );
    wallFrontRight.rotation.y = Math.PI;
    wallFrontRight.position.set(x+2.5, 2.5, 1+z);
    elements.add(wallFrontRight);


    // Desk
    makeInstance('/assets/models/decoratedDesk.glb').then((desk) => {
        desk.position.set(0.3 + x, 0, 6.7 + z);
        desk.scale.set(1.1, 1.1, 1.1);
        elements.add(desk);
    }).catch(console.error);

    // Chair
    makeInstance('/assets/models/chair.glb').then((chair) => {
        chair.position.set(-11.7 + x, 0, 6 + z);
        chair.scale.set(0.035, 0.035, 0.035);
        elements.add(chair);
    }).catch(console.error);

    // Message Board
    makeInstance('/assets/models/messageBoard.glb').then((board) => {
        board.position.set(2, 1, -2.9 + z);
        board.scale.set(0.02, 0.02, 0.02);
        board.rotation.y = Math.PI * -0.5;
        elements.add(board);
    }).catch(console.error);

    // Shelf
    makeInstance('/assets/models/containerShelf.glb').then((shelf) => {
        shelf.position.set(2.6 + x, 1.14, -2.2 + z);
        shelf.scale.set(0.03, 0.03, 0.03);
        shelf.rotation.y = Math.PI * 0.5;
        elements.add(shelf);
    }).catch(console.error);

    // Door (avec pivot)
    let doorPivot = null;
    let doorOpen = false;
    let doorProgress = 0;
    makeInstance('/assets/models/door.glb').then((doorObj) => {
        doorObj.scale.set(4, 4, 4);

        doorPivot = new THREE.Group();
        doorPivot.position.set(2 + x, 1.5, 0.98 + z);

        // même offset que ton code
        doorObj.position.set(-0.88, 0, 0);

        doorPivot.add(doorObj);
        doorPivot.rotation.y = Math.PI / 2;

        elements.add(doorPivot);
        initDoor(doorPivot, toggleDoor);
    }).catch(console.error);

    function openDoor(delta) {
        if (!doorPivot) return; // porte pas encore chargée

        const target = doorOpen ? 1 : 0;

        doorProgress += (target - doorProgress) * delta;
        doorProgress = THREE.MathUtils.clamp(doorProgress, 0, 1);

        doorPivot.rotation.y = doorProgress * Math.PI / 2;
    }

    function toggleDoor() {
        doorOpen = !doorOpen;
    }

    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);
    elements.focusPosition = new THREE.Vector3(0, 8, 3);

    return {elements, openDoor, doorPivot};
}