import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SpinningCube = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const iw = window.innerWidth;
    const ih = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, iw / ih, 0.1, 1000);
    camera.position.set(0, 0, 2);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const texture = new THREE.TextureLoader().load('/assets/textures/diamond.png');
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.PointLight(0xeeeeee);
    light.position.set(0, 0, 2);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(iw, ih);
    renderer.setPixelRatio(window.devicePixelRatio);

    const loop = () => {
      requestAnimationFrame(loop);
      mesh.rotation.y += 0.01;
      mesh.rotation.x += 0.005;
      renderer.render(scene, camera);
    };

    loop();

    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default SpinningCube;
