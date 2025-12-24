/**
 * Fano Plane Structure for Hypercomplex Multiplication
 * 
 * Port from tinyaleph/core/fano.js to AssemblyScript
 * 
 * The Fano plane is a finite projective plane with 7 points and 7 lines,
 * used to define octonion multiplication rules.
 */

// Standard Fano plane lines (7 lines of 3 points each)
// Each line defines a cyclic multiplication rule: e_i * e_j = e_k
export const FANO_LINES: StaticArray<StaticArray<i32>> = [
  StaticArray.fromArray<i32>([1, 2, 3]),
  StaticArray.fromArray<i32>([1, 4, 5]),
  StaticArray.fromArray<i32>([1, 6, 7]),
  StaticArray.fromArray<i32>([2, 4, 6]),
  StaticArray.fromArray<i32>([2, 5, 7]),
  StaticArray.fromArray<i32>([3, 4, 7]),
  StaticArray.fromArray<i32>([3, 5, 6])
];

/**
 * Result of a hypercomplex multiplication index lookup
 */
export class MultiplicationResult {
  index: i32;
  sign: i32;
  
  constructor(index: i32, sign: i32) {
    this.index = index;
    this.sign = sign;
  }
}

/**
 * Find an element in a StaticArray
 */
function indexOf(arr: StaticArray<i32>, val: i32): i32 {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == val) return i;
  }
  return -1;
}

/**
 * Check if a StaticArray contains an element
 */
function includes(arr: StaticArray<i32>, val: i32): bool {
  return indexOf(arr, val) >= 0;
}

/**
 * Octonion multiplication using Fano plane
 * Returns [result_index, sign]
 * 
 * @param i First basis element index (0-7)
 * @param j Second basis element index (0-7)
 * @returns MultiplicationResult with resulting index and sign
 */
export function octonionMultiplyIndex(i: i32, j: i32): MultiplicationResult {
  // e_0 is the identity
  if (i == 0) return new MultiplicationResult(j, 1);
  if (j == 0) return new MultiplicationResult(i, 1);
  
  // e_i * e_i = -1 (for i > 0)
  if (i == j) return new MultiplicationResult(0, -1);
  
  // Use Fano plane to determine product
  for (let lineIdx = 0; lineIdx < 7; lineIdx++) {
    const line = FANO_LINES[lineIdx];
    const xi = indexOf(line, i);
    
    if (xi >= 0 && includes(line, j)) {
      const xj = indexOf(line, j);
      // Find the third element on the line
      const k = line[3 - xi - xj];
      // Sign determined by cyclic order on the line
      const sign: i32 = ((xj - xi + 3) % 3 == 1) ? 1 : -1;
      return new MultiplicationResult(k, sign);
    }
  }
  
  // Fallback: XOR for elements not on same Fano line
  return new MultiplicationResult(i ^ j, 1);
}

/**
 * Sedenion multiplication (Cayley-Dickson extension of octonions)
 * Returns [result_index, sign]
 * 
 * Using Cayley-Dickson construction:
 * (a, b) * (c, d) = (ac - d*b, da + bc*)
 * where * denotes conjugate
 * 
 * @param i First basis element index (0-15)
 * @param j Second basis element index (0-15)
 * @returns MultiplicationResult with resulting index and sign
 */
export function sedenionMultiplyIndex(i: i32, j: i32): MultiplicationResult {
  // e_0 is the identity
  if (i == 0) return new MultiplicationResult(j, 1);
  if (j == 0) return new MultiplicationResult(i, 1);
  
  // e_i * e_i = -1 (for i > 0)
  if (i == j) return new MultiplicationResult(0, -1);
  
  // Check which "half" each index is in
  const hi: bool = i >= 8;
  const hj: bool = j >= 8;
  const li: i32 = i & 7;  // Lower 3 bits (octonion part)
  const lj: i32 = j & 7;
  
  // Both in lower half: use octonion multiplication
  if (!hi && !hj) {
    return octonionMultiplyIndex(li, lj);
  }
  
  // Both in upper half: (0, b) * (0, d) = (-d*b, 0) = -(octonion product)
  if (hi && hj) {
    const result = octonionMultiplyIndex(li, lj);
    return new MultiplicationResult(result.index, -result.sign);
  }
  
  // Mixed: one in each half
  if (!hi) {
    // (a, 0) * (0, d) = (0, da)
    const result = octonionMultiplyIndex(lj, li);
    return new MultiplicationResult(result.index + 8, result.sign);
  }
  
  // hi && !hj: (0, b) * (c, 0) = (0, bc*) where c* = c for real c
  const result = octonionMultiplyIndex(li, lj);
  return new MultiplicationResult(result.index + 8, -result.sign);
}

