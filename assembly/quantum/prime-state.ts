// prime-state.ts
// Defines the PrimeState class and related constants for the Prime Resonance Formalism.

import { toFixed } from "../utils";
import { Prime, Phase, Amplitude, Entropy, Complex } from "../types";
import { getTwistAngle } from "../twist";

// Mathematical constants
const PHI: f64 = 1.618033988749895; // Golden ratio
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
    // Initialize coefficients with default values or based on a convention (e.g., equal superposition)
    for (let i = 0; i < primes.length; i++) {
        // Example: initialize with equal amplitude and zero phase
        state.coefficients[i] = new Complex(1.0 / Math.sqrt(f64(primes.length)), 0.0);
    }
    state.syncMapFromArrays();
    state.normalize();
    state.globalCoherence = state.calculateCoherence(); // Initialize coherence
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
      // Assuming amplitudes map stores magnitude, not complex value
      this.coefficients.push(new Complex(amp, 0)); // Assuming phase is zero initially for map sync
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
    if (this.primes.length === 0) return 0.0;
    
    let sumAmplitude = 0.0;
    for (let i = 0; i < this.coefficients.length; i++) {
      sumAmplitude += this.coefficients[i].magnitude();
    }
    return sumAmplitude / f64(this.coefficients.length);
  }

  /**
   * Evolve amplitudes based on a simple entropy model.
   * This is a CPU-side fallback/initial evolution.
   */
  // Note: This method's parameter `evolutionRate` might need to be reconciled
  // with how `UnifiedQuantumState`'s `evolve` method calculates/passes evolution rate.
  evolveWithEntropy(evolutionRate: f64): void {
      for (let i = 0; i < this.coefficients.length; i++) {
          const p = this.primes[i];
          const current_amp = this.coefficients[i].magnitude();
          const current_phase = this.coefficients[i].phase();
          
          // Use Twist Angle for prime-dependent phase rotation
          // κₙ = 2π/n
          const twist = getTwistAngle(i32(p));
          
          // Phase evolution: θ(t+dt) = θ(t) + (ω + κₙ) * dt
          // We use evolutionRate as a time step factor here
          const new_phase = current_phase + (twist + evolutionRate) * 0.1;
          
          // Amplitude evolution: Driven by entropy and resonance
          // Higher primes (more complex) decay faster if not resonant
          // A simple model: dA/dt = A * (1 - A) * (sin(θ) + noise)
          const primeFactor = Math.log(f64(p));
          const resonanceFactor = Math.sin(new_phase);
          const entropyFactor = (1.0 + resonanceFactor) / primeFactor;
          
          let new_amp_val = current_amp * (1.0 + evolutionRate * 0.01 * entropyFactor);
          new_amp_val = Math.max(0.001, Math.min(new_amp_val, 1.0)); // Keep some baseline probability
          
          this.amplitudes.set(p, new_amp_val);
          
          // Update complex coefficient with new amplitude and phase
          this.coefficients[i] = Complex.fromPolar(new_amp_val, new_phase);
      }
      
      // Update global coherence based on new state
      this.globalCoherence = this.calculateCoherence();
      
      this.normalize();
  }
 
  /**
   * Get prime values as a Uint32Array for GPU consumption.
   * Useful for passing prime identifiers to GPU kernels.
   */
  getPrimeValuesAsUint32Array(): Uint32Array {
      const arr = new Uint32Array(this.primes.length);
      for (let i = 0; i < this.primes.length; i++) {
          arr[i] = this.primes[i];
      }
      return arr;
  }

  /**
   * Get complex amplitudes (real and imaginary parts interleaved) as a Float32Array for GPU.
   * Format: [real0, imag0, real1, imag1, ...]
   */
  getAmplitudesAsFloat32Array(): Float32Array {
      const arr = new Float32Array(this.coefficients.length * 2); // Real and Imaginary parts
      for (let i = 0; i < this.coefficients.length; i++) {
          arr[i * 2] = f32(this.coefficients[i].real);
          arr[i * 2 + 1] = f32(this.coefficients[i].imag);
      }
      return arr;
  }

  /**
   * Get coherence factors for each prime as a Float32Array.
   * This might be a simplified representation of each prime's individual coherence.
   */
  getCoherenceFactorsAsFloat32Array(): Float32Array {
      const arr = new Float32Array(this.coefficients.length);
      for (let i = 0; i < this.coefficients.length; i++) {
          // Placeholder for actual complex coherence factor. For now, use magnitude or a simple derivation.
          // This should ideally come from a specific coherence property of QuantumPrime or a calculation.
          arr[i] = f32(this.coefficients[i].magnitude()); // Or a more complex coherence value if available per prime
      }
      return arr;
  }

  /**
   * Update internal complex amplitudes and prime amplitudes map from a Float32Array returned by GPU.
   * Assumes interleaved real and imaginary components: [real0, imag0, real1, imag1, ...]
   */
  updateAmplitudesFromFloat32Array(evolvedAmplitudes: Float32Array): void {
      if (evolvedAmplitudes.length !== this.coefficients.length * 2) {
          // This indicates a mismatch, ideally throw an error or log a warning
          // For now, trace and return to prevent out-of-bounds access
          trace("Error: Mismatch in evolvedAmplitudes array length for update.");
          return;
      }
      for (let i = 0; i < this.coefficients.length; i++) {
          const real = f64(evolvedAmplitudes[i * 2]);
          const imag = f64(evolvedAmplitudes[i * 2 + 1]);
          const newComplex = new Complex(real, imag);

          this.coefficients[i] = newComplex;
          this.amplitudes.set(this.primes[i], newComplex.magnitude()); // Update map with new magnitude
      }
      this.syncMapFromArrays(); // Ensure map is fully synchronized after array update
      this.normalize(); // Re-normalize after update as magnitudes might have changed
  }
  
  /**
   * Ensures Σ|αp|² = 1 (normalization condition)
   */
  normalize(): void {
    let sumSquared: f64 = 0.0;
    if (this.coefficients.length > 0) {
      for (let i = 0; i < this.coefficients.length; i++) {
        sumSquared += this.coefficients[i].squaredMagnitude();
      }
    } else if (this.amplitudes.size > 0) { // Check size for map to avoid iteration over empty map
      const keys = this.amplitudes.keys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const amp = this.amplitudes.get(key);
        sumSquared += amp * amp;
      }
    } else {
        return; // Nothing to normalize if empty
    }

    if (sumSquared > 0.0) {
      const normFactor = 1.0 / Math.sqrt(sumSquared);

      if (this.coefficients.length > 0) {
        for (let i = 0; i < this.coefficients.length; i++) {
          this.coefficients[i].real *= normFactor;
          this.coefficients[i].imag *= normFactor;
        }
        this.syncMapFromArrays();
      } else { // Fallback for when only amplitudes map is populated directly
        const keys = this.amplitudes.keys();
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          this.amplitudes.set(key, this.amplitudes.get(key) * normFactor);
        }
        this.syncArraysFromMap();
      }
    }
  }
  
  /**
   * Calculate entropy of the state
   */
  entropy(): f64 {
    let entropy: f64 = 0.0;
    
    if (this.coefficients.length > 0) {
      for (let i = 0; i < this.coefficients.length; i++) {
        const prob = this.coefficients[i].magnitude() * this.coefficients[i].magnitude();
        if (prob > 0) {
          entropy -= prob * Math.log2(prob);
        }
      }
    } else if (this.amplitudes.size > 0) {
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
    for (let i = 0; i < this.primes.length; i++) {
      if (this.primes[i] === prime) {
        return this.coefficients[i].phase();
      }
    }
    
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
      for (let i = 0; i < this.primes.length; i++) {
        const prob = this.coefficients[i].magnitude() * this.coefficients[i].magnitude();
        cumProb += prob;
        if (rand < cumProb) {
          return this.primes[i];
        }
      }
      return this.primes.length > 0 ? this.primes[this.primes.length - 1] : 2; // Fallback to last prime or 2
    } else if (this.amplitudes.size > 0) {
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
      return keys.length > 0 ? keys[0] : 2; // Fallback to first prime or 2
    }
    return 2; // Default if state is empty
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