/**
 * Prime Number Generation and Testing Module
 * Provides efficient prime generation and testing functions
 */

import { Prime } from '../types';
import { primeCache, SMALL_PRIMES } from './math-cache';
import { millerRabinDeterministic32, millerRabinDeterministic64 } from './math-miller-rabin';

/**
 * Optimized primality test using deterministic Miller-Rabin
 * Much faster than the probabilistic version for common ranges
 */
export function isPrimeOptimized(n: u64): bool {
  // Check cache first
  if (primeCache.has(n)) {
    return primeCache.get(n);
  }
  
  // Handle small cases
  if (n < 2) return false;
  if (n == 2) return true;
  if (n % 2 == 0) return false;
  
  // Trial division by small primes
  for (let i = 0; i < SMALL_PRIMES.length; i++) {
    const p = u64(SMALL_PRIMES[i]);
    if (n == p) return true;
    if (n % p == 0) {
      primeCache.set(n, false);
      return false;
    }
    if (p * p > n) break;
  }
  
  // Deterministic Miller-Rabin test
  const isPrime = n < 4294967296 
    ? millerRabinDeterministic32(u32(n))
    : millerRabinDeterministic64(n);
  
  // Cache the result
  primeCache.set(n, isPrime);
  return isPrime;
}

/**
 * Generate a random prime in the specified bit range
 * Uses optimized primality testing
 */
export function generatePrimeOptimized(minBits: i32, maxBits: i32): u64 {
  const minValue = u64(1) << u64(minBits - 1);
  const maxValue = (u64(1) << u64(maxBits)) - 1;
  
  let candidate: u64;
  do {
    candidate = minValue + u64(Math.random() * f64(maxValue - minValue));
    // Ensure odd
    candidate |= 1;
  } while (!isPrimeOptimized(candidate));
  
  return candidate;
}

/**
 * Generate n primes efficiently using optimized testing
 */
export function generatePrimesOptimized(n: i32): Array<Prime> {
  if (n <= 0) return new Array<Prime>();
  
  // Use cached primes if available
  const cached = primeCache.getPrimes();
  if (cached.length >= n) {
    const result = new Array<Prime>();
    for (let i = 0; i < n; i++) {
      result.push(i32(cached[i]));
    }
    return result;
  }
  
  // Generate more primes using optimized testing
  const primes = new Array<Prime>();
  let candidate: u64 = 2;
  
  while (primes.length < n) {
    if (isPrimeOptimized(candidate)) {
      primes.push(i32(candidate));
    }
    candidate++;
  }
  
  return primes;
}

/**
 * Check if a number is a Gaussian prime
 */
export function isGaussianPrime(real: f64, imag: f64): bool {
  const absReal = Math.abs(real);
  const absImag = Math.abs(imag);
  
  // Case 1: One component is zero, the other is a prime ≡ 3 (mod 4)
  if (absReal == 0.0) {
    return isPrimeOptimized(u64(absImag)) && u64(absImag) % 4 == 3;
  }
  if (absImag == 0.0) {
    return isPrimeOptimized(u64(absReal)) && u64(absReal) % 4 == 3;
  }
  
  // Case 2: Both components are non-zero, norm is prime
  const norm = absReal * absReal + absImag * absImag;
  return isPrimeOptimized(u64(norm));
}

/**
 * Sieve of Eratosthenes for generating primes up to n
 */
export function sieveOfEratosthenes(n: u32): Array<u32> {
  if (n < 2) return new Array<u32>();
  
  const isPrime = new Array<bool>(n + 1);
  // Initialize all as true
  for (let i: u32 = 0; i <= n; i++) {
    isPrime[i] = true;
  }
  
  isPrime[0] = false;
  isPrime[1] = false;
  
  for (let i: u32 = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j: u32 = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  const primes = new Array<u32>();
  for (let i: u32 = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  
  return primes;
}

/**
 * Find the next prime after n
 */
export function nextPrime(n: u64): u64 {
  if (n < 2) return 2;
  
  let candidate = n + 1;
  if (candidate % 2 == 0) candidate++;
  
  while (!isPrimeOptimized(candidate)) {
    candidate += 2;
  }
  
  return candidate;
}

/**
 * Find the previous prime before n
 */
export function previousPrime(n: u64): u64 {
  if (n <= 2) return 0;
  if (n == 3) return 2;
  
  let candidate = n - 1;
  if (candidate % 2 == 0) candidate--;
  
  while (candidate > 2 && !isPrimeOptimized(candidate)) {
    candidate -= 2;
  }
  
  return candidate;
}