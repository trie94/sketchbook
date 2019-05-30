import * as THREE from 'three';
import terrainVert from './shaders/terrain.vert';
import terrainFrag from './shaders/terrain.frag';

export default function terrain() {
    const clock = new THREE.Clock();
    const terrainGeo = new THREE.SphereGeometry(100, 30, 30);
    const terrainMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0x3e4547) },
            rimColor: { type: "c", value: new THREE.Color(0x3e4547) },
            rimPower: { type: "f", value: 1.0},
            scale: { type: "f", value: 30.0 },
            time: { type: "f", value: 0.0 },
            freq: { type: "f", value: 5.0 }
        },
        vertexShader: terrainVert,
        fragmentShader: terrainFrag,
        transparent: true,
        // wireframe: true,
        // side: THREE.BackSide,
        depthTest: false,
        // blending: THREE.MultiplyBlending
    });

    const testMat = new THREE.MeshBasicMaterial({ color: 0x3e4547, side: THREE.FrontSide });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -150;

    this.addTerrain = function(scene){
        scene.add(terrainMesh);
    }

    this.update = function(){
        let time = clock.getDelta();
        // let time = Date.now() / 1000 % 120000;
        // terrainMat.uniforms.freq.value = time * 100;
    }
}