/**
 * Pipeline Factory and Builder
 * 
 * Provides easy-to-use factory methods and fluent builder for creating pipelines.
 */

import { PipelineConfig, IPipeline } from './types';
import { SemanticPipeline, createSemanticPipeline } from './semantic';
import { CognitivePipeline, createCognitivePipeline } from './cognitive';
import { MemoryPipeline, createMemoryPipeline } from './memory';
import { EmbeddingPipeline, createEmbeddingPipeline } from './embedding';
import { AgentPipeline, createAgentPipeline } from './agent';

// ============================================================================
// Pipeline Factory - Static Factory Methods
// ============================================================================

/**
 * PipelineFactory - Static factory for creating preconfigured pipelines
 * 
 * Usage:
 * ```
 * const agent = PipelineFactory.agent();
 * const semantic = PipelineFactory.semantic({ numPrimes: 32 });
 * ```
 */
export class PipelineFactory {
  /**
   * Create a semantic pipeline
   */
  static semantic(options: FactoryOptions | null = null): SemanticPipeline {
    const config = PipelineFactory.buildConfig(options);
    return createSemanticPipeline(config);
  }
  
  /**
   * Create a cognitive pipeline
   */
  static cognitive(options: FactoryOptions | null = null): CognitivePipeline {
    const config = PipelineFactory.buildConfig(options);
    return createCognitivePipeline(config);
  }
  
  /**
   * Create a memory pipeline
   */
  static memory(options: FactoryOptions | null = null): MemoryPipeline {
    const config = PipelineFactory.buildConfig(options);
    return createMemoryPipeline(config);
  }
  
  /**
   * Create an embedding pipeline
   */
  static embedding(options: FactoryOptions | null = null): EmbeddingPipeline {
    const config = PipelineFactory.buildConfig(options);
    return createEmbeddingPipeline(config);
  }
  
  /**
   * Create an agent pipeline (recommended for most use cases)
   */
  static agent(options: FactoryOptions | null = null): AgentPipeline {
    const config = PipelineFactory.buildConfig(options);
    return createAgentPipeline(config);
  }
  
  /**
   * Create a fast/lightweight configuration
   */
  static fast(): AgentPipeline {
    return createAgentPipeline(PipelineConfig.fast());
  }
  
  /**
   * Create a precise/detailed configuration
   */
  static precise(): AgentPipeline {
    return createAgentPipeline(PipelineConfig.precise());
  }
  
  private static buildConfig(options: FactoryOptions | null): PipelineConfig {
    const config = PipelineConfig.default();
    
    if (options !== null) {
      if (options.numPrimes > 0) config.numPrimes = options.numPrimes;
      if (options.historyLength > 0) config.historyLength = options.historyLength;
      if (options.collapseThreshold > 0) config.collapseThreshold = options.collapseThreshold;
      if (options.coherenceThreshold > 0) config.coherenceThreshold = options.coherenceThreshold;
      if (options.memoryDecayRate > 0) config.memoryDecayRate = options.memoryDecayRate;
      if (options.kuramotoCoupling > 0) config.kuramotoCoupling = options.kuramotoCoupling;
    }
    
    return config;
  }
}

/**
 * Factory options for quick configuration
 */
export class FactoryOptions {
  numPrimes: i32 = 0;
  historyLength: i32 = 0;
  collapseThreshold: f64 = 0;
  coherenceThreshold: f64 = 0;
  memoryDecayRate: f64 = 0;
  kuramotoCoupling: f64 = 0;
}

// ============================================================================
// Pipeline Builder - Fluent API
// ============================================================================

/**
 * PipelineBuilder - Fluent builder for creating customized pipelines
 * 
 * Usage:
 * ```
 * const pipeline = new PipelineBuilder()
 *   .withPrimes(64)
 *   .withHistory(1000)
 *   .withCollapse(0.8)
 *   .buildAgent();
 * ```
 */
export class PipelineBuilder {
  private config: PipelineConfig;
  
  constructor() {
    this.config = PipelineConfig.default();
  }
  
  /**
   * Start with default configuration
   */
  static create(): PipelineBuilder {
    return new PipelineBuilder();
  }
  
  /**
   * Start with fast configuration
   */
  static fast(): PipelineBuilder {
    const builder = new PipelineBuilder();
    builder.config = PipelineConfig.fast();
    return builder;
  }
  
  /**
   * Start with precise configuration
   */
  static precise(): PipelineBuilder {
    const builder = new PipelineBuilder();
    builder.config = PipelineConfig.precise();
    return builder;
  }
  
  // Configuration methods
  
  /**
   * Set number of prime oscillators
   */
  withPrimes(n: i32): PipelineBuilder {
    this.config.numPrimes = n;
    return this;
  }
  
