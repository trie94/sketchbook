import * as THREE from 'three';
import rayVert from './shaders/godray.vert';
import rayFrag from './shaders/godray.frag';

export default function godRays(width, height, position, intensity, freq) {
    const lightMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xff8800) },
            intensity: { type: "f", value: intensity }
        },
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        transparent: true,
        vertexShader: rayVert,
        fragmentShader: rayFrag,
        depthWrite: false
    });
    const lightGeo = new THREE.PlaneGeometry(width, height);
    const lightMesh = new THREE.Mesh(lightGeo, lightMat);
    lightMesh.rotation.z = Math.PI / 8;
    lightMesh.position.x = position.x;
    lightMesh.position.y = position.y;
    lightMesh.position.z = position.z;
    let time = 0;

    this.getLight = function () {
        return lightMesh;
    }

    this.update = function (camera) {
        time = Date.now() / 1000 % 120000;
        lightMesh.rotation.y = Math.atan2((camera.position.x - lightMesh.position.x), (camera.position.z - lightMesh.position.z));
        lightMesh.rotation.z += Math.cos(time) * 0.0003;
        lightMat.uniforms.intensity.value = intensity + Math.sin(time * freq) * 0.3;
    }
}