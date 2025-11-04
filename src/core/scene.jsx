import * as THREE from 'three';
import { createCamera} from './camera.jsx';
import { createSpinningCube } from '../objects/SpinningCube.jsx';
import { createRenderer } from './renderer.jsx';
import {createLight} from './lights.jsx';
import {createBiggerSpinningCube} from '../objects/BiggerSpinningCube.jsx';
import { createControls } from './controls.jsx';


export function createScene(){
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();

    const { camera, resize: resizeCamera } = createCamera(gameWindow);
    const {renderer, resize:resizeRenderer} = createRenderer(gameWindow);
    resizeRenderer();
    gameWindow.appendChild(renderer.domElement);
    
    const cube = createSpinningCube();
    scene.add(cube.mesh);

    const biggerCube = createBiggerSpinningCube();
    scene.add(biggerCube.mesh)

    const light = createLight();
    scene.add(light);


    const controls = createControls(camera,gameWindow);

    function draw(){
        cube.update();
        controls.update();
        renderer.render(scene,camera);
    }

    function start(){
        function onResize() {
            resizeRenderer();
            resizeCamera();
        }
        window.addEventListener('resize', onResize);
        onResize();
        renderer.setAnimationLoop(draw);
    } 
    
    function stop(){
        renderer.setAnimationLoop(null);
    } 

    return { start, stop, scene, camera, renderer };
}