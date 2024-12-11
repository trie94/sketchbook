import * as THREE from 'three';

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

    // attach ammo data to the three js object
    ball.userData.physicsBody = body;

    // returns three js ball object
    this.getBall = function() {
        return ball;
    }

    this.applyForce = function(AMMO, forceMultiplier, mousePos, sign) {
        let objThree = ball;
        let objAmmo = objThree.userData.physicsBody;

        // direction from a ball to mouse pointer
        let direction = new THREE.Vector3().subVectors(mousePos, objThree.position);
        // let distSq = direction.lengthSq(); // maybe use this instead
        let dist = direction.length();
        direction.normalize();
        // console.log("dir: " + direction.x + ", " + direction.y + ", " + direction.z);

        let forceMagnitude = sign * forceMultiplier / Math.max(dist, 0.001); // avoid dividing by 0
        let force = direction.multiplyScalar(forceMagnitude);

        // apply the force to the center of the object
        objAmmo.applyForce(new AMMO.btVector3(force.x, force.y, force.z), new AMMO.btVector3(0, 0, 0));
        // drawDebugForce(objThree, force, forceMagnitude);
    }

    this.updatePhysics = function(tmpTrans) {
        let objThree = ball;
        let objAmmo = objThree.userData.physicsBody;
        // motion state holds the current transform
        let motionState = objAmmo.getMotionState();
        if (motionState) {
            // this copies this rigidbody's transform data to tmpTrans.
            motionState.getWorldTransform(tmpTrans);
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
    }

    this.activate = function() {
        ball.userData.physicsBody.activate();
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