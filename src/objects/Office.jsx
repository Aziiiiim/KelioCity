import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
    
export function createOffice(x, y, z) {
    
    const elements = new THREE.Group();
    x += 3;
    z += 3;

    // Wall and floor
    const floorGeo = new THREE.PlaneGeometry(6, 4);
    const floorMat = new THREE.MeshBasicMaterial( { color: 0xdedede } );
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI * -.5;
    floorMesh.position.set(0+x,y+0.01,-1+z)
    elements.add(floorMesh);
    floorMesh.position.set(0+x,y+0.01,-1+z)
    elements.add(floorMesh);

    const wallGeo1 = new THREE.PlaneGeometry(6, 5);
    const wallGeo2 = new THREE.PlaneGeometry(4, 5);
    const wallMat = new THREE.MeshBasicMaterial( { color: 0x5c6e66, side: THREE.DoubleSide } );

    const wallMesh1 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh1.position.set(0+x,2.5+y,-3+z);
    elements.add(wallMesh1);

    const wallMesh2 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh2.rotation.y = Math.PI * -.5;
    wallMesh2.position.set(3+x,2.5+y,-1+z);
    elements.add(wallMesh2);

    const wallMesh3 = new THREE.Mesh(wallGeo2, wallMat);
    wallMesh3.rotation.y = Math.PI * .5;
    wallMesh3.position.set(-3+x,2.5+y,-1+z);
    elements.add(wallMesh3);

    const wallMesh4 = new THREE.Mesh(wallGeo1, wallMat);
    wallMesh4.rotation.y = Math.PI ;
    wallMesh4.position.set(0+x,2.5+y,1+z);
    elements.add(wallMesh4);

    
    wallMesh4.position.set(0+x,2.5+y,1+z);
    elements.add(wallMesh4);

    
    const loader = new GLTFLoader();
    
    

    // Desk
    loader.load( './assets/models/decoratedDesk.glb', function ( gltf ) {
        gltf.scene.position.set(0.3+x,0+y,6.7+z);
        gltf.scene.position.set(0.3+x,0+y,6.7+z);
        gltf.scene.scale.set(1.1, 1.1, 1.1);
        elements.add( gltf.scene );
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Chair
    loader.load( './assets/models/chair.glb', function ( gltf ) {
        gltf.scene.position.set(-11.7+x,0+y,6+z);
        gltf.scene.position.set(-11.7+x,0+y,6+z);
        gltf.scene.scale.set(0.035,0.035,0.035);
        elements.add( gltf.scene );
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Message Board
    loader.load( './assets/models/messageBoard.glb', function ( gltf ) {
        gltf.scene.position.set(0+x,1+y,-2.9+z);
        gltf.scene.position.set(0+x,1+y,-2.9+z);
        gltf.scene.scale.set(0.02,0.02,0.02);
        gltf.scene.rotation.y = Math.PI*-.5;
        elements.add( gltf.scene );
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    // Shelf
    loader.load( './assets/models/containerShelf.glb', function ( gltf ) {
        gltf.scene.position.set(2.6+x,1.14+y,-2.2+z);
        gltf.scene.position.set(2.6+x,1.14+y,-2.2+z);
        gltf.scene.scale.set(0.03,0.03,0.03);
        gltf.scene.rotation.y = Math.PI*.5;
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );    

    // Door
    loader.load( './assets/models/door.glb', function ( gltf ) {
        gltf.scene.position.set(2.5+x,+y,1+z-0.15);
        gltf.scene.scale.set(3,3,3);
        elements.add( gltf.scene );
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );    

    // Door
    loader.load( './assets/models/door.glb', function ( gltf ) {
        gltf.scene.position.set(2.5+x,+y,1+z-0.15);
        gltf.scene.scale.set(3,3,3);
        elements.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } ); 

    return elements;
}