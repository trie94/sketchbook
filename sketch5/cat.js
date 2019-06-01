import * as THREE from 'three';
const FBXLoader = require('three-fbx-loader');
import catVert from './shaders/cat.vert';
import catFrag from './shaders/cat.frag';
import catRig from './assets/cat-everything.fbx';
import catFace from './assets/face.png';
import catFace2 from './assets/face2.png';
import catFace3 from './assets/face3.png';
import catFace4 from './assets/face4.png';

export default function Cat() {
    let cat = null;
    let time = 0;
    let tailBones = [];
    let frontLegBones = [];
    let backLegBones = [];
    let earBones = [];
    let faceTextures = [];
    let tick = 0;
    let moveTick = 0;
    let axis = new THREE.Vector3(0, 0, 0);
    let front = new THREE.Vector3(0, 0, 1);
    let pt, radians, tangent;
    let faceIndex = 0;

    const clock = new THREE.Clock();
    const textureLoader = new THREE.TextureLoader();
    const loader = new FBXLoader();

    const basicMat = new THREE.MeshBasicMaterial({
        colorWrite: false,
        // color: 0xb7edff,
        transparent: false,
        skinning: true
    });

    // cat body
    const catMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) },
            rimPower: { type: "f", value: 2.5 },
            scale: { type: "f", value: 0.072 },
            time: { type: "f", value: 0.0 },
            freq: { type: "f", value: 0.6 }
        },
        vertexShader: catVert,
        fragmentShader: catFrag,
        transparent: true,
        blending: THREE.AdditiveBlending,
        skinning: true
    });

    // cat body
    const catMatDepth = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) },
            rimPower: { type: "f", value: 4.0 },
            scale: { type: "f", value: 0.072 },
            time: { type: "f", value: 0.0 },
            freq: { type: "f", value: 0.6 }
        },
        vertexShader: catVert,
        fragmentShader: catFrag,
        transparent: false,
        colorWrite: false,
        skinning: true
    });

    const catLimbMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) },
            rimPower: { type: "f", value: 0.7 },
            scale: { type: "f", value: 0.0 },
            time: { type: "f", value: 0.0 },
            freq: { type: "f", value: 0.8 }
        },
        vertexShader: catVert,
        fragmentShader: catFrag,
        transparent: true,
        // depthTest: false,
        depthWrite: false,
        // opacity: 0.7,
        blending: THREE.AdditiveBlending,
        skinning: true
    });

    const catTailMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) },
            rimPower: { type: "f", value: 1.0 },
            scale: { type: "f", value: 0.0 },
            time: { type: "f", value: 0.0 },
            freq: { type: "f", value: 0.5 }
        },
        vertexShader: catVert,
        fragmentShader: catFrag,
        transparent: true,
        // depthTest: false,
        depthWrite: false,
        // opacity: 0.7,
        blending: THREE.AdditiveBlending,
        skinning: true
    });

    const cubeGeo = new THREE.BoxGeometry(3, 3, 3);
    const cube = new THREE.Mesh(cubeGeo, basicMat);
    cube.position.z = -15;

    const plane = new THREE.PlaneGeometry(3.5, 3.5, 1);
    const faceMat = new THREE.MeshBasicMaterial({
        color: 0xb7edff,
        transparent: true,
        alphaTest: 0.5,
        depthTest: false,
        // blending: THREE.MultiplyBlending
        // side: THREE.DoubleSide
    });
    const facePlane = new THREE.Mesh(plane, faceMat);
    facePlane.position.z = 6.5;
    facePlane.position.y = 3.6;
    facePlane.rotation.x = -0.3;
    // facePlane.renderOrder = 100;

    faceTextures.push(textureLoader.load(catFace));
    faceTextures.push(textureLoader.load(catFace2));
    faceTextures.push(textureLoader.load(catFace3));
    faceTextures.push(textureLoader.load(catFace4));

    // default
    faceMat.map = faceTextures[faceIndex];

    this.loadCat = function (scene) {
        loader.load(catRig, function (object) {
            loader.load(catRig, function (object) {
                loader.load(catRig, function (object) {
                    loader.load(catRig, function (object) {
                        // apply shader material
                        object.traverse(function (child) {
                            // console.log(child.name);
                            if (child.isMesh) {
                                if (child.name == "BodyModel") {
                                    // child.material = catMat;
                                    child.geometry.clearGroups();
                                    child.geometry.addGroup(0, Infinity, 0);
                                    child.geometry.addGroup(0, Infinity, 1);
                                    child.material = [catMatDepth, catMat];
                                } else if (child.name.includes("TailModel")) {
                                    child.material = catTailMat;
                                } else {
                                    child.material = catLimbMat;
                                }
                            }
                            if (child.name.includes('Tail_CoreModel')) {
                                let tempBone = child;
                                // reposition the tail
                                tempBone.position.z = 1;
                                while (tempBone != null) {
                                    tailBones.push(tempBone);
                                    tempBone = tempBone.children[0];
                                }
                                // console.log(tailBones);
                            }
                            if (child.name.includes('L_FrontLeg_CoreModel') || child.name.includes('R_FrontLeg_CoreModel')) {
                                frontLegBones.push(child);
                                // console.log(frontLegBones);
                            }
                            if (child.name.includes('L_BackLeg_CoreModel') || child.name.includes('R_BackLeg_CoreModel')) {
                                backLegBones.push(child);
                                // console.log(backLegBones);
                            }
                            if (child.name.includes('L_Ear_CoreModel') || child.name.includes('R_Ear_CoreModel')) {
                                earBones.push(child);
                                // console.log(earBones);
                            }
                        });
                        object.add(facePlane);
                        // assign object to global cat
                        cat = object;
                        // cat.matrixWorldNeedsUpdate = true;
                        scene.add(cat);
                        // console.log(cat);
                    });
                });
            });
        });
    }

    this.getCatPos = function () {
        if (cat == null) return cat;
        return cat.position;
    }

    this.update = function (path) {
        if (cat == null) return;
        time = Date.now() / 1000 % 120000;
        const tailAngle = Math.cos(time);
        const angle = Math.sin(time * 3);
        const earAngle = Math.cos(time * 2);

        catMat.uniforms.time.value = time * 2;
        // catMat.uniforms.scale.value = 0.075;
        catMatDepth.uniforms.time.value = time * 2;
        // catMatDepth.uniforms.scale.value = 0.075;
        catLimbMat.uniforms.time.value = time * 5;
        catLimbMat.uniforms.scale.value = time * 0.0000015;
        catTailMat.uniforms.time.value = time * 5;
        catTailMat.uniforms.scale.value = time * 0.0000005;
        // console.log(catMat.uniforms.time.value);

        // move tail
        tailBones[0].rotation.y = (Math.PI * tailAngle) / 16 + 1.5;
        tailBones[1].rotation.z = (Math.PI * tailAngle) / 8;
        tailBones[2].rotation.z = (Math.PI * tailAngle / 2) / 8;
        tailBones[3].rotation.z = (Math.PI * tailAngle) / 16;

        // move legs
        frontLegBones[0].rotation.y = -(Math.PI * angle) / 6;
        frontLegBones[1].rotation.y = (Math.PI * angle) / 6;
        backLegBones[0].rotation.y = (Math.PI * angle) / 6 + 1;
        backLegBones[1].rotation.y = -(Math.PI * angle) / 6 - 1;

        // move ears
        earBones[0].rotation.z = (Math.PI * earAngle) / 16;
        earBones[0].children[0].rotation.y = (Math.PI * earAngle) / 16;
        earBones[1].rotation.z = (Math.PI * earAngle) / 16;
        earBones[1].children[0].rotation.y = (Math.PI * earAngle) / 16;

        // move face
        facePlane.position.x = (Math.PI * earAngle) / 8;

        // update face
        if (tick < 0) {
            faceIndex = (faceIndex + 1) % faceTextures.length;
            faceMat.map = faceTextures[faceIndex];
            if (faceIndex == 0) {
                tick = 20;
            } else {
                tick = 1;
            }
        }
        tick -= clock.getDelta() * 8;
        moveTick = (moveTick >= 0.998) ? 0 : moveTick += 0.0001;

        // set the marker position
        pt = path.getPoint(moveTick);
        // set the marker position
        cat.position.set(pt.x, pt.y, pt.z);
        // get the tangent to the curve
        tangent = path.getTangent(moveTick).normalize();
        // calculate the axis to rotate around
        axis.crossVectors(front, tangent).normalize();
        // calcluate the angle between the up vector and the tangent
        radians = Math.acos(front.dot(tangent));
        // set the quaternion
        cat.quaternion.setFromAxisAngle(axis, radians);
    }
}