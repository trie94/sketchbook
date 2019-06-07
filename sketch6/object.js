import * as THREE from 'three';

export default function object() {
    const sphereGeo = new THREE.SphereGeometry(10, 30, 30);
    const normalMat = new THREE.MeshNormalMaterial();
    const phongMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0.0,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, normalMat);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;

    const floorGeo = new THREE.PlaneBufferGeometry(50, 50);
    const floorMesh = new THREE.Mesh(floorGeo, normalMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -10;
    floorMesh.castShadow = false;
    floorMesh.receiveShadow = true;

    this.getSphere = function () {
        return sphereMesh;
    }

    this.getFloor = function () {
        return floorMesh;
    }

    this.assignPhongMat = function() {
        sphereMesh.material = phongMat;
        floorMesh.material = phongMat;
    }

    this.assignNormalMat = function() {
        sphereMesh.material = normalMat;
        floorMesh.material = normalMat;
    }
}