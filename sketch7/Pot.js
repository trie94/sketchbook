import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import pot from './assets/pot5.glb';
import liquidVert from './shaders/liquid.vert';
import liquidFrag from './shaders/liquid.frag';

export default function Pot() {
    const loader = new GLTFLoader();
    let potObj = new THREE.Object3D();
    const sphere = new THREE.SphereGeometry(5, 20, 20);
    const tempMat = new THREE.MeshNormalMaterial();

    const glassMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        shininess: 1000
    });

    const lidMat = new THREE.MeshBasicMaterial({
        color: 0x454b51
    });

    const liquidMat = new THREE.ShaderMaterial({
        uniforms: {
            color: { type: 'c', value: new THREE.Color(0xbe82ff) },
            rimColor: { type: 'c', value: new THREE.Color(0x89f5ff) },
            foamColor: { type: 'c', value: new THREE.Color(0xcee1ff) },
            fillHeight: { type: 'f', value: -0.2 }
        },
        vertexShader: liquidVert,
        fragmentShader: liquidFrag,
        transparent: true,
        // side: THREE.BackSide
    });

    const sphereMesh = new THREE.Mesh(sphere, liquidMat);

    loader.load(
        pot,
        (gltf) => {
            // called when the resource is loaded
            let children = gltf.scene.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].name.includes("body")) {
                    children[i].material = glassMat;
                } else if (children[i].name.includes("liquid")) {
                    children[i].material = liquidMat;
                } else {
                    children[i].material = lidMat;
                }
                // console.log(children[i]);
            }
            potObj.add(gltf.scene);
            potObj.scale.set(5, 5, 5);
            potObj.position.set(0, 1, 0);
            console.log(potObj);
        },
        (xhr) => {
            // called while loading is progressing
            console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
        },
        (error) => {
            // called when loading has errors
            console.error('An error happened', error);
        },
    );

    return potObj;
}