import * as THREE from 'three';
import { makeInstance, loadTexture } from '../utils/asset.js';

export function createStand() {
    const elements = new THREE.Group();
    elements.userData.type = "room";
    elements.userData.roomType = "StandForum";

    let x = 0
    let z = 0

    
 

    makeInstance('/assets/models/FoldingTable.glb').then((table) => {
        table.position.set(x+0.9,0.61,z-0.9);
        table.scale.set(1,1,0.7);
        table.rotation.y = Math.PI/4;
        elements.add(table);
    });

    makeInstance('/assets/models/StandChair.glb').then((chair) => {
        chair.position.set(x+15.8,0,z+4.3);
        chair.scale.set(0.04,0.03,0.04);
        chair.rotation.y = 3*Math.PI/4;
        elements.add(chair);
    });
    
    makeInstance('/assets/models/StandChair.glb').then((chair) => {
        chair.position.set(x+15,0,z+3.5);
        chair.scale.set(0.04,0.03,0.04);
        chair.rotation.y = 3*Math.PI/4;
        elements.add(chair);
    });

    loadTexture('/assets/textures/grille.png').then((gridTexture) => {
        gridTexture.magFilter = THREE.NearestFilter;
        gridTexture.minFilter = THREE.NearestFilter;

        const material = new THREE.MeshBasicMaterial({
            map: gridTexture,
            transparent: true,
            alphaTest: 0.5,      // évite les artefacts noirs
            side: THREE.DoubleSide,
            depthWrite: false    // évite que le plan masque d'autres objets
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



    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);

    const endX = x+10;
    const endZ = z+10;

    elements.focusPosition = new THREE.Vector3(0, 9, 4);
    return {elements, endX, endZ};
}
