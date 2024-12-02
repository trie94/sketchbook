export default function BaseSketch(scene) {
    bindEventListeners();
    start();
    update();

    function bindEventListeners() {
        window.onresize = resizeCanvas;
        window.addEventListener("click", mouseClick);
        window.addEventListener("keyup", keyUp);
        resizeCanvas();
    }

    function resizeCanvas() {
        canvas.style.width = window.innerWidth;
        canvas.style.height = window.innerHeight;
        scene.onWindowResize();
    }

    function mouseClick(e) {
        scene.onMouseClick(e);
    }

    function keyUp(e) {
        scene.onKeyUp(e);
    }

    function start() {
        scene.start();
    }

    function update() {
        requestAnimationFrame(update);
        scene.update();
    }
}