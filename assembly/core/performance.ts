/**
 * Performance optimizations for hot paths
 * Provides optimized implementations for frequently used operations
 */

import { Prime } from "../types";
import { sha256 } from "./crypto";

/**
 * Fast modular exponentiation using binary method
 * Optimized for crypto operations
 */
export function fastModExp(base: u64, exp: u64, mod: u64): u64 {
  if (mod == 1) return 0;
  
  let result: u64 = 1;
  base = base % mod;
  
  while (exp > 0) {
    // If exp is odd, multiply base with result
    if (exp & 1) {
      result = (result * base) % mod;
    }
    // Square base and halve exp
    exp = exp >> 1;
    base = (base * base) % mod;
  }
  
  return result;
}

/**
 * Fast primality test using Miller-Rabin
 * Optimized for small primes (< 2^32)
 */
export function fastIsPrime(n: u32): bool {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if ((n & 1) == 0 || n % 3 == 0) return false;
  
  // Check small primes
  if (n < 9) return true;
  if (n % 5 == 0 || n % 7 == 0) return false;
  if (n < 121) return true; // 11 * 11
  
  // Miller-Rabin test with optimal witnesses for 32-bit integers
  const witnesses: u32[] = [2, 7, 61];
  
  // Write n-1 as d * 2^r
  let d = n - 1;
  let r = 0;
  while ((d & 1) == 0) {
    d >>= 1;
    r++;
  }
  
  for (let i = 0; i < witnesses.length; i++) {
    const a = witnesses[i];
    if (a >= n) continue;
    
    let x = u32(fastModExp(a, d, n));
    if (x == 1 || x == n - 1) continue;
    
    let composite = true;
    for (let j = 0; j < r - 1; j++) {
      x = u32((u64(x) * u64(x)) % n);
      if (x == n - 1) {
        composite = false;
        break;
      }
    }
    
    if (composite) return false;
  }
  
  return true;
}

/**
 * Fast GCD using binary algorithm
 * More efficient than Euclidean for large numbers
 */
export function fastGCD(a: u64, b: u64): u64 {
  if (a == 0) return b;
  if (b == 0) return a;
  
  // Find common factor of 2
  let shift: u32 = 0;
  while (((a | b) & 1) == 0) {
    a >>= 1;
    b >>= 1;
    shift++;
  }
  
  // Remove factors of 2 from a
  while ((a & 1) == 0) {
    a >>= 1;
  }
  
  do {
    // Remove factors of 2 from b
    while ((b & 1) == 0) {
      b >>= 1;
    }
    
    // Ensure a <= b
    if (a > b) {
      const temp = a;
      a = b;
      b = temp;
    }
    
    b = b - a;
  } while (b != 0);
  
  return a << shift;
}

/**
 * Fast hash combining for multiple values
 * Uses FNV-1a algorithm for speed
 */
export function fastHashCombine(values: Array<u64>): u64 {
  const FNV_PRIME: u64 = 0x100000001b3;
  const FNV_OFFSET: u64 = 0xcbf29ce484222325;
  
  let hash = FNV_OFFSET;
  for (let i = 0; i < values.length; i++) {
    hash ^= values[i];
    hash *= FNV_PRIME;
  }
  
  return hash;
}

/**
 * Fast array sum with unrolled loop
 */
export function fastArraySum(arr: Float64Array): f64 {
  const len = arr.length;
  let sum = 0.0;
  let i = 0;
  
  // Unroll by 4
  const unrollEnd = len - (len & 3);
  for (; i < unrollEnd; i += 4) {
    sum += arr[i] + arr[i + 1] + arr[i + 2] + arr[i + 3];
  }
  
  // Handle remaining elements
  for (; i < len; i++) {
    sum += arr[i];
  }
  
  return sum;
}

/**
 * Fast dot product with loop unrolling
 */
