/**
 * Object Pool Module for the Prime Resonance Network
 * 
 * Provides efficient object pooling to reduce garbage collection pressure
 * and improve performance for frequently allocated objects.
 */

/**
 * Generic object pool interface
 */
export interface Poolable {
  reset(): void;
}

/**
 * Generic object pool implementation
 */
export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private factory: () => T;
  private maxSize: i32;
  private created: i32 = 0;
  
  constructor(factory: () => T, maxSize: i32 = 100) {
    this.factory = factory;
    this.maxSize = maxSize;
  }
  
  /**
   * Get an object from the pool or create a new one
   */
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    
    this.created++;
    return this.factory();
  }
  
  /**
   * Return an object to the pool
   */
  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      obj.reset();
      this.pool.push(obj);
    }
  }
  
  /**
   * Clear the pool
   */
  clear(): void {
    this.pool = [];
  }
  
  /**
   * Get pool statistics
   */
  getStats(): PoolStats {
    return new PoolStats(
      this.pool.length,
      this.created,
      this.maxSize
    );
  }
}

/**
 * Pool statistics
 */
export class PoolStats {
  constructor(
    public available: i32,
    public totalCreated: i32,
    public maxSize: i32
  ) {}
  
  get utilization(): f64 {
    return this.totalCreated > 0 
      ? f64(this.totalCreated - this.available) / f64(this.totalCreated)
      : 0.0;
  }
}

/**
 * Poolable ExtendedGCDResult for math operations
 */
export class PoolableExtendedGCDResult implements Poolable {
  gcd: i64 = 0;
  x: i64 = 0;
  y: i64 = 0;
  
  reset(): void {
    this.gcd = 0;
    this.x = 0;
    this.y = 0;
  }
  
  set(gcd: i64, x: i64, y: i64): void {
    this.gcd = gcd;
    this.x = x;
    this.y = y;
  }
}

/**
 * Poolable Complex number
 */
export class PoolableComplex implements Poolable {
  real: f64 = 0;
  imag: f64 = 0;
  
  reset(): void {
    this.real = 0;
    this.imag = 0;
  }
  
  set(real: f64, imag: f64): void {
    this.real = real;
    this.imag = imag;
  }
  
  add(other: PoolableComplex): void {
    this.real += other.real;
    this.imag += other.imag;
  }
  
  multiply(other: PoolableComplex): void {
    const newReal = this.real * other.real - this.imag * other.imag;
    const newImag = this.real * other.imag + this.imag * other.real;
    this.real = newReal;
    this.imag = newImag;
  }
  
  magnitude(): f64 {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }
  
  phase(): f64 {
    return Math.atan2(this.imag, this.real);
  }
}

/**
 * Poolable array wrapper for temporary calculations
 */
export class PoolableArray<T> implements Poolable {
  private data: T[] = [];
  private _length: i32 = 0;
  
  reset(): void {
    this._length = 0;
    // Don't clear the array, just reset the length for performance
  }
  
  get length(): i32 {
    return this._length;
  }
  
  push(value: T): void {
    if (this._length < this.data.length) {
      this.data[this._length] = value;
    } else {
      this.data.push(value);
    }
    this._length++;
  }
  
  get(index: i32): T {
    if (index >= this._length) {
      throw new Error("Index out of bounds");
    }
    return this.data[index];
  }
  
  set(index: i32, value: T): void {
    if (index >= this._length) {
      throw new Error("Index out of bounds");
    }
    this.data[index] = value;
  }
  
  toArray(): T[] {
    const result = new Array<T>(this._length);
    for (let i = 0; i < this._length; i++) {
      result[i] = this.data[i];
    }
    return result;
  }
}

/**
 * Poolable BigInt-like structure for large number operations
 */
export class PoolableBigInt implements Poolable {
  private static readonly CHUNK_SIZE: i32 = 32;
  private chunks: u32[] = [];
  private _length: i32 = 0;
  private _negative: bool = false;
  
  reset(): void {
    this._length = 0;
    this._negative = false;
  }
  
  setFromU64(value: u64): void {
    this.reset();
    if (value == 0) {
      this._length = 0;
      return;
    }
    
    this.chunks[0] = u32(value & 0xFFFFFFFF);
    this.chunks[1] = u32(value >> 32);
    this._length = (this.chunks[1] == 0) ? 1 : 2;
  }
  
