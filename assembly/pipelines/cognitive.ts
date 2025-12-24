/**
 * Cognitive Pipeline
 * 
 * Pipeline for pattern recognition and associative reasoning.
 * Uses PRSC oscillators, entanglement detection, and holographic field.
 */

import { PrimeOscillator, addOscillator, clearOscillators, oscillators, updatePhysics, PhysicsState } from '../physics';
import { HolographicField, EntanglementDetector } from '../sentient';
import { Sedenion } from '../sedenion';
import { BasePipeline, ICognitiveCapable } from './base';
import { PipelineConfig, PipelineEventType, CognitiveResult } from './types';
import { JSONBuilder } from '../core/serialization';
import { generatePrimes } from '../core/math';

/**
 * CognitivePipeline - For pattern recognition and associative reasoning
 * 
 * Components:
 * - PRSC Layer (Prime Resonance Semantic Computation) with Kuramoto coupling
 * - Entanglement Detector for mutual information
 * - Holographic Field for distributed memory
 */
export class CognitivePipeline extends BasePipeline implements ICognitiveCapable {
  private holographic: HolographicField = new HolographicField(256);
  private entanglement: EntanglementDetector = new EntanglementDetector(16, 100);
  private physicsState: PhysicsState | null = null;
  private primes: Array<u32> = new Array<u32>();
  
  constructor(config: PipelineConfig | null = null) {
    super(config);
    // Re-initialize with actual config values
    this.holographic = new HolographicField(256);
    this.entanglement = new EntanglementDetector(this.config.numPrimes, this.config.historyLength);
  }
  
  getName(): string {
    return "CognitivePipeline";
  }
  
  protected onInitialize(): void {
    // Generate primes
    this.primes = generatePrimes(this.config.numPrimes);
    
    // Initialize oscillators
    clearOscillators();
    const numPrimes = this.primes.length;
    for (let i = 0; i < numPrimes; i++) {
      addOscillator(this.primes[i] as i32, 1.0 / f64(numPrimes), 0.0);
    }
    
    // Initialize holographic field
    this.holographic = new HolographicField(256);
    
    // Initialize entanglement detector
    this.entanglement = new EntanglementDetector(numPrimes, this.config.historyLength);
  }
  
  protected onStart(): void {
    // Initial physics update
    this.physicsState = updatePhysics();
  }
  
  protected onStop(): void {
    // Nothing special needed
  }
  
  protected onTick(dt: f64, timestamp: i64): void {
    // Update physics (oscillators)
    this.physicsState = updatePhysics();
    
    // Collect phases for entanglement detection
    const phases = this.getPhases();
    this.entanglement.recordPhases(phases);
    this.entanglement.updateEntanglement();
    
    // Check for significant entanglement
    const totalEntanglement = this.entanglement.getTotalEntanglement();
    if (totalEntanglement > this.config.entanglementThreshold * f64(this.config.numPrimes)) {
      const pair = this.entanglement.getMostEntangledPair();
      this.emitEntanglement(`{"i":${pair[0]},"j":${pair[1]},"strength":${this.entanglement.getEntanglement(pair[0], pair[1])}}`);
    }
    
    // Check coherence for resonance events
    if (this.physicsState !== null && this.physicsState.coherence > this.config.coherenceThreshold) {
      this.emitResonance(`{"coherence":${this.physicsState.coherence},"isStable":${this.physicsState.isStable}}`);
    }
  }
  
  protected onReset(): void {
    this.onInitialize();
    this.physicsState = null;
  }
  
  protected collectState(): void {
    if (this.physicsState !== null) {
      this.state.coherence = this.physicsState.coherence;
      this.state.entropy = this.physicsState.entropy;
      this.state.oscillatorState = `{"lyapunov":${this.physicsState.lyapunovExponent},"isStable":${this.physicsState.isStable},"totalEnergy":${this.physicsState.totalEnergy}}`;
    }
  }
  
  // ICognitiveCapable implementation
  
  /**
   * Get all oscillator phases
   */
  getPhases(): Float64Array {
    const phases = new Float64Array(oscillators.length);
    for (let i = 0; i < oscillators.length; i++) {
      phases[i] = oscillators[i].phase;
    }
    return phases;
  }
  
