import * as THREE from 'three';
import { makeInstance } from '../utils/asset.js'; 
    
export function createMeetingRoomB2(initDoor = null) {
    
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "MeetingRoomB2";

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

    // Desk 1
    makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
        desk.scale.set(1, 1, 1);
        desk.rotation.y = Math.PI/2;
        desk.position.set(1.8, 0.4, 5);
        elements.add(desk);
    });

    // Chair 1
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(1, 0, 5);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.rotation.y = Math.PI/2;
        elements.add(chair);
    })
    .catch(console.error);

    // Desk 2
    makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
        desk.scale.set(1, 1, 1);
        desk.rotation.y = Math.PI/2;
        desk.position.set(1.8, 0.4, 3.5);
        elements.add(desk);
    });

    // Chair 2
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(1, 0, 3.5);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.rotation.y = Math.PI/2;
        elements.add(chair);
    })
    .catch(console.error);

    // Desk 3
    makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
        desk.scale.set(1, 1, 1);
        desk.position.set(2.2, 0.4, 2.3);
        elements.add(desk);
    });

    // Chair 3
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(2.2, 0, 1.5);
        chair.scale.set(1.3, 1.3, 1.3);
        elements.add(chair);
    })
    .catch(console.error);

    // Desk 4
    makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
        desk.scale.set(1, 1, 1);
        desk.position.set(3.8, 0.4, 2.3);
        elements.add(desk);
    });

    // Chair 4
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(3.8, 0, 1.5);
        chair.scale.set(1.3, 1.3, 1.3);
        elements.add(chair);
    })
    .catch(console.error);

    // Desk 5
    makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
        desk.scale.set(1, 1, 1);
        desk.rotation.y = Math.PI/2;
        desk.position.set(4.2, 0.4, 5);
        elements.add(desk);
    });

    // Chair 5
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(5, 0, 5);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.rotation.y = -Math.PI/2;
        elements.add(chair);
    })
    .catch(console.error);

    // Desk 6
    makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
        desk.scale.set(1, 1, 1);
        desk.rotation.y = Math.PI/2;
        desk.position.set(4.2, 0.4, 3.5);
        elements.add(desk);
    });

    // Chair 6
    makeInstance('/assets/models/OfficeChair.glb')
        .then((chair) => {
        chair.position.set(5, 0, 3.5);
        chair.scale.set(1.3, 1.3, 1.3);
        chair.rotation.y = -Math.PI/2;
        elements.add(chair);
    })
    .catch(console.error);

    // White Board
    makeInstance('/assets/models/Whiteboard.glb')
        .then((board) => {
        board.position.set(3, 1, 0.01);
        board.scale.set(0.4, 0.3, 0.5);
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

    // Bin
    makeInstance('/assets/models/Bin.glb')
        .then((bin) => {
        bin.position.set(5.5, 0.39, 2.5);
        bin.scale.set(0.5, 0.5, 1);
        bin.rotation.y = Math.PI/2;
        elements.add(bin);
        })
        .catch(console.error);

    // Projector screen
    makeInstance('/assets/models/ProjectorScreen.glb').then((proj) => {
        proj.scale.set(2, 2, 3);
        proj.position.set(3, 2.35, 6.4);
        proj.rotation.y = Math.PI/2;
        proj.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(0xC2C2C2);
            }
        });
        elements.add(proj);
    });

    // Printer
    makeInstance('/assets/models/Printer.glb')
        .then((printer) => {
        printer.position.set(5, 1.25, 1);
        printer.scale.set(0.9, 1, 0.7);
        printer.rotation.y = Math.PI/2;
        elements.add(printer);
        })
        .catch(console.error);

    // Window
    makeInstance('/assets/models/Window.glb')
        .then((window) => {
        window.position.set(6, 1.3, 3.25);
        window.scale.set(5.3, 1.8, 1.8);
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