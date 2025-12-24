/**
 * Base Pipeline Implementation
 * 
 * Abstract base class for all pipeline types.
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import {
  IPipeline,
  PipelineConfig,
  PipelineState,
  PipelineEvent,
  PipelineEventType,
  EventEmitter
} from './types';

/**
 * Abstract base class for pipelines
 */
export abstract class BasePipeline implements IPipeline {
  protected config: PipelineConfig;
  protected state: PipelineState;
  protected events: EventEmitter;
  protected running: bool = false;
  protected startTime: i64 = 0;
  
  constructor(config: PipelineConfig | null = null) {
    this.config = config !== null ? config : PipelineConfig.default();
    this.state = new PipelineState();
    this.events = new EventEmitter();
  }
  
  // Abstract methods to implement
  abstract getName(): string;
  protected abstract onInitialize(): void;
  protected abstract onStart(): void;
  protected abstract onStop(): void;
  protected abstract onTick(dt: f64, timestamp: i64): void;
  protected abstract onReset(): void;
  protected abstract collectState(): void;
  
  // IPipeline implementation
  getConfig(): PipelineConfig {
    return this.config;
  }
  
  initialize(): void {
    this.onInitialize();
  }
  
  start(timestamp: i64): void {
    if (this.running) return;
    
    this.running = true;
    this.startTime = timestamp;
    this.state.isRunning = true;
    this.state.timestamp = timestamp;
    
    this.onStart();
    
    this.emitEvent(PipelineEventType.STATE_CHANGE, `{"action":"start","timestamp":${timestamp}}`);
  }
  
  stop(): void {
    if (!this.running) return;
    
    this.running = false;
    this.state.isRunning = false;
    
    this.onStop();
    
    this.emitEvent(PipelineEventType.STATE_CHANGE, `{"action":"stop"}`);
  }
  
  tick(dt: f64, timestamp: i64): void {
    if (!this.running) return;
    
    this.state.timestamp = timestamp;
    this.state.tickCount++;
    
    this.onTick(dt, timestamp);
    this.collectState();
    
    this.emitEvent(PipelineEventType.TICK, `{"dt":${dt},"tick":${this.state.tickCount}}`);
  }
  
  reset(): void {
    this.stop();
    this.state = new PipelineState();
    this.onReset();
    this.emitEvent(PipelineEventType.STATE_CHANGE, `{"action":"reset"}`);
  }
  
  getState(): PipelineState {
    return this.state;
  }
  
  getEvents(): EventEmitter {
    return this.events;
  }
  
  isRunning(): bool {
    return this.running;
  }
  
  // Helper methods
  protected emitEvent(eventType: PipelineEventType, data: string = "{}"): void {
    const event = new PipelineEvent(eventType, this.state.timestamp, data);
    this.events.emit(event);
  }
  
  protected emitCollapse(data: string): void {
    this.state.collapseCount++;
    this.emitEvent(PipelineEventType.COLLAPSE, data);
  }
  
  protected emitEntanglement(data: string): void {
    this.emitEvent(PipelineEventType.ENTANGLEMENT, data);
  }
  
  protected emitResonance(data: string): void {
    this.emitEvent(PipelineEventType.RESONANCE, data);
  }
  
  protected emitCoherenceChange(oldValue: f64, newValue: f64): void {
    if (Math.abs(oldValue - newValue) > 0.01) {
      this.emitEvent(PipelineEventType.COHERENCE_CHANGE, `{"old":${oldValue},"new":${newValue}}`);
    }
  }
  
  protected emitEntropyChange(oldValue: f64, newValue: f64): void {
    if (Math.abs(oldValue - newValue) > 0.01) {
      this.emitEvent(PipelineEventType.ENTROPY_CHANGE, `{"old":${oldValue},"new":${newValue}}`);
    }
  }
  
  // Serializable implementation
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("name", this.getName())
      .addBooleanField("running", this.running)
      .addRawField("state", this.state.toJSON())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

/**
 * Mixin interface for pipelines with semantic capabilities
 */
export interface ISemanticCapable {
  encodeText(text: string): Float64Array;
  getSMFAxes(): Float64Array;
  getCoherence(): f64;
  getEntropy(): f64;
}

/**
 * Mixin interface for pipelines with cognitive capabilities
 */
export interface ICognitiveCapable {
  getPhases(): Float64Array;
  getAmplitudes(): Float64Array;
  exciteOscillator(index: i32, amplitude: f64): void;
  getEntanglementMatrix(): Float64Array;
}

/**
 * Mixin interface for pipelines with memory capabilities
 */
export interface IMemoryCapable {
  store(content: Float64Array, significance: f64): i32;
  recall(query: Float64Array, maxResults: i32): Array<i32>;
  spreadActivation(traceId: i32, depth: i32): Array<i32>;
  getMomentCount(): i32;
}

/**
 * Mixin interface for pipelines with embedding capabilities
 */
export interface IEmbeddingCapable {
  embed(input: string): Float64Array;
  embedValues(values: Float64Array): Float64Array;
  similarity(a: Float64Array, b: Float64Array): f64;
}