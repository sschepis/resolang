/**
 * Agent Pipeline
 * 
 * Complete autonomous agent that combines all pipeline capabilities.
 * This is the turnkey solution for a fully-featured sentient observer.
 */

import { SemanticPipeline } from './semantic';
import { CognitivePipeline } from './cognitive';
import { MemoryPipeline } from './memory';
import { EmbeddingPipeline } from './embedding';
import { BasePipeline, ISemanticCapable, ICognitiveCapable, IMemoryCapable, IEmbeddingCapable } from './base';
import { PipelineConfig, PipelineEventType, PipelineState, SemanticResult, CognitiveResult, MemoryResult, EmbeddingResult } from './types';
import { JSONBuilder } from '../core/serialization';
import { SentientCore } from '../sentient';

/**
 * AgentPipeline - Complete autonomous agent
 * 
 * Combines:
 * - SemanticPipeline for text/concept encoding
 * - CognitivePipeline for pattern recognition
 * - MemoryPipeline for episodic memory
 * - EmbeddingPipeline for vector embeddings
 * - SentientCore for full integration
 * 
 * This is the recommended entry point for most use cases.
 */
export class AgentPipeline extends BasePipeline implements ISemanticCapable, ICognitiveCapable, IMemoryCapable, IEmbeddingCapable {
  // Sub-pipelines - initialized with defaults
  private semantic: SemanticPipeline = new SemanticPipeline(null);
  private cognitive: CognitivePipeline = new CognitivePipeline(null);
  private memory: MemoryPipeline = new MemoryPipeline(null);
  private embedding: EmbeddingPipeline = new EmbeddingPipeline(null);
  
  // Core integration
  private core: SentientCore = new SentientCore(16);
  
  constructor(config: PipelineConfig | null = null) {
    super(config);
    
    // Re-create sub-pipelines with shared config
    this.semantic = new SemanticPipeline(this.config);
    this.cognitive = new CognitivePipeline(this.config);
    this.memory = new MemoryPipeline(this.config);
    this.embedding = new EmbeddingPipeline(this.config);
    
    // Create core integration
    this.core = new SentientCore(this.config.numPrimes);
  }
  
  getName(): string {
    return "AgentPipeline";
  }
  
  protected onInitialize(): void {
    this.semantic.initialize();
    this.cognitive.initialize();
    this.memory.initialize();
    this.embedding.initialize();
  }
  
  protected onStart(): void {
    const timestamp = this.state.timestamp;
    
    this.semantic.start(timestamp);
    this.cognitive.start(timestamp);
    this.memory.start(timestamp);
    this.embedding.start(timestamp);
    
    this.core.start(timestamp);
  }
  
  protected onStop(): void {
    this.semantic.stop();
    this.cognitive.stop();
    this.memory.stop();
    this.embedding.stop();
    
    this.core.stop();
  }
  
  protected onTick(dt: f64, timestamp: i64): void {
    // Tick all sub-pipelines
    this.semantic.tick(dt, timestamp);
    this.cognitive.tick(dt, timestamp);
    this.memory.tick(dt, timestamp);
    this.embedding.tick(dt, timestamp);
    
    // Tick core
    this.core.tick(dt, timestamp);
    
    // Forward events from sub-pipelines
    this.forwardSubPipelineEvents();
    
    // Check for significant state changes
    this.checkStateEvents();
  }
  
  protected onReset(): void {
    this.semantic.reset();
    this.cognitive.reset();
    this.memory.reset();
    this.embedding.reset();
    
    this.core.reset();
  }
  
  protected collectState(): void {
    // Aggregate state from all sub-pipelines
    const semanticState = this.semantic.getState();
    const cognitiveState = this.cognitive.getState();
    const memoryState = this.memory.getState();
    const embeddingState = this.embedding.getState();
    
    // Use semantic coherence and entropy as primary
    this.state.coherence = semanticState.coherence;
    this.state.entropy = semanticState.entropy;
    this.state.collapseProbability = semanticState.collapseProbability;
    
    // Combine states into JSON
    this.state.smfState = semanticState.smfState;
    this.state.oscillatorState = cognitiveState.oscillatorState;
    this.state.memoryState = memoryState.memoryState;
  }
  
  private forwardSubPipelineEvents(): void {
    // Forward recent events from sub-pipelines
    const semanticEvents = this.semantic.getEvents().getRecentEvents(5);
    const cognitiveEvents = this.cognitive.getEvents().getRecentEvents(5);
    const memoryEvents = this.memory.getEvents().getRecentEvents(5);
    
    // Re-emit with agent context
    for (let i = 0; i < semanticEvents.length; i++) {
      const e = semanticEvents[i];
      if (e.eventType == PipelineEventType.COLLAPSE) {
        this.emitEvent(PipelineEventType.COLLAPSE, `{"source":"semantic","data":${e.data}}`);
      }
    }
    
    for (let i = 0; i < cognitiveEvents.length; i++) {
      const e = cognitiveEvents[i];
      if (e.eventType == PipelineEventType.ENTANGLEMENT) {
        this.emitEvent(PipelineEventType.ENTANGLEMENT, `{"source":"cognitive","data":${e.data}}`);
      }
    }
    
    for (let i = 0; i < memoryEvents.length; i++) {
      const e = memoryEvents[i];
      if (e.eventType == PipelineEventType.PHASE_LOCK) {
        this.emitEvent(PipelineEventType.PHASE_LOCK, `{"source":"memory","data":${e.data}}`);
      }
    }
  }
  
