import * as THREE from 'three';
THREE.GPUParticleSystem = require('./GPUParticleSystem');

export default function ParticleGenerator() {
    let tick = 1;
    let clock = new THREE.Clock(true);
    let options, spawnerOptions, particleSystem;

    this.particleSystem = new THREE.GPUParticleSystem({
        maxParticles: 100
    });
    // particleSystem.init();
    let position = [];

    options = {
        position: new THREE.Vector3(),
        positionRandomness: 300,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0.5,
        color: 0xd8fcff,
        colorRandomness: 0.2,
        turbulence: 1,
        lifetime: 100,
        size: 20,
        sizeRandomness: 20,
        // smoothPosition: true
    };
    spawnerOptions = {
        spawnRate: 1,
        horizontalSpeed: 0,
        verticalSpeed: 0.5,
        timeScale: 1
    };

    // let colors = [0xd8fcff, 0xd8f0ff, 0xf9ffd8, 0xd8fcff, 0xd8f0ff, 0xf9ffd8];
    let colors = [0xd8fcff];

    this.update = function () {
        var delta = clock.getDelta() * spawnerOptions.timeScale;
        tick += delta;
        if (tick < 0) { tick = 0 };
        if (delta > 0) {
            for (var c in colors) {
                var p = colors[c];
                options.color = p;
                // options.position.x = randomIntFromInterval(-100, 100);
                // options.position.y = randomIntFromInterval(-100, 100);
                // options.position.z = randomIntFromInterval(-100, 100);
                // options.position.x = Math.sin(tick + (Math.PI * 0.5 * c) * spawnerOptions.horizontalSpeed) * 100;
                // options.position.y = Math.cos(tick + (Math.PI * 0.5 * c) * spawnerOptions.verticalSpeed) * 100;
                // options.position.z = Math.sin(tick + (Math.PI * 0.5 * c) * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 0;

                for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
                    this.particleSystem.spawnParticle(options);
                }
            }
        }
        this.particleSystem.update(tick);
    }

    function randomIntFromInterval(min, max) // min and max included
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}