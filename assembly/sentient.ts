/**
 * Sentient Observer Extensions
 * 
 * Extends ResoLang with:
 * - HolographicField: Distributed memory encoding
 * - EntanglementDetector: Mutual information detection
 * - EntropyCollapse: Entropy-driven state collapse
 * - SentientCore: Main integration class
 * 
 * Ported from tinyaleph/apps/sentient
 */

import { Sedenion } from './sedenion';
import { PhaseLockedRing, ResonantFragment } from './resonance';
import { SedenionMemoryField, SEMANTIC_AXES } from './smf';
import { StateSnapshot, Moment, TemporalLayer, MemoryStore, createSnapshot } from './state';
import { PrimeOscillator, PhysicsState, updatePhysics, addOscillator, clearOscillators, oscillators } from './physics';
import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';
import { PI } from './core/math';

// Constants
const TWO_PI: f64 = 2.0 * PI;
const PHI: f64 = (1.0 + Math.sqrt(5.0)) / 2.0;

/**
 * HolographicField - Distributed memory encoding using Sedenion rotations
 * 
 * Encodes memories as interference patterns in 16D space
 */
export class HolographicField implements Serializable {
  size: i32;
  field: Array<Sedenion>;
  patternCount: i32;
  encodingStrength: f64;

  constructor(size: i32 = 256) {
    this.size = size;
    this.field = new Array<Sedenion>(size);
    this.patternCount = 0;
    this.encodingStrength = 0.1;

    // Initialize with zero sedenions
    for (let i: i32 = 0; i < size; i++) {
      this.field[i] = Sedenion.zero();
    }
  }

  /**
   * Encode a pattern into the field using distributed representation
   */
  encode(pattern: Sedenion, address: Float64Array): void {
    // Use address phases to distribute across field
    const addressLen = Math.min(address.length, this.size) as i32;

    for (let i: i32 = 0; i < addressLen; i++) {
      const phase = address[i];
      const idx = i32(Math.abs(phase) * f64(this.size)) % this.size;

      // Rotate pattern by phase and add to field
      const rotated = this.rotate(pattern, phase);
      this.field[idx] = this.field[idx].add(rotated.scale(this.encodingStrength));
    }

    this.patternCount++;
  }

  /**
   * Recall a pattern from the field using an address cue
   */
  recall(address: Float64Array): Sedenion {
    let result = Sedenion.zero();
    const addressLen = Math.min(address.length, this.size) as i32;

    for (let i: i32 = 0; i < addressLen; i++) {
      const phase = address[i];
      const idx = i32(Math.abs(phase) * f64(this.size)) % this.size;

      // Unrotate and accumulate
      const unrotated = this.rotate(this.field[idx], -phase);
      result = result.add(unrotated);
    }

    // Normalize
    const norm = result.norm();
    if (norm > 1e-10) {
      result = result.scale(1.0 / norm);
    }

    return result;
  }

  /**
   * Rotate a sedenion by a phase angle
   * Uses e^(angle * e1) rotation in the 1-0 plane
   */
  private rotate(s: Sedenion, angle: f64): Sedenion {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Simple rotation in 0-1 plane
    const c0 = s.c0 * cos - s.c1 * sin;
    const c1 = s.c0 * sin + s.c1 * cos;

    return new Sedenion(
      c0, c1, s.c2, s.c3,
      s.c4, s.c5, s.c6, s.c7,
      s.c8, s.c9, s.c10, s.c11,
      s.c12, s.c13, s.c14, s.c15
    );
  }

  /**
   * Calculate field entropy
   */
  entropy(): f64 {
    let total: f64 = 0.0;
    for (let i: i32 = 0; i < this.size; i++) {
      total += this.field[i].normSquared();
    }
    if (total < 1e-10) return 0.0;

    let h: f64 = 0.0;
    for (let i: i32 = 0; i < this.size; i++) {
      const p = this.field[i].normSquared() / total;
      if (p > 1e-10) {
        h -= p * Math.log(p);
      }
    }
    return h;
  }

