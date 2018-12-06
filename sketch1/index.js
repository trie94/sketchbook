import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch1() {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    const root = document.getElementById('root');
    root.appendChild(canvas);

    const scene = new Scene(canvas);
    Sketch1.prototype = new BaseSketch(scene);
}