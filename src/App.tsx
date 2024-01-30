import Sketch from "react-p5";
import type P5 from "p5";
import { Grid } from "./lib/Grid";

let init = false;

let lastTime: number;
let now: number;

let canvas: P5.Renderer;

let grid: Grid;

function render(p5: P5, delta: number) {
    p5.push();
    grid.render(p5, delta);
    p5.pop();
}

// HACK: For some reason it ticks twice when mouse clicked in development
let allowTick = true;

function tick() {
    if (!allowTick) {
        allowTick = true;
        return;
    }
    if (process.env.NODE_ENV === "development") allowTick = false;

    for (let i = 0; i < 20; i++) {
        grid?.tick();
    }
}

export default function App() {
    lastTime = Date.now();

    const setup = (p5: P5, parent: Element) => {
        // To avoid double initialization in development
        if (init) return;
        init = true;

        canvas = p5
            .createCanvas(p5.windowWidth, p5.windowHeight)
            .position(0, 0)
            .parent(parent);

        grid = new Grid(40);
    };

    const draw = (p5: P5) => {
        p5.clear();
        p5.background(0);

        now = Date.now();
        render(p5, (now - lastTime) / 1000);
        lastTime = now;
    };

    return <Sketch setup={setup} draw={draw} mouseClicked={tick}></Sketch>;
}
