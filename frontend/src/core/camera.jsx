import * as THREE from 'three';

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(10,20,20);
  const initialPosition = camera.position.clone();

  const initialTarget = new THREE.Vector3(0, 0, 0);


  function attachResetButton(controls) {
      const btn = document.getElementById("reset-camera-btn");
      btn.addEventListener("click", () => {
          reset(controls);
      });
  }


  function reset(controls) {
    camera.position.copy(initialPosition);
    console.log("camera BEFORE reset:", camera.position);

    if (controls) {
      const old = controls.enableDamping;
      controls.enableDamping = false;

      controls.target.copy(initialTarget);
      controls.update();

      controls.enableDamping = old;
      console.log("camera AFTER reset:", camera.position);

    }
  }

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  }

  return { camera, resize,attachResetButton };
}