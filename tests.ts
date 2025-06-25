import { assert } from "https://deno.land/std@0.203.0/testing/asserts.ts";

Deno.test("Path array is not empty and has no conflicting information among the elements", async () => {
  const data = await Deno.readTextFile("saved_path.json");
  const path: number[][] = JSON.parse(data);

  console.log("Path:", path);

  assert(Array.isArray(path), "Path should be an array");
  assert(path.length > 0, "Path should not be empty");
  assert(path[0]!==path[1], "Path elements should not be the same");
  assert(path[0]!==path[path.length-1], "First and last elements should not be the same");
});