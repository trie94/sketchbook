import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import Skybox from './background';
import Environment from './environment';
import MunyuGenerator from './munyuGenerator';

export default function Scene(canvas) {
    const clock = new THREE.Clock();
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    // scene subjects
    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = createControl();
    const skybox = Skybox();
    const environment = new Environment();

    // munyus
    const munyuGenerator = new MunyuGenerator();
    const munyus = munyuGenerator.instantiate();

    function createScene() {
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0xf7d9aa, 80, 500);
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

        camera.position.set(0, 60, 120);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 15, 0);
        controls.maxPolarAngle = Math.PI / 2;
        controls.maxDistance = 150;
        controls.minDistance = 50;

        return controls;
    }

    this.start = function () {
        scene.add(skybox);
        scene.add(environment.getSea());
        for (let i = 0; i < munyus.length; i++) {
            scene.add(munyus[i]);
        }
    }

    this.update = function () {
        renderer.render(scene, camera);
        munyuGenerator.idle();
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
}