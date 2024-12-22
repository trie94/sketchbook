import * as THREE from 'three';

export default function Slide(pos, scale, quat, AMMO) {
    const mass = 0;
    const axis = new THREE.Vector3(0, 0, 1);

    const slide = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshPhysicalMaterial({
            color: 0x536075,
        })
    );
    slide.position.set(pos.x, pos.y, pos.z);
    slide.scale.set(scale.x, scale.y, scale.z);
    slide.castShadow = true;
    slide.receiveShadow = true;

    // physics
    const transform = new AMMO.btTransform();
    transform.setIdentity();
    transform.setOrigin(new AMMO.btVector3(pos.x, pos.y, pos.z ));
    transform.setRotation(new AMMO.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    const motionState = new AMMO.btDefaultMotionState(transform);

    const colShape = new AMMO.btBoxShape(new AMMO.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
    colShape.setMargin(0.05);

    const localInertia = new AMMO.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
    const body = new AMMO.btRigidBody(rbInfo);
    body.tag = "slide";

    // for rotation
    let tmpQuat = new THREE.Quaternion();
    let tmpQuat2 = new THREE.Quaternion();

    // for collision check..
    let contactResultCallback = new AMMO.ConcreteContactResultCallback();
    contactResultCallback.addSingleResult =
    function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1){
        let contactPoint = AMMO.wrapPointer(cp, AMMO.btManifoldPoint);

        const distance = contactPoint.getDistance();

        if (distance > 0) return;

        let colWrapper0 = AMMO.wrapPointer( colObj0Wrap, AMMO.btCollisionObjectWrapper );
        let rb0 = AMMO.castObject( colWrapper0.getCollisionObject(), AMMO.btRigidBody );
        
        let colWrapper1 = AMMO.wrapPointer( colObj1Wrap, AMMO.btCollisionObjectWrapper );
        let rb1 = AMMO.castObject( colWrapper1.getCollisionObject(), AMMO.btRigidBody );

        // if (rb0.tag == "ball") {
        //     rb0.onCollision();
        //     console.log("rb1: " + JSON.stringify(contactPoint, null, 4))
        // }

        if (rb1.tag == "ball") {
            // rb0 is the bar.
            let localPos = contactPoint.get_m_localPointA();
            let worldPos = contactPoint.get_m_positionWorldOnA();

            // let localPosDisplay = {x: localPos.x(), y: localPos.y(), z: localPos.z()};
            // let worldPosDisplay = {x: worldPos.x(), y: worldPos.y(), z: worldPos.z()};

            // major scale
            const scaleValues = [0, 2, 4, 5, 7, 9, 11, 12];
            // minor scale
            // const scaleValues = [0, 2, 3, 5, 7, 9, 11, 12];
            // pentatonic
            // const scaleValues = [0, 2, 4, 7, 9, 12];
            let lowEnd = -scale.x * 0.5;
            let highEnd = scale.x * 0.5;
            let pitch = remap(localPos.x(), lowEnd, highEnd, 0, 12);

            let nearestPitch = -1;
            let nearestDistance = Infinity;
            for (let i = 0; i < scaleValues.length; i++) {
                let distance = Math.abs(pitch - scaleValues[i]);
                if (distance < nearestDistance) {
                    nearestPitch = scaleValues[i];
                    nearestDistance = distance;
                }
            }

            const pitchOffset = -600;
            nearestPitch *= 100;
            nearestPitch += pitchOffset;

            rb1.onCollision(nearestPitch);
            // console.log("pitch: " + pitch);
            // console.log( { localPosDisplay, worldPosDisplay } );
        }
    }

    this.addToScene = function(scene, physicsWorld) {
        scene.add(slide);
        physicsWorld.addRigidBody(body);

        this.physicsWorld = physicsWorld;
    }

    this.activate = function() {
        body.activate();
    }

    this.updatePhysics = function(tmpTrans, deltaTime) {
        this.physicsWorld.contactTest(body, contactResultCallback);

        let motionState = body.getMotionState();
        if (motionState) {
            motionState.getWorldTransform(tmpTrans);
            let p = tmpTrans.getOrigin();
            let q = tmpTrans.getRotation();
            // no need to set since it's not moving its position, but..why not.
            slide.position.set(p.x(), p.y(), p.z());

            // compute new rotation
            tmpQuat.set(q.x(), q.y(), q.z(), q.w());
            tmpQuat.multiply(tmpQuat2.setFromAxisAngle(
                axis, 3 * deltaTime
            ));

            tmpTrans.setRotation(
                new AMMO.btQuaternion(
                    tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w
            ));
            motionState.setWorldTransform(tmpTrans);
            // rigid body should update the transform
            body.setMotionState(motionState);

            slide.quaternion.set(tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);
        }
    }

    this.assignMaterial = function(mat) {
        slide.material = mat;
    }

    function remap(value, inMin, inMax, outMin , outMax) {
        return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
    }
}