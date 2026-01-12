import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const gltfCache = new Map();      // url -> Promise<GLTF>
const textureCache = new Map();   // url -> Promise<Texture>

export function loadGLTF(url) {
  if (gltfCache.has(url)) return gltfCache.get(url);

  const p = gltfLoader.loadAsync(url).catch((err) => {
    gltfCache.delete(url); // pour pouvoir retry si erreur
    throw err;
  });

  gltfCache.set(url, p);
  return p;
}

export async function makeInstance(url) {
  const gltf = await loadGLTF(url);
  const obj = gltf.scene.clone(true);

  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = false;
      o.receiveShadow = false;
    }
  });

  return obj;
}

/**
 * Pour personnages (skinned meshes / armature)
 * Retourne une "instance" indépendante du rig.
 */
export async function makeSkinnedInstance(url) {
  const gltf = await loadGLTF(url);
  const obj = SkeletonUtils.clone(gltf.scene);
  obj.updateMatrixWorld(true);

  obj.traverse((o) => {
    if (o.isSkinnedMesh) {
      o.frustumCulled = false;
      o.castShadow = false;
      o.receiveShadow = false;

      if (o.skeleton) {
        o.skeleton.pose();
        o.bind(o.skeleton, o.bindMatrix);
      }
    }

    if (o.isMesh && o.geometry) {
      o.geometry.computeBoundingBox();
      o.geometry.computeBoundingSphere();
    }
    o.visible = true;

  });

  return { obj, animations: gltf.animations || [] };
}

// -------- TEXTURES --------
export function loadTexture(url) {
  if (textureCache.has(url)) return textureCache.get(url);

  const p = new Promise((resolve, reject) => {
    textureLoader.load(url, resolve, undefined, reject);
  }).catch((err) => {
    textureCache.delete(url);
    throw err;
  });

  textureCache.set(url, p);
  return p;
}
