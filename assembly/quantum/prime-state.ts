// prime-state.ts
// Defines the PrimeState class and related constants for the Prime Resonance Formalism.

import { toFixed } from "../utils";
import { Prime, Phase, Amplitude, Entropy, Complex } from "../types";

// Mathematical constants
export const PHI: f64 = 1.618033988749895; // Golden ratio
export const DELTA_S: f64 = 2.718281828459045; // Euler's number (used for entropy calculations)

/**
 * Represents a quantum state in the prime-based Hilbert space HP
 * |ψ⟩ = Σ αp|p⟩ where p ∈ P (set of primes)
 */
export class PrimeState {
  amplitudes: Map<Prime, Amplitude>;
  
  // Array-based interface for cryptographic operations
  primes: Array<Prime>;
  coefficients: Array<Complex>;

  // Global quantum state properties
  globalPhase: f64;
  globalCoherence: f64; // This will be updated by GPU calculation

  constructor() {
    this.amplitudes = new Map();
    this.primes = [];
    this.coefficients = [];
    this.globalPhase = 0.0;
    this.globalCoherence = 0.0;
  }
  
  // Factory method for creating from amplitudes map
  static fromAmplitudes(amplitudes: Map<Prime, Amplitude>): PrimeState {
    const state = new PrimeState();
    state.amplitudes = amplitudes;
    state.syncArraysFromMap();
    state.normalize();
    return state;
  }
  
  // Factory method for creating from primes array
  static fromPrimes(primes: Array<u32>): PrimeState { 
    const state = new PrimeState();
    state.primes = new Array<u32>(primes.length); 
    for (let i = 0; i < primes.length; i++) {
      state.primes[i] = primes[i]; 
    }
    state.coefficients = new Array<Complex>(primes.length);
    for (let i = 0; i < primes.length; i++) {
      state.coefficients[i] = new Complex(0, 0);
    }
    state.syncMapFromArrays();
    state.normalize();
    return state;
  }
  
  /**
   * Sync array representation from map
   */
  private syncArraysFromMap(): void {
    this.primes = [];
    this.coefficients = [];
    const keys = this.amplitudes.keys();
    for (let i = 0; i < keys.length; i++) {
      const prime = keys[i];
      this.primes.push(prime);
      const amp = this.amplitudes.get(prime);
      this.coefficients.push(new Complex(amp, 0));
    }
  }
  
  /**
   * Sync map representation from arrays
   */
  private syncMapFromArrays(): void {
    this.amplitudes.clear();
    for (let i = 0; i < this.primes.length; i++) {
      const magnitude = this.coefficients[i].magnitude();
      if (magnitude > 0) {
        this.amplitudes.set(this.primes[i], magnitude);
      }
    }
  }
  
  /**
   * Clone the state
   */
  clone(): PrimeState {
    const cloned = new PrimeState();
    
    // Clone map
    const keys = this.amplitudes.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      cloned.amplitudes.set(key, this.amplitudes.get(key));
    }
    
    // Clone arrays
    cloned.primes = this.primes.slice();
    cloned.coefficients = new Array<Complex>(this.coefficients.length);
    for (let i = 0; i < this.coefficients.length; i++) {
      const c = this.coefficients[i];
      cloned.coefficients[i] = new Complex(c.real, c.imag);
    }

    // Clone global properties
    cloned.globalPhase = this.globalPhase;
    cloned.globalCoherence = this.globalCoherence;
    
