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
import { createForum } from '../objects/Forum.jsx';
import { createStand } from '../objects/StandForum.jsx';
import { createClassroom1 } from '../objects/Classroom1.jsx';
import { createClassroom2 } from '../objects/Classroom2.jsx';
import { createStairs } from '../objects/Stairs.jsx';
import { initChar } from '../objects/Characters.jsx';
import { createOpenspace } from '../objects/Openspace.jsx';
import { createInteractionManager, doorPlugin, employeePlugin, roomPlugin, filtersPlugin, deskSelectionPlugin } from "../utils/interactionManager.js";
import { openSidebar, openMeetingRoomSidebar, openOfficeSidebar  } from '../utils/sidebar.js';
import { apiFetch } from "../utils/apiFetch.js";
//import { apiTest } from "../utils/apiTest.js";

let _camera = null;
let _controls = null;
let _scene = null;
let clock = new THREE.Clock();
const roomList = [];
const characters = [];
const objectList = [];
let interaction = null;
let currentGround = null;
const currentLights = [];
let currentMode = "NORMAL";
let _reloadFloor = null;
let backgroundSphere = null;


// Shader pour le dégradé de fond 3D
const vertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vPosition;
  void main() {
    // Normaliser la coordonnée Y de la sphère (de -1000 à 1000) vers 0 à 1 pour le dégradé
    float normalizedY = (vPosition.y + 1000.0) / 2000.0;
    // Dégradé vertical : bleu fixe sur 0-30%, vert fixe sur 70-100%, dégradé entre 30-70%
    vec3 colorTop = vec3(0.125, 0.357, 0.588); 
    // clair et flashy : 0.443, 0.847, 0.941 // plus foncé : 0.275, 0.510, 0.706
    vec3 colorBottom = vec3( 0.345, 0.537, 0.361);
    //0.345, 0.537, 0.361 // #339b3b
    vec3 color;
    float a = 0.4;
    float b = 0.5;
    if (normalizedY < a) {
      color = colorBottom; // Vert fixe en bas
    } else if (normalizedY > b) {
      color = colorTop; // Bleu fixe en haut
    } else {
      // Dégradé entre 40% et 60%
      float t = (normalizedY - a) / (b-a);
      color = mix(colorBottom, colorTop, t);
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;



let myEmployeeId = null;
let myCharacterRoot = null; 

export function getMyEmployeeId() {
  return myEmployeeId;
}

export function getMyCharacterRoot() {
  return myCharacterRoot;
}


export function setMode(mode) {
    const next = (mode === "REGISTER") ? "REGISTER" : "NORMAL";
    if (next === currentMode) return;

    if (currentMode === "NORMAL") exitNormalMode();
    if (currentMode === "REGISTER") exitRegisterMode();

    currentMode = next;

    if (currentMode === "NORMAL") enterNormalMode();
    if (currentMode === "REGISTER") enterRegisterMode();
}

function applyMode() {
  if (currentMode === "REGISTER") enterRegisterMode();
  else enterNormalMode();
}

function setRegisterUIHidden(hidden) {
    const ids = [
        "search-wrapper",
        "filter-wrapper",
        "available-btn",
        "occupied-btn",
        "logout-btn",
        "zoom-self-btn",
    ];

    for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        el.classList.toggle("ui-hidden", hidden);
    }
}

function enterRegisterMode() {
    if (!interaction) return;
    const banner = document.getElementById("register-banner");
    if (banner) banner.classList.remove("hidden");
    setRegisterUIHidden(true); 
    interaction.clearPlugins();

    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.add("hidden");

    interaction.addPlugin(
        deskSelectionPlugin({
            charactersGroup: _scene.groupCharacters,
            onDeskSelected: async (deskId, root) => {
                try {

                    interaction.setPersistentStyle(root, {
                        color: 0x00ff00,
                        emissive: 0x004400
                    });
                    const res = await apiFetch(`/api/me/desk`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ deskId }),
                    });

                    if (!res.ok) {
                        console.error("Assign desk failed:", res.status);
                        interaction.clearPersistentStyle(root);
                    return;
                    }
                    window.history.replaceState({}, "", "/index.html?mode=NORMAL");
                    setMode("NORMAL");
                    await _reloadFloor?.();
                } 
                catch (e) {
                    console.error(e);
                    interaction.clearPersistentStyle(root);
                }

            }
        })
    );
    //highlightAvailableDesks();
}

