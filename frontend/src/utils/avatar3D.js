import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initChar } from "../objects/Characters.jsx";

/**
 * Render un perso (glb) dans un canvas.
 * Retourne un objet { dispose, setSprite } si tu veux changer plus tard.
 */
export function mountAvatar3D(canvas, spriteName) {
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
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.set(0, 1.2, 0);
  controls.update();

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(2, 3, 2);
  scene.add(dir);

  const clock = new THREE.Clock();
  let raf = 0;
  let characterRef = null;

  const SEQ = [
    { name: "Idle", dur: 2.5 },
    { name: "Walk", dur: 2.5 },
    { name: "Sitting", dur: 2.5 },
    { name: "Standing", dur: 0.6 },
  ];
  let idx = 0;
  let timer = 0;

  function resizeToDisplaySize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function loadSprite(name) {
    // Si on change, on enlève l'ancien
    if (characterRef?.scene) {
      scene.remove(characterRef.scene);
    }
    characterRef = null;

    initChar(`/assets/characters/${name}.glb`, (character) => {
      characterRef = character;
      characterRef.play(SEQ[0].name);
      scene.add(character.scene);
    });
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    resizeToDisplaySize();
    controls.update();

    const dt = clock.getDelta();
    if (characterRef) {
      characterRef.mixer.update(dt);
      timer += dt;
      if (timer >= SEQ[idx].dur) {
        timer = 0;
        idx = (idx + 1) % SEQ.length;
        characterRef.play(SEQ[idx].name);
      }
    }
    renderer.render(scene, camera);
  }

  loadSprite(spriteName);
  animate();

  function dispose() {
    cancelAnimationFrame(raf);
    controls.dispose();
    renderer.dispose();
  }

  return {
    dispose,
    setSprite: loadSprite,
  };
}