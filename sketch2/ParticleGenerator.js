import * as THREE from 'three';
THREE.GPUParticleSystem = require('./GPUParticleSystem');

export default function ParticleGenerator() {
    let tick = 0;
    let clock = new THREE.Clock(true);
    let options, spawnerOptions, particleSystem;

    this.particleSystem = new THREE.GPUParticleSystem({
        maxParticles: 50000
    });
    // particleSystem.init();
    let position = [];

    options = {
        position: new THREE.Vector3(),
        positionRandomness: 0.1,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0.15,
        color: 0xaa88ff,
        colorRandomness: 0.2,
        turbulence: 0,
        lifetime: 3,
        size: 7,
        sizeRandomness: 5
    };
    spawnerOptions = {
        spawnRate: 0.1,
        horizontalSpeed: .5,
        verticalSpeed: 0,
        timeScale: 1
    };

    let colors = [0x11c6fd, 0xffb9f8, 0xa099ff];

    this.update = function () {
        var delta = clock.getDelta() * spawnerOptions.timeScale;
        tick += delta;

        if (tick < 0) tick = 0;
        if (delta > 0) {
            for (var c in colors) {
                var p = colors[c];
                options.color = p;
                options.position.x = randomIntFromInterval(-1000, 1000);
                options.position.y = randomIntFromInterval(0, 1000);
                options.position.z = randomIntFromInterval(-1000, 1000);
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