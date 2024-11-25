import * as THREE from 'three';
import Ammo from 'ammo.js';
// import * as ammo from 'ammo.js';
// import { Ammo } from './ammo';

const OrbitControls = require('three-orbit-controls')(THREE);
import fontSdf from './assets/mikado-medium.png';
import textVert from './shaders/text.vert';
import textFrag from './shaders/text.frag';

export default function Scene(canvas) {
    const clock = new THREE.Clock();
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;
    let initPhysics = false;
    const numBalls = 3;

    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    const controls = createControl();

    const textureLoader = new THREE.TextureLoader();
    // const sdfTexture = textureLoader.load(fontSdf);
    let rigidBodies = [], tmpTrans;
    let physicsWorld;

    function addLights() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
        // hemiLight.color.setHSL(0.6, 0.6, 0.6);
        // hemiLight.groundColor.setHSL(0.1, 1, 0.4);
        hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);
    
        //Add directional light
        const dirLight = new THREE.DirectionalLight(0xffffff , 1);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 1.75, 1);
        dirLight.position.multiplyScalar(100);
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
        scene.background = new THREE.Color( 0xbfd1e5 );

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

        camera.position.set(0, 0, 50);
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

    function createPlatform(Ammo, physicsWorld) {
        // render
        const pos = new THREE.Vector3(0, -10, 0);
        const scale = new THREE.Vector3(30, 1, 30);
        const quat = new THREE.Quaternion(0, 0, 0, 1);
        // static body
        const mass = 0;

        const box = new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshStandardMaterial({
            color: 0xadaaa5,
            // side: THREE.DoubleSide,
          })
        );
        box.position.set(pos.x, pos.y, pos.z);
        box.scale.set(scale.x, scale.y, scale.z);
        box.castShadow = true;
        box.receiveShadow = true;

        scene.add(box);

        // physics
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z ));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        const motionState = new Ammo.btDefaultMotionState(transform);
    
        const colShape = new Ammo.btBoxShape( new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
        colShape.setMargin( 0.05 );
    
        const localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);
    
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);
    
        physicsWorld.addRigidBody(body);
    }

    function createBall(Ammo, physicsWorld, pos, radius, mass) {
        const ball = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 20, 20),
            new THREE.MeshStandardMaterial({
                color: 0x7bacbd
            })
        );
        ball.position.set(pos.x, pos.y, pos.z);
        ball.castShadow = true;
        ball.receiveShadow = true;

        scene.add(ball);

        const btSphere = new Ammo.btSphereShape(radius);
        btSphere.setMargin(0.05);
    
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(0, 3, 0));

        const motionState = new Ammo.btDefaultMotionState(transform);
        const localInertia = new Ammo.btVector3(0, 0, 0);
        btSphere.calculateLocalInertia(mass, localInertia);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, btSphere, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);

        physicsWorld.addRigidBody(body);
        // Maybe make a struct instead...
        ball.userData.physicsBody = body;

        rigidBodies.push(ball);
    }

    function updatePhysics(deltaTime) {
        // Step world
        physicsWorld.stepSimulation(deltaTime, 10);

        // Update rigid bodies
        for (let i = 0; i < rigidBodies.length; i++) {
            let objThree = rigidBodies[i];
            let objAmmo = objThree.userData.physicsBody;
            let ms = objAmmo.getMotionState();
            if (ms) {
                ms.getWorldTransform(tmpTrans);
                let p = tmpTrans.getOrigin();
                let q = tmpTrans.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.start = function () {
      addLights();
      renderer.render(scene, camera);

      // initialize Ammo
      Ammo().then((Ammo) => {
        const collisionConfiguration =
          new Ammo.btDefaultCollisionConfiguration();
        const dispatcher = new Ammo.btCollisionDispatcher(
          collisionConfiguration
        );
        const overlappingPairCache = new Ammo.btDbvtBroadphase();
        const solver = new Ammo.btSequentialImpulseConstraintSolver();

        physicsWorld = new Ammo.btDiscreteDynamicsWorld(
          dispatcher,
          overlappingPairCache,
          solver,
          collisionConfiguration
        );
        physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
        initPhysics = true;

        tmpTrans = new Ammo.btTransform();

        createPlatform(Ammo, physicsWorld);

        for (let i = 0; i < numBalls; i++) {
            createBall(Ammo, physicsWorld, new THREE.Vector3(0, 10, 0), i + 1, i + 1);
        }
      });
    };

    this.update = function () {
        if (!initPhysics) return;
        renderer.render(scene, camera);
        updatePhysics(clock.getDelta());
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