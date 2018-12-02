import * as THREE from 'three';
var Type = Object.freeze({ "CUBE": 1, "SPHERE": 2 });

export default function ParticleEngine() {
    // this.positionStyle = Type.CUBE;
    // this.positionBase = new THREE.Vector3();
    // // cube shape data
    // this.positionSpread = new THREE.Vector3();
    // // sphere shape data
    // this.positionRadius = 0; // distance from base at which particles start

    // this.velocityStyle = Type.CUBE;
    // // cube movement data
    // this.velocityBase = new THREE.Vector3();
    // this.velocitySpread = new THREE.Vector3();
    // // sphere movement data
    // //   direction vector calculated using initial position
    // this.speedBase = 0;
    // this.speedSpread = 0;

    // this.accelerationBase = new THREE.Vector3();
    // this.accelerationSpread = new THREE.Vector3();

    // this.angleBase = 0;
    // this.angleSpread = 0;
    // this.angleVelocityBase = 0;
    // this.angleVelocitySpread = 0;
    // this.angleAccelerationBase = 0;
    // this.angleAccelerationSpread = 0;

    // this.sizeBase = 0.0;
    // this.sizeSpread = 0.0;
    // this.sizeTween = new Tween();

    // // store colors in HSL format in a THREE.Vector3 object
    // // http://en.wikipedia.org/wiki/HSL_and_HSV
    // this.colorBase = new THREE.Vector3(0.0, 1.0, 0.5);
    // this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);
    // this.colorTween = new Tween();

    // this.opacityBase = 1.0;
    // this.opacitySpread = 0.0;
    // this.opacityTween = new Tween();

    // this.blendStyle = THREE.NormalBlending; // false;

    // this.particleArray = [];
    // this.particlesPerSecond = 100;
    // this.particleDeathAge = 1.0;

    // ////////////////////////
    // // EMITTER PROPERTIES //
    // ////////////////////////

    // this.emitterAge = 0.0;
    // this.emitterAlive = true;
    // this.emitterDeathAge = 60; // time (seconds) at which to stop creating particles.

    // // How many particles could be active at any time?
    // this.particleCount = this.particlesPerSecond * Math.min(this.particleDeathAge, this.emitterDeathAge);

    //////////////
    // THREE.JS //
    //////////////

    this.particleGeometry = new THREE.Geometry();
    this.particleTexture = require("../assets/particle2.png");
    this.particleMaterial = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                color: { type: "c", value: new THREE.Color() },
                texture: { type: "t", value: this.particleTexture },
            },
            // attributes:
            // {
            //     customVisible: { type: 'f', value: [] },
            //     customAngle: { type: 'f', value: [] },
            //     customSize: { type: 'f', value: [] },
            //     customColor: { type: 'c', value: [] },
            //     customOpacity: { type: 'f', value: [] }
            // },
            // vertexShader: require('../shaders/particles.vert'),
            // fragmentShader: require('../shaders/particles.frag'),
            transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5, 
            blending: THREE.NormalBlending, depthTest: true,

        });
    this.particleMesh = new THREE.Mesh();
}