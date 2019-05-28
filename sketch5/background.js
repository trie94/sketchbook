import * as THREE from 'three';
import vertShader from '../shaders/gradient.vert';
import fragShader from '../shaders/gradient.frag';

export default function skybox() {
    const gradgeo = new THREE.BoxGeometry(10000, 10000, 10000);
    const gradMat = new THREE.ShaderMaterial({
        uniforms: {
            uColorA: { value: new THREE.Color(0x5984f9) },
            uColorB: { value: new THREE.Color(0x91f2ff) }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
        side: THREE.BackSide,
        depthWrite: false
    });

    const testMat = new THREE.MeshBasicMaterial({ color: 0x5984f9, side: THREE.BackSide });
    const gradMesh = new THREE.Mesh(gradgeo, gradMat);
    return gradMesh;
}