import * as THREE from 'three';

export default function Environment() {

    // const groundGeo = new THREE.CircleGeometry(1000, 50);
    // const groundMat = new THREE.MeshBasicMaterial({
    //     color: 0x5386db,
    //     side: THREE.DoubleSide,
    //     // blending: THREE.MultiplyBlending,
    //     transparent: true,
    //     opacity: 0.5
    // });
    // const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    // groundMesh.rotation.set(Math.PI / 2, 0, 0);
    // groundMesh.position.set(0,-7,0);
    // this.getGround = function () {
    //     return groundMesh;
    // }
    let radius = 150;
    const seaGeom = new THREE.CylinderGeometry(radius, radius, 15, 20, 10);
    // seaGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    const seaMat = new THREE.MeshBasicMaterial({
        color: 0x9ffafa,
        transparent: true,
        opacity: 0.7,
        flatShading: true,
        // wireframe: true
    });
    const sea = new THREE.Mesh(seaGeom, seaMat);
    sea.position.y = -10;

    this.getSea = function(){
        return sea;
    }
}