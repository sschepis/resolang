/**
 * Memory Pipeline
 * 
 * Pipeline for episodic memory and temporal reasoning.
 * Uses Temporal Layer, Memory Store, and Phase Lock Ring.
 */

import { TemporalLayer, MemoryStore, Moment, MemoryTrace, StateSnapshot, createSnapshot } from '../state';
import { PhaseLockedRing } from '../resonance';
import { generatePrimes } from '../core/math';
import { BasePipeline, IMemoryCapable } from './base';
import { PipelineConfig, PipelineEventType, MemoryResult } from './types';
import { JSONBuilder } from '../core/serialization';

/**
 * MemoryPipeline - For episodic memory and temporal reasoning
 * 
 * Components:
 * - TemporalLayer for short-term moment tracking with decay
 * - MemoryStore for long-term memory with associative recall
 * - PhaseLockedRing for stable phase relationships
 */
export class MemoryPipeline extends BasePipeline implements IMemoryCapable {
  private temporal: TemporalLayer = new TemporalLayer(100, 0.01);
  private memory: MemoryStore = new MemoryStore(1000, 0.001);
  private phaseRing: PhaseLockedRing;
  private primes: Array<u32> = new Array<u32>();
  
  constructor(config: PipelineConfig | null = null) {
    super(config);
    // Re-initialize with actual config values
    this.temporal = new TemporalLayer(this.config.historyLength, this.config.memoryDecayRate);
    this.memory = new MemoryStore(this.config.historyLength * 10, this.config.entropyDecayRate);
    this.primes = generatePrimes(this.config.numPrimes);
    this.phaseRing = new PhaseLockedRing(this.primes, "phi");
  }
  
  getName(): string {
    return "MemoryPipeline";
  }
  
  protected onInitialize(): void {
    this.primes = generatePrimes(this.config.numPrimes);
    this.temporal = new TemporalLayer(this.config.historyLength, this.config.memoryDecayRate);
    this.memory = new MemoryStore(this.config.historyLength * 10, this.config.entropyDecayRate);
    this.phaseRing = new PhaseLockedRing(this.primes, "phi");
  }
  
  protected onStart(): void {
    // Nothing special needed
  }
  
  protected onStop(): void {
    // Nothing special needed
  }
  
  protected onTick(dt: f64, timestamp: i64): void {
    // Advance phase ring
    this.phaseRing.tick(dt);
    
    // Apply temporal decay
    this.temporal.tick(dt);
    this.memory.tick(timestamp);
    
    // Check for phase lock events
    const sync = this.phaseRing.synchronization();
    if (sync > 0.9) {
      this.emitEvent(PipelineEventType.PHASE_LOCK, `{"synchronization":${sync},"meanPhase":${this.phaseRing.meanPhase()}}`);
    }
  }
  
  protected onReset(): void {
    this.onInitialize();
  }
  
  protected collectState(): void {
    this.state.memoryState = `{"momentCount":${this.temporal.moments.length},"traceCount":${this.memory.size()},"synchronization":${this.phaseRing.synchronization()}}`;
  }
  
  // IMemoryCapable implementation
  
  /**
   * Store content as a memory trace
   * @param content - Float64Array representing the state to store
   * @param significance - How significant this memory is (0-1)
   * @returns Trace ID
   */
  store(content: Float64Array, significance: f64): i32 {
    // Create snapshot from content
    const snapshot = this.createSnapshotFromContent(content, significance);
    
    // Record as moment
    const moment = this.temporal.record(snapshot, significance, "stored");
    
    // If significant, store in long-term memory
    if (significance > 0.5) {
      const trace = this.memory.store(snapshot, significance, this.state.timestamp);
      this.emitEvent(PipelineEventType.MEMORY_STORE, `{"traceId":${trace.id},"significance":${significance}}`);
      return trace.id;
    }
    
    return moment.id;
  }
  
  /**
   * Recall memories similar to query
   * @param query - Float64Array representing the query state
   * @param maxResults - Maximum number of results
   * @returns Array of trace IDs
   */
  recall(query: Float64Array, maxResults: i32): Array<i32> {
    const snapshot = this.createSnapshotFromContent(query, 1.0);
    const traces = this.memory.recall(snapshot, maxResults);
    
    const result = new Array<i32>();
    for (let i = 0; i < traces.length; i++) {
      result.push(traces[i].id);
    }
    
    this.emitEvent(PipelineEventType.MEMORY_RECALL, `{"querySize":${query.length},"resultsCount":${result.length}}`);
    
    return result;
  }
  
