import * as THREE from 'three';
import particleVert from './shaders/particle.vert';
import particleFrag from './shaders/particle.frag';

export default function simpleParticles() {

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    const MAX = 100;
    const geo = new THREE.BufferGeometry();
    const initialPositions = [];
    const velocities = [];
    const accelerations = [];

    for (let i = 0; i < MAX; i++) {
        initialPositions.push(rand(-0.5, 0.5));
        initialPositions.push(rand(-4, -3));
        initialPositions.push(rand(-1, 1));
        velocities.push(rand(-0.5, 0.5));
        velocities.push(10.0);
        velocities.push(rand(-1, 1));
        accelerations.push(0);
        accelerations.push(-9.8);
        accelerations.push(0);
    }
    const mat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 12.0 }
        },
        vertexShader: particleVert,
        fragmentShader: particleFrag,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });

    let mesh = new THREE.Points(geo, mat)
    mesh.position.z = 100;
    return mesh;
}