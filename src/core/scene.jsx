import * as THREE from 'three';
import { createCamera,onMouseDown as camMouseDown, onMouseUp as camMouseUp, onMouseMove as camMouseMove } from './camera.jsx';
import { createSpinningCube } from '../objects/SpinningCube.jsx';
import { createRenderer } from './renderer.jsx';
import {createLight} from './lights.jsx';
import {createMeetingRoom} from "../objects/MeetingRoom.jsx";
let activeCamera = null ;

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
    activeCamera = camera;
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);

    // Load cube
    const cube = createSpinningCube();
    scene.add(cube.mesh);

    // Load Meeting Room
    const meetingRoomElements = createMeetingRoom();
    function loadLoopMeetingRoom() {
        requestAnimationFrame(loadLoopMeetingRoom);
        for (let i=0; i<meetingRoomElements.length; i++) {
            if (!scene.children.includes(meetingRoomElements[i])) {
                scene.add(meetingRoomElements[i]);
            }
        }
    }
    loadLoopMeetingRoom();

    const light = createLight();
    scene.add(light);

    function draw(){
        cube.update();
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