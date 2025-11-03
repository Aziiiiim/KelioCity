import * as THREE from 'three';

export function createLight(){
    const light = new THREE.AmbientLight(0xffffff, 2);
    return light;
}