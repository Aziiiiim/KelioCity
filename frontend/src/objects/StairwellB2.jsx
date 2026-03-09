import * as THREE from 'three';
import {loadTexture, makeInstance} from '../utils/asset.js';
    
export function createStairwellB2(initDoor = null) {
    
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "StairwellB2";

    // Wall and floor
    const floorMat = new THREE.MeshBasicMaterial( { color: 0x2F4680 } );
    const floorMesh1 = new THREE.Mesh(new THREE.PlaneGeometry(2.32, 6), floorMat);
    floorMesh1.rotation.x = Math.PI * -.5;
    floorMesh1.position.set(1.16,0.01,3)
    elements.add(floorMesh1);
    const floorMesh2 = new THREE.Mesh(new THREE.PlaneGeometry(4, 3.1), floorMat);
    floorMesh2.rotation.x = Math.PI * -.5;
    floorMesh2.position.set(2,0.01,1.55)
    elements.add(floorMesh2);
    const floorMesh3 = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.5), floorMat);
    floorMesh3.rotation.x = Math.PI * -.5;
    floorMesh3.position.set(2,0.01,5.75)
    elements.add(floorMesh3);

    const wallGeo1 = new THREE.PlaneGeometry(4, 4);
    const wallGeo2 = new THREE.PlaneGeometry(6, 4);
    loadTexture('/assets/textures/painted_plaster.jpg').then((wallTexture) => {
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 4);
        const wallMaterial = new THREE.MeshPhongMaterial({map: wallTexture, side: THREE.DoubleSide});

        const wallMesh1 = new THREE.Mesh(wallGeo1, wallMaterial);
        wallMesh1.position.set(2, 2, 0.01);
        elements.add(wallMesh1);

        const wallMesh2 = new THREE.Mesh(wallGeo2, wallMaterial);
        wallMesh2.rotation.y = Math.PI * -.5;
        wallMesh2.position.set(3.99, 2, 3);
        elements.add(wallMesh2);

        const wallFrontLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(0.38, 4),
            wallMaterial
        );
        wallFrontLeft.rotation.y = Math.PI * 0.5;
        wallFrontLeft.position.set(0, 2, 0.2);
        elements.add(wallFrontLeft);
        const wallFrontTop = new THREE.Mesh(
            new THREE.PlaneGeometry(2.7, 0.96),
            wallMaterial
        );
        wallFrontTop.rotation.y = Math.PI * 0.5;
        wallFrontTop.position.set(0, 3.52, 1.7);
        elements.add(wallFrontTop);
        const wallFrontRight = new THREE.Mesh(
            new THREE.PlaneGeometry(3.5, 4),
            wallMaterial
        );
        wallFrontRight.rotation.y = Math.PI * 0.5;
        wallFrontRight.position.set(0, 2, 4.25);
        elements.add(wallFrontRight);

        const wallMesh4 = new THREE.Mesh(wallGeo1, wallMaterial);
        wallMesh4.rotation.y = Math.PI;
        wallMesh4.position.set(2, 2, 6);
        elements.add(wallMesh4);
    });

    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);
    elements.focusPosition = new THREE.Vector3(0, 8, 3);

    return {elements};
}