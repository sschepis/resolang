/**
 * Implementation of quantum operations for PRN
 */

import { PrimeState } from './quantum/prime-state';

// Superpose multiple prime states
export function superpose(states: Array<PrimeState>): PrimeState {
  const result = new PrimeState();
  
  // Combine all amplitudes from all states
  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    const primes = state.amplitudes.keys();
    
    for (let j = 0; j < primes.length; j++) {
      const prime = primes[j];
      const amplitude = state.amplitudes.get(prime);
      
      if (result.amplitudes.has(prime)) {
        // Add amplitudes for same prime
        const existing = result.amplitudes.get(prime);
        result.amplitudes.set(prime, existing + amplitude);
      } else {
        result.amplitudes.set(prime, amplitude);
      }
    }
  }
  
  // Normalize the result
  let totalSquared = 0.0;
  const resultPrimes = result.amplitudes.keys();
  for (let i = 0; i < resultPrimes.length; i++) {
    const amp = result.amplitudes.get(resultPrimes[i]);
    totalSquared += amp * amp;
  }
  
  const norm = Math.sqrt(totalSquared);
  if (norm > 0.0) {
    for (let i = 0; i < resultPrimes.length; i++) {
      const prime = resultPrimes[i];
      const amp = result.amplitudes.get(prime);
      result.amplitudes.set(prime, amp / norm);
    }
  }
  
  return result;
}

// Measure a prime state, returning the observed prime
export function measure(state: PrimeState): u32 {
  // Calculate cumulative probabilities
  const primes = state.amplitudes.keys();
  const probabilities = new Array<f64>();
  let cumulative = 0.0;
  
  for (let i = 0; i < primes.length; i++) {
    const amp = state.amplitudes.get(primes[i]);
    cumulative += amp * amp; // Probability is amplitude squared
    probabilities.push(cumulative);
  }
  
  // Generate random number for measurement
  const random = Math.random();
  
  // Find which prime was measured
  for (let i = 0; i < probabilities.length; i++) {
    if (random <= probabilities[i]) {
      return primes[i];
    }
  }
  
  // Fallback to last prime
  return primes[primes.length - 1];
}

// Collapse a state to a specific prime
export function collapse(state: PrimeState, prime: u32): PrimeState {
  const collapsed = new PrimeState();
  
  // Clear all amplitudes and set only the measured prime to 1.0
  collapsed.amplitudes.clear();
  collapsed.amplitudes.set(prime, 1.0);
  
  return collapsed;
}