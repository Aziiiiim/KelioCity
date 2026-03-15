import * as THREE from 'three';
import { makeInstance, loadTexture } from '../utils/asset.js';

export function createBigAmphi() {
    const elements = new THREE.Group();
    elements.userData.kind = 'room';
    elements.userData.roomType = 'BigAmphi';

    const colors = {
        floor: 0x8F816F,
        stage: 0xc7b199,
        riser: 0x8a735f,
        wallTint: 0xd2b48c,
    };

    const width = 30;
    const depth = 30;
    const wallHeight = 5.2;

    const x = 0;
    const z = -4.18;

    let doorPivots = [];
    let doorsOpen = false;
    let doorProgress = 0;

    const context = {
        elements,
        colors,
        width,
        depth,
        wallHeight,
        x,
        z,
        doorPivots,
        toggleDoor,
    };

    const floor = createFloor(context);
    createStage(context);
    createDesks(context);
    createBoards(context);
    createGradins(context, floor);

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

    const box = new THREE.Box3().setFromObject(elements);
    const center = box.getCenter(new THREE.Vector3());
    elements.position.sub(center);

    elements.focusPosition = new THREE.Vector3(0, 12, 10);

    const endX = width;
    const endZ = depth;

    return { elements, endX, endZ, openDoor, doorPivots };
}