function exitRegisterMode() {

    if (!interaction) return;
    const banner = document.getElementById("register-banner");
    if (banner) banner.classList.add("hidden");
    setRegisterUIHidden(false); 
    interaction.clearPlugins();

    clearDeskHighlights();
}

function enterNormalMode() {
    if (!interaction) return;

    interaction.clearPlugins();

    interaction.addPlugin(doorPlugin());

    interaction.addPlugin(
        employeePlugin({
            camera: _camera,
            controls: _controls,
            charactersGroup: _scene.groupCharacters,
            refresh: interaction.refresh
        })
    );

    interaction.addPlugin(
        roomPlugin({
            camera: _camera,
            controls: _controls,
            onlyTypes: ["MeetingRoom", "Office1Desk", "Office2Desks", "Office4Desks", "Office6Desks", "Stairs", "Classroom1", "Classroom2", "StandForum"]
        })
    );

    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("hidden");
}
function exitNormalMode() {
    if (!interaction) return;
    interaction.clearPlugins();

    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.add("hidden");
}

function highlightAvailableDesks() {
    _scene.groupRooms.traverse((obj) => {
        if (obj.userData?.kind === "desk" && obj.userData?.isAvailable){
            interaction.setPersistentStyle(obj, {
                color: 0x00ff00,
                emissive: 0x002200
            });
        }
    });
}

function clearDeskHighlights() {
    _scene.groupRooms.traverse((obj) => {
        if (obj.userData?.kind === "desk") {
            interaction.clearPersistentStyle(obj);
        }
    });
}


