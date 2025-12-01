import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCamera} from './camera.jsx';
import { createRenderer } from './renderer.jsx';
import {createLight, createSetupLight} from './lights.jsx';
import { createControls } from './controls.jsx';
import { createGround } from '../objects/Ground.jsx';
import { createOffice } from '../objects/Office.jsx';
import { createMeetingRoom } from '../objects/MeetingRoom.jsx';
import { createCharacters } from '../objects/Characters.jsx';
import { createOpenspace } from '../objects/Openspace.jsx';
import { apiTest } from "../utils/apiTest.js";


let clock = new THREE.Clock();

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    //apiTest();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);
    const ground = createGround();

    scene.add(ground);
    scene.add(createLight(-25,-25,25,25));
    scene.add(createLight(25,25,-25,-25));

     fetch("http://localhost:8080/api/rooms")
        .then(res => res.json())
        .then(rooms => {
            for (let i=0; i < rooms.length; i++) {
                 let roomElements;
                 if (rooms[i]["roomType"]["roomtypeName"] === "MeetingRoom") {
                     roomElements = createMeetingRoom().elements;
                 }
                 else if (rooms[i]["roomType"]["roomtypeName"] === "Office") {
                     roomElements = createOffice();
                 } else if (rooms[i]["roomType"]["roomtypeName"] === "Openspace") {
                     roomElements = createOpenspace(rooms[i]["openspaceNumber"]);
                 }
                 roomElements.rotation.y = rooms[i]["orientationDeg"] / 180 * Math.PI;
                 roomElements.position.set(rooms[i]["coordX1"], 0, rooms[i]["coordZ1"]);
                 scene.add(roomElements);
            }
        })
        .catch(err => console.error("Erreur API:", err));
     
    // Load Characters
    const {characters, groupCharacters} = createCharacters();
    scene.add(groupCharacters);

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