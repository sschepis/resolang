/**
 * Pipeline Types and Interfaces
 * 
 * Core type definitions for the modular pipeline system.
 */

import { Serializable } from '../core/interfaces';

// ============================================================================
// Event System
// ============================================================================

/** Event types that pipelines can emit */
export enum PipelineEventType {
  TICK = 0,
  COLLAPSE = 1,
  ENTANGLEMENT = 2,
  RESONANCE = 3,
  MEMORY_STORE = 4,
  MEMORY_RECALL = 5,
  COHERENCE_CHANGE = 6,
  ENTROPY_CHANGE = 7,
  PHASE_LOCK = 8,
  STATE_CHANGE = 9
}

/** Pipeline event data */
export class PipelineEvent {
  eventType: PipelineEventType;
  timestamp: i64;
  data: string; // JSON-encoded event data
  
  constructor(eventType: PipelineEventType, timestamp: i64, data: string = "{}") {
    this.eventType = eventType;
    this.timestamp = timestamp;
    this.data = data;
  }
}

/** Event listener signature */
export type EventListener = (event: PipelineEvent) => void;

/** Event emitter for pipelines */
export class EventEmitter {
  private listeners: Map<i32, Array<EventListener>> = new Map<i32, Array<EventListener>>();
  private eventQueue: Array<PipelineEvent> = new Array<PipelineEvent>();
  private maxQueueSize: i32 = 100;
  
  /** Subscribe to an event type */
  on(eventType: PipelineEventType, listener: EventListener): void {
    const key = i32(eventType);
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Array<EventListener>());
    }
    this.listeners.get(key).push(listener);
  }
  
  /** Unsubscribe from an event type */
  off(eventType: PipelineEventType, listener: EventListener): void {
    const key = i32(eventType);
    if (this.listeners.has(key)) {
      const listeners = this.listeners.get(key);
      const idx = listeners.indexOf(listener);
      if (idx >= 0) {
        listeners.splice(idx, 1);
      }
    }
  }
  
  /** Emit an event to all listeners */
  emit(event: PipelineEvent): void {
    const key = i32(event.eventType);
    if (this.listeners.has(key)) {
      const listeners = this.listeners.get(key);
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event);
      }
    }
    
    // Queue event for history
    this.eventQueue.push(event);
    if (this.eventQueue.length > this.maxQueueSize) {
      this.eventQueue.shift();
    }
  }
  
  /** Get recent events */
  getRecentEvents(count: i32): Array<PipelineEvent> {
    const start = Math.max(0, this.eventQueue.length - count) as i32;
    const result = new Array<PipelineEvent>();
    for (let i = start; i < this.eventQueue.length; i++) {
      result.push(this.eventQueue[i]);
    }
    return result;
  }
  
  /** Clear all listeners */
  clear(): void {
    this.listeners.clear();
    this.eventQueue = new Array<PipelineEvent>();
  }
}

// ============================================================================
// Pipeline Configuration
// ============================================================================

/** Base configuration for all pipelines */
export class PipelineConfig {
  // Core settings
  numPrimes: i32 = 64;
  historyLength: i32 = 100;
  
  // Timing
  defaultDt: f64 = 0.016; // ~60fps
  
  // Thresholds
  collapseThreshold: f64 = 0.8;
  coherenceThreshold: f64 = 0.5;
  entanglementThreshold: f64 = 0.3;
  
  // Decay rates
  memoryDecayRate: f64 = 0.01;
  entropyDecayRate: f64 = 0.001;
  amplitudeDecayRate: f64 = 0.997;
  
  // Coupling
  kuramotoCoupling: f64 = 0.1;
  resonanceStrength: f64 = 0.1;
  
  static default(): PipelineConfig {
    return new PipelineConfig();
  }
  
  static fast(): PipelineConfig {
    const config = new PipelineConfig();
    config.numPrimes = 32;
    config.historyLength = 50;
    config.memoryDecayRate = 0.02;
    return config;
  }
  
  static precise(): PipelineConfig {
    const config = new PipelineConfig();
    config.numPrimes = 128;
    config.historyLength = 500;
    config.memoryDecayRate = 0.005;
    return config;
  }
}