  /**
   * Get all oscillator amplitudes
   */
  getAmplitudes(): Float64Array {
    const amplitudes = new Float64Array(oscillators.length);
    for (let i = 0; i < oscillators.length; i++) {
      amplitudes[i] = oscillators[i].amplitude;
    }
    return amplitudes;
  }
  
  /**
   * Excite a specific oscillator
   */
  exciteOscillator(index: i32, amplitude: f64): void {
    if (index >= 0 && index < oscillators.length) {
      oscillators[index].amplitude += amplitude;
    }
  }
  
  /**
   * Get the entanglement matrix
   */
  getEntanglementMatrix(): Float64Array {
    const n = this.config.numPrimes;
    const size = (n * (n - 1)) / 2;
    const matrix = new Float64Array(size);
    
    let idx = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        matrix[idx] = this.entanglement.getEntanglement(i, j);
        idx++;
      }
    }
    
    return matrix;
  }
  
  // Additional cognitive methods
  
  /**
   * Get current physics state
   */
  getPhysicsState(): PhysicsState | null {
    return this.physicsState;
  }
  
  /**
   * Get Lyapunov exponent (stability indicator)
   */
  getLyapunovExponent(): f64 {
    if (this.physicsState !== null) {
      return this.physicsState.lyapunovExponent;
    }
    return 0.0;
  }
  
  /**
   * Check if system is stable
   */
  isStable(): bool {
    if (this.physicsState !== null) {
      return this.physicsState.isStable;
    }
    return false;
  }
  
  /**
   * Get total entanglement
   */
  getTotalEntanglement(): f64 {
    return this.entanglement.getTotalEntanglement();
  }
  
  /**
   * Get most entangled oscillator pair
   */
  getMostEntangledPair(): Int32Array {
    return this.entanglement.getMostEntangledPair();
  }
  
  /**
   * Encode a pattern into holographic memory
   */
  encodeHolographic(pattern: Sedenion, address: Float64Array): void {
    this.holographic.encode(pattern, address);
  }
  
  /**
   * Recall from holographic memory
   */
  recallHolographic(address: Float64Array): Sedenion {
    return this.holographic.recall(address);
  }
  
  /**
   * Get holographic field entropy
   */
  getHolographicEntropy(): f64 {
    return this.holographic.entropy();
  }
  
  /**
   * Get cognitive result (all cognitive metrics)
   */
  getCognitiveResult(): CognitiveResult {
    const result = new CognitiveResult();
    result.phases = this.getPhases();
    result.amplitudes = this.getAmplitudes();
    
    // Get top entangled pairs
    const pair = this.getMostEntangledPair();
    result.entanglementPairs.push(pair);
    
    // Get holographic state
    result.holographicRecall = new Float64Array(16);
    
    return result;
  }
  
  /**
   * Get phase of specific oscillator
   */
  getPhase(index: i32): f64 {
    if (index >= 0 && index < oscillators.length) {
      return oscillators[index].phase;
    }
    return 0.0;
  }
  
  /**
   * Get amplitude of specific oscillator
   */
  getAmplitude(index: i32): f64 {
    if (index >= 0 && index < oscillators.length) {
      return oscillators[index].amplitude;
    }
    return 0.0;
  }
  
  /**
   * Get prime for oscillator at index
   */
  getPrime(index: i32): i32 {
    if (index >= 0 && index < oscillators.length) {
      return oscillators[index].prime;
    }
    return 0;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("name", this.getName())
      .addBooleanField("running", this.running)
      .addNumberField("numOscillators", f64(oscillators.length))
      .addNumberField("totalEntanglement", this.getTotalEntanglement())
      .addNumberField("holographicEntropy", this.getHolographicEntropy())
      .addBooleanField("isStable", this.isStable());
    
    if (this.physicsState !== null) {
      builder.addNumberField("coherence", this.physicsState.coherence)
        .addNumberField("lyapunov", this.physicsState.lyapunovExponent);
    }
    
    builder.endObject();
    return builder.build();
  }
}

// Factory function
export function createCognitivePipeline(config: PipelineConfig | null = null): CognitivePipeline {
  const pipeline = new CognitivePipeline(config);
  pipeline.initialize();
  return pipeline;
}