export function fastDotProduct(a: Float64Array, b: Float64Array): f64 {
  const len = a.length;
  if (len != b.length) return 0.0;
  
  let sum = 0.0;
  let i = 0;
  
  // Unroll by 4
  const unrollEnd = len - (len & 3);
  for (; i < unrollEnd; i += 4) {
    sum += a[i] * b[i] + a[i + 1] * b[i + 1] + 
           a[i + 2] * b[i + 2] + a[i + 3] * b[i + 3];
  }
  
  // Handle remaining elements
  for (; i < len; i++) {
    sum += a[i] * b[i];
  }
  
  return sum;
}

/**
 * Fast matrix multiplication for small matrices
 * Optimized for 3x3 and 4x4 matrices common in quantum operations
 */
export function fastMatMul3x3(a: StaticArray<f64>, b: StaticArray<f64>, result: StaticArray<f64>): void {
  // Assuming row-major order
  const a00 = unchecked(a[0]), a01 = unchecked(a[1]), a02 = unchecked(a[2]);
  const a10 = unchecked(a[3]), a11 = unchecked(a[4]), a12 = unchecked(a[5]);
  const a20 = unchecked(a[6]), a21 = unchecked(a[7]), a22 = unchecked(a[8]);
  
  const b00 = unchecked(b[0]), b01 = unchecked(b[1]), b02 = unchecked(b[2]);
  const b10 = unchecked(b[3]), b11 = unchecked(b[4]), b12 = unchecked(b[5]);
  const b20 = unchecked(b[6]), b21 = unchecked(b[7]), b22 = unchecked(b[8]);
  
  unchecked(result[0] = a00 * b00 + a01 * b10 + a02 * b20);
  unchecked(result[1] = a00 * b01 + a01 * b11 + a02 * b21);
  unchecked(result[2] = a00 * b02 + a01 * b12 + a02 * b22);
  
  unchecked(result[3] = a10 * b00 + a11 * b10 + a12 * b20);
  unchecked(result[4] = a10 * b01 + a11 * b11 + a12 * b21);
  unchecked(result[5] = a10 * b02 + a11 * b12 + a12 * b22);
  
  unchecked(result[6] = a20 * b00 + a21 * b10 + a22 * b20);
  unchecked(result[7] = a20 * b01 + a21 * b11 + a22 * b21);
  unchecked(result[8] = a20 * b02 + a21 * b12 + a22 * b22);
}

/**
 * Fast phase calculation using lookup table
 */
class PhaseCalculator {
  private static sinTable: StaticArray<f64>;
  private static cosTable: StaticArray<f64>;
  private static readonly TABLE_SIZE: i32 = 4096;
  private static initialized: bool = false;
  
  static initialize(): void {
    if (this.initialized) return;
    
    this.sinTable = new StaticArray<f64>(this.TABLE_SIZE);
    this.cosTable = new StaticArray<f64>(this.TABLE_SIZE);
    
    const step = 2.0 * Math.PI / this.TABLE_SIZE;
    for (let i = 0; i < this.TABLE_SIZE; i++) {
      const angle = i * step;
      unchecked(this.sinTable[i] = Math.sin(angle));
      unchecked(this.cosTable[i] = Math.cos(angle));
    }
    
    this.initialized = true;
  }
  
  static fastSin(phase: f64): f64 {
    if (!this.initialized) this.initialize();
    
    // Normalize phase to [0, 2π)
    phase = phase % (2.0 * Math.PI);
    if (phase < 0) phase += 2.0 * Math.PI;
    
    const index = i32((phase / (2.0 * Math.PI)) * this.TABLE_SIZE) & (this.TABLE_SIZE - 1);
    return unchecked(this.sinTable[index]);
  }
  
