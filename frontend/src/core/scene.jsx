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
import { createInteractionManager, doorPlugin, employeePlugin, roomPlugin } from "../utils/interactionManager.js";
//import { apiTest } from "../utils/apiTest.js";


let clock = new THREE.Clock();
const roomList = [];
const characters = [];
const objectList = [];
let interaction = null;

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

    interaction = createInteractionManager({
        camera,
        renderer,
        targets: [scene.groupRooms, scene.groupCharacters],
    });
    interaction.addPlugin(doorPlugin());
    interaction.addPlugin(employeePlugin({ camera, controls, charactersGroup: scene.groupCharacters,refresh: interaction.refresh }));
    interaction.addPlugin(roomPlugin({ onlyTypes: ["MeetingRoom"] })); 
    fetch("/api/rooms")
       .then(res => res.json())
       .then(rooms => {
           for (let i=0; i < rooms.length; i++) {
                const roomType = rooms[i]?.roomType?.roomtypeName;
                let roomObj = null;
                let roomElements;

                if (roomType === "MeetingRoom") {
                    roomObj = createMeetingRoom();
                } 
                else if (roomType === "Office1Desk") {
                    roomObj = createOffice1Desk();
                } 
                else if (roomType === "Office2Desks") {
                    roomObj = createOffice2Desks();
                } 
                else if (roomType === "Office4Desks") {
                    roomObj = createOffice4Desks();
                } 
                else if (roomType === "Office6Desks") {
                    roomObj = createOffice6Desks();
                }
                else if (roomType === "Openspace") {
                    roomElements = createOpenspace(rooms[i]["openspaceNumber"]);
                }
                if (roomObj) {
                    roomElements = roomObj.elements;
                    objectList.push(roomObj);
                }
                if (!roomElements) continue;

                roomElements.userData.kind = "room";
                roomElements.userData.roomType = roomType;
                roomElements.userData.roomId = rooms[i].id;

                roomElements.rotation.y = (rooms[i]["orientationDeg"] / 180) * Math.PI;
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
                       initChar("/assets/characters/"+spriteName+".glb", function(character) {
                           character.scene.rotation.y = (employees[i]["desk"]["orientationDeg"]+employees[i]["desk"]["room"]["orientationDeg"])/180*Math.PI;
                           character.scene.position.set(employees[i]["desk"]["coordX"], pos_y, employees[i]["desk"]["coordZ"]);
                           character.play("Sitting");
                           character.scene.userData.employee = employees[i];
                           scene.groupCharacters.add(character.scene);
                           characters.push(character);
                           loadedChars += 1;
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
  const id = Number(employeeId);
  const character = characters.find(
    c => Number(c.scene.userData?.employee?.id) === id
  );

  if (!character) return;
  const root = character.scene;
  openSidebar(root.userData.employee);
  cameraOn(camera, controls, root);

  interaction?.refresh?.();
}