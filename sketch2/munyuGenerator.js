import * as THREE from 'three';
import Munyu from './Munyu';

export default function MunyuGenerator() {

    let munyus = [];
    let pointVertex = [];
    let speed = [];
    let munyuColors = [];
    const munyuNum = 30;
    // each vertice point// each vertice point
    const pointGeo = new THREE.Geometry();
    const colors = [0xc36251, 0xc1c351, 0x51c39e, 0x5058c4, 0xa750c4, 0x80c450];

    createGrid();
    getRandomPos();

    function createGrid() {
        // grid for generating random islands
        const config = {
            height: 500,
            width: 500,
            heightSeg: 50,
            widthSeg: 50,
            color: "black"
        };

        // set 0 opacity for production
        const material = new THREE.LineBasicMaterial({
            color: config.color
        });

        // line
        const gridObject = new THREE.Object3D();
        const gridGeo = new THREE.Geometry();

        const stepw = 2 * config.width / config.widthSeg;
        const steph = 2 * config.height / config.heightSeg;

        // line - width
        for (let i = -config.width; i <= config.width; i += stepw) {
            gridGeo.vertices.push(new THREE.Vector3(-config.height, i, 0));
            gridGeo.vertices.push(new THREE.Vector3(config.height, i, 0));
        }

        // line - height
        for (let i = -config.height; i <= config.height; i += steph) {
            gridGeo.vertices.push(new THREE.Vector3(i, -config.width, 0));
            gridGeo.vertices.push(new THREE.Vector3(i, config.width, 0));
        }

        // draw grid line
        const line = new THREE.LineSegments(gridGeo, material);
        gridObject.add(line);
        gridObject.rotation.x = Math.PI / 2;

        // point vertices
        for (let i = -config.width; i <= config.width; i += stepw) {
            for (let j = -config.height; j <= config.height; j += steph) {
                pointGeo.vertices.push(new THREE.Vector3(i, -100, j));
            }
        }
    }

    function getRandomPos() {
        // push random vertices to the array
        let prevIndex = null;
        for (let i = 0; i < munyuNum; i++) {

            let index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);

            // prevent overlap
            while (index === prevIndex) {
                index = Math.floor((Math.random() * pointGeo.vertices.length - 1) + 1);
            }

            pointVertex[i] = pointGeo.vertices[index];
            prevIndex = index;
        }
        return pointVertex;
    }

    this.instantiate = function () {
        let num = 0;

        for (let i = 0; i < munyuNum; i++) {
            const munyu = new Munyu();
            munyus.push(munyu);
            speed.push((Math.random() * 0.005) + 0.001);
            if (num >= colors.length -1){
                num = 0;
            }
            munyuColors.push(colors[num]);
            num ++;
        }
        return munyus;
    }

    this.getPos = function () {
        return pointVertex;
    }

    this.targetPos = function () {
        let randomVertex = getRandomPos();
        return randomVertex;
    }

    this.getSpeed = function () {
        return speed;
    }

    this.getColor = function () {
        return munyuColors;
    }
}
