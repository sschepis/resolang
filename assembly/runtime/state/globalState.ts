// assembly/runtime/state/globalState.ts
// Global state management and coherence calculation for RISA runtime

import { IPrimeStateEngine } from './primeState';
import { IRegisterState } from './registerState';

/**
 * Coherence calculation result
 */
export class ICoherenceResult {
  constructor(
    public value: f64,
    public primes: StaticArray<i32>,
    public timestamp: f64
  ) {}
}

/**
 * Global coherence metrics
 */
export class IGlobalCoherence {
  constructor(
    public total: f64,
    public average: f64,
    public maximum: f64,
    public minimum: f64,
    public activePairs: i32,
    public timestamp: f64
  ) {}
}

/**
 * System entropy state
 */
class IEntropyState {
  constructor(
    public current: f64,
    public initial: f64,
    public lambda: f64,
    public elapsedTime: f64,
    public lastUpdate: f64
  ) {}
}

/**
 * Global state interface
 */
export interface IGlobalState {
  /**
   * Calculate pairwise coherence between two primes
   * C(p₁,p₂) = cos(φ[p₁] - φ[p₂]) × ψ[p₁] × ψ[p₂]
   */
  calculatePairwiseCoherence(prime1: i32, prime2: i32): ICoherenceResult;

  /**
   * Calculate global coherence across all active primes
   */
  calculateGlobalCoherence(): IGlobalCoherence;

  /**
   * Get current entropy state
   */
  getEntropyState(): IEntropyState;

  /**
   * Update entropy evolution
   */
  updateEntropy(deltaTime: f64): void;

  /**
   * Set entropy parameters
   */
  setEntropyParameters(S0: f64, lambda: f64): void;

  /**
   * Check if coherence threshold is met
   */
  isCoherenceThresholdMet(threshold: f64): bool;

  /**
   * Get coherence history
   */
  getCoherenceHistory(): Array<IGlobalCoherence>;

  /**
   * Reset global state
   */
  reset(): void;

  /**
   * Get system statistics
   */
  getSystemStats(): any;

  /**
   * Get current entropy value
   */
  getEntropy(): f64;

  /**
   * Evolve entropy by time step
   */
  evolveEntropy(deltaTime: f64): void;

  /**
   * Advance global time by one tick
   */
  tick(): void;

  /**
   * Get current time
   */
  getCurrentTime(): f64;

  /**
   * Get global coherence value (simplified)
   */
  getGlobalCoherence(): f64;

  /**
   * Clone the global state
   */
  clone(primeEngine: IPrimeStateEngine, registerState: IRegisterState): IGlobalState;
}

/**
 * Global state implementation
 */
export class GlobalState implements IGlobalState {
  private primeEngine: IPrimeStateEngine;
  private registerState: IRegisterState;
  private entropyState: IEntropyState;
  private coherenceHistory: Array<IGlobalCoherence> = [];
  private coherenceCache: Map<string, ICoherenceResult> = new Map();
  private cacheTimeout: f64 = 100; // ms

  constructor(primeEngine: IPrimeStateEngine, registerState: IRegisterState) {
    this.primeEngine = primeEngine;
    this.registerState = registerState;
    this.entropyState = new IEntropyState(
      1.0,
      1.0,
      0.1,
      0.0,
      Date.now() as f64
    );
  }

  calculatePairwiseCoherence(prime1: i32, prime2: i32): ICoherenceResult {
    const cacheKey = `${Math.min(prime1, prime2)}-${Math.max(prime1, prime2)}`;
    const now = Date.now();

    // Check cache first
    const cached = this.coherenceCache.get(cacheKey);
    if (cached && (now as f64 - cached.timestamp) < this.cacheTimeout) {
      return cached;
    }

    // Get oscillator states
    const osc1 = this.primeEngine.getOscillator(prime1);
    const osc2 = this.primeEngine.getOscillator(prime2);

    // Calculate phase difference
    const phaseDifference = osc1.phase - osc2.phase;

    // Calculate coherence: C(p₁,p₂) = cos(φ[p₁] - φ[p₂]) × ψ[p₁] × ψ[p₂]
    const coherenceValue = Math.cos(phaseDifference) * osc1.amplitude * osc2.amplitude;

    const result = new ICoherenceResult(
      coherenceValue,
      [prime1, prime2],
      now as f64
    );

    // Cache the result
    this.coherenceCache.set(cacheKey, result);

    return result;
  }

