/**
 * Miller-Rabin Primality Testing Module
 * Provides deterministic Miller-Rabin primality testing
 */

import { primeCache } from './math-cache';

/**
 * Deterministic Miller-Rabin witnesses for different ranges
 * These witnesses guarantee correct primality testing without randomness
 */
export const MILLER_RABIN_WITNESSES_32: u32[] = [2, 7, 61];
export const MILLER_RABIN_WITNESSES_64: u64[] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

/**
 * Optimized modular exponentiation for 32-bit integers
 */
function modExp32(base: u32, exp: u32, mod: u32): u32 {
  let result: u32 = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp & 1) {
      result = u32((u64(result) * u64(base)) % u64(mod));
    }
    base = u32((u64(base) * u64(base)) % u64(mod));
    exp >>= 1;
  }
  
  return result;
}

/**
 * Miller-Rabin witness test for 32-bit
 */
function millerRabinWitness32(n: u32, a: u32, d: u32, r: i32): bool {
  let x = modExp32(a, d, n);
  
  if (x == 1 || x == n - 1) return true;
  
  for (let i = 0; i < r - 1; i++) {
    x = u32((u64(x) * u64(x)) % u64(n));
    if (x == n - 1) return true;
  }
  
  return false;
}

/**
 * Deterministic Miller-Rabin for 32-bit integers
 */
export function millerRabinDeterministic32(n: u32): bool {
  if (n < 2) return false;
  if (n == 2 || n == 3) return true;
  if (n % 2 == 0) return false;
  
  // Write n-1 as 2^r * d
  let d = n - 1;
  let r = 0;
  while (d % 2 == 0) {
    d /= 2;
    r++;
  }
  
  // Test with deterministic witnesses
  for (let i = 0; i < MILLER_RABIN_WITNESSES_32.length; i++) {
    const a = MILLER_RABIN_WITNESSES_32[i];
    if (a >= n) continue;
    
    if (!millerRabinWitness32(n, a, d, r)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Miller-Rabin witness test for 64-bit
 */
function millerRabinWitness64(n: u64, a: u64, d: u64, r: i32): bool {
  let x = modExp64(a, d, n);
  
  if (x == 1 || x == n - 1) return true;
  
  for (let i = 0; i < r - 1; i++) {
    x = mulMod64(x, x, n);
    if (x == n - 1) return true;
  }
  
  return false;
}

/**
 * Deterministic Miller-Rabin for 64-bit integers
 */
export function millerRabinDeterministic64(n: u64): bool {
  // Write n-1 as 2^r * d
  let d = n - 1;
  let r = 0;
  while (d % 2 == 0) {
    d /= 2;
    r++;
  }
  
  // Test with deterministic witnesses
  for (let i = 0; i < MILLER_RABIN_WITNESSES_64.length; i++) {
    const a = MILLER_RABIN_WITNESSES_64[i];
    if (a >= n) continue;
    
    if (!millerRabinWitness64(n, a, d, r)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Modular exponentiation for 64-bit integers
 */
function modExp64(base: u64, exp: u64, mod: u64): u64 {
  if (mod == 1) return 0;
  
  let result: u64 = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 == 1) {
      result = mulMod64(result, base, mod);
    }
    exp = exp >> 1;
    base = mulMod64(base, base, mod);
  }
  
  return result;
}

/**
 * Modular multiplication for 64-bit avoiding overflow
 */
function mulMod64(a: u64, b: u64, mod: u64): u64 {
  // Fast path for small values
  if (a < 0x100000 && b < 0x100000) {
    return (a * b) % mod;
  }
  
  // Use double-and-add algorithm for large values
  let result: u64 = 0;
  a = a % mod;
  b = b % mod;
  
  while (b > 0) {
    if (b & 1) {
      result = addMod64(result, a, mod);
    }
    a = addMod64(a, a, mod);
    b >>= 1;
  }
  
  return result;
}

/**
 * Modular addition with overflow protection
 */
function addMod64(a: u64, b: u64, mod: u64): u64 {
  const sum = a + b;
  return sum >= mod ? sum - mod : sum;
}