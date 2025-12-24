/**
 * Prime Hilbert Space Implementation
 * 
 * Port from tinyaleph/core/hilbert.js to AssemblyScript
 * 
 * HP = {|ψ⟩ = Σ αp|p⟩ : Σ|αp|² = 1, αp ∈ ℂ}
 * 
 * Implements:
 * - Complex amplitudes for prime basis states
 * - Resonance operators (P̂, F̂, R̂, Ĉ)
 * - Entropy-driven evolution
 * - Memory encoding
 */

import { Complex, Prime } from './types';
import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';
import { isPrime, generatePrimes } from './core/math';

/**
 * Prime Hilbert Space State
 * |ψ⟩ = Σ αp|p⟩ where p ∈ P (primes)
 */
export class PrimeHilbertState implements Serializable {
  /** Array of primes that form the basis */
  primes: Array<Prime>;
  
  /** Maps prime index to complex amplitude */
  amplitudes: Map<Prime, Complex>;
  
  /** Maps prime to its index */
  private primeToIndex: Map<Prime, i32>;
  
  /** Maps index to prime */
  private indexToPrime: Map<i32, Prime>;
  
  /**
   * Construct a Prime Hilbert State
   * @param primes Array of primes to use as basis, or null for default (first 25 primes)
   */
  constructor(primes: Array<Prime> | null = null) {
    if (primes !== null) {
      this.primes = primes;
    } else {
      this.primes = generatePrimes(25);
    }
    
    // Build index maps
    this.primeToIndex = new Map<Prime, i32>();
    this.indexToPrime = new Map<i32, Prime>();
    this.amplitudes = new Map<Prime, Complex>();
    
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      this.primeToIndex.set(p, i);
      this.indexToPrime.set(i, p);
      this.amplitudes.set(p, new Complex(0, 0));
    }
  }
  
  // ============================================================================
  // Factory Methods
  // ============================================================================
  
  /**
   * Create a basis state |p⟩
   */
  static basis(p: Prime, primes: Array<Prime> | null = null): PrimeHilbertState {
    const state = new PrimeHilbertState(primes);
    if (state.amplitudes.has(p)) {
      state.amplitudes.set(p, new Complex(1, 0));
    }
    return state;
  }
  
  /**
   * Create a uniform superposition over all primes
   */
  static uniform(primes: Array<Prime> | null = null): PrimeHilbertState {
    const state = new PrimeHilbertState(primes);
    const n = state.primes.length;
    const amp = new Complex(1.0 / Math.sqrt(<f64>n), 0);
    
    for (let i = 0; i < n; i++) {
      state.amplitudes.set(state.primes[i], amp);
    }
    return state;
  }
  
  /**
   * Create a composite state from number n = Π p_i^a_i
   * Amplitudes weighted by prime multiplicity
   */
  static composite(n: i32, primes: Array<Prime> | null = null): PrimeHilbertState {
    const state = new PrimeHilbertState(primes);
    const factors = factorize(n);
    
    let totalWeight: f64 = 0;
    const keys = factors.keys();
    for (let i = 0; i < keys.length; i++) {
      totalWeight += <f64>factors.get(keys[i]);
    }
    
    if (totalWeight == 0) return state;
    
    for (let i = 0; i < keys.length; i++) {
      const p = keys[i];
      const exp = factors.get(p);
      if (state.amplitudes.has(p)) {
        state.amplitudes.set(p, new Complex(<f64>exp / totalWeight, 0));
      }
    }
    
    return state.normalize();
  }
  
  // ============================================================================
  // Amplitude Access
  // ============================================================================
  
  /**
   * Get amplitude for prime p
   */
  get(p: Prime): Complex {
    if (this.amplitudes.has(p)) {
      return this.amplitudes.get(p);
    }
    return new Complex(0, 0);
  }
  
  /**
   * Set amplitude for prime p
   */
  set(p: Prime, amplitude: Complex): PrimeHilbertState {
    if (this.amplitudes.has(p)) {
      this.amplitudes.set(p, amplitude);
    }
    return this;
  }
  
  // ============================================================================
  // Arithmetic Operations
  // ============================================================================
  
  /**
   * Add states: |ψ⟩ + |φ⟩
   */
  add(other: PrimeHilbertState): PrimeHilbertState {
    const result = new PrimeHilbertState(this.primes);
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      const a1 = this.get(p);
      const a2 = other.get(p);
      result.amplitudes.set(p, a1.add(a2));
    }
    return result;
  }
  
  /**
   * Scale state by complex number: c|ψ⟩
   */
  scale(c: Complex): PrimeHilbertState {
    const result = new PrimeHilbertState(this.primes);
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      result.amplitudes.set(p, this.get(p).multiply(c));
    }
    return result;
  }
  
  /**
   * Scale by real number
   */
  scaleReal(k: f64): PrimeHilbertState {
    return this.scale(new Complex(k, 0));
  }
  
  // ============================================================================
  // Inner Products and Norms
  // ============================================================================
  
  /**
   * Inner product ⟨φ|ψ⟩
   */
  inner(other: PrimeHilbertState): Complex {
    let sum = new Complex(0, 0);
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      const a1 = this.get(p).conjugate();
      const a2 = other.get(p);
      sum = sum.add(a1.multiply(a2));
    }
    return sum;
  }
  
  /**
   * Norm ||ψ||
   */
  norm(): f64 {
    let sum: f64 = 0;
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      sum += this.get(p).magnitudeSquared();
    }
    return Math.sqrt(sum);
  }
  
  /**
   * Normalize to unit vector
   */
  normalize(): PrimeHilbertState {
    const n = this.norm();
    if (n < 1e-10) return this;
    return this.scaleReal(1.0 / n);
  }
  
  // ============================================================================
  // Information Theory
  // ============================================================================
  
  /**
   * Shannon entropy: S(ψ) = -Σ |αp|² log |αp|²
   */
  entropy(): f64 {
    const n2 = this.norm();
    const normSq = n2 * n2;
    if (normSq < 1e-10) return 0;
    
    let h: f64 = 0;
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      const prob = this.get(p).magnitudeSquared() / normSq;
      if (prob > 1e-10) {
        h -= prob * Math.log2(prob);
      }
    }
    return h;
  }
  
  /**
   * Coherence with another state: |⟨φ|ψ⟩|²
   */
  coherence(other: PrimeHilbertState): f64 {
    return this.inner(other).magnitudeSquared();
  }
  
  // ============================================================================
  // Measurements
  // ============================================================================
  
  /**
   * Get dominant primes (highest amplitude)
   */
  dominant(n: i32 = 3): Array<DominantPrime> {
    const doms = new Array<DominantPrime>(this.primes.length);
    
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      doms[i] = new DominantPrime(p, this.get(p).magnitude());
    }
    
    // Sort by descending amplitude
    doms.sort((a: DominantPrime, b: DominantPrime): i32 => {
      if (b.amplitude > a.amplitude) return 1;
      if (b.amplitude < a.amplitude) return -1;
      return 0;
    });
    
    // Return top n
    const result = new Array<DominantPrime>(n);
    for (let i = 0; i < n && i < this.primes.length; i++) {
      result[i] = doms[i];
    }
    return result;
  }
  
  /**
   * Born measurement: probabilistic collapse to a single prime
   */
  measure(): MeasurementResult {
    const normSq = this.norm();
    const n2 = normSq * normSq;
    if (n2 < 1e-10) {
      return new MeasurementResult(this.primes[0], 1.0);
    }
    
    const r = Math.random() * n2;
    let cumulative: f64 = 0;
    
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      cumulative += this.get(p).magnitudeSquared();
      if (r < cumulative) {
        return new MeasurementResult(p, this.get(p).magnitudeSquared() / n2);
      }
    }
    
    // Fallback to last prime
    const lastP = this.primes[this.primes.length - 1];
    return new MeasurementResult(lastP, this.get(lastP).magnitudeSquared() / n2);
  }
  
  // ============================================================================
  // Serialization
  // ============================================================================
  
  /**
   * Convert to array representation
   */
  toArray(): Array<PrimeAmplitude> {
    const result = new Array<PrimeAmplitude>(this.primes.length);
    const normSq = this.norm();
    const n2 = normSq * normSq;
    
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      const amp = this.get(p);
      const prob = n2 > 1e-10 ? amp.magnitudeSquared() / n2 : 0;
      result[i] = new PrimeAmplitude(p, amp, prob);
    }
    return result;
  }
  
  /**
   * Clone this state
   */
  clone(): PrimeHilbertState {
    const copy = new PrimeHilbertState(this.primes);
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      const amp = this.get(p);
      copy.amplitudes.set(p, new Complex(amp.real, amp.imag));
    }
    return copy;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("norm", this.norm())
      .addNumberField("entropy", this.entropy());
    
    // Add primes array
    let primesJson = "[";
    for (let i = 0; i < this.primes.length; i++) {
      if (i > 0) primesJson += ",";
      primesJson += this.primes[i].toString();
    }
    primesJson += "]";
    builder.addRawField("primes", primesJson);
    
    // Add amplitudes
    const dom = this.dominant(5);
    let domJson = "[";
    for (let i = 0; i < dom.length; i++) {
      if (i > 0) domJson += ",";
      domJson += `{"prime":${dom[i].prime},"amplitude":${toFixed(dom[i].amplitude, 4)}}`;
    }
    domJson += "]";
    builder.addRawField("dominant", domJson);
    
    builder.endObject();
    return builder.build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