function createFloor({ elements, colors, width, depth, x, z }) {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(width, depth),
        new THREE.MeshPhongMaterial({
            color: colors.floor,
            side: THREE.DoubleSide,
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.set(x, 0.01, z);
    elements.add(floor);

    return floor;
}

function createStage({ elements, colors, width, depth, x, z }) {
    const stageWidth = 4.7;
    const stageHeight = 0.75;
    const stageDepth = 18;

    const stage = new THREE.Mesh(
        new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth),
        new THREE.MeshPhongMaterial({ color: colors.stage })
    );

    stage.position.set(
        x - width / 2 + stageWidth / 2 + 0.1,
        stageHeight / 2,
        z - depth / 2 + stageDepth / 2 + 6
    );

    elements.add(stage);

    return { stageWidth, stageHeight, stageDepth, stage };
}

function createDesks({ elements, width, x, z }) {
    const deskCount = 5;
    const deskSpacing = 2.2;
    const stageHeight = 0.75;

    for (let i = 0; i < deskCount; i++) {
        const offsetZ = (i - (deskCount - 1) / 2) * deskSpacing - 1;

        makeInstance('/assets/models/Desk2.glb')
            .then((desk) => {
                desk.scale.set(3, 3, 3);
                desk.rotation.y = Math.PI / 2;
                desk.position.set(
                    x - width / 2 + 2.5,
                    stageHeight + 0.01,
                    z + offsetZ
                );
                elements.add(desk);
            })
            .catch(console.error);
    }
}

function createBoards({ elements, width, x, z }) {
    const boardPositions = [-4.5, 0, 4.5];

    boardPositions.forEach((offsetZ) => {
        makeInstance('/assets/models/Blackboard.glb')
            .then((board) => {
                board.scale.set(3.8, 4.5, 2.8);
                board.rotation.y = Math.PI / 2;
                board.position.set(x - width / 2 + 0.08, 2.8, z + offsetZ);
                elements.add(board);
            })
            .catch(console.error);
    });
}

function createGradins(context, floor) {
    const { elements, colors, width, x, z, wallHeight, depth, toggleDoor } = context;

    const gradinCount = 7;
    const gradinWidth = width;
    const wallOffset = 1.61;

    const firstLandingStartX = x - width / 3;
    const gradinsCenterZ = z + width / 2 - wallOffset;

    const landingDepth = 1.4;
    const landingThickness = 0.12;
    
    const splitCentralFromIndex = 5;
    const centralGapWidth = 3.5;

    makeInstance('/assets/models/Steps.glb')
        .then((sampleSteps) => {
            sampleSteps.scale.set(3, 1, 2);
            sampleSteps.rotation.y = -Math.PI / 2;
            sampleSteps.updateMatrixWorld(true);

            const stepBox = new THREE.Box3().setFromObject(sampleSteps);
            const stepSize = stepBox.getSize(new THREE.Vector3());

            const stepRun = stepSize.x;
            const stepRise = stepSize.y;
            const stepWidth = stepSize.z;

            makeInstance('/assets/models/chair.glb')
                .then((sampleChair) => {
                    sampleChair.scale.set(0.04, 0.04, 0.04);
                    sampleChair.rotation.y = -Math.PI / 2;
                    sampleChair.updateMatrixWorld(true);

                    const chairBox = new THREE.Box3().setFromObject(sampleChair);
                    const chairSize = chairBox.getSize(new THREE.Vector3());

                    const chairWidthZ = chairSize.z;
                    const chairGapZ = 0.55;

                    for (let i = 0; i < gradinCount; i++) {
                        createGradinLevel({
                            elements,
                            colors,
                            i,
                            gradinsCenterZ,
                            firstLandingStartX,
                            landingDepth,
                            landingThickness,
                            gradinWidth,
                            sampleSteps,
                            sampleChair,
                            stepRun,
                            stepRise,
                            stepWidth,
                            chairWidthZ,
                            chairGapZ,
                            splitCentral: i >= splitCentralFromIndex,
                            centralGapWidth,
                            wallHeight,
                        });
                    }

                    const roomData = createLastLevel({
                        elements,
                        colors,
                        floor,
                        width,
                        depth,
                        x,
                        z,
                        wallHeight,
                        gradinCount,
                        gradinWidth,
                        gradinsCenterZ,
                        firstLandingStartX,
                        landingDepth,
                        landingThickness,
                        stepRun,
                        stepRise,
                        stepWidth,
                        sampleChair,
                        chairWidthZ,
                        chairGapZ,
                        splitCentral: gradinCount >= splitCentralFromIndex,
                        centralGapWidth,
                    });

                    createWalls({
                        elements,
                        colors,
                        width,
                        depth,
                        x,
                        z,
                        wallHeight,
                        backWallX: roomData.backWallX,
                        toggleDoor,
                        doorPivots: context.doorPivots,
                    });
                })
                .catch(console.error);
        })
        .catch(console.error);
}

function createGradinLevel({elements,colors,i,gradinsCenterZ,firstLandingStartX,landingDepth,landingThickness,gradinWidth,sampleSteps,sampleChair,stepRun,stepRise,stepWidth,chairWidthZ,chairGapZ,splitCentral,centralGapWidth,wallHeight,}) {
    const levelY = i * stepRise;
    const landingStartX = firstLandingStartX + i * (landingDepth + stepRun);
    const landingEndX = landingStartX + landingDepth;

    if (i !== 0) {
        const landing = new THREE.Mesh(
            new THREE.BoxGeometry(landingDepth, landingThickness, gradinWidth - 0.01),
            new THREE.MeshPhongMaterial({ color: colors.riser })
        );

        const landingCenterZ = gradinsCenterZ - 13.391;

        landing.position.set(
            landingStartX + landingDepth / 2,
            levelY + landingThickness / 2,
            landingCenterZ
        );

        elements.add(landing);

        if (splitCentral) {
            createLandingGapBorders({
                elements,
                colors,
                landingStartX,
                levelY,
                landingThickness,
                landingDepth,
                gradinsCenterZ,
                centralGapWidth,
                wallHeight,
            });
        }

        createTablesOnLanding(
            elements,
            landingStartX,
            levelY,
            landingThickness,
            gradinsCenterZ,
            splitCentral,
            centralGapWidth
        );
    }

    const stepsStartX = landingEndX;

    const steps1 = sampleSteps.clone(true);
    const steps2 = sampleSteps.clone(true);

    steps1.position.set(stepsStartX + stepRun / 2, levelY, gradinsCenterZ + 0.1);
    steps2.position.set(stepsStartX + stepRun / 2, levelY, -(gradinsCenterZ + 0.1));

    elements.add(steps1);
    elements.add(steps2);

        if (i !== 0) {
            const plateX = stepsStartX + stepRun / 2;

            createCentralPlateWithChairs({
                elements,
                colors,
                plateX,
                levelY,
                landingThickness,
                gradinsCenterZ,
                stepRun,
                stepWidth,
                sampleChair,
                chairWidthZ,
                chairGapZ,
                splitCentral,
                centralGapWidth,
                wallHeight,
            });

            createSidePlateWithChairs({
                elements,
                colors,
                plateX,
                levelY,
                landingThickness,
                gradinsCenterZ,
                stepRun,
                stepWidth,
                sampleChair,
                chairWidthZ,
                chairGapZ,
                lengthFactor: 0.52,
                sideGap: 0.2,
            });
    }
}

function createCentralPlateWithChairs({
    elements,
    colors,
    plateX,
    levelY,
    landingThickness,
    gradinsCenterZ,
    stepRun,
    stepWidth,
    sampleChair,
    chairWidthZ,
    chairGapZ,
    splitCentral = false,
    centralGapWidth = 0,
    wallHeight,
}) {
    const leftStepZ = gradinsCenterZ + 0.1;
    const rightStepZ = -(gradinsCenterZ + 0.1);

    const fullCentralGapZ = Math.abs(leftStepZ - rightStepZ) - stepWidth;
    const fullPlateCenterZ = (leftStepZ + rightStepZ) / 2;

    if (!splitCentral) {
        const horizontalPlate = new THREE.Mesh(
            new THREE.BoxGeometry(stepRun, landingThickness, fullCentralGapZ),
            new THREE.MeshPhongMaterial({ color: colors.riser })
        );

        horizontalPlate.position.set(
            plateX,
            levelY + landingThickness / 2,
            fullPlateCenterZ
        );

        elements.add(horizontalPlate);

        createAlignedChairsOnCentralRow({
            elements,
            sampleChair,
            plateX,
            levelY,
            landingThickness,
            rowCenterZ: fullPlateCenterZ,
            rowLengthZ: fullCentralGapZ,

            allowedZones: [
                {
                    minZ: fullPlateCenterZ - fullCentralGapZ / 2,
                    maxZ: fullPlateCenterZ + fullCentralGapZ / 2,
                },
            ],
            chairWidthZ,
            chairGapZ,
        });

        return;
    }

    const leftPartLengthZ = (fullCentralGapZ - centralGapWidth) / 2;
    const rightPartLengthZ = leftPartLengthZ;

    if (leftPartLengthZ <= 0.2) return;

    const gapHalf = centralGapWidth / 2;

    const leftPartCenterZ =
        fullPlateCenterZ + gapHalf / 2 + leftPartLengthZ / 2;

    const rightPartCenterZ =
        fullPlateCenterZ - gapHalf / 2 - rightPartLengthZ / 2;

    const leftPlate = new THREE.Mesh(
        new THREE.BoxGeometry(stepRun, landingThickness, leftPartLengthZ),
        new THREE.MeshPhongMaterial({ color: colors.riser })
    );

    leftPlate.position.set(
        plateX,
        levelY + landingThickness / 2,
        leftPartCenterZ
    );

    elements.add(leftPlate);

    const rightPlate = new THREE.Mesh(
        new THREE.BoxGeometry(stepRun, landingThickness, rightPartLengthZ),
        new THREE.MeshPhongMaterial({ color: colors.riser })
    );

    rightPlate.position.set(
        plateX,
        levelY + landingThickness / 2,
        rightPartCenterZ
    );

    elements.add(rightPlate);

    createCentralGapBorders({
        elements,
        colors,
        plateX,
        levelY,
        landingThickness,
        stepRun,
        leftPartCenterZ,
        leftPartLengthZ,
        rightPartCenterZ,
        rightPartLengthZ,
        wallHeight,
    });

    createAlignedChairsOnCentralRow({
        elements,
        sampleChair,
        plateX,
        levelY,
        landingThickness,
        rowCenterZ: fullPlateCenterZ,
        rowLengthZ: fullCentralGapZ,
        allowedZones: [
            {
                minZ: leftPartCenterZ - leftPartLengthZ / 2,
                maxZ: leftPartCenterZ + leftPartLengthZ / 2,
            },
            {
                minZ: rightPartCenterZ - rightPartLengthZ / 2,
                maxZ: rightPartCenterZ + rightPartLengthZ / 2,
            },
        ],
        chairWidthZ,
        chairGapZ,
    });
}


function createCentralGapBorders({
    elements,
    colors,
    plateX,
    levelY,
    landingThickness,
    stepRun,
    leftPartCenterZ,
    leftPartLengthZ,
    rightPartCenterZ,
    rightPartLengthZ,
    wallHeight,
}) {
    const borderThicknessZ = 0.08;
    const borderInsetX = 0.02;

    const leftGapEdgeZ = leftPartCenterZ - leftPartLengthZ / 2;
    const rightGapEdgeZ = rightPartCenterZ + rightPartLengthZ / 2;

    const borderHeight = Math.max(0.1, wallHeight - (levelY + landingThickness));
    const borderY = levelY + landingThickness + borderHeight / 2;

    const borderMaterial = new THREE.MeshPhongMaterial({ color: colors.riser });

    const leftBorder = new THREE.Mesh(
        new THREE.BoxGeometry(stepRun - borderInsetX, borderHeight, borderThicknessZ),
        borderMaterial
    );

    leftBorder.position.set(
        plateX,
        borderY,
        leftGapEdgeZ
    );

    elements.add(leftBorder);

    const rightBorder = new THREE.Mesh(
        new THREE.BoxGeometry(stepRun - borderInsetX, borderHeight, borderThicknessZ),
        borderMaterial
    );

    rightBorder.position.set(
        plateX,
        borderY,
        rightGapEdgeZ
    );

    elements.add(rightBorder);

    createGapTopCover({
        elements,
        colors,
        centerX: plateX,
        centerZ: (leftGapEdgeZ + rightGapEdgeZ) / 2,
        widthX: stepRun - borderInsetX - 0.02,
        widthZ: Math.abs(leftGapEdgeZ - rightGapEdgeZ) - 0.02,
        wallHeight,
    });
}

function createLandingGapBorders({
    elements,
    colors,
    landingStartX,
    levelY,
    landingThickness,
    landingDepth,
    gradinsCenterZ,
    centralGapWidth,
    wallHeight,
}) {
    const borderThicknessZ = 0.08;
    const horizontalBorderThicknessX = 0.08;

    const borderHeight = Math.max(0.1, wallHeight - (levelY + landingThickness));
    const borderY = levelY + landingThickness + borderHeight / 2;

    const leftStepZ = gradinsCenterZ + 0.1;
    const rightStepZ = -(gradinsCenterZ + 0.1);

    const step2Gap = 0.25;

    const landingGapCenterZ = (leftStepZ + rightStepZ) / 2 + step2Gap - 0.25;
    const landingGapWidth = centralGapWidth - 2 * step2Gap - 1.241;

    const leftGapEdgeZ = landingGapCenterZ + landingGapWidth / 2;
    const rightGapEdgeZ = landingGapCenterZ - landingGapWidth / 2;

    const borderMaterial = new THREE.MeshPhongMaterial({ color: colors.riser });
    const borderX = landingStartX + landingDepth / 2;

    const leftBorder = new THREE.Mesh(
        new THREE.BoxGeometry(landingDepth, borderHeight, borderThicknessZ),
        borderMaterial
    );
    leftBorder.position.set(borderX, borderY, leftGapEdgeZ);
    elements.add(leftBorder);

    const rightBorder = new THREE.Mesh(
        new THREE.BoxGeometry(landingDepth, borderHeight, borderThicknessZ),
        borderMaterial
    );
    rightBorder.position.set(borderX, borderY, rightGapEdgeZ);
    elements.add(rightBorder);

    const horizontalBorder = new THREE.Mesh(
        new THREE.BoxGeometry(horizontalBorderThicknessX, borderHeight, landingGapWidth),
        borderMaterial
    );

    const closeAtBack = false;

    horizontalBorder.position.set(
        closeAtBack
            ? landingStartX + landingDepth - horizontalBorderThicknessX / 2
            : landingStartX + horizontalBorderThicknessX / 2,
        borderY,
        landingGapCenterZ
    );

    elements.add(horizontalBorder);

    // couvercle au-dessus du trou
    createGapTopCover({
        elements,
        colors,
        centerX: borderX,
        centerZ: landingGapCenterZ,
        widthX: landingDepth - 0.02,
        widthZ: landingGapWidth - 0.02,
        wallHeight,
    });
}

function createGapTopCover({
    elements,
    colors,
    centerX,
    centerZ,
    widthX,
    widthZ,
    wallHeight,
}) {
    const coverThickness = 0.04;

    const cover = new THREE.Mesh(
        new THREE.BoxGeometry(widthX, coverThickness, widthZ),
        new THREE.MeshPhongMaterial({ color: colors.riser })
    );

    cover.position.set(
        centerX,
        wallHeight - coverThickness / 2,
        centerZ
    );

    elements.add(cover);
}

function createAlignedChairsOnCentralRow({
    elements,
    sampleChair,
    plateX,
    levelY,
    landingThickness,
    rowCenterZ,
    rowLengthZ,
    allowedZones,
    chairWidthZ,
    chairGapZ,
}) {
    const usableRowZ = rowLengthZ - 0.4;
    if (usableRowZ <= 0) return;

    const chairCount = Math.max(
        1,
        Math.floor(usableRowZ / (chairWidthZ + chairGapZ))
    );

    const totalChairsWidth =
        chairCount * chairWidthZ + (chairCount - 1) * chairGapZ;

    const firstChairZ =
        rowCenterZ - totalChairsWidth / 2 + chairWidthZ / 2;

    for (let c = 0; c < chairCount; c++) {
        const chairZ = firstChairZ + c * (chairWidthZ + chairGapZ);

        const isInsideAllowedZone = allowedZones.some(
            ({ minZ, maxZ }) => chairZ >= minZ && chairZ <= maxZ
        );

        if (!isInsideAllowedZone) continue;

        const chair = sampleChair.clone(true);
        const box = new THREE.Box3().setFromObject(chair);
        const center = box.getCenter(new THREE.Vector3());

        chair.position.set(
            plateX - center.x,
            levelY + landingThickness / 2 - box.min.y,
            chairZ - center.z
        );

        elements.add(chair);
    }
}

function createSidePlateWithChairs({
    elements,
    colors,
    plateX,
    levelY,
    landingThickness,
    gradinsCenterZ,
    stepRun,
    stepWidth,
    sampleChair,
    chairWidthZ,
    chairGapZ,
    lengthFactor = 0.82,
    sideGap = 0.2,
}) {
    const leftStepZ = gradinsCenterZ + 0.1;
    const rightStepZ = -(gradinsCenterZ + 0.1);

    const centralGapZ = Math.abs(leftStepZ - rightStepZ) - stepWidth;
    const sidePlateLength = centralGapZ * lengthFactor;

    const sidePlateCenterZ =
        rightStepZ - stepWidth / 2 - sideGap - sidePlateLength / 2;

    const sidePlate = new THREE.Mesh(
        new THREE.BoxGeometry(stepRun, landingThickness, sidePlateLength),
        new THREE.MeshPhongMaterial({ color: colors.riser })
    );

    sidePlate.position.set(
        plateX,
        levelY + landingThickness / 2,
        sidePlateCenterZ
    );

    elements.add(sidePlate);

    const usablePlateZ = sidePlateLength - 0.4;
    const chairCount = Math.max(
        1,
        Math.floor(usablePlateZ / (chairWidthZ + chairGapZ))
    );

    const totalChairsWidth =
        chairCount * chairWidthZ + (chairCount - 1) * chairGapZ;

    const firstChairZ =
        sidePlateCenterZ - totalChairsWidth / 2 + chairWidthZ / 2;

    for (let c = 0; c < chairCount; c++) {
        const chair = sampleChair.clone(true);
        const box = new THREE.Box3().setFromObject(chair);
        const center = box.getCenter(new THREE.Vector3());

        const chairZ = firstChairZ + c * (chairWidthZ + chairGapZ);

        chair.position.set(
            plateX - center.x,
            levelY + landingThickness / 2 - box.min.y,
            chairZ - center.z
        );

        elements.add(chair);
    }
}

function createLastLevel({elements,colors,floor,width,depth,x,z,wallHeight,gradinCount,gradinWidth,gradinsCenterZ,firstLandingStartX,landingDepth,landingThickness,stepRun,stepRise,stepWidth,sampleChair,chairWidthZ,chairGapZ,splitCentral,centralGapWidth,}) {
    const lastIndex = gradinCount;
    const lastLevelY = lastIndex * stepRise;
    const lastLandingStartX = firstLandingStartX + lastIndex * (landingDepth + stepRun);
    const lastPlateEndX = lastLandingStartX + landingDepth + stepRun;
    const backWallX = lastPlateEndX + 0.02;

    const roomLength = backWallX - (x - width / 2);

    floor.geometry.dispose();
    floor.geometry = new THREE.PlaneGeometry(roomLength, depth);
    floor.position.x = (backWallX + (x - width / 2)) / 2;

    const lastLanding = new THREE.Mesh(
        new THREE.BoxGeometry(landingDepth, landingThickness, gradinWidth),
        new THREE.MeshPhongMaterial({ color: colors.riser })
    );

    const lastLandingCenterZ = gradinsCenterZ - 13.391;

    lastLanding.position.set(
        lastLandingStartX + landingDepth / 2,
        lastLevelY + landingThickness / 2,
        lastLandingCenterZ
    );

    elements.add(lastLanding);

    if (splitCentral) {
        createLandingGapBorders({
            elements,
            colors,
            landingStartX: lastLandingStartX,
            levelY: lastLevelY,
            landingThickness,
            landingDepth,
            gradinsCenterZ,
            centralGapWidth,
            wallHeight,
        });

        
    }

    createCentralPlateWithChairs({
        elements,
        colors,
        plateX: lastLandingStartX + landingDepth + stepRun / 2,
        levelY: lastLevelY,
        landingThickness,
        gradinsCenterZ,
        stepRun,
        stepWidth,
        sampleChair,
        chairWidthZ,
        chairGapZ,
        splitCentral,
        centralGapWidth,
        wallHeight,
    });


    createSidePlateWithChairs({
        elements,
        colors,
        plateX: lastLandingStartX + landingDepth + stepRun / 2,
        levelY: lastLevelY,
        landingThickness,
        gradinsCenterZ,
        stepRun,
        stepWidth,
        sampleChair,
        chairWidthZ,
        chairGapZ,
        lengthFactor: 0.52,
        sideGap: 0.2,
    });

    createTablesOnLanding(elements, lastLandingStartX, lastLevelY, landingThickness, gradinsCenterZ, splitCentral, centralGapWidth);

    return { backWallX };
}

function createTablesOnLanding(
    elements,
    landingStartX,
    levelY,
    landingThickness,
    gradinsCenterZ,
    splitCentral = false,
    centralGapWidth = 0
) {
    const leftStepZ = gradinsCenterZ + 0.1;
    const rightStepZ = -(gradinsCenterZ + 0.1);

    const step2Gap = 0.25;
    const centralTableLength = 0.28;
    const sideTableLength = 0.16;

    const fullCentralTableZ = (leftStepZ + rightStepZ) / 2 + step2Gap;
    const sideTableZ = rightStepZ - 5.35 - step2Gap;

    if (!splitCentral) {
        createSingleLandingTable(
            elements,
            landingStartX,
            levelY,
            landingThickness,
            fullCentralTableZ,
            centralTableLength
        );
    } else {
        const fullCentralGapZ = Math.abs(leftStepZ - rightStepZ) - step2Gap * 2;
        const centralPartLengthZ = (fullCentralGapZ - centralGapWidth) / 2;

        if (centralPartLengthZ > 0.2) {
            const gapHalf = centralGapWidth / 2;

            const leftCentralTableZ =
                fullCentralTableZ + gapHalf / 2 + centralPartLengthZ / 2;

            const rightCentralTableZ =
                fullCentralTableZ - gapHalf / 2 - centralPartLengthZ / 2;

            createSingleLandingTable(
                elements,
                landingStartX,
                levelY,
                landingThickness,
                leftCentralTableZ,
                0.12
            );

            createSingleLandingTable(
                elements,
                landingStartX,
                levelY,
                landingThickness,
                rightCentralTableZ,
                0.12
            );
        }
    }

    createSingleLandingTable(
        elements,
        landingStartX,
        levelY,
        landingThickness,
        sideTableZ,
        sideTableLength
    );
}

function createSingleLandingTable(elements, landingStartX, levelY, landingThickness, tableCenterZ, length) {
    makeInstance('/assets/models/Table.glb')
        .then((table) => {
            table.scale.set(length, 0.05, 0.05);
            table.rotation.y = Math.PI / 2;

            const box = new THREE.Box3().setFromObject(table);
            const center = box.getCenter(new THREE.Vector3());

            table.position.set(
                landingStartX + 1.4 / 2 - center.x,
                levelY + landingThickness / 2 - box.min.y,
                tableCenterZ - center.z
            );

            elements.add(table);
        })
        .catch(console.error);
}

function createWalls({
    elements,
    colors,
    width,
    depth,
    x,
    z,
    wallHeight,
    backWallX,
    toggleDoor,
    doorPivots,
}) {
    loadTexture('/assets/textures/painted_plaster.jpg')
        .then((wallTexture) => {
            wallTexture.wrapS = THREE.RepeatWrapping;
            wallTexture.wrapT = THREE.RepeatWrapping;
            wallTexture.repeat.set(6, 4);

            const wallMaterial = new THREE.MeshPhongMaterial({
                map: wallTexture,
                side: THREE.DoubleSide,
                color: colors.floor,
            });

            createBackWall(elements, wallMaterial, backWallX, wallHeight, depth, z);
            createFrontWallWithDoors({
                elements,
                wallMaterial,
                width,
                depth,
                x,
                z,
                wallHeight,
                toggleDoor,
                doorPivots,
            });
            createSideWalls(elements, wallMaterial, backWallX, x, z, depth, wallHeight, width);
        })
        .catch(console.error);
}

function createBackWall(elements, wallMaterial, backWallX, wallHeight, depth, z) {
    const wallBack = new THREE.Mesh(
        new THREE.PlaneGeometry(depth, wallHeight),
        wallMaterial
    );

    wallBack.rotation.y = Math.PI / 2;
    wallBack.position.set(backWallX, wallHeight / 2, z);
    elements.add(wallBack);
}

function createFrontWallWithDoors({elements,wallMaterial,width,depth,x,z,wallHeight,toggleDoor,doorPivots,}) {
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

    const frontSeg1Width = door1StartZ - wallMinZ;
    const frontSeg2Width = door2StartZ - door1EndZ;
    const frontSeg3Width = wallMaxZ - door2EndZ;

    createWallSegment(elements, wallMaterial, frontSeg1Width, wallHeight, {
        x: x - width / 2,
        y: wallHeight / 2,
        z: wallMinZ + frontSeg1Width / 2,
        rotationY: -Math.PI / 2,
    });

    createWallSegment(elements, wallMaterial, frontSeg2Width, wallHeight, {
        x: x - width / 2,
        y: wallHeight / 2,
        z: door1EndZ + frontSeg2Width / 2,
        rotationY: -Math.PI / 2,
    });

    createWallSegment(elements, wallMaterial, frontSeg3Width, wallHeight, {
        x: x - width / 2,
        y: wallHeight / 2,
        z: door2EndZ + frontSeg3Width / 2,
        rotationY: -Math.PI / 2,
    });

    createWallSegment(elements, wallMaterial, doorWidth, wallHeight - doorHeight, {
        x: x - width / 2,
        y: doorHeight + (wallHeight - doorHeight) / 2,
        z: door1CenterZ,
        rotationY: -Math.PI / 2,
    });

    createWallSegment(elements, wallMaterial, doorWidth, wallHeight - doorHeight, {
        x: x - width / 2,
        y: doorHeight + (wallHeight - doorHeight) / 2,
        z: door2CenterZ,
        rotationY: -Math.PI / 2,
    });

    createDoorAt({
        elements,
        doorCenterZ: door1CenterZ,
        hingeOnLowerZSide: true,
        x,
        width,
        doorWidth,
        toggleDoor,
        doorPivots,
    });

    createDoorAt({
        elements,
        doorCenterZ: door2CenterZ,
        hingeOnLowerZSide: false,
        x,
        width,
        doorWidth,
        toggleDoor,
        doorPivots,
    });
}

function createWallSegment(elements, material, segmentWidth, segmentHeight, position) {
    const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(segmentWidth, segmentHeight),
        material
    );

    wall.rotation.y = position.rotationY ?? 0;
    wall.position.set(position.x, position.y, position.z);
    elements.add(wall);
}

