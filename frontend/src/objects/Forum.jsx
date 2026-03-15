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

    
    const floorGeo = new THREE.PlaneGeometry(100, 60);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xb1b4bd, side: THREE.DoubleSide } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI /2;
    floorMesh.position.set(x+45,0.01,z+30);
    elements.add(floorMesh);
    
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

    // Groupe table haute

    for (let i=0; i<2; i++) {
        let delta = 30;
        makeInstance('/assets/models/StandingDesk.glb').then((desk) => {
            desk.scale.set(1.5, 1.5, 1.5);
            desk.position.set(x+i*4+delta+32, 0.55, z+45);
            desk.rotation.y = Math.PI/2;
            elements.add(desk);
        });

        makeInstance('/assets/models/HighStool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta+1+32, 0, z+45+0.6);
            elements.add(chair);
        });
        makeInstance('/assets/models/HighStool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta-1+32, 0, z+45+0.6);
            elements.add(chair);
        });
        makeInstance('/assets/models/HighStool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta+1+32, 0, z+45-0.6);
            elements.add(chair);
        });
        makeInstance('/assets/models/HighStool.glb').then((chair) => {
            chair.scale.set(0.1, 0.11, 0.1);
            chair.position.set(x+i*4+delta-1+32, 0, z+45-0.6);
            elements.add(chair);
        });

        const wallMat = new THREE.MeshBasicMaterial( { color: 0x838b96, side: THREE.DoubleSide } );
        const MiniWall = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 3),
                wallMat
            );
            MiniWall.rotation.y = Math.PI/2;
            MiniWall.position.set(x+i*4+delta-2+32, 1.5, z+45);
            elements.add(MiniWall);
        
    }

    for (let i=0; i<3; i++) {
        for (let j=0; j<2; j++) {
            makeInstance('/assets/models/Column.glb').then((column) => {
                column.scale.set(1.5, 1, 2.5);
                column.position.set(x+i*12+24+j*34, 2.4, z+44);
                elements.add(column);
            });
        }   
    }
    makeInstance('/assets/models/Column.glb').then((column) => {
        column.scale.set(1.5, 1, 2.5);
        column.position.set(x+3, 2.4, z+44);
        elements.add(column);
    });
    makeInstance('/assets/models/Column.glb').then((column) => {
        column.scale.set(1.5, 1, 2.5);
        column.position.set(x+12+3, 2.4, z+44);
        elements.add(column);
    });

    // Groupe Table + 8 tabourets
    makeInstance('/assets/models/Table.glb').then((table) => {
        table.scale.set(0.13,0.15,0.20);
        table.position.set(x+76,0,z+45);
        table.rotation.y=Math.PI/2;
        elements.add(table);
    })
    for (let i=0; i<4; i++) {
        for (let j=0; j<2; j++) {
            makeInstance('/assets/models/Stool.glb').then((stool) => {
                stool.scale.set(1.1,1.1,1.1);
                stool.position.set(x+i*0.7+75,0.75,z+j*1.2+44.4);
                stool.rotation.y=Math.PI/2;
                elements.add(stool);
            })
        }
    }

    for (let n=0; n<2; n++) {
        makeInstance('/assets/models/Table.glb').then((table) => {
            table.scale.set(0.13,0.15,0.20);
            table.position.set(x+6.5+n*5,0,z+44);
            elements.add(table);
        })
        for (let i=0; i<4; i++) {
            for (let j=0; j<2; j++) {
                makeInstance('/assets/models/Stool.glb').then((stool) => {
                    stool.scale.set(1.1,1.1,1.1);
                    stool.position.set(x+j*1.2+5.9+n*5,0.75,z+i*0.7+43);
                    stool.rotation.y=Math.PI/2;
                    elements.add(stool);
                })
            }
        }
    }


    for (let i=0; i<2; i++) {
        makeInstance('/assets/models/Houseplant.glb').then((plant) => {
            plant.scale.set(2,2,2);
            plant.position.set(x+20+i*33,0,z+45);
            elements.add(plant);
        })
        makeInstance('/assets/models/Houseplant1.glb').then((plant) => {
            plant.scale.set(1.5,1.5,1.5);
            plant.position.set(x+19+i*33,0,z+46);
            elements.add(plant);
        })
        makeInstance('/assets/models/FlowerPot.glb').then((plant) => {
            plant.scale.set(1.5,1.5,1.5);
            plant.position.set(x+20.5+i*33,1.55,z+46);
            elements.add(plant);
        })
        makeInstance('/assets/models/PotPlant.glb').then((plant) => {
            plant.scale.set(2,2,2);
            plant.position.set(x+19+i*33,0.63,z+44.5);
            elements.add(plant);
        })
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
        couch.position.set(x+40, 0, z+1);
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

    const endX = x+100;
    const endZ = z+60;

    elements.focusPosition = new THREE.Vector3(0, 9, 4);
    return {elements, endX, endZ, openDoor, toggleDoor };
}
