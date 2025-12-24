/**
 * Embedding Pipeline
 * 
 * Pipeline for vector embeddings with prime structure.
 * Uses Quaternion, Hilbert space, and Resonance modules.
 */

import { Quaternion } from '../quaternion';
import { PrimeHilbertState, EntropyDrivenEvolution } from '../hilbert';
import { generatePrimes } from '../core/math';
import { BasePipeline, IEmbeddingCapable } from './base';
import { PipelineConfig, PipelineEventType, EmbeddingResult } from './types';
import { JSONBuilder } from '../core/serialization';
import { PI } from '../core/math';

const TWO_PI: f64 = 2.0 * PI;

/**
 * EmbeddingPipeline - For vector embeddings with prime structure
 * 
 * Components:
 * - Quaternion algebra for rotations
 * - Prime Hilbert space for state vectors
 * - Resonance encoding for stable representations
 */
export class EmbeddingPipeline extends BasePipeline implements IEmbeddingCapable {
  private hilbert: PrimeHilbertState;
  private evolution: EntropyDrivenEvolution | null = null;
  private primes: Array<u32> = new Array<u32>();
  private embeddingDim: i32 = 16;
  private referenceState: PrimeHilbertState;
  
  constructor(config: PipelineConfig | null = null) {
    super(config);
    // Initialize with actual config values
    this.embeddingDim = this.config.numPrimes;
    this.primes = generatePrimes(this.embeddingDim);
    this.hilbert = new PrimeHilbertState(this.primes);
    this.referenceState = PrimeHilbertState.uniform(this.primes);
  }
  
  getName(): string {
    return "EmbeddingPipeline";
  }
  
  protected onInitialize(): void {
    this.primes = generatePrimes(this.embeddingDim);
    this.hilbert = new PrimeHilbertState(this.primes);
    this.referenceState = PrimeHilbertState.uniform(this.primes);
    this.evolution = new EntropyDrivenEvolution(this.hilbert, this.config.resonanceStrength, this.config.coherenceThreshold, this.config.defaultDt);
  }
  
  protected onStart(): void {
    // Nothing special needed
  }
  
  protected onStop(): void {
    // Nothing special needed
  }
  
  protected onTick(dt: f64, timestamp: i64): void {
    // Step the evolution if available
    if (this.evolution !== null) {
      this.evolution.step();
      this.hilbert = this.evolution.state;
    }
    
    // Check for resonance
    const entropy = this.hilbert.entropy();
    const coherence = this.hilbert.coherence(this.referenceState);
    if (entropy < 0.5) {
      this.emitResonance(`{"entropy":${entropy},"coherence":${coherence}}`);
    }
  }
  
  protected onReset(): void {
    this.onInitialize();
  }
  
  protected collectState(): void {
    this.state.entropy = this.hilbert.entropy();
    this.state.coherence = this.hilbert.coherence(this.referenceState);
  }
  
  // IEmbeddingCapable implementation
  
  /**
   * Embed text into vector space
   */
  embed(input: string): Float64Array {
    const result = new Float64Array(this.embeddingDim);
    const textLen = input.length;
    
    if (textLen == 0) return result;
    
    // Character-based encoding into prime phases
    for (let i = 0; i < textLen; i++) {
      const charCode = input.charCodeAt(i);
      const primeIdx = charCode % this.embeddingDim;
      
      // Phase from position, amplitude from frequency
      const phase = TWO_PI * f64(i) / f64(textLen);
      const amplitude = 1.0 / f64(textLen);
      
      // Add to embedding vector
      result[primeIdx] += Math.cos(phase) * amplitude;
    }
    
    // Normalize
    let norm: f64 = 0.0;
    for (let i = 0; i < this.embeddingDim; i++) {
      norm += result[i] * result[i];
    }
    norm = Math.sqrt(norm);
    
    if (norm > 1e-10) {
      for (let i = 0; i < this.embeddingDim; i++) {
        result[i] /= norm;
      }
    }
    
    return result;
  }
  
  /**
   * Embed values into vector space
   */
  embedValues(values: Float64Array): Float64Array {
    const result = new Float64Array(this.embeddingDim);
    const valLen = values.length;
    
    // Project input values onto prime basis
    for (let i = 0; i < valLen; i++) {
      const primeIdx = i % this.embeddingDim;
      result[primeIdx] += values[i];
    }
    
    // Apply quaternion rotation for mixing
    const q = new Quaternion(
      result[0] / 2,
      result[1 % this.embeddingDim] / 2,
      result[2 % this.embeddingDim] / 2,
      result[3 % this.embeddingDim] / 2
    ).normalize();
    
    // Rotate the embedding
    for (let i = 0; i < this.embeddingDim; i++) {
      const angle = q.w * f64(this.primes[i]);
      result[i] = result[i] * Math.cos(angle) + (q.x + q.y + q.z) * Math.sin(angle) / 3.0;
    }
    
    // Normalize
    let norm: f64 = 0.0;
    for (let i = 0; i < this.embeddingDim; i++) {
      norm += result[i] * result[i];
    }
    norm = Math.sqrt(norm);
    
    if (norm > 1e-10) {
      for (let i = 0; i < this.embeddingDim; i++) {
        result[i] /= norm;
      }
    }
    
    return result;
  }
  
