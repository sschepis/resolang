/**
 * Array utility functions for common operations
 * Consolidates array manipulation patterns across the codebase
 */

import { ValidationException } from "./errors";
import { Tuple } from "./tuples";

/**
 * Creates a new array with specified type and optional initial capacity
 * Replaces pattern: new Array<T>()
 */
export function createArray<T>(initialCapacity: i32 = 0): Array<T> {
  if (initialCapacity > 0) {
    return new Array<T>(initialCapacity);
  }
  return new Array<T>();
}

/**
 * Creates an array filled with a default value
 */
export function createFilledArray<T>(size: i32, defaultValue: T): Array<T> {
  const arr = new Array<T>(size);
  for (let i = 0; i < size; i++) {
    arr[i] = defaultValue;
  }
  return arr;
}

/**
 * Creates an array from Map values
 */
export function arrayFromMapValues<K, V>(map: Map<K, V>): Array<V> {
  const result = new Array<V>();
  const values = map.values();
  for (let i = 0; i < values.length; i++) {
    result.push(values[i]);
  }
  return result;
}

/**
 * Creates an array from Map keys
 */
export function arrayFromMapKeys<K, V>(map: Map<K, V>): Array<K> {
  const result = new Array<K>();
  const keys = map.keys();
  for (let i = 0; i < keys.length; i++) {
    result.push(keys[i]);
  }
  return result;
}

/**
 * Creates an array from Set values
 */
export function arrayFromSet<T>(set: Set<T>): Array<T> {
  const result = new Array<T>();
  const values = set.values();
  for (let i = 0; i < values.length; i++) {
    result.push(values[i]);
  }
  return result;
}

/**
 * Safely gets an element from an array with bounds checking
 */
export function safeGet<T>(arr: Array<T>, index: i32, defaultValue: T): T {
  if (index >= 0 && index < arr.length) {
    return arr[index];
  }
  return defaultValue;
}

/**
 * Removes all occurrences of a value from an array
 */
export function removeAll<T>(arr: Array<T>, value: T): void {
  let writeIndex = 0;
  for (let readIndex = 0; readIndex < arr.length; readIndex++) {
    if (arr[readIndex] != value) {
      if (writeIndex != readIndex) {
        arr[writeIndex] = arr[readIndex];
      }
      writeIndex++;
    }
  }
  arr.length = writeIndex;
}

/**
 * Removes duplicates from an array
 */
export function removeDuplicates<T>(arr: Array<T>): Array<T> {
  const seen = new Set<T>();
  const result = new Array<T>();
  
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  
  return result;
}

/**
 * Chunks an array into smaller arrays of specified size
 */
export function chunk<T>(arr: Array<T>, chunkSize: i32): Array<Array<T>> {
  if (chunkSize <= 0) {
    throw new ValidationException("Chunk size must be positive");
  }
  
  const result = new Array<Array<T>>();
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = new Array<T>();
    for (let j = 0; j < chunkSize && i + j < arr.length; j++) {
      chunk.push(arr[i + j]);
    }
    result.push(chunk);
  }
  
  return result;
}

/**
 * Flattens a 2D array into a 1D array
 */
export function flatten<T>(arr: Array<Array<T>>): Array<T> {
  const result = new Array<T>();
  for (let i = 0; i < arr.length; i++) {
    const inner = arr[i];
    for (let j = 0; j < inner.length; j++) {
      result.push(inner[j]);
    }
  }
  return result;
}

/**
 * Finds the first index where predicate returns true
 */
export function findIndex<T>(arr: Array<T>, predicate: (value: T, index: i32) => bool): i32 {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      return i;
    }
  }
  return -1;
}

/**
 * Counts occurrences of elements that match a predicate
 */
export function count<T>(arr: Array<T>, predicate: (value: T) => bool): i32 {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      count++;
    }
  }
  return count;
}

/**
 * Partitions an array into two arrays based on a predicate
 */
export function partition<T>(arr: Array<T>, predicate: (value: T) => bool): Tuple<Array<T>, Array<T>> {
  const truthy = new Array<T>();
  const falsy = new Array<T>();
  
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      truthy.push(arr[i]);
    } else {
      falsy.push(arr[i]);
    }
  }
  
  return new Tuple(truthy, falsy);
}

/**
 * Creates a range array from start to end (exclusive)
 */
export function range(start: i32, end: i32, step: i32 = 1): Array<i32> {
  if (step == 0) {
    throw new ValidationException("Step cannot be zero");
  }
  
  const result = new Array<i32>();
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }
  
  return result;
}

/**
 * Zips multiple arrays together
 */
export function zip<T, U>(arr1: Array<T>, arr2: Array<U>): Array<Tuple<T, U>> {
  const minLength = min(arr1.length, arr2.length);
  const result = new Array<Tuple<T, U>>();
  
  for (let i = 0; i < minLength; i++) {
    result.push(new Tuple(arr1[i], arr2[i]));
  }
  
  return result;
}

