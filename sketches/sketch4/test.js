import * as THREE from 'three';

export default function Test(){

    const testMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x3c6fc1)
    });
    const testGeo = new THREE.SphereGeometry(100, 10, 10);
    const testMesh = new THREE.Mesh(testGeo, testMat);

    this.getMesh = function(){
        return testMesh;
    }
}