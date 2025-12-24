/**
 * Unified Mathematical Module for the Prime Resonance Network
 * Combines and optimizes math utilities from prime-utils.ts and utils/math.ts
 * 
 * This module provides:
 * - Prime number operations (generation, testing, factorization)
 * - Modular arithmetic (exponentiation, inverse, square roots)
 * - Number theory functions (GCD, LCM, Euler's totient)
 * - General mathematical utilities (factorial, fibonacci, binomial)
 * - Advanced algorithms (Pollard's rho, Chinese Remainder Theorem)
 */

import { Prime } from "../types";

export const PI: f64 = 3.14159265358979323846;

/**
 * Miller-Rabin primality test for large numbers (u64)
 * Probabilistic test with configurable accuracy
 */
export function isPrimeLarge(n: u64, k: i32 = 5): bool {
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
  
  // Witness loop
  for (let i = 0; i < k; i++) {
    // @ts-ignore
    const a = 2 + u64(Math.random() * f64(n - 4));
    let x = modExp(a, d, n);
    
    if (x == 1 || x == n - 1) continue;
    
    let continueWitnessLoop = false;
    for (let j = 0; j < r - 1; j++) {
      x = (x * x) % n;
      if (x == n - 1) {
        continueWitnessLoop = true;
        break;
      }
    }
    
    if (!continueWitnessLoop) return false;
  }
  
  return true;
}

/**
 * Optimized primality test for smaller numbers (i32)
 * Deterministic test using trial division
 */
// @ts-ignore
export function isPrime(n: i32): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
    i += 6;
  }
  
  return true;
}

/**
 * Generate a random prime number in the given bit range
 */
// @ts-ignore
export function generatePrimeLarge(minBits: i32, maxBits: i32): u64 {
  // @ts-ignore
  const minValue = u64(1) << u64(minBits - 1);
  // @ts-ignore
  const maxValue = (u64(1) << u64(maxBits)) - 1;
  
  // @ts-ignore
  let candidate: u64;
  do {
    // @ts-ignore
    candidate = minValue + u64(Math.random() * f64(maxValue - minValue));
    // Make sure it's odd
    candidate |= 1;
  } while (!isPrimeLarge(candidate));
  
  return candidate;
}

/**
 * Generate an array of the first n prime numbers
 */
// @ts-ignore
export function generatePrimes(n: i32): Array<Prime> {
  const primes = new Array<Prime>();
  if (n <= 0) return primes;
  
  primes.push(2);
  if (n == 1) return primes;
  
  let candidate = 3;
  while (primes.length < n) {
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
    candidate += 2; // Skip even numbers
  }
  
  return primes;
}

/**
 * Generate primes for u64 range
 */
// @ts-ignore
export function generatePrimesLarge(n: i32): Array<u64> {
  // @ts-ignore
  const primes = new Array<u64>();
  if (n <= 0) return primes;
  
  primes.push(2);
  if (n == 1) return primes;
  
  // @ts-ignore
  let candidate: u64 = 3;
  while (primes.length < n) {
    if (isPrimeLarge(candidate)) {
      primes.push(candidate);
    }
    candidate += 2; // Skip even numbers
  }
  
  return primes;
}

/**
 * Sieve of Eratosthenes for generating primes up to limit
 */
// @ts-ignore
export function sieveOfEratosthenes(limit: i32): Array<Prime> {
  if (limit < 2) return [];
  
  const isPrimeArray = new Array<boolean>(limit + 1);
  for (let i = 0; i <= limit; i++) {
    isPrimeArray[i] = true;
  }
  
  isPrimeArray[0] = false;
  isPrimeArray[1] = false;
  
  for (let i = 2; i * i <= limit; i++) {
    if (isPrimeArray[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrimeArray[j] = false;
      }
    }
  }
  
  const primes = new Array<Prime>();
  for (let i = 2; i <= limit; i++) {
    if (isPrimeArray[i]) {
      primes.push(i);
    }
  }
  
  return primes;
}

/**
 * Sieve for u64 range
 */
// @ts-ignore
export function sieveOfEratosthenesLarge(limit: u64): Array<u64> {
  // @ts-ignore
  if (limit < 2) return new Array<u64>();
  
  // @ts-ignore
  const sieve = new Array<bool>(i32(limit + 1));
  for (let i = 0; i <= limit; i++) {
    sieve[i] = true;
  }
  
  sieve[0] = false;
  sieve[1] = false;
  
  // @ts-ignore
  for (let i: u64 = 2; i * i <= limit; i++) {
    // @ts-ignore
    if (sieve[i32(i)]) {
      for (let j = i * i; j <= limit; j += i) {
        // @ts-ignore
        sieve[i32(j)] = false;
      }
    }
  }
  
  // @ts-ignore
  const primes = new Array<u64>();
  // @ts-ignore
  for (let i: u64 = 2; i <= limit; i++) {
    // @ts-ignore
    if (sieve[i32(i)]) {
      primes.push(i);
    }
  }
  
  return primes;
}

