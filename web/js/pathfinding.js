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

document.getElementById('16-19').classList.add('start');
document.getElementById('21-33').classList.add('end');

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const pathNodes = [];
    document.querySelectorAll('.square').forEach(square => {
      const id = square.id.split('-').map(Number);
      const isWall = square.classList.contains('square-dark');
      const isStart = square.classList.contains('start');
      const isEnd = square.classList.contains('end');
      pathNodes.push(new PathNode(id[0], id[1], isStart, isEnd, false, isWall));
    });
    console.log(pathNodes);
  

function pathfinding(startId, endId, pathNodes) {
      const rows = 42;
      const cols = 64;
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

      // Parse start and end coordinates from id strings
      const [startX, startY] = startId.split('-').map(Number);
      const [endX, endY] = endId.split('-').map(Number);

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
        [1, -1]
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
            newX >= 1 && newX <= rows &&
            newY >= 1 && newY <= cols &&
            !visited[newX][newY] &&
            grid[newX][newY] && !grid[newX][newY].isWall
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
  const path = pathfinding('16-19', '21-33', pathNodes);
  console.log(path);

  if (path) {
  for (let i = 0; i < path.length; i++) {
    const [x, y] = path[i];
    const nodeId = `${x}-${y}`;
    document.getElementById(nodeId).classList.add('path');
  }
}
}, 100);
});

