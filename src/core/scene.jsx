import * as THREE from 'three';
import { createCamera} from './camera.jsx';
import { createSpinningCube } from '../objects/SpinningCube.jsx';
import { createRenderer } from './renderer.jsx';
import {createLight} from './lights.jsx';
import { createControls } from './controls.jsx';
import {createMeetingRoom} from "../objects/MeetingRoom.jsx";

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);

    // Load cube
    const cube = createSpinningCube();
    scene.add(cube.mesh);


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
    loadLoopMeetingRoom();


    const controls = createControls(camera,gameWindow);

    function draw(){
        cube.update();
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