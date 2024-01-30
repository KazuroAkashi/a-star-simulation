# A\* Algorithm Simulation

This is a simple simulation for studying the A\* Pathfinding
Algorithm on a modifiable grid.

## Tools

You cannot modify the grid after starting the algorithm.

| Key      | Efffect                          |
| -------- | -------------------------------- |
| `W`      | Switch to wall placing mode      |
| `S`      | Switch to start placing mode     |
| `E`      | Switch to end placing mode       |
| `Escape` | Switch to default mode (Nothing) |
| `Space`  | Reset the board                  |
| `Enter`  | Step into the algorithm          |

## Cells

The number on the top left is the G-Cost, which is the distance from the **start position**.

The number on the top right is the H-Cost, which is the distance from the **end position**.

The number on the center is the F-Cost, which is the sum of the costs.

| Cell Color | Role                                         |
| ---------- | -------------------------------------------- |
| White      | Wall                                         |
| Blue       | Potential node which is not checked          |
| Red        | Checked node which may be a part of the path |
| Green      | Selected node which _is_ a part of the path  |
