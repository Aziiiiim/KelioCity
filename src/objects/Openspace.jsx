import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Openspace = () => {
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

    // We load each element of our openspace desks
    const loader = new GLTFLoader();
    const nb_desks = 10; // We can change the length of the openspace desks
    // First external wall of the first desk
    let fst_wall_between = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 2),
        new THREE.MeshPhongMaterial({color: 0xdedede})
    );
    fst_wall_between.position.set(1.9 + 2.55 * -1, 1, 0.37);
    fst_wall_between.rotation.y = Math.PI / 2;
    scene.add(fst_wall_between);
    // For each desk, we load the desk, its computer, its chair and the wall between 2 desks
    for (let i=0; i<nb_desks; i++) {
      for (let j=-1; j<1; j++) {
        loader.load('/assets/models/Desk.glb', (gltf) => {
          const desk = gltf.scene;
          desk.scale.set(2, 2, 2);
          desk.position.set(2.52 * i - j*1.28, 0, 1+j*1.25);
          desk.rotation.y = Math.PI * j;
          scene.add(desk);
        });
        loader.load('/assets/models/Computer.glb', (gltf) => {
          const computer = gltf.scene;
          computer.scale.set(0.002, 0.002, 0.002);
          computer.position.set(2.52 * i - j*0.7 + 0.3, 0.87, 1+j*1.25);
          computer.rotation.y = Math.PI * j;
          scene.add(computer);
        });
        loader.load('/assets/models/OpenChair.glb', (gltf) => {
          const chair = gltf.scene;
          chair.scale.set(2, 2, 2);
          chair.position.set(2.52 * i - j*0.5 + 0.4, 0, 2.15+j*3.5);
          chair.rotation.y = Math.PI * (1+j);
          scene.add(chair);
        });
      }
      let wall_between = new THREE.Mesh(
          new THREE.PlaneGeometry(3, 2),
          new THREE.MeshPhongMaterial({color: 0xdedede})
      );
      wall_between.position.set(1.9 + 2.52 * i, 1, 0.37);
      wall_between.rotation.y = Math.PI / 2;
      scene.add(wall_between);
    }
    // Wall between 2 rows of desks
    let wall_long = new THREE.Mesh(
        new THREE.PlaneGeometry(nb_desks*2.52, 2),
        new THREE.MeshPhongMaterial({color: 0xdedede})
    );
    wall_long.position.set(nb_desks*1.26-0.6, 1, 0.37);
    scene.add(wall_long);

    // Animate loop
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

export default Openspace;
