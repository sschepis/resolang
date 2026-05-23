// Prime-Resonance Economy Utilities
// Functions for working with PrimeValue and economic operations

import { PrimeValue, SEMANTIC_PRIMES, Transfer, TransferType } from './types.js';

// =============================================================================
// PRIME FACTORIZATION UTILITIES
// =============================================================================

/**
 * Check if a number is prime
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Generate first n primes
 */
export function generatePrimes(count: number): number[] {
  const primes: number[] = [];
  let candidate = 2;
  while (primes.length < count) {
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
    candidate++;
  }
  return primes;
}

/**
 * Factorize a number into prime factors
 * Returns Map of prime → exponent
 */
export function factorize(n: number | bigint): Map<number, number> {
  const factors = new Map<number, number>();
  let num = typeof n === 'bigint' ? n : BigInt(n);
  
  if (num <= 1n) return factors;
  
  // Factor out 2s
  while (num % 2n === 0n) {
    factors.set(2, (factors.get(2) || 0) + 1);
    num = num / 2n;
  }
  
  // Factor out odd primes
  let divisor = 3n;
  while (divisor * divisor <= num) {
    while (num % divisor === 0n) {
      const d = Number(divisor);
      factors.set(d, (factors.get(d) || 0) + 1);
      num = num / divisor;
    }
    divisor += 2n;
  }
  
  // Remaining factor > sqrt(n)
  if (num > 1n) {
    const d = Number(num);
    factors.set(d, 1);
  }
  
  return factors;
}

/**
 * Compute the product of prime factors
 */
export function computeValue(factors: Map<number, number>): bigint {
  let result = 1n;
  for (const [prime, exponent] of factors) {
    result *= BigInt(prime) ** BigInt(exponent);
  }
  return result;
}

// =============================================================================
// SEMANTIC MAPPINGS
// =============================================================================

/** Reverse mapping: prime → semantic name(s) */
const PRIME_TO_SEMANTICS: Map<number, string[]> = new Map();

// Build reverse mapping
for (const [name, prime] of Object.entries(SEMANTIC_PRIMES)) {
  const existing = PRIME_TO_SEMANTICS.get(prime) || [];
  existing.push(name);
  PRIME_TO_SEMANTICS.set(prime, existing);
}

/**
 * Get semantic meanings from a set of prime factors
 */
export function getSemantics(factors: Map<number, number>): string[] {
  const semantics: string[] = [];
  
  for (const [prime] of factors) {
    const meanings = PRIME_TO_SEMANTICS.get(prime);
    if (meanings) {
      // Take first (primary) meaning
      semantics.push(meanings[0]);
    }
  }
  
  return [...new Set(semantics)]; // Dedupe
}

/**
 * Compute resonance signature from factors
 * This is a numeric fingerprint based on prime relationships
 */
export function computeSignature(factors: Map<number, number>): number {
  let signature = 0;
  const primes = Array.from(factors.keys()).sort((a, b) => a - b);
  
  for (let i = 0; i < primes.length; i++) {
    const prime = primes[i];
    const exponent = factors.get(prime) || 0;
    // Weight by position and exponent
    signature += (prime * exponent * (i + 1)) / Math.log(prime + 1);
  }
  
  return signature;
}

// =============================================================================
// PRIMEVALUE FACTORY FUNCTIONS
// =============================================================================

/**
 * Create a PrimeValue from a numeric amount
 */
export function createPrimeValue(amount: number | bigint): PrimeValue {
  const factors = factorize(amount);
  const value = computeValue(factors);
  
  return {
    factors,
    get value() { return value; },
    semantics: getSemantics(factors),
    signature: computeSignature(factors),
    createdAt: Date.now(),
  };
}

/**
 * Create a PrimeValue from explicit factors
 */
export function createPrimeValueFromFactors(factors: Map<number, number> | Record<number, number>): PrimeValue {
  const factorMap = factors instanceof Map 
    ? factors 
    : new Map(Object.entries(factors).map(([k, v]) => [Number(k), v]));
  
  const value = computeValue(factorMap);
  
  return {
    factors: factorMap,
    get value() { return value; },
    semantics: getSemantics(factorMap),
    signature: computeSignature(factorMap),
    createdAt: Date.now(),
  };
}

/**
 * Create a PrimeValue from an array of primes (each appears once)
 */
