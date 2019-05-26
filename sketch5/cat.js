import * as THREE from 'three';
const FBXLoader = require('three-fbx-loader');
import catVert from './cat.vert';
import catFrag from './cat.frag';
import catModel from './catModel.fbx';
import catModelEverything from './cat-everything.fbx';

export default function Cat() {
    const loader = new FBXLoader();
    // cat body
    const catMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xf4fdff) }
        },
        vertexShader: catVert,
        fragmentShader: catFrag,
        transparent: true,
        // opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    this.loadCat = function (scene) {
        loader.load(catModel, function (object) {
            // apply shader material
            object.frustumCulled = false;
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.material = catMat;
                    child.material.depthTest = false;
                    child.frustumCulled = false;
                }
            });
            scene.add(object);
        });
    }
}