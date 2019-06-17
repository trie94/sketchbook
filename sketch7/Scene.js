import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import Skybox from './background';
import Fish from './Fish';
import Pot from './Pot';
import Bean from './Bean';

export default function Scene(canvas) {
    const clock = new THREE.Clock();
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    // scene subjects
    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    const light = createLights();
    const controls = createControl();
    const skybox = Skybox();
    const fish = new Fish();
    const pot = new Pot();
    const beans = [];

    function createScene() {
        const scene = new THREE.Scene();
        return scene;
    }

    function createRenderer() {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;

        return renderer;
    }

    function createCamera() {
        const aspectRatio = WIDTH / HEIGHT;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(0, 0, 10);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }

    function createLights() {
        let lights = [];
        lights.push(new THREE.AmbientLight(0x999999, 0.5));
        let directionalLight = new THREE.DirectionalLight(0xb2f9ff, 0.5);
        directionalLight.position.set(60, 50, 0);
        directionalLight.castShadow = true;
        // let helper = new THREE.CameraHelper(directionalLight.shadow.camera);
        // scene.add(helper);

        lights.push(directionalLight);

        return lights;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 0, 0);
        // controls.maxPolarAngle = Math.PI / 2;
        // controls.maxDistance = 1000;

        return controls;
    }

    this.start = function () {
        for (let i = 0; i < light.length; i++) {
            scene.add(light[i]);
        }
        // for (let i=0; i<10; i++) {
        //     let b = new Bean();
        //     // beans.push(b);
        //     scene.add(b);
        //     b.position.set(getRandom(-5, 5), -3.3, getRandom(-5, 5));
        // }

        scene.add(skybox);
        // scene.add(fish);
        scene.add(pot);
    }

    this.update = function () {
        renderer.render(scene, camera);
    }

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        canvas.innerWidth = WIDTH;
        canvas.innerHeight = HEIGHT;

        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(WIDTH, HEIGHT);
    }

    this.onMouseClick = function () {
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
}