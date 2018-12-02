import * as THREE from 'three';
import React from 'react';
import { Link } from 'react-router-dom';
const OrbitControls = require('three-orbit-controls')(THREE);
import * as pondGenerator from './pondGenerator';
import * as greenGenerator from './greenGenerator';
import * as elementsGenerator from './elementsGenerator';
import * as blockGenerator from './blockGenerator';
// import * as dat from 'dat.gui';
import munyuSound from '../../assets/sounds/munyu_basic.wav';
// import munyuSound from '../../assets/sounds/amazingu.wav';
import Creature from './creaturesGenerator';
import creatureGenerator from './creaturesGenerator';

export default class Sketch3 extends React.Component {
    constructor(props) {
        super(props)

        this.createScene = this.createScene.bind(this);
        this.createGrid = this.createGrid.bind(this);
        this.createLights = this.createLights.bind(this);
        this.Config = this.Config.bind(this);
        this.addElementsToScene = this.addElementsToScene.bind(this);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.update = this.update.bind(this);
        this.renderScene = this.renderScene.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.raycast = this.raycast.bind(this);
        this.moveBlock = this.moveBlock.bind(this);

        // add object that requires animation
        this.controls;

        // for island position
        this.pointVertex = [];

        // variables for the base
        this.radius = 300;
        this.base = greenGenerator.ground(this.radius, this.radius + 10);
        this.block = blockGenerator.concern();

        this.creature = new Creature();

        this.mainTree = greenGenerator.tree(50, 2, 60, 0, 3, 7, 50, 5);
        this.subTree1 = greenGenerator.tree(30, 2, 30, Math.PI / 2, 5, 7, 30, 7);
        this.subTree2 = greenGenerator.tree(40, 2, 55, Math.PI / 3, 4, 9, 40, 6);
        this.pond = pondGenerator.pondBaseObject;
        this.waves = pondGenerator.getWaves();
        this.sky = elementsGenerator.sky();
        this.house = elementsGenerator.house();

        // dev gui
        // this.dat = new dat.GUI();
        // this.config = new this.Config();
        // this.colorControl = this.dat.addColor(this.config, 'color');

        // mouse
        this.curPos = new THREE.Vector3();
        this.newPos = new THREE.Vector3();

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.isRaycasted = false;
        this.snapPos = new THREE.Vector3();

        this.direction;
        this.speed = 1;
        this.camSpeed = 0.001;

        // audio
        this.listener = new THREE.AudioListener();
        this.munyuSound = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();
    }

    componentDidMount() {
        this.createScene();
        this.start();
    }

    componentWillUnmount() {
        this.stop();
        this.container.removeChild(this.renderer.domElement);
    }

    Config() {
        // this.color = 0xffa359;
        this.color = 0xffc37f;
    }

    createScene() {
        this.WIDTH = window.innerWidth;
        this.HEIGHT = window.innerHeight;

        this.scene = new THREE.Scene();

        // this.scene.fog = new THREE.Fog(this.config.color, 100, 1200);
        this.camera = new THREE.PerspectiveCamera(
            60,
            this.WIDTH / this.HEIGHT,
            1,
            10000
        );

        // audio
        this.camera.add(this.listener);
        // this.audioLoader.load(munyuSound, (buffer) => {
        //     this.munyuSound.setBuffer(buffer);
        //     this.munyuSound.setLoop(false);
        //     this.munyuSound.setVolume(1);
        // });

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        this.renderer.setSize(this.WIDTH, this.HEIGHT);

        this.container = document.getElementById('world');
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 100, 400);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 15, 0);
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.maxDistance = 1000;

        // create stuff
        this.createGrid();
        this.createLights();
        this.addElementsToScene();
    }

    createGrid() {
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
            // transparent: true,
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
        this.scene.add(gridObject);

        // point vertices
        for (let i = -config.width; i <= config.width; i += stepw) {
            for (let j = -config.height; j <= config.height; j += steph) {
                pointGeo.vertices.push(new THREE.Vector3(i, j, 0));
            }
        }

        let prevIndex = null;
        for (let i = 0; i < this.islandNum; i++) {

            let index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);

            // prevent overlap
            while (index === prevIndex) {
                index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);
            }

            this.pointVertex[i] = pointGeo.vertices[index];
            prevIndex = index;
        }
    }

    createLights() {
        let ambientLight = new THREE.AmbientLight(0x333333, 0.5);
        this.scene.add(ambientLight);

        let lights = [];
        lights[0] = new THREE.DirectionalLight(0xfff5d6, 1);
        lights[0].position.set(0, 1, 0);
        this.scene.add(lights[0]);
    }

    addElementsToScene() {
        this.scene.add(this.base);
        this.scene.add(this.mainTree);
        this.scene.add(this.subTree1);
        this.scene.add(this.subTree2);
        this.scene.add(this.pond);
        this.scene.add(this.waves);
        this.scene.add(this.creature);
        this.scene.add(this.sky);
        this.scene.add(this.house);
        // this.scene.add(this.block);
        // this.scene.add(this.helper);

        this.mainTree.position.set(70, 30, 0);
        this.subTree1.position.set(30, 20, -70);
        this.subTree2.position.set(-200, 20, -50);
        this.creature.position.set(100, 20, 100);
        // this.block.position.set(0, 30, 0);

        this.sky.position.set(0, 350, 0);
        this.house.position.set(-100, 30, -80);
        this.house.rotation.y = Math.PI / 8;
    }

    onWindowResize() {
        this.HEIGHT = window.innerHeight;
        this.WIDTH = window.innerWidth;
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        this.camera.updateProjectionMatrix();
    }

    onMouseClick(event) {
        event.preventDefault();
        // get position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycast();

        if (this.munyuSound.isPlaying) this.munyuSound.stop();
        this.munyuSound.play();
    }

    raycast() {
        if (!this.isRaycasted) this.isRaycasted = true;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        // just capture the ground
        let intersects = this.raycaster.intersectObject(this.base, true);
        if (intersects.length > 0) {
            // get position of the block
            this.newPos = intersects[0].point;
        }
        this.direction = this.newPos.distanceTo(this.block.position);
        this.speed = (1 / this.direction) * 0.5;
        this.camera.updateMatrixWorld();
    }

    moveBlock() {
        if (this.isRaycasted){
            if (Math.floor(this.block.position.distanceTo(this.newPos)) == 30){
                this.snapPos.copy(this.block.position);
            }
            if (Math.floor(this.block.position.distanceTo(this.newPos)) < 30){
                this.newPos.x = this.snapPos.x;
                this.newPos.z = this.snapPos.z;
            } else {
                this.block.position.lerp(this.newPos, this.speed);
            }
        }
        this.block.position.y = 30;

        let cameraPos = new THREE.Vector3(this.newPos.x, this.newPos.y + 500, this.newPos.z + 1000);
        // this.camera.position.lerp(cameraPos, this.camSpeed);
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.update);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    // every frame
    update() {
        const time = Date.now() * 0.004;
        const angle = Math.sin(time) / 8;

        // this.controls.update();
        // this.colorControl.onChange((color) => {
        //     this.config.color = color;
        //     this.scene.fog.color.set(color);
        // });

        // this.creature.creatureState(angle, this.block.position, this.newPos, 40, 30);
        pondGenerator.moveWaves();
        this.moveBlock();
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.update);
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        window.addEventListener('resize', this.onWindowResize, false);
        window.addEventListener('click', this.onMouseClick, false);

        return (
            <div id="world">
                <p><Link to="/">back to the landing page</Link></p>
            </div>
        )
    }
}