  /**
   * Calculate similarity between two embeddings
   */
  similarity(a: Float64Array, b: Float64Array): f64 {
    const n = Math.min(a.length, b.length) as i32;
    
    let dot: f64 = 0.0;
    let normA: f64 = 0.0;
    let normB: f64 = 0.0;
    
    for (let i = 0; i < n; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const norms = Math.sqrt(normA * normB);
    if (norms < 1e-10) return 0.0;
    
    return dot / norms;
  }
  
  // Additional embedding methods
  
  /**
   * Get embedding dimension
   */
  getDimension(): i32 {
    return this.embeddingDim;
  }
  
  /**
   * Get primes used for encoding
   */
  getPrimes(): Array<u32> {
    return this.primes;
  }
  
  /**
   * Get Hilbert space entropy
   */
  getHilbertEntropy(): f64 {
    return this.hilbert.entropy();
  }
  
  /**
   * Get Hilbert space coherence
   */
  getHilbertCoherence(): f64 {
    return this.hilbert.coherence(this.referenceState);
  }
  
  /**
   * Get prime signature (dominant primes)
   */
  getPrimeSignature(embedding: Float64Array, topN: i32 = 5): Array<u32> {
    // Get indices sorted by absolute value
    const indexed = new Array<i32>(embedding.length);
    for (let i = 0; i < embedding.length; i++) {
      indexed[i] = i;
    }
    
    // Sort by absolute value descending
    indexed.sort((a: i32, b: i32): i32 => {
      const valA = Math.abs(embedding[a]);
      const valB = Math.abs(embedding[b]);
      if (valB > valA) return 1;
      if (valB < valA) return -1;
      return 0;
    });
    
    // Return top N prime indices
    const result = new Array<u32>();
    const n = Math.min(topN, indexed.length) as i32;
    for (let i = 0; i < n; i++) {
      result.push(this.primes[indexed[i]]);
    }
    
    return result;
  }
  
  /**
   * Get embedding result with all metrics
   */
  getEmbeddingResult(input: string): EmbeddingResult {
    const vector = this.embed(input);
    const result = new EmbeddingResult(this.embeddingDim);
    
    // Copy vector
    for (let i = 0; i < this.embeddingDim; i++) {
      result.vector[i] = vector[i];
    }
    
    // Get prime signature
    const sig = this.getPrimeSignature(vector, 5);
    for (let i = 0; i < sig.length; i++) {
      result.primeSignature.push(sig[i] as i32);
    }
    
    // Get quaternion components from first 4 values
    const q = new Quaternion(
      vector[0],
      vector[1 % this.embeddingDim],
      vector[2 % this.embeddingDim],
      vector[3 % this.embeddingDim]
    ).normalize();
    
    result.quaternionComponents[0] = q.w;
    result.quaternionComponents[1] = q.x;
    result.quaternionComponents[2] = q.y;
    result.quaternionComponents[3] = q.z;
    
    return result;
  }
  
  /**
   * Project to lower dimension using quaternion
   */
  projectTo4D(embedding: Float64Array): Float64Array {
    const result = new Float64Array(4);
    
    // Sum into quaternion components
    for (let i = 0; i < embedding.length; i++) {
      result[i % 4] += embedding[i];
    }
    
    // Normalize
    let norm: f64 = 0.0;
    for (let i = 0; i < 4; i++) {
      norm += result[i] * result[i];
    }
    norm = Math.sqrt(norm);
    
    if (norm > 1e-10) {
      for (let i = 0; i < 4; i++) {
        result[i] /= norm;
      }
    }
    
    return result;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("name", this.getName())
      .addBooleanField("running", this.running)
      .addNumberField("dimension", f64(this.embeddingDim))
      .addNumberField("hilbertEntropy", this.getHilbertEntropy())
      .addNumberField("hilbertCoherence", this.getHilbertCoherence())
      .endObject();
    return builder.build();
  }
}

// Factory function
export function createEmbeddingPipeline(config: PipelineConfig | null = null): EmbeddingPipeline {
  const pipeline = new EmbeddingPipeline(config);
  pipeline.initialize();
  return pipeline;
}
