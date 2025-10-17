import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

export default function Scene(canvas) {
    const clock = new THREE.Clock();
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();

    const controls = createControl();
    function addLights() {
        const hemiLight = new THREE.HemisphereLight(0xE7E2E0, 0xD9C5BA, 0.5);
        hemiLight.color.setHSL(0.6, 0.6, 0.6);
        hemiLight.groundColor.setHSL(0.1, 1, 0.4);
        hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);
    
        //Add directional light
        const dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(0, 3, 10);
        dirLight.position.multiplyScalar(1);
        dirLight.lookAt(0, 0, 0);
        scene.add(dirLight);
    
        dirLight.castShadow = true;
    
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
    
        const d = 50;
    
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
    
        dirLight.shadow.camera.far = 13500;
    }

    function createScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xd6cfcb );

        const geometry = new THREE.BufferGeometry();

        const vertices = new Float32Array( [
            -1.0, -1.0,  1.0, // v0
            3.0, -1.0,  1.0, // v1
            -1.0,  3.0,  1.0, // v2
        ] );

        const indices = [
            0, 1, 2,
        ];

        const uvs = new Float32Array( [
            0, 0, // uv0
            2, 0, // uv1
            0, 2 // uv2
        ] );
        
        geometry.setIndex( indices );
        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
        
        const material = new THREE.ShaderMaterial( {

            uniforms: {
                resolution: { value: new THREE.Vector2(WIDTH, HEIGHT) },
                time: { value: 1.0 },
            },
        
            vertexShader: require('../shaders/andy.vert'),
            fragmentShader: require('../shaders/andy.frag'),
            glslVersion: THREE.GLSL3
        
        } );
        const mesh = new THREE.Mesh( geometry, material );

        scene.add(mesh);

        return scene;
    }

    function createRenderer() {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
        renderer.setSize(WIDTH, HEIGHT);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

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
        controls.target = new THREE.Vector3(0, 0, 0);
        // controls.maxPolarAngle = Math.PI / 2;
        controls.maxDistance = 1000;

        return controls;
    }

    this.start = function () {
        addLights();
        console.log("hello");
    };

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

    this.onMouseClick = function (e) {
    }
}