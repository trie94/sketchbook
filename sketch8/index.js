import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch8() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch8.prototype = new BaseSketch(scene);
}