    return cloned;
  }

  /**
   * Calculate coherence based on phases for PRN
   * (Simplified, actual coherence calculation is more complex)
   */
  calculateCoherence(): f64 {
    // This is a placeholder; actual coherence involves complex phase alignments
    if (this.primes.length === 0) return 0.0;
    
    let sumAmplitude = 0.0;
    for (let i = 0; i < this.coefficients.length; i++) {
      sumAmplitude += this.coefficients[i].magnitude();
    }
    return sumAmplitude / f64(this.coefficients.length); // Average amplitude as a coherence proxy
  }

  /**
   * Evolve amplitudes based on a simple entropy model.
   * This is a CPU-side fallback/initial evolution.
   */
  evolveWithEntropy(evolutionRate: f64): void {
      for (let i = 0; i < this.coefficients.length; i++) {
          let current_amp = this.coefficients[i].magnitude();
          let new_amp_val = current_amp * (1.0 + evolutionRate * 0.001); // Simple growth
          this.amplitudes.set(this.primes[i], new_amp_val);
          this.coefficients[i] = new Complex(new_amp_val, 0); // Update coefficient magnitude
      }
      this.normalize();
  }
 
  /**
   * Get prime values as a Uint32Array for GPU
   */
  getPrimeValuesAsUint32Array(): Uint32Array {
      const arr = new Uint32Array(this.primes.length);
      for (let i = 0; i < this.primes.length; i++) {
          arr[i] = this.primes[i];
      }
      return arr;
  }

  /**
   * Get amplitudes as a Float32Array for GPU (magnitude)
   */
  getAmplitudesAsFloat32Array(): Float32Array {
      const arr = new Float32Array(this.coefficients.length);
      for (let i = 0; i < this.coefficients.length; i++) {
          arr[i] = f32(this.coefficients[i].magnitude());
      }
      return arr;
  }

  /**
   * Get coherence factors as Float32Array (placeholder, combine amplitude and phase coherence)
   */
  getCoherenceFactorsAsFloat32Array(): Float32Array {
      const arr = new Float32Array(this.coefficients.length);
      for (let i = 0; i < this.coefficients.length; i++) {
          // Simplified coherence factor for each prime, could be more complex
          // Combining magnitude and a dummy phase measure
          arr[i] = f32(this.coefficients[i].magnitude() * (1.0 + Math.sin(this.coefficients[i].phase())));
      }
      return arr;
  }

  /**
   * Update amplitudes and global coherence from a Float32Array (from GPU results)
   */
  updateAmplitudesFromFloat32Array(evolvedAmplitudes: Float32Array): void {
      for (let i = 0; i < this.coefficients.length; i++) {
          let new_amp = evolvedAmplitudes[i];
          this.amplitudes.set(this.primes[i], new_amp);
          // Assuming phase is handled separately or not returned by GPU, keep original phase
          this.coefficients[i] = new Complex(new_amp, 0); // Update magnitude, keep 0 imag for simplicity
      }
      this.syncMapFromArrays(); // Keep map updated
      this.normalize(); // Re-normalize after update
  }
  
  /**
   * Ensures Σ|αp|² = 1 (normalization condition)
   */
  normalize(): void {
    // Determine the sum of squared magnitudes
    let sumSquared: f64 = 0.0;
    if (this.coefficients.length > 0) {
      for (let i = 0; i < this.coefficients.length; i++) {
        sumSquared += this.coefficients[i].squaredMagnitude();
      }
    } else {
      const keys = this.amplitudes.keys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const amp = this.amplitudes.get(key);
        sumSquared += amp * amp;
      }
    }

    if (sumSquared > 0.0) {
      const normFactor = 1.0 / Math.sqrt(sumSquared);

      // Apply normalization factor
      if (this.coefficients.length > 0) {
        for (let i = 0; i < this.coefficients.length; i++) {
          this.coefficients[i].real *= normFactor;
          this.coefficients[i].imag *= normFactor;
        }
        this.syncMapFromArrays(); // Sync map after array normalization
      } else {
        const keys = this.amplitudes.keys();
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          this.amplitudes.set(key, this.amplitudes.get(key) * normFactor);
        }
        this.syncArraysFromMap(); // Sync arrays after map normalization
      }
    }
  }
  
  /**
   * Calculate entropy of the state
   */
  entropy(): f64 {
    let entropy: f64 = 0.0;
    
    if (this.coefficients.length > 0) {
      // Use array representation
      for (let i = 0; i < this.coefficients.length; i++) {
        const prob = this.coefficients[i].magnitude() * this.coefficients[i].magnitude();
        if (prob > 0) {
          entropy -= prob * Math.log2(prob);
        }
      }
    } else {
      // Use map representation
      const keys = this.amplitudes.keys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (this.amplitudes.has(key)) {
          const amp = this.amplitudes.get(key);
          const prob = amp * amp;
          if (prob > 0) {
            entropy -= prob * Math.log2(prob);
          }
        }
      }
    }
    
    return entropy;
  }
  
  /**
   * Get phase of a specific prime component
   */
  phase(prime: Prime): f64 {
    // Check array representation first
    for (let i = 0; i < this.primes.length; i++) {
      if (this.primes[i] === prime) {
        return this.coefficients[i].phase();
      }
    }
    
    // Fall back to map (real amplitudes have phase 0)
    if (this.amplitudes.has(prime)) {
      return 0.0;
    }
    
    return 0.0;
  }
  
  /**
   * Collapse the state to a specific prime basis
   */
  collapse(prime: Prime): void {
    // Clear all amplitudes except the specified prime
    this.amplitudes.clear();
    this.amplitudes.set(prime, 1.0);
    
    // Update arrays
    this.primes = [prime];
    this.coefficients = [new Complex(1.0, 0.0)];
  }
  
  /**
   * Measure the state, returning a prime with probability |αp|²
   */
  measure(): Prime {
    const rand = Math.random();
    let cumProb: f64 = 0.0;
    
    if (this.coefficients.length > 0) {
      // Use array representation
      for (let i = 0; i < this.primes.length; i++) {
        const prob = this.coefficients[i].magnitude() * this.coefficients[i].magnitude();
        cumProb += prob;
        if (rand < cumProb) {
          return this.primes[i];
        }
      }
      // Fallback to last prime
      return this.primes[this.primes.length - 1];
    } else {
      // Use map representation
      const keys = this.amplitudes.keys();
      for (let i = 0; i < keys.length; i++) {
        const prime = keys[i];
        if (this.amplitudes.has(prime)) {
          const amp = this.amplitudes.get(prime);
          const prob = amp * amp;
          cumProb += prob;
          if (rand < cumProb) {
            return prime;
          }
        }
      }
      // Fallback to first prime
      return keys.length > 0 ? keys[0] : 2;
    }
  }
  
  /**
   * Convert to array representation
   */
  toArray(): Array<Complex> {
    return this.coefficients.slice();
  }
  
  /**
   * Creates a basis state |p⟩
   */
  static basisState(p: Prime): PrimeState {
    const amps = new Map<Prime, Amplitude>();
    amps.set(p, 1.0);
    return PrimeState.fromAmplitudes(amps);
  }
  
  /**
   * Creates a composite state |n⟩ = Π|pi⟩^ai where n = Π pi^ai
   */
  static compositeState(factorization: Map<Prime, u32>): PrimeState {
    const amps = new Map<Prime, Amplitude>();
    const keys = factorization.keys();
    
    for (let i = 0; i < keys.length; i++) {
      const prime = keys[i];
      if (factorization.has(prime)) {
        const power = factorization.get(prime);
        amps.set(prime, Math.sqrt(f64(power)));
      }
    }
    
    return PrimeState.fromAmplitudes(amps);
  }
  
  /**
   * Evolve state with entropy-driven dynamics
   */
}