// Main entry point for ResoLang core library
// This file exports all public APIs that ResonNet and other projects can use

export * from './resolang';

// Core operations
export * from './operators';
export * from './functionalBlocks';
export * from './quaternion';
export * from './quaternion-entanglement';

// Utilities
export * from './utils';
export * from './entropy-viz';

// Core infrastructure
export * from './core/interfaces';
export * from './core/errors';
export * from './core/validation';
export * from './core/math-optimized';
export { generatePrimes } from './core/math';

// Crypto exports
export * from './crypto/index';

// Identity exports
export * from './identity/index';
export { IdentityResoLangProcessor } from './identity/resolang-processor';

// Quantum operations (individual exports since no index file)
export * from './quantum/phase-lock-ring';
export * from './quantum/prime-memory';
export * from './quantum/prime-operators';
export * from './quantum/prime-state';
export * from './quantum/quantum-consciousness-resonance';
export { PrimeState } from './quantum/prime-state';

// Runtime exports (core components only)
export * from './runtime/argument';
export * from './runtime/execution/context';
export * from './runtime/execution/controlFlow';
export * from './runtime/execution/stack';
export * from './runtime/entropy/evolution';
export * from './runtime/instructions/types';
export * from './runtime/memory/holographic';
export * from './runtime/state/globalState';
export * from './runtime/state/primeState';
// export * from './runtime/state/registerState'; // Ambiguous export
export { IRISAInstruction, RISAEngine, IExecutionResult } from './runtime';

// Specific additional exports to avoid conflicts
export { PrimeFieldElement, Complex } from './types';
export {
  JSONBuilder,
  SerializationOptions,
  escapeJSON,
  SerializationUtils
} from './core/serialization';
export { getMapKeys } from './map-exports';
export {
  PHI,
  E,
  TWO_PI,
  MERSENNE_PRIME_31,
  generateUniqueId,
  degreesToRadians,
  radiansToDegrees
} from './core/constants';

// P = NP Breakthrough Validation Framework exports
export {
  ComprehensiveBenchmarkSuite,
  runFullValidationSuite
} from './examples/comprehensive-benchmark-suite';

export {
  runBenchmarkTests
} from './examples/test-comprehensive-benchmark-suite';

// Explicit quaternion class exports for external consumption
export {
  Quaternion,
  SplitPrimeFactorizer,
  QuaternionicResonanceField,
  TwistDynamics,
  QuaternionicProjector,
  QuaternionPool
} from './quaternion';

export {
  EntangledQuaternionPair,
  QuaternionicSynchronizer,
  QuaternionicAgent
} from './quaternion-entanglement';

// WebAssembly-compatible quaternion function exports
export * from './quaternion-exports';

// WebAssembly-compatible quantum function exports
export * from './quantum-exports';
// WebAssembly-compatible complex number function exports
export * from './complex-exports';


// WebAssembly-compatible prime state function exports
export * from './prime-state-exports';
// WebAssembly-compatible P=NP solver function exports
// WebAssembly-compatible map function exports
export * from './map-exports';
export * from './pnp-exports';
// WebAssembly-compatible runtime function exports
export * from './runtime-exports';

// New WASM exports for Sedenion, Enochian, and Physics
export * from './sedenion';
export * from './twist';
export * from './enochian';
export * from './physics';

// TinyAleph ports - Core Prime Resonance modules
export * from './fano';
export * from './hypercomplex';
export * from './hilbert';
export * from './rformer';

// Resonance module (explicit exports to avoid conflicts with existing modules)
export {
  GaussianInteger,
  EisensteinInteger,
  PrimeResonanceIdentity,
  PhaseLockedRing,
  DominantPrimeInfo
} from './resonance';

// ============================================================================
// Sentient Observer Extensions (ported from tinyaleph/apps/sentient)
// ============================================================================

// Sedenion Memory Field (SMF) - 16-axis semantic space
export {
  SedenionMemoryField,
  SMFConfig,
  SMF_CONFIG,
  SEMANTIC_AXES,
  AXIS_COHERENCE,
  AXIS_IDENTITY,
  AXIS_DUALITY,
  AXIS_STRUCTURE,
  AXIS_CHANGE,
  AXIS_LIFE,
  AXIS_HARMONY,
  AXIS_WISDOM,
  AXIS_INFINITY,
  AXIS_CREATION,
  AXIS_TRUTH,
  AXIS_LOVE,
  AXIS_POWER,
  AXIS_TIME,
  AXIS_SPACE,
  AXIS_CONSCIOUSNESS,
  createSMFFromValues,
  createSMFFromText
} from './smf';

// State management - Temporal memory system
export {
  StateSnapshot,
  Moment,
  TemporalLayer,
  MemoryTrace,
  MemoryStore,
  createSnapshot
} from './state';

// Sentient Observer Core - Complete integration
export {
  HolographicField,
  EntanglementDetector,
  EntropyCollapse,
  SentientCore,
  // WASM exports
  createSentientCore,
  startSentientCore,
  stopSentientCore,
  tickSentientCore,
  getSentientCoherence,
  getSentientEntropy,
  getSentientSMFAxis,
  getSentientPhase,
  getSentientAmplitude,
  exciteSentientOscillator,
  resetSentientCore,
  getSentientState
} from './sentient';

// ============================================================================
// Pipeline System - Modular, Prebuilt Pipelines
// ============================================================================

export * from './pipelines/index';

// ============================================================================
// Discrete Observer (Full discrete.pdf specification implementation)
// ============================================================================

export {
  DiscreteObserverConfig,
  DiscreteObserverState,
  DiscreteStepResult,
  DISCRETE_CONFIG,
  DEFAULT_PRIMES,
  ENOCHIAN_PRIMES,
  // Core functions
  computeDiscreteCoupling,
  computeHistogramCoherence,
  computeWindowedStability,
  getActiveIndices,
  getActiveIndicesForLearning,
  primeToSMFAxis,
  compositionVector,
  normalizeSMF,
  computeSmfEntropy,
  updateSMF,
  applyHebbianLearning,
  decayLearnedCoupling,
  getLearnedCoupling,
  getLearnedCouplingStrength,
  detectLockup,
  applyControlledTunneling,
  discreteStep,
  // Control functions
  dampenAll,
  randomizeCoupling,
  resetCoupling,
  getStateMetrics,
  getPhases,
  getAmplitudes,
  getSMF,
  getWeights,
  isLockedUp,
  boostPrime,
  boostIndex,
  // WASM exports
  createDiscreteObserver,
  discreteObserverStep,
  discreteObserverBoost,
  discreteObserverGetCoherence,
  discreteObserverGetPhase,
  discreteObserverGetAmplitude,
  discreteObserverGetSMFAxis,
  discreteObserverGetTickCount,
  discreteObserverGetEntropy,
  discreteObserverReset,
  discreteObserverGetCount,
  discreteObserverGetState,
  discreteObserverGetLearnedCouplingStrength,
  discreteObserverGetLearnedCoupling,
  discreteObserverApplyHebbianLearning,
  discreteObserverDecayLearnedCoupling
} from './discrete-observer';
