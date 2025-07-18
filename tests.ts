import { assert } from "https://deno.land/std@0.203.0/testing/asserts.ts";

// Polymorphic classes
class PathNode {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  isTravelable(): boolean {
    return true;
  }
}

class WallNode extends PathNode {
  override isTravelable(): boolean {
    return false;
  }
}

const data = await Deno.readTextFile("saved_path.json");
const rawPath: [number, number, string?][] = JSON.parse(data);

const path: PathNode[] = rawPath.map(([x, y]) =>
new PathNode(x, y));

Deno.test("Path array is not empty", () => {

  assert(Array.isArray(path), "Path should be an array");
  assert(path.length > 0, "Path should not be empty");
  
});

Deno.test("All nodes in the path are travelable", () => {

  for (const node of path) {
    assert(node.isTravelable(), "All nodes in the path should be traversable");
    assert(!(node instanceof WallNode), "WallNode should not be present in the path array");
  }

});

Deno.test("Path elements are unique", () => {

  assert(path[0] !== path[1], "Path elements should not be the same");
  assert(path[0] !== path[path.length - 1], "First and last elements should not be the same");

});