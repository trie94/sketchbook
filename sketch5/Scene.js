import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import Skybox from './background';
import Terrain from './terrain';
import Path from './path';
import Cat from './cat';
import ParticleGenerator from './particleGenerator';
import GodRays from './godRays';

export default function Scene(canvas) {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    let debug = false;
    // scene subjects
    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = debug ? createControl() : null;
    // const controls = createControl();
    const cat = new Cat();
    const skybox = Skybox();
    const terrain = new Terrain();
    const path = new Path();
    const particleGenerator = new ParticleGenerator();
    let tick = 0;
    let rays = [];

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
        scene.add(terrain.addTerrain());
        cat.loadCat(scene);
        scene.add(particleGenerator.particleSystem);
        particleGenerator.particleSystem.position.set(0, -10, 0);

        if (debug) {
            scene.add(path.debug());
        }

        rays.push(new GodRays(100, 300, new THREE.Vector3(0, 100, -150), 0.35, 0.5));
        rays.push(new GodRays(120, 300, new THREE.Vector3(75, 100, 10), 0.4, 0.3));
        rays.push(new GodRays(70, 300, new THREE.Vector3(-50, 100, 30), 0.2, 0.75));
        rays.push(new GodRays(120, 700, new THREE.Vector3(400, 300, 400), 0.2, 0.45));

        for (let i = 0; i < rays.length; i++) {
            scene.add(rays[i].getLight());
        }
        renderer.autoClear = true;
    }

    this.update = function () {
        terrain.update();
        particleGenerator.update();

        cat.update(path.getSpline());
        let catPos = cat.getCatPos();

        if (!debug) {
            if (catPos != null) {
                camera.lookAt(catPos);
                camera.position.x = catPos.x + Math.sin(tick) * 50;
                camera.position.y = catPos.y;
                camera.position.z = catPos.z + Math.cos(tick) * 30;
                tick += 0.001;
            }
        }

        for (let i = 0; i < rays.length; i++) {
            rays[i].update(camera);
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
        // debug = !debug;
    }
}