  isZero(): bool {
    return this._length == 0;
  }
  
  // Add more BigInt operations as needed
}

/**
 * Global object pools for mathematical operations
 */
export class MathObjectPools {
  static extendedGCDPool: ObjectPool<PoolableExtendedGCDResult> | null = null;
  static complexPool: ObjectPool<PoolableComplex> | null = null;
  static u64ArrayPool: ObjectPool<PoolableArray<u64>> | null = null;
  static i32ArrayPool: ObjectPool<PoolableArray<i32>> | null = null;
  static bigIntPool: ObjectPool<PoolableBigInt> | null = null;
  
  static initialize(): void {
    MathObjectPools.extendedGCDPool = new ObjectPool<PoolableExtendedGCDResult>(
      () => new PoolableExtendedGCDResult(),
      50
    );
    
    MathObjectPools.complexPool = new ObjectPool<PoolableComplex>(
      () => new PoolableComplex(),
      100
    );
    
    MathObjectPools.u64ArrayPool = new ObjectPool<PoolableArray<u64>>(
      () => new PoolableArray<u64>(),
      20
    );
    
    MathObjectPools.i32ArrayPool = new ObjectPool<PoolableArray<i32>>(
      () => new PoolableArray<i32>(),
      20
    );
    
    MathObjectPools.bigIntPool = new ObjectPool<PoolableBigInt>(
      () => new PoolableBigInt(),
      10
    );
  }
  
  /**
   * Get statistics for all pools
   */
  static getAllStats(): string {
    if (!MathObjectPools.extendedGCDPool) {
      return "Math Object Pools not initialized";
    }
    return `Math Object Pool Statistics:
  ExtendedGCD Pool: ${MathObjectPools.formatPoolStats(MathObjectPools.extendedGCDPool!.getStats())}
  Complex Pool: ${MathObjectPools.formatPoolStats(MathObjectPools.complexPool!.getStats())}
  U64 Array Pool: ${MathObjectPools.formatPoolStats(MathObjectPools.u64ArrayPool!.getStats())}
  I32 Array Pool: ${MathObjectPools.formatPoolStats(MathObjectPools.i32ArrayPool!.getStats())}
  BigInt Pool: ${MathObjectPools.formatPoolStats(MathObjectPools.bigIntPool!.getStats())}`;
  }
  
  private static formatPoolStats(stats: PoolStats): string {
    return `available=${stats.available}, created=${stats.totalCreated}, utilization=${(stats.utilization * 100).toString()}%`;
  }
  
  /**
   * Clear all pools
   */
  static clearAll(): void {
    if (MathObjectPools.extendedGCDPool) MathObjectPools.extendedGCDPool.clear();
    if (MathObjectPools.complexPool) MathObjectPools.complexPool.clear();
    if (MathObjectPools.u64ArrayPool) MathObjectPools.u64ArrayPool.clear();
    if (MathObjectPools.i32ArrayPool) MathObjectPools.i32ArrayPool.clear();
    if (MathObjectPools.bigIntPool) MathObjectPools.bigIntPool.clear();
  }
}

/**
 * Example usage in mathematical operations:
 * 
 * ```typescript
 * // Using object pool for ExtendedGCD
 * function extendedGCDPooled(a: i64, b: i64): PoolableExtendedGCDResult {
 *   const result = MathObjectPools.extendedGCDPool.acquire();
 *   
 *   // Perform calculation
 *   let oldR = a, r = b;
 *   let oldS: i64 = 1, s: i64 = 0;
 *   let oldT: i64 = 0, t: i64 = 1;
 *   
 *   while (r != 0) {
 *     const quotient = oldR / r;
 *     
 *     let temp = r;
 *     r = oldR - quotient * r;
 *     oldR = temp;
 *     
 *     temp = s;
 *     s = oldS - quotient * s;
 *     oldS = temp;
 *     
 *     temp = t;
 *     t = oldT - quotient * t;
 *     oldT = temp;
 *   }
 *   
 *   result.set(oldR, oldS, oldT);
 *   return result;
 * }
 * 
 * // Usage
 * const gcdResult = extendedGCDPooled(48, 18);
 * // Use the result...
 * MathObjectPools.extendedGCDPool.release(gcdResult);
 * ```
 */

// Initialize the math object pools
MathObjectPools.initialize();