/**
 * Get the nth prime number
 */
// @ts-ignore
export function nthPrime(n: i32): Prime {
  if (n <= 0) throw new Error("n must be positive");
  if (n === 1) return 2;
  
  let count = 1;
  let candidate = 3;
  
  while (count < n) {
    if (isPrime(candidate)) {
      count++;
    }
    if (count < n) {
      candidate += 2;
    }
  }
  
  return candidate;
}

/**
 * Find the next prime after n
 */
// @ts-ignore
export function nextPrime(n: i32): Prime {
  if (n < 2) return 2;
  
  let candidate = n + 1;
  if (candidate % 2 === 0) candidate++; // Make odd
  
  while (!isPrime(candidate)) {
    candidate += 2;
  }
  
  return candidate;
}

/**
 * Modular exponentiation: (base^exp) % mod
 * Uses binary exponentiation for efficiency
 */
// @ts-ignore
export function modExp(base: u64, exp: u64, mod: u64): u64 {
  if (mod == 1) return 0;
  
  // @ts-ignore
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
 * Modular exponentiation for i64
 */
// @ts-ignore
export function modPow(base: i64, exp: i64, mod: i64): i64 {
  if (mod === 1) return 0;
  
  // @ts-ignore
  let result: i64 = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = exp >> 1;
    base = (base * base) % mod;
  }
  
  return result;
}

/**
 * Modular multiplication avoiding overflow
 */
// @ts-ignore
export function mulMod(a: u64, b: u64, mod: u64): u64 {
  // Simple method for small values
  if (a < 0x100000 && b < 0x100000) {
    return (a * b) % mod;
  }
  
  // Russian peasant multiplication
  // @ts-ignore
  let result: u64 = 0;
  a = a % mod;
  
  while (b > 0) {
    if (b % 2 == 1) {
      result = (result + a) % mod;
    }
    a = (a * 2) % mod;
    b = b >> 1;
  }
  
  return result;
}

/**
 * Result of extended GCD
 */
export class ExtendedGCDResult {
  constructor(
    // @ts-ignore
    public gcd: i64,
    // @ts-ignore
    public x: i64,
    // @ts-ignore
    public y: i64
  ) {}
}

/**
 * Extended Euclidean algorithm
 * Returns gcd and Bezout coefficients
 */
// @ts-ignore
export function extendedGCD(a: i64, b: i64): ExtendedGCDResult {
  if (b == 0) {
    return new ExtendedGCDResult(a, 1, 0);
  }
  
  const result = extendedGCD(b, a % b);
  const x = result.y;
  const y = result.x - (a / b) * result.y;
  
  return new ExtendedGCDResult(result.gcd, x, y);
}

/**
 * Alias for compatibility
 */
// @ts-ignore
export function extendedGcd(a: i64, b: i64): ExtendedGCDResult {
  return extendedGCD(a, b);
}

/**
 * Greatest common divisor using Euclidean algorithm (u64)
 */
