import React from "react";
import Sketch from "react-p5";
import type P5 from "p5";

let init = false;

let lastTime: number;
let now: number;

let ox = 0;
let oy = 0;

let canvas: P5.Renderer;

function render(p5: P5, delta: number) {
    p5.push();
    p5.translate(1000 * delta, 0);
    p5.ellipse(0, 0, 50);
    p5.pop();
}

export default function App() {
    lastTime = Date.now();

    const setup = (p5: P5, parent: Element) => {
        // To avoid double initialization
        if (init) return;
        init = true;

        ox = p5.displayWidth / 2;
        oy = p5.displayHeight / 2;

        canvas = p5
            .createCanvas(p5.displayWidth, p5.displayHeight)
            .position(-ox + p5.windowWidth / 2, -oy + p5.windowHeight / 2)
            .parent(parent);
    };

    const draw = (p5: P5) => {
        p5.clear();
        p5.background(0);
        p5.translate(ox, oy);

        p5.ellipse(0, 0, 50);

        now = Date.now();
        render(p5, (now - lastTime) / 1000);
        lastTime = now;

        p5.translate(-ox, -oy);
    };

    return <Sketch setup={setup} draw={draw}></Sketch>;
}
