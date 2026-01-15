import * as THREE from 'three';
import { makeInstance } from '../utils/asset.js'; 
    
export function createOffice4Desks(initDoor) {
    let x = -1;
    const elements = new THREE.Group();

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(7, 6);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xdedede } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(4.5+x,0.01,3)
    elements.add(floorMesh);

    const wallGeo1 = new THREE.PlaneGeometry(7, 5);
    const wallGeo2 = new THREE.PlaneGeometry(6, 5);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0x9e2a2b, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(4.5+x,2.5,0);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(8+x,2.5,3);
    elements.add(wallMesh2);

    const wallFrontLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(3.85, 5),
        wallMat
    );
    wallFrontLeft.rotation.y = Math.PI * 0.5;
    wallFrontLeft.position.set(1 + x, 2.5, 1.925);
    elements.add(wallFrontLeft);
    const wallFrontTop = new THREE.Mesh(
        new THREE.PlaneGeometry(2.1, 1.96),
        wallMat
    );
    wallFrontTop.rotation.y = Math.PI * 0.5;
    wallFrontTop.position.set(1 + x, 4.02, 4.5);
    elements.add(wallFrontTop);
    const wallFrontRight = new THREE.Mesh(
        new THREE.PlaneGeometry(0.52, 5),
        wallMat
    );
    wallFrontRight.rotation.y = Math.PI * 0.5;
    wallFrontRight.position.set(1 + x, 2.5, 5.74);
    elements.add(wallFrontRight);

    const wallMesh4 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh4.rotation.y = Math.PI ;
    wallMesh4.position.set(4.5+x,2.5,6);
    elements.add(wallMesh4);

    
    let doorPivot = null;
    let doorOpen = false;
    let doorProgress = 0;

    const groupDesk1 = new THREE.Group();

    Promise.all([
        makeInstance('/assets/models/decoratedDesk.glb').then((desk) => {
        desk.position.set(-5.43 + 3.5, 0, 2.5);
        desk.scale.set(1.1, 1.1, 1.1);
        desk.rotation.y = -Math.PI * 0.5;
        groupDesk1.add(desk);
        }),
        makeInstance('/assets/models/chair.glb').then((chair) => {
        chair.position.set(-4.7 + 3.5, 0, -9.5);
        chair.scale.set(0.035, 0.035, 0.035);
        chair.rotation.y = -Math.PI * 0.5;
        groupDesk1.add(chair);
        }),
    ])
        .then(() => {
        const groupDesk2 = groupDesk1.clone(true);
        const groupDesk3 = groupDesk1.clone(true);
        const groupDesk4 = groupDesk1.clone(true);

        groupDesk1.position.set(x, 0, 0);
        groupDesk3.position.set(x, 0, 2.25);

        groupDesk2.rotation.y = Math.PI;
        groupDesk2.position.set(9 + x, 0, 4);

        groupDesk4.rotation.y = Math.PI;
        groupDesk4.position.set(9 + x, 0, 6.25);

        elements.add(groupDesk1, groupDesk2, groupDesk3, groupDesk4);
        })
        .catch(console.error);

    // Message Board
    makeInstance('/assets/models/messageBoard.glb')
        .then((board) => {
        board.position.set(4.5 + x, 1, 0.1);
        board.scale.set(0.02, 0.02, 0.02);
        board.rotation.y = Math.PI * -0.5;
        elements.add(board);
        })
        .catch(console.error);

    // Shelf
    makeInstance('/assets/models/containerShelf.glb')
        .then((shelf) => {
        shelf.position.set(7.6 + x, 1.14, 0.8);
        shelf.scale.set(0.03, 0.03, 0.03);
        shelf.rotation.y = Math.PI * 0.5;
        elements.add(shelf);
        })
        .catch(console.error);

    // Door
    makeInstance('/assets/models/door.glb')
        .then((doorObj) => {
        doorObj.scale.set(4, 4, 4);

        doorPivot = new THREE.Group();
        doorPivot.position.set(1 + x, 1.5, 5.48);

        doorObj.position.set(-0.88, 0, 0);

        doorPivot.add(doorObj);
        elements.add(doorPivot);

        initDoor(doorPivot, toggleDoor);
        })
        .catch(console.error);
    function openDoor(delta) {
        if (!doorPivot) return; // porte pas encore chargée

        const target = doorOpen ? 1 : 0;

        doorProgress += (target - doorProgress) * delta;
        doorProgress = THREE.MathUtils.clamp(doorProgress, 0, 1);

        doorPivot.rotation.y = -(1-doorProgress) * Math.PI / 2;
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