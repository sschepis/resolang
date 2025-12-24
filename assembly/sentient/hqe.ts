/**
 * Holographic Quantum Encoding (HQE)
 *
 * Implements the holographic projection mechanism from "A Design for a
 * Sentient Observer" paper, Section 5.
 *
 * Key features:
 * - Discrete Fourier Transform holographic projection (equation 13)
 * - Spatial interference patterns from prime states
 * - Pattern reconstruction via inverse DFT (equation 15)
 * - Intensity patterns (equation 14)
 * - Dynamic λ(t) stabilization control (equation 12)
 * - Distributed, non-local semantic representation
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { generatePrimesOptimized } from '../core/math-primes';

/**
 * Complex number for holographic field
 */
export class Complex {
  constructor(
    public re: f64 = 0,
    public im: f64 = 0
  ) {}
  
  static fromPolar(r: f64, theta: f64): Complex {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }
  
  add(other: Complex): Complex {
    return new Complex(this.re + other.re, this.im + other.im);
  }
  
  sub(other: Complex): Complex {
    return new Complex(this.re - other.re, this.im - other.im);
  }
  
  mul(other: Complex): Complex {
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }
  
  scale(k: f64): Complex {
    return new Complex(this.re * k, this.im * k);
  }
  
  norm(): f64 {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }
  
  normSq(): f64 {
    return this.re * this.re + this.im * this.im;
  }
  
  phase(): f64 {
    return Math.atan2(this.im, this.re);
  }
  
  conjugate(): Complex {
    return new Complex(this.re, -this.im);
  }
}

/**
 * Spatial frequency for a prime
 */
export class SpatialFrequency {
  constructor(
    public prime: i32,
    public kx: f64,
    public ky: f64,
    public wavelength: f64
  ) {}
}

/**
 * Lambda history entry for stabilization tracking
 */
export class LambdaHistoryEntry {
  constructor(
    public timestamp: i64,
    public coherence: f64,
    public entropy: f64,
    public smfEntropy: f64,
    public arg: f64,
    public lambda: f64
  ) {}
}

/**
 * Stabilization Controller
 *
 * Implements dynamic λ(t) from equation 12:
 * λ(t) = λ₀ · σ(aC·C(t) - aS·S(t) - aSMF·SSMF(s(t)))
 *
 * Controls the "condensation pressure" - balance between
 * unitary evolution and dissipative stabilization.
 */
export class StabilizationController implements Serializable {
  /** Base stabilization rate λ₀ */
  lambda0: f64;
  
  /** Weighting coefficients */
  aC: f64;      // Coherence weight (positive: high C increases λ)
  aS: f64;      // Entropy weight (positive: high S decreases λ)
  aSMF: f64;    // SMF entropy weight
  
  /** Sigmoid steepness */
  steepness: f64;
  
  /** Bounds for λ */
  lambdaMin: f64;
  lambdaMax: f64;
  
  /** History for analysis */
  history: LambdaHistoryEntry[];
  maxHistory: i32;
  
  constructor(
    lambda0: f64 = 0.1,
    aC: f64 = 1.0,
    aS: f64 = 0.8,
    aSMF: f64 = 0.5,
    steepness: f64 = 2.0,
    lambdaMin: f64 = 0.01,
    lambdaMax: f64 = 0.5,
    maxHistory: i32 = 100
  ) {
    this.lambda0 = lambda0;
    this.aC = aC;
    this.aS = aS;
    this.aSMF = aSMF;
    this.steepness = steepness;
    this.lambdaMin = lambdaMin;
    this.lambdaMax = lambdaMax;
    this.history = [];
    this.maxHistory = maxHistory;
  }
  
  /**
   * Sigmoid squashing function σ
   * Maps (-∞, ∞) → (0, 1)
   */
  sigmoid(x: f64): f64 {
    return 1.0 / (1.0 + Math.exp(-this.steepness * x));
  }
  
