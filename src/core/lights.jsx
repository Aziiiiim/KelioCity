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

    // Remplissage : éclaire les ombres sans les casser
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 5, -2);
    lights.push(fillLight);

    // Light arrière pour les contours (rim light)
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(0, 5, -10);
    lights.push(backLight);

    return lights;
}