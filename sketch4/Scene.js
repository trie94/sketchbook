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
    let outerRadius = radius + 30;
    let pointsNum = 8;
    // two
    let anchors = [];

    let centerBody;
    let anchorBodies = [];
    let anchorOuterBodies = [];
    let blob;
    let blobFace;
    let blobLeftEye;
    let blobRightEye;
    let blobMouth;
    let blobGrad;

    let blobColor = {
        bodyGreen: "#a4dfcd",
        bodyBlue: "#9bd0dd",
        face: "#edffff"
    }
    let bubbles = [];

    let two = new Two({
        width: WIDTH,
        height: HEIGHT,
        domElement: canvas
    });

    // module aliases
    let Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create an engine
    let engine = Engine.create();

    // create a renderer
    let render = Render.create({
        element: document.body,
        canvas: canvas,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT,
            // hasBounds: true
        }
    });
    Render.setPixelRatio(render, "auto");

    function initBlob() {
        let ground = Bodies.rectangle(centerX, HEIGHT, WIDTH, 50, { isStatic: true });
        let ceiling = Bodies.rectangle(centerX, 0, WIDTH, 50, { isStatic: true });
        let leftwall = Bodies.rectangle(0, centerY, 50, HEIGHT, { isStatic: true });
        let rightwall = Bodies.rectangle(WIDTH, centerY, 50, HEIGHT, { isStatic: true });
        centerBody = Bodies.circle(centerX, centerY, 1);
        let dTheta = Math.PI * 2 / pointsNum;

        let centerToInner = {
            stiffness: 0.001,
            damping: 0.05
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
            stiffness: 0.7,
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
            anchors.push(anchor);

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
        World.add(engine.world, [centerBody, ...anchorBodies, ...anchorOuterBodies, ground, ceiling, leftwall, rightwall]);
        // engine.world.gravity.scale = 0;

        blobGrad = new Two.RadialGradient(
            0, 0,
            outerRadius,
            [new Two.Stop(0, blobColor.bodyGreen, 1),
            new Two.Stop(0.7, blobColor.bodyGreen, 1),
            new Two.Stop(1, blobColor.bodyBlue, 1)]
        );

        blob = two.makeCurve(anchors);
        blob.fill = blobGrad;
        blob.noStroke();

        blobFace = two.makeEllipse(centerBody.position.x, centerBody.position.y, 30, 25);
        blobFace.fill = blobColor.face;
        blobFace.noStroke();

        blobLeftEye = two.makeRoundedRectangle(centerBody.position.x - 10, centerBody.position.y, 6, 6, 3);
        blobLeftEye.fill = blobColor.bodyGreen;
        blobLeftEye.noStroke();

        blobRightEye = two.makeRoundedRectangle(centerBody.position.x + 10, centerBody.position.y, 6, 6, 3);
        blobRightEye.fill = blobColor.bodyGreen;
        blobRightEye.noStroke();

        blobMouth = two.makeRoundedRectangle(centerBody.position.x, centerBody.position.y + 4, 10, 10, 5);
        blobMouth.fill = blobColor.bodyGreen;
        blobMouth.noStroke();
    }

    function getBubbles(bubbleNum) {
        for (let i = 0; i < bubbleNum; i++) {
            let bubble = two.makeCircle();
            bubble.noStroke();
        }
    }

    this.start = function () {
        initBlob();
        two.update();
        Engine.run(engine);
        // Render.run(render);
    }

    this.update = function () {
        let centerPos = {
            x: centerBody.position.x,
            y: centerBody.position.y,
        };
        blob.translation.set(centerPos.x, centerPos.y);
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].x = anchorOuterBodies[i].position.x - centerPos.x;
            anchors[i].y = anchorOuterBodies[i].position.y - centerPos.y;
        }

        blobFace.translation.set(centerBody.position.x, centerBody.position.y);
        blobLeftEye.translation.set(centerBody.position.x - 10, centerBody.position.y);
        blobRightEye.translation.set(centerBody.position.x + 10, centerBody.position.y);
        blobMouth.translation.set(centerBody.position.x, centerBody.position.y + 3);
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

    this.onMouseClick = function () {
        console.log("on mouse click");
    }
}