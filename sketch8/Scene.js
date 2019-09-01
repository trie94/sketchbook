export default function Scene(canvas) {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    this.start = function () {
        console.log("start");
        const root = document.getElementById('root');
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://www.youtube.com/embed/qyAws3IVzus?rel=0");

        // The height and width of the iFrame should be the same as parent
        iframe.width = WIDTH;
        iframe.height = HEIGHT;
        root.appendChild(iframe);
        root.insertBefore(iframe, canvas);
        // document.removeChild(canvas);
    }

    this.update = function () {

    }

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        canvas.innerWidth = WIDTH;
        canvas.innerHeight = HEIGHT;

        // camera.aspect = WIDTH / HEIGHT;
        // camera.updateProjectionMatrix();

        // renderer.setSize(WIDTH, HEIGHT);
    }

    this.onMouseClick = function () {
        console.log("click");
        // debug = !debug;
    }
}