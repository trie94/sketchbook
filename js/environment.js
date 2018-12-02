import * as THREE from 'three';

export default function Environment() {

    const groundGeo = new THREE.CircleGeometry(1000, 50);
    const groundMat = new THREE.MeshBasicMaterial({
        color: 0x5386db,
        side: THREE.DoubleSide,
        // blending: THREE.MultiplyBlending,
        transparent: true,
        opacity: 0.5
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.set(Math.PI / 2, 0, 0);
    groundMesh.position.set(0,-7,0);
    this.getGround = function () {
        return groundMesh;
    }
}