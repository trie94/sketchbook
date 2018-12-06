import * as THREE from 'three';

export default function Iceberg() {
    // for island position
    let pointVertex = [];
    // number of islands
    let islandNum = 30;
    let radius = 160;

    // grid for generating random islands
    const config = {
        height: 100,
        width: 100,
        heightSeg: 100,
        widthSeg: 100,
        color: "black"
    };

    // set 0 opacity for production
    const material = new THREE.LineBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0
    });

    // line
    const gridObject = new THREE.Object3D();
    const gridGeo = new THREE.Geometry();

    // each vertice point
    const pointGeo = new THREE.Geometry();

    const stepw = 2 * config.width / config.widthSeg;
    const steph = 2 * config.height / config.heightSeg;

    // line - width
    for (let i = -config.width; i <= config.width; i += stepw) {
        gridGeo.vertices.push(new THREE.Vector3(-config.height, i, 0));
        gridGeo.vertices.push(new THREE.Vector3(config.height, i, 0));
    }

    // line - height
    for (let i = -config.height; i <= config.height; i += steph) {
        gridGeo.vertices.push(new THREE.Vector3(i, -config.width, 0));
        gridGeo.vertices.push(new THREE.Vector3(i, config.width, 0));
    }

    // draw grid line
    const line = new THREE.LineSegments(gridGeo, material);
    gridObject.add(line);
    gridObject.rotation.x = Math.PI / 2;

    // point vertices
    for (let i = -config.width; i <= config.width; i += stepw) {
        for (let j = -config.height; j <= config.height; j += steph) {
            pointGeo.vertices.push(new THREE.Vector3(i, j, 0));
        }
    }

    let prevIndex = null;
    for (let i = 0; i < islandNum; i++) {

        let index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);

        // prevent overlap
        while (index === prevIndex) {
            index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);
        }

        pointVertex[i] = pointGeo.vertices[index];
        prevIndex = index;
    }

    this.getGrid = function () {
        return gridObject;
    }

    const waveGeo = new THREE.RingGeometry(0, radius, 20, 20, 20);
    const waveMat = new THREE.MeshBasicMaterial({
        color: 0x9ffafa,
        transparent: true,
        opacity: 0.7,
        // flatShading: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        // wireframe: true
    });
    const waves = new THREE.Mesh(waveGeo, waveMat);
    waves.rotation.x = Math.PI / 2;

    let wavesVertex = [];
    let vertexLength = waveGeo.vertices.length;
    for (let i = 0; i < vertexLength; i++) {
        let v = waveGeo.vertices[i];
        wavesVertex.push({
            y: v.y,
            x: v.x,
            z: v.z,
            // a random angle
            ang: Math.random() * Math.PI * 2,
            // a random distance
            amp: 3 + Math.random() * 3,
            // a random speed between 0.016 and 0.048 radians / frame
            speed: 0.008 + Math.random() * 0.008
        });
    }

    this.createIceberg = function (number) {
        const icebergColors = [0xf7faff, 0xc1ecff, 0xc1c3ff, 0x9397ff, 0x93f5ff];
        const iceberg = new THREE.Object3D();

        for (let i = 0, num = 0; i < number; i++) {

            const rad = (Math.floor(Math.random() * 15) + 3);
            const detail = (Math.floor(Math.random() * 1.2) + 1);
            const iceGeo = new THREE.TetrahedronGeometry(rad, detail);
            const iceMat = new THREE.MeshPhongMaterial({
                color: icebergColors[num],
                flatShading: true,
                // transparent: true,
                // opacity: 0.7,
            });

            if (num < icebergColors.length - 1) {
                num++;

            } else {
                num = 0;
            }

            const icebergMesh = new THREE.Mesh(iceGeo, iceMat);
            icebergMesh.position.x = pointVertex[i].x;
            icebergMesh.position.y = pointVertex[i].z;
            icebergMesh.position.z = pointVertex[i].y;
            icebergMesh.rotation.x = (Math.floor(Math.random() * Math.PI));
            icebergMesh.rotation.y = (Math.floor(Math.random() * Math.PI));
            icebergMesh.rotation.z = (Math.floor(Math.random() * Math.PI));
            iceberg.add(icebergMesh);
        }
        return iceberg;
    }

    this.createWaves = function () {
        return waves;
    }

    this.moveWaves = function () {

        let verts = waves.geometry.vertices;
        let l = verts.length;

        for (let i = 0; i < l; i++) {
            let v = verts[i];

            // get the data associated to it
            let vprops = wavesVertex[i];

            // update the position of the vertex
            v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
            v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;

            // increment the angle for the next frame
            vprops.ang += vprops.speed;

        }
        waves.geometry.verticesNeedUpdate = true;
        waves.rotation.z += .005;
    }

    const seaGeom = new THREE.CylinderGeometry(radius, radius, 15, 20, 10);
    // seaGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    const seaMat = new THREE.MeshBasicMaterial({
        color: 0x9ffafa,
        transparent: true,
        opacity: 0.7,
        flatShading: true,
        // wireframe: true
    });
    const dombGeo = new THREE.TetrahedronGeometry(170, 3);
    const dombMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        // flatShading: true,
        // wireframe: true
    });
    const sea = new THREE.Mesh(seaGeom, seaMat);
    const domb = new THREE.Mesh(dombGeo, dombMat);
    sea.position.y = -5;
    sea.receiveShadow = true;

    this.createSea = function () {
        return sea;
    }
}