/**
 * Generic multiplication index lookup for any dimension
 * Handles: Complex (dim=2), Quaternions (dim=4), Octonions (dim=8), 
 *          Sedenions (dim=16), and higher via recursive Cayley-Dickson
 * 
 * @param dim Dimension of the algebra (must be power of 2)
 * @param i First basis element index
 * @param j Second basis element index
 * @returns MultiplicationResult with resulting index and sign
 */
export function multiplyIndices(dim: i32, i: i32, j: i32): MultiplicationResult {
  // Complex numbers (dim=2)
  if (dim <= 2) {
    if (i == 0) return new MultiplicationResult(j, 1);
    if (j == 0) return new MultiplicationResult(i, 1);
    if (i == 1 && j == 1) return new MultiplicationResult(0, -1);  // i² = -1
    return new MultiplicationResult(i ^ j, 1);
  }
  
  // Quaternions (dim=4)
  if (dim <= 4) {
    if (i == 0) return new MultiplicationResult(j, 1);
    if (j == 0) return new MultiplicationResult(i, 1);
    if (i == j) return new MultiplicationResult(0, -1);
    
    // Quaternion multiplication table
    // i*j=k, j*k=i, k*i=j (and negatives for reverse order)
    // Using a lookup approach instead of 2D array for efficiency
    // quat[i][j] gives signed result index
    if (i == 1 && j == 2) return new MultiplicationResult(3, 1);   // i*j = k
    if (i == 1 && j == 3) return new MultiplicationResult(2, -1);  // i*k = -j
    if (i == 2 && j == 1) return new MultiplicationResult(3, -1);  // j*i = -k
    if (i == 2 && j == 3) return new MultiplicationResult(1, 1);   // j*k = i
    if (i == 3 && j == 1) return new MultiplicationResult(2, 1);   // k*i = j
    if (i == 3 && j == 2) return new MultiplicationResult(1, -1);  // k*j = -i
    
    return new MultiplicationResult(i ^ j, 1);  // fallback
  }
  
  // Octonions (dim=8)
  if (dim <= 8) {
    return octonionMultiplyIndex(i % 8, j % 8);
  }
  
  // Sedenions (dim=16)
  if (dim <= 16) {
    return sedenionMultiplyIndex(i, j);
  }
  
  // Higher dimensions (Pathions, etc): Recursive Cayley-Dickson
  if (i == 0) return new MultiplicationResult(j, 1);
  if (j == 0) return new MultiplicationResult(i, 1);
  if (i == j) return new MultiplicationResult(0, -1);
  
  const half = dim / 2;
  const hi: bool = i >= half;
  const hj: bool = j >= half;
  const li: i32 = i % half;
  const lj: i32 = j % half;
  
  // Both in lower half
  if (!hi && !hj) {
    return multiplyIndices(half, li, lj);
  }
  
  // Both in upper half: negate
  if (hi && hj) {
    const result = multiplyIndices(half, li, lj);
    return new MultiplicationResult(result.index, -result.sign);
  }
  
  // Lower * Upper
  if (!hi) {
    const result = multiplyIndices(half, lj, li);
    return new MultiplicationResult(result.index + half, result.sign);
  }
  
  // Upper * Lower
  const result = multiplyIndices(half, li, lj);
  return new MultiplicationResult(result.index + half, -result.sign);
}

/**
 * Build full multiplication table for a given dimension
 * Returns a 2D array where table[i][j] contains the MultiplicationResult
 * 
 * @param dim Dimension of the algebra (must be power of 2)
 * @returns 2D array of MultiplicationResult
 */
export function buildMultiplicationTable(dim: i32): Array<Array<MultiplicationResult>> {
  const table = new Array<Array<MultiplicationResult>>(dim);
  
  for (let i = 0; i < dim; i++) {
    table[i] = new Array<MultiplicationResult>(dim);
    for (let j = 0; j < dim; j++) {
      table[i][j] = multiplyIndices(dim, i, j);
    }
  }
  
  return table;
}

/**
 * Get the basis name for a given dimension and index
 * Returns: "1", "i", "j", "k" for quaternions, 
 *          "e0"-"e7" for octonions, etc.
 */
export function basisName(dim: i32, index: i32): string {
  if (index == 0) return "1";
  
  if (dim <= 4) {
    if (index == 1) return "i";
    if (index == 2) return "j";
    if (index == 3) return "k";
  }
  
  return `e${index}`;
}