import * as THREE from 'three';

export let pondBaseObject = pondBase();
let waves = new THREE.Object3D();
let wavesMesh;
let wavesVertex = [];
export let stones = createStones(10);

function pondBase(){

    const geo = new THREE.CylinderGeometry(65, 90, 10, 20);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x93bcff,
        transparent: true,
        opacity: 0.5
    });

    const baseMesh = new THREE.Mesh(geo, mat);
    const baseObj = new THREE.Object3D();

    baseObj.add(baseMesh);
    baseObj.position.y = 7;

    // gizmo
    const gizmoGeo = new THREE.EdgesGeometry(geo);
    const gizmoMat = new THREE.LineBasicMaterial({ color: "black" });
    const wireframe = new THREE.LineSegments(gizmoGeo, gizmoMat);
    console.log("draw edges");

    return baseObj;
}

function pondWaves() {
    console.log("pond wave");

    const waveGeo = new THREE.RingGeometry(0, 65, 20, 20, 10);
    const waveMat = new THREE.MeshBasicMaterial({
        color: 0xdbf7ff,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
        // wireframe: true
    });

    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    const waveObj = new THREE.Object3D();
    waveObj.position.y = 9;
    waveObj.rotation.x = Math.PI / 2;
    waveObj.add(waveMesh);

    let vertex = [];
    let length = waveMesh.geometry.vertices.length;

    for (let i=0; i < length; i++){
        
        let v = waveMesh.geometry.vertices[i];
        vertex.push({
            x: v.x,
            y: v.y,
            z: v.z,
            ang: Math.random() * Math.PI * 2,
            amp: 2 + Math.random() * 2,
            speed: 0.004 + Math.random() * 0.002
        });
    }

    wavesMesh = waveMesh;
    waves = waveObj;
    wavesVertex = vertex.concat();
}

export function getWaves(){
    pondWaves();
    return waves;
}

export function moveWaves(){

    let verts = wavesMesh.geometry.vertices;
    let length = verts.length;

    for (let i=0; i < length; i++){
        let v = verts[i];
        let vprops = wavesVertex[i];
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
        vprops.ang += vprops.speed;
    }

    wavesMesh.geometry.verticesNeedUpdate = true;
    // wavesMesh.rotation.z += 0.002;
}

function Stone1(){

    let rad = (Math.floor(Math.random() * 5) +3);
    let color = 0x38342a;

    const geo = new THREE.DodecahedronGeometry(rad, 0);
    const mat = new THREE.MeshBasicMaterial({
        color: color,
        flatShading: true
    });

    const stone1 = new THREE.Mesh(geo, mat);
    return stone1;
}

function Stone2(){

    let rad = (Math.floor(Math.random() * 5) +3);
    let color = 0x646658;

    const geo = new THREE.TetrahedronGeometry(rad, 1);
    const mat = new THREE.MeshBasicMaterial({
        color: color,
        flatShading: true
    });

    const stone2 = new THREE.Mesh(geo, mat);
    return stone2;
}

function createStones(number){
    let stonesArray = [];

    for (let i=0; i<number; i+=2){
        stonesArray[i] = Stone1();
        stonesArray[i+1] = Stone2();
    }

    return stonesArray;
}

export function drawEdges(geometry){


    return wireframe;
}