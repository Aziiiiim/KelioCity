import * as THREE from 'three';
import floorDiffuseUrl from '/assets/textures/laminate_floor.jpg';


export function createGround(){
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(floorDiffuseUrl);

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(50, 50);

    const material = new THREE.MeshPhongMaterial({ map: texture });
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      material
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    return ground;
}