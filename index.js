import './style.scss';

if (process.env.NODE_ENV !== 'production') { console.log("dev mode"); }
let basename = process.env.NODE_ENV == 'production' ? "/sketchbook" : "/";

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
listSketches();

// get sketch
const sketches = {
    sketch1: () => import(/* webpackChunkName: "sketch1" */ "./sketches/sketch1"),
    sketch4: () => import(/* webpackChunkName: "sketch1" */ "./sketches/sketch4")
};

let sketchName = window.location.pathname.substring(1);
let sketch = sketches[sketchName];

// initialize scene
// location.reload();

if (sketch) {
    sketch().then(
        result => result.default(),
        error => console.log(error)
    );
}

function listSketches() {
    const sketch1 = document.createElement('a');
    root.appendChild(sketch1);
    sketch1.setAttribute('href', "/sketch1");
    sketch1.innerHTML = "/sketch1";

    const sketch2 = document.createElement('a');
    root.appendChild(sketch2);
    sketch2.setAttribute('href', "/sketch4");
    sketch2.innerHTML = "/sketch4";
}