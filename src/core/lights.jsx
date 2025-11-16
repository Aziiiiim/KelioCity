import * as THREE from 'three';

export function createLight(){
    return new THREE.AmbientLight(0xffffff, 1.2);
}