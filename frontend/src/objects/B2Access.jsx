import * as THREE from "three";

export function createB2Access() {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry(4, 5, 15);
    const material = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.0
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    group.add(mesh);

    return {
        elements: group
    };
}