// ============================================================================
// Resonance Operators
// ============================================================================

/**
 * Resonance operators from the Prime Resonance theory
 */
export class ResonanceOperators {
  /**
   * Prime operator P̂|p⟩ = p|p⟩
   * Eigenvalue is the prime itself
   */
  static P(state: PrimeHilbertState): PrimeHilbertState {
    const result = new PrimeHilbertState(state.primes);
    for (let i = 0; i < state.primes.length; i++) {
      const p = state.primes[i];
      result.amplitudes.set(p, state.get(p).scale(<f64>p));
    }
    return result;
  }
  
  /**
   * Factorization operator F̂
   * Distributes amplitude to prime factors
   */
  static F(state: PrimeHilbertState): PrimeHilbertState {
    const result = new PrimeHilbertState(state.primes);
    // For prime basis, F is essentially identity
    for (let i = 0; i < state.primes.length; i++) {
      const p = state.primes[i];
      const amp = state.get(p);
      if (amp.magnitude() > 1e-10) {
        result.amplitudes.set(p, amp);
      }
    }
    return result.normalize();
  }
  
  /**
   * Resonance operator R̂(n)|p⟩ = e^(2πi log_p(n))|p⟩
   * Creates phase rotation based on logarithmic relationship
   */
  static R(state: PrimeHilbertState, n: i32): PrimeHilbertState {
    const result = new PrimeHilbertState(state.primes);
    const logN = Math.log(<f64>n);
    
    for (let i = 0; i < state.primes.length; i++) {
      const p = state.primes[i];
      const logP = Math.log(<f64>p);
      const phase = 2.0 * Math.PI * logN / logP;
      const rotation = Complex.fromPolar(1.0, phase);
      result.amplitudes.set(p, state.get(p).multiply(rotation));
    }
    return result;
  }
  
