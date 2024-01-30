import type P5 from "p5";
import { GridNode } from "./GridNode";

export class Grid {
    private nodes: GridNode[] = [];
    private nodeSize = 0;
    private rows = 0;
    private cols = 0;

    private startNode;
    private endNode;

    constructor(cols: number) {
        this.cols = cols;

        this.nodeSize = window.innerWidth / cols;
        this.rows = Math.floor(window.innerHeight / this.nodeSize);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < cols; c++) {
                this.nodes[r * cols + c] = new GridNode(c, r); // col=x and row=y
            }
        }

        this.startNode = this.getNode(1, 4);
        this.endNode = this.getNode(-2, 1);

        this.startNode.makeStart();
        this.endNode.makeEnd();

        this.backtrackCurrent = this.endNode;

        this.checkedNodes.push(this.startNode);

        this.getNode(8, -1).makeWall();
        this.getNode(8, -2).makeWall();
        this.getNode(8, -3).makeWall();
        this.getNode(8, -4).makeWall();
        this.getNode(7, -4).makeWall();
        this.getNode(6, -4).makeWall();
        this.getNode(5, -4).makeWall();

        this.getNode(8, -5).makeWall();
        this.getNode(8, -6).makeWall();
        this.getNode(8, -7).makeWall();
        this.getNode(8, -8).makeWall();
        this.getNode(7, -8).makeWall();
        this.getNode(6, -8).makeWall();
        this.getNode(5, -8).makeWall();

        this.getNode(8, 0).makeWall();
        this.getNode(8, 1).makeWall();
        this.getNode(8, 2).makeWall();
        this.getNode(8, 3).makeWall();
        this.getNode(8, 4).makeWall();
        this.getNode(8, 5).makeWall();
        this.getNode(8, 6).makeWall();
        this.getNode(8, 7).makeWall();
        this.getNode(8, 8).makeWall();
    }

    render(p5: P5, delta: number) {
        for (const node of this.nodes) {
            node.render(p5, delta, this.nodeSize);
        }
    }

    placeWallAt(mouseX: number, mouseY: number) {
        const node = this.getNode(
            Math.floor(mouseX / this.nodeSize),
            Math.floor(mouseY / this.nodeSize)
        );
        node.makeWall();
    }
    placeStartAt(mouseX: number, mouseY: number) {
        this.startNode.makeEmpty();

        const node = this.getNode(
            Math.floor(mouseX / this.nodeSize),
            Math.floor(mouseY / this.nodeSize)
        );
        node.makeStart();

        this.checkedNodes = [];

        this.startNode = node;

        this.checkedNodes.push(node);
    }
    placeEndAt(mouseX: number, mouseY: number) {
        this.endNode.makeEmpty();

        const node = this.getNode(
            Math.floor(mouseX / this.nodeSize),
            Math.floor(mouseY / this.nodeSize)
        );
        node.makeEnd();

        this.endNode = node;
        this.backtrackCurrent = this.endNode;
    }

    private potentialNodes: GridNode[] = [];
    private selectedNodes: GridNode[] = [];
    private checkedNodes: GridNode[] = [];

    private searchState = SearchState.MARKING;

    private backtrackCurrent;

    getNode(x: number, y: number) {
        if (y < 0) y += this.rows;
        if (x < 0) x += this.cols;
        return this.nodes[y * this.cols + x];
    }

    getNeighborNodes(node: GridNode) {
        const neighbors = [];

        if (node.y > 0) neighbors.push(this.getNode(node.x, node.y - 1));
        if (node.x > 0) neighbors.push(this.getNode(node.x - 1, node.y));
        if (node.y < this.rows - 1)
            neighbors.push(this.getNode(node.x, node.y + 1));
        if (node.x < this.cols - 1)
            neighbors.push(this.getNode(node.x + 1, node.y));

        if (node.x > 0 && node.y > 0)
            neighbors.push(this.getNode(node.x - 1, node.y - 1));
        if (node.x > 0 && node.y < this.rows - 1)
            neighbors.push(this.getNode(node.x - 1, node.y + 1));
        if (node.x < this.cols - 1 && node.y > 0)
            neighbors.push(this.getNode(node.x + 1, node.y - 1));
        if (node.x < this.cols - 1 && node.y < this.rows - 1)
            neighbors.push(this.getNode(node.x + 1, node.y + 1));

        return neighbors;
    }

    markPotentialNodes() {
        for (const selected of this.checkedNodes) {
            for (const neighbor of this.getNeighborNodes(selected)) {
                if (neighbor.isEnd()) {
                    neighbor.calculateGCost(selected);
                    return true;
                }

                if (neighbor.isEmpty() || neighbor.isPotential()) {
                    if (neighbor.isEmpty()) this.potentialNodes.push(neighbor);

                    // Will recalculate if it is potential already
                    neighbor.makePotential(selected, this.endNode);
                }
            }
        }
        return false;
    }

    checkBestPotentialNode() {
        let minFCost = -1;
        for (const potential of this.potentialNodes) {
            if (minFCost === -1 || minFCost > potential.fCost) {
                minFCost = potential.fCost;
            }
        }

        let minHCost = -1;
        for (const potential of this.potentialNodes) {
            if (potential.fCost !== minFCost) continue;

            if (minHCost === -1 || minHCost > potential.hCost) {
                minHCost = potential.hCost;
            }
        }

        for (const pIndex in this.potentialNodes) {
            let index = parseInt(pIndex);
            const node = this.potentialNodes[index];
            if (node.fCost === minFCost && node.hCost === minHCost) {
                this.checkedNodes.push(node);
                node.makeChecked();
                this.potentialNodes.splice(index, 1);

                // Do not check more than one in the same tick
                return;
            }
        }
    }

    selectBestPreviousNode(current: GridNode) {
        let minGCost = -1;
        const neighbors = this.getNeighborNodes(current);
        for (const node of neighbors) {
            if (
                (node.isChecked() || node.isStart()) &&
                node.gCost < current.gCost
            ) {
                if (node.isStart()) return node;

                if (minGCost === -1 || minGCost > node.gCost)
                    minGCost = node.gCost;
            }
        }

        for (const node of neighbors) {
            if (node.gCost === minGCost) {
                node.makeSelected();
                return node;
            }
        }

        // Should not be possible
        return null;
    }

    // The steps of A* Algorithm
    tick() {
        if (this.searchState === SearchState.MARKING) {
            const foundEnd = this.markPotentialNodes();
            if (foundEnd) {
                this.selectedNodes.push(this.endNode);
                this.searchState = SearchState.BACKTRACKING;
            } else {
                this.searchState = SearchState.CHECKING;
            }
        } else if (this.searchState === SearchState.CHECKING) {
            this.checkBestPotentialNode();
            this.searchState = SearchState.MARKING;
        } else if (this.searchState === SearchState.BACKTRACKING) {
            this.backtrackCurrent = this.selectBestPreviousNode(
                this.backtrackCurrent
            )!;

            this.selectedNodes.push(this.backtrackCurrent);

            if (this.backtrackCurrent === this.startNode) {
                this.searchState = SearchState.END;
            }
        }
    }
}

enum SearchState {
    MARKING,
    CHECKING,
    BACKTRACKING,
    END,
}