  /**
   * Compute current λ(t) value
   *
   * λ(t) = λ₀ · σ(aC·C(t) - aS·S(t) - aSMF·SSMF(s(t)))
   *
   * @param coherence Global coherence C(t) ∈ [0, 1]
   * @param entropy System entropy S(t)
   * @param smfEntropy SMF entropy SSMF
   * @returns Stabilization rate λ(t)
   */
  computeLambda(coherence: f64, entropy: f64, smfEntropy: f64 = 0): f64 {
    // Compute the argument to the sigmoid
    const arg = this.aC * coherence - this.aS * entropy - this.aSMF * smfEntropy;
    
    // Apply sigmoid and scale by λ₀
    const lambda = this.lambda0 * this.sigmoid(arg);
    
    // Clamp to bounds
    const clampedLambda = Math.max(this.lambdaMin, Math.min(this.lambdaMax, lambda));
    
    // Record to history
    this.history.push(new LambdaHistoryEntry(
      Date.now() as i64,
      coherence,
      entropy,
      smfEntropy,
      arg,
      clampedLambda
    ));
    
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    return clampedLambda;
  }
  
  /**
   * Get the interpretation of current λ
   */
  interpret(lambda: f64): string {
    if (lambda > 0.3) {
      return "high_stabilization"; // Strong condensation pressure
    } else if (lambda > 0.1) {
      return "normal"; // Balanced
    } else {
      return "low_stabilization"; // More unitary/exploratory
    }
  }
  
  /**
   * Get recent lambda trend
   */
  getTrend(): f64 {
    if (this.history.length < 5) return 0;
    
    const n = this.history.length;
    const recentStart = Math.max(0, n - 10) as i32;
    const mid = (recentStart + n) / 2;
    
    let firstSum: f64 = 0;
    let firstCount: i32 = 0;
    let secondSum: f64 = 0;
    let secondCount: i32 = 0;
    
    for (let i = recentStart; i < n; i++) {
      if (i < mid) {
        firstSum += this.history[i].lambda;
        firstCount++;
      } else {
        secondSum += this.history[i].lambda;
        secondCount++;
      }
    }
    
    const firstAvg = firstCount > 0 ? firstSum / f64(firstCount) : 0;
    const secondAvg = secondCount > 0 ? secondSum / f64(secondCount) : 0;
    
    return secondAvg - firstAvg;
  }
  
  /**
   * Get current lambda (last recorded)
   */
  getCurrentLambda(): f64 {
    if (this.history.length == 0) return this.lambda0;
    return this.history[this.history.length - 1].lambda;
  }
  
  /**
   * Reset controller
   */
  reset(): void {
    this.history = [];
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("lambda0", this.lambda0)
      .addNumberField("aC", this.aC)
      .addNumberField("aS", this.aS)
      .addNumberField("aSMF", this.aSMF)
      .addNumberField("currentLambda", this.getCurrentLambda())
      .addNumberField("trend", this.getTrend())
      .addStringField("interpretation", this.interpret(this.getCurrentLambda()))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `StabilizationController(λ=${toFixed(this.getCurrentLambda(), 4)})`;
  }
}

/**
 * Holographic Encoder
 * 
 * Projects prime-amplitude states into spatial interference patterns
 * using DFT, enabling distributed, reconstruction-capable memory.
 */
export class HolographicEncoder implements Serializable {
  /** Size of the 2D holographic grid */
  gridSize: i32 = 64;
  
  /** Primes used for encoding */
  primes: i32[] = [];
  
  /** Prime to index map */
  primeToIndex: Map<i32, i32> = new Map<i32, i32>();
  
  /** Wavelength scaling factor */
  wavelengthScale: f64 = 10.0;
  
  /** Global phase offset */
  phaseOffset: f64 = 0.0;
  
  /** Spatial frequencies for each prime */
  spatialFrequencies: SpatialFrequency[] = [];
  
  /** Holographic field (flattened 2D complex array) */
  fieldRe: Float64Array = new Float64Array(0);
  fieldIm: Float64Array = new Float64Array(0);
  