/**
 * Groups array elements by a key function
 */
export function groupBy<T, K>(arr: Array<T>, keyFn: (value: T) => K): Map<K, Array<T>> {
  const groups = new Map<K, Array<T>>();
  
  for (let i = 0; i < arr.length; i++) {
    const key = keyFn(arr[i]);
    if (!groups.has(key)) {
      groups.set(key, new Array<T>());
    }
    groups.get(key)!.push(arr[i]);
  }
  
  return groups;
}

/**
 * Shuffles an array in-place using Fisher-Yates algorithm
 */
export function shuffle<T>(arr: Array<T>): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = i32(Math.floor(Math.random() * (i + 1)));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

/**
 * Returns the last element of an array or a default value
 */
export function last<T>(arr: Array<T>, defaultValue: T): T {
  return arr.length > 0 ? arr[arr.length - 1] : defaultValue;
}

/**
 * Returns the first element of an array or a default value
 */
export function first<T>(arr: Array<T>, defaultValue: T): T {
  return arr.length > 0 ? arr[0] : defaultValue;
}

/**
 * Compares two arrays for equality
 */
export function arrayEquals<T>(arr1: Array<T>, arr2: Array<T>): bool {
  if (arr1.length != arr2.length) return false;
  
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) return false;
  }
  
  return true;
}

/**
 * Creates a sliding window over an array
 */
export function slidingWindow<T>(arr: Array<T>, windowSize: i32): Array<Array<T>> {
  if (windowSize <= 0 || windowSize > arr.length) {
    throw new ValidationException("Invalid window size");
  }
  
  const result = new Array<Array<T>>();
  for (let i = 0; i <= arr.length - windowSize; i++) {
    const window = new Array<T>();
    for (let j = 0; j < windowSize; j++) {
      window.push(arr[i + j]);
    }
    result.push(window);
  }
  
  return result;
}

/**
 * Rotates an array by n positions
 */
export function rotate<T>(arr: Array<T>, positions: i32): void {
  const n = arr.length;
  if (n == 0) return;
  
  // Normalize positions to be within array bounds
  positions = positions % n;
  if (positions < 0) positions += n;
  
  // Reverse entire array
  reverse(arr, 0, n - 1);
  // Reverse first part
  reverse(arr, 0, positions - 1);
  // Reverse second part
  reverse(arr, positions, n - 1);
}

/**
 * Helper function to reverse a portion of an array
 */
function reverse<T>(arr: Array<T>, start: i32, end: i32): void {
  while (start < end) {
    const temp = arr[start];
    arr[start] = arr[end];
    arr[end] = temp;
    start++;
    end--;
  }
}

/**
 * Binary search in a sorted array
 */
export function binarySearch<T>(arr: Array<T>, target: T, compareFn: (a: T, b: T) => i32): i32 {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    const cmp = compareFn(arr[mid], target);
    
    if (cmp == 0) return mid;
    if (cmp < 0) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

/**
 * Inserts an element into a sorted array maintaining order
 */
export function insertSorted<T>(arr: Array<T>, value: T, compareFn: (a: T, b: T) => i32): void {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (compareFn(arr[mid], value) <= 0) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  // AssemblyScript splice doesn't support insertion, so we do it manually
  arr.push(value); // Add to end first
  // Shift elements to the right
  for (let i = arr.length - 1; i > left; i--) {
    arr[i] = arr[i - 1];
  }
  arr[left] = value;
}

/**
 * Computes the intersection of two arrays
 */
export function intersection<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  const set2 = new Set<T>();
  for (let i = 0; i < arr2.length; i++) {
    set2.add(arr2[i]);
  }
  
  const result = new Array<T>();
  for (let i = 0; i < arr1.length; i++) {
    if (set2.has(arr1[i])) {
      result.push(arr1[i]);
      set2.delete(arr1[i]); // Avoid duplicates
    }
  }
  
  return result;
}

/**
 * Computes the difference of two arrays (elements in arr1 but not in arr2)
 */
export function difference<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  const set2 = new Set<T>();
  for (let i = 0; i < arr2.length; i++) {
    set2.add(arr2[i]);
  }
  
  const result = new Array<T>();
  for (let i = 0; i < arr1.length; i++) {
    if (!set2.has(arr1[i])) {
      result.push(arr1[i]);
    }
  }
  
  return result;
}

/**
 * Computes the union of two arrays
 */
export function union<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  const seen = new Set<T>();
  const result = new Array<T>();
  
  for (let i = 0; i < arr1.length; i++) {
    if (!seen.has(arr1[i])) {
      seen.add(arr1[i]);
      result.push(arr1[i]);
    }
  }
  
  for (let i = 0; i < arr2.length; i++) {
    if (!seen.has(arr2[i])) {
      seen.add(arr2[i]);
      result.push(arr2[i]);
    }
  }
  
  return result;
}