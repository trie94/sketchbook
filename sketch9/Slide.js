import * as THREE from 'three';

export default function Slide(pos, scale, quat, AMMO) {
    // change this if we want static
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

    let tmpQuat = new THREE.Quaternion();
    let tmpQuat2 = new THREE.Quaternion();

    this.addToScene = function(scene, physicsWorld) {
        scene.add(slide);
        physicsWorld.addRigidBody(body);
    }

    this.activate = function() {
        body.activate();
    }

    this.updatePhysics = function(tmpTrans, deltaTime) {
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
            // slide.rotation.z += deltaTime;
        }
    }
}