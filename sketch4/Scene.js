import * as Two from 'two.js';
// import Blob from './blob';

export default function Scene(canvas) {

    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;
    let time = Date.now();

    let two = new Two.default({
        width: WIDTH,
        height: HEIGHT,
        domElement: canvas
    });

    let rect = two.makeRectangle(WIDTH / 2, HEIGHT / 2, WIDTH / 3, HEIGHT / 3);
    rect.fill = 'rgb(255, 100, 100)';
    rect.noStroke();

    this.start = function () {
        two.render();
    }

    this.update = function () {
    }

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        canvas.innerWidth = WIDTH;
        canvas.innerHeight = HEIGHT;

        two.width = WIDTH;
        two.height = HEIGHT;
        
        rect.translation.set(WIDTH / 2, HEIGHT / 2);
        two.renderer.setSize(WIDTH, HEIGHT);
        two.render();
    }

    this.onMouseClick = function () {
        console.log("on mouse click");
    }
}