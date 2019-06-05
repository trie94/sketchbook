import * as THREE from 'three';

export default function object() {
    const sphereGeo = new THREE.SphereGeometry(10, 30, 30);
    const normalMat = new THREE.MeshNormalMaterial();
    const phongMat = new THREE.MeshPhongMaterial({ color: 0xb3ff9e });
    const sphereMesh = new THREE.Mesh(sphereGeo, normalMat);

    const floorGeo = new THREE.PlaneBufferGeometry(50, 50);
    const floorMesh = new THREE.Mesh(floorGeo, normalMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -10;

    this.getSphere = function () {
        return sphereMesh;
    }

    this.getFloor = function () {
        return floorMesh;
    }
}