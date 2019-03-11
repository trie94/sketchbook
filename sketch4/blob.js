import Two from 'two.js';
import * as Matter from 'matter-js';

export default function Blob() {
    console.log("blob!");

    let radius = 10;

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
        engine: engine
    });

    // create two boxes and a ground
    let boxA = Bodies.rectangle(400, 200, 80, 80);
    let boxB = Bodies.rectangle(450, 50, 80, 80);
    let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, ground]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

}