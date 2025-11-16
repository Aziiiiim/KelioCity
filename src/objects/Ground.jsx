import * as THREE from 'three';
import floorDiffuseUrl from '/assets/textures/office_floor_diffuse.jpeg';


export function createGround(){
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(floorDiffuseUrl);

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(50, 50);

    const material = new THREE.MeshStandardMaterial({
        map: texture
    });

    const geometry = new THREE.PlaneGeometry(50, 50);
    const ground = new THREE.Mesh(geometry, material);

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    return ground;
}