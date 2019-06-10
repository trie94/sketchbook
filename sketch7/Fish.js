import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import coffeefish from './assets/coffeefish.glb';

export default function Fish() {
    const loader = new GLTFLoader();
    let fishObj = new THREE.Object3D();
    const tempMat = new THREE.MeshNormalMaterial();

    loader.load(
        coffeefish,
        (gltf) => {
            // called when the resource is loaded
            let children = gltf.scene.children;
            // console.log(gltf.scene.children.length);
            for (let i = 0; i < children.length; i++) {
                children[i].material = tempMat;
            }
            fishObj.add(gltf.scene);
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

    return fishObj;
}