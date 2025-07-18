/**
 * Extended Euclidean Algorithm Module
 * Provides extended GCD computation for modular arithmetic
 */

import { MathObjectPools, PoolableExtendedGCDResult } from './object-pool';

/**
 * Extended GCD result
 */
export class ExtendedGCDResult {
  constructor(
    public gcd: i64,
    public x: i64,
    public y: i64
  ) {}
}

/**
 * Extended Euclidean algorithm (iterative version for better performance)
 * Uses object pooling for better memory efficiency
 */
export function extendedGCD(a: i64, b: i64): ExtendedGCDResult {
  // Try to use pooled version for better performance
  const pooledResult = extendedGCDPooled(a, b);
  const result = new ExtendedGCDResult(pooledResult.gcd, pooledResult.x, pooledResult.y);
  MathObjectPools.extendedGCDPool!.release(pooledResult);
  return result;
}

/**
 * Pooled version of extended GCD for internal use
 */
function extendedGCDPooled(a: i64, b: i64): PoolableExtendedGCDResult {
  const result = MathObjectPools.extendedGCDPool!.acquire();
  
  let oldR = a, r = b;
  let oldS: i64 = 1, s: i64 = 0;
  let oldT: i64 = 0, t: i64 = 1;
  
  while (r != 0) {
    const quotient = oldR / r;
    
    let temp = r;
    r = oldR - quotient * r;
    oldR = temp;
    
    temp = s;
    s = oldS - quotient * s;
    oldS = temp;
    
    temp = t;
    t = oldT - quotient * t;
    oldT = temp;
  }
  
  result.gcd = oldR;
  result.x = oldS;
  result.y = oldT;
  
  return result;
}

/**
 * Optimized modular inverse using extended GCD
 */
export function modInverse(a: u64, m: u64): u64 {
  const result = extendedGCD(i64(a), i64(m));
  if (result.gcd != 1) return 0; // No inverse exists
  
  return u64((result.x % i64(m) + i64(m)) % i64(m));
}