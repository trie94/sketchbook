import * as THREE from 'three';
import ping from './assets/single_ping.wav';

export default function Ball(pos, radius, mass, AMMO) {
    // three js
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 20),
        new THREE.MeshStandardMaterial({
            color: 0x7bacbd
        })
    );
    ball.position.set(pos.x, pos.y, pos.z);
    ball.castShadow = true;
    ball.receiveShadow = true;

    // Ammo
    const btSphere = new AMMO.btSphereShape(radius);
    btSphere.setMargin(0.05);

    const transform = new AMMO.btTransform();
    transform.setIdentity();
    transform.setOrigin(new AMMO.btVector3(pos.x, pos.y, pos.z));

    const motionState = new AMMO.btDefaultMotionState(transform);
    const localInertia = new AMMO.btVector3(0, 0, 0);
    btSphere.calculateLocalInertia(mass, localInertia);
    const rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, btSphere, localInertia);
    const body = new AMMO.btRigidBody(rbInfo);
    body.tag = "ball";
    let prevIsColliding = false;
    let isColliding = false;

    // for audio
    let audioBuffer;
    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(ping, function(buffer) {
        audioBuffer = buffer;
    });
    const audioContext = listener.context;
    let source = null;
    let isPlaying = false;

    body.onCollision = function(pitch) {
        isColliding = true;
        if (prevIsColliding) return;

        if (source == null) {
            source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
        }
        if (!isPlaying) {
            // console.log("pitch: " + pitch);
            source.detune.value = pitch;
            source.start();
            isPlaying = true;

            source.onended = () => {
                isPlaying = false;
                source = null;
            }
        }
    }

    // used for applying force
    let direction = new THREE.Vector3();
    let forceVector = new AMMO.btVector3();
    const relativePos = new AMMO.btVector3(0, 0, 0);

    this.addToScene = function(scene, physicsWorld, camera) {
        scene.add(ball);
        physicsWorld.addRigidBody(body);
        camera.add(listener);
    }

    this.applyForce = function(AMMO, forceMultiplier, mousePos, sign) {
        // direction from a ball to mouse pointer
        direction.subVectors(mousePos, ball.position);
        // let distSq = direction.lengthSq(); // maybe use this instead
        let dist = direction.length();
        direction.normalize();
        // console.log("dir: " + direction.x + ", " + direction.y + ", " + direction.z);

        let forceMagnitude = sign * forceMultiplier / Math.max(dist, 0.001); // avoid dividing by 0
        let force = direction.multiplyScalar(forceMagnitude);

        // apply the force to the center of the object
        forceVector.setValue(force.x, force.y, force.z);
        body.applyForce(forceVector, relativePos);
        // drawDebugForce(objThree, force, forceMagnitude);
    }

    this.updatePhysics = function(tmpTrans) {
        prevIsColliding = isColliding;
        isColliding = false;
        // motion state holds the current transform
        let motionState = body.getMotionState();
        if (motionState) {
            // this copies this rigidbody's transform data to tmpTrans.
            motionState.getWorldTransform(tmpTrans);
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            
            ball.position.set(p.x(), p.y(), p.z());
            ball.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }

    this.activate = function() {
        body.activate();
    }

    function drawDebugForce(objThree, force, forceMagnitude) {
        const points = [];
        points.push(objThree.position);
        points.push(objThree.position.clone().add(force.clone().multiplyScalar(0.1)));
        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial( { color: 0xff0000, opacity: forceMagnitude / maxForceMultiplier } )
        );
        
        scene.add(line);
        setTimeout(() => { scene.remove(line); }, 100);
    }
}