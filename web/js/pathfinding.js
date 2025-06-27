// deno-lint-ignore-file
class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return `${this.x}-${this.y}`;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
}

class PathNode {
  constructor(coord, isStart, isEnd) {
    this.coord = coord; // coord is a Coordinate (or subclass)
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.canTravel = true;
  }

  isTravelable() {
    return this.canTravel;
  }
  getNeighbors(grid) {
    const dirs = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];
    const neighbors = [];
    for (const [dx, dy] of dirs) {
      const nx = this.coord.x + dx;
      const ny = this.coord.y + dy;
      if (grid[nx]?.[ny]) neighbors.push(grid[nx][ny]);
    }
    return neighbors;
  }
}

class WallNode extends PathNode {
  constructor(coord, isStart, isEnd) {
    super(coord, isStart, isEnd);
    this.canTravel = false;
  }
}

let counter1 = 0;
let counter2 = 0;

function runPathfinding() {
  const pathNodes = [];
  document.querySelectorAll(".square").forEach((square) => {
    const id = square.id.split("-").map(Number);
    const isStart = square.classList.contains("start");
    const isEnd = square.classList.contains("end");
    if (square.classList.contains("square-dark")) {
      const coord = new Coordinate(id[0], id[1]);
      pathNodes.push(new WallNode(coord, isStart, isEnd));
    } else {
      const coord = new Coordinate(id[0], id[1]);
      pathNodes.push(new PathNode(coord, isStart, isEnd));
    }
  });

  const startElem = document.querySelector(".start");
  const endElem = document.querySelector(".end");
  if (!startElem || !endElem) {
    console.error("Start or end point not selected.");
    return;
  }
  let startPoint = startElem.id;
  let endPoint = endElem.id;

  function pathfinding(startId, endId, pathNodes) {
    const rows = 84;
    const cols = 128;
    const grid = [];
    for (let r = 0; r <= rows; r++) {
      grid[r] = [];
      for (let c = 0; c <= cols; c++) {
        grid[r][c] = null;
      }
    }
    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      grid[node.coord.x][node.coord.y] = node;
    }
    const [startX, startY] = startId.split("-").map(Number);
    const [endX, endY] = endId.split("-").map(Number);
    const visited = [];
    for (let r = 0; r <= rows; r++) {
      visited[r] = [];
      for (let c = 0; c <= cols; c++) {
        visited[r][c] = false;
      }
    }
    const queue = [[startX, startY, []]];

    while (queue.length > 0) {
      const current = queue.shift();
      const x = current[0];
      const y = current[1];
      const path = current[2];
      if (visited[x][y]) continue;
      visited[x][y] = true;
      if (x === endX && y === endY) {
        path.push([x, y]);
        return path;
      }
      const node = grid[x][y];
      // Use polymorphic neighbor calculation
      const neighbors = node.getNeighbors(grid);
      for (const neighbor of neighbors) {
        const nx = neighbor.coord.x;
        const ny = neighbor.coord.y;
        if (
          nx >= 1 &&
          nx <= rows &&
          ny >= 1 &&
          ny <= cols &&
          !visited[nx][ny] &&
          neighbor.isTravelable()
        ) {
          const nextPath = [];
          for (let p = 0; p < path.length; p++) {
            nextPath.push(path[p]);
          }
          nextPath.push([x, y]);
          queue.push([nx, ny, nextPath]);
        }
      }
    }
    return null;
  }

  const path = pathfinding(startPoint, endPoint, pathNodes);

  fetch("/save-path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });

  console.log(path);

  const prevPathElements = document.querySelectorAll(".path");
  for (let i = 0; i < prevPathElements.length; i++) {
    prevPathElements[i].classList.remove("path");
  }

  if (path) {
    for (let i = 0; i < path.length; i++) {
      const elementId = path[i][0] + "-" + path[i][1];
      const element = document.getElementById(elementId);
      if (element) {
        element.classList.add("path");
      }
    }
  }
}

function addPoints() {
  const elements = document.querySelectorAll(".square");
  elements.forEach((element) => {
    element.onclick = function () {
      if (counter1 < 1) {
        element.classList.add("start");
        counter1++;
      } else if (counter2 < 1) {
        if (element.id != document.querySelector(".start").id) {
          element.classList.add("end");
          counter2++;
          runPathfinding();
        }
      }
    };
  });
}
let btn = document.getElementById("reset-btn");
btn.onclick = function () {
  const squares = document.querySelectorAll(".square");
  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.remove("start", "end", "path");
  }

  counter1 = 0;
  counter2 = 0;
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    addPoints();
  }, 100);
});
