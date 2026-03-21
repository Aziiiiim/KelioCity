import * as THREE from 'three';
import gsap from "gsap"
import { openSidebar } from '../utils/sidebar';
import {selectObject} from "./scene.jsx";
// file to create and manage the camera

// create the camera and attach camera buttons (reset camera, zoom on me...) to their functionalities
export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    75, // fov
    container.clientWidth / container.clientHeight, // aspect ratio
    0.1, // near
    1000 // far
  );
  camera.position.set(10,20,20);

  // we configure the initial point (reset camera point) and link it the reset camera button
  const initialPoint = new THREE.Object3D();
  initialPoint.position.set(0, 0, 0);
  initialPoint.focusPosition = new THREE.Vector3(10, 20, 20);
  function attachResetButton(controls) {
      const btn = document.getElementById("reset-camera-btn");
      btn.addEventListener("click", () => {
          reset(controls);
      });
  }
  function reset(controls) {
    cameraOn(camera, controls, initialPoint);
  }

  // we make the zoom on me button to go on ourselves and open the employee sidebar
  function attachZoomSelfButton(controls, getSelf){
      const btn = document.getElementById("zoom-self-btn");
      btn.addEventListener("click", () =>{
          const self = getSelf?.();
          if (!self) {
              return;
          }

          let objectFloorId = self.userData.employee.desk.room.floor.id;
          if (window.floorId !== objectFloorId) {
            window.floorId = objectFloorId;

            window.scene.updateFloor(window.floorId);
            // Wait for the assets and employees to load (approximately 500-800ms)
            setTimeout(() => {
                cameraOn(camera,controls,self);
                openSidebar(self.userData.employee);

                const select = document.getElementsByClassName("select-floor")[0];
                if (select) {
                    select.value = window.floorId;
                }
            }, 800);
        } else {
            cameraOn(camera,controls,self);
            openSidebar(self.userData.employee);
        }
      });
  }

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  }

  return { camera, resize, attachResetButton, attachZoomSelfButton };
}

// function to spot an object on the camera
export function cameraOn (camera, controls, obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // we get the focus position with the right angle (and update the floor if we are not on the right one)
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

    // camera position wanted
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
            // Progressive target update during movement
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