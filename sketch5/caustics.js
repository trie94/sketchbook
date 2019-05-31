// import * as THREE from 'three';
// import causticsTexture from './assets/caustics.jpg';

// export default function caustics() {
//     const loader = new THREE.TextureLoader();
//     let texture = loader.load(causticsTexture, function ( texture ) {
//         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//         texture.offset.set( 0, 0 );
//         texture.repeat.set( 2, 2 );
//     } );
//     const waterGeo = new THREE.PlaneGeometry(1000, 1000, 90, 90);
//     const waterMat = new THREE.MeshBasicMaterial({
//         map: texture
//     });
//     const waterMesh = new THREE.Mesh(waterGeo, waterMat);
//     waterMesh.rotation.x = Math.PI / 2;
//     waterMesh.position.y = 500;

//     return waterMesh;
// }