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
import { createStairs } from '../objects/Stairs.jsx';
import { initChar } from '../objects/Characters.jsx';
import { createOpenspace } from '../objects/Openspace.jsx';
import { createInteractionManager, doorPlugin, employeePlugin, roomPlugin, filtersPlugin } from "../utils/interactionManager.js";
import { openSidebar, openMeetingRoomSidebar, openOfficeSidebar  } from '../utils/sidebar.js';
//import { apiTest } from "../utils/apiTest.js";

let _camera = null;
let _controls = null;
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

    let floorId = "2";
    fetch('/api/floors/'+floorId)
        .then(res => res.json())
        .then(floor => {
            const ground = createGround(floor["lengthX"],floor["lengthZ"]);
            scene.add(ground);
            scene.add(createLight(-floor["lengthX"]/2,-floor["lengthZ"]/2,floor["lengthX"]/2,floor["lengthZ"]/2));
            scene.add(createLight(floor["lengthX"]/2,floor["lengthZ"]/2,-floor["lengthX"]/2,-floor["lengthZ"]/2));
        }).catch(err => console.error("Erreur API:", err));


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
    interaction.addPlugin(roomPlugin({ camera, controls,onlyTypes: ["MeetingRoom", "Office1Desk", "Office2Desks", "Office4Desks", "Office6Desks"] })); 
    
    const { toggleAvailable, toggleOccupied } = filtersPlugin(scene.groupCharacters);
    const bouton_available = document.getElementById("available-btn");
    bouton_available.addEventListener("click", () => {
        toggleAvailable(interaction);
    });
    const bouton_occupied = document.getElementById("occupied-btn");
    bouton_occupied.addEventListener("click", () => {
        toggleOccupied(interaction);
    });
    
    fetch("/api/rooms/floor/"+floorId)
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
                else if (roomType === "Stairs") {
                    roomObj = createStairs();
                }
                if (roomObj) {
                    roomElements = roomObj.elements;
                    objectList.push(roomObj);
                }
                if (!roomElements) continue;

                roomElements.userData.kind = "room";
                roomElements.userData.roomType = roomType;
                roomElements.userData.roomId = rooms[i].id;
                roomElements.userData.roomName = rooms[i]["roomName"];
                roomElements.rotation.y = (rooms[i]["orientationDeg"] / 180) * Math.PI;
                roomElements.position.set(rooms[i]["coordX1"], 0, rooms[i]["coordZ1"]);

                roomList.push(roomElements);
                scene.groupRooms.add(roomElements);
           }
           fetch("/api/employees/floor/"+floorId)
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

        _camera = camera;
        _controls = controls;

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
    cameraOn(_camera, _controls, root);
}

function findRoomById(roomId) {
    const id = Number(roomId);
    return roomList.find(r => Number(r.userData?.roomId) === id) || null;
}

async function findEmployeeByDeskId(deskId) {
  // Option la plus simple: charger tous les employés et filtrer
  // (si tu as un endpoint /api/desks/{id}/employee, remplace par ça)
  const res = await fetch("/api/employees");
  const employees = await res.json();
  return (employees || []).find(e => Number(e?.desk?.id) === Number(deskId)) || null;
}

export async function selectDesk(deskId) {
  try {
    const dres = await fetch(`/api/desks/${deskId}`);
    if (!dres.ok) return;
    const desk = await dres.json();
    const employee = await findEmployeeByDeskId(desk.id);
    if (!employee) {
      const roomId = desk?.room?.id;
      if (roomId) selectObject("room", roomId);
      return;
    }
    selectEmployee(employee.id);
  } catch (e) {
  }
}

export function selectObject(type, id) {
    if (type === "employee") {
        selectEmployee(id);
        return;
    }
    if (type === "room") {
        const roomObj = findRoomById(id);
        if (!roomObj) return;
    
        const roomType = roomObj.userData?.roomType;
        if (roomType === "MeetingRoom") {
            openMeetingRoomSidebar(roomObj);
        }
        else{
            openOfficeSidebar(roomObj);
        }

        cameraOn(_camera, _controls, roomObj);
    }
    if(type === "desk"){
        selectDesk(id);
        return;
    }
    return;
}

