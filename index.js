import './style.scss';

if (process.env.NODE_ENV !== 'production') { console.log("dev mode"); }
let basename = process.env.NODE_ENV == 'production' ? "/sketchbook/" : "/";

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

const root = document.getElementById('root');
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
root.appendChild(canvas);
init();

// get sketch
const sketches = {
    sketch1: () => import(/* webpackChunkName: "sketch1" */ "./sketch1").then(document.getElementById(sketchName).style.color = "#81d9f9"),
    sketch2: () => import(/* webpackChunkName: "sketch2" */ "./sketch2").then(document.getElementById(sketchName).style.color = "white"),
    sketch3: () => import(/* webpackChunkName: "sketch3" */ "./sketch3").then(document.getElementById(sketchName).style.color = "#635a40"),
    sketch4: () => import(/* webpackChunkName: "sketch4" */ "./sketch4").then(document.getElementById(sketchName).style.color = "#81d9f9"),
    sketch5: () => import(/* webpackChunkName: "sketch5" */ "./sketch5").then(document.getElementById(sketchName).style.color = "white"),
};

let sketchName = window.location.pathname;
sketchName = sketchName.replace(basename, '');
sketchName = sketchName.replace('/', '');
let sketch = sketches[sketchName];

if (sketch) {
    sketch().then(
        result => result.default(),
        error => console.log(error)
    );
} else {
    // default sketch
    sketchName = "sketch5";
    sketches.sketch5().then(
        result => result.default(),
        error => console.log(error)
    );
}

function init() {
    // title
    const title = document.createElement('h4');
    title.innerHTML = "Sketch List";

    let sketchWrapper = document.createElement('div');
    sketchWrapper.classList = "sketch-wrapper";
    root.appendChild(sketchWrapper);
    sketchWrapper.appendChild(title);

    // sketch
    addSketchElem(sketchWrapper, "sketch5", "Jelly cat");
    addSketchElem(sketchWrapper, "sketch4", "Moolang");
    addSketchElem(sketchWrapper, "sketch3", "Munyu");
    addSketchElem(sketchWrapper, "sketch2", "Shell");
    addSketchElem(sketchWrapper, "sketch1", "Iceberg");
}

function addSketchElem(sketchWrapper, sketchFileName, sketchName) {
    let sketch = document.createElement('a');
    sketch.className = "sketch-list";
    sketchWrapper.appendChild(sketch);
    sketch.setAttribute('href', basename + sketchFileName);
    sketch.id = sketchFileName;
    sketch.innerHTML = sketchName;
}