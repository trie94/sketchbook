import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import Scene from './Scene';

export default function Sketch4() {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    const root = document.getElementById('root');
    root.appendChild(canvas);
    const scene = new Scene(canvas);

    bindEventListeners();
    start();
    update();

    function bindEventListeners() {
        window.onresize = resizeCanvas;
        window.onclick = mouseClick;
        resizeCanvas();
    }

    function resizeCanvas() {
        canvas.style.width = window.innerWidth;
        canvas.style.height = window.innerHeight;
        scene.onWindowResize();
    }

    function mouseClick() {
        scene.onMouseClick();
    }

    function start() {
        scene.start();
    }

    function update() {
        requestAnimationFrame(update);
        scene.update();
    }
}