import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import Cat from './cat';
import Skybox from './background';
import Terrain from './terrain';
import Path from './path';

export default function Scene(canvas) {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    let debug = false;
    // scene subjects
    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = debug ? createControl() : null;
    const cat = new Cat();
    const skybox = Skybox();
    const terrain = new Terrain();
    const path = new Path();
    let tick = 0;

    function createScene() {
        const scene = new THREE.Scene();
        // scene.fog = new THREE.Fog(0xf7d9aa, 1, 100);
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
        renderer.sortObjects = false;

        return renderer;
    }

    function createCamera() {
        const aspectRatio = WIDTH / HEIGHT;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(20, 50, 20);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 0, 0);
        // controls.maxPolarAngle = Math.PI / 2;
        // controls.maxDistance = 70;
        controls.minDistance = 20;

        return controls;
    }

    this.start = function () {
        // console.log("start");
        scene.add(skybox);
        terrain.addTerrain(scene);
        cat.loadCat(scene);
        if (debug) {
            scene.add(path.debug());
        }
    }

    this.update = function () {
        cat.update(path.getSpline());
        let catPos = cat.getCatPos();
        terrain.update();

        if (!debug) {
            if (catPos != null) {
                camera.lookAt(catPos);
                camera.position.x = catPos.x + Math.sin(tick) * 50;
                camera.position.y = catPos.y;
                camera.position.z = catPos.z + Math.cos(tick) * 30;
                tick += 0.001;
            }
        }
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
        // console.log("click");
    }
}