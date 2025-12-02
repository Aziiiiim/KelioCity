import * as THREE from 'three';
import gsap from "gsap"

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

export function cameraOn (camera, controls, obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    box.getCenter(center);
    console.log(center);

    // Position de caméra souhaitée 
    const camPos = center.clone().add(obj.focusPosition);

    gsap.to(camera.position, {
        duration: 1.5,
        x: camPos.x,
        y: camPos.y,
        z: camPos.z,
        ease: "power2.inOut"
    });

    controls.target.copy(center);
}

/*
function hideWallsBetweenCameraAndObj (camera, obj, walls) {
    const origin = camera.position.clone();
    const target = new THREE.Vector3();
    obj.getWorldPosition(target);

    const direction = target.clone().sub(origin).normalize();
    const ray = new THREE.Raycaster(origin, direction);

    const hits = ray.intersectObjects(walls, false);

    hits.forEach(hit => {
        hit.object.visible = false;
    });
}
*/
