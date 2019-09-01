import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import man from './assets/sketchbook2-rigged.glb';

export default function sketchbookman() {
    const loader = new GLTFLoader();
    let manObj = new THREE.Object3D();

    const normalMat = new THREE.MeshNormalMaterial();
    const phongMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0.0,
    });

    loader.load(
        man,
        (gltf) => {
            // called when the resource is loaded
            let children = gltf.scene.children;
            for (let i = 0; i < children.length; i++) {
                children[i].material = normalMat;
            }
            manObj.add(gltf.scene);
            manObj.scale.set(10, 10, 10);
            manObj.position.set(0, 0, 0);
            console.log(manObj.material);
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

    this.getMan = function() {
        return manObj;
    }
}