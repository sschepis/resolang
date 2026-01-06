/**
 * Pipeline Module Index
 * 
 * Modular, prebuilt pipelines for common use cases.
 */

// Types and interfaces
export {
  PipelineEventType,
  PipelineEvent,
  EventEmitter,
  PipelineConfig,
  PipelineState,
  IPipeline,
  SemanticResult,
  CognitiveResult,
  MemoryResult,
  EmbeddingResult,
  PipelineInput
} from './types';

// Base classes and mixins
export {
  BasePipeline,
  ISemanticCapable,
  ICognitiveCapable,
  IMemoryCapable,
  IEmbeddingCapable
} from './base';

// Pipeline implementations
export { SemanticPipeline, createSemanticPipeline } from './semantic';
export { CognitivePipeline, createCognitivePipeline } from './cognitive';
export { MemoryPipeline, createMemoryPipeline } from './memory';
export { EmbeddingPipeline, createEmbeddingPipeline } from './embedding';
export { AgentPipeline, AgentResult, AgentState, createAgentPipeline } from './agent';

// Discrete Observer Pipeline (full discrete.pdf implementation)
export {
  DiscretePipeline,
  DiscreteConfig,
  DiscreteTickResult,
  createDiscretePipeline,
  createFastDiscretePipeline,
  createPreciseDiscretePipeline
} from './discrete';

// Factory and builder
export {
  PipelineFactory,
  FactoryOptions,
  PipelineBuilder,
  Presets
} from './factory';