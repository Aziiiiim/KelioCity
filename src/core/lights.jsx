import * as THREE from 'three';

export function createLight(){
    const light = new THREE.PointLight(0xeeeeee);
    light.position.set(0,0,2);
    return light;
}