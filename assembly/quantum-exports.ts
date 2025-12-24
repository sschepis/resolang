/**
 * Quantum Export Wrappers
 * Provides WebAssembly-compatible exports for quantum state classes.
 */

import { HolographicEncoding } from './quantum/holographic-encoding';
import { EntropyEvolution } from './quantum/entropy-evolution';
import { Amplitude } from './types';

// HolographicEncoding constructor and methods
export function createHolographicEncoding(): HolographicEncoding {
  return new HolographicEncoding();
}

/**
 * A simplified version of encode for WebAssembly export.
 * Instead of a function, it takes a single entropy value.
 */
export function holographicEncodingEncode(
  encoding: HolographicEncoding,
  x: f64,
  y: f64,
  entropy: f64
): Amplitude {
  return encoding.encodeValue(x, y, entropy);
}

export function holographicEncodingDecode(
  encoding: HolographicEncoding,
  queryX: f64,
  queryY: f64
): Amplitude {
  return encoding.decode(queryX, queryY);
}

export function holographicEncodingClear(encoding: HolographicEncoding): void {
  encoding.clear();
}

// EntropyEvolution constructor and methods
export function createEntropyEvolution(S0: f64, lambda: f64): EntropyEvolution {
  return new EntropyEvolution(S0, lambda);
}

export function entropyEvolutionEvolve(evolution: EntropyEvolution, time: f64): f64 {
  return evolution.evolve(time);
}

export function entropyEvolutionCollapseProbability(evolution: EntropyEvolution, t: f64): f64 {
  return evolution.collapseProbability(t);
}