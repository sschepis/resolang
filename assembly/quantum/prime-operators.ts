// prime-operators.ts
// Defines quantum operators related to prime numbers for the Prime Resonance Formalism.

import { Prime, Amplitude, Phase } from "../types";
import { PrimeState } from "./prime-state";

/**
 * Prime Number Operator: Pˆ|p⟩ = p|p⟩
 */
export function primeOperator(state: PrimeState): Map<Prime, Amplitude> {
  const result = new Map<Prime, Amplitude>();
  const keys = state.amplitudes.keys();
  
  for (let i = 0; i < keys.length; i++) {
    const p = keys[i];
    if (state.amplitudes.has(p)) {
      const amp = state.amplitudes.get(p);
      result.set(p, amp * f64(p));
    }
  }
  
  return result;
}

/**
 * Factorization Operator: Fˆ|n⟩ = Σ|pi⟩
 */
export function factorizationOperator(n: u32): PrimeState {
  const factors = new Map<Prime, Amplitude>();
  let num = n;
  let p: u32 = 2;
  
  while (p * p <= num) {
    while (num % p == 0) {
      const current = factors.has(p) ? factors.get(p) : 0.0;
      factors.set(p, current + 1.0);
      num /= p;
    }
    p++;
  }
  
  if (num > 1) {
    factors.set(num, 1.0);
  }
  
  return PrimeState.fromAmplitudes(factors);
}

/**
 * Rotation Operator: Rˆ(n)|p⟩ = e^(2πi log_p n)|p⟩
 * Returns the phase rotation for prime p with respect to n
 */
export function rotationOperator(n: u32, p: Prime): Phase {
  if (p <= 1) return 0.0;
  return 2.0 * Math.PI * (Math.log(f64(n)) / Math.log(f64(p)));
}