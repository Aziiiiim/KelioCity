import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MeetingRoom = () => {
  const canvasRef = useRef();

  useEffect(() => {
    // We setup all the scene
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(8, 12, 6);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = true;

    // We load each element of our meeting room
    const loader = new GLTFLoader();

    // We load each desk and chair for both row of tables
    for (let i=0; i<5; i++) {
        loader.load('/assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(i*1.6, 0, -2.4);
            scene.add(desk);
        });
        loader.load('/assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(i*1.6, -0.35, -3);
            scene.add(chair);
        });

        loader.load('/assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.position.set(i*1.6, 0, 2.4);
            scene.add(desk);
        });
        loader.load('/assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(i*1.6, -0.35, 3);
            chair.rotation.y = Math.PI;
            scene.add(chair);
        });
    }
    // We load the last row of tables
    for (let i=0; i<3; i++) {
        loader.load('/assets/models/StandingDesk.glb', (gltf) => {
            const desk = gltf.scene;
            desk.scale.set(1, 1, 1);
            desk.rotation.y = Math.PI/2;
            desk.position.set(7.6, 0, -1.65+i*1.6);
            scene.add(desk);
        });
        loader.load('/assets/models/OfficeChair.glb', (gltf) => {
            const chair = gltf.scene;
            chair.scale.set(1, 1, 1);
            chair.position.set(8.2, -0.35, -1.65+i*1.6);
            chair.rotation.y = -Math.PI/2;
            scene.add(chair);
        });
    }
    // We load the projector screen
    loader.load('/assets/models/ProjectorScreen.glb', (gltf) => {
        const proj = gltf.scene;
        proj.scale.set(2, 3, 4);
        proj.position.set(-4.1, 2, 0);
        scene.add(proj);
    });
    // We load one person
    loader.load('/assets/models/BusinessMan.glb', (gltf) => {
        const employee = gltf.scene;
        employee.scale.set(1.3, 1.3, 1.3);
        employee.position.set(-3, -0.35, -2);
        scene.add(employee);
    });

    // We load the floor and the four walls
    const texture = new THREE.TextureLoader().load('/assets/textures/laminate_floor.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      material
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.4;
    floor.position.x = 3.2;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallTexture = new THREE.TextureLoader().load('/assets/textures/painted_plaster.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 4);
    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
    const wallBack = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 5),
      wallMaterial
    );
    wallBack.position.set(3.2, 2.1, -7.5);
    scene.add(wallBack);

    const wallFront = wallBack.clone();
    wallFront.position.z = 7.5;
    scene.add(wallFront);

    const wallLeft = wallBack.clone();
    wallLeft.rotation.y = Math.PI / 2;
    wallLeft.position.set(-4.3, 2.1, 0);
    scene.add(wallLeft);

    const wallRight = wallBack.clone();
    wallRight.rotation.y = -Math.PI / 2;
    wallRight.position.set(10.7, 2.1, 0);
    scene.add(wallRight);

    // Animate function
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default MeetingRoom;
