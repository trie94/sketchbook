import * as THREE from 'three';
const FBXLoader = require('three-fbx-loader');
import catVert from './cat.vert';
import catFrag from './cat.frag';
import catRig from './cat-everything.fbx';

export default function Cat() {
    let cat;
    let time;
    let tailBones = [];
    let frontLegBones = [];
    let backLegBones = [];

    const loader = new FBXLoader();
    // cat body
    const catMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) },
            rimPower: { type: "f", value: 4.0 },
            scale: { type: "f", value: 0.0 },
            time: { type: "f", value: 0.0 },
            freq: { type: "f", value: 0.6 }
        },
        vertexShader: catVert,
        fragmentShader: catFrag,
        transparent: true,
        // depthTest: false,
        // depthWrite: false,
        // opacity: 0.7,
        blending: THREE.AdditiveBlending,
        skinning: true
    });

    const catLimbMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) },
            rimPower: { type: "f", value: 1.0 },
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

    const testMat = new THREE.MeshBasicMaterial({ color: 0xb7edff, skinning: true });

    this.loadCat = function (scene) {
        loader.load(catRig, function (object) {
            loader.load(catRig, function (object) {
                // apply shader material
                object.traverse(function (child) {
                    // console.log(child.name);
                    if (child.isMesh) {
                        // console.log(child.name);
                        if (child.name == "BodyModel") {
                            child.material = catMat;
                            // child.material = testMat;
                        } else {
                            child.material = catLimbMat;
                            // child.material = testMat;
                        }
                    }
                    if (child.name.includes('Tail_CoreModel')) {
                        let tempBone = child;
                        while (tempBone != null) {
                            tailBones.push(tempBone);
                            tempBone = tempBone.children[0];
                        }
                        // console.log(tailBones);
                    }
                    if (child.name.includes('L_FrontLeg_CoreModel') || child.name.includes('R_FrontLeg_CoreModel')) {
                        frontLegBones.push(child);
                        console.log(frontLegBones);
                    }
                    if (child.name.includes('L_BackLeg_CoreModel') || child.name.includes('R_BackLeg_CoreModel')) {
                        backLegBones.push(child);
                        console.log(backLegBones);
                    }
                });
                cat = object;
                cat.matrixWorldNeedsUpdate = true;
                scene.add(cat);
                // console.log(cat);
            });
        });
    }

    this.update = function () {
        if (cat == null) return;
        const tailAngle = Math.sin(time);
        const angle = Math.sin(time * 3);

        time = Date.now() / 1000 % 120000;
        catMat.uniforms.time.value = time;
        catMat.uniforms.scale.value = time * 0.0000015;
        catLimbMat.uniforms.time.value = time * 5;
        catLimbMat.uniforms.scale.value = time * 0.0000015;

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
    }
}