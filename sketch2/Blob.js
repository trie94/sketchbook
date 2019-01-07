import * as THREE from 'three';

export default function Blob() {
    let time;
    const blobObj = new THREE.Object3D();

    const softBlobGeo = new THREE.SphereGeometry(95, 50, 50);
    this.softBlobMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xfbffe0) },
            rimColor: { type: "c", value: new THREE.Color(0x555a63) },
            scale: { type: "f", value: 10 },
            freq: { type: "f", value: 1.5 },
            time: { type: "f", value: 0.0 },
            rimPower: { type: "f", value: 3 }
        },
        vertexShader: require('../shaders/clouds.vert'),
        fragmentShader: require('../shaders/clouds.frag'),
        transparent: true,
        // blending: THREE.MultiplyBlending,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const softBlobMesh = new THREE.Mesh(softBlobGeo, this.softBlobMat);

    // angled one
    const angledBlobGeo = new THREE.SphereGeometry(85, 30, 20);
    this.angledBlobMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0xfbffe0) },
            rimColor: { type: "c", value: new THREE.Color(0x555a63) },
            scale: { type: "f", value: 10 },
            freq: { type: "f", value: 10 },
            time: { type: "f", value: 0.0 },
            rimPower: { type: "f", value: 2 }
        },
        vertexShader: require('../shaders/clouds.vert'),
        fragmentShader: require('../shaders/clouds.frag'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const angledBlobMesh = new THREE.Mesh(angledBlobGeo, this.angledBlobMat);
    blobObj.add(angledBlobMesh);

    const blobGeoLayer = new THREE.SphereGeometry(50, 30, 30);
    this.blobMatLayer = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0x999cff) },
            rimColor: { type: "c", value: new THREE.Color(0xfbffe0) },
            scale: { type: "f", value: 0.0 },
            time: { type: "f", value: 0.0 },
            rimPower: { type: "f", value: 10 }
        },
        vertexShader: require('../shaders/clouds.vert'),
        fragmentShader: require('../shaders/clouds.frag'),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const blobMeshLayer = new THREE.Mesh(blobGeoLayer, this.blobMatLayer);
    blobObj.add(blobMeshLayer);

    const blobGeoLayer2 = new THREE.SphereGeometry(110, 80, 80);
    this.blobMatLayer2 = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: "c", value: new THREE.Color(0x181c23) },
            rimColor: { type: "c", value: new THREE.Color(0x181c23) },
            scale: { type: "f", value: 0.0 },
            time: { type: "f", value: 0.0 },
            rimPower: { type: "f", value: 0.5 }
        },
        vertexShader: require('../shaders/clouds.vert'),
        fragmentShader: require('../shaders/clouds.frag'),
        transparent: true,
        blending: THREE.MultiplyBlending,
        depthWrite: false
    });

    this.getBlob = function () {
        return blobObj;
    }

    this.update = function () {
        time = Date.now() / 1000 % 120000;
        this.softBlobMat.uniforms.time.value = time;
        this.angledBlobMat.uniforms.time.value = time;
        this.blobMatLayer.uniforms.time.value = time;
        this.blobMatLayer.uniforms.scale.value = time * 0.0001;
    }
}