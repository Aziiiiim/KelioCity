import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { Group } from 'three/examples/jsm/libs/tween.module.js';
    
export function createOffice6Desks(x, y, z) {
    
    const elements = new THREE.Group();

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(7, 9);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xdedede } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(4.5+x,y+0.01,4.5+z)
    elements.add(floorMesh);

    const wallGeo1 = new THREE.PlaneGeometry(7, 5);
    const wallGeo2 = new THREE.PlaneGeometry(9, 5);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0xe09f3e, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(4.5+x,2.5+y,z);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(8+x,2.5+y,4.5+z);
    elements.add(wallMesh2);

    const wallMesh3 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh3.rotation.y = Math.PI * .5;
    wallMesh3.position.set(1+x,2.5+y,4.5+z);
    elements.add(wallMesh3);

    const wallMesh4 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh4.rotation.y = Math.PI ;
    wallMesh4.position.set(4.5+x,2.5+y,9+z);
    elements.add(wallMesh4);

    
    const loader = new GLTFLoader();
    const groupDesk1 = new THREE.Group();
    let loadedCount = 0;

    function tryClone() {
        if (loadedCount === 2) {
        const groupDesk2 = groupDesk1.clone(true);
        const groupDesk3 = groupDesk1.clone(true);
        const groupDesk4 = groupDesk1.clone(true);
        const groupDesk5 = groupDesk1.clone(true);
        const groupDesk6 = groupDesk1.clone(true);

        groupDesk1.position.set(x,y,z)
        groupDesk3.position.set(0+x,0+y,2.25+z)
        groupDesk5.position.set(0+x,0+y,4.5+z)

        groupDesk2.rotation.y = Math.PI;
        groupDesk2.position.set(9+x, y, 5+z);
        groupDesk4.rotation.y = Math.PI;
        groupDesk4.position.set(9+x, y, 7.25+z);
        groupDesk6.rotation.y = Math.PI;
        groupDesk6.position.set(9+x, y, 9.5+z);

        elements.add(groupDesk1);
        elements.add(groupDesk2);
        elements.add(groupDesk3);
        elements.add(groupDesk4);
        elements.add(groupDesk5);
        elements.add(groupDesk6);
        }
    }
    
    // Desk
    loader.load( './assets/models/decoratedDesk.glb', function ( gltf ) {
        gltf.scene.position.set(-1.93,0,3);
        gltf.scene.scale.set(1.1, 1.1, 1.1);
        gltf.scene.rotation.y = -Math.PI * .5;
        groupDesk1.add( gltf.scene );
        loadedCount++;
        tryClone();

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Chair
    loader.load( './assets/models/chair.glb', function ( gltf ) {
        gltf.scene.position.set(-4.7+3.5,0,-9);
        gltf.scene.scale.set(0.035,0.035,0.035);
        gltf.scene.rotation.y = -Math.PI * .5;
        groupDesk1.add( gltf.scene );
        loadedCount++;
        tryClone();

    }, undefined, function ( error ) {

        console.error( error );

    } );

    

    // Message Board
    loader.load( './assets/models/messageBoard.glb', function ( gltf ) {
        gltf.scene.position.set(4.5+x,1+y,0.1+z);
        gltf.scene.scale.set(0.02,0.02,0.02);
        gltf.scene.rotation.y = Math.PI*-.5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Shelf
    loader.load( './assets/models/containerShelf.glb', function ( gltf ) {
        gltf.scene.position.set(7.6+x,1.14+y,0.8+z);
        gltf.scene.scale.set(0.03,0.03,0.03);
        gltf.scene.rotation.y = Math.PI*.5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );    

    // Door
    loader.load( './assets/models/door.glb', function ( gltf ) {
        gltf.scene.position.set(1+x,1.5+y,4.5+z);
        gltf.scene.scale.set(4,4,4);
        gltf.scene.rotation.y = Math.PI*.5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    return elements;
}