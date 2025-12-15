import * as THREE from "three";
import { openSidebar, closeSidebar } from "./sidebar.js";
import { cameraOn } from "../core/camera.jsx";

export function createHighlighter(camera,controls, renderer, targetGroup, onclick = null ) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let highlighted = null;
    let originalMaterials = new Map();

    const highlight = (object) => {
        if (highlighted === object) return;

        if (highlighted) {
            const mats = originalMaterials.get(highlighted);
            highlighted.traverse(node => {
                if (node.isMesh && mats[node.uuid]) {
                    node.material = mats[node.uuid];
                }
            });
        }

        highlighted = object;
        if (!object) return;

        const store = {};
        object.traverse(node => {
            if (node.isMesh) {
                store[node.uuid] = node.material;
                node.material = node.material.clone();
                if (!onclick) {
                    node.material.color.set(0x00ff00);
                    node.material.emissive.set(0x003300);
                } else {
                    node.material.color.multiplyScalar(0.6);
                }
            }
        });
        originalMaterials.set(object, store);
    };

    const onMouseMove = (e) => {
        const bounds = renderer.domElement.getBoundingClientRect();

        mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
        mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const hits = raycaster.intersectObject(targetGroup, true);

        if (hits.length > 0) {
            let obj = hits[0].object;

            while (obj.parent && obj.parent !== targetGroup)
                obj = obj.parent;

            highlight(obj);
        } else {
            highlight(null);
        }
    };

    const onClick = (e) => {
        const bounds = renderer.domElement.getBoundingClientRect();

        mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
        mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(targetGroup, true);

        if (hits.length > 0) {
            let obj = hits[0].object;
            while (obj.parent && obj.parent !== targetGroup)
                obj = obj.parent;

            if (!onclick) {
                const employee = obj.userData.employee;
                openSidebar(employee);
                cameraOn(camera, controls, obj);
            } else {
                onclick();
            }
        } else {
            if (!onclick) {
                closeSidebar();
            }
        }
    };


    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    return { highlight };
}