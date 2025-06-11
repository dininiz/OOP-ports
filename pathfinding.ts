// Pathfinding on a square grid using square IDs as coordinates
// Only traverses white squares (without 'square-dark' class)
// Usage: Call findPath(startId, endId, isWhite: (id: string) => boolean)

export interface PathNode {
    id: string;         // e.g., '1-1'
    isStart: boolean;
    isEnd: boolean;
    isPath: boolean;
}

export interface PathResult {
    path: PathNode[];
    length: number;     // number of squares in the path
}

// Parse a square id like '3-5' into [row, col]
function parseId(id: string): [number, number] {
    const [row, col] = id.split('-').map(Number);
    return [row, col];
}

// Get the id for a given row and col
function makeId(row: number, col: number): string {
    return `${row}-${col}`;
}

export function isWhite (_id: string):boolean {
    return true;
}

// Find path using BFS (returns shortest path)
export function findPath(
    startId: string,
    endId: string,
    isWhite: (id: string) => boolean, // function to check if a square is white
    maxRows = 42,
    maxCols = 64
): PathResult | null {
    const queue: {id: string, path: string[]}[] = [];
    const visited = new Set<string>();
    queue.push({id: startId, path: [startId]});
    visited.add(startId);
    

    while (queue.length > 0) {
        const {id, path} = queue.shift()!;
        if (id === endId) {
            // Build the result path with isStart/isEnd
            const resultPath: PathNode[] = path.map((pid, idx) => ({
                id: pid,
                isStart: idx === 0,
                isEnd: idx === path.length - 1,
                isPath: idx !== 0 && idx !== path.length - 1, 
            }));
            return { path: resultPath, length: resultPath.length };
        }
        const [row, col] = parseId(id);
        // 4-directional movement
        const neighbors = [
            [row-1, col], [row+1, col], [row, col-1], [row, col+1]
        ];
        for (const [nRow, nCol] of neighbors) {
            if (nRow < 1 || nRow > maxRows || nCol < 1 || nCol > maxCols) continue;
            const neighborId = makeId(nRow, nCol);
            if (!visited.has(neighborId) && isWhite(neighborId)) {
                visited.add(neighborId);
                queue.push({id: neighborId, path: [...path, neighborId]});
            }
        }
    }
    // No path found
    return null;
}