export function createScene(floorId, mode){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();
    // Créer un environnement 3D dégradé avec une sphère
    const sphereGeometry = new THREE.SphereGeometry(1000, 32, 32); // Sphère géante pour envelopper la scène
    const sphereMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide, // Rendre l'intérieur de la sphère pour qu'elle entoure la caméra
    });
    backgroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(backgroundSphere);
    _scene = scene;
    //apiTest();

    const { camera, resize: resizeCamera, attachResetButton, attachZoomSelfButton } = createCamera(gameWindow);
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    const controls = createControls(camera,gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);
    const initialMode = (mode === "REGISTER") ? "REGISTER" : "NORMAL";
    currentMode = initialMode;
    myEmployeeId = Number(sessionStorage.getItem("employeeId"));
    async function loadFloor() {
        // Vider les anciennes données
        characters.forEach(char => {
            scene.groupCharacters.remove(char.scene);
        });
        characters.length = 0;
        roomList.length = 0;
        objectList.length = 0;
        
        // Supprimer l'ancien sol
        if (currentGround) {
            scene.remove(currentGround);
            currentGround = null;
        }
        
        // Supprimer les anciennes lumières
        currentLights.forEach(light => scene.remove(light));
        currentLights.length = 0;
        
        if (scene.groupRooms) scene.groupRooms.clear();
        if (scene.groupCharacters) scene.groupCharacters.clear();

        const desksRes = await apiFetch(`/api/desks/floor/${floorId}`);
        const desks = await desksRes.json();

        const desksByRoomId = new Map();
        for (const d of desks) {
            const rid = d.room?.id;
            if (!rid) continue;
            if (!desksByRoomId.has(rid)) desksByRoomId.set(rid, []);
            desksByRoomId.get(rid).push(d);
        }
        if (!scene.groupRooms) {
            scene.groupRooms = new THREE.Group();
            scene.add(scene.groupRooms);
        }
        if (!scene.groupCharacters) {
            scene.groupCharacters = new THREE.Group();
            scene.add(scene.groupCharacters);
        }

        // Nettoyer l'ancienne interaction
        if (interaction) {
            interaction.dispose?.();
        }

        interaction = createInteractionManager({
            camera,
            renderer,
            targets: [scene.groupRooms, scene.groupCharacters],
        });
        applyMode();
        const { toggleAvailable, toggleOccupied } = filtersPlugin(scene.groupCharacters);
        const bouton_available = document.getElementById("available-btn");
        const bouton_occupied = document.getElementById("occupied-btn");
        
        // Nettoyer les anciens listeners
        bouton_available.replaceWith(bouton_available.cloneNode(true));
        bouton_occupied.replaceWith(bouton_occupied.cloneNode(true));
        
        // Réattacher les éléments
        const new_bouton_available = document.getElementById("available-btn");
        const new_bouton_occupied = document.getElementById("occupied-btn");
        
        new_bouton_available.addEventListener("click", () => {
            toggleAvailable(interaction);
        });
        new_bouton_occupied.addEventListener("click", () => {
            toggleOccupied(interaction);
        });
        
        apiFetch("/api/rooms/floor/"+floorId)
        .then(res => res.json())
        .then(rooms => {
            const holes = [];
            for (let i=0; i < rooms.length; i++) {
                    const roomType = rooms[i]?.roomType?.roomtypeName;
                    let roomObj = null;
                    let roomElements;   
                    const list = desksByRoomId.get(rooms[i].id) || [];
                    const deskIds = list.map(d => d.id);

                    if (roomType === "MeetingRoom") {
                        roomObj = createMeetingRoom();
                    } 
                    else if (roomType === "Forum") {
                        roomObj = createForum();
                    } 
                    else if (roomType === "StandForum") {
                        roomObj = createStand();
                    } 
                    else if (roomType === "Office1Desk") {
                        roomObj = createOffice1Desk(deskIds);
                    } 
                    else if (roomType === "Classroom1") {
                        roomObj = createClassroom1();
                    } 
                    else if (roomType === "Classroom2") {
                        roomObj = createClassroom2();
                    } 
                    else if (roomType === "Office2Desks") {
                        roomObj = createOffice2Desks(deskIds);
                    } 
                    else if (roomType === "Office4Desks") {
                        roomObj = createOffice4Desks(deskIds);
                    } 
                    else if (roomType === "Office6Desks") {
                        roomObj = createOffice6Desks(deskIds);
                    }
                    else if (roomType === "Openspace") {
                        roomElements = createOpenspace(rooms[i]["openspaceNumber"], deskIds);
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
                    if (rooms[i]["nextFloor"] != null) {
                        roomElements.userData.nextFloor = rooms[i]["nextFloor"];
                    }
                    if (rooms[i]["position"] != null) {
                        roomElements.userData.position = rooms[i]["position"];
                    }
                    roomElements.rotation.y = (rooms[i]["orientationDeg"] / 180) * Math.PI;
                    let newX, newZ;
                    const cosAngle = Math.cos(rooms[i]["orientationDeg"] / 180 * Math.PI);
                    const sinAngle = Math.sin(rooms[i]["orientationDeg"] / 180 * Math.PI);
                    const tanAngle = Math.tan(rooms[i]["orientationDeg"] / 180 * Math.PI);
                    if ((rooms[i]["orientationDeg"] >= -45 && rooms[i]["orientationDeg"]<45) || (rooms[i]["orientationDeg"] >= -360 && rooms[i]["orientationDeg"]<-315) || (rooms[i]["orientationDeg"] >= 315 && rooms[i]["orientationDeg"]<360)) {
                        newX = rooms[i]["coordX1"];
                        newZ = rooms[i]["coordZ1"];
                    } else if ((rooms[i]["orientationDeg"] >= 45 && rooms[i]["orientationDeg"]<135) || (rooms[i]["orientationDeg"] >= -315 && rooms[i]["orientationDeg"]<-225)) {
                        newX = rooms[i]["coordX1"] - rooms[i]["roomType"]["lengthX"]*cosAngle;
                        newZ = rooms[i]["coordZ1"] + rooms[i]["roomType"]["lengthX"]*sinAngle;
                    } else if ((rooms[i]["orientationDeg"] >= 135 && rooms[i]["orientationDeg"]<225) || (rooms[i]["orientationDeg"] >= -225 && rooms[i]["orientationDeg"]<-135)) {
                        newX = rooms[i]["coordX1"] - (rooms[i]["roomType"]["lengthX"]+rooms[i]["roomType"]["lengthZ"]*tanAngle)*cosAngle;
                        newZ = rooms[i]["coordZ1"] + (-rooms[i]["roomType"]["lengthZ"]/cosAngle+(rooms[i]["roomType"]["lengthX"]+rooms[i]["roomType"]["lengthZ"]*tanAngle)*sinAngle);
                    } else if ((rooms[i]["orientationDeg"] >= 225 && rooms[i]["orientationDeg"]<315) || (rooms[i]["orientationDeg"] >= -135 && rooms[i]["orientationDeg"]<-45)) {
                        newX = rooms[i]["coordX1"] - rooms[i]["roomType"]["lengthZ"]*sinAngle;
                        newZ = rooms[i]["coordZ1"] - rooms[i]["roomType"]["lengthZ"]*cosAngle;
                    }
                    roomElements.position.set(newX, 0, newZ);
                    if (roomElements.userData.roomType == "Stairs" && roomElements.userData.position == "down") {
                        roomElements.position.set(newX, -5, newZ);
                        const hole = new THREE.Path();
                        const lengthX = sinAngle*rooms[i]["roomType"]["lengthZ"]; 
                        const lengthZ = -sinAngle*rooms[i]["roomType"]["lengthX"];
                        const centerX = newX ;
                        const centerZ = -newZ ;
                        hole.moveTo(centerX , centerZ ); 
                        hole.lineTo(centerX , centerZ + lengthZ);
                        hole.lineTo(centerX + lengthX, centerZ + lengthZ); 
                        hole.lineTo(centerX + lengthX, centerZ ); 
                        hole.lineTo(centerX , centerZ);
                        holes.push(hole);
                    }

                    roomList.push(roomElements);
                    scene.groupRooms.add(roomElements);
                    
            }
            
            setMode(currentMode);
            apiFetch("/api/floors/"+floorId)
            .then(res => res.json())
            .then(floor => {
                currentGround = createGround(floor["lengthX"],floor["lengthZ"], holes);
                scene.add(currentGround);
                const light1 = createLight(-floor["lengthX"]/2,-floor["lengthZ"]/2,floor["lengthX"]/2,floor["lengthZ"]/2);
                const light2 = createLight(floor["lengthX"]/2,floor["lengthZ"]/2,-floor["lengthX"]/2,-floor["lengthZ"]/2);
                scene.add(light1);
                scene.add(light2);
                currentLights.push(light1, light2);
            }).catch(err => console.error("Erreur API:", err));

            apiFetch("/api/employees/floor/"+floorId)
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
                            const roomOrientationRad = -employees[i]["desk"]["room"]["orientationDeg"]/180*Math.PI;
                            const newRelativeCoordX = employees[i]["desk"]["deskType"]["coordX"]*Math.cos(roomOrientationRad)-employees[i]["desk"]["deskType"]["coordZ"]*Math.sin(roomOrientationRad);
                            const newRelativeCoordZ = employees[i]["desk"]["deskType"]["coordX"]*Math.sin(roomOrientationRad)+employees[i]["desk"]["deskType"]["coordZ"]*Math.cos(roomOrientationRad);
                            character.scene.rotation.y = (employees[i]["desk"]["deskType"]["orientationDeg"]+employees[i]["desk"]["room"]["orientationDeg"])/180*Math.PI;
                            let newX, newZ;
                            const cosAngle = Math.cos(employees[i]["desk"]["room"]["orientationDeg"] / 180 * Math.PI);
                            const sinAngle = Math.sin(employees[i]["desk"]["room"]["orientationDeg"] / 180 * Math.PI);
                            const tanAngle = Math.tan(employees[i]["desk"]["room"]["orientationDeg"] / 180 * Math.PI);
                            if ((employees[i]["desk"]["room"]["orientationDeg"] >= -45 && employees[i]["desk"]["room"]["orientationDeg"]<45) || (employees[i]["desk"]["room"]["orientationDeg"] >= -360 && employees[i]["desk"]["room"]["orientationDeg"]<-315) || (employees[i]["desk"]["room"]["orientationDeg"] >= 315 && employees[i]["desk"]["room"]["orientationDeg"]<360)) {
                                newX = employees[i]["desk"]["room"]["coordX1"];
                                newZ = employees[i]["desk"]["room"]["coordZ1"];
                            } else if ((employees[i]["desk"]["room"]["orientationDeg"] >= 45 && employees[i]["desk"]["room"]["orientationDeg"]<135) || (employees[i]["desk"]["room"]["orientationDeg"] >= -315 && employees[i]["desk"]["room"]["orientationDeg"]<-225)) {
                                newX = employees[i]["desk"]["room"]["coordX1"] - employees[i]["desk"]["room"]["roomType"]["lengthX"]*cosAngle;
                                newZ = employees[i]["desk"]["room"]["coordZ1"] + employees[i]["desk"]["room"]["roomType"]["lengthX"]*sinAngle;
                            } else if ((employees[i]["desk"]["room"]["orientationDeg"] >= 135 && employees[i]["desk"]["room"]["orientationDeg"]<225) || (employees[i]["desk"]["room"]["orientationDeg"] >= -225 && employees[i]["desk"]["room"]["orientationDeg"]<-135)) {
                                newX = employees[i]["desk"]["room"]["coordX1"] - (employees[i]["desk"]["room"]["roomType"]["lengthX"]+employees[i]["desk"]["room"]["roomType"]["lengthZ"]*tanAngle)*cosAngle;
                                newZ = employees[i]["desk"]["room"]["coordZ1"] + (-employees[i]["desk"]["room"]["roomType"]["lengthZ"]/cosAngle+(employees[i]["desk"]["room"]["roomType"]["lengthX"]+employees[i]["desk"]["room"]["roomType"]["lengthZ"]*tanAngle)*sinAngle);
                            } else if ((employees[i]["desk"]["room"]["orientationDeg"] >= 225 && employees[i]["desk"]["room"]["orientationDeg"]<315) || (employees[i]["desk"]["room"]["orientationDeg"] >= -135 && employees[i]["desk"]["room"]["orientationDeg"]<-45)) {
                                newX = employees[i]["desk"]["room"]["coordX1"] - employees[i]["desk"]["room"]["roomType"]["lengthZ"]*sinAngle;
                                newZ = employees[i]["desk"]["room"]["coordZ1"] - employees[i]["desk"]["room"]["roomType"]["lengthZ"]*cosAngle;
                            }
                            character.scene.position.set(newRelativeCoordX+newX, pos_y, newRelativeCoordZ+newZ);
                            character.play("Sitting");
                            character.scene.userData.employee = employees[i];
                            if (myEmployeeId && Number(employees[i]?.id) === myEmployeeId) {
                                myCharacterRoot = character.scene;
                            }
                            scene.groupCharacters.add(character.scene);
                            characters.push(character);
                            loadedChars += 1;
                        });
                    }
                })
                .catch(err => console.error("Erreur API:", err));
        })
        .catch(err => console.error("Erreur API:", err));
    };
    _reloadFloor = loadFloor;

    loadFloor();
    const lights = createSetupLight();
    for (let i=0; i<lights.length; i++) {           
        scene.add(lights[i]);
    }

    attachResetButton(controls);
    attachZoomSelfButton(controls,() => myCharacterRoot);
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

            // Mettre à jour la position de la sphère pour qu'elle suive la caméra
            if (backgroundSphere) {
                backgroundSphere.position.copy(camera.position);
            }

            characters.forEach(c => c.mixer.update(delta));
            objectList.forEach(room => room.openDoor?.(delta));

            renderer.render(scene, camera);
        });
        }

        function stop() {
            renderer.setAnimationLoop(null);
        }

        function updateFloor(floor) {
            floorId = floor;
            loadFloor();
            camera.position.set(10,20,20);
            controls.reset();
        }

        _camera = camera;
        _controls = controls;

    return { start, stop, updateFloor, scene, camera, renderer, reload: loadFloor  };
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
  const res = await apiFetch("/api/employees");
  const employees = await res.json();
  return (employees || []).find(e => Number(e?.desk?.id) === Number(deskId)) || null;
}

export async function selectDesk(deskId) {
  try {
    const dres = await apiFetch(`/api/desks/${deskId}`);
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