  /**
   * Coupling operator Ĉ(n)
   * Phase coupling based on prime relationships
   */
  static C(state: PrimeHilbertState, n: i32): PrimeHilbertState {
    const result = new PrimeHilbertState(state.primes);
    const logN = Math.log(<f64>n);
    
    for (let i = 0; i < state.primes.length; i++) {
      const p = state.primes[i];
      let sum = new Complex(0, 0);
      
      for (let j = 0; j < state.primes.length; j++) {
        const q = state.primes[j];
        // φ_pq = 2π(log_p(n) - log_q(n))
        const phase = 2.0 * Math.PI * (logN / Math.log(<f64>p) - logN / Math.log(<f64>q));
        const rotation = Complex.fromPolar(1.0, phase);
        sum = sum.add(rotation.multiply(state.get(q)));
      }
      
      result.amplitudes.set(p, sum.scale(1.0 / <f64>state.primes.length));
    }
    return result.normalize();
  }
  
  /**
   * Hadamard-like superposition operator
   */
  static H(state: PrimeHilbertState): PrimeHilbertState {
    const result = new PrimeHilbertState(state.primes);
    const n = state.primes.length;
    const norm = 1.0 / Math.sqrt(<f64>n);
    
    for (let i = 0; i < n; i++) {
      const p = state.primes[i];
      const pIdx = i;
      let sum = new Complex(0, 0);
      
      for (let j = 0; j < n; j++) {
        const q = state.primes[j];
        const phase = 2.0 * Math.PI * <f64>j * <f64>pIdx / <f64>n;
        sum = sum.add(state.get(q).multiply(Complex.fromPolar(1.0, phase)));
      }
      result.amplitudes.set(p, sum.scale(norm));
    }
    return result;
  }
}

