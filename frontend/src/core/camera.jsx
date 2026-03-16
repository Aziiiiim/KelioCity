import * as THREE from 'three';
import gsap from "gsap"
import { openSidebar } from '../utils/sidebar';

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(10,20,20);
  const initialPoint = new THREE.Object3D();
  initialPoint.position.set(0, 0, 0);
  initialPoint.focusPosition = new THREE.Vector3(10, 20, 20); 



  function attachResetButton(controls) {
      const btn = document.getElementById("reset-camera-btn");
      btn.addEventListener("click", () => {
          reset(controls);
      });
  }

    function attachZoomSelfButton(controls, getSelf){
        const btn = document.getElementById("zoom-self-btn");
        btn.addEventListener("click", () =>{
            const self = getSelf?.();
            if (!self) {
                return;
            }
            cameraOn(camera,controls,self);
            openSidebar(self.userData.employee);
        });
    }

  function reset(controls) {
    cameraOn(camera, controls, initialPoint);
  }

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  }

  return { camera, resize,attachResetButton, attachZoomSelfButton };
}

export function cameraOn (camera, controls, obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const focus = obj.focusPosition.clone();
    let angle = 0;
    if (obj.userData.employee) {
        angle = (obj.userData.employee.desk.deskType.orientationDeg + obj.userData.employee.desk.room.orientationDeg) / 180 * Math.PI;
        if (window.floorId !== obj.userData.employee.desk.room.floor.id) {
            window.floorId = obj.userData.employee.desk.room.floor.id;
            window.scene.updateFloor(window.floorId);
        }
    }
    const rotatedFocus = focus.clone().applyAxisAngle(new THREE.Vector3(0,1,0), angle);

    // Position de caméra souhaitée 
    const camPos = center.clone().add(rotatedFocus);
    const startTarget = controls.target.clone();

    const targetProxy = {
        x: startTarget.x,
        y: startTarget.y,
        z: startTarget.z
    };

    gsap.to(camera.position, {
        duration: 1.5,
        x: camPos.x,
        y: camPos.y,
        z: camPos.z,
        ease: "power2.inOut",
        onUpdate: () => {
            // Mise à jour progressive de la target pendant le mouvement
            controls.target.set(targetProxy.x, targetProxy.y, targetProxy.z);
            controls.update();
        }
    });


    gsap.to(targetProxy, {
        duration: 1.5,
        x: center.x,
        y: center.y,
        z: center.z,
        ease: "power2.inOut"
    });
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