/**
 * Optimized Mathematical Operations Module
 * 
 * This module provides high-performance implementations of common mathematical
 * operations used throughout the Prime Resonance Network, including:
 * - Fast primality testing with deterministic witnesses
 * - Montgomery multiplication for efficient modular arithmetic
 * - Prime caching and lookup tables
 * - Optimized array operations
 * - Optimized modular exponentiation
 */

import { Prime } from '../types';
import { toFixed } from './serialization';

// Re-export all mathematical functionality from specialized modules
export * from './math-cache';
export * from './math-extended-gcd';
export * from './math-miller-rabin';
export * from './math-montgomery';
export * from './math-operations';
export * from './math-performance';
export * from './math-primes';

// Import specific functions for the main API
import { primeCache, SMALL_PRIMES } from './math-cache';
import { extendedGCD, ExtendedGCDResult, modInverse } from './math-extended-gcd';
import { millerRabinDeterministic32, millerRabinDeterministic64 } from './math-miller-rabin';
import { MontgomeryContext, modExpMontgomery } from './math-montgomery';
import { mulMod, addMod, modExp, arrayMul, arrayAdd, dotProduct } from './math-operations';
import { MathPerformanceStats } from './math-performance';
import { isPrimeOptimized, generatePrimeOptimized, generatePrimesOptimized } from './math-primes';

/**
 * Main optimized modular exponentiation function
 * Chooses between Montgomery and standard methods based on input size
 */
export function modExpOptimized(base: u64, exp: u64, mod: u64): u64 {
  MathPerformanceStats.incrementModularExponentiations();
  
  if (mod == 1) return 0;
  if (exp == 0) return 1;
  if (exp == 1) return base % mod;
  
  // For small exponents, use simple method
  if (exp < 16) {
    return modExp(base, exp, mod);
  }
  
  // Use Montgomery multiplication for larger exponents
  return modExpMontgomery(base, exp, mod);
}

/**
 * Optimized modular inverse using extended GCD
 */
export function modInverseOptimized(a: u64, m: u64): u64 {
  return modInverse(a, m);
}

/**
 * Array multiplication (element-wise) - standard implementation
 */
export function simdArrayMul(a: Float64Array, b: Float64Array, result: Float64Array): void {
  arrayMul(a, b, result);
}

/**
 * Array addition (element-wise) - standard implementation
 */
export function simdArrayAdd(a: Float64Array, b: Float64Array, result: Float64Array): void {
  arrayAdd(a, b, result);
}

/**
 * Dot product calculation - standard implementation
 */
export function simdDotProduct(a: Float64Array, b: Float64Array): f64 {
  return dotProduct(a, b);
}

/**
 * Get prime cache statistics
 */
export function getPrimeCacheStats(): string {
  const cached = primeCache.getPrimes();
  return `Prime Cache: ${cached.length} primes cached, largest: ${cached.length > 0 ? cached[cached.length - 1] : 0}`;
}

/**
 * Clear all caches and reset performance counters
 */
export function resetMathOptimizations(): void {
  primeCache.clear();
  MathPerformanceStats.reset();
}

/**
 * Get comprehensive performance report
 */
export function getMathPerformanceReport(): string {
  let report = "=== Math Optimization Performance Report ===\n";
  report += MathPerformanceStats.getStats() + "\n";
  report += getPrimeCacheStats() + "\n";
  return report;
}

/**
 * Validate mathematical operations integrity
 */
export function validateMathOperations(): bool {
  // Test basic operations
  if (modExpOptimized(2, 10, 1000) != 24) return false;
  if (!isPrimeOptimized(17)) return false;
  if (isPrimeOptimized(15)) return false;
  
  // Test modular arithmetic
  if (mulMod(123, 456, 789) != mulMod(456, 123, 789)) return false;
  
  // Test GCD
  const gcdResult = extendedGCD(48, 18);
  if (gcdResult.gcd != 6) return false;
  
  return true;
}

/**
 * Benchmark mathematical operations
 */
export function benchmarkMathOperations(): string {
  const iterations = 1000;
  let report = "=== Math Operations Benchmark ===\n";
  
  // Benchmark primality testing
  let startTime = f64(Date.now());
  for (let i = 0; i < iterations; i++) {
    isPrimeOptimized(u64(1000000007 + i));
  }
  let endTime = f64(Date.now());
  report += `Primality testing: ${iterations} tests in ${endTime - startTime}ms\n`;
  
  // Benchmark modular exponentiation
  startTime = f64(Date.now());
  for (let i = 0; i < iterations; i++) {
    modExpOptimized(u64(2 + i), u64(100), u64(1000000007));
  }
  endTime = f64(Date.now());
  report += `Modular exponentiation: ${iterations} operations in ${endTime - startTime}ms\n`;
  
  // Benchmark prime generation
  startTime = f64(Date.now());
  generatePrimesOptimized(100);
  endTime = f64(Date.now());
  report += `Prime generation: 100 primes in ${endTime - startTime}ms\n`;
  
  return report;
}

/**
 * Test mathematical operations with comprehensive validation
 */
export function testMathOperations(): bool {
  // Test all major components
  if (!validateMathOperations()) return false;
  
  // Test performance tracking
  MathPerformanceStats.reset();
  modExpOptimized(2, 100, 1000);
  if (MathPerformanceStats.modularExponentiations != 1) return false;
  
  // Test cache functionality
  primeCache.clear();
  isPrimeOptimized(17);
  if (!primeCache.has(17)) return false;
  
  return true;
}