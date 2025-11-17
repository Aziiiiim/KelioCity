import * as THREE from 'three';
import { createCamera} from './camera.jsx';
import { createRenderer } from './renderer.jsx';
import {createAmbientLight, createDirectionalLight, createSetupLight} from './lights.jsx';
import { createControls } from './controls.jsx';
import { createGround } from '../objects/Ground.jsx';
import { createOffice } from '../objects/Office.jsx';
import { createCharacters } from '../objects/Characters.jsx';

let clock = new THREE.Clock();

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);
    const ground = createGround();

    scene.add(ground);

    // Load Meeting Room
    const meetingRoomElements = createMeetingRoom();
    scene.add(createLight(10.7,7.5,-4.3,-7.5));
    scene.add(createLight(-4.3,-7.5,10.7,7.5));
    function loadLoopMeetingRoom() {
        requestAnimationFrame(loadLoopMeetingRoom);
        for (let i=0; i<meetingRoomElements.length; i++) {
            if (!scene.children.includes(meetingRoomElements[i])) {
                scene.add(meetingRoomElements[i]);
            }
        }
    }
    loadLoop();

    const lights = createSetupLight();
    for (let i=0; i<lights.length; i++) {           
        scene.add(lights[i]);
    }

    const controls = createControls(camera,gameWindow);
    camera.position.set(10,20,20);
    controls.update();



    function draw(){
        controls.update();
        if (camera.position.y < 0) camera.position.y = 0;
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