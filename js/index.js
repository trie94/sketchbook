import './../style.scss';
import Scene from './Scene';

if (process.env.NODE_ENV !== 'production') { console.log("dev mode"); }
let basename = process.env.NODE_ENV == 'production' ? "/rest-your-mind" : "/";

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        const oldRootElem = document.querySelector('body');
        const newRootElem = oldRootElem.cloneNode(false);
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        oldRootElem.parentNode.removeChild(oldRootElem);
    });
} else {
    enableProdMode();
}

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
	canvas.style.height= window.innerHeight;
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