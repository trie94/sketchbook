import * as THREE from 'three';

export function concern() {
    const concernObj = new THREE.Object3D();
    const concernGeo = new THREE.IcosahedronGeometry(10, 0);
    const concernMat = new THREE.MeshBasicMaterial({
        color: 0x6d7391,
        flatShading: true
    });

    const concernMesh = new THREE.Mesh(concernGeo, concernMat);
    concernObj.add(concernMesh);

    return concernObj;
}