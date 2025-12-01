import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
    
export function createOffice2Desks(x, y, z) {
    
    const elements = new THREE.Group();

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(5, 6);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xdedede } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(3.5+x,y+0.01,3+z)
    elements.add(floorMesh);

    const wallGeo1 = new THREE.PlaneGeometry(5, 5);
    const wallGeo2 = new THREE.PlaneGeometry(6, 5);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0x335c67, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(3.5+x,2.5+y,z);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(6+x,2.5+y,3+z);
    elements.add(wallMesh2);

    const wallMesh3 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh3.rotation.y = Math.PI * .5;
    wallMesh3.position.set(1+x,2.5+y,3+z);
    elements.add(wallMesh3);

    const wallMesh4 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh4.rotation.y = Math.PI ;
    wallMesh4.position.set(3.5+x,2.5+y,6+z);
    elements.add(wallMesh4);

    
    const loader = new GLTFLoader();
    
    

    // Desk1
    loader.load( './assets/models/decoratedDesk.glb', function ( gltf ) {
        gltf.scene.position.set(-5.43+x,0+y,2.5+z);
        gltf.scene.scale.set(1.1, 1.1, 1.1);
        gltf.scene.rotation.y = -Math.PI * .5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Chair1
    loader.load( './assets/models/chair.glb', function ( gltf ) {
        gltf.scene.position.set(-4.7+x,0+y,-9.5+z);
        gltf.scene.scale.set(0.035,0.035,0.035);
        gltf.scene.rotation.y = -Math.PI * .5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Desk2
    loader.load( './assets/models/decoratedDesk.glb', function ( gltf ) {
        gltf.scene.position.set(12.43+x,0+y,3.6+z);
        gltf.scene.scale.set(1.1, 1.1, 1.1);
        gltf.scene.rotation.y = Math.PI * .5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Chair2
    loader.load( './assets/models/chair.glb', function ( gltf ) {
        gltf.scene.position.set(11.7+x,0+y,15.7+z);
        gltf.scene.scale.set(0.035,0.035,0.035);
        gltf.scene.rotation.y = Math.PI * .5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Message Board
    loader.load( './assets/models/messageBoard.glb', function ( gltf ) {
        gltf.scene.position.set(3+x,1+y,0.1+z);
        gltf.scene.scale.set(0.02,0.02,0.02);
        gltf.scene.rotation.y = Math.PI*-.5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Shelf
    loader.load( './assets/models/containerShelf.glb', function ( gltf ) {
        gltf.scene.position.set(5.6+x,1.14+y,0.8+z);
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

    elements.focusPosition = new THREE.Vector3(0, 8, 3);
    return elements;
}