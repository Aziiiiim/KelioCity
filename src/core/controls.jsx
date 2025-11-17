import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';


export function createControls(camera,container) {
    const controls = new OrbitControls(camera,container);
    controls.enableDamping = true;
    controls.enablePan = true;

    controls.minDistance = 4;
    controls.maxDistance = 50;      

    return controls;
}