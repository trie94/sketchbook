import Two from 'two.js';
import * as Matter from 'matter-js';
// import Blob from './blob';

export default function Scene(canvas) {

    let HEIGHT = window.innerHeight;
    let WIDTH = window.innerWidth;

    let time = Date.now();

    let centerX = WIDTH / 2;
    let centerY = HEIGHT / 2;
    let radius = 100;
    let outerRadius = radius + 10;
    let pointsNum = 24;
    // two
    let anchors = [];
    let anchorOffset = 8;
    let anchorOffsets = [];

    let faceBody;
    let centerBody;
    let anchorBodies = [];
    let anchorOuterBodies = [];
    let smallBodies = [];
    let stuffList = [];

    let blob;
    let blobShadow;
    let blobFace;
    let blobLeftEye;
    let blobRightEye;
    let blobMouth;
    let blobGrad;

    let bubbles = [];
    let bubbleRenderTimer = 2;

    let blink = 0;
    let nomnom = 0;

    let tick = 1;

    let blobColor = {
        bodyGreen: "#a4dfcd",
        bodyBlue: "#9bd0dd",
        face: "#edffff"
    }

    let confettiColor = ["#aec3df", "#e4c6c3", "#d1b0df", "#d0e0ae"];
    let confettis = [];

    let two = new Two({
        width: WIDTH,
        height: HEIGHT,
        domElement: canvas
    });

    canvas.setAttribute("style", "background-color: #eaece6;");

    // module aliases
    let Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create an engine
    let engine = Engine.create();

    // create a renderer
    let render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT,
            hasBounds: true
        }
    });

    Render.setPixelRatio(render, "auto");

    function initBlob() {
        faceBody = Bodies.circle(centerX, centerY, 30);
        faceBody.mass = 7;
        faceBody.collisionFilter.mask = 1;
        faceBody.collisionFilter.category = 1;
        centerBody = Bodies.circle(centerX, centerY, 1);
        centerBody.collisionFilter.category = 2;

        for (let i = 0; i < 10; i++) {
            let radius = Math.floor(Math.random() * 5) + 15;
            let smallBody = Bodies.circle(centerX, centerY, radius);
            smallBody.mass = 3;
            smallBody.collisionFilter.mask = 5;
            smallBody.collisionFilter.category = 4;
            smallBodies.push(smallBody);
        }

        let dTheta = Math.PI * 2 / pointsNum;

        let centerToInner = {
            stiffness: 0.0001,
            damping: 0.03
        }

        let innerNeighbors = {
            length: Math.sin(dTheta / 2) * radius * 2,
            stiffness: 0.7,
            damping: 0.05
        }

        let outerNeighbors = {
            length: Math.sin(dTheta / 2) * outerRadius * 2,
            stiffness: 0.7,
            damping: 0.05
        }

        let x = centerX + radius * Math.cos(0);
        let y = centerY + radius * Math.sin(0);
        let theta = Math.PI * 2 * 1 / pointsNum;
        let outerX = centerX + outerRadius * Math.cos(theta);
        let outerY = centerY + outerRadius * Math.sin(theta);

        let innerToOuter = {
            length: Math.sqrt((outerX - x) * (outerX - x) + (outerY - y) * (outerY - y)),
            stiffness: 0.9,
            damping: 0.05
        }

        for (let i = 0; i < pointsNum; i++) {
            let theta = Math.PI * 2 * i / pointsNum;
            let x = centerX + radius * Math.cos(theta);
            let y = centerY + radius * Math.sin(theta);

            // inner
            let anchorBody = Bodies.circle(x, y, 3, { density: 0.001 });
            let constraint = Matter.Constraint.create({
                bodyA: centerBody,
                bodyB: anchorBody,
                length: radius,
                stiffness: centerToInner.stiffness,
                damping: centerToInner.damping
            });
            World.add(engine.world, constraint);
            anchorBodies.push(anchorBody);

            // outer
            let outerX = centerX + outerRadius * Math.cos(theta);
            let outerY = centerY + outerRadius * Math.sin(theta);
            let anchor = new Two.Anchor(outerX, outerY, 0, 0, 0, 0, "l");
            let anchorOffset = new Two.Anchor(outerX + anchorOffset, outerY + anchorOffset, 0, 0, 0, 0, "l");
            anchors.push(anchor);
            anchorOffsets.push(anchorOffset)

            let anchorOuterBody = Bodies.circle(outerX, outerY, 3);
            let outerConstraint = Matter.Constraint.create({
                bodyA: anchorBody,
                bodyB: anchorOuterBody,
                length: outerRadius - radius,
                stiffness: innerToOuter.stiffness,
                damping: innerToOuter.damping
            });

            World.add(engine.world, outerConstraint);
            anchorOuterBodies.push(anchorOuterBody);

            if (i !== 0) {
                let neighborConstraint = Matter.Constraint.create({
                    bodyA: anchorBodies[i - 1],
                    bodyB: anchorBody,
                    length: innerNeighbors.length,
                    stiffness: innerNeighbors.stiffness,
                    damping: innerNeighbors.damping
                });
                let outerNeighborConstraint = Matter.Constraint.create({
                    bodyA: anchorOuterBodies[i - 1],
                    bodyB: anchorOuterBody,
                    length: outerNeighbors.length,
                    stiffness: outerNeighbors.stiffness,
                    damping: outerNeighbors.damping
                });
                let innerOuterConstraint = Matter.Constraint.create({
                    bodyA: anchorBodies[i - 1],
                    bodyB: anchorOuterBody,
                    length: innerToOuter.length,
                    stiffness: outerNeighbors.stiffness,
                    damping: outerNeighbors.damping
                });
                World.add(engine.world, [neighborConstraint, outerNeighborConstraint, innerOuterConstraint]);

                if (i === pointsNum - 1) {
                    let neighborConstraint = Matter.Constraint.create({
                        bodyA: anchorBody,
                        bodyB: anchorBodies[0],
                        length: innerNeighbors.length,
                        stiffness: innerNeighbors.stiffness,
                        damping: innerNeighbors.damping
                    });
                    let outerNeighborConstraint = Matter.Constraint.create({
                        bodyA: anchorOuterBody,
                        bodyB: anchorOuterBodies[0],
                        length: outerNeighbors.length,
                        stiffness: outerNeighbors.stiffness,
                        damping: outerNeighbors.damping
                    });
                    let innerOuterConstraint = Matter.Constraint.create({
                        bodyA: anchorBody,
                        bodyB: anchorOuterBodies[0],
                        length: innerToOuter.length,
                        stiffness: outerNeighbors.stiffness,
                        damping: outerNeighbors.damping
                    });
                    World.add(engine.world, [neighborConstraint, outerNeighborConstraint, innerOuterConstraint]);
                }
            }
        }
        World.add(engine.world, [faceBody, ...smallBodies, centerBody, ...anchorBodies, ...anchorOuterBodies]);
        engine.world.gravity.scale = 0;

        blobGrad = new Two.RadialGradient(
            0, 0,
            outerRadius,
            [new Two.Stop(0, blobColor.bodyGreen, 1),
            new Two.Stop(0.7, blobColor.bodyGreen, 1),
            new Two.Stop(1, blobColor.bodyBlue, 1)]
        );

        blobShadow = two.makeCurve(anchorOffsets);
        blobShadow.fill = "#ccd0c3";
        blobShadow.opacity = 0.5;
        blobShadow.noStroke();

        addObstacles();

        blob = two.makeCurve(anchors);
        blob.fill = blobGrad;
        blob.noStroke();


        blobFace = two.makeEllipse(faceBody.position.x, faceBody.position.y, 30, 25);
        blobFace.fill = blobColor.face;
        blobFace.noStroke();

        blobLeftEye = two.makeRoundedRectangle(faceBody.position.x - 10, faceBody.position.y, 6, 6, 3);
        blobLeftEye.fill = blobColor.bodyGreen;
        blobLeftEye.noStroke();

        blobRightEye = two.makeRoundedRectangle(faceBody.position.x + 10, faceBody.position.y, 6, 6, 3);
        blobRightEye.fill = blobColor.bodyGreen;
        blobRightEye.noStroke();

        blobMouth = two.makeRoundedRectangle(faceBody.position.x, faceBody.position.y + 4, 10, 10, 5);
        blobMouth.fill = blobColor.bodyGreen;
        blobMouth.noStroke();

        // bubbles 
        for (let i = 0; i < 3; i++) {
            let size = Math.floor(Math.random() * 5) + 3;
            bubbles[i] = two.makeCircle(smallBodies[i].position.x, smallBodies[i].position.y, size).noStroke();
            bubbles[i].opacity = 0.45;
        }
    }

    function addObstacles() {
        let ground = Bodies.rectangle(centerX, HEIGHT, WIDTH, 50, { isStatic: true });
        let ceiling = Bodies.rectangle(centerX, 0, WIDTH, 50, { isStatic: true });
        let leftwall = Bodies.rectangle(0, centerY, 50, HEIGHT, { isStatic: true });
        let rightwall = Bodies.rectangle(WIDTH, centerY, 50, HEIGHT, { isStatic: true });
        let sizeMultiplier = WIDTH / 100;

        let stuff = Bodies.circle(WIDTH * 3 / 4, HEIGHT * 1 / 4, 5 * sizeMultiplier, { isStatic: true });
        let stuff2 = Bodies.circle(WIDTH * 1 / 4, HEIGHT * 3 / 4, 7 * sizeMultiplier, { isStatic: true });
        let stuff3 = Bodies.circle(WIDTH * 7 / 11, HEIGHT * 4 / 5, 8 * sizeMultiplier, { isStatic: true });
        let stuff4 = Bodies.circle(WIDTH * 5 / 6, HEIGHT * 1 / 2, 6 * sizeMultiplier, { isStatic: true });
        let stuff5 = Bodies.circle(WIDTH * 4 / 11, HEIGHT * 1 / 4, 6 * sizeMultiplier, { isStatic: true });
        let stuff6 = Bodies.circle(WIDTH * 1 / 7, HEIGHT * 3 / 7, 5 * sizeMultiplier, { isStatic: true });

        stuffList.push(stuff);
        stuffList.push(stuff2);
        stuffList.push(stuff3);
        stuffList.push(stuff4);
        stuffList.push(stuff5);
        stuffList.push(stuff6);

        World.add(engine.world, [...stuffList]);

        // shadow
        let offset = 6;
        let s1 = two.makeCircle(stuff.position.x + offset, stuff.position.y + offset, 5 * sizeMultiplier).noStroke();
        s1.fill = "#d5d8cf";

        let s2 = two.makeCircle(stuff2.position.x + offset, stuff2.position.y + offset, 7 * sizeMultiplier).noStroke();
        s2.fill = "#d5d8cf";

        let s3 = two.makeCircle(stuff3.position.x + offset, stuff3.position.y + offset, 8 * sizeMultiplier).noStroke();
        s3.fill = "#d5d8cf";

        let s4 = two.makeCircle(stuff4.position.x + offset, stuff4.position.y + offset, 6 * sizeMultiplier).noStroke();
        s4.fill = "#d5d8cf";

        let s5 = two.makeCircle(stuff5.position.x + offset, stuff5.position.y + offset, 6 * sizeMultiplier).noStroke();
        s5.fill = "#d5d8cf";

        let s6 = two.makeCircle(stuff6.position.x + offset, stuff6.position.y + offset, 5 * sizeMultiplier).noStroke();
        s6.fill = "#d5d8cf";

        // pillars
        two.makeCircle(stuff.position.x, stuff.position.y, 5 * sizeMultiplier).noStroke();
        two.makeCircle(stuff2.position.x, stuff2.position.y, 7 * sizeMultiplier).noStroke();
        two.makeCircle(stuff3.position.x, stuff3.position.y, 8 * sizeMultiplier).noStroke();
        two.makeCircle(stuff4.position.x, stuff4.position.y, 6 * sizeMultiplier).noStroke();
        two.makeCircle(stuff5.position.x, stuff5.position.y, 6 * sizeMultiplier).noStroke();
        two.makeCircle(stuff6.position.x, stuff6.position.y, 5 * sizeMultiplier).noStroke();
    }

    function makeConfetti(x, y) {
        let num = Math.floor(Math.random() * 5) + 3;
        let confettiGroup = [];

        for (let i = 0; i < num; i++) {
            let size = Math.floor(Math.random() * 10) + 3;
            let offsetX = Math.floor(Math.random() * 20) - 20;
            let offsetY = Math.floor(Math.random() * 20) - 20;
            let positionX = x + offsetX;
            let positionY = y + offsetY;
            let confetti = two.makeRectangle(positionX, positionY, size, size);
            confetti.rotation = Math.floor(Math.random() * 360);
            confetti.noStroke();
            confetti.fill = confettiColor[i % confettiColor.length];
            confettiGroup.push(confetti);
        }
        confettis.push(confettiGroup);
    }

    function followConfetti(myBody, targetX, targetY) {
        let targetPosition = Matter.Vector.create(targetX, targetY);
        let targetAngle = Matter.Vector.angle(myBody.position, targetPosition);
        let force = 0.001;

        Matter.Body.applyForce(myBody, myBody.position, {
            x: Math.cos(targetAngle) * force,
            y: Math.sin(targetAngle) * force
        });
    }

    function moveSmallBodies() {
        let force = 0.001;
        for (let i = 0; i < smallBodies.length; i++) {
            let random = Math.random() * Math.PI * 2;
            Matter.Body.applyForce(smallBodies[i], smallBodies[i].position, {
                x: Math.cos(random) * force,
                y: Math.sin(random) * force
            });
        }
    }

    function moveFace() {
        let force = 0.001;
        let random = Math.random() * Math.PI * 2;
        Matter.Body.applyForce(faceBody, faceBody.position, {
            x: Math.cos(random) * force,
            y: Math.sin(random) * force
        });
    }

    function animateFace() {
        blobLeftEye.height = Math.cos(blink) * 1 + 5;
        // blobLeftEye.width = Math.cos(blink) * 1 + 5;

        blobRightEye.height = Math.cos(blink) * 1 + 5;
        // blobRightEye.width = Math.cos(blink) * 1 + 5;

        if (confettis.length > 0) {
            blobMouth.height = Math.sin(nomnom) * 2 + 10;
        } else {
            blobMouth.height = 10;
        }

        blobFace.width = Math.cos(blink) * 1 + 50;
        blobFace.height = Math.cos(blink) * 1 + 45;

        blink += 0.03;
    }

    this.start = function () {
        initBlob();
        Engine.run(engine);
        // Render.run(render);
    }

    this.update = function () {
        let centerPos = {
            x: centerBody.position.x,
            y: centerBody.position.y,
        };

        blob.translation.set(centerPos.x, centerPos.y);
        blobShadow.translation.set(centerPos.x, centerPos.y);

        for (let i = 0; i < anchors.length; i++) {
            anchors[i].x = anchorOuterBodies[i].position.x - centerPos.x;
            anchors[i].y = anchorOuterBodies[i].position.y - centerPos.y;

            anchorOffsets[i].x = anchors[i].x + anchorOffset;
            anchorOffsets[i].y = anchors[i].y + anchorOffset;
        }

        blobGrad.focal.set(
            faceBody.position.x - centerPos.x,
            faceBody.position.y - centerPos.y
        ).multiply(0.1);

        blobFace.translation.set(faceBody.position.x, faceBody.position.y);
        blobLeftEye.translation.set(faceBody.position.x - 10, faceBody.position.y);
        blobRightEye.translation.set(faceBody.position.x + 10, faceBody.position.y);
        blobMouth.translation.set(faceBody.position.x, faceBody.position.y + 3);

        for (let i = 0; i < bubbles.length; i++) {
            bubbles[i].translation.set(smallBodies[i].position.x, smallBodies[i].position.y);
        }

        for (let i = 0; i < confettis.length; i++) {
            for (let j = 0; j < confettis[i].length; j++) {
                let conf = confettis[i][j];
                let randomSpeed = Math.random() * 0.05;
                conf.rotation += randomSpeed;
            }
        }

        if (confettis.length > 0) {
            let targetPos = {
                x: confettis[confettis.length - 1][0].translation.x,
                y: confettis[confettis.length - 1][0].translation.y
            };

            followConfetti(faceBody, targetPos.x, targetPos.y);

            let distance = Math.sqrt((faceBody.position.x - targetPos.x) * (faceBody.position.x - targetPos.x) + (faceBody.position.y - targetPos.y) * (faceBody.position.y - targetPos.y));

            if (distance <= 30) {
                if (tick < 0) {
                    let conf = confettis[confettis.length - 1][0];
                    two.remove(conf);
                    confettis[confettis.length - 1].shift();
                    if (confettis[confettis.length - 1].length === 0) {
                        confettis.pop();
                    }
                    tick = 1;
                }
                nomnom++;
            }
            tick -= two.timeDelta * 0.01;
        }

        moveFace();
        animateFace();
        moveSmallBodies();
        two.update();
    }

    this.onWindowResize = function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        canvas.innerWidth = WIDTH;
        canvas.innerHeight = HEIGHT;

        two.width = WIDTH;
        two.height = HEIGHT;

        render.width = WIDTH;
        render.height = HEIGHT;
        two.update();
    }

    this.onMouseClick = function (e) {
        console.log("on mouse click");
        let x = parseInt(e.clientX);
        let y = parseInt(e.clientY);
        makeConfetti(x, y);
        followConfetti(faceBody, x, y);
    }
}