import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import Iceberg from './iceberg';

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

    // audio
    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader();
    const bgmAudio = new THREE.Audio(listener);

    let sceneObjects = [];
    let camPos = camera.position;

    // grid
    const iceberg = new Iceberg();

    function createScene() {
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xf7d9aa, 100, 1000);
        return scene;
    }

    function createRenderer() {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        // renderer.shadowMap.type = THREE.BasicShadowMap;

        return renderer;
    }

    function createCamera() {
        const aspectRatio = WIDTH / HEIGHT;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(0, 150, 450);
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
        let lights = [];
        lights.push(new THREE.AmbientLight(0x999999, 0.5));
        lights.push(new THREE.DirectionalLight(0xffffff, 1));
        lights.push(new THREE.DirectionalLight(0x46f5fd, 1));
        lights.push(new THREE.DirectionalLight(0x8200C9, 1));
        lights[1].position.set(10, 0, 0);
        lights[2].position.set(0.75, 1, 0.5);
        lights[3].position.set(-0.75, -1, 0.5);

        return lights;
    }

    this.start = function () {
        // scene.add(iceberg.getGrid());
        for(let i=0; i<light.length; i++)
        {
            scene.add(light[i]);
        }
        scene.add(iceberg.createIceberg(30));
        scene.add(iceberg.createWaves());
        scene.add(iceberg.createSea());
    }

    this.update = function () {
        camPos = camera.position;
        renderer.render(scene, camera);
        iceberg.moveWaves();
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
        console.log("on mouse click");
    }
}