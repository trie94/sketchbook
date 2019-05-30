import * as THREE from 'three';
import terrainVert from './shaders/terrain.vert';
import terrainFrag from './shaders/terrain.frag';

export default function terrain() {
    const clock = new THREE.Clock();
    // const terrainGeo = new THREE.SphereGeometry(40, 50, 50);
    const terrainGeo = new THREE.PlaneGeometry(1000, 1000, 90, 90);
    const terrainMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0x254984) },
            fog: { type: "c", value: new THREE.Color(0x66c1ff) },
            scale: { type: "f", value: 200.0 },
            time: { type: "f", value: 0.0 },
            freq: { type: "f", value: 80.0 }
        },
        vertexShader: terrainVert,
        fragmentShader: terrainFrag
    });

    const testMat = new THREE.MeshBasicMaterial({ color: 0x254984, side: THREE.FrontSide });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);

    terrainMesh.rotation.x = -Math.PI / 2;
    // terrainMesh.rotation.z = Math.PI / 2;
    terrainMesh.position.y = -380;
    // terrainMesh.position.x = -130;

    this.addTerrain = function (scene) {
        scene.add(terrainMesh);
    }

    this.update = function () {
        // let time = clock.getDelta();
        // let time = Date.now() / 1000 % 120000;
        // console.log(terrainMat.uniforms.time.value);
        // terrainMesh.rotation.x -= 0.001;
    }
}