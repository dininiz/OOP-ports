// deno-lint-ignore-file
class PathNode {
  constructor(x, y, isStart, isEnd, isPath, isWall) {
    this.x = x;
    this.y = y;
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.isPath = isPath;
    this.isWall = isWall;
  }
}

let counter1 = 0;
let counter2 = 0;

function runPathfinding() {
  const pathNodes = [];
  document.querySelectorAll(".square").forEach((square) => {
    const id = square.id.split("-").map(Number);
    const isWall = square.classList.contains("square-dark");
    const isStart = square.classList.contains("start");
    const isEnd = square.classList.contains("end");
    pathNodes.push(new PathNode(id[0], id[1], isStart, isEnd, false, isWall));
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
      grid[node.x][node.y] = node;
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
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];
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
      for (let d = 0; d < directions.length; d++) {
        const dx = directions[d][0];
        const dy = directions[d][1];
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX >= 1 &&
          newX <= rows &&
          newY >= 1 &&
          newY <= cols &&
          !visited[newX][newY] &&
          grid[newX][newY] &&
          !grid[newX][newY].isWall
        ) {
          grid[newX][newY].isPath = true;
          const nextPath = [];
          for (let p = 0; p < path.length; p++) {
            nextPath.push(path[p]);
          }
          nextPath.push([x, y]);
          queue.push([newX, newY, nextPath]);
        }
      }
    }
    return null;
  }

  const path = pathfinding(startPoint, endPoint, pathNodes);

  fetch('/save-path', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  
  console.log(path);

  const prevPathElements = document.querySelectorAll('.path');
  for (let i = 0; i < prevPathElements.length; i++) {
    prevPathElements[i].classList.remove('path');
  }

  if (path) {
    for (let i = 0; i < path.length; i++) {
      const elementId = path[i][0] + '-' + path[i][1];
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
        if (element.id != document.querySelector(".start").id){
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
    // Remove all start, end, and path classes
    const squares = document.querySelectorAll('.square');
    for (let i = 0; i < squares.length; i++) {
      squares[i].classList.remove('start', 'end', 'path');
    }
    // Reset counters
    counter1 = 0;
    counter2 = 0;
  };

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    addPoints();
  }, 100);
});
