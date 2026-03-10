import * as THREE from 'three';
import { makeInstance, loadTexture } from '../utils/asset.js';

export function createSmallAmphi() {
    const elements = new THREE.Group();
    elements.userData.kind = "room";
    elements.userData.roomType = "SmallAmphi";

    
    const colors = {
        floor: 0x8F816F,      // brun clair
        stage: 0xc7b199,      // brun moyen  ou 0x804C00
        riser: 0x8a735f,      // taupe brun
        wallTint: 0xd2b48c    // beige / sable
    };

    // Dimensions "logiques" de la pièce
    const width = 30;
    const depth = 30;
    let wallHeight = 5.2;

    // Origine interne pratique
    const x = 0;
    const z = 0;

    // =========================
    // FLOOR
    // =========================
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(width, depth),
        new THREE.MeshPhongMaterial({ color: colors.floor, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(x, 0.01, z);
    elements.add(floor);

    // =========================
    // STAGE / ESTRADE
    // =========================

    const stageWidth = 4.7;   // largeur sur l'axe X
    const stageHeight = 0.75; // hauteur
    const stageDepth = 18;    // profondeur sur l'axe Z

    const stage = new THREE.Mesh(
        new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth),
        new THREE.MeshPhongMaterial({ color: colors.stage  })
    );
    stage.position.set(
        x - width / 2 + stageWidth / 2 +0.1,
        stageHeight / 2,
        z - depth / 2 + stageDepth / 2 + 6
    );
    elements.add(stage);


    const deskCount = 5;
    const deskSpacing = 2.2;

    for (let i = 0; i < deskCount; i++) {

        const offsetZ = (i - (deskCount - 1) / 2) * deskSpacing - 1;

        makeInstance('/assets/models/Desk2.glb').then((desk) => {

            desk.scale.set(3, 3, 3);
            desk.rotation.y = Math.PI / 2;

            desk.position.set(
                x - width / 2 + 2.5,
                stageHeight + 0.01,
                z + offsetZ
            );

            elements.add(desk);

        }).catch(console.error);
    }

    /*
    // Écran de projection
    makeInstance('/assets/models/ProjectorScreen.glb').then((proj) => {
        proj.scale.set(2.8, 3.6, 5.5);
        proj.rotation.y = Math.PI / 2;
        proj.position.set(x - width / 2 + 0.25, 2.55, z);
        elements.add(proj);
    }).catch(console.error);
    */

    const boardPositions = [-4.5, 0, 4.5]; // gauche, centre, droite

    boardPositions.forEach((offsetZ) => {
        makeInstance('/assets/models/Blackboard.glb').then((board) => {
            board.scale.set(3.8, 4.5, 2.8);
            board.rotation.y = Math.PI / 2;
            board.position.set(
                x - width / 2 + 0.08,
                2.8,
                z + offsetZ
            );
            elements.add(board);

        }).catch(console.error);

    });


    // =========================
    // GRADINS TEMPORAIRES : paliers et steps bord à bord
    // =========================

    const gradinCount = 4;
    const gradinWidth = width;

    const wallOffset = 1.61;

    // point de départ contre le mur
    const firstLandingStartX = x - width / 3;
    const gradinsCenterZ = z + width / 2 - wallOffset ;

    const landingDepth = 1.4;
    const landingThickness = 0.12;


    makeInstance('/assets/models/Steps.glb').then((sampleSteps) => {
        sampleSteps.scale.set(3, 1, 2);
        sampleSteps.rotation.y = -Math.PI / 2;
        sampleSteps.updateMatrixWorld(true);

        const stepBox = new THREE.Box3().setFromObject(sampleSteps);
        const stepSize = stepBox.getSize(new THREE.Vector3());

        const stepRun = stepSize.x;   // longueur du steps sur X
        const stepRise = stepSize.y;  // hauteur du steps sur Y
        const stepWidth = stepSize.z;


        makeInstance('/assets/models/chair.glb').then((sampleChair) => {
            sampleChair.scale.set(0.04, 0.04, 0.04);
            sampleChair.rotation.y = -Math.PI / 2;
            sampleChair.updateMatrixWorld(true);

            const chairBox = new THREE.Box3().setFromObject(sampleChair);
            const chairSize = chairBox.getSize(new THREE.Vector3());

            const chairWidthZ = chairSize.z;
            const chairGapZ = 0.55;
        

            for (let i = 0; i < gradinCount; i++) {
                const levelY = i * stepRise;
                const landingStartX = firstLandingStartX + i * (landingDepth + stepRun);
                const landingEndX = landingStartX + landingDepth;
                if(i!=0){
                    const landing = new THREE.Mesh(
                        new THREE.BoxGeometry(landingDepth, landingThickness, gradinWidth -0.01 ),
                        new THREE.MeshPhongMaterial({ color: colors.riser })
                    );

                    landing.position.set(
                        landingStartX + landingDepth / 2,
                        levelY + landingThickness / 2,
                        gradinsCenterZ -13.391
                    );

                    elements.add(landing);
                    makeInstance('/assets/models/Table.glb').then((table) => {
                        table.scale.set(0.46, 0.05, 0.05);
                        table.rotation.y = Math.PI/2;

                        const box = new THREE.Box3().setFromObject(table);
                        const center = box.getCenter(new THREE.Vector3());

                        table.position.set(
                            landingStartX + landingDepth / 2 - center.x,
                            levelY + landingThickness / 2 - box.min.y,
                            (gradinsCenterZ - 13.391) - center.z
                        );

                        elements.add(table);
                    }).catch(console.error);
                    

                }
                const stepsStartX = landingEndX;
                const stepsEndX = stepsStartX + stepRun;

                const steps1 = sampleSteps.clone(true);
                const steps2 = sampleSteps.clone(true);

                steps1.position.set(
                    stepsStartX + stepRun / 2,
                    levelY,
                    gradinsCenterZ + 0.1
                );

                steps2.position.set(
                    stepsStartX + stepRun / 2,
                    levelY,
                    -(gradinsCenterZ + 0.1)
                );

                elements.add(steps1);
                elements.add(steps2);
                if(i!=0){
                    const leftStepZ = gradinsCenterZ + 0.1;
                    const rightStepZ = -(gradinsCenterZ + 0.1);

                    const centralGapZ = Math.abs(leftStepZ - rightStepZ) - stepWidth;
                    const plateCenterZ = (leftStepZ + rightStepZ) / 2;

                    const horizontalPlate = new THREE.Mesh(
                        new THREE.BoxGeometry(stepRun, landingThickness, centralGapZ),
                        new THREE.MeshPhongMaterial({ color: colors.riser })
                    );

                    horizontalPlate.position.set(
                        stepsStartX + stepRun / 2,
                        levelY + landingThickness / 2,
                        plateCenterZ
                    );

                    elements.add(horizontalPlate);


                    const usablePlateZ = centralGapZ - 0.4;
                    const chairCount = Math.max(1, Math.floor(usablePlateZ / (chairWidthZ + chairGapZ)));
                    const totalChairsWidth = chairCount * chairWidthZ + (chairCount - 1) * chairGapZ;
                    const firstChairZ = plateCenterZ - totalChairsWidth / 2 + chairWidthZ / 2;

                    for (let c = 0; c < chairCount; c++) {
                        const chair = sampleChair.clone(true);

                        const box = new THREE.Box3().setFromObject(chair);
                        const center = box.getCenter(new THREE.Vector3());

                        const chairZ = firstChairZ + c * (chairWidthZ + chairGapZ);

                        chair.position.set(
                            stepsStartX + stepRun / 2 - center.x,
                            levelY + landingThickness / 2 - box.min.y,
                            chairZ - center.z
                        );

                        elements.add(chair);
                    }

                }
            }


            // =========================
            // DERNIER NIVEAU : sol + plaque centrale + table (sans steps)
            // =========================
            const lastIndex = gradinCount;
            const lastLevelY = lastIndex * stepRise;
            const lastLandingStartX = firstLandingStartX + lastIndex * (landingDepth + stepRun);
            const lastPlateEndX = lastLandingStartX + landingDepth + stepRun;
            const backWallX = lastPlateEndX + 0.02;
            const adaptiveWallHeight = lastLevelY + 3.0;

            const roomLength = backWallX - (x - width / 2);

            floor.geometry.dispose();
            floor.geometry = new THREE.PlaneGeometry(roomLength, depth);
            floor.position.x = (backWallX + (x - width / 2)) / 2;

            const lastLanding = new THREE.Mesh(
                new THREE.BoxGeometry(landingDepth, landingThickness, gradinWidth),
                new THREE.MeshPhongMaterial({ color: colors.riser })
            );

            lastLanding.position.set(
                lastLandingStartX + landingDepth / 2,
                lastLevelY + landingThickness / 2,
                gradinsCenterZ - 13.391
            );

            elements.add(lastLanding);

            // dernière plaque horizontale centrale (entre les 2 steps latéraux)
            const leftStepZ = gradinsCenterZ + 0.1;
            const rightStepZ = -(gradinsCenterZ + 0.1);
            const centralGapZ = Math.abs(leftStepZ - rightStepZ) - stepWidth;
            const plateCenterZ = (leftStepZ + rightStepZ) / 2;

            const lastHorizontalPlate = new THREE.Mesh(
                new THREE.BoxGeometry(stepRun, landingThickness, gradinWidth),
                new THREE.MeshPhongMaterial({ color: colors.riser })
            );

            lastHorizontalPlate.position.set(
                lastLandingStartX + landingDepth+ stepRun / 2,
                lastLevelY + landingThickness / 2,
                plateCenterZ
            );

            elements.add(lastHorizontalPlate);

            const usablePlateZ = centralGapZ - 0.4;
            const chairCount = Math.max(1, Math.floor(usablePlateZ / (chairWidthZ + chairGapZ)));
            const totalChairsWidth = chairCount * chairWidthZ + (chairCount - 1) * chairGapZ;
            const firstChairZ = plateCenterZ - totalChairsWidth / 2 + chairWidthZ / 2;

            for (let c = 0; c < chairCount; c++) {
                const chair = sampleChair.clone(true);

                const box = new THREE.Box3().setFromObject(chair);
                const center = box.getCenter(new THREE.Vector3());

                const chairZ = firstChairZ + c * (chairWidthZ + chairGapZ);

                chair.position.set(
                    lastLandingStartX + landingDepth + stepRun / 2 - center.x,
                    lastLevelY + landingThickness / 2 - box.min.y,
                    chairZ - center.z
                );

                elements.add(chair);
            }

            // table sur le dernier landing
            makeInstance('/assets/models/Table.glb').then((table) => {
                table.scale.set(0.46, 0.05, 0.05);
                table.rotation.y = Math.PI / 2;

                const box = new THREE.Box3().setFromObject(table);
                const center = box.getCenter(new THREE.Vector3());

                table.position.set(
                    lastLandingStartX + landingDepth / 2 - center.x,
                    lastLevelY + landingThickness / 2 - box.min.y,
                    (gradinsCenterZ - 13.391) - center.z
                );
                elements.add(table);
                }).catch(console.error);


                // =========================
                // WALLS
                // =========================
                loadTexture('/assets/textures/painted_plaster.jpg').then((wallTexture) => {
                    wallTexture.wrapS = THREE.RepeatWrapping;
                    wallTexture.wrapT = THREE.RepeatWrapping;
                    wallTexture.repeat.set(6, 4);

                    const wallMaterial = new THREE.MeshPhongMaterial({
                        map: wallTexture,
                        side: THREE.DoubleSide,
                        color: colors.floor
                    });

                    const wallBack = new THREE.Mesh(
                        new THREE.PlaneGeometry(depth, wallHeight),
                        wallMaterial
                    );
                    wallBack.rotation.y = Math.PI / 2;
                    wallBack.position.set(backWallX, wallHeight / 2, z);
                    elements.add(wallBack);

                    // =========================
                    // MUR DU TABLEAU AVEC 2 OUVERTURES DE PORTE
                    // =========================
                    const doorWidth = 1.63;
                    const doorHeight = 3.0;
                    const doorGap = 0;

                    const doorBlockCenterZ = z + depth / 2 - 3.2;

                    const door1CenterZ = doorBlockCenterZ - (doorWidth / 2 + doorGap / 2);
                    const door2CenterZ = doorBlockCenterZ + (doorWidth / 2 + doorGap / 2);

                    const wallMinZ = z - depth / 2;
                    const wallMaxZ = z + depth / 2;

                    const door1StartZ = door1CenterZ - doorWidth / 2;
                    const door1EndZ = door1CenterZ + doorWidth / 2;
                    const door2StartZ = door2CenterZ - doorWidth / 2;
                    const door2EndZ = door2CenterZ + doorWidth / 2;

                    // segment avant la 1re porte
                    const frontSeg1Width = door1StartZ - wallMinZ;

                    // pilier entre les 2 portes
                    const frontSeg2Width = door2StartZ - door1EndZ;

                    // segment après la 2e porte
                    const frontSeg3Width = wallMaxZ - door2EndZ;

                    // mur avant la 1re porte
                    const wallFrontSeg1 = new THREE.Mesh(
                        new THREE.PlaneGeometry(frontSeg1Width, wallHeight),
                        wallMaterial
                    );
                    wallFrontSeg1.rotation.y = -Math.PI / 2;
                    wallFrontSeg1.position.set(
                        x - width / 2,
                        wallHeight / 2,
                        wallMinZ + frontSeg1Width / 2
                    );
                    elements.add(wallFrontSeg1);

                    // pilier entre les 2 portes
                    const wallFrontSeg2 = new THREE.Mesh(
                        new THREE.PlaneGeometry(frontSeg2Width, wallHeight),
                        wallMaterial
                    );
                    wallFrontSeg2.rotation.y = -Math.PI / 2;
                    wallFrontSeg2.position.set(
                        x - width / 2,
                        wallHeight / 2,
                        door1EndZ + frontSeg2Width / 2
                    );
                    elements.add(wallFrontSeg2);

                    // mur après la 2e porte
                    const wallFrontSeg3 = new THREE.Mesh(
                        new THREE.PlaneGeometry(frontSeg3Width, wallHeight),
                        wallMaterial
                    );
                    wallFrontSeg3.rotation.y = -Math.PI / 2;
                    wallFrontSeg3.position.set(
                        x - width / 2,
                        wallHeight / 2,
                        door2EndZ + frontSeg3Width / 2
                    );
                    elements.add(wallFrontSeg3);

                    // haut au-dessus de la porte 1
                    const wallFrontTop1 = new THREE.Mesh(
                        new THREE.PlaneGeometry(doorWidth, wallHeight - doorHeight),
                        wallMaterial
                    );
                    wallFrontTop1.rotation.y = -Math.PI / 2;
                    wallFrontTop1.position.set(
                        x - width / 2,
                        doorHeight + (wallHeight - doorHeight) / 2,
                        door1CenterZ
                    );
                    elements.add(wallFrontTop1);

                    // haut au-dessus de la porte 2
                    const wallFrontTop2 = new THREE.Mesh(
                        new THREE.PlaneGeometry(doorWidth, wallHeight - doorHeight),
                        wallMaterial
                    );
                    wallFrontTop2.rotation.y = -Math.PI / 2;
                    wallFrontTop2.position.set(
                        x - width / 2,
                        doorHeight + (wallHeight - doorHeight) / 2,
                        door2CenterZ
                    );
                    elements.add(wallFrontTop2);


                    function createDoorAt(doorCenterZ, hingeOnLowerZSide) {
                        makeInstance('/assets/models/door.glb').then((doorObj) => {
                            doorObj.scale.set(-4, -4, -4);
                            doorObj.updateMatrixWorld(true);

                            const doorBox = new THREE.Box3().setFromObject(doorObj);
                            const doorCenter = doorBox.getCenter(new THREE.Vector3());

                            const pivot = new THREE.Group();
                            pivot.userData.kind = "door";
                            pivot.userData.action = "toggleDoor";
                            pivot.userData.toggleDoor = toggleDoor;

                            let closedRotation = 0;
                            let openRotation = 0;

                            if (hingeOnLowerZSide) {
                                // pivot sur le bord "bas Z" de l'ouverture
                                pivot.position.set(
                                    x - width / 2 + 0.02,
                                    0,
                                    doorCenterZ - doorWidth / 2
                                );

                                // modèle décalé à partir de cette charnière
                                doorObj.position.set(
                                    -doorBox.min.x,
                                    -doorBox.min.y,
                                    -doorCenter.z
                                );

                                closedRotation = 0;
                                openRotation = -Math.PI / 2;
                            } else {
                                // pivot sur le bord "haut Z" de l'ouverture
                                pivot.position.set(
                                    x - width / 2 + 0.02,
                                    0,
                                    doorCenterZ + doorWidth / 2
                                );

                                // on accroche l'autre bord du modèle au pivot
                                doorObj.position.set(
                                    -doorBox.min.x,
                                    -doorBox.min.y,
                                    -doorCenter.z
                                );

                                closedRotation = 0;
                                openRotation = Math.PI / 2;
                            }

                            pivot.rotation.y = closedRotation;
                            pivot.add(doorObj);

                            elements.add(pivot);

                            doorPivots.push({
                                pivot,
                                closedRotation,
                                openRotation
                            });
                        }).catch(console.error);
                    }

                    // porte 1
                    createDoorAt(door1CenterZ,true);

                    // porte 2
                    createDoorAt(door2CenterZ,false);

                    const wallLeft = new THREE.Mesh(
                        new THREE.PlaneGeometry(backWallX - (x - width / 2), wallHeight),
                        wallMaterial
                    );
                    wallLeft.position.set(
                        (backWallX + (x - width / 2)) / 2,
                        wallHeight / 2,
                        z - depth / 2
                    );
                    elements.add(wallLeft);

                    const wallRight = wallLeft.clone();
                    wallRight.position.set(
                        (backWallX + (x - width / 2)) / 2,
                        wallHeight / 2,
                        z + depth / 2
                    );
                    wallRight.rotation.y = Math.PI;
                    elements.add(wallRight);
                }).catch(console.error);

        }).catch(console.error);

    }).catch(console.error);

    let doorPivots = [];
    let doorsOpen = false;
    let doorProgress = 0;

    
    // =========================
    // DOOR ANIMATION
    // =========================
    function openDoor(delta) {
        if (doorPivots.length === 0) return;

        const target = doorsOpen ? 0 : 1;
        doorProgress += (target - doorProgress) * delta * 6;
        doorProgress = THREE.MathUtils.clamp(doorProgress, 0, 1);

        for (const { pivot, closedRotation, openRotation } of doorPivots) {
            pivot.rotation.y =
                closedRotation + (openRotation - closedRotation) * doorProgress;
        }
    }

    function toggleDoor() {
        doorsOpen = !doorsOpen;
    }

    // =========================
    // CENTER / FOCUS
    // =========================
    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);

    elements.focusPosition = new THREE.Vector3(0, 12, 10);
    const endX = width;
    const endZ = depth;

    return { elements, endX, endZ, openDoor, doorPivots };
}