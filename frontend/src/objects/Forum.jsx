import * as THREE from 'three';
import { makeInstance, loadTexture } from '../utils/asset.js';
import { initChar } from './Characters.jsx';

export function createForum() {
    console.log("forum");
    const elements = new THREE.Group();
    elements.userData.type = "room";
    elements.userData.roomType = "Forum";

    let x = 0
    let z = 0

    
    // FORUM //////////////////////////////////////////////////////////
    let doorPivot= null;
    let doorOpen= false;
    let doorProgress = 0;

    for (let i=0; i<11; i++) {
        if (i==6) {
            makeInstance('/assets/models/GlassDoor.glb').then((door) => {

                doorPivot= new THREE.Group();
                doorPivot.userData.kind = "door";
                doorPivot.userData.action = "toggleDoor";
                doorPivot.userData.toggleDoor = toggleDoor;
                doorPivot.position.set(
                    x + i*5.4 + 8.2 + 2.7,
                    0,
                    z+22
                );

                // Position locale de la porte
                door.position.set(-2.7, 0, 0);
                door.scale.set(6, 4.115, 1);

                doorPivot.add(door);

                elements.add(doorPivot);
                
            });
        } else {
            makeInstance('/assets/models/GlassWall.glb').then((wall) => {
                wall.scale.set(3, 3, 1);
                wall.position.set(x+i*5.4+8.2, 0, z+22);
                elements.add(wall);
            });
        }
        const wallMat = new THREE.MeshBasicMaterial( { color: 0x838b96, side: THREE.DoubleSide } );
        const UpWall = new THREE.Mesh(
            new THREE.PlaneGeometry(72, 3),
            wallMat
        );
        //UpWall.rotation.y = Math.PI/2;
        UpWall.position.set(x+41.5, 6.58, z+22);
        elements.add(UpWall);

    }

    for (let i=0; i<3; i++) {
        makeInstance('/assets/models/CouchMedium.glb').then((couchM) => {
            couchM.scale.set(0.5, 0.5, 0.5);
            couchM.position.set(x+i*15 + 14 + (i%3==2?8:0), 0, z+23.5);
            elements.add(couchM);
        });
        makeInstance('/assets/models/CouchSmall.glb').then((couchS1) => {
            couchS1.scale.set(0.5, 0.5, 0.5);
            couchS1.position.set(x+i*15 + 11.5 + (i%3==2?8:0), 0, z+25);
            couchS1.rotation.y = Math.PI*0.3;
            elements.add(couchS1);
        });
        makeInstance('/assets/models/CouchSmall.glb').then((couchS2) => {
            couchS2.scale.set(0.5, 0.5, 0.5);
            couchS2.position.set(x+i*15 + 16.5 + (i%3==2?8:0), 0, z+25);
            couchS2.rotation.y = -Math.PI*0.3;
            elements.add(couchS2);
        });

    }

    initChar('/assets/characters/Man1.glb', function(character){
        character.scene.position.set(x+30,0,z+40);
        character.play("Idle");
        elements.add(character.scene);
    });

    for (let i=0; i<2; i++) {
        let delta = 30;
        makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
            desk.scale.set(1.5, 1.5, 1.5);
            desk.position.set(x+i*4+delta+21, 0.75, z+45);
            desk.rotation.y = Math.PI/2;
            elements.add(desk);
        });

        makeInstance('/assets/models/Stool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta+1+21, 0, z+45+0.6);
            elements.add(chair);
        });
        makeInstance('/assets/models/Stool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta-1+21, 0, z+45+0.6);
            elements.add(chair);
        });
        makeInstance('/assets/models/Stool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta+1+21, 0, z+45-0.6);
            elements.add(chair);
        });
        makeInstance('/assets/models/Stool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta-1+21, 0, z+45-0.6);
            elements.add(chair);
        });

        const wallMat = new THREE.MeshBasicMaterial( { color: 0x838b96, side: THREE.DoubleSide } );
        const MiniWall = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 3),
                wallMat
            );
            MiniWall.rotation.y = Math.PI/2;
            MiniWall.position.set(x+i*4+delta-2+21, 1.5, z+45);
            elements.add(MiniWall);
        
    }

    // Espace Manif //////////////////////////////////////////////////////////
    
    for (let i=0; i<8; i++) {
        makeInstance('/assets/models/Bar.glb').then((bar) => {
            bar.scale.set(4.9,3,3);
            bar.position.set(x+i*2.5+20, 0, z+0.3);
            elements.add(bar);
        });
    }
    for (let i=0; i<6; i++) {
        makeInstance('/assets/models/Bar.glb').then((bar) => {
            bar.scale.set(4.9,3,3);
            bar.position.set(x+i*2.5+50, 0, z+0.3);
            elements.add(bar);
        });
    }

    makeInstance('/assets/models/CouchSmall.glb').then((couch) => {
        couch.scale.set(0.5, 0.5, 0.5);
        couch.position.set(x+40, 0, z+2);
        elements.add(couch);
    });

    for (let i=0; i<6; i++) {
        for (let j=0; j<2; j++) {
            makeInstance('/assets/models/Column.glb').then((column) => {
                column.scale.set(3, 1.5, 3);
                column.position.set(x+i*13+8, 3.57, z+j*17.5+3);
                elements.add(column);
            });
        }
    }

    for (let i=0; i<8; i++) {
        makeInstance('/assets/models/GlassWall.glb').then((wall) => {
            wall.scale.set(5, 4.75, 2);
            wall.position.set(x+i*9+10, 0, z);
            elements.add(wall);
        })
    };

    const wallMat = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
    const BackWall = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 8.1),
        wallMat
    );
    BackWall.rotation.y = Math.PI/2;
    BackWall.position.set(x+5.45, 4.05, z+11);
    elements.add(BackWall);

    const FrontWall = new THREE.Mesh(
        new THREE.PlaneGeometry(22, 8.1),
        wallMat
    );
    FrontWall.rotation.y = Math.PI/2;
    FrontWall.position.set(x+77.5, 4.05, z+11);
    elements.add(FrontWall);

    /////////////////////////////////////////////////////////

    function openDoor(delta) {
        if (!doorPivot) return;

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

    const endX = x+80;
    const endZ = z+55;

    elements.focusPosition = new THREE.Vector3(0, 9, 4);
    return {elements, endX, endZ, openDoor, toggleDoor };
}