// ============================================================================
// Entropy-Driven Evolution
// ============================================================================

/**
 * Entropy-driven evolution for quantum-like dynamics
 * d|Ψ(t)⟩/dt = iĤ|Ψ(t)⟩ - λ(R̂ - r_stable)|Ψ(t)⟩
 */
export class EntropyDrivenEvolution {
  state: PrimeHilbertState;
  lambda: f64;         // Decay rate
  rStable: f64;        // Stable resonance target
  dt: f64;             // Time step
  time: f64;
  entropyIntegral: f64;
  history: Array<EvolutionSnapshot>;
  
  constructor(state: PrimeHilbertState, lambda: f64 = 0.1, rStable: f64 = 0.5, dt: f64 = 0.01) {
    this.state = state.clone();
    this.lambda = lambda;
    this.rStable = rStable;
    this.dt = dt;
    this.time = 0;
    this.entropyIntegral = 0;
    this.history = new Array<EvolutionSnapshot>();
  }
  
  /**
   * Single time step evolution
   */
  step(): PrimeHilbertState {
    // Hamiltonian evolution (rotation in Hilbert space)
    const nValue = i32(Math.round(Math.exp(this.time)));
    const rotatedState = ResonanceOperators.R(this.state, nValue > 1 ? nValue : 2);
    
    // Entropy-driven damping
    const currentR = this.state.norm();
    const dampingFactor = 1.0 - this.lambda * (currentR - this.rStable) * this.dt;
    
    // Update state
    this.state = rotatedState.scaleReal(dampingFactor).normalize();
    
    // Track entropy
    const s = this.state.entropy();
    this.entropyIntegral += s * this.dt;
    this.time += this.dt;
    
    // Record history
    const snapshot = new EvolutionSnapshot(
      this.time,
      s,
      this.entropyIntegral,
      this.state.dominant(3)
    );
    this.history.push(snapshot);
    
    return this.state;
  }
  
  /**
   * Evolve until collapse condition met
   * P_collapse = 1 - e^(-∫S(t)dt)
   */
  evolveUntilCollapse(maxSteps: i32 = 1000): CollapseResult {
    for (let i = 0; i < maxSteps; i++) {
      this.step();
      
      const pCollapse = 1.0 - Math.exp(-this.entropyIntegral);
      if (Math.random() < pCollapse * this.dt) {
        return new CollapseResult(
          true,
          i + 1,
          pCollapse,
          this.state.measure()
        );
      }
    }
    
    return new CollapseResult(
      false,
      maxSteps,
      1.0 - Math.exp(-this.entropyIntegral),
      this.state.measure()
    );
  }
  
  getHistory(): Array<EvolutionSnapshot> {
    return this.history;
  }
}

// ============================================================================
// Helper Classes
// ============================================================================

export class DominantPrime {
  prime: Prime;
  amplitude: f64;
  
  constructor(prime: Prime, amplitude: f64) {
    this.prime = prime;
    this.amplitude = amplitude;
  }
}

export class MeasurementResult {
  prime: Prime;
  probability: f64;
  
  constructor(prime: Prime, probability: f64) {
    this.prime = prime;
    this.probability = probability;
  }
}

export class PrimeAmplitude {
  prime: Prime;
  amplitude: Complex;
  probability: f64;
  
