import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import catVert from './cat.vert';
import catFrag from './cat.frag';

export default function Cat() {

    const catObj = new THREE.Object3D();

    // cat body
    const catGeo = new THREE.SphereGeometry(20, 10, 10);
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

    const catMesh = new THREE.Mesh(catGeo, catMat);
    catObj.add(catMesh);

    this.getCat = function () {
        console.log("meow");
        return catObj;
    }
}