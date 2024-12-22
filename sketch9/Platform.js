import * as THREE from 'three';

export default function Platform(AMMO, tilt) {
    const platformGroup = new THREE.Group();

    const length = 30;
    const halfLength = length * 0.5;
    const thickness = 2;
    const sideLength = 5;

    let bodies = [];

    // bottom
    const bottom = createPlatform(
        new THREE.Vector3(0, -halfLength, sideLength * 0.5),
        new THREE.Vector3(length + thickness, thickness, sideLength),
        0xE7E2E0
    );
    // left
    const left = createPlatform(
        new THREE.Vector3(-halfLength, 0, sideLength * 0.5),
        new THREE.Vector3(thickness, length, sideLength),
        0xE7E2E0
    );
    // right
    const right = createPlatform(
        new THREE.Vector3(halfLength, 0, sideLength * 0.5),
        new THREE.Vector3(thickness, length, sideLength),
        0xE7E2E0
    );
    // top
    const top = createPlatform(
        new THREE.Vector3(0, halfLength, sideLength * 0.5),
        new THREE.Vector3(length + thickness, thickness, sideLength),
        0xE7E2E0
    );
    // back, main one
    const back = createPlatform(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(length - thickness, length - thickness, thickness,
        0xf0ebe6
        ),
    );
    // we don't render this, but add this so that we can trap the balls inside the box.
    const front = createPlatform(
        new THREE.Vector3(0, 0, sideLength),
        new THREE.Vector3(length + thickness, length + thickness, thickness),
    );

    platformGroup.add(bottom, left, right, top, back, front);

    // tilt the whole thing
    platformGroup.setRotationFromQuaternion(tilt);
    // force update so that we can initialize ammo bodies correctly
    platformGroup.updateMatrixWorld(true);

    // set the correct rigid body transform
    for (let i=0; i<platformGroup.children.length; i++) {
        createAmmoInfo(platformGroup.children[i]);
    }
    front.visible = false;

    this.addToScene = function(scene, physicsWorld) {

        scene.add(platformGroup);

        for (let i=0; i<bodies.length; i++) {
            physicsWorld.addRigidBody(bodies[i]);
        }
    }
    
    this.getCollisionTarget = function() {
        return [back];
    }

    function createPlatform(pos, scale, col) {
        // zero mass means the body has infinite mass, hence it's static.
        const mass = 0;

        // render
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshBasicMaterial({
            color: col,
            // side: THREE.DoubleSide,
          })
        );
        box.position.set(pos.x, pos.y, pos.z);
        box.scale.set(scale.x, scale.y, scale.z);
        box.castShadow = true;
        box.receiveShadow = true;

        return box;
    }

    function createAmmoInfo(platform) {
        const mass = 0;
        let worldPos = new THREE.Vector3();
        let worldQuat = new THREE.Quaternion();
        let worldScale = new THREE.Vector3();
        platform.getWorldPosition(worldPos);
        platform.getWorldQuaternion(worldQuat);
        platform.getWorldScale(worldScale);
        // console.log(worldQuat)

        const transform = new AMMO.btTransform();
        transform.setIdentity();
        transform.setOrigin(new AMMO.btVector3(worldPos.x, worldPos.y, worldPos.z));
        transform.setRotation(new AMMO.btQuaternion(worldQuat.x, worldQuat.y, worldQuat.z, worldQuat.w));
        const motionState = new AMMO.btDefaultMotionState(transform);
    
        // each rigidbody needs to reference a collision shape.
        // the collision shape is for collision s only, thus has no concept of mass, inertia, restitution, etc.
        const colShape = new AMMO.btBoxShape(new AMMO.btVector3(worldScale.x * 0.5, worldScale.y * 0.5, worldScale.z * 0.5));
        colShape.setMargin(0.05);
    
        const localInertia = new AMMO.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);
    
        const rbInfo = new AMMO.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        const body = new AMMO.btRigidBody(rbInfo);
    
        bodies.push(body);
    }
}