/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Discrete Observer Pipeline
 * 
 * A standalone pipeline for the discrete observer implementing the full
 * discrete.pdf specification:
 * - Discrete phase dynamics: φ_p(t+1) = (φ_p(t) + Δ_p + Couple(t)) mod M
 * - Histogram coherence: C(t) = max_φ h(φ,t) / Σ h(φ,t)
 * - Hebbian coupling: J_pq ← J_pq + η·A_p·A_q if phase-aligned
 * - SMF integration: 16-axis semantic memory field
 */

import { PipelineState } from './types';

/**
 * Configuration for discrete pipeline
 */
export class DiscreteConfig {
  // Number of oscillators (primes)
  numOscillators: i32 = 16;
  
  // Phase resolution M (number of discrete phase bins)
  phaseResolution: i32 = 1000;
  
  // Maximum amplitude
  amplitudeMax: f64 = 100.0;
  
  // Amplitude decay per tick (δ parameter)
  amplitudeDecay: f64 = 0.95;
  
  // Amplitude threshold for "active" classification
  activeThreshold: f64 = 0.5;
  
  // Base boost amount for excitation
  baseBoostAmount: f64 = 10.0;
  
  // Coupling strength K
  couplingStrength: i32 = 50;
  
  // Coherence threshold for proposals/events
  coherenceThreshold: f64 = 0.15;
  
  // Hebbian learning rate η
  hebbianLearningRate: f64 = 0.01;
  
  // Use Enochian primes (true) or default primes (false)
  useEnochianPrimes: bool = true;
  
  // Enable lockup detection and tunneling
  enableLockupRecovery: bool = true;
  
  // Lockup detection window
  lockupWindow: i32 = 50;
  
  // Lockup variance threshold
  lockupThreshold: f64 = 0.001;
  
  static default(): DiscreteConfig {
    return new DiscreteConfig();
  }
  
  static fast(): DiscreteConfig {
    const config = new DiscreteConfig();
    config.numOscillators = 8;
    config.phaseResolution = 500;
    return config;
  }
  
  static precise(): DiscreteConfig {
    const config = new DiscreteConfig();
    config.numOscillators = 32;
    config.phaseResolution = 2000;
    config.hebbianLearningRate = 0.005;
    return config;
  }
}

/**
 * Discrete step result with semantic interpretation
 */
export class DiscreteTickResult {
  constructor(
    public tick: bool,           // Did discrete tick fire?
    public coherence: f64,       // Current coherence C(t)
    public entropy: f64,         // SMF entropy
    public lambda: f64,          // Stabilization parameter λ(t)
    public activeCount: i32,     // Number of active oscillators
    public dominantPhase: i32,   // Most populated phase bin
    public peakPrime: i32,       // Highest amplitude prime
    public smfDominant: i32      // Dominant SMF axis
  ) {}
  
  static empty(): DiscreteTickResult {
    return new DiscreteTickResult(false, 0.0, 1.0, 0.0, 0, 0, 0, 0);
  }
}

/**
 * Discrete Observer Pipeline
 * 
 * Self-contained pipeline for discrete phase dynamics.
 * Uses the pure AssemblyScript implementation without WASM imports.
 */
export class DiscretePipeline {
  private config: DiscreteConfig;
  private state: PipelineState;
  
  // Oscillator state
  private phases: Int32Array;      // φ_p(t) discrete phases (0 to M-1)
  private amplitudes: Float64Array; // A_p(t) amplitudes
  private frequencies: Int32Array;  // Δ_p natural frequencies
  private coupling: Int8Array;      // J_pq coupling matrix (flattened)
  private smf: Float64Array;        // 16-axis SMF
  private primes: Int32Array;       // Prime numbers for each oscillator
  
  // History for lockup detection
  private coherenceHistory: Float64Array;
  private historyIndex: i32 = 0;
  
  // Metrics
  private tickCount: i64 = 0;
  private lastCoherence: f64 = 0.0;
  private lastResult: DiscreteTickResult = DiscreteTickResult.empty();
  