  /**
   * Clear the field
   */
  clear(): void {
    for (let i: i32 = 0; i < this.size; i++) {
      this.field[i] = Sedenion.zero();
    }
    this.patternCount = 0;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("size", f64(this.size))
      .addNumberField("patternCount", f64(this.patternCount))
      .addNumberField("entropy", this.entropy())
      .endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * EntanglementDetector - Detects mutual information between oscillator pairs
 */
export class EntanglementDetector implements Serializable {
  historyLength: i32;
  phaseHistory: Array<Float64Array>;
  historyIndex: i32;
  entanglementMatrix: Float64Array;
  numOscillators: i32;

  constructor(numOscillators: i32, historyLength: i32 = 100) {
    this.numOscillators = numOscillators;
    this.historyLength = historyLength;
    this.historyIndex = 0;

    // Initialize entanglement matrix FIRST (before any this references in loops)
    const matrixSize = (numOscillators * (numOscillators - 1)) / 2;
    this.entanglementMatrix = new Float64Array(matrixSize);

    // Initialize history
    this.phaseHistory = new Array<Float64Array>(historyLength);
    for (let i: i32 = 0; i < historyLength; i++) {
      this.phaseHistory[i] = new Float64Array(numOscillators);
    }
  }

  /**
   * Record current phases
   */
  recordPhases(phases: Float64Array): void {
    const n = Math.min(phases.length, this.numOscillators) as i32;
    for (let i: i32 = 0; i < n; i++) {
      this.phaseHistory[this.historyIndex][i] = phases[i];
    }
    this.historyIndex = (this.historyIndex + 1) % this.historyLength;
  }

  /**
   * Compute mutual information between oscillator pair
   * Uses phase correlation as a proxy for mutual information
   */
  computeMutualInfo(i: i32, j: i32): f64 {
    if (i == j || i >= this.numOscillators || j >= this.numOscillators) return 0.0;

    // Calculate phase correlation over history
    let sumCos: f64 = 0.0;
    let sumSin: f64 = 0.0;

    for (let t: i32 = 0; t < this.historyLength; t++) {
      const phaseDiff = this.phaseHistory[t][i] - this.phaseHistory[t][j];
      sumCos += Math.cos(phaseDiff);
      sumSin += Math.sin(phaseDiff);
    }

    // Order parameter for this pair
    const r = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / f64(this.historyLength);

    // Mutual information approximation: I(X;Y) ≈ -log(1 - r²)
    // Clamped to avoid infinity
    const r2 = Math.min(0.999, r * r);
    return -Math.log(1.0 - r2) / 2.0;
  }

  /**
   * Update entanglement matrix for all pairs
   */
  updateEntanglement(): void {
    let idx: i32 = 0;
    for (let i: i32 = 0; i < this.numOscillators; i++) {
      for (let j: i32 = i + 1; j < this.numOscillators; j++) {
        this.entanglementMatrix[idx] = this.computeMutualInfo(i, j);
        idx++;
      }
    }
  }

  /**
   * Get entanglement between specific pair
   */
  getEntanglement(i: i32, j: i32): f64 {
    if (i == j) return 0.0;
    if (i > j) {
      const tmp = i;
      i = j;
      j = tmp;
    }

    // Calculate index in upper triangular matrix
    const idx = i * this.numOscillators - (i * (i + 1)) / 2 + (j - i - 1);
    return this.entanglementMatrix[idx];
  }

  /**
   * Get total system entanglement
   */
  getTotalEntanglement(): f64 {
    let total: f64 = 0.0;
    for (let i: i32 = 0; i < i32(this.entanglementMatrix.length); i++) {
      total += this.entanglementMatrix[i];
    }
    return total;
  }

  /**
   * Get most entangled pair
   */
  getMostEntangledPair(): Int32Array {
    let maxVal: f64 = 0.0;
    let maxI: i32 = 0;
    let maxJ: i32 = 0;

    let idx: i32 = 0;
    for (let i: i32 = 0; i < this.numOscillators; i++) {
      for (let j: i32 = i + 1; j < this.numOscillators; j++) {
        if (this.entanglementMatrix[idx] > maxVal) {
          maxVal = this.entanglementMatrix[idx];
          maxI = i;
          maxJ = j;
        }
        idx++;
      }
    }

    const result = new Int32Array(2);
    result[0] = maxI;
    result[1] = maxJ;
    return result;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("numOscillators", f64(this.numOscillators))
      .addNumberField("historyLength", f64(this.historyLength))
      .addNumberField("totalEntanglement", this.getTotalEntanglement());

    const pair = this.getMostEntangledPair();
    builder.addRawField("mostEntangled", `{"i":${pair[0]},"j":${pair[1]}}`);

    builder.endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * EntropyCollapse - Manages entropy-driven state collapse
 */
export class EntropyCollapse implements Serializable {
  entropyThreshold: f64;
  accumulatedEntropy: f64;
  collapseCount: i32;
  lastCollapseTime: i64;
  cooldownPeriod: f64;

  constructor(threshold: f64 = 0.8) {
    this.entropyThreshold = threshold;
    this.accumulatedEntropy = 0.0;
    this.collapseCount = 0;
    this.lastCollapseTime = 0;
    this.cooldownPeriod = 1.0; // seconds
  }

  /**
   * Accumulate entropy over time
   */
  accumulate(entropy: f64, dt: f64): void {
    this.accumulatedEntropy += entropy * dt;
  }

  /**
   * Calculate collapse probability
   * P = 1 - e^(-∫S(t)dt)
   */
  getCollapseProbability(): f64 {
    return 1.0 - Math.exp(-this.accumulatedEntropy);
  }

  /**
   * Check if collapse should occur
   */
  shouldCollapse(currentTime: i64): bool {
    const timeSinceLast = f64(currentTime - this.lastCollapseTime) / 1000.0;
    if (timeSinceLast < this.cooldownPeriod) return false;

    return this.getCollapseProbability() > this.entropyThreshold;
  }

  /**
   * Perform collapse (reset accumulator)
   */
  collapse(currentTime: i64): void {
    this.accumulatedEntropy = 0.0;
    this.collapseCount++;
    this.lastCollapseTime = currentTime;
  }

  /**
   * Reset state
   */
  reset(): void {
    this.accumulatedEntropy = 0.0;
    this.collapseCount = 0;
    this.lastCollapseTime = 0;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("accumulatedEntropy", this.accumulatedEntropy)
      .addNumberField("collapseProbability", this.getCollapseProbability())
      .addNumberField("collapseCount", f64(this.collapseCount))
      .addNumberField("threshold", this.entropyThreshold)
      .endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * SentientCore - Main integration class for the Sentient Observer
 * 
 * Combines:
 * - Prime oscillator network (PRSC Layer)
 * - Sedenion Memory Field (SMF)
 * - Holographic memory
 * - Entanglement detection
 * - Entropy-driven collapse
 * - Temporal memory
 */
export class SentientCore implements Serializable {
  // Core components
  smf: SedenionMemoryField;
  holographic: HolographicField;
  entanglement: EntanglementDetector;
  collapse: EntropyCollapse;
  temporal: TemporalLayer;
  memory: MemoryStore;

  // State
  numPrimes: i32;
  running: bool;
  startTime: i64;
  lastTickTime: i64;
  tickCount: i64;

  constructor(numPrimes: i32 = 64) {
    this.numPrimes = numPrimes;

    // Initialize components
    this.smf = new SedenionMemoryField(100);
    this.holographic = new HolographicField(256);
    this.entanglement = new EntanglementDetector(numPrimes, 50);
    this.collapse = new EntropyCollapse(0.8);
    this.temporal = new TemporalLayer(1000, 0.01);
    this.memory = new MemoryStore(10000, 0.001);

    this.running = false;
    this.startTime = 0;
    this.lastTickTime = 0;
    this.tickCount = 0;

    // Initialize oscillators
    this.initializeOscillators();
  }

  /**
   * Initialize prime oscillators
   */
  private initializeOscillators(): void {
    clearOscillators();

    // First N primes
    const primes = this.generatePrimes(this.numPrimes);
    for (let i: i32 = 0; i < primes.length; i++) {
      addOscillator(primes[i], 1.0 / f64(primes.length), 0.0);
    }
  }

  /**
   * Generate first N primes
   */
  private generatePrimes(count: i32): Array<i32> {
    const primes = new Array<i32>();
    let candidate: i32 = 2;

    while (primes.length < count) {
      if (this.isPrime(candidate)) {
        primes.push(candidate);
      }
      candidate++;
    }

    return primes;
  }

  private isPrime(n: i32): bool {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    const limit = i32(Math.sqrt(f64(n))) + 1;
    for (let i: i32 = 3; i <= limit; i += 2) {
      if (n % i == 0) return false;
    }
    return true;
  }

  /**
   * Start the sentient core
   */
  start(timestamp: i64): void {
    this.running = true;
    this.startTime = timestamp;
    this.lastTickTime = timestamp;
  }

  /**
   * Stop the sentient core
   */
  stop(): void {
    this.running = false;
  }

  /**
   * Main tick function - advances all systems
   */
  tick(dt: f64, timestamp: i64): i32 {
    if (!this.running) return -1;

    // 1. Update physics (oscillators)
    const physics = updatePhysics();

    // 2. Extract oscillator phases
    const phases = new Float64Array(oscillators.length);
    const amplitudes = new Float64Array(oscillators.length);
    for (let i: i32 = 0; i < oscillators.length; i++) {
      phases[i] = oscillators[i].phase;
      amplitudes[i] = oscillators[i].amplitude;
    }

    // 3. Update entanglement detection
    this.entanglement.recordPhases(phases);
    this.entanglement.updateEntanglement();

    // 4. Apply resonance to SMF
    this.smf.applyResonance(phases, amplitudes);
    this.smf.evolve(dt, timestamp);

    // 5. Accumulate entropy
    this.collapse.accumulate(physics.entropy, dt);

    // 6. Check for collapse
    if (this.collapse.shouldCollapse(timestamp)) {
      this.performCollapse(timestamp);
    }

    // 7. Record moment if significant
    const significance = this.calculateSignificance(physics);
    let momentId: i32 = -1;

    if (significance > 0.5) {
      const snapshot = this.createSnapshot(timestamp, physics, phases, amplitudes);
      const moment = this.temporal.record(snapshot, significance, "tick");
      momentId = moment.id;

      // Store in long-term memory if very significant
      if (significance > 0.8) {
        this.memory.store(snapshot, significance, timestamp);
      }
    }

    // 8. Apply temporal decay
    this.temporal.tick(dt);
    this.memory.tick(timestamp);

    this.lastTickTime = timestamp;
    this.tickCount++;

    return momentId;
  }

  /**
   * Perform state collapse
   */
  private performCollapse(timestamp: i64): void {
    // Record pre-collapse state
    const phases = new Float64Array(oscillators.length);
    const amplitudes = new Float64Array(oscillators.length);
    for (let i: i32 = 0; i < oscillators.length; i++) {
      phases[i] = oscillators[i].phase;
      amplitudes[i] = oscillators[i].amplitude;
    }

    const physics = updatePhysics();
    const snapshot = this.createSnapshot(timestamp, physics, phases, amplitudes);

    // Collapse SMF
    this.smf.collapse();

    // Encode collapsed state in holographic field
    const address = this.smf.getAllAxes();
    this.holographic.encode(this.smf.state, address);

    // Reset entropy accumulator
    this.collapse.collapse(timestamp);

    // Record collapse moment
    const moment = this.temporal.record(snapshot, 1.0, "collapse");
    moment.collapsed = true;
    this.memory.store(snapshot, 1.0, timestamp);
  }

  /**
   * Calculate significance of current state
   */
  private calculateSignificance(physics: PhysicsState): f64 {
    // High coherence = significant
    const coherenceScore = physics.coherence;

    // Low entropy = significant  
    const entropyScore = Math.exp(-physics.entropy);

    // Stability = significant
    const stabilityScore = physics.isStable ? 0.8 : 0.2;

    // Entanglement = significant
    const entanglementScore = Math.min(1.0, this.entanglement.getTotalEntanglement() / 10.0);

    return (coherenceScore * 0.3 + entropyScore * 0.2 + stabilityScore * 0.3 + entanglementScore * 0.2);
  }

  /**
   * Create a state snapshot
   */
  private createSnapshot(
    timestamp: i64,
    physics: PhysicsState,
    phases: Float64Array,
    amplitudes: Float64Array
  ): StateSnapshot {
    const smfState = this.smf.getAllAxes();

    return new StateSnapshot(
      timestamp,
      physics.coherence,
      physics.entropy,
      physics.lyapunovExponent,
      phases,
      amplitudes,
      smfState,
      this.collapse.getCollapseProbability()
    );
  }

  /**
   * Excite an oscillator
   */
  exciteOscillator(index: i32, amplitude: f64): void {
    if (index >= 0 && index < oscillators.length) {
      oscillators[index].amplitude += amplitude;
    }
  }

  /**
   * Get current coherence
   */
  getCoherence(): f64 {
    return this.smf.getCoherence();
  }

  /**
   * Get current entropy
   */
  getEntropy(): f64 {
    return this.smf.getEntropy();
  }

  /**
   * Get SMF axis value
   */
  getSMFAxis(index: i32): f64 {
    return this.smf.getAxis(index);
  }

  /**
   * Get phase of oscillator
   */
  getPhase(index: i32): f64 {
    if (index >= 0 && index < oscillators.length) {
      return oscillators[index].phase;
    }
    return 0.0;
  }

  /**
   * Get amplitude of oscillator
   */
  getAmplitude(index: i32): f64 {
    if (index >= 0 && index < oscillators.length) {
      return oscillators[index].amplitude;
    }
    return 0.0;
  }

  /**
   * Reset the core
   */
  reset(): void {
    this.smf.reset();
    this.holographic.clear();
    this.collapse.reset();
    this.initializeOscillators();
    this.tickCount = 0;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("numPrimes", f64(this.numPrimes))
      .addBooleanField("running", this.running)
      .addNumberField("tickCount", f64(this.tickCount))
      .addNumberField("coherence", this.getCoherence())
      .addNumberField("entropy", this.getEntropy())
      .addRawField("collapse", this.collapse.toJSON())
      .addRawField("entanglement", this.entanglement.toJSON())
      .addRawField("holographic", this.holographic.toJSON())
      .addNumberField("momentCount", f64(this.temporal.moments.length))
      .addNumberField("memorySize", f64(this.memory.size()))
      .endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

// ============================================================================
// Exported Functions for WASM interface
// ============================================================================

// Global sentient core instance
let _core: SentientCore = new SentientCore(64);

export function createSentientCore(numPrimes: i32): void {
  _core = new SentientCore(numPrimes);
}

export function startSentientCore(timestamp: i64): void {
  _core.start(timestamp);
}

export function stopSentientCore(): void {
  _core.stop();
}

export function tickSentientCore(dt: f64, timestamp: i64): i32 {
  return _core.tick(dt, timestamp);
}

export function getSentientCoherence(): f64 {
  return _core.getCoherence();
}

export function getSentientEntropy(): f64 {
  return _core.getEntropy();
}

export function getSentientSMFAxis(index: i32): f64 {
  return _core.getSMFAxis(index);
}

export function getSentientPhase(index: i32): f64 {
  return _core.getPhase(index);
}

export function getSentientAmplitude(index: i32): f64 {
  return _core.getAmplitude(index);
}

export function exciteSentientOscillator(index: i32, amplitude: f64): void {
  _core.exciteOscillator(index, amplitude);
}

export function resetSentientCore(): void {
  _core.reset();
}

export function getSentientState(): string {
  return _core.toJSON();
}