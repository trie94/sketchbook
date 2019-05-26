import * as THREE from 'three';
import vertShader from '../shaders/gradient.vert';
import fragShader from '../shaders/gradient.frag';

export default function skybox() {
    const gradMesh = new THREE.Mesh(
        new THREE.BoxGeometry(10000, 10000, 10000),
        new THREE.ShaderMaterial({
            uniforms: {
                uColorA: { value: new THREE.Color(0x5984f9) },
                uColorB: { value: new THREE.Color(0x91f2ff) }
            },
            vertexShader: vertShader,
            fragmentShader: fragShader,
            side: THREE.BackSide,
            depthWrite: false
        })
    );

    return gradMesh;
}