import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initChar } from '../../objects/Characters.jsx';

const scenes = document.querySelectorAll(".scene-wrap");

scenes.forEach(sceneWrap => {
  const id = sceneWrap.dataset.scene;
  const canvas = sceneWrap.querySelector("canvas");

  console.log("Init scène", id, canvas);

  initCharScene(canvas, id);
});

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
    if(id=="1"){
        spriteName = "Man1";
    }
    else if(id=="2"){
        spriteName = "Man2";
    }
    else{
        spriteName = "Man3";
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

