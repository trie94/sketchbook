(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ "./BaseSketch.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = BaseSketch;
function BaseSketch(scene) {
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

/***/ }),

/***/ "./sketch8/Scene.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Scene;

var _icecaticon = __webpack_require__("./sketch8/icecaticon216.png");

var _icecaticon2 = _interopRequireDefault(_icecaticon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Scene(canvas) {
    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth;

    var videoWrapper = document.createElement("div");
    var iframe = document.createElement("iframe");
    var gameHref = document.createElement("a");
    var gameIcon = document.createElement("img");
    var text = document.createElement("p");
    var iconWrapper = document.createElement("div");
    var gameLink = "https://drive.google.com/drive/u/0/folders/1mRQQlGuRYYVI8jx6ppnvOFs_dKKrJbVJ";

    this.start = function () {
        var root = document.getElementById('root');

        // video
        iframe.width = WIDTH;
        iframe.height = HEIGHT;
        iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/zq8yO3mudMk" + "?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0&autoplay=1&loop=1&playlist=zq8yO3mudMk");
        iframe.style.margin = 0;
        iframe.allowFullscreen = false;
        iframe.allow = "autoplay";
        iframe.frameBorder = 0;

        // button with a link
        gameHref.href = gameLink;
        gameHref.target = "_blank";
        gameHref.style.width = "auto";
        gameHref.style.marginTop = "2em";
        gameHref.style.marginBottom = 0;
        gameHref.style.display = "block";
        gameHref.style.textAlign = "center";

        gameIcon.src = _icecaticon2.default;
        gameIcon.setAttribute("width", "100px");
        gameHref.onmouseover = function () {
            gameIcon.style.opacity = 0.5;
        };
        gameHref.onmouseout = function () {
            gameIcon.style.opacity = 1;
        };

        gameHref.appendChild(gameIcon);
        text.innerHTML = "Download Ice Cat";
        text.style.margin = 0;
        text.style.paddingBottom = "1em";
        gameHref.appendChild(text);

        // button wrapper
        iconWrapper.style.display = "flex";
        iconWrapper.style.alignItems = "center";
        iconWrapper.style.justifyContent = "center";

        // video wrapper
        videoWrapper.setAttribute("position", "relative");
        videoWrapper.style.display = "flex";
        videoWrapper.style.alignItems = "center";
        videoWrapper.style.justifyContent = "center";

        // layout
        root.insertBefore(videoWrapper, canvas);
        videoWrapper.appendChild(iframe);
        // videoWrapper.appendChild(video);
        root.insertBefore(iconWrapper, videoWrapper);
        iconWrapper.appendChild(gameHref);
        // make background black
        root.style.background = "black";
    };

    this.update = function () {};

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        iframe.width = WIDTH;
        iframe.height = HEIGHT;
    };

    this.onMouseClick = function () {};
}

/***/ }),

/***/ "./sketch8/icecaticon216.png":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "sketch8/icecaticon216.png";

/***/ }),

/***/ "./sketch8/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Sketch8;

var _Scene = __webpack_require__("./sketch8/Scene.js");

var _Scene2 = _interopRequireDefault(_Scene);

var _BaseSketch = __webpack_require__("./BaseSketch.js");

var _BaseSketch2 = _interopRequireDefault(_BaseSketch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Sketch8() {
    var canvas = document.getElementById('canvas');
    var scene = new _Scene2.default(canvas);
    Sketch8.prototype = new _BaseSketch2.default(scene);
}

/***/ })

}]);
//# sourceMappingURL=sketch8.js.map