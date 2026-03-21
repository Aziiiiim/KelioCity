import * as THREE from 'three';
import {makeInstance} from '../utils/asset.js';

// Stairs used in floor B2. You can insert two StairsB2 in StairwellB2
export function createStairsB2() {
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "StairsB2";

    // Stairs
    makeInstance('/assets/models/Staircase.glb').then((stair) => {
        stair.position.set(0.83, 0, 2.87);
        stair.scale.set(-0.3, 0.2, 0.23);
        elements.add(stair);
    }).catch(console.error);

    // center the room
    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);
    elements.focusPosition = new THREE.Vector3(0, 8, 3);

    return {elements};
}