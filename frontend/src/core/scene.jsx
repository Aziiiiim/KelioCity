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
let highlighter = null;
const roomList = [];
const characters = [];
const objectList = [];

export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    //apiTest();

    const { camera, resize: resizeCamera, attachResetButton } = createCamera(gameWindow);
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    const controls = createControls(camera,gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);
    const ground = createGround();

    scene.add(ground);
    scene.add(createLight(-25,-25,25,25));
    scene.add(createLight(25,25,-25,-25));


    scene.groupRooms = new THREE.Group();
    scene.add(scene.groupRooms);
    scene.groupCharacters = new THREE.Group();
    scene.add(scene.groupCharacters);
    fetch("/api/rooms")
       .then(res => res.json())
       .then(rooms => {
           for (let i=0; i < rooms.length; i++) {
                let roomElements;
                if (rooms[i]["roomType"]["roomtypeName"] === "MeetingRoom") {
                    let meetingRoom = createMeetingRoom(function (doorPivot, toggleDoor) { createHighlighter(camera,controls,renderer, doorPivot, toggleDoor) });
                    roomElements = meetingRoom.elements;
                    objectList.push(meetingRoom);
                } else if (rooms[i]["roomType"]["roomtypeName"] === "Office1Desk") {
                    let office1desk = createOffice1Desk(function (doorPivot, toggleDoor) { createHighlighter(camera,controls,renderer,doorPivot,toggleDoor) })
                    roomElements = office1desk.elements;
                    objectList.push(office1desk);
                } else if (rooms[i]["roomType"]["roomtypeName"] === "Office2Desks") {
                    let office2desk = createOffice2Desks(function (doorPivot, toggleDoor) { createHighlighter(camera,controls,renderer,doorPivot,toggleDoor) })
                    roomElements = office2desk.elements;
                    objectList.push(office2desk);
                } else if (rooms[i]["roomType"]["roomtypeName"] === "Office4Desks") {
                    let office4desk = createOffice4Desks(function (doorPivot, toggleDoor) { createHighlighter(camera,controls,renderer,doorPivot,toggleDoor) })
                    roomElements = office4desk.elements;
                    objectList.push(office4desk);
                } else if (rooms[i]["roomType"]["roomtypeName"] === "Office6Desks") {
                    let office6desk = createOffice6Desks(function (doorPivot, toggleDoor) { createHighlighter(camera,controls,renderer,doorPivot,toggleDoor) })
                    roomElements = office6desk.elements;
                    objectList.push(office6desk);
                } else if (rooms[i]["roomType"]["roomtypeName"] === "Openspace") {
                    roomElements = createOpenspace(rooms[i]["openspaceNumber"]);
                }
                roomElements.rotation.y = rooms[i]["orientationDeg"] / 180 * Math.PI;
                roomElements.position.set(rooms[i]["coordX1"], 0, rooms[i]["coordZ1"]);
                roomList.push(roomElements);
                scene.groupRooms.add(roomElements);
           }
           fetch("/api/employees")
               .then(res => res.json())
               .then(employees => {
                   let loadedChars = 0;
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
                           character.scene.userData.employee = employees[i];
                           scene.groupCharacters.add(character.scene);
                           characters.push(character);
                           loadedChars += 1;
                           if (loadedChars === employees.length) {
                               highlighter = createHighlighter(camera, controls, renderer, scene.groupCharacters);
                           }
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

    attachResetButton(controls);

    function start() {
        function onResize() {
            resizeRenderer();
            resizeCamera();
        }
        window.addEventListener('resize', onResize);
        onResize();

        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();

            controls.update();

            if (camera.position.y < 0) camera.position.y = 0;

            characters.forEach(c => c.mixer.update(delta));
            objectList.forEach(room => room.openDoor?.(delta));

            renderer.render(scene, camera);
        });
        }

        function stop() {
            renderer.setAnimationLoop(null);
        }

    return { start, stop, scene, camera, renderer };
}

export function selectEmployee(employeeId) {
    let employeeObj = null;
    for (let i=0; i < characters.length; i++) {
        if (parseInt(characters[i].scene.userData.employee.id) === parseInt(employeeId)) {
            employeeObj = characters[i].scene;
        }
    }
    if (employeeObj) {
        highlighter.onClick(null, employeeObj);
    }
}