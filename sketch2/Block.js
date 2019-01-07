import * as THREE from 'three';

export default function Block() {
    let intensity = 1.5;
    const pointLight = new THREE.PointLight(0xfbffe0, intensity);
    let time;
    // pointLight.shadow.bias = -0.5;

    const geo = new THREE.SphereGeometry(50, 30, 30);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xfbffe0,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        opacity: 0.7
    });

    const shaderMat = new THREE.ShaderMaterial({
        uniforms: {
            rimColor: { type: "c", value: new THREE.Color(0xfbffe0) }
        },
        vertexShader: require('../shaders/glow.vert'),
        fragmentShader: require('../shaders/glow.frag'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    mat.color.multiplyScalar(intensity);
    const sphere = new THREE.Mesh(geo, shaderMat);
    pointLight.add(sphere);

    const texture = new THREE.CanvasTexture(generateTexture());
    texture.magFilter = THREE.NearestFilter;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1, 5);

    const outerSphereGeo = new THREE.SphereGeometry(100, 30, 30);
    this.outerSphereMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0x66ccbb) },
            height: { type: "f", value: 0.5 },
            time: { type: "f", value: 0.0 },
        },
        vertexShader: require('../shaders/shell.vert'),
        fragmentShader: require('../shaders/shell.frag'),
        // side: THREE.DoubleSide,
        // transparent: true,
        // opacity: 0.5,
        // blending: THREE.MultiplyBlending,
        // depthWrite: false,
        // wireframe: true,
    });

    const outerSphere = new THREE.Mesh(outerSphereGeo, this.outerSphereMat);

    outerSphere.castShadow = true;
    outerSphere.receiveShadow = true;
    pointLight.add(outerSphere);

    function generateTexture() {
        var canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        var context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 100, 128, 28);
        return canvas;
    }

    // particles
    const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 5,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: generateParticles(),
        depthWrite: false
    });

    const cloud = new THREE.Points(outerSphereGeo, particleMat);
    // pointLight.add(cloud);

    function generateParticles() {
        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    this.getBlock = function () {
        return pointLight;
    }

    this.update = function () {
        time = Date.now() / 1000 % 120000;
        this.outerSphereMat.uniforms.time.value = time;
    }
}