// @ts-ignore
export function gcdLarge(a: u64, b: u64): u64 {
  while (b != 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Greatest common divisor (i64)
 */
// @ts-ignore
export function gcd(a: i64, b: i64): i64 {
  // @ts-ignore
  a = <i64>Math.abs(<f64>a);
  // @ts-ignore
  b = <i64>Math.abs(<f64>b);
  
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  
  return a;
}

/**
 * Least common multiple (u64)
 */
// @ts-ignore
export function lcmLarge(a: u64, b: u64): u64 {
  return (a * b) / gcdLarge(a, b);
}

/**
 * Least common multiple (i64)
 */
// @ts-ignore
export function lcm(a: i64, b: i64): i64 {
  // @ts-ignore
  return <i64>(Math.abs(<f64>(a * b)) / <f64>gcd(a, b));
}

/**
 * Modular multiplicative inverse
 * Returns a^-1 mod m
 */
// @ts-ignore
export function modInverse(a: i64, m: i64): i64 {
  const result = extendedGCD(a, m);
  
  if (result.gcd !== 1) {
    return -1; // Modular inverse does not exist
  }
  
  return ((result.x % m) + m) % m;
}

/**
 * Modular inverse for u64
 */
// @ts-ignore
export function modInverseLarge(a: u64, m: u64): u64 {
  // @ts-ignore
  const result = extendedGCD(i64(a), i64(m));
  
  if (result.gcd != 1) {
    // No inverse exists
    return 0;
  }
  
  // Make sure result is positive
  // @ts-ignore
  let inv = result.x % i64(m);
  // @ts-ignore
  if (inv < 0) inv += i64(m);
  
  // @ts-ignore
  return u64(inv);
}

/**
 * Generate a safe prime (p where (p-1)/2 is also prime)
 */
// @ts-ignore
export function generateSafePrime(bits: i32): u64 {
  // @ts-ignore
  let p: u64;
  do {
    const q = generatePrimeLarge(bits - 1, bits - 1);
    p = 2 * q + 1;
  } while (!isPrimeLarge(p));
  
  return p;
}

/**
 * Check if a number is a Mersenne prime (2^p - 1)
 */
// @ts-ignore
export function isMersennePrime(p: i32): boolean {
  if (!isPrime(p)) return false;
  
  // For i32, we need to be careful about overflow
  if (p >= 31) return false; // Would overflow i32
  
  const mersenne = (1 << p) - 1;
  return isPrime(mersenne);
}

/**
 * Check if a u64 is a Mersenne prime
 */
// @ts-ignore
export function isMersennePrimeLarge(p: u64): bool {
  if (!isPrimeLarge(p)) return false;
  
  // @ts-ignore
  const mersenne = (u64(1) << p) - 1;
  return isPrimeLarge(mersenne);
}

/**
 * Pollard's rho algorithm for integer factorization
 */
// @ts-ignore
export function pollardRho(n: u64): u64 {
  if (n % 2 == 0) return 2;
  if (isPrimeLarge(n)) return n;
  
  // @ts-ignore
  let x: u64 = 2;
  // @ts-ignore
  let y: u64 = 2;
  // @ts-ignore
  let d: u64 = 1;
  
  // @ts-ignore
  function f(x: u64): u64 {
    return (x * x + 1) % n;
  }
  
  while (d == 1) {
    x = f(x);
    y = f(f(y));
    // @ts-ignore
    d = gcdLarge(abs(i64(x) - i64(y)), n);
  }
  
  return d == n ? 0 : d;
}

/**
 * Complete factorization of a number (i32)
 */
// @ts-ignore
export function primeFactorization(n: i32): Map<Prime, i32> {
  // @ts-ignore
  const factors = new Map<Prime, i32>();
  
  if (n <= 1) return factors;
  
  // Check for factor of 2
  let count = 0;
  while (n % 2 === 0) {
    count++;
    n /= 2;
  }
  if (count > 0) {
    factors.set(2, count);
  }
  
  // Check odd factors
  let factor = 3;
  while (factor * factor <= n) {
    count = 0;
    while (n % factor === 0) {
      count++;
      n /= factor;
    }
    if (count > 0) {
      factors.set(factor, count);
    }
    factor += 2;
  }
  
  // If n is still greater than 1, it's a prime factor
  if (n > 1) {
    factors.set(n, 1);
  }
  
  return factors;
}

/**
 * Complete factorization of a u64
 */
// @ts-ignore
export function factorize(n: u64): Array<u64> {
  // @ts-ignore
  const factors = new Array<u64>();
  
  if (n <= 1) return factors;
  
  // Handle small primes
  while (n % 2 == 0) {
    factors.push(2);
    n /= 2;
  }
  
  // @ts-ignore
  for (let i: u64 = 3; i * i <= n; i += 2) {
    while (n % i == 0) {
      factors.push(i);
      n /= i;
    }
  }
  
  if (n > 2) {
    factors.push(n);
  }
  
  return factors;
}

/**
 * Euler's totient function φ(n) for i32
 * Counts positive integers up to n that are coprime to n
 */
// @ts-ignore
export function eulerTotient(n: i32): i32 {
  if (n <= 0) return 0;
  
  let result = n;
  const factors = primeFactorization(n);
  
  const keys = factors.keys();
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    result = result - result / p;
  }
  
  return result;
}

/**
 * Euler's totient function for u64
 */
// @ts-ignore
export function eulerTotientLarge(n: u64): u64 {
  let result = n;
  
  // @ts-ignore
  for (let p: u64 = 2; p * p <= n; p++) {
    if (n % p == 0) {
      while (n % p == 0) {
        n /= p;
      }
      result -= result / p;
    }
  }
  
  if (n > 1) {
    result -= result / n;
  }
  
  return result;
}

/**
 * Chinese Remainder Theorem solver
 * Finds x such that x ≡ a[i] (mod m[i]) for all i
 */
// @ts-ignore
export function chineseRemainderTheorem(a: Array<u64>, m: Array<u64>): u64 {
  if (a.length != m.length || a.length == 0) return 0;
  
  // @ts-ignore
  let result: u64 = 0;
  // @ts-ignore
  let M: u64 = 1;
  
  // Calculate product of all moduli
  for (let i = 0; i < m.length; i++) {
    M *= m[i];
  }
  
  // Apply CRT formula
  for (let i = 0; i < a.length; i++) {
    const Mi = M / m[i];
    const yi = modInverseLarge(Mi, m[i]);
    result = (result + a[i] * Mi * yi) % M;
  }
  
  return result;
}

/**
 * Legendre symbol (a/p)
 * Returns 1 if a is quadratic residue mod p, -1 if not, 0 if a ≡ 0 (mod p)
 */
// @ts-ignore
export function legendreSymbol(a: i64, p: u64): i32 {
  // @ts-ignore
  const result = modExp(u64(a % i64(p)), (p - 1) / 2, p);
  
  if (result == 0) return 0;
  if (result == 1) return 1;
  return -1;
}

/**
 * Tonelli-Shanks algorithm for modular square root
 * Finds r such that r^2 ≡ n (mod p)
 */
// @ts-ignore
export function modSqrt(n: u64, p: u64): u64 {
  // @ts-ignore
  if (legendreSymbol(i64(n), p) != 1) return 0; // No square root exists
  
  // Find Q and S such that p - 1 = Q * 2^S
  let Q = p - 1;
  let S = 0;
  while (Q % 2 == 0) {
    Q /= 2;
    S++;
  }
  
  // Find a quadratic non-residue
  // @ts-ignore
  let z: u64 = 2;
  // @ts-ignore
  while (legendreSymbol(i64(z), p) != -1) {
    z++;
  }
  
  let M = S;
  let c = modExp(z, Q, p);
  let t = modExp(n, Q, p);
  let R = modExp(n, (Q + 1) / 2, p);
  
  while (true) {
    if (t == 0) return 0;
    if (t == 1) return R;
    
    // Find the least i such that t^(2^i) = 1
    let i = 1;
    let temp = (t * t) % p;
    while (temp != 1 && i < M) {
      temp = (temp * temp) % p;
      i++;
    }
    
    // @ts-ignore
    const b = modExp(c, u64(1) << u64(M - i - 1), p);
    M = i;
    c = (b * b) % p;
    t = (t * c) % p;
    R = (R * b) % p;
  }
}

/**
 * Check if two numbers are coprime
 */
// @ts-ignore
export function areCoprime(a: i64, b: i64): boolean {
  return gcd(a, b) === 1;
}

/**
 * Check if a number is a perfect square
 */
// @ts-ignore
export function isPerfectSquare(n: i64): boolean {
  if (n < 0) return false;
  
  // @ts-ignore
  const root = Math.sqrt(n as f64) as i64;
  return root * root === n;
}

/**
 * Integer square root (floor)
 */
// @ts-ignore
export function isqrt(n: i64): i64 {
  if (n < 0) throw new Error("Cannot compute square root of negative number");
  if (n === 0) return 0;
  
  let x = n;
  let y = (x + 1) / 2;
  
  while (y < x) {
    x = y;
    y = (x + n / x) / 2;
  }
  
  return x;
}

/**
 * Binomial coefficient (n choose k)
 */
// @ts-ignore
export function binomial(n: i32, k: i32): i64 {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  // Use symmetry property
  // @ts-ignore
  k = <i32>Math.min(<f64>k, <f64>(n - k));
  
  // @ts-ignore
  let result: i64 = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }
  
  return result;
}

