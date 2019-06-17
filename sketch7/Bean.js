import * as THREE from 'three';
import bean from './assets/coffeebean.glb';
import GLTFLoader from 'three-gltf-loader';

export default function Bean() {
    const loader = new GLTFLoader();
    const tempMat = new THREE.MeshBasicMaterial({
        color: 0x231a12
    });
    const beanObj = new THREE.Object3D();

    loader.load(
        bean,
        (gltf) => {
            // called when the resource is loaded
            let children = gltf.scene.children;
            for (let i = 0; i < children.length; i++) {
                children[i].material = tempMat;
                beanObj.add(children[i]);
            }
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

    return beanObj;
}