function createDoorAt({elements,doorCenterZ,hingeOnLowerZSide,x,width,doorWidth,toggleDoor,doorPivots,}) {
    makeInstance('/assets/models/door.glb')
        .then((doorObj) => {
            doorObj.scale.set(-4, -4, -4);
            doorObj.updateMatrixWorld(true);

            const doorBox = new THREE.Box3().setFromObject(doorObj);
            const doorCenter = doorBox.getCenter(new THREE.Vector3());

            const pivot = new THREE.Group();
            pivot.userData.kind = 'door';
            pivot.userData.action = 'toggleDoor';
            pivot.userData.toggleDoor = toggleDoor;

            let closedRotation = 0;
            let openRotation = 0;

            if (hingeOnLowerZSide) {
                pivot.position.set(
                    x - width / 2 + 0.02,
                    0,
                    doorCenterZ - doorWidth / 2
                );

                doorObj.position.set(
                    -doorBox.min.x,
                    -doorBox.min.y,
                    -doorCenter.z
                );

                openRotation = -Math.PI / 2;
            } else {
                pivot.position.set(
                    x - width / 2 + 0.02,
                    0,
                    doorCenterZ + doorWidth / 2
                );

                doorObj.position.set(
                    -doorBox.min.x,
                    -doorBox.min.y,
                    -doorCenter.z
                );

                openRotation = Math.PI / 2;
            }

            pivot.rotation.y = closedRotation;
            pivot.add(doorObj);
            elements.add(pivot);

            doorPivots.push({
                pivot,
                closedRotation,
                openRotation,
            });
        })
        .catch(console.error);
}

function createSideWalls(elements, wallMaterial, backWallX, x, z, depth, wallHeight, width) {
    const wallLength = backWallX - (x - width / 2);

    const wallLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(wallLength, wallHeight),
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
}