/**
 * Factorial
 */
// @ts-ignore
export function factorial(n: i32): i64 {
  if (n < 0) throw new Error("Factorial not defined for negative numbers");
  if (n === 0 || n === 1) return 1;
  
  // @ts-ignore
  let result: i64 = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  
  return result;
}

/**
 * Fibonacci number (nth)
 */
// @ts-ignore
export function fibonacci(n: i32): i64 {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  // @ts-ignore
  let a: i64 = 0;
  // @ts-ignore
  let b: i64 = 1;
  
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  
  return b;
}

/**
 * Check if three numbers form a Pythagorean triple
 */
// @ts-ignore
export function isPythagoreanTriple(a: i32, b: i32, c: i32): boolean {
  const sorted = [a, b, c].sort((x, y) => x - y);
  return sorted[0] * sorted[0] + sorted[1] * sorted[1] === sorted[2] * sorted[2];
}

/**
 * Pythagorean triple
 */
export class PythagoreanTriple {
  constructor(
    // @ts-ignore
    public a: i32,
    // @ts-ignore
    public b: i32,
    // @ts-ignore
    public c: i32
  ) {}
}

/**
 * Generate Pythagorean triples up to a limit
 */
// @ts-ignore
export function generatePythagoreanTriples(limit: i32): Array<PythagoreanTriple> {
  const triples = new Array<PythagoreanTriple>();
  
  for (let m = 2; m * m < limit; m++) {
    for (let n = 1; n < m; n++) {
      if ((m - n) % 2 === 1 && gcd(m, n) === 1) {
        const a = m * m - n * n;
        const b = 2 * m * n;
        const c = m * m + n * n;
        
        if (c <= limit) {
          triples.push(new PythagoreanTriple(a, b, c));
        }
      }
    }
  }
  
  return triples;
}

