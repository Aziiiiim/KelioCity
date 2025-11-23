import * as THREE from 'three';

export function createRenderer(gameWindow){
    const renderer = new THREE.WebGLRenderer();

    function resize(){
        renderer.setSize(gameWindow.offsetWidth,gameWindow.offsetHeight);
    }

    return {renderer,resize};
}
