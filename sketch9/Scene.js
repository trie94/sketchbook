import * as THREE from 'three';
import Ammo from 'ammo.js';
import Ball from './Ball.js';
import Slide from './Slide.js';
import Platform from './Platform.js';

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

    // const textureLoader = new THREE.TextureLoader();
    // const sdfTexture = textureLoader.load(fontSdf);
    let balls = [];
    // Physics world is in a world of its own on a different realm from your game.
    // it's just there to model the physical objects of your scene and their possible interaction using its own objects.
    // it's your duty to update the transform of the objects, especially in the main render loop.
    let physicsWorld;
    let tmpTrans;
    let AMMO = null;

    let slide;
    let platform;
    const tiltAngle = -15;
    let tilt = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0), tiltAngle * Math.PI / 180
    );

    const Mode = { SPAWN: "SPAWN", ATTRACT: "ATTRACT", REPEL: "REPEL" };
    let mode = Mode.SPAWN;
    function setMode(newMode) {
        if (mode != newMode) {
            // reset the multiplier
            forceMultiplier = maxForceMultiplier;
            // when the balls get settled, they get deactivated until there's something that
            // wakes them up (e.g., collision), so force them to wake up
            for (let i=0; i<balls.length; i++) {
                balls[i].activate();
            }
            slide.activate();

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
        dirLight.position.multiplyScalar(1);
        dirLight.lookAt(0, 0, 0);
        scene.add(dirLight);
    
        // dirLight.castShadow = true;
    
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

        return renderer;
    }

    function createCamera() {
        const aspectRatio = WIDTH / HEIGHT;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(0, 15, 40);
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

    function createBall(pos, radius, mass) {
        const ball = new Ball(pos, radius, mass, AMMO);
        ball.addToScene(scene, physicsWorld, camera);
        balls.push(ball);
    }

    function updatePhysics(deltaTime) {
        if (mode == Mode.ATTRACT || mode == Mode.REPEL) {
            // forceMultiplier -= decayRate * deltaTime;
            // make sure we don't go negative..
            // forceMultiplier = Math.max(forceMultiplier, 0);
            if (mousePos != null) {
                for (let i=0; i<balls.length; i++) {
                    let body = balls[i];
                    if (body instanceof Ball) {
                        balls[i].applyForce(
                            AMMO, forceMultiplier, mousePos, mode == Mode.ATTRACT ? 1 : -1);
                    }
                }
            }
        }

        // step world
        physicsWorld.stepSimulation(deltaTime, 10);
        if (slide != null) {
            slide.updatePhysics(tmpTrans, deltaTime);
        }
        // update ball rigid bodies
        for (let i = 0; i < balls.length; i++) {
            balls[i].updatePhysics(tmpTrans);
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
        // const solver = new AMMO.btMLCPSolver();

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

            platform = new Platform(AMMO, tilt);
            platform.addToScene(scene, physicsWorld);

            slide = new Slide(
                new THREE.Vector3(0, 0, 3),
                new THREE.Vector3(20, 2, 5),
                tilt,
                AMMO
            )
            slide.addToScene(scene, physicsWorld);
            // rigidBodies.push(slide);
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
        // need recursive to be true, to respect three js group objects.
        const intersects = rayCaster.intersectObjects(platform.getCollisionTarget(), true);

        if (intersects.length > 0) {
            if (mousePos == null) {
                mousePos = new THREE.Vector3();
            }
            let target = intersects[0];
            mousePos.copy(target.point);
            if (mode == Mode.SPAWN) {
                // console.log("spawn at: " + mousePos.x + ", " + mousePos.y + ", " + mousePos.z);
                createBall(target.point, 1, 1);
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