/**
 * Montgomery Multiplication Module
 * Provides efficient Montgomery multiplication for modular arithmetic
 */

import { extendedGCD } from './math-extended-gcd';

/**
 * Count trailing zeros in a number
 */
function countTrailingZeros(n: u64): i32 {
  if (n == 0) return 64;
  let count = 0;
  while ((n & 1) == 0) {
    n >>= 1;
    count++;
  }
  return count;
}

/**
 * Modular inverse for powers of 2
 */
function modInversePower2(a: u64, k: i32): u64 {
  // Use extended Euclidean algorithm
  let x: u64 = 1;
  let y: u64 = 0;
  let u: u64 = a;
  let v: u64 = u64(1) << u64(k);
  
  while (u != 0) {
    while ((u & 1) == 0) {
      u >>= 1;
      if ((x & 1) == 0) {
        x >>= 1;
      } else {
        x = (x + v) >> 1;
      }
    }
    
    while ((v & 1) == 0) {
      v >>= 1;
      if ((y & 1) == 0) {
        y >>= 1;
      } else {
        y = (y + a) >> 1;
      }
    }
    
    if (u >= v) {
      u -= v;
      x -= y;
    } else {
      v -= u;
      y -= x;
    }
  }
  
  return y;
}

/**
 * Montgomery multiplication context for efficient modular arithmetic
 */
export class MontgomeryContext {
  private n: u64;      // Modulus
  private r: u64;      // R = 2^k where k = bit length of n
  private rInv: u64;   // R^(-1) mod n
  private nPrime: u64; // -n^(-1) mod R
  
  constructor(modulus: u64) {
    this.n = modulus;
    
    // Calculate R as the smallest power of 2 greater than n
    let k = 0;
    let temp = modulus;
    while (temp > 0) {
      temp >>= 1;
      k++;
    }
    this.r = u64(1) << u64(k);
    
    // Calculate R^(-1) mod n and -n^(-1) mod R
    const gcdResult = extendedGCD(i64(this.r), i64(this.n));
    this.rInv = u64((gcdResult.x + i64(this.n)) % i64(this.n));
    
    // Calculate -n^(-1) mod R
    const nInvModR = modInversePower2(this.n, k);
    this.nPrime = (this.r - nInvModR) & (this.r - 1);
  }
  
  /**
   * Convert to Montgomery form: a' = a * R mod n
   */
  toMontgomery(a: u64): u64 {
    return this.mulMod(a, this.r);
  }
  
  /**
   * Convert from Montgomery form: a = a' * R^(-1) mod n
   */
  fromMontgomery(a: u64): u64 {
    return this.montgomeryReduce(a);
  }
  
  /**
   * Montgomery multiplication: (a * b * R^(-1)) mod n
   */
  montgomeryMul(a: u64, b: u64): u64 {
    const t = a * b;
    const m = (t * this.nPrime) & (this.r - 1);
    const u = (t + m * this.n) >> countTrailingZeros(this.r);
    return u >= this.n ? u - this.n : u;
  }
  
  /**
   * Montgomery reduction: (a * R^(-1)) mod n
   */
  private montgomeryReduce(a: u64): u64 {
    const m = (a * this.nPrime) & (this.r - 1);
    const t = (a + m * this.n) >> countTrailingZeros(this.r);
    return t >= this.n ? t - this.n : t;
  }
  
  /**
   * Basic modular multiplication
   */
  private mulMod(a: u64, b: u64): u64 {
    // Fast path for small values
    if (a < 0x100000 && b < 0x100000) {
      return (a * b) % this.n;
    }
    
    // Use double-and-add algorithm for large values
    let result: u64 = 0;
    a = a % this.n;
    b = b % this.n;
    
    while (b > 0) {
      if (b & 1) {
        result = this.addMod(result, a);
      }
      a = this.addMod(a, a);
      b >>= 1;
    }
    
    return result;
  }
  
  /**
   * Modular addition with overflow protection
   */
  private addMod(a: u64, b: u64): u64 {
    const sum = a + b;
    return sum >= this.n ? sum - this.n : sum;
  }
}

/**
 * Optimized modular exponentiation using Montgomery multiplication
 * Computes (base^exp) % mod efficiently
 */
export function modExpMontgomery(base: u64, exp: u64, mod: u64): u64 {
  if (mod == 1) return 0;
  if (exp == 0) return 1;
  if (exp == 1) return base % mod;
  
  // For small exponents, use simple method
  if (exp < 16) {
    return modExpSimple(base, exp, mod);
  }
  
  // Use Montgomery multiplication for larger exponents
  const ctx = new MontgomeryContext(mod);
  let result = ctx.toMontgomery(1);
  let b = ctx.toMontgomery(base % mod);
  
  while (exp > 0) {
    if (exp & 1) {
      result = ctx.montgomeryMul(result, b);
    }
    b = ctx.montgomeryMul(b, b);
    exp >>= 1;
  }
  
  return ctx.fromMontgomery(result);
}

/**
 * Simple modular exponentiation (fallback for small values)
 */
function modExpSimple(base: u64, exp: u64, mod: u64): u64 {
  if (mod == 1) return 0;
  
  let result: u64 = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 == 1) {
      result = (result * base) % mod;
    }
    exp = exp >> 1;
    base = (base * base) % mod;
  }
  
  return result;
}