import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initChar } from '../../objects/Characters.jsx';
import { safeJson } from "./utils.js";

const scenes = document.querySelectorAll(".scene-wrap");

// récupère le genre choisi à l'étape précédente
const gender = sessionStorage.getItem("gender");

// liste des sprites selon genre + numéro
const SPRITES = {
    M: {1: "Man1", 2: "Man2", 3: "Man3", 4: "Man4"},
    F: {1: "Woman1", 2: "Woman2", 3: "Woman3", 4: "Woman4"}
};

let selectedScene = null;
let selectedSpriteName = null;

// clic hors scène → désélection
document.addEventListener("click", (e) => {
    if (e.target.closest(".scene-wrap")) return;
    if (e.target.closest(".actions")) return;

    deselectScene();
});

// initialise chaque preview 3D
scenes.forEach(sceneWrap => {
    const id = sceneWrap.dataset.scene; // ex: 1, 2, 3, 4
    const canvas = sceneWrap.querySelector("canvas");

    initCharScene(canvas, id);

    sceneWrap.addEventListener("click", () => {
        selectScene(sceneWrap);
    });
});

function selectScene(sceneWrap) {
    selectedScene = sceneWrap.dataset.scene;
    selectedSpriteName = SPRITES[gender][selectedScene]; // nom réel du sprite choisi

    scenes.forEach(s => s.classList.remove("selected"));
    sceneWrap.classList.add("selected"); // effet visuel
}

function deselectScene() {
    selectedScene = null;
    scenes.forEach(s => s.classList.remove("selected"));
}

// --- INITIALISATION DE LA SCÈNE THREE.JS ---
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

    // caméra
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 1.4, 3);

    // contrôle souris
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // lumières
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(2, 3, 2);
    scene.add(dir);

    // récupère le sprite à afficher
    let spriteName = SPRITES[gender][id];

    const clock = new THREE.Clock();
    let characterRef = null;

    // gestion des animations
    let idx = 0;
    let timer = 0;
    const SEQ = [
        { name: "Idle",     dur: 3 },
        { name: "Walk",     dur: 3 },
        { name: "Sitting",  dur: 3 },
        { name: "Standing", dur: 0.6 },
    ];

    // charge le personnage 3D
    initChar("/assets/characters/" + spriteName + ".glb", function(character) {
        characterRef = character;
        characterRef.play(SEQ[0].name); // démarre avec Idle
        scene.add(character.scene);

        controls.target.set(0, 1.2, 0); // centre vue sur le perso
        controls.update();
    });

    // adapte le rendu à la taille du canvas
    function resizeToDisplaySize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    // boucle d'animation
    function animate() {
        requestAnimationFrame(animate);

        resizeToDisplaySize();
        controls?.update();

        const dt = clock.getDelta();

        if (characterRef) {
            characterRef.mixer.update(dt);
            timer += dt;

            const step = SEQ[idx];

            // passe à l'animation suivante
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

// --- BOUTONS ---
const createBtn = document.getElementById("btn-create");
const backBtn = document.getElementById("btn-back");

// envoie les infos d'inscription
createBtn.addEventListener("click", async () => {
    if(!selectedScene) return; // rien faire si aucun sprite choisi

    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");
    const phoneNumber = sessionStorage.getItem("phoneNumber");

    const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            sprite: selectedSpriteName.toUpperCase()
        }),
    });

    if (!res.ok) {
        return; // en cas d'erreur, on stoppe
    }

    sessionStorage.clear(); // nettoie anciennes données
    sessionStorage.clear();

    const data = await safeJson(res);

    // garde les infos utiles après création du compte
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("employeeId", String(data.employeeId));

    window.location.href = "/index.html?mode=REGISTER";
});

// retour à l'étape précédente
backBtn.addEventListener("click", () => {
    window.location.href = "../html/genderChoice.html";
});