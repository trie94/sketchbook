import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch5() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch5.prototype = new BaseSketch(scene);
}