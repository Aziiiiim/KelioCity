import * as THREE from 'three';

export function createLight(x1,z1,x2,z2) {
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(x1,5,z1);
    light.target.position.set(x2,0,z2);
    return light;
}