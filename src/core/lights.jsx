import * as THREE from 'three';

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

    // Lumière directionnelle principale (comme le soleil)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 2);
    dirLight.castShadow = true;
    lights.push(dirLight);
    /*
    // Remplissage : éclaire les ombres sans les casser
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 5, -2);
    lights.push(fillLight);

    // Light arrière pour les contours (rim light)
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(0, 5, -10);
    lights.push(backLight);*/

    return lights;
}