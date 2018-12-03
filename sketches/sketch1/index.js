import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import * as Elements from './elements';
import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch1() {

    // // add object that requires animation
    // let circle;
    // let controls;
    // let waves;
    // // for wave movement
    // let wavesVertex = [];
    // // for island position
    // let pointVertex = [];

    // // variables for the base
    // let radius = 160;

    // // number of islands
    // let islandNum = 30;

    // function createScene() {
        
    //     const WIDTH = window.innerWidth;
    //     const HEIGHT = window.innerHeight;

    //     const scene = new THREE.Scene();
    //     scene.fog = new THREE.Fog(0xf7d9aa, 100, 1000);
    //     const camera = new THREE.PerspectiveCamera(
    //         60,
    //         this.WIDTH / this.HEIGHT,
    //         1,
    //         10000
    //     );
    //     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    //     renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    //     renderer.setSize(this.WIDTH, this.HEIGHT);
    //     renderer.shadowMap.enabled = true;

    //     camera.position.set(0, 150, 450);
    //     camera.lookAt(new THREE.Vector3(0, 0, 0));

    //     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //     this.controls.target = new THREE.Vector3(0, 15, 0);
    //     this.controls.maxPolarAngle = Math.PI / 2;

    //     // create stuff
    //     createGrid();
    //     this.createSea();
    //     this.createIceberg(this.islandNum);
    //     this.createLights();
    //     this.createWaves();
    //     Elements.createClouds();
    // }

    // function createGrid() {
    //     // grid for generating random islands
    //     const config = {
    //         height: 100,
    //         width: 100,
    //         heightSeg: 100,
    //         widthSeg: 100,
    //         color: "black"
    //     };

    //     // set 0 opacity for production
    //     const material = new THREE.LineBasicMaterial({
    //         color: config.color,
    //         transparent: true,
    //         opacity: 0
    //     });

    //     // line
    //     const gridObject = new THREE.Object3D();
    //     const gridGeo = new THREE.Geometry();

    //     // each vertice point
    //     const pointGeo = new THREE.Geometry();

    //     const stepw = 2 * config.width / config.widthSeg;
    //     const steph = 2 * config.height / config.heightSeg;

    //     // line - width
    //     for (let i = -config.width; i <= config.width; i += stepw) {
    //         gridGeo.vertices.push(new THREE.Vector3(-config.height, i, 0));
    //         gridGeo.vertices.push(new THREE.Vector3(config.height, i, 0));
    //     }

    //     // line - height
    //     for (let i = -config.height; i <= config.height; i += steph) {
    //         gridGeo.vertices.push(new THREE.Vector3(i, -config.width, 0));
    //         gridGeo.vertices.push(new THREE.Vector3(i, config.width, 0));
    //     }

    //     // draw grid line
    //     const line = new THREE.LineSegments(gridGeo, material);
    //     gridObject.add(line);
    //     gridObject.rotation.x = Math.PI / 2;
    //     this.scene.add(gridObject);

    //     // point vertices
    //     for (let i = -config.width; i <= config.width; i += stepw) {
    //         for (let j = -config.height; j <= config.height; j += steph) {
    //             pointGeo.vertices.push(new THREE.Vector3(i, j, 0));
    //         }
    //     }

    //     let prevIndex = null;
    //     for (let i = 0; i < this.islandNum; i++) {

    //         let index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);

    //         // prevent overlap
    //         while (index === prevIndex) {
    //             index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);
    //         }

    //         this.pointVertex[i] = pointGeo.vertices[index];
    //         prevIndex = index;
    //     }
    // }

    // function createSea() {
    //     const seaGeom = new THREE.CylinderGeometry(this.radius, this.radius, 15, 20, 10);
    //     // seaGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    //     const seaMat = new THREE.MeshBasicMaterial({
    //         color: 0x9ffafa,
    //         transparent: true,
    //         opacity: 0.7,
    //         flatShading: true,
    //         // wireframe: true
    //     });
    //     const dombGeo = new THREE.TetrahedronGeometry(170, 3);
    //     const dombMat = new THREE.MeshBasicMaterial({
    //         color: 0xffffff,
    //         transparent: true,
    //         opacity: 0.5,
    //         // flatShading: true,
    //         // wireframe: true
    //     });
    //     const sea = new THREE.Mesh(seaGeom, seaMat);
    //     const domb = new THREE.Mesh(dombGeo, dombMat);
    //     sea.position.y = -5;
    //     sea.receiveShadow = true;
    //     this.scene.add(sea);
    //     // this.scene.add(domb);
    // }

    // // island object
    // function Island(radTop, radBottom, height, radSeg, heightSeg, color, opacity) {
    //     const islandGeo = new THREE.CylinderGeometry(radTop, radBottom, height, radSeg, heightSeg);
    //     const islandMat = new THREE.MeshPhongMaterial({
    //         color: color,
    //         transparent: false,
    //         opacity: opacity,
    //         flatShading: true
    //     });
    //     this.mesh = new THREE.Mesh(islandGeo, islandMat);
    // }

    // function createIslands(number) {
    //     const islandColors = [0xf7faff, 0xc1ecff, 0xc1c3ff, 0x9397ff, 0x93f5ff];
    //     const islands = [];

    //     for (let i = 0, num = 0; i < number; i++) {
    //         const radTops = (Math.floor(Math.random() * 10) + 3);
    //         const radBottoms = radTops + (Math.floor(Math.random() * 10) + 1);
    //         const heights = radTops + (Math.floor(Math.random() * 15) - 3);

    //         const radSegs = (Math.floor(Math.random() * 10) + 7);
    //         const heightSegs = (Math.floor(Math.random() * 15) + 10);
    //         const opacities = (Math.floor(Math.random() * 10) + 7) * 0.1;

    //         // assign color
    //         if (num < islandColors.length - 1) {
    //             num++;
    //         } else {
    //             num = 0;
    //         }

    //         islands[i] = new this.Island(radTops, radBottoms, heights, radSegs, heightSegs, islandColors[num], opacities);
    //         islands[i].mesh.receiveShadow = true;
    //         this.scene.add(islands[i].mesh);
    //         islands[i].mesh.position.x = this.pointVertex[i].x;
    //         islands[i].mesh.position.y = this.pointVertex[i].z;
    //         islands[i].mesh.position.z = this.pointVertex[i].y;
    //     }
    // }

    // // same as island
    // function createIceberg(number) {
    //     const icebergColors = [0xf7faff, 0xc1ecff, 0xc1c3ff, 0x9397ff, 0x93f5ff];
    //     const iceberg = new THREE.Object3D();

    //     for (let i = 0, num = 0; i < number; i++) {

    //         const rad = (Math.floor(Math.random() * 15) + 3);
    //         const detail = (Math.floor(Math.random() * 1.2) + 1);
    //         const iceGeo = new THREE.TetrahedronGeometry(rad, detail);
    //         const iceMat = new THREE.MeshPhongMaterial({
    //             color: icebergColors[num],
    //             flatShading: true,
    //             // transparent: true,
    //             // opacity: 0.7
    //         });

    //         if (num < icebergColors.length - 1) {
    //             num++;

    //         } else {
    //             num = 0;
    //         }

    //         const icebergMesh = new THREE.Mesh(iceGeo, iceMat);
    //         icebergMesh.position.x = this.pointVertex[i].x;
    //         icebergMesh.position.y = this.pointVertex[i].z;
    //         icebergMesh.position.z = this.pointVertex[i].y;
    //         icebergMesh.rotation.x = (Math.floor(Math.random() * Math.PI));
    //         icebergMesh.rotation.y = (Math.floor(Math.random() * Math.PI));
    //         icebergMesh.rotation.z = (Math.floor(Math.random() * Math.PI));
    //         iceberg.add(icebergMesh);
    //     }

    //     this.scene.add(iceberg);
    // }

    // function createWaves() {
    //     const waveGeo = new THREE.RingGeometry(0, this.radius, 20, 20, 20);
    //     const waveMat = new THREE.MeshBasicMaterial({
    //         color: 0x9ffafa,
    //         transparent: true,
    //         opacity: 0.7,
    //         // flatShading: true,
    //         side: THREE.DoubleSide,
    //         depthWrite: false,
    //         // wireframe: true
    //     });
    //     const waves = new THREE.Mesh(waveGeo, waveMat);
    //     waves.rotation.x = Math.PI / 2;

    //     let wavesVertex = [];
    //     let vertexLength = waveGeo.vertices.length;
    //     for (let i = 0; i < vertexLength; i++) {
    //         let v = waveGeo.vertices[i];
    //         wavesVertex.push({
    //             y: v.y,
    //             x: v.x,
    //             z: v.z,
    //             // a random angle
    //             ang: Math.random() * Math.PI * 2,
    //             // a random distance
    //             amp: 3 + Math.random() * 3,
    //             // a random speed between 0.016 and 0.048 radians / frame
    //             speed: 0.008 + Math.random() * 0.008
    //         });
    //     }
    //     this.wavesVertex = wavesVertex;
    //     this.waves = waves;
    //     this.scene.add(waves);
    // }

    // function moveWaves() {
    //     // get the vertices
    //     let verts = this.waves.geometry.vertices;
    //     let l = verts.length;

    //     for (let i = 0; i < l; i++) {
    //         let v = verts[i];

    //         // get the data associated to it
    //         let vprops = this.wavesVertex[i];

    //         // update the position of the vertex
    //         v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
    //         v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;

    //         // increment the angle for the next frame
    //         vprops.ang += vprops.speed;

    //     }
    //     this.waves.geometry.verticesNeedUpdate = true;
    //     this.waves.rotation.z += .005;
    // }

    // function createLights() {
    //     let ambientLight = new THREE.AmbientLight(0x999999);
    //     this.scene.add(ambientLight);

    //     let lights = [];
    //     lights[0] = new THREE.DirectionalLight(0xffffff, 1);
    //     lights[0].position.set(1, 0, 0);
    //     lights[1] = new THREE.DirectionalLight(0x46f5fd, 1);
    //     lights[1].position.set(0.75, 1, 0.5);
    //     lights[2] = new THREE.DirectionalLight(0x8200C9, 1);
    //     lights[2].position.set(-0.75, -1, 0.5);
    //     this.scene.add(lights[0]);
    //     this.scene.add(lights[1]);
    //     this.scene.add(lights[2]);
    // }

    // function update() {
    //     this.controls.update();
    //     this.moveWaves();
    //     this.renderScene();
    //     this.frameId = window.requestAnimationFrame(this.animate);
    // }
}