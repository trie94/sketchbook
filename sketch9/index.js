import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch9() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch9.prototype = new BaseSketch(scene);
}