  /** Stabilization controller for dynamic λ(t) */
  stabilization: StabilizationController = new StabilizationController();
  
  constructor(
    gridSize: i32 = 64,
    primeCount: i32 = 64,
    wavelengthScale: f64 = 10,
    phaseOffset: f64 = 0
  ) {
    this.gridSize = gridSize;
    this.wavelengthScale = wavelengthScale;
    this.phaseOffset = phaseOffset;
    
    // Generate primes
    const primes64 = generatePrimesOptimized(primeCount);
    for (let i = 0; i < primes64.length; i++) {
      this.primes.push(i32(primes64[i]));
    }
    
    // Create prime to index map
    for (let i = 0; i < this.primes.length; i++) {
      this.primeToIndex.set(this.primes[i], i);
    }
    
    // Compute spatial frequencies
    this.spatialFrequencies = this.computeSpatialFrequencies();
    
    // Create field
    const fieldLen = gridSize * gridSize;
    this.fieldRe = new Float64Array(fieldLen);
    this.fieldIm = new Float64Array(fieldLen);
  }
  
  /**
   * Compute spatial frequencies for each prime
   * Maps primes to (kx, ky) frequency pairs using golden ratio spiral
   */
  computeSpatialFrequencies(): SpatialFrequency[] {
    const phi = (1.0 + Math.sqrt(5.0)) / 2.0; // Golden ratio
    const frequencies: SpatialFrequency[] = [];
    
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      // Use logarithmic prime mapping for wavelength
      const wavelength = this.wavelengthScale * (1.0 + Math.log(f64(p)) / Math.log(2.0));
      const k = 2.0 * Math.PI / wavelength;
      
      // Distribute angles using golden ratio for optimal coverage
      const angle = 2.0 * Math.PI * f64(i) * phi;
      
      frequencies.push(new SpatialFrequency(
        p,
        k * Math.cos(angle),
        k * Math.sin(angle),
        wavelength
      ));
    }
    
