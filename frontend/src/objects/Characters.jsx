import * as THREE from 'three';
import { makeSkinnedInstance } from '../utils/asset.js';

function clipOrIndex(animations, idx) {
  return animations[idx] ?? null;
}

export function initChar(asset, onReady) {
  makeSkinnedInstance(asset)
    .then(({ obj, animations }) => {
      obj.scale.set(0.5, 0.5, 0.5);
      obj.focusPosition = new THREE.Vector3(0, 7, 4);
      
      const mixer = new THREE.AnimationMixer(obj);

      const actions = {};
      const sitting = clipOrIndex(animations, 7);
      const walk = clipOrIndex(animations, 10);
      const standing = clipOrIndex(animations, 8);
      const idle = clipOrIndex(animations, 2);

      if (sitting) {
        actions.Sitting = mixer.clipAction(sitting);
        actions.Sitting.setLoop(THREE.LoopOnce);
        actions.Sitting.clampWhenFinished = true;
      }
      if (walk) actions.Walk = mixer.clipAction(walk);
      if (standing) actions.Standing = mixer.clipAction(standing);
      if (idle) actions.Idle = mixer.clipAction(idle);

      const character = {
        scene: obj,
        mixer,
        actions,
        currentAction: null,

        play(name) {
          const newAction = this.actions[name];
          if (!newAction) return;
          if (this.currentAction) this.currentAction.fadeOut(0.2);
          newAction.reset().fadeIn(0.2).play();
          this.currentAction = newAction;
        },
      };

      onReady?.(character);
    })
    .catch(console.error);
}
