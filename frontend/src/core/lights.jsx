import * as THREE from 'three';
// File to create and manage lights

// function to create a light on (x1, z1) that spot (x2, z2)
export function createLight(x1,z1,x2,z2) {
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(x1,5,z1);
    light.target.position.set(x2,0,z2);
    return light;
}


export function createSetupLight () {
    const lights = [];
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 20, 0);
    lights.push(hemiLight);

    // Main directional light (like the sun)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 2);
    dirLight.castShadow = true;
    lights.push(dirLight);

    return lights;
}