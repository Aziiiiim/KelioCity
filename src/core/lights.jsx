import * as THREE from 'three';

export function createDirectionalLight(){
    const color = 0xFFFFFF;
    const intensity = 5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-5, 5, 5);
    light.target.position.set(5, 0, -3);
    return light;
}

export function createAmbientLight(){
    const color = 0xFFFFFF;
    const intensity = 5;
    const light = new THREE.AmbientLight(color, intensity);
    return light;
}