// assembly/tests/core-arrays.test.ts

import {
  createArray,
  createFilledArray,
  arrayFromMapValues,
  safeGet,
  removeAll,
  removeDuplicates,
  chunk,
  flatten,
  findIndex,
  count,
  partition,
  range,
  zip,
  groupBy,
  shuffle,
  last,
  first,
  arrayEquals,
  slidingWindow,
  rotate,
  binarySearch,
  insertSorted,
  intersection,
  difference,
  union,
} from "../core/arrays";
import { Tuple } from "../core/tuples";

class Groupable {
  constructor(public group: string, public value: i32) {}
}

export function testCreateArray(): void {
  const arr = createArray<i32>(5);
  assert(arr.length == 5, "createArray should create an array with the specified capacity");

  const arr2 = createArray<i32>();
  assert(arr2.length == 0, "createArray should create an empty array with no capacity");
}

export function testCreateFilledArray(): void {
  const arr = createFilledArray<i32>(3, 7);
  assert(arr.length == 3, "createFilledArray should create an array with the correct size");
  for (let i = 0; i < arr.length; i++) {
    assert(arr[i] == 7, "All elements in a filled array should have the default value");
  }
}

export function testArrayFromMapValues(): void {
  const map = new Map<string, i32>();
  map.set("a", 1);
  map.set("b", 2);
  const arr = arrayFromMapValues(map);
  assert(arr.length == 2, "arrayFromMapValues should create an array with the correct number of values");
  assert(arr.includes(1) && arr.includes(2), "The array should contain the values from the map");
}

export function testSafeGet(): void {
  const arr = [10, 20, 30];
  assert(safeGet(arr, 1, 0) == 20, "safeGet should return the element at a valid index");
  assert(safeGet(arr, 5, 99) == 99, "safeGet should return the default value for an out-of-bounds index");
}

export function testRemoveAll(): void {
  const arr = [1, 2, 3, 2, 4, 2];
  removeAll(arr, 2);
  assert(arr.length == 3, "removeAll should remove all occurrences of the specified value");
  assert(arr[0] == 1 && arr[1] == 3 && arr[2] == 4, "The remaining elements should be correct after removal");
}

export function testRemoveDuplicates(): void {
  const arr = [1, 2, 2, 3, 1, 4];
  const result = removeDuplicates(arr);
  assert(result.length == 4, "removeDuplicates should remove all duplicate values");
  assert(arrayEquals(result, [1, 2, 3, 4]), "The remaining elements should be unique");
}

export function testPartition(): void {
  const arr = [1, 2, 3, 4, 5, 6];
  const result = partition(arr, (x) => x % 2 == 0);
  assert(arrayEquals(result._0, [2, 4, 6]), "The truthy partition should contain all even numbers");
  assert(arrayEquals(result._1, [1, 3, 5]), "The falsy partition should contain all odd numbers");
}

export function testZip(): void {
  const arr1 = [1, 2, 3];
  const arr2 = ["a", "b", "c"];
  const result = zip(arr1, arr2);
  assert(result.length == 3, "zip should create an array of tuples with the correct length");
  assert(result[0]._0 == 1 && result[0]._1 == "a", "The first zipped tuple should be correct");
  assert(result[2]._0 == 3 && result[2]._1 == "c", "The last zipped tuple should be correct");
}

export function runAllArrayTests(): void {
  console.log("Running array utility tests...");

  testCreateArray();
  console.log("✓ createArray test passed");

  testCreateFilledArray();
  console.log("✓ createFilledArray test passed");

  testArrayFromMapValues();
  console.log("✓ arrayFromMapValues test passed");

  testSafeGet();
  console.log("✓ safeGet test passed");

  testRemoveAll();
  console.log("✓ removeAll test passed");

  testRemoveDuplicates();
  console.log("✓ removeDuplicates test passed");

  testPartition();
  console.log("✓ partition test passed");

  testZip();
  console.log("✓ zip test passed");

  testChunk();
  console.log("✓ chunk test passed");

  testFlatten();
  console.log("✓ flatten test passed");

  testFindIndex();
  console.log("✓ findIndex test passed");

  testCount();
  console.log("✓ count test passed");

  testRange();
  console.log("✓ range test passed");

  testGroupBy();
  console.log("✓ groupBy test passed");

  testShuffle();
  console.log("✓ shuffle test passed");

  testLast();
  console.log("✓ last test passed");

  testFirst();
  console.log("✓ first test passed");

  testArrayEquals();
  console.log("✓ arrayEquals test passed");

  testSlidingWindow();
  console.log("✓ slidingWindow test passed");

  testRotate();
  console.log("✓ rotate test passed");

  testBinarySearch();
  console.log("✓ binarySearch test passed");

  testInsertSorted();
  console.log("✓ insertSorted test passed");

  testIntersection();
  console.log("✓ intersection test passed");

  testDifference();
  console.log("✓ difference test passed");

  testUnion();
  console.log("✓ union test passed");

  console.log("\nAll array utility tests passed! ✨");
}

