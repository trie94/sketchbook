import * as THREE from 'three';
import { BloomEffect, RenderPass, EffectPass, EffectComposer } from "postprocessing";
const OrbitControls = require('three-orbit-controls')(THREE);
import Skybox from './background';
import Terrain from './terrain';
import Path from './path';
import Cat from './cat';
import ParticleGenerator from './particleGenerator';
import GodRays from './godRays';
import test from './assets/caustics.jpg';

export default function Scene(canvas) {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    let debug = true;

    const cat = new Cat();
    const skybox = Skybox();
    const terrain = new Terrain();
    const path = new Path();
    const particleGenerator = new ParticleGenerator();

    // scene subjects
    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = debug ? createControl() : null;

    // post processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomEffect = new BloomEffect({ strength: 0.5 });
    const effectPass = new EffectPass(camera, bloomEffect);
    effectPass.renderToScreen = true;

    const renderTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
    const testGeometry = new THREE.BoxGeometry(100, 100, 100);
    const testMaterial = new THREE.MeshPhongMaterial({
        // map: renderTarget.texture,
    });
    const cube = new THREE.Mesh(testGeometry, testMaterial);
    cube.position.y = 100;
    scene.add(cube);

    composer.addPass(renderPass);
    composer.addPass(effectPass);

    const clock = new THREE.Clock();

    let tick = 0;
    let rays = [];
    rays.push(new GodRays(100, 300, new THREE.Vector3(0, 100, -150), 0.35, 0.5));
    rays.push(new GodRays(120, 300, new THREE.Vector3(75, 100, 10), 0.4, 0.3));
    rays.push(new GodRays(70, 300, new THREE.Vector3(-50, 100, 30), 0.2, 0.75));
    rays.push(new GodRays(120, 700, new THREE.Vector3(400, 300, 400), 0.2, 0.45));

    function createScene() {
        const scene = new THREE.Scene();
        // scene.fog = new THREE.Fog(0xf7d9aa, 1, 100);
        return scene;
    }

    function createCamera() {
        const aspectRatio = WIDTH / HEIGHT;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.lookAt(path.getSpline());
        camera.layers.enable(1);
        // camera.layers.set(0);

        return camera;
    }

    function createRenderer() {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.autoClear = false;

        return renderer;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 0, 0);
        // controls.maxPolarAngle = Math.PI / 2;
        // controls.maxDistance = 70;
        controls.minDistance = 20;

        return controls;
    }

    function lookAtCat() {
        if (cat != null) {
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
        }
    }

    function render() {
        // renderer.autoClear = false;
        // renderer.clear();

        camera.layers.set(1);
        renderer.render(scene, camera);
        // composer.render();

        // renderer.clearDepth();
        // camera.layers.set(0);
        renderer.render(scene, camera);
    }

    this.start = function () {
        // console.log("start");
        cat.loadCat(scene);
        scene.add(skybox);
        skybox.layers.set(1);
        let terrainObj = terrain.addTerrain();
        terrainObj.layers.set(1);
        scene.add(terrainObj);

        let particles = particleGenerator.particleSystem;
        particles.layers.set(1);
        scene.add(particles);
        particles.position.set(0, -10, 0);

        if (debug) {
            scene.add(path.debug());
        }

        for (let i = 0; i < rays.length; i++) {
            scene.add(rays[i].getLight());
        }
    }

    this.update = function () {
        lookAtCat();
        terrain.update();
        particleGenerator.update();
        for (let i = 0; i < rays.length; i++) {
            rays[i].update(camera);
        }
        render();
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