export function createPrimeValueFromPrimes(primes: number[]): PrimeValue {
  const factors = new Map<number, number>();
  for (const p of primes) {
    factors.set(p, (factors.get(p) || 0) + 1);
  }
  return createPrimeValueFromFactors(factors);
}

/**
 * Create a zero PrimeValue
 */
export function zeroPrimeValue(): PrimeValue {
  return {
    factors: new Map(),
    get value() { return 0n; },
    semantics: [],
    signature: 0,
    createdAt: Date.now(),
  };
}

/**
 * Create a unit PrimeValue (value = 1)
 */
export function unitPrimeValue(): PrimeValue {
  return {
    factors: new Map(),
    get value() { return 1n; },
    semantics: [],
    signature: 0,
    createdAt: Date.now(),
  };
}

// =============================================================================
// PRIMEVALUE ARITHMETIC
// =============================================================================

/**
 * Multiply two PrimeValues (add exponents)
 * a × b = product of factors
 */
export function multiplyPrimeValues(a: PrimeValue, b: PrimeValue): PrimeValue {
  const factors = new Map<number, number>(a.factors);
  
  for (const [prime, exponent] of b.factors) {
    factors.set(prime, (factors.get(prime) || 0) + exponent);
  }
  
  return createPrimeValueFromFactors(factors);
}

/**
 * Divide PrimeValue a by b (subtract exponents)
 * Returns null if b does not divide a evenly
 */
export function dividePrimeValues(a: PrimeValue, b: PrimeValue): PrimeValue | null {
  const factors = new Map<number, number>(a.factors);
  
  for (const [prime, exponent] of b.factors) {
    const aExp = factors.get(prime) || 0;
    if (aExp < exponent) {
      // b has more of this prime than a - not divisible
      return null;
    }
    const newExp = aExp - exponent;
    if (newExp === 0) {
      factors.delete(prime);
    } else {
      factors.set(prime, newExp);
    }
  }
  
  return createPrimeValueFromFactors(factors);
}

/**
 * Add two PrimeValues
 * Converts to numbers, adds, then refactorizes
 */
export function addPrimeValues(a: PrimeValue, b: PrimeValue): PrimeValue {
  const sum = a.value + b.value;
  return createPrimeValue(sum);
}

/**
 * Subtract b from a
 * Returns null if result would be negative
 */
export function subtractPrimeValues(a: PrimeValue, b: PrimeValue): PrimeValue | null {
  if (b.value > a.value) {
    return null;
  }
  const diff = a.value - b.value;
  return createPrimeValue(diff);
}

/**
 * Scale a PrimeValue by an integer factor
 */
export function scalePrimeValue(v: PrimeValue, factor: number): PrimeValue {
  const factorPrimes = factorize(factor);
  const newFactors = new Map<number, number>(v.factors);
  
  for (const [prime, exp] of factorPrimes) {
    newFactors.set(prime, (newFactors.get(prime) || 0) + exp);
  }
  
  return createPrimeValueFromFactors(newFactors);
}

/**
 * Raise PrimeValue to a power
 */
export function powerPrimeValue(v: PrimeValue, exponent: number): PrimeValue {
  if (exponent === 0) return unitPrimeValue();
  if (exponent === 1) return v;
  
  const factors = new Map<number, number>();
  for (const [prime, exp] of v.factors) {
    factors.set(prime, exp * exponent);
  }
  
  return createPrimeValueFromFactors(factors);
}

// =============================================================================
// PRIMEVALUE COMPARISONS
// =============================================================================

/**
 * Compare two PrimeValues
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function comparePrimeValues(a: PrimeValue, b: PrimeValue): -1 | 0 | 1 {
  if (a.value < b.value) return -1;
  if (a.value > b.value) return 1;
  return 0;
}

/**
 * Check if two PrimeValues are equal
 */
export function equalsPrimeValue(a: PrimeValue, b: PrimeValue): boolean {
  return a.value === b.value;
}

/**
 * Check if a >= b
 */
export function gte(a: PrimeValue, b: PrimeValue): boolean {
  return a.value >= b.value;
}

/**
 * Check if a > b
 */
export function gt(a: PrimeValue, b: PrimeValue): boolean {
  return a.value > b.value;
}

/**
 * Check if a <= b
 */
