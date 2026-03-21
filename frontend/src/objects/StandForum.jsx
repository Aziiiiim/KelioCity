import * as THREE from 'three';
import { makeInstance, loadTexture } from '../utils/asset.js';

export function createStand(deskIds = []) {
    const elements = new THREE.Group();
    elements.userData.type = "room";
    elements.userData.roomType = "StandForum";

    let x = 0
    let z = 0

    const deskId1 = deskIds[0];
    const deskId2 = deskIds[1];

    // Table
    makeInstance('/assets/models/FoldingTable.glb').then((table) => {
        table.position.set(x+0.9,0.61,z-0.9);
        table.scale.set(1,1,0.7);
        table.rotation.y = Math.PI/4;
        elements.add(table);
    });

    // Chair 1
    makeInstance('/assets/models/StandChair.glb').then((chair) => {
        chair.position.set(x+15.8,0,z+4.3);
        chair.scale.set(0.04,0.03,0.04);
        chair.rotation.y = 3*Math.PI/4;
        chair.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId1;
            }
        });
        elements.add(chair);
    });

    // Chair 2
    makeInstance('/assets/models/StandChair.glb').then((chair) => {
        chair.position.set(x+15,0,z+3.5);
        chair.scale.set(0.04,0.03,0.04);
        chair.rotation.y = 3*Math.PI/4;
        chair.traverse(n => {
            if (n.isMesh) {
                n.userData.kind = "desk";
                n.userData.deskId = deskId2;
            }
        });
        elements.add(chair);
    });

    // Grille
    loadTexture('/assets/textures/grille.png').then((gridTexture) => {
        gridTexture.magFilter = THREE.NearestFilter;
        gridTexture.minFilter = THREE.NearestFilter;

        const material = new THREE.MeshBasicMaterial({
            map: gridTexture,
            transparent: true,
            alphaTest: 0.5,      // avoids black artifacts
            side: THREE.DoubleSide,
            depthWrite: false    // prevents the plane from obscuring other objects
        });

        const geometry = new THREE.PlaneGeometry(2, 4)
        const grid1 = new THREE.Mesh(geometry, material);
        grid1.position.set(x, 2, z+1);
        elements.add(grid1);
        
        const grid2 = new THREE.Mesh(geometry, material);
        grid2.position.set(x-1, 2, z);
        grid2.rotation.y = Math.PI/2;
        elements.add(grid2);
    });


    // center the room
    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);

    elements.focusPosition = new THREE.Vector3(0, 9, 4);
    return {elements};
}
