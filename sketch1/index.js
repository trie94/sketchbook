import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch1() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch1.prototype = new BaseSketch(scene);
}