  constructor(prime: Prime, amplitude: Complex, probability: f64) {
    this.prime = prime;
    this.amplitude = amplitude;
    this.probability = probability;
  }
}

export class EvolutionSnapshot {
  time: f64;
  entropy: f64;
  entropyIntegral: f64;
  dominant: Array<DominantPrime>;
  
  constructor(time: f64, entropy: f64, entropyIntegral: f64, dominant: Array<DominantPrime>) {
    this.time = time;
    this.entropy = entropy;
    this.entropyIntegral = entropyIntegral;
    this.dominant = dominant;
  }
}

export class CollapseResult {
  collapsed: bool;
  steps: i32;
  probability: f64;
  finalState: MeasurementResult;
  
  constructor(collapsed: bool, steps: i32, probability: f64, finalState: MeasurementResult) {
    this.collapsed = collapsed;
    this.steps = steps;
    this.probability = probability;
    this.finalState = finalState;
  }
}

// ============================================================================
// Memory Encoding
// ============================================================================

/**
 * Encode text as a Prime Hilbert state
 * Maps characters to primes with phase encoding
 */
export function encodeMemory(text: string, primes: Array<Prime> | null = null): PrimeHilbertState {
  const state = new PrimeHilbertState(primes);
  const n = text.length;
  
  for (let i = 0; i < n; i++) {
    const charCode = text.charCodeAt(i);
    // Use prime at index charCode % numPrimes
    const primeIdx = charCode % state.primes.length;
    const p = state.primes[primeIdx];
    
    // Phase encodes position, amplitude encodes frequency
    const phase = 2.0 * Math.PI * <f64>i / <f64>n;
    const currentAmp = state.get(p);
    const newAmp = currentAmp.add(Complex.fromPolar(1.0 / <f64>n, phase));
    state.set(p, newAmp);
  }
  
  return state.normalize();
}

/**
 * Symbolic computation via iterative entropy minimization
 */
export function symbolicCompute(
  inputStates: Array<PrimeHilbertState>,
  maxIterations: i32 = 100,
  coherenceThreshold: f64 = 0.9
): SymbolicComputeResult | null {
  if (inputStates.length == 0) return null;
  
  // Superposition of input states
  let state = inputStates[0].clone();
  for (let i = 1; i < inputStates.length; i++) {
    state = state.add(inputStates[i]);
  }
  state = state.normalize();
  
  const evolution = new EntropyDrivenEvolution(state, 0.15, coherenceThreshold, 0.01);
  
  // Evolve toward stable resonance
  let prevEntropy = state.entropy();
  for (let i = 0; i < maxIterations; i++) {
    evolution.step();
    const currentEntropy = evolution.state.entropy();
    
    // Check for stable state (entropy no longer decreasing)
    if (prevEntropy - currentEntropy < 0.001) {
      break;
    }
    prevEntropy = currentEntropy;
  }
  
  return new SymbolicComputeResult(
    evolution.state,
    evolution.history.length,
    evolution.state.entropy(),
    evolution.state.dominant(5)
  );
}

export class SymbolicComputeResult {
  result: PrimeHilbertState;
  iterations: i32;
  finalEntropy: f64;
  dominant: Array<DominantPrime>;
  
  constructor(result: PrimeHilbertState, iterations: i32, finalEntropy: f64, dominant: Array<DominantPrime>) {
    this.result = result;
    this.iterations = iterations;
    this.finalEntropy = finalEntropy;
    this.dominant = dominant;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Factorize a number into prime factors
 */
function factorize(n: i32): Map<Prime, i32> {
  const factors = new Map<Prime, i32>();
  let d = 2;
  
  while (n > 1) {
    while (n % d == 0) {
      const current = factors.has(<Prime>d) ? factors.get(<Prime>d) : 0;
      factors.set(<Prime>d, current + 1);
      n = n / d;
    }
    d++;
    if (d * d > n && n > 1) {
      const current = factors.has(<Prime>n) ? factors.get(<Prime>n) : 0;
      factors.set(<Prime>n, current + 1);
      break;
    }
  }
  
  return factors;
}