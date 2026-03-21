import * as THREE from 'three';
import { makeInstance } from '../utils/asset.js';

// classic stairs
export function createStairs() {
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "Stairs";

    // Stairs
    makeInstance('/assets/models/stairs.glb').then((stair) => {
        stair.position.set(0, 0, 0);
        stair.scale.set(2.74, 3.69, 3.8);
        elements.add(stair);
    }).catch(console.error);

    // center the room
    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);
    elements.focusPosition = new THREE.Vector3(0, 8, 3);

    return {elements};
}