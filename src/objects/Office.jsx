import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function createOffice() {
    var elements = [];

    const scale = 6;

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(scale, scale);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xdedede } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(0,0,0)
    elements.push(floorMesh);

    const wallGeo = new THREE.PlaneGeometry(scale, scale/2);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0x695a48 } );

    const wallMesh1 = new THREE.Mesh(wallGeo, wallMat);
    wallMesh1.position.set(0,scale/4,-scale/2)
    elements.push(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(scale/2,scale/4,0);
    elements.push(wallMesh2);

    const wallMesh3 = new THREE.Mesh(wallGeo, wallMat);
    wallMesh3.rotation.y = Math.PI * .5;
    wallMesh3.position.set(-scale/2,scale/4,0);
    elements.push(wallMesh3);

    const wallMesh4 = new THREE.Mesh(wallGeo, wallMat);
    wallMesh4.rotation.y = Math.PI ;
    wallMesh4.position.set(0,scale/4,scale/2);
    elements.push(wallMesh4);

    const loader = new GLTFLoader();

    // Desk
    loader.load( './assets/models/decoratedDesk.glb', function ( gltf ) {
        gltf.scene.position.set(0.3,0,6.7);
        gltf.scene.scale.set(1.1, 1.1, 1.1);
        elements.push( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Chair
    loader.load( './assets/models/chair.glb', function ( gltf ) {
        gltf.scene.position.set(-11.7,0,6);
        gltf.scene.scale.set(0.035,0.035,0.035);
        elements.push( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Message Board
    loader.load( './assets/models/messageBoard.glb', function ( gltf ) {
        gltf.scene.position.set(0,1,-scale/2+0.1);
        gltf.scene.scale.set(0.02,0.02,0.02);
        gltf.scene.rotation.y = Math.PI*-.5;
        elements.push( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Shelf
    loader.load( './assets/models/containerShelf.glb', function ( gltf ) {
        gltf.scene.position.set(scale/2-0.4,1.14,-scale/2+0.8);
        gltf.scene.scale.set(0.03,0.03,0.03);
        gltf.scene.rotation.y = Math.PI*.5;
        elements.push( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );    

    return elements;
}