    return frequencies;
  }
  
  /**
   * Clear the holographic field
   */
  clearField(): void {
    for (let i = 0; i < this.fieldRe.length; i++) {
      this.fieldRe[i] = 0;
      this.fieldIm[i] = 0;
    }
  }
  
  /**
   * Get field index from x, y coordinates
   */
  private fieldIndex(x: i32, y: i32): i32 {
    return y * this.gridSize + x;
  }
  
  /**
   * Project prime amplitudes into the holographic field (equation 13)
   * H(x,y,t) = Σp αp(t) exp(i[kp·r + φp(t)])
   */
  project(amplitudes: Float64Array, phases: Float64Array, clear: bool = true): void {
    if (clear) {
      this.clearField();
    }
    
    // Project each prime's contribution
    for (let i = 0; i < this.primes.length; i++) {
      if (i >= i32(amplitudes.length)) break;
      
      const amp = amplitudes[i];
      if (amp < 1e-10) continue;
      
      const freq = this.spatialFrequencies[i];
      const primePhase = i < i32(phases.length) ? phases[i] : 0;
      
      // Add this prime's plane wave to the field
      for (let x: i32 = 0; x < this.gridSize; x++) {
        for (let y: i32 = 0; y < this.gridSize; y++) {
          // k·r = kx*x + ky*y
          const phase = freq.kx * f64(x) + freq.ky * f64(y) + this.phaseOffset + primePhase;
          
          // H(x,y) += αp * exp(i*k·r)
          const idx = this.fieldIndex(x, y);
          this.fieldRe[idx] += amp * Math.cos(phase);
          this.fieldIm[idx] += amp * Math.sin(phase);
        }
      }
    }
  }
  
  /**
   * Reconstruct amplitudes from holographic field (equation 15)
   * Uses inverse DFT to recover prime amplitudes
   */
  reconstruct(): Map<i32, Complex> {
    const amplitudes = new Map<i32, Complex>();
    const gridSizeSq = f64(this.gridSize * this.gridSize);
    
    for (let i = 0; i < this.primes.length; i++) {
      const freq = this.spatialFrequencies[i];
      const prime = this.primes[i];
      
      // Inverse DFT at this frequency
      let sumRe: f64 = 0;
      let sumIm: f64 = 0;
      
      for (let x: i32 = 0; x < this.gridSize; x++) {
        for (let y: i32 = 0; y < this.gridSize; y++) {
          // Inverse: exp(-i*k·r)
          const phase = -(freq.kx * f64(x) + freq.ky * f64(y) + this.phaseOffset);
          
          const idx = this.fieldIndex(x, y);
          const fieldRe = this.fieldRe[idx];
          const fieldIm = this.fieldIm[idx];
          
          // (fieldRe + i*fieldIm) * (cos(phase) + i*sin(phase))
          const cosP = Math.cos(phase);
          const sinP = Math.sin(phase);
          
          sumRe += fieldRe * cosP - fieldIm * sinP;
          sumIm += fieldRe * sinP + fieldIm * cosP;
        }
      }
      
      // Normalize by grid size
      amplitudes.set(prime, new Complex(sumRe / gridSizeSq, sumIm / gridSizeSq));
    }
    
    return amplitudes;
  }
  
  /**
   * Compute intensity pattern (equation 14)
   * I(x,y,t) = |H(x,y,t)|²
   */
  intensity(): Float64Array {
    const I = new Float64Array(this.gridSize * this.gridSize);
    for (let i = 0; i < i32(I.length); i++) {
      I[i] = this.fieldRe[i] * this.fieldRe[i] + this.fieldIm[i] * this.fieldIm[i];
    }
    return I;
  }
  
  /**
   * Compute total field energy
   */
  totalEnergy(): f64 {
    let energy: f64 = 0;
    for (let i = 0; i < i32(this.fieldRe.length); i++) {
      energy += this.fieldRe[i] * this.fieldRe[i] + this.fieldIm[i] * this.fieldIm[i];
    }
    return energy;
  }
  
  /**
   * Compute field entropy (based on intensity distribution)
   */
  fieldEntropy(): f64 {
    const I = this.intensity();
    const total = this.totalEnergy();
    
    if (total < 1e-10) return 0;
    
    let H: f64 = 0;
    for (let i = 0; i < i32(I.length); i++) {
      const p = I[i] / total;
      if (p > 1e-10) {
        H -= p * Math.log2(p);
      }
    }
    
    return H;
  }
  
  /**
   * Scale field by a scalar
   */
  scale(scalar: f64): void {
    for (let i = 0; i < i32(this.fieldRe.length); i++) {
      this.fieldRe[i] *= scalar;
      this.fieldIm[i] *= scalar;
    }
  }
  
  /**
   * Evolve the holographic field with stabilization (equation 11)
   *
   * d|Ψ(t)⟩/dt = iĤ|Ψ(t)⟩ - λ(t)D̂(Ψ,s)|Ψ(t)⟩
   *
   * The first term is unitary (phase evolution), the second is dissipative
   * (stabilization toward coherent attractors).
   */
  evolve(coherence: f64, entropy: f64, smfEntropy: f64 = 0, dt: f64 = 0.016): HQEEvolutionResult {
    // Compute dynamic λ(t) using stabilization controller
    const lambda = this.stabilization.computeLambda(coherence, entropy, smfEntropy);
    
    // For each cell, apply damped evolution:
    // New amplitude = old amplitude * exp(-λ * dt)
    // This implements the dissipative term -λD̂|Ψ⟩
    const dampingFactor = Math.exp(-lambda * dt);
    
    // Apply stabilization damping
    for (let i = 0; i < i32(this.fieldRe.length); i++) {
      const re = this.fieldRe[i];
      const im = this.fieldIm[i];
      // Dampen high-energy cells more than low-energy (stabilization)
      const intensity = re * re + im * im;
      const localDamping = dampingFactor * (1.0 + lambda * intensity * 0.1);
      
      this.fieldRe[i] = re * localDamping;
      this.fieldIm[i] = im * localDamping;
    }
    
    return new HQEEvolutionResult(
      lambda,
      this.stabilization.interpret(lambda),
      this.totalEnergy(),
      this.fieldEntropy()
    );
  }
  
  /**
   * Get stabilization statistics
   */
  getStabilizationStats(): StabilizationStats {
    const current = this.stabilization.getCurrentLambda();
    
    let sum: f64 = 0;
    let min: f64 = current;
    let max: f64 = current;
    
    for (let i = 0; i < this.stabilization.history.length; i++) {
      const lambda = this.stabilization.history[i].lambda;
      sum += lambda;
      if (lambda < min) min = lambda;
      if (lambda > max) max = lambda;
    }
    
    const count = this.stabilization.history.length;
    const mean = count > 0 ? sum / f64(count) : current;
    
    return new StabilizationStats(
      current,
      mean,
      min,
      max,
      this.stabilization.getTrend(),
      this.stabilization.interpret(current)
    );
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("gridSize", f64(this.gridSize))
      .addNumberField("primeCount", f64(this.primes.length))
      .addNumberField("totalEnergy", this.totalEnergy())
      .addNumberField("fieldEntropy", this.fieldEntropy())
      .addNumberField("currentLambda", this.stabilization.getCurrentLambda())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `HQE(grid=${this.gridSize}, E=${toFixed(this.totalEnergy(), 3)}, H=${toFixed(this.fieldEntropy(), 3)})`;
  }
}

