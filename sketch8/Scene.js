import icon from './icecaticon216.png';

export default function Scene(canvas) {
    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    const videoWrapper = document.createElement("div");
    const iframe = document.createElement("iframe");
    const gameHref = document.createElement("a");
    const gameIcon = document.createElement("img");
    const text = document.createElement("p");
    const iconWrapper = document.createElement("div");
    const gameLink = "https://drive.google.com/drive/u/0/folders/1mRQQlGuRYYVI8jx6ppnvOFs_dKKrJbVJ";

    this.start = function () {
        const root = document.getElementById('root');

        // video
        iframe.width = WIDTH;
        iframe.height = HEIGHT;
        iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/zq8yO3mudMk"
        +"?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0&autoplay=1&loop=1&playlist=zq8yO3mudMk");
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

        gameIcon.src = icon;
        gameIcon.setAttribute("width", "100px");
        gameHref.onmouseover = function() {
            gameIcon.style.opacity = 0.5;
        }
        gameHref.onmouseout = function() {
            gameIcon.style.opacity = 1;            
        }

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
    }

    this.update = function () {
    }

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        iframe.width = WIDTH;
        iframe.height = HEIGHT;
    }

    this.onMouseClick = function () {
    }
}