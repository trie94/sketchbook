import * as THREE from 'three';

export default class Creature {
    constructor() {
        // this.position = position;
        this.creatureState = this.creatureState.bind(this);
        this.idle = this.idle.bind(this);
        this.moveToward = this.moveToward.bind(this);
        this.avoid = this.avoid.bind(this);
        this.skeletonHelper = this.skeletonHelper.bind(this);
        this.calculateSkinIndex = this.calculateSkinIndex.bind(this);
        this.calculateSkinWeight = this.calculateSkinWeight.bind(this);
        this.update = this.update.bind(this);

        this.bones = [];
        this.root = new THREE.Bone();
        this.spine1 = new THREE.Bone();
        this.spine2 = new THREE.Bone();
        this.spine3 = new THREE.Bone();
        this.spine4 = new THREE.Bone();
        this.spine5 = new THREE.Bone();

        this.faceObj = new THREE.Object3D();
        this.heightSegment = 20;

        this.eyeGeo = new THREE.SphereGeometry(0.7, 10, 10);
        this.eyeMat = new THREE.MeshBasicMaterial({
            color: 0x44403c,
            side: THREE.DoubleSide,
            flatShading: true
        });

        this.leftEyeMesh = new THREE.Mesh(this.eyeGeo, this.eyeMat);
        this.rightEyeMesh = new THREE.Mesh(this.eyeGeo, this.eyeMat);

        this.mouthPointsArray = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 0.3, 0.5),
            new THREE.Vector3(1, 0, 0)];

        this.mouthCurve = new THREE.CatmullRomCurve3(this.mouthPointsArray);
        this.mouthGeo = new THREE.TubeGeometry(this.mouthCurve, 20, 0.3, 5);
        this.mouthMesh = new THREE.Mesh(this.mouthGeo, this.eyeMat);

        this.leftEyeMesh.position.set(2.5, 0, 3.7);
        this.rightEyeMesh.position.set(-2.5, 0, 3.7);
        this.mouthMesh.position.set(0, 0, 5);
        this.mouthMesh.rotation.z = Math.PI;

        this.faceObj.add(this.leftEyeMesh);
        this.faceObj.add(this.rightEyeMesh);
        this.faceObj.add(this.mouthMesh);

        // face
        this.faceGeo = new THREE.SphereGeometry(7, 10, 20);
        this.faceMat = new THREE.MeshBasicMaterial({
            color: 0xefe9e3,
            side: THREE.DoubleSide,
            flatShading: true,
            // transparent: true,
            // opacity: 0.5
        });

        this.faceMesh = new THREE.Mesh(this.faceGeo, this.faceMat);
        this.faceMesh.position.y = -5;

        this.hatGeo = new THREE.IcosahedronGeometry(1.5, 0);
        this.hatMat = new THREE.MeshBasicMaterial({
            color: 0xfffadd,
            side: THREE.DoubleSide,
            flatShading: true
        });

        this.hat = new THREE.Mesh(this.hatGeo, this.hatMat);
        this.hat.position.set(0, 8, 0);

        this.bodyGeo = new THREE.CylinderGeometry(5, 7, 15, 20, this.heightSegment);
        this.bodyMat = new THREE.MeshBasicMaterial({
            color: 0xe58b61,
            skinning: true,
            // transparent: true,
            // opacity: 0.5
        });
        this.creature = new THREE.SkinnedMesh(this.bodyGeo, this.bodyMat);

        //Create the skin indices and skin weights
        for (let i = 0; i < this.bodyGeo.vertices.length; i++) {

            this.skinIndex = this.calculateSkinIndex(30, this.bones.length, this.bodyGeo.vertices, i);
            this.skinWeight = this.calculateSkinWeight(30, this.bones.length, this.bodyGeo.vertices, i);

            this.bodyGeo.skinIndices.push(new THREE.Vector4(this.skinIndex, this.skinIndex + 1, 0, 0));
            this.bodyGeo.skinWeights.push(new THREE.Vector4(1 - this.skinWeight, this.skinWeight, 0, 0));
        }

        // hierarchy
        this.root.add(this.spine1);
        this.spine1.add(this.spine2);
        this.spine2.add(this.spine3);
        this.spine3.add(this.spine4);
        this.spine4.add(this.spine5);

        // push bones
        this.bones.push(this.root);
        this.bones.push(this.spine1);
        this.bones.push(this.spine2);
        this.bones.push(this.spine3);
        this.bones.push(this.spine4);
        this.bones.push(this.spine5);

        this.root.position.y = -10;
        this.spine1.position.y = 7;
        this.spine2.position.y = 5;
        this.spine3.position.y = 5;
        this.spine4.position.y = 5;
        this.spine5.position.y = 3;

        this.spine5.add(this.faceMesh);
        this.spine5.add(this.leftEyeMesh);
        this.spine5.add(this.rightEyeMesh);
        this.spine5.add(this.hat);
        this.spine5.add(this.mouthMesh);

        this.skeleton = new THREE.Skeleton(this.bones);
        this.creature.add(this.root);
        this.creature.position.y = -10;

        // position before bind
        this.creature.add(this.root);
        this.creature.bind(this.skeleton);

        // #region animation
        this.speed = 0.005;
        this.avoidSpeed = 0.01;

        this.avoidPos = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.distance;
        this.hasArrived = false;

        this.state;
        this.statesEnum = {
            IDLE: "IDLE",
            MOVE: "MOVE",
            AVOID: "AVOID",
            WATCH: "WATCH",
            PRAY: "PRAY"
        };

        return this.creature;
    }

    creatureState(angle, blockPos, blockNewPos, blockRad, avoidRad) {

        let blockDir = direction.subVectors(blockNewPos, blockPos).normalize();
        distance = Math.floor(creature.position.distanceTo(blockPos));

        // avoidPos.x = creature.position.x + blockDir.x;
        // avoidPos.y = creature.position.y + blockDir.y;
        // avoidPos.z = creature.position.z + blockDir.z;
        // console.log(blockDir);

        if (distance == blockRad) {
            hasArrived = true;
            if (state !== statesEnum.WATCH) state = statesEnum.WATCH;
        }

        // hold the char in the idle zone, avoid jittery movement
        if (distance >= blockRad + 5) {
            hasArrived = false;
            if (state !== statesEnum.WATCH) state = statesEnum.WATCH;
            // skinMesh.position.x = snapPos.x;
            // skinMesh.position.z = snapPos.z;
        }

        if (distance > blockRad) {
            if (!hasArrived) {
                state = statesEnum.MOVE;
            }
        }
        if (distance < avoidRad) {
            // avoid
            state = statesEnum.AVOID;
        }

        // determine behavior
        switch (state) {
            case statesEnum.IDLE:
                idle(angle);
                break;
            case statesEnum.MOVE:
                moveToward(blockPos);
                break;
            case statesEnum.AVOID:
                avoid();
                break;
        }
    }

    idle(angle) {
        this.bones[0].rotation.y = (Math.PI * angle) / 4;
        this.bones[1].rotation.z = (Math.PI * angle) / 4;
        this.bones[2].rotation.z = (Math.PI * angle) / 2;
        this.bones[3].rotation.z = (Math.PI * angle) / 4;
        this.bones[4].rotation.z = (Math.PI * angle) / 8;
        this.bones[5].rotation.z = (Math.PI * angle) / 8;

        let hatPos = new THREE.Vector3(faceMesh.position.x, faceMesh.position.y + 15, faceMesh.position.z);
        this.hat.position.lerp(hatPos, this.speed);
        this.hat.rotation.x = (Math.PI * angle) * 4;
        this.hat.rotation.y = (Math.PI * angle) * 4;
        this.hat.rotation.z = (Math.PI * angle) * 4;
    }

    moveToward(blockPos) {
        this.creature.position.lerp(blockPos, this.speed);
    }

    avoid(avoidPos) {
        this.creature.position.lerp(avoidPos, this.speed);
    }

    skeletonHelper(mesh) {
        const helper = new THREE.SkeletonHelper(mesh);
        helper.material.linewidth = 3;

        return helper;
    }

    calculateSkinIndex(height, boneNum, vertice, number) {
        return Math.floor((vertice[number].y + (height / 2)) / height * (boneNum - 1));
    }

    calculateSkinWeight(height, boneNum, vertice, number) {
        return ((vertice[number].y + (height / 2)) / height * (boneNum - 1))
            - Math.floor((vertice[number].y + (height / 2)) / height * (boneNum - 1));
    }

    update(){
        const time = Date.now() * 0.004;
        const angle = Math.sin(time) / 8;
        this.frameId = window.requestAnimationFrame(this.update);
        this.idle(angle);
    }
}