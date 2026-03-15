import * as THREE from 'three';
import { makeInstance} from '../utils/asset.js';

export function createClassroom2() {
    const elements = new THREE.Group();
    elements.userData.type = "room";
    elements.userData.roomType = "Classroom2";

    let x = 0
    let z = 0

    const wallGeo1 = new THREE.PlaneGeometry(10, 5);
    const wallGeo2 = new THREE.PlaneGeometry(12, 5);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0xd6d4d0, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(x+5,2.5,z);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(x,2.5,z+6);
    elements.add(wallMesh2);

    const wallMesh3 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh3.position.set(x+5,2.5,z+12);
    elements.add(wallMesh3);

    /*const wallMesh4 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh4.rotation.y = Math.PI * -.5;
    wallMesh4.position.set(x+10,2.5,z+6);
    elements.add(wallMesh4);*/
    
    const wallMesh4_1 = new THREE.Mesh(
        new THREE.PlaneGeometry(9.4, 5),
        wallMat
    );
    wallMesh4_1.rotation.y = Math.PI/2;
    wallMesh4_1.position.set(x+10, 2.5, z+7.3);
    elements.add(wallMesh4_1);

    const wallMesh4_2 = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 2),
        wallMat
    );
    wallMesh4_2.rotation.y = Math.PI/2;
    wallMesh4_2.position.set(x+10, 4, z+1.85);
    elements.add(wallMesh4_2);
    
    const wallMesh4_3 = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 5),
        wallMat
    );
    wallMesh4_3.rotation.y = Math.PI/2;
    wallMesh4_3.position.set(x+10, 2.5, z+0.5);
    elements.add(wallMesh4_3);

    
    const floorGeo = new THREE.PlaneGeometry(10, 12);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xb3afaf, side: THREE.DoubleSide } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI /2;
    floorMesh.position.set(x+5,0.02,z+6);
    elements.add(floorMesh);

    makeInstance('/assets/models/Wood.glb').then((wood) => {
        console.log("wood");
        wood.position.set(x+2.5,2.5,z-0.02);
        wood.scale.set(10.3,2,10.3);
        wood.rotation.z = Math.PI/2;
        wood.rotation.y = -Math.PI/2;
        elements.add(wood);
    });
    makeInstance('/assets/models/Wood.glb').then((wood) => {
        console.log("wood");
        wood.position.set(x+7.5,2.5,z-0.02);
        wood.scale.set(10.3,2,10.3);
        wood.rotation.z = Math.PI/2;
        wood.rotation.y = -Math.PI/2;
        elements.add(wood);
    });

    makeInstance('/assets/models/Whiteboard.glb').then((board) => {
        console.log("board");
        board.position.set(x+10-0.2,1.5,z+8);
        board.scale.set(2,3.5,3.5);
        board.rotation.y = Math.PI;
        elements.add(board);
    });

    makeInstance('/assets/models/Projector.glb').then((projector) => {
        projector.position.set(x+10-1.5,4,z+8);
        projector.scale.set(1,1,1);
        projector.rotation.y = Math.PI/8;
        elements.add(projector);
    });

    makeInstance('/assets/models/GlassWall.glb').then((window) => {
        window.position.set(x+10-7.6,0,z+12);
        window.scale.set(2.6,2.8,2.6);
        elements.add(window);
    });

    for (let j=0; j<4; j++) {
        for (let i=0; i<5; i++) {

            makeInstance('/assets/models/Table.glb').then((table) => {
                table.position.set(x+10-3-j*1.85,0,z+11-i*1.5);
                table.scale.set(0.08,0.18,0.08);
                elements.add(table);
            });

            makeInstance('/assets/models/StandChair.glb').then((chair) => {
                chair.position.set(x+10-1+j*1.85,0,z+21.5-2.7+i*1.5);
                chair.scale.set(0.04,0.03,0.04);
                chair.rotation.y=Math.PI/2;
                elements.add(chair);
            });
        }
    
        makeInstance('/assets/models/Table.glb').then((table) => {
            table.position.set(x+10-3-j*1.85,0,z+11-10);
            table.scale.set(0.08,0.18,0.08);
            elements.add(table);
        });

        makeInstance('/assets/models/StandChair.glb').then((chair) => {
            chair.position.set(x+10-1+j*1.85,0,z+17.5-2.7);
            chair.scale.set(0.04,0.03,0.04);
            chair.rotation.y=Math.PI/2;
            elements.add(chair);
        });
    }
    
    // Door (avec cache)
    let doorPivot = null;
    let doorOpen = false;
    let doorProgress = 0;
    makeInstance('/assets/models/door.glb').then((doorObj) => {
        doorObj.scale.set(4, 4, 4);

        doorPivot = new THREE.Group();

        doorPivot.userData.kind = "door";
        doorPivot.userData.action = "toggleDoor";
        doorPivot.userData.toggleDoor = toggleDoor;

        doorPivot.position.set(x+10 , 1.5, z +1);

        // même offset que toi
        doorObj.position.set(-0.88, 0, 0);

        doorPivot.add(doorObj);
        doorPivot.rotation.y = Math.PI / 2;

        elements.add(doorPivot);
    });


    function openDoor(delta) {
        if (!doorPivot) return;

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

    const endX = x+10;
    const endZ = z+12;

    elements.focusPosition = new THREE.Vector3(0, 9, 4);
    return {elements, endX, endZ, openDoor, toggleDoor};
}
