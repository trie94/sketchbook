import Scene from './Scene';
import BaseSketch from '../BaseSketch';

export default function Sketch10() {
    const canvas = document.getElementById('canvas');
    const scene = new Scene(canvas);
    Sketch10.prototype = new BaseSketch(scene);
}