export default function BaseSketch(scene) {
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