export function testChunk(): void {
  const arr = [1, 2, 3, 4, 5, 6, 7];
  const chunks = chunk(arr, 3);
  assert(chunks.length == 3, "chunk should create the correct number of chunks");
  assert(arrayEquals(chunks[0], [1, 2, 3]), "The first chunk should be correct");
  assert(arrayEquals(chunks[2], [7]), "The last chunk should be correct");
}

export function testFlatten(): void {
  const arr = [[1, 2], [3, 4], [5]];
  const flat = flatten(arr);
  assert(arrayEquals(flat, [1, 2, 3, 4, 5]), "flatten should produce a single, flat array");
}

export function testFindIndex(): void {
  const arr = [10, 20, 30, 40, 50];
  const index = findIndex(arr, (x) => x > 25);
  assert(index == 2, "findIndex should return the correct index of the first matching element");
  const notFound = findIndex(arr, (x) => x > 100);
  assert(notFound == -1, "findIndex should return -1 if no element is found");
}

export function testCount(): void {
  const arr = [1, 2, 3, 4, 5, 6];
  const evenCount = count(arr, (x) => x % 2 == 0);
  assert(evenCount == 3, "count should return the correct number of elements that match the predicate");
}

export function testRange(): void {
  const arr = range(1, 5);
  assert(arrayEquals(arr, [1, 2, 3, 4]), "range should create an array with the correct values");
  const arr2 = range(5, 1, -1);
  assert(arrayEquals(arr2, [5, 4, 3, 2]), "range should handle a negative step correctly");
}

export function testGroupBy(): void {
  const arr = [
    new Groupable("a", 1),
    new Groupable("b", 2),
    new Groupable("a", 3),
  ];
  const groups = groupBy<Groupable, string>(arr, (x) => x.group);
  assert(groups.has("a") && groups.get("a").length == 2, "groupBy should group elements correctly");
  assert(groups.has("b") && groups.get("b").length == 1, "groupBy should create the correct number of groups");
}

export function testShuffle(): void {
  const arr = [1, 2, 3, 4, 5];
  const original = arr.slice(0);
  shuffle(arr);
  assert(arr.length == original.length, "shuffle should not change the length of the array");
  // This is not a deterministic test, but it's a good sanity check.
  assert(!arrayEquals(arr, original), "shuffle should change the order of the elements");
}

export function testLast(): void {
  const arr = [10, 20, 30];
  assert(last(arr, 0) == 30, "last should return the last element of the array");
  const empty: i32[] = [];
  assert(last(empty, 99) == 99, "last should return the default value for an empty array");
}

export function testFirst(): void {
  const arr = [10, 20, 30];
  assert(first(arr, 0) == 10, "first should return the first element of the array");
  const empty: i32[] = [];
  assert(first(empty, 99) == 99, "first should return the default value for an empty array");
}

export function testArrayEquals(): void {
  const arr1 = [1, 2, 3];
  const arr2 = [1, 2, 3];
  const arr3 = [1, 2, 4];
  assert(arrayEquals(arr1, arr2), "arrayEquals should return true for equal arrays");
  assert(!arrayEquals(arr1, arr3), "arrayEquals should return false for unequal arrays");
}

export function testSlidingWindow(): void {
  const arr = [1, 2, 3, 4, 5];
  const windows = slidingWindow(arr, 3);
  assert(windows.length == 3, "slidingWindow should create the correct number of windows");
  assert(arrayEquals(windows[0], [1, 2, 3]), "The first window should be correct");
  assert(arrayEquals(windows[2], [3, 4, 5]), "The last window should be correct");
}

export function testRotate(): void {
  const arr = [1, 2, 3, 4, 5];
  rotate(arr, 2);
  assert(arrayEquals(arr, [4, 5, 1, 2, 3]), "rotate should rotate the array to the right");
  rotate(arr, -2);
  assert(arrayEquals(arr, [1, 2, 3, 4, 5]), "rotate should rotate the array back to the left");
}

export function testBinarySearch(): void {
  const arr = [10, 20, 30, 40, 50];
  const index = binarySearch(arr, 30, (a, b) => a - b);
  assert(index == 2, "binarySearch should return the correct index of the target");
  const notFound = binarySearch(arr, 35, (a, b) => a - b);
  assert(notFound == -1, "binarySearch should return -1 if the target is not found");
}

export function testInsertSorted(): void {
  const arr = [10, 20, 40, 50];
  insertSorted(arr, 30, (a, b) => a - b);
  assert(arrayEquals(arr, [10, 20, 30, 40, 50]), "insertSorted should insert the element at the correct position");
}

export function testIntersection(): void {
  const arr1 = [1, 2, 3, 4];
  const arr2 = [3, 4, 5, 6];
  const result = intersection(arr1, arr2);
  assert(arrayEquals(result, [3, 4]), "intersection should return the common elements");
}

export function testDifference(): void {
  const arr1 = [1, 2, 3, 4];
  const arr2 = [3, 4, 5, 6];
  const result = difference(arr1, arr2);
  assert(arrayEquals(result, [1, 2]), "difference should return the elements in the first array but not the second");
}

export function testUnion(): void {
  const arr1 = [1, 2, 3, 4];
  const arr2 = [3, 4, 5, 6];
  const result = union(arr1, arr2);
  assert(arrayEquals(result, [1, 2, 3, 4, 5, 6]), "union should return all unique elements from both arrays");
}