/**
 * HQE Evolution result
 */
export class HQEEvolutionResult {
  constructor(
    public lambda: f64,
    public interpretation: string,
    public totalEnergy: f64,
    public fieldEntropy: f64
  ) {}
}

/**
 * Stabilization statistics
 */
export class StabilizationStats {
  constructor(
    public current: f64,
    public mean: f64,
    public min: f64,
    public max: f64,
    public trend: f64,
    public interpretation: string
  ) {}
}

/**
 * Holographic Memory
 * 
 * Stores and retrieves patterns using holographic interference.
 * Enables content-addressable, distributed, fault-tolerant memory.
 */
export class HolographicMemory implements Serializable {
  /** Encoder used for projections */
  encoder: HolographicEncoder;
  
  /** Stored memories */
  memories: HolographicMemoryEntry[];
  
  /** Maximum memories */
  maxMemories: i32;
  
  /** Decay rate */
  decayRate: f64;
  
  constructor(
    gridSize: i32 = 64,
    primeCount: i32 = 64,
    maxMemories: i32 = 100,
    decayRate: f64 = 0.01
  ) {
    this.encoder = new HolographicEncoder(gridSize, primeCount);
    this.memories = [];
    this.maxMemories = maxMemories;
    this.decayRate = decayRate;
  }
  
  /**
   * Store a pattern in memory
   */
  store(amplitudes: Float64Array, phases: Float64Array, metadata: string = ""): i32 {
    // Create a new encoder for this memory
    const entry = new HolographicMemoryEntry(
      this.memories.length,
      amplitudes,
      phases,
      metadata,
      Date.now() as i64,
      0,
      1.0
    );
    
    this.memories.push(entry);
    
    // Prune if over capacity
    if (this.memories.length > this.maxMemories) {
      this.prune();
    }
    
    return entry.id;
  }
  
  /**
   * Recall the best matching memory
   */
  recall(cueAmplitudes: Float64Array, cuePhases: Float64Array, threshold: f64 = 0.3): HolographicRecallResult | null {
    if (this.memories.length == 0) return null;
    
    let bestMatch: HolographicMemoryEntry | null = null;
    let bestScore: f64 = threshold;
    
    for (let i = 0; i < this.memories.length; i++) {
      const memory = this.memories[i];
      const score = this.correlate(cueAmplitudes, cuePhases, memory);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = memory;
      }
    }
    
