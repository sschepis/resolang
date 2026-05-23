// ResoLang Math Utilities - Complex and Quaternion operations

import type { Complex, Quaternion, ResonanceValue } from './types.js';

// Complex number operations
export function createComplex(real: number, imag: number = 0): Complex {
  return { real, imag };
}

export function complexMagnitude(c: Complex): number {
  return Math.sqrt(c.real * c.real + c.imag * c.imag);
}

export function complexPhase(c: Complex): number {
  return Math.atan2(c.imag, c.real);
}

// Quaternion operations
export function createQuaternion(
  position: [number, number, number] = [0, 0, 0],
  amplitude: Complex | number = 1,
  gaussian: [number, number] = [0, 0],
  eisenstein: [number, number] = [0, 0]
): Quaternion {
  return {
    position,
    amplitude: typeof amplitude === 'number' ? createComplex(amplitude) : amplitude,
    gaussian,
    eisenstein,
  };
}

// Resonance calculations
export function computeResonance(prime1: number, prime2: number, strength: number = 1.0): ResonanceValue {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const lcm = (prime1 * prime2) / gcd(prime1, prime2);
  const resonanceStrength = strength * (1 - 1 / Math.log(lcm + 1));
  const phase = (2 * Math.PI * prime1) / prime2;
  
  return {
    strength: resonanceStrength,
    primes: [prime1, prime2],
    phase,
  };
}

export function computeResonanceVector(state: Quaternion, eigen: Quaternion): number {
  const magState = complexMagnitude(state.amplitude);
  const magEigen = complexMagnitude(eigen.amplitude);
  if (magState === 0 || magEigen === 0) return 0;
  
  // Dot product of position vectors
  const dotPos = state.position[0] * eigen.position[0] +
                 state.position[1] * eigen.position[1] +
                 state.position[2] * eigen.position[2];
                 
  // Cosine similarity of amplitudes (simplified phase alignment)
  const phaseDiff = Math.abs(complexPhase(state.amplitude) - complexPhase(eigen.amplitude));
  const alignment = Math.max(0, Math.cos(phaseDiff));
  
  return (alignment + Math.abs(dotPos)) / 2;
}

export function computeEntropy(state: Quaternion): number {
  const mag = complexMagnitude(state.amplitude);
  const pos = Math.sqrt(
    state.position[0] ** 2 + state.position[1] ** 2 + state.position[2] ** 2
  );
  return -Math.log(mag + 0.001) + pos * 0.1;
}

export function measureCoherence(state: Quaternion): number {
  const mag = complexMagnitude(state.amplitude);
  const phase = complexPhase(state.amplitude);
  const gaussianMag = Math.sqrt(state.gaussian[0] ** 2 + state.gaussian[1] ** 2);
  return Math.min(1, mag * (1 + Math.cos(phase)) * (1 - gaussianMag * 0.1));
}

export function computeEnergy(state: Quaternion): number {
  const mag = complexMagnitude(state.amplitude);
  return mag * mag;
}
