import * as THREE from 'three';

export function ground() {
    console.log("create base");

    const groundGeo = new THREE.CylinderGeometry(160, 160, 20, 15);
    const groundMat = new THREE.MeshBasicMaterial({
        color: 0x4f5b20,
        // transparent: true,
        // opacity: 0.9
    });
    const ground = new THREE.Object3D();
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);

    ground.add(groundMesh);
    return ground;
}

export function tree(){
    console.log("create tree");
    const rad = 30;
    const leavesGeo = new THREE.TetrahedronGeometry(rad, 2);
    const leavesMat = new THREE.MeshPhongMaterial({
        color: 0x2c8e3c,
        flatShading: true
    });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.y = rad;

    const stemGeo = new THREE.CylinderGeometry(3, 7, 50, 5);
    const stemMat = new THREE.MeshBasicMaterial({
        color: 0x4c3c27,
        flatShading: true
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);

    const tree = new THREE.Object3D;
    tree.add(leaves);
    tree.add(stem);

    tree.position.y = 30;

    console.log(tree);
    return tree;
}