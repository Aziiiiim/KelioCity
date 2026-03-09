import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initChar } from '../../objects/Characters.jsx';

const scenes = document.querySelectorAll(".scene-wrap");
let selectedScene = null;

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

    let spriteName = "";
    if(id=="M"){
        spriteName = "Man1";
    }
    else if(id=="F"){
        spriteName = "Woman1";
    }
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


const nextBtn = document.getElementById("btn-next");
const backBtn = document.getElementById("btn-back");

nextBtn.addEventListener("click", () => {
    if(!selectedScene) return;

    sessionStorage.setItem("gender", selectedScene);

    window.location.href = "../html/spriteChoice.html";
});

backBtn.addEventListener("click", () => {
    window.location.href = "../html/register.html";
});