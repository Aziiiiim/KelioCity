import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function createCharacters() {

    const characters = [];
    const groupCharacters = new THREE.Group();

    const loader = new GLTFLoader();

    function initChar (asset, onReady) {
        loader.load( asset, function ( gltf ) {
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
            
            const character = {
                scene: gltf.scene,
                mixer,
                actions,
                currentAction: null,

                play(name) {
                    if (this.currentAction) this.currentAction.fadeOut(0.2);
                    const newAction = this.actions[name];
                    newAction.reset().fadeIn(0.2).play();
                    this.currentAction = newAction;
                }
            };

            characters.push( character);
            groupCharacters.add(character.scene);

            if (onReady) onReady(character);

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }

    //Man 1
    initChar('./assets/characters/Man1.glb', function(character) { //function to add rules to initialize the character
        character.scene.position.set(5.1, 0, 7);
        character.play("Sitting");
    });

    //Woman4
    initChar('./assets/characters/Woman4.glb', function(character) { //function to add rules to initialize the character
        character.scene.position.set(-0.9, 0, 7);
        character.play("Sitting");
    });
    
    return {characters, groupCharacters}
}