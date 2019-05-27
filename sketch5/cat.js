import * as THREE from 'three';
const FBXLoader = require('three-fbx-loader');
import catVert from './cat.vert';
import catFrag from './cat.frag';
import catModelEverything from './cat-everything.fbx';

export default function Cat() {
    let cat;
    const loader = new FBXLoader();
    // cat body
    const catMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) },
            rimPower: { type: "f", value: 4.0 }
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
            rimPower: { type: "f", value: 1.0 }
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
        loader.load(catModelEverything, function (object) {
            // apply shader material
            // object.frustumCulled = false;
            object.traverse(function (child) {
                if (child.isMesh) {
                    // console.log(child.name);
                    if (child.name == "BodyModel") {
                        child.material = catMat;
                    } else {
                        child.material = catLimbMat;
                    }
                }
            });
            cat = object;
            scene.add(cat);
        });
    }

    this.update = function () {
        if (cat == null) return;
    }
}