// ============================================================================
// Pipeline State
// ============================================================================

/** Snapshot of pipeline state */
export class PipelineState implements Serializable {
  timestamp: i64 = 0;
  tickCount: i64 = 0;
  coherence: f64 = 1.0;
  entropy: f64 = 0.0;
  collapseProbability: f64 = 0.0;
  isRunning: bool = false;
  collapseCount: i32 = 0;
  
  // Component states (JSON-encoded)
  smfState: string = "{}";
  oscillatorState: string = "{}";
  memoryState: string = "{}";
  
  toJSON(): string {
    return `{"timestamp":${this.timestamp},"tickCount":${this.tickCount},"coherence":${this.coherence},"entropy":${this.entropy},"collapseProbability":${this.collapseProbability},"isRunning":${this.isRunning},"collapseCount":${this.collapseCount}}`;
  }
  
  toString(): string {
    return this.toJSON();
  }
}

// ============================================================================
// Pipeline Interface
// ============================================================================

/** Base interface for all pipelines */
export interface IPipeline extends Serializable {
  /** Get pipeline name */
  getName(): string;
  
  /** Get pipeline configuration */
  getConfig(): PipelineConfig;
  
  /** Initialize the pipeline */
  initialize(): void;
  
  /** Start the pipeline */
  start(timestamp: i64): void;
  
  /** Stop the pipeline */
  stop(): void;
  
  /** Process one tick */
  tick(dt: f64, timestamp: i64): void;
  
  /** Reset the pipeline */
  reset(): void;
  
  /** Get current state */
  getState(): PipelineState;
  
  /** Get the event emitter */
  getEvents(): EventEmitter;
  
  /** Check if pipeline is running */
  isRunning(): bool;
}

// ============================================================================
// Pipeline Result Types
// ============================================================================

/** Result of semantic encoding */
export class SemanticResult {
  axes: Float64Array;
  entropy: f64;
  dominantAxis: i32;
  coherence: f64;
  
  constructor(axes: Float64Array, entropy: f64, dominantAxis: i32, coherence: f64) {
    this.axes = axes;
    this.entropy = entropy;
    this.dominantAxis = dominantAxis;
    this.coherence = coherence;
  }
}

/** Result of cognitive processing */
export class CognitiveResult {
  phases: Float64Array;
  amplitudes: Float64Array;
  entanglementPairs: Array<Int32Array>;
  holographicRecall: Float64Array;
  
  constructor() {
    this.phases = new Float64Array(0);
    this.amplitudes = new Float64Array(0);
    this.entanglementPairs = new Array<Int32Array>();
    this.holographicRecall = new Float64Array(0);
  }
}

/** Result of memory operation */
export class MemoryResult {
  stored: bool;
  recalled: bool;
  traceId: i32;
  strength: f64;
  associations: Array<i32>;
  
  constructor() {
    this.stored = false;
    this.recalled = false;
    this.traceId = -1;
    this.strength = 0.0;
    this.associations = new Array<i32>();
  }
}

/** Result of embedding generation */
export class EmbeddingResult {
  vector: Float64Array;
  primeSignature: Array<i32>;
  quaternionComponents: Float64Array;
  dimension: i32;
  
  constructor(dimension: i32) {
    this.vector = new Float64Array(dimension);
    this.primeSignature = new Array<i32>();
    this.quaternionComponents = new Float64Array(4);
    this.dimension = dimension;
  }
}

// ============================================================================
// Helper Types
// ============================================================================

/** Input types for pipelines */
export class PipelineInput {
  text: string = "";
  values: Float64Array = new Float64Array(0);
  primes: Array<i32> = new Array<i32>();
  timestamp: i64 = 0;
  
  static fromText(text: string): PipelineInput {
    const input = new PipelineInput();
    input.text = text;
    return input;
  }
  
  static fromValues(values: Float64Array): PipelineInput {
    const input = new PipelineInput();
    input.values = values;
    return input;
  }
  
  static fromPrimes(primes: Array<i32>): PipelineInput {
    const input = new PipelineInput();
    input.primes = primes;
    return input;
  }
}