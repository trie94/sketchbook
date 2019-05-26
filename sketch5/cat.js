import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
const FBXLoader = require('three-fbx-loader');
import catVert from './cat.vert';
import catFrag from './cat.frag';
import catModel from './catBody.fbx';


export default function Cat() {
    const loader = new FBXLoader();

    // cat body
    const catMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xb7edff) },
            rimColor: { type: "c", value: new THREE.Color(0xb7edff) },
            rimPower: { type: "f", value: 10 }
        },
        vertexShader: catVert,
        fragmentShader: catFrag,
        transparent: true,
        opacity: 0.7,
        depthTest: false
    });

    this.loadCat = function (scene) {
        loader.load(catModel, function (object3d) {
            // console.log(object3d.children[0]);
            object3d.children[0].material = catMat;
            scene.add(object3d);
        });
    }
}