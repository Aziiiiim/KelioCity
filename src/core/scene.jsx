import * as THREE from 'three';
import { createCamera} from './camera.jsx';
import { createRenderer } from './renderer.jsx';
import {createLight} from './lights.jsx';
import { createControls } from './controls.jsx';
import { createGround } from '../objects/Ground.jsx';
import {createMeetingRoom} from "../objects/MeetingRoom.jsx";

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
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
    scene.add(createLight(-25,-25, meetingRoomElements.endX, meetingRoomElements.endZ));
    scene.add(createLight(meetingRoomElements.endX, meetingRoomElements.endZ, -25,-25));


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

    return { start, stop, scene, camera, renderer };
}