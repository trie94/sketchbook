import * as THREE from 'three';

export default function Particle() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();    // per sec
    this.acceleration = new THREE.Vector3();

    this.angle = 0;
    this.angleVelocity = 0;     // degrees per sec
    this.angleAcceleration = 0;

    this.size = 10;
    this.color = new THREE.Color();
    this.opacity = 0;
    this.age = 0;
    this.alive = 0; // boolean

    this.update = function () {
        // move particle
    }
}