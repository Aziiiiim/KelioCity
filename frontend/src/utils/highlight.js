import * as THREE from "three";
import { openSidebar, closeSidebar } from "./sidebar.js";
import { cameraOn } from "../core/camera.jsx";

export function createHighlighter(camera,controls, renderer, targetGroup, onclick = null ) {

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let highlighted = null;
    let filter_highlighted = new Map();
    let originalMaterials = new Map();

    const highlight = (object) => {
        if (highlighted === object) return;

        if (highlighted && !filter_highlighted.get(highlighted)) {
            const mats = originalMaterials.get(highlighted);
            highlighted.traverse(node => {
                if (node.isMesh && mats[node.uuid]) {
                    node.material = mats[node.uuid];
                }
            });
        }

        highlighted = object;
        if (!object) return;
        
        let color = 0xffffff;
        const employee = object.userData.employee;
        console.log(employee.status);
        if (employee.status == "AVAILABLE") {
            color = 0x00ff00;
        } else if (employee.status == "OCCUPIED") {
            color = 0xdf8423;
        } else if (employee.status == "NOT_AVAILABLE") {
            color = 0xff0000;
        }   
        
        if (!filter_highlighted.get(highlighted)) {
            const store = {};
            object.traverse(node => {
                if (node.isMesh) {
                    store[node.uuid] = node.material;
                    node.material = node.material.clone();
                    if (!onclick) {
                        node.material.color.set(color);
                        node.material.emissive.set(0x003300);
                    } else {
                        node.material.color.multiplyScalar(0.6);
                    }
                }
            });
            originalMaterials.set(object, store);
        }
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


    // FILTER
    const filter_highlight = (object) => {

        if (!object) return;

        if (filter_highlighted.get(object)) {
            const mats = originalMaterials.get(object);
            object.traverse(node => {
                if (node.isMesh && mats[node.uuid]) {
                    node.material = mats[node.uuid];
                }
            });
            filter_highlighted.set(object, false);
            return;
        }

        let color = 0xffffff;
        const employee = object.userData.employee;
        if (employee.status == "AVAILABLE") {
            color = 0x00ff00;
        } else if (employee.status == "OCCUPIED") {
            color = 0xdf8423;
        } else if (employee.status == "NOT_AVAILABLE") {
            color = 0xff0000;
        }   
        
        const store = {};
        object.traverse(node => {
            if (node.isMesh) {
                store[node.uuid] = node.material;
                node.material = node.material.clone();
                node.material.color.set(color);
                node.material.emissive.set(0x003300);
            }
        });
        originalMaterials.set(object, store);
        filter_highlighted.set(object,true) ;
    };

    const filter_status = (status, btn) => {
        if (btn.classList.contains("btn-active")) {
            btn.classList.remove("btn-active");
        } else {
            btn.classList.add("btn-active");
        }

        targetGroup.children.forEach(object => {
            if (object.userData.employee.status == status) {
                filter_highlight(object);
            }
        }); 
    }
    
    const bouton_available = document.getElementById("available-btn");
    bouton_available.addEventListener("click", () => {filter_status("AVAILABLE", bouton_available)})
    const bouton_occupied = document.getElementById("occupied-btn");
    bouton_occupied.addEventListener("click", () => {filter_status("OCCUPIED", bouton_occupied)})

    return { highlight };
}