/**
 * Semantic Pipeline
 * 
 * Pipeline for semantic encoding using Sedenion Memory Field.
 * Provides text/concept encoding with entropy tracking and collapse detection.
 */

import { SedenionMemoryField, createSMFFromText, SEMANTIC_AXES } from '../smf';
import { BasePipeline, ISemanticCapable } from './base';
import { PipelineConfig, PipelineEventType, SemanticResult } from './types';
import { JSONBuilder } from '../core/serialization';

/**
 * SemanticPipeline - For text and concept encoding
 * 
 * Components:
 * - SedenionMemoryField (SMF) for 16-axis semantic space
 * - Entropy tracking
 * - Collapse detection and handling
 */
export class SemanticPipeline extends BasePipeline implements ISemanticCapable {
  private smf: SedenionMemoryField = new SedenionMemoryField(100);
  private lastCoherence: f64 = 1.0;
  private lastEntropy: f64 = 0.0;
  private accumulatedEntropy: f64 = 0.0;
  
  constructor(config: PipelineConfig | null = null) {
    super(config);
    // Re-initialize with actual config value
    this.smf = new SedenionMemoryField(this.config.historyLength);
  }
  
  getName(): string {
    return "SemanticPipeline";
  }
  
  protected onInitialize(): void {
    this.smf = new SedenionMemoryField(this.config.historyLength);
  }
  
  protected onStart(): void {
    this.lastCoherence = this.smf.getCoherence();
    this.lastEntropy = this.smf.getEntropy();
  }
  
  protected onStop(): void {
    // Nothing special needed
  }
  
  protected onTick(dt: f64, timestamp: i64): void {
    const oldCoherence = this.lastCoherence;
    const oldEntropy = this.lastEntropy;
    
    // Evolve the SMF
    this.smf.evolve(dt, timestamp);
    
    // Track coherence/entropy changes
    this.lastCoherence = this.smf.getCoherence();
    this.lastEntropy = this.smf.getEntropy();
    
    // Emit change events
    this.emitCoherenceChange(oldCoherence, this.lastCoherence);
    this.emitEntropyChange(oldEntropy, this.lastEntropy);
    
    // Accumulate entropy
    this.accumulatedEntropy += this.lastEntropy * dt;
    
    // Check for collapse
    const collapseProbability = this.smf.getCollapseProbability();
    if (collapseProbability > this.config.collapseThreshold) {
      this.handleCollapse(timestamp);
    }
  }
  
  protected onReset(): void {
    this.smf.reset();
    this.lastCoherence = 1.0;
    this.lastEntropy = 0.0;
    this.accumulatedEntropy = 0.0;
  }
  
  protected collectState(): void {
    this.state.coherence = this.lastCoherence;
    this.state.entropy = this.lastEntropy;
    this.state.collapseProbability = this.smf.getCollapseProbability();
    this.state.smfState = this.smf.toJSON();
  }
  
  private handleCollapse(timestamp: i64): void {
    const dominantAxis = this.smf.getDominantAxis();
    const axisName = SEMANTIC_AXES[dominantAxis];
    
    // Perform collapse
    this.smf.collapse();
    this.accumulatedEntropy = 0.0;
    
    // Emit collapse event
    this.emitCollapse(`{"dominantAxis":${dominantAxis},"axisName":"${axisName}","timestamp":${timestamp}}`);
  }
  
  // ISemanticCapable implementation
  
  /**
   * Encode text into the SMF
   */
  encodeText(text: string): Float64Array {
    // Create SMF from text
    const textSMF = createSMFFromText(text);
    
    // Blend with current state
    const blended = this.smf.blend(textSMF, 0.5);
    
    // Apply to main SMF
    this.smf.perturb(blended.state);
    
    return this.getSMFAxes();
  }
  
  /**
   * Get current SMF axis values
   */
  getSMFAxes(): Float64Array {
    return this.smf.getAllAxes();
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
  
  // Additional semantic methods
  
  /**
   * Excite a specific semantic axis
   */
  exciteAxis(axisIndex: i32, amplitude: f64): void {
    this.smf.excite(axisIndex, amplitude);
  }
  
  /**
   * Get the dominant semantic axis
   */
  getDominantAxis(): i32 {
    return this.smf.getDominantAxis();
  }
  
  /**
   * Get collapse probability
   */
  getCollapseProbability(): f64 {
    return this.smf.getCollapseProbability();
  }
  
  /**
   * Get semantic result (all semantic metrics in one object)
   */
  getSemanticResult(): SemanticResult {
    return new SemanticResult(
      this.getSMFAxes(),
      this.getEntropy(),
      this.getDominantAxis(),
      this.getCoherence()
    );
  }
  
  /**
   * Calculate similarity with another text
   */
  similarity(text: string): f64 {
    const textSMF = createSMFFromText(text);
    return this.smf.similarity(textSMF);
  }
  
  /**
   * Get mean coherence over history
   */
  getMeanCoherence(): f64 {
    return this.smf.getMeanCoherence();
  }
  
  /**
   * Get coherence variance
   */
  getCoherenceVariance(): f64 {
    return this.smf.getCoherenceVariance();
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("name", this.getName())
      .addBooleanField("running", this.running)
      .addNumberField("coherence", this.getCoherence())
      .addNumberField("entropy", this.getEntropy())
      .addNumberField("collapseProbability", this.getCollapseProbability())
      .addNumberField("dominantAxis", f64(this.getDominantAxis()))
      .addNumberField("collapseCount", f64(this.state.collapseCount))
      .endObject();
    return builder.build();
  }
}

// Factory function
export function createSemanticPipeline(config: PipelineConfig | null = null): SemanticPipeline {
  const pipeline = new SemanticPipeline(config);
  pipeline.initialize();
  return pipeline;
}