  constructor(config: DiscreteConfig) {
    this.config = config;
    this.state = new PipelineState();
    
    const n = config.numOscillators;
    
    // Initialize arrays
    this.phases = new Int32Array(n);
    this.amplitudes = new Float64Array(n);
    this.frequencies = new Int32Array(n);
    this.coupling = new Int8Array(n * n);
    this.smf = new Float64Array(16);
    this.primes = new Int32Array(n);
    this.coherenceHistory = new Float64Array(config.lockupWindow);
    
    // Initialize primes
    this.initializePrimes(config.useEnochianPrimes);
    
    // Initialize frequencies from primes
    for (let i: i32 = 0; i < n; i++) {
      this.frequencies[i] = this.primes[i] % config.phaseResolution;
    }
    
    // Initialize coupling matrix (identity + Enochian bonuses)
    this.resetCouplingMatrix();
    
    // Random initial phases
    for (let i: i32 = 0; i < n; i++) {
      this.phases[i] = i32(Math.random() * f64(config.phaseResolution));
    }
    
    this.lastResult = DiscreteTickResult.empty();
  }
  
  /**
   * Initialize prime numbers for oscillators
   */
  private initializePrimes(_useEnochian: bool): void {
    // First 7 are always Enochian
    const enochian: i32[] = [2, 3, 5, 7, 11, 13, 17];
    const extended: i32[] = [19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    
    const n = this.config.numOscillators;
    for (let i: i32 = 0; i < n; i++) {
      if (i < 7) {
        this.primes[i] = enochian[i];
      } else if (i - 7 < extended.length) {
        this.primes[i] = extended[i - 7];
      } else {
        this.primes[i] = extended[extended.length - 1] + (i - 7 - extended.length + 1) * 2;
      }
    }
  }
  
  /**
   * Reset coupling matrix to default
   */
  private resetCouplingMatrix(): void {
    const n = this.config.numOscillators;
    for (let i: i32 = 0; i < n; i++) {
      for (let j: i32 = 0; j < n; j++) {
        if (i == j) {
          this.coupling[i * n + j] = 0;
        } else {
          // Enochian primes (first 7) get stronger coupling
          const isEnochianI = i < 7;
          const isEnochianJ = j < 7;
          if (isEnochianI && isEnochianJ) {
            this.coupling[i * n + j] = 2; // Strong coupling
          } else if (isEnochianI || isEnochianJ) {
            this.coupling[i * n + j] = 1; // Medium coupling
          } else {
            this.coupling[i * n + j] = 0; // Weak coupling
          }
        }
      }
    }
  }
  
  /**
   * Start the pipeline
   */
  start(): void {
    this.state.isRunning = true;
  }
  
  /**
   * Stop the pipeline
   */
  stop(): void {
    this.state.isRunning = false;
  }
  
  /**
   * Check if running
   */
  isRunning(): bool {
    return this.state.isRunning;
  }
  
  /**
   * Execute one discrete tick
   */
  tick(): DiscreteTickResult {
    if (!this.state.isRunning) {
      return DiscreteTickResult.empty();
    }
    
    const n = this.config.numOscillators;
    const M = this.config.phaseResolution;
    const K = this.config.couplingStrength;
    const delta = this.config.amplitudeDecay;
    const threshold = this.config.activeThreshold;
    
    // Build phase histogram for coherence
    const histogram = new Int32Array(M);
    let totalWeight: f64 = 0.0;
    
    for (let i: i32 = 0; i < n; i++) {
      const weight = this.amplitudes[i] > threshold ? 1 : 0;
      histogram[this.phases[i]] += weight;
      totalWeight += f64(weight);
    }
    
    // Find dominant phase bin
    let maxCount: i32 = 0;
    let dominantPhase: i32 = 0;
    for (let p: i32 = 0; p < M; p++) {
      if (histogram[p] > maxCount) {
        maxCount = histogram[p];
        dominantPhase = p;
      }
    }
    
    // Calculate coherence C(t) = max(h) / Σh
    const coherence = totalWeight > 0 ? f64(maxCount) / totalWeight : 0.0;
    this.lastCoherence = coherence;
    
    // Update coherence history for lockup detection
    this.coherenceHistory[this.historyIndex] = coherence;
    this.historyIndex = (this.historyIndex + 1) % this.config.lockupWindow;
    
    // Calculate coupling term and update phases
    for (let i: i32 = 0; i < n; i++) {
      let coupling: f64 = 0.0;
      
      for (let j: i32 = 0; j < n; j++) {
        if (i != j && this.amplitudes[j] > threshold) {
          const J_ij = f64(this.coupling[i * n + j]);
          const phaseDiff = this.phases[j] - this.phases[i];
          // sin approximation for phase coupling
          const sinTerm = f64(phaseDiff) / f64(M) * 6.28318; // 2π
          coupling += J_ij * Math.sin(sinTerm);
        }
      }
      
      // Discrete phase update: φ_p(t+1) = (φ_p(t) + Δ_p + K*Couple) mod M
      const couplingTerm = i32(f64(K) * coupling / f64(n));
      this.phases[i] = (this.phases[i] + this.frequencies[i] + couplingTerm + M) % M;
    }
    
    // Apply amplitude decay
    for (let i: i32 = 0; i < n; i++) {
      this.amplitudes[i] *= delta;
    }
    
    // Apply Hebbian learning if above coherence threshold
    if (coherence >= this.config.coherenceThreshold) {
      this.applyHebbianLearning();
    }
    
    // Update SMF
    this.updateSMF();
    
    // Calculate metrics
    const entropy = this.calculateSMFEntropy();
    const lambda = this.config.coherenceThreshold - coherence;
    
    // Count active oscillators and find peak
    let activeCount: i32 = 0;
    let peakPrime: i32 = 0;
    let maxAmp: f64 = 0.0;
    for (let i: i32 = 0; i < n; i++) {
      if (this.amplitudes[i] > threshold) {
        activeCount++;
      }
      if (this.amplitudes[i] > maxAmp) {
        maxAmp = this.amplitudes[i];
        peakPrime = this.primes[i];
      }
    }
    
    // Find dominant SMF axis
    let smfDominant: i32 = 0;
    let maxSMF: f64 = 0.0;
    for (let a: i32 = 0; a < 16; a++) {
      if (this.smf[a] > maxSMF) {
        maxSMF = this.smf[a];
        smfDominant = a;
      }
    }
    
    this.tickCount++;
    
    this.lastResult = new DiscreteTickResult(
      coherence >= this.config.coherenceThreshold,
      coherence,
      entropy,
      lambda,
      activeCount,
      dominantPhase,
      peakPrime,
      smfDominant
    );
    
    return this.lastResult;
  }
  
  /**
   * Apply Hebbian learning to coupling matrix
   */
  private applyHebbianLearning(): void {
    const n = this.config.numOscillators;
    const eta = this.config.hebbianLearningRate;
    const threshold = this.config.activeThreshold;
    const M = this.config.phaseResolution;
    
    for (let i: i32 = 0; i < n; i++) {
      if (this.amplitudes[i] < threshold) continue;
      
      for (let j: i32 = i + 1; j < n; j++) {
        if (this.amplitudes[j] < threshold) continue;
        
        // Check phase alignment
        const phaseDiff = Math.abs(this.phases[i] - this.phases[j]);
        const aligned = phaseDiff < M / 10 || phaseDiff > M * 9 / 10;
        
        if (aligned) {
          // Strengthen coupling
          const delta = i8(eta * this.amplitudes[i] * this.amplitudes[j]);
          this.coupling[i * n + j] = i8(Math.min(127, i32(this.coupling[i * n + j]) + i32(delta)));
          this.coupling[j * n + i] = this.coupling[i * n + j];
        }
      }
    }
  }
  
  /**
   * Update SMF from active oscillators
   */
  private updateSMF(): void {
    const n = this.config.numOscillators;
    const threshold = this.config.activeThreshold;
    
    // Decay existing SMF
    for (let a: i32 = 0; a < 16; a++) {
      this.smf[a] *= 0.95;
    }
    
    // Add contributions from active oscillators
    for (let i: i32 = 0; i < n; i++) {
      if (this.amplitudes[i] > threshold) {
        const axis = this.primes[i] % 16;
        this.smf[axis] += this.amplitudes[i] * 0.1;
      }
    }
    
    // Normalize
    let total: f64 = 0.0;
    for (let a: i32 = 0; a < 16; a++) {
      total += this.smf[a];
    }
    if (total > 1.0) {
      for (let a: i32 = 0; a < 16; a++) {
        this.smf[a] /= total;
      }
    }
  }
  
  /**
   * Calculate SMF entropy
   */
  private calculateSMFEntropy(): f64 {
    let entropy: f64 = 0.0;
    for (let a: i32 = 0; a < 16; a++) {
      if (this.smf[a] > 0.001) {
        entropy -= this.smf[a] * Math.log(this.smf[a]);
      }
    }
    return entropy / Math.log(16.0); // Normalize to [0,1]
  }
  
  // ============================================================================
  // Control Methods
  // ============================================================================
  
  /**
   * Boost an oscillator by index
   */
  boostIndex(index: i32, amount: f64 = 10.0): void {
    if (index >= 0 && index < this.config.numOscillators) {
      this.amplitudes[index] = Math.min(this.config.amplitudeMax, this.amplitudes[index] + amount);
    }
  }
  
  /**
   * Boost by prime number
   */
  boostPrime(prime: i32, amount: f64 = 10.0): void {
    for (let i: i32 = 0; i < this.config.numOscillators; i++) {
      if (this.primes[i] == prime) {
        this.boostIndex(i, amount);
        return;
      }
    }
  }
  
  /**
   * Dampen all oscillators
   */
  dampenAll(factor: f64 = 0.5): void {
    for (let i: i32 = 0; i < this.config.numOscillators; i++) {
      this.amplitudes[i] *= factor;
    }
  }
  
  /**
   * Randomize coupling matrix
   */
  randomizeCoupling(): void {
    const n = this.config.numOscillators;
    for (let i: i32 = 0; i < n; i++) {
      for (let j: i32 = i + 1; j < n; j++) {
        const val = i8((Math.random() - 0.5) * 4.0);
        this.coupling[i * n + j] = val;
        this.coupling[j * n + i] = val;
      }
    }
  }
  
  /**
   * Reset coupling to default
   */
  resetCoupling(): void {
    this.resetCouplingMatrix();
  }
  
  /**
   * Reset the entire system
   */
  reset(): void {
    const n = this.config.numOscillators;
    
    for (let i: i32 = 0; i < n; i++) {
      this.phases[i] = i32(Math.random() * f64(this.config.phaseResolution));
      this.amplitudes[i] = 0.0;
    }
    
    for (let a: i32 = 0; a < 16; a++) {
      this.smf[a] = 0.0;
    }
    
    this.resetCouplingMatrix();
    this.tickCount = 0;
    this.lastCoherence = 0.0;
    this.lastResult = DiscreteTickResult.empty();
  }
  
  // ============================================================================
  // Getters
  // ============================================================================
  
  getCoherence(): f64 { return this.lastCoherence; }
  getAmplitude(index: i32): f64 { return this.amplitudes[index]; }
  getPhase(index: i32): i32 { return this.phases[index]; }
  getSMFAxis(axis: i32): f64 { return this.smf[axis]; }
  getPrime(index: i32): i32 { return this.primes[index]; }
  getTickCount(): i64 { return this.tickCount; }
  getLastResult(): DiscreteTickResult { return this.lastResult; }
  getConfig(): DiscreteConfig { return this.config; }
  
  getActiveCount(threshold: f64 = 0.5): i32 {
    let count: i32 = 0;
    for (let i: i32 = 0; i < this.config.numOscillators; i++) {
      if (this.amplitudes[i] > threshold) count++;
    }
    return count;
  }
  
  getAllAmplitudes(): Float64Array {
    return this.amplitudes;
  }
  
  getAllPhases(): Int32Array {
    return this.phases;
  }
  
  getSMF(): Float64Array {
    return this.smf;
  }
  
  /**
   * Check for lockup (low variance in coherence history)
   */
  isLockedUp(): bool {
    if (this.tickCount < i64(this.config.lockupWindow)) return false;
    
    let mean: f64 = 0.0;
    for (let i: i32 = 0; i < this.config.lockupWindow; i++) {
      mean += this.coherenceHistory[i];
    }
    mean /= f64(this.config.lockupWindow);
    
    let variance: f64 = 0.0;
    for (let i: i32 = 0; i < this.config.lockupWindow; i++) {
      const diff = this.coherenceHistory[i] - mean;
      variance += diff * diff;
    }
    variance /= f64(this.config.lockupWindow);
    
    return variance < this.config.lockupThreshold;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a discrete pipeline with default config
 */
export function createDiscretePipeline(config: DiscreteConfig | null = null): DiscretePipeline {
  const cfg = config !== null ? config : DiscreteConfig.default();
  return new DiscretePipeline(cfg);
}

/**
 * Create a fast discrete pipeline (fewer oscillators)
 */
export function createFastDiscretePipeline(): DiscretePipeline {
  return createDiscretePipeline(DiscreteConfig.fast());
}

/**
 * Create a precise discrete pipeline (more oscillators, slower learning)
 */
export function createPreciseDiscretePipeline(): DiscretePipeline {
  return createDiscretePipeline(DiscreteConfig.precise());
}