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
import { initChar } from '../objects/Characters.jsx';
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

     const characters = [];
     const groupCharacters = new THREE.Group();
     fetch("http://localhost:8080/api/rooms")
        .then(res => res.json())
        .then(rooms => {
            for (let i=0; i < rooms.length; i++) {
                 let roomElements;
                 if (rooms[i]["roomType"]["roomtypeName"] === "MeetingRoom") {
                     roomElements = createMeetingRoom().elements;
                 }
                 else if (rooms[i]["roomType"]["roomtypeName"] === "Office") {
                     roomElements = createOffice1Desk();
                 } else if (rooms[i]["roomType"]["roomtypeName"] === "Openspace") {
                     roomElements = createOpenspace(rooms[i]["openspaceNumber"]);
                 }
                 roomElements.rotation.y = rooms[i]["orientationDeg"] / 180 * Math.PI;
                 roomElements.position.set(rooms[i]["coordX1"], 0, rooms[i]["coordZ1"]);
                 scene.add(roomElements);
            }

            fetch("http://localhost:8080/api/employees")
                .then(res => res.json())
                .then(employees => {
                    for (let i=0; i < employees.length; i++) {
                        let spriteName = employees[i]["sprite"].charAt(0) + employees[i]["sprite"].slice(1).toLowerCase();
                        let pos_y = 0;
                        if (employees[i]["desk"]["room"]["roomType"]["roomtypeName"] === "Openspace") {
                            pos_y = 0.4;
                        }
                        initChar("./assets/characters/"+spriteName+".glb", function(character) {
                            character.scene.rotation.y = (employees[i]["desk"]["orientationDeg"]+employees[i]["desk"]["room"]["orientationDeg"])/180*Math.PI;
                            character.scene.position.set(employees[i]["desk"]["coordX"], pos_y, employees[i]["desk"]["coordZ"]);
                            character.play("Sitting");
                            scene.add(character.scene);
                            characters.push(character);
                            groupCharacters.add(character);
                        });
                    }
                })
                .catch(err => console.error("Erreur API:", err));
        })
        .catch(err => console.error("Erreur API:", err));

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