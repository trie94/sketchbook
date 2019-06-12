import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import coffeefish from './assets/coffeefish.glb';
import pot from './assets/pot.glb';

export default function Fish() {
    const loader = new GLTFLoader();
    let fishObj = new THREE.Object3D();
    const tempMat = new THREE.MeshNormalMaterial();

    const fishMat = new THREE.MeshBasicMaterial({
        color: 0xf0e9e0
    });
    const eyeMat = new THREE.MeshBasicMaterial({
        color: 0xfdfaf7
    });

    const limbMat = new THREE.MeshBasicMaterial({
        color: 0xff6700
    });

    loader.load(
        coffeefish,
        (gltf) => {
            // called when the resource is loaded
            let children = gltf.scene.children;
            console.log(children);
            // console.log(gltf.scene.children.length);
            for (let i = 0; i < children.length; i++) {
                if (children[i].name.includes("eye")) {
                    children[i].material = eyeMat;
                } else if (children[i].name.includes("body"
                )) {
                    children[i].material = fishMat;
                } else {
                    children[i].material = limbMat;
                }
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