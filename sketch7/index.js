import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch7() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch7.prototype = new BaseSketch(scene);
}