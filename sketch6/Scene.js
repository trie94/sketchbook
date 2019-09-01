import * as THREE from 'three';
import { RenderPass, ShaderPass, EffectComposer } from "postprocessing";
const OrbitControls = require('three-orbit-controls')(THREE);
import Objects from './object';
import contourVert from './shaders/contour.vert';
import contourFrag from './shaders/contour.frag';
import stylizeVert from './shaders/stylize.vert';
import stylizeFrag from './shaders/stylize.frag';
// import man from './sketchbookman';

export default function Scene(canvas) {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;
    let SHADOW_MAP_SIZE = 1024;

    const objects = new Objects();
    const sketchbookman = new man();

    // scene subjects
    const scene = createScene();
    const light = createLights();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = createControl();

    // render texture
    const depthBuffer = new THREE.WebGLRenderTarget(WIDTH, HEIGHT);
    depthBuffer.texture.format = THREE.RGBFormat;
    depthBuffer.texture.minFilter = THREE.LinearFilter;
    depthBuffer.texture.magFilter = THREE.LinearFilter;
    depthBuffer.texture.generateMipmaps = false;
    depthBuffer.stencilBuffer = false;
    depthBuffer.depthBuffer = true;

    const resolution = new THREE.Vector2(WIDTH, HEIGHT);

    // passes
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);

    const contourShader = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse: { type: 't', value: null },
            tDepth: { type: 't', value: null },
            iResolution: { type: 'v2', value: resolution }
        },
        vertexShader: contourVert,
        fragmentShader: contourFrag,
    });

    const shaderPass = new ShaderPass(contourShader, "tDiffuse");

    const finalShader = new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse: { type: 't', value: null },
            time: { type: 'f', value: 0.0 },
            scale: { type: 'f', value: 0.001 },
            edgeColor: { type: 'c', value: new THREE.Color(0x282723) },
            backgroundColor: { type: 'c', value: new THREE.Color(0xe0ddd0) }
        },
        vertexShader: stylizeVert,
        fragmentShader: stylizeFrag
    });
    const finalPass = new ShaderPass(finalShader, "tDiffuse");

    renderPass.renderToScreen = false;
    shaderPass.renderToScreen = false;
    finalPass.renderToScreen = true;
    composer.addPass(renderPass);
    composer.addPass(shaderPass);
    composer.addPass(finalPass);

    const clock = new THREE.Clock();
    let tick = 0;

    function createScene() {
        const scene = new THREE.Scene();
        // scene.fog = new THREE.Fog(0xf7d9aa, 1, 100);
        return scene;
    }

    function createCamera() {
        const aspectRatio = WIDTH / HEIGHT;
        const fieldOfView = 40;
        const nearPlane = 1;
        const farPlane = 1000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.set(50, 30, 90);
        camera.lookAt(new THREE.Vector3());

        return camera;
    }

    function createRenderer() {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.shadowMap.enabled = true;
        renderer.renderReverseSided = false;
        // renderer.renderSingleSided = false;
        renderer.setClearColor(0x000000);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function createLights() {
        let lights = [];
        // lights.push(new THREE.AmbientLight(0x999999, 0.5));
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(100, 100, 0);

        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = SHADOW_MAP_SIZE;
        directionalLight.shadow.mapSize.height = SHADOW_MAP_SIZE;
        directionalLight.shadow.camera.far = 500;

        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.bias = -0.0001;

        // let helper = new THREE.CameraHelper(directionalLight.shadow.camera);
        // scene.add(helper);

        lights.push(directionalLight);

        return lights;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.maxPolarAngle = Math.PI / 2;
        controls.minDistance = 40;
        controls.maxDistance = 300;

        return controls;
    }

    this.start = function () {
        console.log("start");
        for (let i = 0; i < light.length; i++) {
            scene.add(light[i]);
        }
        // scene.add(sketchbookman.getMan());
        scene.add(objects.getSphere());
        scene.add(objects.getFloor());
    }

    this.update = function () {
        objects.assignPhongMat();
        renderer.setRenderTarget(depthBuffer);
        renderer.render(scene, camera);
        contourShader.uniforms.tDepth.value = depthBuffer.texture;
        // renderer.autoClear = true;

        objects.assignNormalMat();
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
        renderer.autoClear = true;
        composer.render();
    }

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        canvas.innerWidth = WIDTH;
        canvas.innerHeight = HEIGHT;

        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();

        depthBuffer.setSize(WIDTH, HEIGHT);

        contourShader.uniforms.iResolution.value.set(WIDTH, HEIGHT);

        composer.setSize(WIDTH, HEIGHT);
        renderer.setSize(WIDTH, HEIGHT);
    }

    this.onMouseClick = function () {
        // console.log("click");
    }
}