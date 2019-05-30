import * as THREE from 'three';

export default function Path() {
    let center = new THREE.Vector3(100, -30, 100);
    let randomPoints = [];
    let radius = 100;
    let segmentCount = 30;

    for (let i = 0; i <= segmentCount; i++) {
        let theta = (i / segmentCount) * Math.PI * 2;
        randomPoints.push(
            new THREE.Vector3(
                Math.cos(theta) * radius,
                Math.cos(theta) * radius * -0.3,
                Math.sin(theta) * radius));
    }


    let spline = new THREE.CatmullRomCurve3(randomPoints);
    let points = spline.getPoints(50);
    let pathGeo = new THREE.BufferGeometry().setFromPoints(points);
    let pathMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let path = new THREE.Line(pathGeo, pathMat);

    this.getSpline = function () {
        return spline;
    }

    this.debug = function () {
        return path;
    }
}