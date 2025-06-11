class PathNode {
  constructor(id, isStart, isEnd, isPath, isDark) {
    this.id = id; // string, e.g. "1-1"
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.isPath = isPath;
    this.isDark = isDark;
  }
}

const pathNodes = [];

document.querySelectorAll('.square').forEach(square => {
    const id = square.id;
    const isDark = square.classList.contains('square-dark');
    console.log(isDark)
    if (isDark){
      pathNodes.push(new PathNode(id, false, false, false, true));
    }
    else {
      pathNodes.push(new PathNode(id, false, false, false, false));
    }
});

console.log(pathNodes)