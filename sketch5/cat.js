import * as THREE from 'three';
const FBXLoader = require('three-fbx-loader');
import catVert from './cat.vert';
import catFrag from './cat.frag';
import catRig from './cat-everything.fbx';

export default function Cat() {
    let cat;
    let time;

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
        // opacity: 0.7,
        blending: THREE.AdditiveBlending
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
        // opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const testMat = new THREE.MeshBasicMaterial({ color: 0xb7edff });

    this.loadCat = function (scene) {
        loader.load(catRig, function (object) {
            loader.load(catRig, function (object) {
                // apply shader material
                // object.frustumCulled = false;
                object.traverse(function (child) {
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
                    if (child.isBone) {
                        console.log(child.name);
                    }
                });
                cat = object;
                scene.add(cat);
                console.log(cat);
            });
        });
    }

    this.update = function () {
        if (cat == null) return;
        time = Date.now() / 1000 % 120000;
        catMat.uniforms.time.value = time;
        catMat.uniforms.scale.value = time * 0.0000005;
        catLimbMat.uniforms.time.value = time;
        catLimbMat.uniforms.scale.value = time * 0.000002;
    }
}