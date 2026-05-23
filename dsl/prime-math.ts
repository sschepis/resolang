// Prime Mathematics Module for ResoLang DSL
// Provides essential prime number operations

// ============================================================================
// PRIMALITY TESTING
// ============================================================================

// Miller-Rabin witnesses for deterministic testing
const WITNESSES_32 = [2, 7, 61];
const WITNESSES_64 = [2, 325, 9375, 28178, 450775, 9780504, 1795265022];

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp >> 1n;
    base = (base * base) % mod;
  }
  return result;
}

function millerRabinTest(n: bigint, a: bigint): boolean {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  let d = n - 1n;
  let r = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }

  a = a % n;
  if (a === 0n) return true;

  let x = modPow(a, d, n);
  if (x === 1n || x === n - 1n) return true;

  for (let i = 0; i < r - 1; i++) {
    x = (x * x) % n;
    if (x === n - 1n) return true;
  }

  return false;
}

/**
 * Deterministic primality test using Miller-Rabin
 * Guaranteed correct for all 64-bit integers
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  if (n < 9) return true;
  if (n % 3 === 0) return false;

  const bn = BigInt(n);
  const witnesses = n < 4294967296 ? WITNESSES_32 : WITNESSES_64;
  
  for (const w of witnesses) {
    if (w >= n) continue;
    if (!millerRabinTest(bn, BigInt(w))) return false;
  }
  
  return true;
}

// ============================================================================
// PRIME GENERATION
// ============================================================================

// Pre-computed first 100 primes for fast lookup
const FIRST_100_PRIMES = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
  421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
  509, 521, 523, 541
];

// Cache for generated primes
const primeCache: number[] = [...FIRST_100_PRIMES];

/**
 * Generate first n primes
 * Uses cached values when possible
 */
export function generatePrimes(n: number): number[] {
  if (n <= 0) return [];
  if (n <= primeCache.length) return primeCache.slice(0, n);

  // Extend cache
  let candidate = primeCache[primeCache.length - 1] + 2;
  while (primeCache.length < n) {
    if (isPrime(candidate)) {
      primeCache.push(candidate);
    }
    candidate += 2;
  }

  return primeCache.slice(0, n);
}

// ============================================================================
// PRIME FACTORIZATION
// ============================================================================

/**
 * Prime factorization returning Map<prime, power>
 */
export function factorize(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let num = Math.abs(Math.floor(n));
  
  if (num < 2) return factors;

  // Check small primes first
  for (const p of FIRST_100_PRIMES) {
    if (p * p > num) break;
    while (num % p === 0) {
      factors.set(p, (factors.get(p) || 0) + 1);
      num /= p;
    }
  }

  // Continue with larger candidates if needed
  let candidate = 541 + 2; // After last cached prime
  while (candidate * candidate <= num) {
    while (num % candidate === 0) {
      factors.set(candidate, (factors.get(candidate) || 0) + 1);
      num /= candidate;
    }
    candidate += 2;
  }

  if (num > 1) {
    factors.set(num, 1);
  }

  return factors;
}

/**
 * Prime factorization returning array of primes (with duplicates)
 */
export function factorizeToArray(n: number): number[] {
  const factors: number[] = [];
  const factorMap = factorize(n);
  
  for (const [prime, power] of factorMap) {
    for (let i = 0; i < power; i++) {
      factors.push(prime);
    }
  }
  
  return factors.sort((a, b) => a - b);
}

// Export pre-computed primes for direct access
export { FIRST_100_PRIMES };
