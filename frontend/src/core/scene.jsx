import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCamera, cameraOn} from './camera.jsx';
import { createRenderer } from './renderer.jsx';
import {createLight, createSetupLight} from './lights.jsx';
import { createControls } from './controls.jsx';
import { createGround } from '../objects/Ground.jsx';
import { createOffice1Desk } from '../objects/Office1Desk.jsx';
import { createOffice2Desks } from '../objects/Office2Desks.jsx';
import { createOffice4Desks } from '../objects/Office4Desks.jsx';
import { createOffice6Desks } from '../objects/Office6Desks.jsx';
import { createMeetingRoom } from '../objects/MeetingRoom.jsx';
import { createCharacters } from '../objects/Characters.jsx';
import { createOpenspace } from '../objects/Openspace.jsx';
import { createHighlighter } from "../utils/highlight.js";
//import { apiTest } from "../utils/apiTest.js";


let clock = new THREE.Clock();

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    //apiTest();

    const { camera, resize: resizeCamera, attachResetButton } = createCamera(gameWindow);
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);
    const ground = createGround();

    scene.add(ground);
    scene.add(createLight(-25,-25,25,25));
    scene.add(createLight(25,25,-25,-25));

    // Load Meeting Room
    const meetingRoomElements = createMeetingRoom(-25,-25);
    scene.add(meetingRoomElements.elements);
    const meetingRoomElements2 = createMeetingRoom(-25,meetingRoomElements.endZ);
    scene.add(meetingRoomElements2.elements);
    const meetingRoomElements3 = createMeetingRoom(-25,meetingRoomElements2.endZ);
    meetingRoomElements3.elements.rotation.y = Math.PI/2;
    meetingRoomElements3.elements.position.set(14,0,0);
    scene.add(meetingRoomElements3.elements);
    const meetingRoomElements4 = createMeetingRoom(-25,meetingRoomElements2.endZ);
    meetingRoomElements4.elements.rotation.y = Math.PI/2;
    meetingRoomElements4.elements.position.set(2,0,0);
    scene.add(meetingRoomElements4.elements);

    // Load Open spaces
    const openspace1 = createOpenspace(-22,18,7);
    scene.add(openspace1);
    const openspace2 = createOpenspace(-22,10,7);
    scene.add(openspace2);
    const openspace3 = createOpenspace(-22,2,5);
    scene.add(openspace3);

    const openspace4 = createOpenspace(-22,2,10);
    openspace4.rotation.y = Math.PI/2;
    openspace4.position.set(16,0,-14);
    scene.add(openspace4);
    const openspace5 = createOpenspace(-22,2,10);
    openspace5.rotation.y = Math.PI/2;
    openspace5.position.set(4,0,-14);
    scene.add(openspace5);

    // Load Office
    const office1 = createOffice1Desk(25-6, 0, -25);
    scene.add(office1);
    const office2 = createOffice1Desk(25-12, 0, -25);
    scene.add(office2);
    const office3 = createOffice2Desks(19, 0, 6.98);
    office3.rotation.y = Math.PI*.5;
    scene.add(office3);
    const office4 = createOffice4Desks(-1.04, 0, -25);
    scene.add(office4);
    const office5 = createOffice6Desks(0, 0, -9.98);
    office5.rotation.y = Math.PI*.5;
    scene.add(office5);

    // Load Characters
    const {characters, groupCharacters} = createCharacters();
    scene.add(groupCharacters);

    const lights = createSetupLight();
    for (let i=0; i<lights.length; i++) {           
        scene.add(lights[i]);
    }

    const controls = createControls(camera,gameWindow);

    attachResetButton(controls);
    createHighlighter(camera, controls, renderer, groupCharacters);
    
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