import * as THREE from 'three';
import {loadTexture, makeInstance} from '../utils/asset.js';
    
export function createStairsB2(initDoor = null) {
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "StairsB2";

    // Stairs
    makeInstance('/assets/models/Staircase.glb').then((stair) => {
        stair.position.set(0.83, 0, 2.87);// en 25,25 (pi):0.83 0.27 // pour trou: 0.85 -0.03 // en 25,25: 0.83 2.87
        stair.scale.set(-0.3, 0.2, 0.23);
        //stair.rotation.y = Math.PI;
        elements.add(stair);
    }).catch(console.error);

    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);
    elements.focusPosition = new THREE.Vector3(0, 8, 3);

    return {elements};
}