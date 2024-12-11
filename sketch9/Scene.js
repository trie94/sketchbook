import * as THREE from 'three';
import Ammo from 'ammo.js';
import Ball from './Ball.js';

const OrbitControls = require('three-orbit-controls')(THREE);

export default function Scene(canvas) {
    const clock = new THREE.Clock();
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    const scene = createScene();
    const renderer = createRenderer();
    const camera = createCamera();

    // const controls = createControl();

    const rayCaster = new THREE.Raycaster();
    // mouse pointer position
    const pointer = new THREE.Vector2();
    // let mousePos = new THREE.Vector3();
    let mousePos = null;
    let mousePosIndicator = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    let indicatorTimeout;

    const maxForceMultiplier = 400;
    let forceMultiplier = maxForceMultiplier;
    const decayRate = 10;

    // const textureLoader = new THREE.TextureLoader();
    // const sdfTexture = textureLoader.load(fontSdf);
    let rigidBodies = [];
    // Physics world is in a world of its own on a different realm from your game.
    // it's just there to model the physical objects of your scene and their possible interaction using its own objects.
    // it's your duty to update the transform of the objects, especially in the main render loop.
    let physicsWorld;
    let tmpTrans;
    let AMMO = null;

    const Mode = { SPAWN: "SPAWN", ATTRACT: "ATTRACT", REPEL: "REPEL" };
    let mode = Mode.SPAWN;
    function setMode(newMode) {
        if (mode != newMode) {
            // reset the multiplier
            forceMultiplier = maxForceMultiplier;
            // when the balls get settled, they get deactivated until there's something that
            // wakes them up (e.g., collision), so force them to wake up
            for (let i=0; i<rigidBodies.length; i++) {
                rigidBodies[i].activate();
            }

            mode = newMode;
            // reset the mouse pos so that the balls get reset when the mode changes.
            mousePos = null;
            updateModeText();
        }
    }
    const modeText = createModeText();

    // mode text
    function createModeText() {
        const root = document.getElementById("root");
        let modeText = document.createElement("div");
        modeText.id = "mode-text";
        modeText.style.position = "absolute";
        modeText.style.top = "10%";
        modeText.style.left = "50%";
        modeText.style.transform = "translate(-10%, -50%)";
        modeText.style.color = "black";
        modeText.textContent = mode;

        modeText.addEventListener("pointerup", function() {
            if (mode == Mode.SPAWN) {
                setMode(Mode.ATTRACT);
            } else if (mode == Mode.ATTRACT) {
                setMode(Mode.REPEL);
            } else if (mode == Mode.REPEL) {
                setMode(Mode.SPAWN);
            }
            console.log("mode: " + mode);
        });

        root.appendChild(modeText);
        
        return modeText;
    }

    function addLights() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
        // hemiLight.color.setHSL(0.6, 0.6, 0.6);
        // hemiLight.groundColor.setHSL(0.1, 1, 0.4);
        hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);
    
        //Add directional light
        const dirLight = new THREE.DirectionalLight(0xffffff , 0.9);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(0, 3, 10);
        dirLight.position.multiplyScalar(100);
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

    function updateModeText() {
        modeText.textContent = mode;
    }

    function createControl() {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 0, 0);
        // controls.maxPolarAngle = Math.PI / 2;
        controls.maxDistance = 1000;

        return controls;
    }

    function createPlatform(pos, scale, quat) {
        // zero mass means the body has infinite mass, hence it's static.
        const mass = 0;

        // render
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshPhysicalMaterial({
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
        const transform = new AMMO.btTransform();
        transform.setIdentity();
        transform.setOrigin(new AMMO.btVector3(pos.x, pos.y, pos.z ));
        transform.setRotation(new AMMO.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        const motionState = new AMMO.btDefaultMotionState(transform);
    
        // each rigidbody needs to reference a collision shape.
        // the collision shape is for collision s only, thus has no concept of mass, inertia, restitution, etc.
        const colShape = new AMMO.btBoxShape(new AMMO.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
        colShape.setMargin( 0.05 );
    
        const localInertia = new AMMO.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);
    
        const rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        const body = new AMMO.btRigidBody(rbInfo);
    
        physicsWorld.addRigidBody(body);
    }

    function createContainer() {
        const length = 30;
        const halfLength = length * 0.5;
        const thickness = 1;
        const quat = new THREE.Quaternion(0, 0, 0, 1);
        // bottom
        createPlatform(
            new THREE.Vector3(0, -halfLength, 0),
            new THREE.Vector3(length + thickness, thickness, length),
            quat
        );
        // left
        createPlatform(
            new THREE.Vector3(-halfLength, 0, 0),
            new THREE.Vector3(thickness, length, length),
            quat
        );
        // right
        createPlatform(
            new THREE.Vector3(halfLength, 0, 0),
            new THREE.Vector3(thickness, length, length),
            quat
        );
        // top
        createPlatform(
            new THREE.Vector3(0, halfLength, 0),
            new THREE.Vector3(length + thickness, thickness, length),
            quat
        );
        // back
        createPlatform(
            new THREE.Vector3(0, 0, -halfLength),
            new THREE.Vector3(length + thickness, length + thickness, thickness),
            quat
        );
    }

    function createBall(pos, radius, mass) {
        const ball = new Ball(pos, radius, mass, AMMO);
        scene.add(ball.getBall());
        rigidBodies.push(ball);
        physicsWorld.addRigidBody(ball.getBall().userData.physicsBody);
    }

    function updatePhysics(deltaTime) {
        if (mode == Mode.ATTRACT || mode == Mode.REPEL) {
            forceMultiplier -= decayRate * deltaTime;
            // make sure we don't go negative..
            forceMultiplier = Math.max(forceMultiplier, 0);
            // applyForceToBalls();
            if (mousePos != null) {
                for (let i=0; i<rigidBodies.length; i++) {
                    rigidBodies[i].applyForce(
                        AMMO, forceMultiplier, mousePos, mode == Mode.ATTRACT ? 1 : -1);
                }
            }
        }

        // step world
        physicsWorld.stepSimulation(deltaTime, 10);

        // update rigid bodies
        for (let i = 0; i < rigidBodies.length; i++) {
            rigidBodies[i].updatePhysics(tmpTrans);
        }
    }

    function setupPhysicsWorld() {
        // allows me to fine-tune the algorithms used for the full collision detection
        const collisionConfiguration =
        new AMMO.btDefaultCollisionConfiguration();
        // use this to register a callback that filters overlapping broadphase proxies
        // so that the collisions are not processed by the rest of the system.
        const dispatcher = new AMMO.btCollisionDispatcher(
        collisionConfiguration
        );
        // uses bounding box to quickly compute collision
        const overlappingPairCache = new AMMO.btDbvtBroadphase();
        // causes the objects to interact properly taking into account gravity,
        // game logic supplied forces, collisions, and hinge constraints.
        const solver = new AMMO.btSequentialImpulseConstraintSolver();

        physicsWorld = new AMMO.btDiscreteDynamicsWorld(
            dispatcher,
            overlappingPairCache,
            solver,
            collisionConfiguration
        );
        physicsWorld.setGravity(new AMMO.btVector3(0, -10, 0));
        // TODO: share the collision shape among other rigidbodies if they are the same.
        tmpTrans = new AMMO.btTransform();
    }

    this.start = function () {
        scene.add(mousePosIndicator);
        mousePosIndicator.visible = false;

        addLights();

        // initialize Ammo
        Ammo().then((Ammo) => { 
            AMMO = Ammo;
            setupPhysicsWorld();
            createContainer();
        });
    };

    this.update = function () {
        if (AMMO == null) return;
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

    this.onMouseClick = function (e) {
        pointer.x = (e.clientX / WIDTH) * 2 - 1;
        pointer.y = - (e.clientY / HEIGHT) * 2 + 1;

        rayCaster.setFromCamera(pointer, camera);
        const intersects = rayCaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            if (mousePos == null) {
                mousePos = new THREE.Vector3();
            }
            mousePos.copy(intersects[0].point);
            if (mode == Mode.SPAWN) {
                // console.log("spawn at: " + mousePos.x + ", " + mousePos.y + ", " + mousePos.z);
                createBall(intersects[0].point, 1, 1);
            } else {
                // we only need the indicator for non spawn modes.
                if (mousePos != null) {
                    mousePosIndicator.position.copy(mousePos);
                    mousePosIndicator.visible = true;
        
                    clearTimeout(indicatorTimeout);
                    indicatorTimeout = setTimeout(() => {
                        mousePosIndicator.visible = false;
                    }, 1000);
                }
            }
        } else {
            console.log("no hit");
        }
    }

    this.onKeyUp = function (e) {
        if (e.key == "s") { // reset
            setMode(Mode.SPAWN);
        }
        if (e.key == "a") { // attract
            setMode(Mode.ATTRACT);
        }
        if (e.key == "r") { // repel
            setMode(Mode.REPEL);
        }

        console.log("mode: " + mode);
    }
}