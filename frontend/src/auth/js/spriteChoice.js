import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initChar } from '../../objects/Characters.jsx';
import { safeJson } from "./utils.js";

const scenes = document.querySelectorAll(".scene-wrap");

const gender = sessionStorage.getItem("gender");
const SPRITES = {M: {1: "Man1", 2: "Man2",3: "Man3",},F: {1: "Woman1",2: "Woman2",3: "Woman3",}};
let selectedScene = null;
let selectedSpriteName = null;

document.addEventListener("click", (e) => {
    if (e.target.closest(".scene-wrap")) return;
    if (e.target.closest(".actions")) return;

    deselectScene();
});

scenes.forEach(sceneWrap => {
    const id = sceneWrap.dataset.scene;
    const canvas = sceneWrap.querySelector("canvas");
    initCharScene(canvas, id);
    sceneWrap.addEventListener("click", () => {
        selectScene(sceneWrap);
    });
});

function selectScene(sceneWrap) {
    selectedScene = sceneWrap.dataset.scene;
    selectedSpriteName = SPRITES[gender][selectedScene];

    scenes.forEach(s => s.classList.remove("selected"));
    sceneWrap.classList.add("selected");
}

function deselectScene() {
    selectedScene = null;
    scenes.forEach(s => s.classList.remove("selected"));
}

export default function initCharScene(canvas, id){
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 1.4, 3);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(2, 3, 2);
    scene.add(dir);

    
    let spriteName = SPRITES[gender][id];

    const clock = new THREE.Clock();
    let characterRef = null;
    let idx = 0;
    let timer = 0;       
    const SEQ = [
        { name: "Idle",     dur: 3 },
        { name: "Walk",     dur: 3 },
        { name: "Sitting",  dur: 3 },
        { name: "Standing", dur: 0.6 },
    ];
    initChar("/assets/characters/"+spriteName+".glb", function(character) {
        characterRef = character;
        characterRef.play(SEQ[0].name);
        scene.add(character.scene);
        controls.target.set(0, 1.2, 0);
        controls.update();
    });

    function resizeToDisplaySize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    function animate() {
        requestAnimationFrame(animate);
        resizeToDisplaySize();
        controls?.update();
        const dt = clock.getDelta();
        if (characterRef) {
            characterRef.mixer.update(dt);
            timer += dt;
            const step = SEQ[idx];
            if (timer >= step.dur) {
                timer = 0;
                idx = (idx + 1) % SEQ.length;
                characterRef.play(SEQ[idx].name);
            }
        }
        renderer.render(scene, camera);
    }
    animate();
}


const createBtn = document.getElementById("btn-create");
const backBtn = document.getElementById("btn-back");

createBtn.addEventListener("click",async () => {
    if(!selectedScene) return;

    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");
    const phoneNumber = sessionStorage.getItem("phoneNumber");

    const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, phoneNumber, sprite: selectedSpriteName.toUpperCase() }),
    });

    if (!res.ok) {
        return;
    }
    sessionStorage.clear();
    sessionStorage.clear();
    const data = await safeJson(res);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("employeeId", String(data.employeeId));
    
    window.location.href = "/index.html?mode=REGISTER";
});

backBtn.addEventListener("click", () => {
    window.location.href = "../html/genderChoice.html";
});