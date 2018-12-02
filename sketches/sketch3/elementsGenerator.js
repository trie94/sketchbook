import * as THREE from 'three';

function cloud() {
    const cloudGeo = new THREE.BoxGeometry(20, 20, 20);
    const cloudMat = new THREE.MeshBasicMaterial({
        color: 0xfbf9f6,
        flatShading: true,
        transparent: true,
        opacity: 0.5
    });
    const cloudObj = new THREE.Object3D();

    let nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {
        const m = new THREE.Mesh(cloudGeo, cloudMat);
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);
        cloudObj.add(m);
    }

    return cloudObj;
}

export function sky() {
    const skyObj = new THREE.Object3D();
    let nClouds = 40;

    let stepAngle = Math.PI * 2 / nClouds;

    for (let i = 0; i < nClouds; i++) {
        let c = cloud();

        let a = stepAngle * i; // this is the final angle of the cloud
        let h = 300 + Math.random() * 400; // this is the distance between the center of the axis and the cloud itself

        // Trigonometry!!! simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
        c.position.y = (Math.random() * 1000) - 500;
        c.position.x = Math.cos(a) * h;
        // random depth
        c.position.z = (Math.random() * 300) - 150;;
        let s = 1 + Math.random() * 1.5;
        c.scale.set(s, s, s);
        skyObj.add(c);
    }

    skyObj.rotation.x = Math.PI / 2;
    return skyObj;
}

export function house() {
    const houseObj = new THREE.Object3D();
    const wallGeo = new THREE.BoxGeometry(120, 100, 70);
    const wallMat = new THREE.MeshBasicMaterial({
        color: 0xded6af,
        flatShading: true
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);

    const roofGeo = new THREE.BoxGeometry(130, 5, 90);
    const roofMat = new THREE.MeshBasicMaterial({
        color: 0xe58b61,
        flatShading: true
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.y = 50;

    const doorEdgeGeo = new THREE.BoxGeometry(5, 40, 5);
    const doorEdgeMat = new THREE.MeshBasicMaterial({
        color: 0x69624e,
        flatShading: true
    });
    const doorEdgeMesh1 = new THREE.Mesh(doorEdgeGeo, doorEdgeMat);
    doorEdgeMesh1.position.set(-30, 0, 35);

    const doorEdgeMesh2 = new THREE.Mesh(doorEdgeGeo, doorEdgeMat);
    doorEdgeMesh2.position.set(0, 0, 35);

    const doorEdgeGeo3 = new THREE.BoxGeometry(35, 5, 5);
    const doorEdgeMat3 = new THREE.MeshBasicMaterial({
        color: 0x69624e,
        flatShading: true
    });

    const doorEdgeMesh3 = new THREE.Mesh(doorEdgeGeo3, doorEdgeMat3);
    doorEdgeMesh3.position.set(-15, 20, 35);

    const doorGeo = new THREE.BoxGeometry(30, 40, 5);
    const doorMat = new THREE.MeshBasicMaterial({
        color: 0xa8704a,
        flatShading: true
    });
    
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.position.set(-15, 0, 33);

    houseObj.add(wallMesh);
    houseObj.add(roofMesh);
    houseObj.add(doorEdgeMesh1);
    houseObj.add(doorEdgeMesh2);
    houseObj.add(doorEdgeMesh3);
    houseObj.add(doorMesh);

    return houseObj;
}