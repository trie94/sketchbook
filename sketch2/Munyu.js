import * as THREE from 'three';
import munyuSound from '../assets/sounds/munyu_basic.wav';
import amazinguSound from '../assets/sounds/amazingu.wav';
import fragShader from '../shaders/glow.frag';
import vertexShader from '../shaders/glow.vert';

export default function Munyu() {

    const faceObj = new THREE.Object3D();
    const heightSegment = 20;
    let cameraPos = new THREE.Vector3(0, 200, 500);

    const eyeGeo = new THREE.SphereGeometry(0.7, 10, 10);
    const eyeMat = new THREE.MeshBasicMaterial({
        color: 0x44403c,
        side: THREE.DoubleSide,
        flatShading: true
    });

    const leftEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    const rightEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);

    const mouthPointsArray = [
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0.3, 0.5),
        new THREE.Vector3(1, 0, 0)];

    const mouthCurve = new THREE.CatmullRomCurve3(mouthPointsArray);
    const mouthGeo = new THREE.TubeGeometry(mouthCurve, 20, 0.3, 5);
    const mouthMesh = new THREE.Mesh(mouthGeo, eyeMat);

    leftEyeMesh.position.set(2.5, 0, 3.7);
    rightEyeMesh.position.set(-2.5, 0, 3.7);
    mouthMesh.position.set(0, 0, 5);
    mouthMesh.rotation.z = Math.PI;

    faceObj.add(leftEyeMesh);
    faceObj.add(rightEyeMesh);
    faceObj.add(mouthMesh);

    // face
    const faceGeo = new THREE.SphereGeometry(7, 10, 20);
    const faceMat = new THREE.MeshBasicMaterial({
        color: 0xefe9e3,
        side: THREE.DoubleSide,
        flatShading: true
    });

    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.y = -5;

    const hatGeo = new THREE.SphereGeometry(1.5, 10, 10);
    const hatMat = new THREE.MeshBasicMaterial({
        color: 0xfffadd,
        side: THREE.DoubleSide,
        flatShading: true,
        transparent: true,
        opacity: 0.7
    });

    const glowingHatMat = new THREE.ShaderMaterial({
        uniforms: {
            rimColor: { type: "c", value: new THREE.Color(0xfffadd) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragShader,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    const hat = new THREE.Mesh(hatGeo, glowingHatMat);
    hat.position.set(0, 8, 0);

    const bodyGeo = new THREE.CylinderGeometry(5, 7, 15, 20, heightSegment);
    const bodyMat = new THREE.MeshBasicMaterial({
        color: 0xc36251,
        skinning: true
    });

    // munyu body
    const munyu = new THREE.SkinnedMesh(bodyGeo, bodyMat);

    // bones
    let bones = [];
    const root = new THREE.Bone();
    const spine1 = new THREE.Bone();
    const spine2 = new THREE.Bone();
    const spine3 = new THREE.Bone();
    const spine4 = new THREE.Bone();
    const spine5 = new THREE.Bone();

    // hierarchy
    root.add(spine1);
    spine1.add(spine2);
    spine2.add(spine3);
    spine3.add(spine4);
    spine4.add(spine5);

    // push bones
    bones.push(root);
    bones.push(spine1);
    bones.push(spine2);
    bones.push(spine3);
    bones.push(spine4);
    bones.push(spine5);

    root.position.y = -10;
    spine1.position.y = 7;
    spine2.position.y = 5;
    spine3.position.y = 5;
    spine4.position.y = 5;
    spine5.position.y = 3;

    spine5.add(faceMesh);
    spine5.add(leftEyeMesh);
    spine5.add(rightEyeMesh);
    spine5.add(hat);
    spine5.add(mouthMesh);

    //Create the skin indices and skin weights
    for (let i = 0; i < bodyGeo.vertices.length; i++) {

        let skinIndex = calculateSkinIndex(30, bones.length, bodyGeo.vertices, i);
        let skinWeight = calculateSkinWeight(30, bones.length, bodyGeo.vertices, i);

        bodyGeo.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
        bodyGeo.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));
    }

    const skeleton = new THREE.Skeleton(bones);
    munyu.add(root);
    munyu.position.y = -10;

    // munyu shadow
    const shadowGeo = new THREE.CircleGeometry(9, 20);
    const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x7e9dd3,
        side: THREE.DoubleSide,
        blending: THREE.MultiplyBlending
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.set(Math.PI / 2, 0, 0);
    shadowMesh.position.set(0, -5, 0);
    spine1.add(shadowMesh);

    // position before bind
    munyu.add(root);
    munyu.bind(skeleton);

    function calculateSkinIndex(height, boneNum, vertice, number) {
        return Math.floor((vertice[number].y + (height / 2)) / height * (boneNum - 1));
    }

    function calculateSkinWeight(height, boneNum, vertice, number) {
        return ((vertice[number].y + (height / 2)) / height * (boneNum - 1))
            - Math.floor((vertice[number].y + (height / 2)) / height * (boneNum - 1));
    }

    // animation
    const statesEnum = {
        IDLE: "IDLE",
        MOVE: "MOVE",
        AVOID: "AVOID",
        WATCH: "WATCH",
        PRAY: "PRAY"
    };
    let state = statesEnum.IDLE;

    this.getMunyu = function (x, y, z, color) {
        munyu.position.set(x, y, z);
        munyu.material.color = new THREE.Color(color);
        return munyu;
    }

    this.setMunyuState = function (state) {
        return state;
    }

    this.idle = function (speed) {

        // rotation
        const time = Date.now() * speed;
        const angle = Math.sin(time) / 8;

        bones[0].rotation.y = (Math.PI * angle) / 4;
        bones[1].rotation.z = (Math.PI * angle) / 4;
        bones[2].rotation.z = (Math.PI * angle) / 2;
        bones[3].rotation.z = (Math.PI * angle) / 4;
        bones[4].rotation.z = (Math.PI * angle) / 8;
        bones[5].rotation.z = (Math.PI * angle) / 8;

        let hatPos = new THREE.Vector3(faceMesh.position.x, faceMesh.position.y + 15, faceMesh.position.z);
        hat.position.lerp(hatPos, speed);
        hat.rotation.x = (Math.PI * angle) * 4;
        hat.rotation.y = (Math.PI * angle) * 4;
        hat.rotation.z = (Math.PI * angle) * 4;
    }

    this.move = function (targetPos, speed) {
        const time = Date.now() * speed;
        const angle = Math.cos(time) / 8;
        munyu.position.lerp(targetPos, speed);
        console.log("move");
    }

    this.setCameraPos = function (camPos) {
        cameraPos = camPos;
    }

    // sound
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const munyuAudio = new THREE.Audio(listener);
    const amazinguAudio = new THREE.Audio(listener);

    function loadSound() {
        audioLoader.load(munyuSound, (buffer) => {
            munyuAudio.setBuffer(buffer);
            munyuAudio.setLoop(false);
            munyuAudio.setVolume(1);
        });
        audioLoader.load(amazinguSound, (buffer) => {
            amazinguAudio.setBuffer(buffer);
            amazinguAudio.setLoop(false);
            amazinguAudio.setVolume(1);
        });
    }

    this.getListener = function () {
        loadSound();
        return listener;
    }

    this.playMunyu = function () {
        if (munyuAudio.isPlaying) munyuAudio.stop();
        munyuAudio.play();
    }

    this.playAmazingu = function () {
        if (amazinguAudio.isPlaying) amazinguAudio.stop();
        amazinguAudio.play();
    }
}