  calculateGlobalCoherence(): IGlobalCoherence {
    const activePrimes = this.primeEngine.getActivePrimes();
    const coherenceValues: f64[] = [];

    // Calculate all pairwise coherences
    for (let i = 0; i < activePrimes.length; i++) {
      for (let j = i + 1; j < activePrimes.length; j++) {
        const coherence = this.calculatePairwiseCoherence(activePrimes[i], activePrimes[j]);
        coherenceValues.push(coherence.value);
      }
    }

    const now = Date.now();
    let result: IGlobalCoherence;

    if (coherenceValues.length > 0) {
      const total = coherenceValues.reduce((sum, val) => sum + val, <f64>0);
      const average = total / coherenceValues.length;
      const maximum = coherenceValues.reduce((max, val) => Math.max(max, val), -Infinity);
      const minimum = coherenceValues.reduce((min, val) => Math.min(min, val), Infinity);

      result = new IGlobalCoherence(
        total,
        average,
        maximum,
        minimum,
        coherenceValues.length,
        now as f64
      );
    } else {
      result = new IGlobalCoherence(
        0,
        0,
        0,
        0,
        0,
        now as f64
      );
    }

    // Store in history (keep last 1000 entries)
    this.coherenceHistory.push(result);
    if (this.coherenceHistory.length > 1000) {
      this.coherenceHistory.shift();
    }

    return result;
  }

  getEntropyState(): IEntropyState {
    return this.entropyState;
  }

  updateEntropy(deltaTime: f64): void {
    const now = Date.now();
    this.entropyState.elapsedTime += deltaTime;
    
    // S(t) = S₀e^(-λt)
    this.entropyState.current = this.entropyState.initial * Math.exp(-this.entropyState.lambda * this.entropyState.elapsedTime);
    this.entropyState.lastUpdate = now as f64;

    // Update register if it exists
    this.registerState.setRegister('ENTROPY', this.entropyState.current, 5);
  }

  setEntropyParameters(S0: f64, lambda: f64): void {
    this.entropyState.initial = S0;
    this.entropyState.lambda = lambda;
    this.entropyState.current = S0;
    this.entropyState.elapsedTime = 0.0;
    this.entropyState.lastUpdate = Date.now() as f64;
  }

  isCoherenceThresholdMet(threshold: f64): bool {
    const globalCoherence = this.calculateGlobalCoherence();
    return globalCoherence.average >= threshold;
  }

  getCoherenceHistory(): Array<IGlobalCoherence> {
    return this.coherenceHistory;
  }

  reset(): void {
    this.entropyState = new IEntropyState(
      1.0,
      1.0,
      0.1,
      0.0,
      Date.now() as f64
    );
    this.coherenceHistory = [];
    this.coherenceCache.clear();
  }

  getSystemStats(): any {
    const activePrimes = this.primeEngine.getActivePrimes();
    const globalCoherence = this.calculateGlobalCoherence();
    const entropy = this.getEntropyState();

    // AssemblyScript does not support dynamic objects in the same way as JS.
    // We will return a string representation for now.
    return `activePrimes: ${activePrimes.length}, globalCoherence: ${globalCoherence.average}, currentEntropy: ${entropy.current}`;
  }

  getEntropy(): f64 {
    return this.entropyState.current;
  }

  evolveEntropy(deltaTime: f64): void {
    this.updateEntropy(deltaTime);
  }

  tick(): void {
    // Advance time by a small increment (10ms)
    this.updateEntropy(0.01);
  }

  getCurrentTime(): f64 {
    return this.entropyState.elapsedTime;
  }

  getGlobalCoherence(): f64 {
    return this.calculateGlobalCoherence().average;
  }

  clone(primeEngine: IPrimeStateEngine, registerState: IRegisterState): IGlobalState {
    const cloned = new GlobalState(primeEngine, registerState);
    cloned.entropyState = this.entropyState;
    cloned.coherenceHistory = this.coherenceHistory;
    cloned.coherenceCache = this.coherenceCache;
    return cloned;
  }
}