import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function createCharacters() {
    var characters = [];

    const loader = new GLTFLoader();

    // Character
    loader.load( './assets/models/Man.glb', function ( gltf ) {
        gltf.animations.forEach((clip, index) => {
            console.log(index, clip.name);
        });
        gltf.scene.position.set(0,0,-1);
        gltf.scene.scale.set(0.5,0.5,0.5);

        const armature = gltf.scene.getObjectByName("HumanArmature");  
        const mixer = new THREE.AnimationMixer(armature);
        const actions = {};
        actions["Sitting"] = mixer.clipAction( gltf.animations[7] ); // s'asseoir
        actions["Sitting"].setLoop(THREE.LoopOnce);
        actions["Sitting"].clampWhenFinished = true;
        
        actions["Walk"] = mixer.clipAction( gltf.animations[10] ); // marcher
        actions["Standing"] = mixer.clipAction( gltf.animations[8] ); // se mettre debout
        actions["Idle"] = mixer.clipAction( gltf.animations[2] ); // être debout
        /*gltf.animations.forEach(clip => {
            actions[clip.name] = mixer.clipAction(clip);
        });*/

        characters.push( {
            scene: gltf.scene,
            mixer,
            actions,
            currentAction: null,

            play(name) {
                if (this.currentAction) {
                    this.currentAction.fadeOut(0.2);
                }
                const newAction = this.actions[name];
                newAction.reset().fadeIn(0.2).play();
                this.currentAction = newAction;
            }
        })

        actions["Sitting"].play();

    }, undefined, function ( error ) {

        console.error( error );

    } );


    return characters;
}