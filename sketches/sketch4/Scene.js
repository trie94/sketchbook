import * as THREE from 'three';
import Test from './test';
const OrbitControls = require('three-orbit-controls')(THREE);

export default function Scene(canvas) {

    const clock = new THREE.Clock();
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    // scene subjects
    const light = createLights();
    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = createControl();
    const camHelper = new THREE.CameraHelper(camera);
    const test = new Test().getMesh();

    // audio
    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader();
    const bgmAudio = new THREE.Audio(listener);

    let sceneObjects = [];
    let camPos = camera.position;

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

        camera.position.set(0, 0, 300);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 15, 0);
        // controls.maxPolarAngle = Math.PI / 2;
        controls.maxDistance = 1000;

        return controls;
    }

    function createLights() {
        const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xfff5d6, 1);

        let lights = [];
        lights.push(ambientLight);
        lights.push(directionalLight);

        return lights;
    }

    this.start = function () {
        console.log("start from sketch4 scene manager");
        scene.add(test);
    }

    this.update = function () {
        camPos = camera.position;
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
        console.log("on mouse click, scene4");
    }
}