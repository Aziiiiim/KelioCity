import * as THREE from 'three';
import { createCamera,onMouseDown as camMouseDown, onMouseUp as camMouseUp, onMouseMove as camMouseMove } from './camera.jsx';
import { createRenderer } from './renderer.jsx';
import {createAmbientLight, createDirectionalLight} from './lights.jsx';
import { createOffice } from '../objects/Office.jsx';
let activeCamera = null ;

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
    activeCamera = camera;
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);

    // Load Office
    const office = createOffice();
    function loadLoopOffice() {
        requestAnimationFrame(loadLoopOffice);
        for (let i=0; i<office.length; i++) {
            if (!scene.children.includes(office[i])) {
                scene.add(office[i]);
            }
        }
    }
    loadLoopOffice();

    const light = createDirectionalLight();
    scene.add(light);
    scene.add(light.target);

    function draw(){
        renderer.render(scene,camera);
    }

    function start(){
        function onResize() {
            resizeRenderer();
            resizeCamera();
        }
        window.addEventListener('resize', onResize);
        onResize();
        renderer.setAnimationLoop(draw);
    } 
    
    function stop(){
        renderer.setAnimationLoop(null);
    } 

    return { start, stop, scene, camera, renderer };
}

export function onMouseDown(event){
    console.log('mousedown');
    camMouseDown(event,activeCamera);
}

export function onMouseUp(event){
    console.log('mouseup');
    camMouseUp(event,activeCamera);
}
export function onMouseMove(event){
    console.log('mousemove');
    camMouseMove(event,activeCamera);
}