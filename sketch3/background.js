import * as THREE from 'three';
import vertShader from '../shaders/gradient.vert';
import fragShader from '../shaders/gradient.frag';

export default function skybox() {
    const gradObj = new THREE.Object3D();
    const gradMesh = new THREE.Mesh(
        new THREE.BoxGeometry(10000, 10000, 10000),
        new THREE.ShaderMaterial({
            uniforms: {
                uColorA: { value: new THREE.Color(0xe3e6ef) },
                uColorB: { value: new THREE.Color(0xfeffd8) }
            },
            vertexShader: vertShader,
            fragmentShader: fragShader,
            side: THREE.BackSide
        })
    );

    gradObj.add(gradMesh);

    return gradObj;
}