import { assert } from "console";
import type P5 from "p5";

export class GridNode {
    private _gCost = -1;
    private _hCost = -1;
    private _type = NodeType.EMPTY;

    constructor(readonly x: number, readonly y: number) {}

    makeStart() {
        this._type = NodeType.START;
        this._gCost = 0;
    }

    makeEnd() {
        this._type = NodeType.END;
    }

    makeWall() {
        this._type = NodeType.WALL;
    }

    isStart() {
        return this._type === NodeType.START;
    }

    isEnd() {
        return this._type === NodeType.END;
    }

    isWall() {
        return this._type === NodeType.WALL;
    }

    isEmpty() {
        return this._type === NodeType.EMPTY;
    }

    isChecked() {
        return this._type === NodeType.CHECKED;
    }

    isPotential() {
        return this._type === NodeType.POTENTIAL;
    }

    givesBetterGCostWith(prevNode: GridNode) {
        return this._gCost > prevNode._gCost + 1;
    }

    // Using manhattan distance because we will only move to the sides
    makePotential(prevNode: GridNode, end: GridNode) {
        this.calculateGCost(prevNode);
        this._hCost = this.distanceTo(end);
        this._type = NodeType.POTENTIAL;
    }

    makeChecked() {
        console.assert(this._type === NodeType.POTENTIAL);

        this._type = NodeType.CHECKED;
    }

    makeSelected() {
        console.assert(this._type === NodeType.CHECKED);

        this._type = NodeType.SELECTED;
    }

    distanceTo(node: GridNode) {
        const minDiff = Math.min(
            Math.abs(node.x - this.x),
            Math.abs(node.y - this.y)
        );
        const maxDiff = Math.max(
            Math.abs(node.x - this.x),
            Math.abs(node.y - this.y)
        );

        // Every sideways move is counted as 10
        // Every diagonal move is counted as 14
        return minDiff * 14 + (maxDiff - minDiff) * 10;
    }

    calculateGCost(prevNode: GridNode) {
        // Diagonal movement should produce a longer path
        const add = this.distanceTo(prevNode);

        if (this._gCost === -1 || this._gCost > prevNode._gCost + add)
            this._gCost = prevNode._gCost + add;
    }

    get gCost() {
        return this._gCost;
    }

    get hCost() {
        return this._hCost;
    }

    get fCost() {
        return this._gCost + this._hCost;
    }

    render(p5: P5, delta: number, nodeSize: number) {
        p5.push();

        p5.translate(this.x * nodeSize, this.y * nodeSize);

        if (this._type === NodeType.EMPTY) {
            p5.fill(0, 0);
            p5.stroke(255, 255, 255, 255);
            p5.rect(0, 0, nodeSize, nodeSize);
        } else if (this._type === NodeType.START) {
            p5.fill("#22dd22");
            p5.stroke(255, 255, 255, 255);
            p5.rect(0, 0, nodeSize, nodeSize);

            p5.fill(0, 0, 0, 255);
            p5.stroke(0, 0);

            p5.textFont("sans-serif");
            p5.textSize(11);

            const tw = p5.textWidth("START");

            p5.text("START", nodeSize / 2 - tw / 2, nodeSize / 2 + 5);
        } else if (this._type === NodeType.END) {
            p5.fill("#22dd22");
            p5.stroke(255, 255, 255, 255);
            p5.rect(0, 0, nodeSize, nodeSize);

            p5.fill(0, 0, 0, 255);
            p5.stroke(0, 0);

            p5.textFont("sans-serif");
            p5.textSize(11);

            const tw = p5.textWidth("END");

            p5.text("END", nodeSize / 2 - tw / 2, nodeSize / 2 + 5);
        } else if (this._type === NodeType.WALL) {
            p5.fill("#fff");
            p5.stroke(255, 255, 255, 255);
            p5.rect(0, 0, nodeSize, nodeSize);
        } else {
            if (this._type === NodeType.POTENTIAL) p5.fill("#4444dd");
            else if (this._type === NodeType.CHECKED) p5.fill("#dd2222");
            else if (this._type === NodeType.SELECTED) p5.fill("#22dd22");
            p5.stroke(255, 255, 255, 255);
            p5.rect(0, 0, nodeSize, nodeSize);

            p5.fill(0, 0, 0, 255);
            p5.stroke(0, 0);

            p5.textFont("sans-serif");
            p5.textSize(11);

            let tw = p5.textWidth(this._gCost + "");
            p5.text(this._gCost + "", 2, 11 + 2);

            tw = p5.textWidth(this._hCost + "");
            p5.text(this._hCost + "", nodeSize - tw - 2, 11 + 2);

            tw = p5.textWidth(this.fCost + "");
            p5.text(this.fCost + "", nodeSize / 2 - tw / 2, nodeSize / 2 + 5);
        }

        p5.pop();
    }
}

enum NodeType {
    START,
    END,
    EMPTY,
    CHECKED,
    SELECTED,
    POTENTIAL,
    WALL,
}
