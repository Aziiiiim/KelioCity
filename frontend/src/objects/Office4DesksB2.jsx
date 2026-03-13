import * as THREE from 'three';
import { makeInstance } from '../utils/asset.js'; 
    
export function createOffice4DesksB2(deskIds = [], initDoor = null) {
    
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "Office4DeskB2";
    const deskId1 = deskIds[0];
    const deskId2 = deskIds[1];
    const deskId3 = deskIds[2];
    const deskId4 = deskIds[3];

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(6, 6.49);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0x2F4680 } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(3,0.01,3.245)
    elements.add(floorMesh);

    const wallGeo1 = new THREE.PlaneGeometry(6, 4);
    const wallGeo2 = new THREE.PlaneGeometry(6.49, 4);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0xD6D3D2, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(3,2,0.01);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(5.99,2,3.245);
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
        new THREE.PlaneGeometry(4.5, 4),
        wallMat
    );
    wallFrontRight.rotation.y = Math.PI * 0.5;
    wallFrontRight.position.set(0, 2, 4.24);
    elements.add(wallFrontRight);

    const wallMesh4 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh4.rotation.y = Math.PI ;
    wallMesh4.position.set(3,2,6.49);
    elements.add(wallMesh4);

    let doorPivot = null;
    let doorOpen = false;
    let doorProgress = 0;

    // Desk1
    makeInstance('/assets/models/decoratedDesk.glb')
        .then((desk) => {
        desk.position.set(4.37, 0, 8.8);
        desk.scale.set(-1.1, 1.1, 1.1);
        desk.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId1;
            }
        });
        elements.add(desk);
        })
        .catch(console.error);

    // Chair1
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(4.7, 0, 1);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId1;
            }
        });
        elements.add(chair);
        })
        .catch(console.error);

    // Desk2
    makeInstance('/assets/models/decoratedDesk.glb')
        .then((desk) => {
        desk.position.set(1.61, 0, -4.4);
        desk.scale.set(-1.1, 1.1, 1.1);
        desk.rotation.y = Math.PI;
        desk.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId2;
            }
        });
        elements.add(desk);
        })
        .catch(console.error);

    // Chair2
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(1.2, 0, 3.4);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.rotation.y = Math.PI;
        chair.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId2;
            }
        });
        elements.add(chair);
        })
        .catch(console.error);

    // Desk3
    makeInstance('/assets/models/decoratedDesk.glb')
        .then((desk) => {
        desk.position.set(5.37, 0, -4);
        desk.scale.set(-1.1, 1.1, 1.1);
        desk.rotation.y = Math.PI;
        desk.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId3;
            }
        });
        elements.add(desk);
        })
        .catch(console.error);

    // Chair3
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(5.1, 0, 3.9);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.rotation.y = Math.PI;
        chair.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId3;
            }
        });
        elements.add(chair);
        })
        .catch(console.error);

    // Desk4
    makeInstance('/assets/models/decoratedDesk.glb')
        .then((desk) => {
        desk.position.set(1.65, 0, 12.9);
        desk.scale.set(1.1, 1.1, 1.1);
        desk.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId4;
            }
        });
        elements.add(desk);
        })
        .catch(console.error);

    // Chair4
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(1.2, 0, 5.1);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId4;
            }
        });
        elements.add(chair);
        })
        .catch(console.error);


    // White Board
    makeInstance('/assets/models/Whiteboard.glb')
        .then((board) => {
        board.position.set(1.5, 1, 0.01);
        board.scale.set(0.25, 0.3, 0.5);
        elements.add(board);
        })
        .catch(console.error);

    // Fan
    makeInstance('/assets/models/Fan.glb')
        .then((fan) => {
        fan.position.set(5.6, 0, 6);
        fan.scale.set(1.5, 2, 1.5);
        fan.rotation.y = -Math.PI/4;
        elements.add(fan);
        })
        .catch(console.error);

    // Cabin
    makeInstance('/assets/models/Cabin.glb')
        .then((cabin) => {
        cabin.position.set(4.1, 0.8, 6.05);
        cabin.scale.set(2, 2, 2);
        cabin.rotation.y = Math.PI;
        elements.add(cabin);
        })
        .catch(console.error);

    // Bin 1
    makeInstance('/assets/models/Bin.glb')
        .then((bin) => {
        bin.position.set(0.5, 0.39, 4.2);
        bin.scale.set(0.5, 0.5, 1);
        bin.rotation.y = -Math.PI/2;
        elements.add(bin);
        })
        .catch(console.error);

    // Bin 2
    makeInstance('/assets/models/Bin.glb')
        .then((bin) => {
        bin.position.set(5.5, 0.39, 5.3);
        bin.scale.set(0.5, 0.5, 1);
        bin.rotation.y = Math.PI/2;
        elements.add(bin);
        })
        .catch(console.error);

    // Wooden Chair 1
    makeInstance('/assets/models/WoodenChair.glb')
        .then((chair) => {
        chair.position.set(2.7, 0, 5.8);
        chair.scale.set(0.15, 0.15, 0.15);
        chair.rotation.y = Math.PI/2;
        elements.add(chair);
        })
        .catch(console.error);

    // Wooden Chair 2
    makeInstance('/assets/models/WoodenChair.glb')
        .then((chair) => {
        chair.position.set(3.2, 0, 0.6);
        chair.scale.set(0.15, 0.15, 0.15);
        chair.rotation.y = -Math.PI/2+0.3;
        elements.add(chair);
        })
        .catch(console.error);

    // Window
    makeInstance('/assets/models/Window.glb')
        .then((window) => {
        window.position.set(6, 1.3, 2.75);
        window.scale.set(4.7, 1.8, 1.8);
        window.rotation.y = Math.PI/2;
        elements.add(window);
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

        doorPivot.position.set(0, 1.5, 2);
        doorObj.position.set(-0.88, 0, 0);

        doorPivot.add(doorObj);
        doorPivot.rotation.y = Math.PI;

        elements.add(doorPivot);
        //initDoor(doorPivot, toggleDoor);
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