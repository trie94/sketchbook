import * as THREE from 'three';
import { RenderPass, ShaderPass, EffectComposer } from "postprocessing";
const OrbitControls = require('three-orbit-controls')(THREE);
import Skybox from './background';
import Objects from './object';
import VERTEX from './shaders/contour.vert';
import FRAGMENT from './shaders/contour.frag';

export default function Scene(canvas) {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    let debug = true;
    const skybox = Skybox();
    const objects = new Objects();

    // scene subjects
    const scene = createScene();
    const light = createLights();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = createControl();

    const resolution = new THREE.Vector2(WIDTH, HEIGHT);
    // passes
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);

    const contourShader = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse: { type: 't', value: null },
            color: { type: 'c', value: new THREE.Color(0xf442eb) },
            iResolution: { type: 'v2', value: resolution }
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
    });

    const shaderPass = new ShaderPass(contourShader, "tDiffuse");
    shaderPass.renderToScreen = true;
    composer.addPass(renderPass);
    composer.addPass(shaderPass);

    const clock = new THREE.Clock();
    let tick = 0;

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
        camera.position.set(0, 100, 0);
        camera.lookAt(new THREE.Vector3());

        return camera;
    }

    function createRenderer() {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function createLights() {
        let lights = [];
        // lights.push(new THREE.AmbientLight(0x999999, 0.5));
        lights.push(new THREE.DirectionalLight(0xffffff, 1));
        // lights.push(new THREE.DirectionalLight(0x46f5fd, 1));
        // lights.push(new THREE.DirectionalLight(0x8200C9, 1));
        // lights[1].position.set(10, 0, 0);
        // lights[2].position.set(0.75, 1, 0.5);
        // lights[3].position.set(-0.75, -1, 0.5);

        return lights;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 0, 0);
        // controls.maxPolarAngle = Math.PI / 2;
        // controls.maxDistance = 70;
        controls.minDistance = 100;

        return controls;
    }

    this.start = function () {
        console.log("start");
        for (let i = 0; i < light.length; i++) {
            scene.add(light[i]);
        }
        scene.add(skybox);
        scene.add(objects.getSphere());
        scene.add(objects.getFloor());
    }

    this.update = function () {
        // renderer.render(scene, camera);
        composer.render();
    }

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        canvas.innerWidth = WIDTH;
        canvas.innerHeight = HEIGHT;

        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        contourShader.uniforms.iResolution.value.set(WIDTH, HEIGHT);

        composer.setSize(WIDTH, HEIGHT);
        renderer.setSize(WIDTH, HEIGHT);
    }

    this.onMouseClick = function () {
        console.log("click");
    }
}