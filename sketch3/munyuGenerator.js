import * as THREE from 'three';
import Munyu from './Munyu';

export default function MunyuGenerator() {

    let munyus = [];
    let pointVertex = [];
    let speed = [];
    let munyuColors = [];
    const munyuNum = 5;
    // const colors = [0xc36251, 0xc1c351, 0x51c39e, 0x5058c4, 0xa750c4, 0x80c450];
    const colors = [0xc38651, 0xc1c351, 0x51c39e, 0x80c450, 0x3bc6bd];
    let munyuObjArr = [];

    const config = {
        height: 50,
        width: 130,
        radius: 20
    };

    this.instantiate = function () {
        let num = 0;

        for (let i = 0; i < munyuNum; i++) {
            const munyu = new Munyu();

            speed.push((Math.random() * 0.005) + 0.001);
            if (num > colors.length - 1) {
                num = 0;
            }

            let xPos;
            let yPos;
            let valid = false;
            let maxIterations = 10;
            let curIterations = 0;

            do {
                xPos = (Math.random() - 0.5) * config.width;
                yPos = (Math.random() - 0.5) * config.height;

                valid = true;

                for (let i = 0; i < munyuObjArr.length; i++) {
                    let otherPos = munyuObjArr[i].position;
                    let dist = ((xPos - otherPos.x) * (xPos - otherPos.x)) + ((yPos - otherPos.z) * (yPos - otherPos.z));
                    // console.log(dist);

                    if (dist < config.radius * config.radius) {
                        valid = false;
                        // console.log("collision");
                        break;
                    }
                }
                curIterations++;

            } while (!valid && curIterations < maxIterations);

            munyus.push(munyu);
            munyuObjArr.push(munyus[i].getMunyu(xPos, 0, yPos, colors[num]));
            num++;
        }
        return munyuObjArr;
    }

    this.idle = function () {
        for (let i = 0; i < munyus.length; i++) {
            munyus[i].idle(speed[i]);
        }
    }

    this.playSound = function () {
        munyus[0].getListener();
        let randomNum = Math.floor(Math.random() * 10);
        // console.log(randomNum);
        if (randomNum % 2 == 0) {
            munyus[0].playMunyu();
        } else {
            munyus[0].playAmazingu();
        }
    }

    this.getColor = function () {
        return munyuColors;
    }
}