/**
 * Check if a number is a Gaussian prime
 * A Gaussian prime is either:
 * 1. A prime number p ≡ 3 (mod 4)
 * 2. The number 2
 * 3. A complex number a + bi where a² + b² is prime
 */
// @ts-ignore
export function isGaussianPrime(real: i32, imag: i32): boolean {
  if (imag === 0) {
    // Real axis: prime p ≡ 3 (mod 4) or p = 2
    const absReal = Math.abs(real);
    if (absReal === 2) return true;
    // @ts-ignore
    return isPrime(i32(absReal)) && i32(absReal) % 4 === 3;
  }
  
  if (real === 0) {
    // Imaginary axis: same criteria
    const absImag = Math.abs(imag);
    if (absImag === 2) return true;
    // @ts-ignore
    return isPrime(i32(absImag)) && i32(absImag) % 4 === 3;
  }
  
  // General case: a² + b² must be prime
  const norm = real * real + imag * imag;
  return isPrime(norm);
}

/**
 * Compute the nth root of a number
 */
// @ts-ignore
export function nthRoot(x: f64, n: i32): f64 {
  if (n === 0) throw new Error("Cannot compute 0th root");
  if (n === 1) return x;
  if (x < 0 && n % 2 === 0) throw new Error("Cannot compute even root of negative number");
  
  return Math.pow(Math.abs(x), 1.0 / n) * (x < 0 ? -1 : 1);
}

/**
 * Linear congruential generator for deterministic random numbers
 */
export class LinearCongruentialGenerator {
  // @ts-ignore
  private seed: i64;
  // @ts-ignore
  private readonly a: i64 = 1664525;
  // @ts-ignore
  private readonly c: i64 = 1013904223;
  // @ts-ignore
  private readonly m: i64 = 4294967296; // 2^32
  
  // @ts-ignore
  constructor(seed: i64) {
    this.seed = seed;
  }
  
  // @ts-ignore
  next(): f64 {
    this.seed = (this.a * this.seed + this.c) % this.m;
    // @ts-ignore
    return (this.seed as f64) / (this.m as f64);
  }
  
  // @ts-ignore
  nextInt(max: i32): i32 {
    // @ts-ignore
    return (this.next() * max) as i32;
  }
}

/**
 * Compute the discrete logarithm (baby-step giant-step algorithm)
 * Find x such that g^x ≡ h (mod p)
 */
// @ts-ignore
export function discreteLog(g: i64, h: i64, p: i64): i64 {
  // @ts-ignore
  const m = Math.ceil(Math.sqrt(p as f64)) as i64;
  
  // Baby steps: compute g^j mod p for j = 0, 1, ..., m-1
  // @ts-ignore
  const babySteps = new Map<i64, i64>();
  // @ts-ignore
  let gPower: i64 = 1;
  
  // @ts-ignore
  for (let j: i64 = 0; j < m; j++) {
    babySteps.set(gPower, j);
    gPower = (gPower * g) % p;
  }
  
  // Giant steps: compute h * (g^(-m))^i mod p
  const gInvM = modPow(modInverse(g, p), m, p);
  let gamma = h;
  
  // @ts-ignore
  for (let i: i64 = 0; i < m; i++) {
    if (babySteps.has(gamma)) {
      return i * m + babySteps.get(gamma);
    }
    gamma = (gamma * gInvM) % p;
  }
  
  return -1; // No solution found
}

/**
 * Generate a secure prime for cryptographic use
 * Alias for generateSafePrime
 */
// @ts-ignore
export function generateSecurePrime(bits: i32): u64 {
  return generateSafePrime(bits);
}

// Helper function for absolute value
// @ts-ignore
function abs(x: i64): u64 {
  // @ts-ignore
  return x < 0 ? u64(-x) : u64(x);
}

// Type aliases for compatibility
export type ExtendedGcdResult = ExtendedGCDResult;