export function lte(a: PrimeValue, b: PrimeValue): boolean {
  return a.value <= b.value;
}

/**
 * Check if a < b
 */
export function lt(a: PrimeValue, b: PrimeValue): boolean {
  return a.value < b.value;
}

// =============================================================================
// RESONANCE CALCULATIONS
// =============================================================================

/**
 * Calculate resonance between two PrimeValues
 * Returns 0-1 based on shared prime factors
 */
export function calculateResonance(a: PrimeValue, b: PrimeValue): number {
  const primesA = new Set(a.factors.keys());
  const primesB = new Set(b.factors.keys());
  
  let sharedWeight = 0;
  let totalWeight = 0;
  
  const allPrimes = new Set([...primesA, ...primesB]);
  
  for (const prime of allPrimes) {
    const expA = a.factors.get(prime) || 0;
    const expB = b.factors.get(prime) || 0;
    
    // Weight by 1/log(prime) - smaller primes are more fundamental
    const weight = 1 / Math.log(prime + 1);
    
    if (expA > 0 && expB > 0) {
      sharedWeight += Math.min(expA, expB) * weight;
    }
    totalWeight += Math.max(expA, expB) * weight;
  }
  
  return totalWeight > 0 ? sharedWeight / totalWeight : 0;
}

/**
 * Check if two PrimeValues share a specific semantic
 */
export function sharesSemantics(a: PrimeValue, b: PrimeValue, semantic: string): boolean {
  const prime = SEMANTIC_PRIMES[semantic as keyof typeof SEMANTIC_PRIMES];
  if (!prime) return false;
  
  return a.factors.has(prime) && b.factors.has(prime);
}

// =============================================================================
// TRANSFER UTILITIES
// =============================================================================

/**
 * Create a transfer record
 */
export function createTransfer(
  from: string,
  to: string,
  amount: PrimeValue,
  transferType: TransferType,
  options?: {
    contractId?: string;
    method?: string;
    signature?: string;
  }
): Transfer {
  return {
    id: `TX-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    from,
    to,
    amount,
    transferType,
    contractId: options?.contractId,
    method: options?.method,
    timestamp: Date.now(),
    signature: options?.signature,
  };
}

/**
 * Validate a transfer
 * Returns { valid: true } or { valid: false, error: string }
 */
export function validateTransfer(
  transfer: Transfer,
  senderBalance: PrimeValue
): { valid: true } | { valid: false; error: string } {
  // Check sender has sufficient balance
  if (!gte(senderBalance, transfer.amount)) {
    return { valid: false, error: 'Insufficient balance' };
  }
  
  // Check amount is positive
  if (transfer.amount.value <= 0n) {
    return { valid: false, error: 'Transfer amount must be positive' };
  }
  
  // Check sender != recipient
  if (transfer.from === transfer.to) {
    return { valid: false, error: 'Cannot transfer to self' };
  }
  
  return { valid: true };
}

// =============================================================================
// SERIALIZATION
// =============================================================================

/**
 * Serialize PrimeValue for storage/transmission
 */
export function serializePrimeValue(v: PrimeValue): string {
  const obj = {
    factors: Array.from(v.factors.entries()),
    signature: v.signature,
    createdAt: v.createdAt,
  };
  return JSON.stringify(obj);
}

/**
 * Deserialize PrimeValue from storage/transmission
 */
export function deserializePrimeValue(json: string): PrimeValue {
  const obj = JSON.parse(json);
  const factors = new Map<number, number>(obj.factors);
  return createPrimeValueFromFactors(factors);
}

/**
 * Convert PrimeValue to display string
 */
export function formatPrimeValue(v: PrimeValue, options?: { showFactors?: boolean }): string {
  if (v.value === 0n) return '0';
  
  if (options?.showFactors && v.factors.size > 0) {
    const parts: string[] = [];
    const sortedFactors = Array.from(v.factors.entries()).sort((a, b) => a[0] - b[0]);
    
    for (const [prime, exp] of sortedFactors) {
      if (exp === 1) {
        parts.push(prime.toString());
      } else {
        parts.push(`${prime}^${exp}`);
      }
    }
    
    return `${v.value.toString()} (${parts.join(' × ')})`;
  }
  
  return v.value.toString();
}

// Re-export SEMANTIC_PRIMES from types
export { SEMANTIC_PRIMES };
