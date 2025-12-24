/**
 * Basic Mathematical Operations Module
 * Provides standard mathematical operations without SIMD
 */

/**
 * Optimized modular multiplication avoiding overflow
 * Uses different strategies based on operand sizes
 */
export function mulMod(a: u64, b: u64, mod: u64): u64 {
  // Fast path for small values
  if (a < 0x100000 && b < 0x100000) {
    return (a * b) % mod;
  }
  
  // Check if we can use direct multiplication without overflow
  const highBits = Math.clz32(u32(a >> 32)) + Math.clz32(u32(b >> 32));
  if (highBits >= 32) {
    return (a * b) % mod;
  }
  
  // Use double-and-add algorithm for large values
  let result: u64 = 0;
  a = a % mod;
  b = b % mod;
  
  while (b > 0) {
    if (b & 1) {
      result = addMod(result, a, mod);
    }
    a = addMod(a, a, mod);
    b >>= 1;
  }
  
  return result;
}

/**
 * Modular addition with overflow protection
 */
export function addMod(a: u64, b: u64, mod: u64): u64 {
  const sum = a + b;
  return sum >= mod ? sum - mod : sum;
}

/**
 * Standard modular exponentiation
 */
export function modExp(base: u64, exp: u64, mod: u64): u64 {
  if (mod == 1) return 0;
  
  let result: u64 = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 == 1) {
      result = mulMod(result, base, mod);
    }
    exp = exp >> 1;
    base = mulMod(base, base, mod);
  }
  
  return result;
}

/**
 * Standard array multiplication (element-wise)
 */
export function arrayMul(a: Float64Array, b: Float64Array, result: Float64Array): void {
  const len = Math.min(a.length, Math.min(b.length, result.length));
  
  for (let i = 0; i < len; i++) {
    result[i] = a[i] * b[i];
  }
}

/**
 * Standard array addition (element-wise)
 */
export function arrayAdd(a: Float64Array, b: Float64Array, result: Float64Array): void {
  const len = Math.min(a.length, Math.min(b.length, result.length));
  
  for (let i = 0; i < len; i++) {
    result[i] = a[i] + b[i];
  }
}

/**
 * Standard dot product calculation
 */
export function dotProduct(a: Float64Array, b: Float64Array): f64 {
  const len = Math.min(a.length, b.length);
  let sum: f64 = 0.0;
  
  for (let i = 0; i < len; i++) {
    sum += a[i] * b[i];
  }
  
  return sum;
}

/**
 * Vector magnitude calculation
 */
export function vectorMagnitude(v: Float64Array): f64 {
  let sum: f64 = 0.0;
  
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  
  return Math.sqrt(sum);
}

/**
 * Vector normalization
 */
export function normalizeVector(v: Float64Array, result: Float64Array): void {
  const magnitude = vectorMagnitude(v);
  if (magnitude == 0.0) return;
  
  const len = Math.min(v.length, result.length);
  for (let i = 0; i < len; i++) {
    result[i] = v[i] / magnitude;
  }
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: f64, b: f64, t: f64): f64 {
  return a + t * (b - a);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: f64, min: f64, max: f64): f64 {
  return Math.max(min, Math.min(max, value));
}

/**
 * Fast inverse square root (approximation)
 */
export function fastInvSqrt(x: f64): f64 {
  if (x <= 0.0) return 0.0;
  
  // Use built-in sqrt for now (more reliable than fast approximation)
  return 1.0 / Math.sqrt(x);
}

/**
 * Check if two floating point numbers are approximately equal
 */
export function approxEqual(a: f64, b: f64, epsilon: f64 = 1e-10): bool {
  return Math.abs(a - b) < epsilon;
}

/**
 * Safe division (returns 0 if divisor is 0)
 */
export function safeDivide(a: f64, b: f64): f64 {
  return b == 0.0 ? 0.0 : a / b;
}

/**
 * Calculate the greatest common divisor
 */
export function gcd(a: u64, b: u64): u64 {
  while (b != 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Calculate the least common multiple
 */
export function lcm(a: u64, b: u64): u64 {
  return (a * b) / gcd(a, b);
}

/**
 * Check if a number is a perfect square
 */
export function isPerfectSquare(n: u64): bool {
  if (n < 0) return false;
  const root = u64(Math.sqrt(f64(n)));
  return root * root == n;
}

/**
 * Integer square root (floor)
 */
export function isqrt(n: u64): u64 {
  if (n < 2) return n;
  
  let x = n;
  let y = (x + 1) / 2;
  
  while (y < x) {
    x = y;
    y = (x + n / x) / 2;
  }
  
  return x;
}