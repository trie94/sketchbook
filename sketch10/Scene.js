import * as THREE from 'three';
import vertShader from './shaders/andy.vert';
import fragShader from './shaders/andy.frag';
import noiseTexture from './assets/3d_simplex_texture.bin';

const OrbitControls = require('three-orbit-controls')(THREE);

export default function Scene(canvas) {
    const clock = new THREE.Clock();

    const TEXTURE_SIZE = 64;
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    let tick = true;

    const material = new THREE.ShaderMaterial( {
        uniforms: {
            resolution: { value: new THREE.Vector2(WIDTH, HEIGHT) },
            time: { value: 1.0 },
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
    } );

    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();

    const controls = createControl();

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

    function loadTexture() {
        let width = TEXTURE_SIZE;
        let height = TEXTURE_SIZE;
        let depth = TEXTURE_SIZE;

        return fetch(noiseTexture)
        .then(response => {
            if (!response.ok) {
                return null;
            }
            return response.arrayBuffer(); // Get the response as a raw binary buffer
        })
        .then(buffer => {
            // interpret the raw buffer as a Float32Array
            const rawData = new Float32Array(buffer);

            // sanity check
            if (rawData.length !== width * height * depth) {
                console.error("Error: Loaded data size does not match expected dimensions!");
            }

            console.log(`Loaded 3D data: ${width}x${height}x${depth}. Voxel count: ${rawData.length}`);

            // create the THREE.Data3DTexture
            const texture = new THREE.Data3DTexture(
                rawData, 
                width, 
                height, 
                depth
            );
            
            texture.format = THREE.RedFormat;      // Single channel (grayscale noise)
            texture.type = THREE.FloatType;        // Matches the float32 data type
            
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            texture.unpackAlignment = 1;           // Required for correct byte alignment
            texture.needsUpdate = true;
            
            return texture;
        });
    }

    this.start = function () {
        loadTexture();
    };

    this.update = function () {
        if (tick) {
            let time = Date.now() / 1000 % 120000;
            material.uniforms.time.value = time;
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

        material.uniforms.resolution.value = new THREE.Vector2(WIDTH, HEIGHT);
    }

    this.onMouseClick = function (e) {
        console.log("toggle timer");
        tick = !tick;
    }
}