  /**
   * Spread activation from a memory trace
   * @param traceId - Starting trace ID
   * @param depth - How many association hops
   * @returns Array of activated trace IDs
   */
  spreadActivation(traceId: i32, depth: i32): Array<i32> {
    const traces = this.memory.spreadActivation(traceId, depth, 0.5);
    
    const result = new Array<i32>();
    for (let i = 0; i < traces.length; i++) {
      result.push(traces[i].id);
    }
    
    return result;
  }
  
  /**
   * Get number of moments in temporal layer
   */
  getMomentCount(): i32 {
    return this.temporal.moments.length;
  }
  
  // Additional memory methods
  
  /**
   * Get trace count in long-term memory
   */
  getTraceCount(): i32 {
    return this.memory.size();
  }
  
  /**
   * Get phase ring synchronization
   */
  getSynchronization(): f64 {
    return this.phaseRing.synchronization();
  }
  
  /**
   * Get mean phase
   */
  getMeanPhase(): f64 {
    return this.phaseRing.meanPhase();
  }
  
  /**
   * Get order parameter (Kuramoto)
   */
  getOrderParameter(): f64 {
    return this.phaseRing.orderParameter();
  }
  
  /**
   * Find similar moments
   */
  findSimilarMoments(query: Float64Array, maxResults: i32 = 10): Array<Moment> {
    const snapshot = this.createSnapshotFromContent(query, 1.0);
    return this.temporal.findSimilar(snapshot, maxResults, 1.0);
  }
  
  /**
   * Get recent moments
   */
  getRecentMoments(count: i32): Array<Moment> {
    return this.temporal.getRecent(count);
  }
  
  /**
   * Get most significant moments
   */
  getMostSignificantMoments(count: i32): Array<Moment> {
    return this.temporal.getMostSignificant(count);
  }
  
  /**
   * Apply phase correction
   */
  correctPhase(targetPhase: f64, strength: f64 = 0.1): void {
    this.phaseRing.correctPhase(targetPhase, strength);
  }
  
  /**
   * Get memory result
   */
  getMemoryResult(traceId: i32): MemoryResult {
    const result = new MemoryResult();
    result.traceId = traceId;
    
    // Get associations via spread activation
    const activated = this.spreadActivation(traceId, 1);
    for (let i = 0; i < activated.length; i++) {
      if (activated[i] != traceId) {
        result.associations.push(activated[i]);
      }
    }
    
    result.recalled = true;
    return result;
  }
  
  /**
   * Create snapshot from content array
   */
  private createSnapshotFromContent(content: Float64Array, significance: f64): StateSnapshot {
    const phases = new Float64Array(this.config.numPrimes);
    const amplitudes = new Float64Array(this.config.numPrimes);
    const smfState = new Float64Array(16);
    
    // Use content as phases/amplitudes
    const n = Math.min(content.length, this.config.numPrimes) as i32;
    for (let i = 0; i < n; i++) {
      phases[i] = content[i];
      amplitudes[i] = significance / f64(n);
    }
    
    // Fill SMF state
    const m = Math.min(content.length, 16) as i32;
    for (let i = 0; i < m; i++) {
      smfState[i] = content[i];
    }
    
    return new StateSnapshot(
      this.state.timestamp,
      significance,  // coherence
      1.0 - significance,  // entropy (inverse)
      0.0,  // lyapunov
      phases,
      amplitudes,
      smfState,
      0.0  // collapse probability
    );
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("name", this.getName())
      .addBooleanField("running", this.running)
      .addNumberField("momentCount", f64(this.getMomentCount()))
      .addNumberField("traceCount", f64(this.getTraceCount()))
      .addNumberField("synchronization", this.getSynchronization())
      .addNumberField("orderParameter", this.getOrderParameter())
      .endObject();
    return builder.build();
  }
}

// Factory function
export function createMemoryPipeline(config: PipelineConfig | null = null): MemoryPipeline {
  const pipeline = new MemoryPipeline(config);
  pipeline.initialize();
  return pipeline;
}