    if (bestMatch !== null) {
      bestMatch.accessCount++;
      bestMatch.strength = Math.min(1.0, bestMatch.strength + 0.1);
      
      return new HolographicRecallResult(
        bestMatch.amplitudes,
        bestMatch.phases,
        bestMatch.metadata,
        bestScore,
        bestMatch.strength
      );
    }
    
    return null;
  }
  
  /**
   * Correlate cue with a memory entry
   */
  correlate(cueAmplitudes: Float64Array, cuePhases: Float64Array, memory: HolographicMemoryEntry): f64 {
    let dotProduct: f64 = 0;
    let cueMag: f64 = 0;
    let memMag: f64 = 0;
    
    const n = Math.min(Math.min(i32(cueAmplitudes.length), i32(memory.amplitudes.length)), this.encoder.primes.length) as i32;
    
    for (let i = 0; i < n; i++) {
      dotProduct += cueAmplitudes[i] * memory.amplitudes[i];
      cueMag += cueAmplitudes[i] * cueAmplitudes[i];
      memMag += memory.amplitudes[i] * memory.amplitudes[i];
    }
    
    if (cueMag < 1e-10 || memMag < 1e-10) return 0;
    
    const similarity = dotProduct / (Math.sqrt(cueMag) * Math.sqrt(memMag));
    
    // Weight by memory strength
    return similarity * memory.strength;
  }
  
  /**
   * Apply decay to all memories
   */
  decay(): void {
    for (let i = 0; i < this.memories.length; i++) {
      this.memories[i].strength *= (1.0 - this.decayRate);
    }
    
    // Remove very weak memories
    const newMemories: HolographicMemoryEntry[] = [];
    for (let i = 0; i < this.memories.length; i++) {
      if (this.memories[i].strength > 0.1) {
        newMemories.push(this.memories[i]);
      }
    }
    this.memories = newMemories;
  }
  
  /**
   * Prune memories to capacity
   */
  prune(): void {
    if (this.memories.length <= this.maxMemories) return;
    
    // Sort by strength * accessCount
    this.memories.sort((a: HolographicMemoryEntry, b: HolographicMemoryEntry): i32 => {
      const scoreA = a.strength * f64(a.accessCount + 1);
      const scoreB = b.strength * f64(b.accessCount + 1);
      if (scoreB > scoreA) return 1;
      if (scoreB < scoreA) return -1;
      return 0;
    });
    
    // Keep top memories
    this.memories = this.memories.slice(0, this.maxMemories);
  }
  
  /**
   * Get memory count
   */
  count(): i32 {
    return this.memories.length;
  }
  
  /**
   * Clear all memories
   */
  clear(): void {
    this.memories = [];
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("memoryCount", f64(this.memories.length))
      .addNumberField("maxMemories", f64(this.maxMemories))
      .addNumberField("decayRate", this.decayRate)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `HolographicMemory(count=${this.memories.length})`;
  }
}

/**
 * Holographic memory entry
 */
export class HolographicMemoryEntry {
  constructor(
    public id: i32,
    public amplitudes: Float64Array,
    public phases: Float64Array,
    public metadata: string,
    public timestamp: i64,
    public accessCount: i32,
    public strength: f64
  ) {}
}

/**
 * Holographic recall result
 */
export class HolographicRecallResult {
  constructor(
    public amplitudes: Float64Array,
    public phases: Float64Array,
    public metadata: string,
    public score: f64,
    public strength: f64
  ) {}
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a holographic encoder
 */
export function createHolographicEncoder(
  gridSize: i32 = 64,
  primeCount: i32 = 64
): HolographicEncoder {
  return new HolographicEncoder(gridSize, primeCount);
}

/**
 * Create a holographic memory
 */
export function createHolographicMemory(
  gridSize: i32 = 64,
  primeCount: i32 = 64,
  maxMemories: i32 = 100
): HolographicMemory {
  return new HolographicMemory(gridSize, primeCount, maxMemories);
}

/**
 * Create a stabilization controller
 */
export function createStabilizationController(
  lambda0: f64 = 0.1
): StabilizationController {
  return new StabilizationController(lambda0);
}