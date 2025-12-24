/**
 * Twist Number Theory Implementation
 * 
 * Core mathematical foundation for:
 * - Geometric semantics of prime numbers
 * - Mod 30 sieve structure
 * - Master Key (19) closure dynamics
 * 
 * NOTE: The claim that 108 is a "fundamental invariant" was not empirically validated.
 * The FUNDAMENTAL_INVARIANT constant is kept for backward compatibility only.
 */

// @ts-ignore
import { PI } from './core/math';

// Fundamental Constants
// @ts-ignore - Deprecated: use 360 (full rotation) instead
export const FUNDAMENTAL_INVARIANT: i32 = 108;
// @ts-ignore
export const PRIMORIAL_BASE: i32 = 30;
// @ts-ignore
export const MASTER_KEY_PRIME: i32 = 19;

// The 8 coprime residue classes mod 30
// Using static array for performance
// @ts-ignore
const COPRIME_RESIDUES: StaticArray<i32> = [1, 7, 11, 13, 17, 19, 23, 29];

/**
 * Calculate twist angle for a prime: κₙ = 2π/n
 * Returns angle in radians
 */
// @ts-ignore
export function getTwistAngle(prime: i32): f64 {
  if (prime == 0) return 0.0;
  // @ts-ignore
  return (2.0 * PI) / f64(prime);
}

/**
 * Calculate twist rate with wavelength: κₙ = 2π/(n × λ)
 */
// @ts-ignore
export function getTwistRate(prime: i32, wavelength: f64 = 1.0): f64 {
  if (prime == 0 || wavelength == 0.0) return 0.0;
  // @ts-ignore
  return (2.0 * PI) / (f64(prime) * wavelength);
}

/**
 * Compose twist angles (additive)
 */
// @ts-ignore
export function composeTwistAngles(primes: i32[]): f64 {
  // @ts-ignore
  let sum: f64 = 0.0;
  for (let i = 0; i < primes.length; i++) {
    sum += getTwistAngle(primes[i]);
  }
  return sum;
}

/**
 * Check if twist composition closes (returns to start)
 * A composition "closes" when total twist ≈ 2πk
 */
// @ts-ignore
export function isTwistClosed(totalTwist: f64, tolerance: f64 = 0.01): boolean {
  const twoPi = 2.0 * PI;
  const normalized = totalTwist % twoPi;
  // Check closeness to 0 or 2π
  return normalized < tolerance || (twoPi - normalized) < tolerance;
}

/**
 * Check if a number is coprime to 30
 */
// @ts-ignore
export function isCoprimeToThirty(n: i32): boolean {
  return n % 2 != 0 && n % 3 != 0 && n % 5 != 0;
}

/**
 * Get the residue class of n mod 30
 */
// @ts-ignore
export function getMod30Residue(n: i32): i32 {
  let residue = n % PRIMORIAL_BASE;
  if (residue < 0) residue += PRIMORIAL_BASE;
  return residue;
}

/**
 * Get the coprime class index (0-7) for a number coprime to 30
 * Returns -1 if not in a coprime class
 */
// @ts-ignore
export function getCoprimeClassIndex(n: i32): i32 {
  const residue = getMod30Residue(n);
  for (let i = 0; i < 8; i++) {
    // @ts-ignore
    if (COPRIME_RESIDUES[i] == residue) return i;
  }
  return -1;
}

/**
 * Map a coprime residue class to a Sedenion axis (0-7 -> 0-7, 8-15 for second octave)
 */
// @ts-ignore
export function residueToSedenionAxis(residue: i32, octave: i32 = 0): i32 {
  const idx = getCoprimeClassIndex(residue);
  if (idx == -1) return 0;
  return idx + (octave * 8);
}

/**
 * Check if a prime set can be "closed" with the master key (19)
 */
// @ts-ignore
export function needsMasterKey(primes: i32[]): boolean {
  const totalTwist = composeTwistAngles(primes);
  if (isTwistClosed(totalTwist)) return false;
  
  const withMasterKey = totalTwist + getTwistAngle(MASTER_KEY_PRIME);
  const twoPi = 2.0 * PI;
  
  const diffCurrent = Math.abs(totalTwist % twoPi);
  const diffNew = Math.abs(withMasterKey % twoPi);
  
  // Return true if adding 19 gets us closer to closure (0 or 2π)
  const distCurrent = Math.min(diffCurrent, twoPi - diffCurrent);
  const distNew = Math.min(diffNew, twoPi - diffNew);
  
  return distNew < distCurrent;
}

/**
 * Apply master key to achieve closure
 * Returns a new array with 19 appended if needed
 */
// @ts-ignore
export function applyMasterKey(primes: i32[]): i32[] {
  // Check if we already have 19
  let hasMasterKey = false;
  for (let i = 0; i < primes.length; i++) {
    if (primes[i] == MASTER_KEY_PRIME) {
      hasMasterKey = true;
      break;
    }
  }
  
  if (needsMasterKey(primes) && !hasMasterKey) {
    // @ts-ignore
    const result = new Array<i32>(primes.length + 1);
    for (let i = 0; i < primes.length; i++) {
      result[i] = primes[i];
    }
    result[primes.length] = MASTER_KEY_PRIME;
    return result;
  }
  
  return primes; // Return original if no change needed
}

/**
 * Symbolic entropy of a number based on prime factorization
 * Note: Requires factorization logic which we assume is available or passed in
 * Simple approximation: log(n)
 */
// @ts-ignore
export function symbolicEntropy(n: i32): f64 {
  if (n <= 1) return 0.0;
  // @ts-ignore
  return Math.log(f64(n));
}

/**
 * @deprecated Check if a number exhibits 108-periodicity - NOT EMPIRICALLY VALIDATED
 * Returns offset from nearest multiple of 108
 */
// @ts-ignore
export function get108HarmonicOffset(n: i32): i32 {
  // @ts-ignore
  const harmonic = Math.round(f64(n) / f64(FUNDAMENTAL_INVARIANT));
  // @ts-ignore
  return n - (i32(harmonic) * FUNDAMENTAL_INVARIANT);
}

/**
 * @deprecated 108 resonance was not empirically validated
 */
// @ts-ignore
export function is108Resonant(n: i32): boolean {
  const offset = get108HarmonicOffset(n);
  return Math.abs(offset) <= 5;
}