  static fastCos(phase: f64): f64 {
    if (!this.initialized) this.initialize();
    
    // Normalize phase to [0, 2π)
    phase = phase % (2.0 * Math.PI);
    if (phase < 0) phase += 2.0 * Math.PI;
    
    const index = i32((phase / (2.0 * Math.PI)) * this.TABLE_SIZE) & (this.TABLE_SIZE - 1);
    return unchecked(this.cosTable[index]);
  }
}

/**
 * Fast complex number operations
 */
export class FastComplex {
  constructor(
    public real: f64,
    public imag: f64
  ) {}
  
  static fromPolar(magnitude: f64, phase: f64): FastComplex {
    return new FastComplex(
      magnitude * PhaseCalculator.fastCos(phase),
      magnitude * PhaseCalculator.fastSin(phase)
    );
  }
  
  magnitude(): f64 {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }
  
  phase(): f64 {
    return Math.atan2(this.imag, this.real);
  }
  
  add(other: FastComplex): FastComplex {
    return new FastComplex(
      this.real + other.real,
      this.imag + other.imag
    );
  }
  
  multiply(other: FastComplex): FastComplex {
    return new FastComplex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }
  
  conjugate(): FastComplex {
    return new FastComplex(this.real, -this.imag);
  }
}

/**
 * Memory pool for frequently allocated objects
 */
export class ObjectPool<T> {
  private pool: Array<T>;
  private factory: () => T;
  private reset: (obj: T) => void;
  private maxSize: i32;
  
  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: i32 = 10,
    maxSize: i32 = 100
  ) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
    this.pool = new Array<T>();
    
    // Pre-allocate initial objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }
  
  /**
   * Gets an object from the pool
   */
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.factory();
  }
  
  /**
   * Returns an object to the pool
   */
  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
    }
  }
}

/**
 * Fast bit manipulation utilities
 */
export namespace BitOps {
  /**
   * Counts set bits (population count)
   */
  export function popcount32(n: u32): i32 {
    n = n - ((n >> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
    return ((((n + (n >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24);
  }
  
  /**
   * Finds position of highest set bit
   */
  export function highestBit32(n: u32): i32 {
    if (n == 0) return -1;
    return 31 - clz(n);
  }
  
  /**
   * Finds position of lowest set bit
   */
  export function lowestBit32(n: u32): i32 {
    if (n == 0) return -1;
    return ctz(n);
  }
  
  /**
   * Checks if number is power of 2
   */
  export function isPowerOf2(n: u32): bool {
    return n > 0 && (n & (n - 1)) == 0;
  }
  
  /**
   * Rounds up to next power of 2
   */
  export function nextPowerOf2(n: u32): u32 {
    if (n == 0) return 1;
    n--;
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    return n + 1;
  }
}

/**
 * Cache-friendly array operations
 */
export namespace CacheOps {
  /**
   * Prefetch hint for read
   */
  export function prefetchRead<T>(ptr: usize): void {
    // AssemblyScript doesn't have prefetch intrinsics yet
    // This is a placeholder for future optimization
  }
  
  /**
   * Process array in cache-friendly blocks
   */
  export function processInBlocks<T>(
    arr: Array<T>,
    blockSize: i32,
    processor: (block: Array<T>, start: i32, end: i32) => void
  ): void {
    const len = arr.length;
    for (let i = 0; i < len; i += blockSize) {
      const end = Math.min(i + blockSize, len);
      processor(arr, i, end);
    }
  }
}

/**
 * SIMD operations placeholder
 * AssemblyScript SIMD support is still evolving
 */
export namespace SIMD {
  /**
   * Fast array addition using SIMD (when available)
   */
  export function addArrays(a: Float64Array, b: Float64Array, result: Float64Array): void {
    const len = a.length;
    // For now, fallback to scalar operations
    // TODO: Use v128 operations when stable
    for (let i = 0; i < len; i++) {
      unchecked(result[i] = a[i] + b[i]);
    }
  }
}

/**
 * Initialize performance optimizations
 */
export function initializePerformance(): void {
  PhaseCalculator.initialize();
}