  private checkStateEvents(): void {
    // Check for coherence changes
    const coherence = this.state.coherence;
    if (coherence > 0.9) {
      this.emitResonance(`{"coherence":${coherence},"type":"high_coherence"}`);
    } else if (coherence < 0.3) {
      this.emitEvent(PipelineEventType.STATE_CHANGE, `{"coherence":${coherence},"type":"low_coherence"}`);
    }
  }
  
  // ISemanticCapable implementation (delegated to semantic pipeline)
  
  encodeText(text: string): Float64Array {
    return this.semantic.encodeText(text);
  }
  
  getSMFAxes(): Float64Array {
    return this.semantic.getSMFAxes();
  }
  
  getCoherence(): f64 {
    return this.semantic.getCoherence();
  }
  
  getEntropy(): f64 {
    return this.semantic.getEntropy();
  }
  
  // ICognitiveCapable implementation (delegated to cognitive pipeline)
  
  getPhases(): Float64Array {
    return this.cognitive.getPhases();
  }
  
  getAmplitudes(): Float64Array {
    return this.cognitive.getAmplitudes();
  }
  
  exciteOscillator(index: i32, amplitude: f64): void {
    this.cognitive.exciteOscillator(index, amplitude);
  }
  
  getEntanglementMatrix(): Float64Array {
    return this.cognitive.getEntanglementMatrix();
  }
  
  // IMemoryCapable implementation (delegated to memory pipeline)
  
  store(content: Float64Array, significance: f64): i32 {
    return this.memory.store(content, significance);
  }
  
  recall(query: Float64Array, maxResults: i32): Array<i32> {
    return this.memory.recall(query, maxResults);
  }
  
  spreadActivation(traceId: i32, depth: i32): Array<i32> {
    return this.memory.spreadActivation(traceId, depth);
  }
  
  getMomentCount(): i32 {
    return this.memory.getMomentCount();
  }
  
  // IEmbeddingCapable implementation (delegated to embedding pipeline)
  
  embed(input: string): Float64Array {
    return this.embedding.embed(input);
  }
  
  embedValues(values: Float64Array): Float64Array {
    return this.embedding.embedValues(values);
  }
  
  similarity(a: Float64Array, b: Float64Array): f64 {
    return this.embedding.similarity(a, b);
  }
  
  // Unified Agent Methods
  
  /**
   * Process text input through all pipelines
   */
  process(text: string): AgentResult {
    const result = new AgentResult();
    
    // Encode semantically
    result.semanticAxes = this.encodeText(text);
    result.coherence = this.getCoherence();
    result.entropy = this.getEntropy();
    
    // Create embedding
    result.embedding = this.embed(text);
    
    // Store in memory
    result.memoryId = this.store(result.embedding, result.coherence);
    
    // Get cognitive state
    result.phases = this.getPhases();
    
    return result;
  }
  
  /**
   * Query agent for similar content
   */
  query(text: string, maxResults: i32 = 5): Array<i32> {
    const embedding = this.embed(text);
    return this.recall(embedding, maxResults);
  }
  
  /**
   * Get full agent state summary
   */
  getAgentState(): AgentState {
    const state = new AgentState();
    
    state.coherence = this.getCoherence();
    state.entropy = this.getEntropy();
    state.momentCount = this.getMomentCount();
    state.traceCount = this.memory.getTraceCount();
    state.synchronization = this.memory.getSynchronization();
    state.totalEntanglement = this.cognitive.getTotalEntanglement();
    state.isStable = this.cognitive.isStable();
    state.collapseCount = this.state.collapseCount;
    
    return state;
  }
  
  /**
   * Get semantic result
   */
  getSemanticResult(): SemanticResult {
    return this.semantic.getSemanticResult();
  }
  
  /**
   * Get cognitive result
   */
  getCognitiveResult(): CognitiveResult {
    return this.cognitive.getCognitiveResult();
  }
  
  /**
   * Get dominant semantic axis
   */
  getDominantAxis(): i32 {
    return this.semantic.getDominantAxis();
  }
  
  /**
   * Get most entangled pair
   */
  getMostEntangledPair(): Int32Array {
    return this.cognitive.getMostEntangledPair();
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("name", this.getName())
      .addBooleanField("running", this.running)
      .addNumberField("tickCount", f64(this.state.tickCount))
      .addNumberField("coherence", this.getCoherence())
      .addNumberField("entropy", this.getEntropy())
      .addNumberField("momentCount", f64(this.getMomentCount()))
      .addNumberField("collapseCount", f64(this.state.collapseCount))
      .addBooleanField("isStable", this.cognitive.isStable())
      .addRawField("semantic", this.semantic.toJSON())
      .addRawField("cognitive", this.cognitive.toJSON())
      .addRawField("memory", this.memory.toJSON())
      .addRawField("embedding", this.embedding.toJSON())
      .endObject();
    return builder.build();
  }
}

/**
 * Agent processing result
 */
export class AgentResult {
  semanticAxes: Float64Array = new Float64Array(0);
  embedding: Float64Array = new Float64Array(0);
  phases: Float64Array = new Float64Array(0);
  coherence: f64 = 0.0;
  entropy: f64 = 0.0;
  memoryId: i32 = -1;
}

/**
 * Agent state summary
 */
export class AgentState {
  coherence: f64 = 0.0;
  entropy: f64 = 0.0;
  momentCount: i32 = 0;
  traceCount: i32 = 0;
  synchronization: f64 = 0.0;
  totalEntanglement: f64 = 0.0;
  isStable: bool = false;
  collapseCount: i32 = 0;
}

// Factory function
export function createAgentPipeline(config: PipelineConfig | null = null): AgentPipeline {
  const pipeline = new AgentPipeline(config);
  pipeline.initialize();
  return pipeline;
}
