import * as THREE from 'three';
import { createCamera,onMouseDown as camMouseDown, onMouseUp as camMouseUp, onMouseMove as camMouseMove } from './camera.jsx';
import { createRenderer } from './renderer.jsx';
import {createAmbientLight, createDirectionalLight, createSetupLight} from './lights.jsx';
import { createOffice } from '../objects/Office.jsx';
import { createCharacters } from '../objects/Characters.jsx';

let activeCamera = null ;
let clock = new THREE.Clock();

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
    activeCamera = camera;
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);

    // Load Office
    let office = createOffice();
    let characters = createCharacters();
    function loadLoop() {
        requestAnimationFrame(loadLoop);
        for (let i=0; i<office.length; i++) {
            if (!scene.children.includes(office[i])) {
                scene.add(office[i]);
            }
        }
        for (let i=0; i<characters.length; i++) {
            if (!scene.children.includes(characters[i])) {
                scene.add(characters[i].scene);
            }
        }
    }
    loadLoop();

    const lights = createSetupLight();
    for (let i=0; i<lights.length; i++) {           
        scene.add(lights[i]);
    }

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

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        characters.forEach(character => {
            character.mixer.update(delta);
        });

        renderer.render(scene, camera);
    }

    return { start, stop, animate, scene, camera, renderer };
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