  /**
   * Set history length for temporal memory
   */
  withHistory(length: i32): PipelineBuilder {
    this.config.historyLength = length;
    return this;
  }
  
  /**
   * Set collapse threshold
   */
  withCollapse(threshold: f64): PipelineBuilder {
    this.config.collapseThreshold = threshold;
    return this;
  }
  
  /**
   * Set coherence threshold for resonance
   */
  withCoherence(threshold: f64): PipelineBuilder {
    this.config.coherenceThreshold = threshold;
    return this;
  }
  
  /**
   * Set entanglement detection threshold
   */
  withEntanglement(threshold: f64): PipelineBuilder {
    this.config.entanglementThreshold = threshold;
    return this;
  }
  
  /**
   * Set memory decay rate
   */
  withMemoryDecay(rate: f64): PipelineBuilder {
    this.config.memoryDecayRate = rate;
    return this;
  }
  
  /**
   * Set entropy decay rate
   */
  withEntropyDecay(rate: f64): PipelineBuilder {
    this.config.entropyDecayRate = rate;
    return this;
  }
  
  /**
   * Set amplitude decay rate
   */
  withAmplitudeDecay(rate: f64): PipelineBuilder {
    this.config.amplitudeDecayRate = rate;
    return this;
  }
  
  /**
   * Set Kuramoto coupling strength
   */
  withCoupling(strength: f64): PipelineBuilder {
    this.config.kuramotoCoupling = strength;
    return this;
  }
  
  /**
   * Set resonance strength
   */
  withResonance(strength: f64): PipelineBuilder {
    this.config.resonanceStrength = strength;
    return this;
  }
  
  /**
   * Set default timestep
   */
  withTimestep(dt: f64): PipelineBuilder {
    this.config.defaultDt = dt;
    return this;
  }
  
  // Builder methods
  
  /**
   * Build a semantic pipeline
   */
  buildSemantic(): SemanticPipeline {
    return createSemanticPipeline(this.config);
  }
  
  /**
   * Build a cognitive pipeline
   */
  buildCognitive(): CognitivePipeline {
    return createCognitivePipeline(this.config);
  }
  
  /**
   * Build a memory pipeline
   */
  buildMemory(): MemoryPipeline {
    return createMemoryPipeline(this.config);
  }
  
  /**
   * Build an embedding pipeline
   */
  buildEmbedding(): EmbeddingPipeline {
    return createEmbeddingPipeline(this.config);
  }
  
  /**
   * Build an agent pipeline (recommended)
   */
  buildAgent(): AgentPipeline {
    return createAgentPipeline(this.config);
  }
  
  /**
   * Build with explicit type
   */
  build(pipelineType: string): IPipeline {
    if (pipelineType == "semantic") return this.buildSemantic();
    if (pipelineType == "cognitive") return this.buildCognitive();
    if (pipelineType == "memory") return this.buildMemory();
    if (pipelineType == "embedding") return this.buildEmbedding();
    return this.buildAgent();
  }
  
  /**
   * Get the current configuration
   */
  getConfig(): PipelineConfig {
    return this.config;
  }
}

// ============================================================================
// Preset Configurations
// ============================================================================

/**
 * Preset configurations for common use cases
 */
export class Presets {
  /**
   * Minimal configuration for testing
   */
  static minimal(): PipelineBuilder {
    return PipelineBuilder.create()
      .withPrimes(16)
      .withHistory(50)
      .withMemoryDecay(0.05);
  }
  
  /**
   * Standard configuration for most use cases
   */
  static standard(): PipelineBuilder {
    return PipelineBuilder.create()
      .withPrimes(64)
      .withHistory(200)
      .withCollapse(0.8)
      .withCoherence(0.5);
  }
  
  /**
   * High-performance configuration for real-time applications
   */
  static realtime(): PipelineBuilder {
    return PipelineBuilder.fast()
      .withPrimes(32)
      .withHistory(100)
      .withTimestep(0.033); // ~30fps
  }
  
  /**
   * High-precision configuration for analysis
   */
  static analysis(): PipelineBuilder {
    return PipelineBuilder.precise()
      .withPrimes(128)
      .withHistory(1000)
      .withCollapse(0.9);
  }
  
  /**
   * Memory-focused configuration for episodic tasks
   */
  static episodic(): PipelineBuilder {
    return PipelineBuilder.create()
      .withPrimes(64)
      .withHistory(500)
      .withMemoryDecay(0.005)
      .withEntropyDecay(0.0005);
  }
  
  /**
   * Embedding-focused configuration for similarity tasks
   */
  static similarity(): PipelineBuilder {
    return PipelineBuilder.create()
      .withPrimes(128)
      .withResonance(0.2)
      .withCoupling(0.15);
  }
}