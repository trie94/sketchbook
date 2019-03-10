import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch4() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch4.prototype = new BaseSketch(scene);
}