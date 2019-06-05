import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch6() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch6.prototype = new BaseSketch(scene);
}