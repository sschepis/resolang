// Consolidated exports for the ResoLang library

// Core Types
export {
  Prime,
  Phase,
  Amplitude,
  Entropy,
  ResonantFragment,
  PrimeFieldElement,
  Complex
} from './types';

// Core Operations
export * from './operators';
export * from './functionalBlocks';

// Quaternion
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

// Utilities
export * from './utils';
export * from './entropy-viz';
export { getMapKeys } from './map-exports';

// Core Infrastructure
export * from './core/interfaces';
export * from './core/errors';
export * from './core/validation';
export * from './core/math-optimized';
export { generatePrimes } from './core/math';
export {
  JSONBuilder,
  SerializationOptions,
  escapeJSON,
  SerializationUtils
} from './core/serialization';
export {
  PHI,
  E,
  TWO_PI,
  MERSENNE_PRIME_31,
  generateUniqueId,
  degreesToRadians,
  radiansToDegrees
} from './core/constants';

// Crypto
export * from './crypto/index';

// Identity
export * from './identity/index';
export { IdentityResoLangProcessor } from './identity/resolang-processor';

// Quantum
export * from './quantum/phase-lock-ring';
export * from './quantum/prime-memory';
export * from './quantum/prime-operators';
export * from './quantum/prime-state';
export * from './quantum/quantum-consciousness-resonance';

// Runtime
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

// P=NP Framework
export {
  ComprehensiveBenchmarkSuite,
  runFullValidationSuite
} from './examples/comprehensive-benchmark-suite';

export {
  runBenchmarkTests
} from './examples/test-comprehensive-benchmark-suite';

// WebAssembly-compatible exports
export * from './quaternion-exports';
export * from './quantum-exports';
export * from './complex-exports';
export * from './prime-state-exports';
export * from './map-exports';
export * from './pnp-exports';
export * from './runtime-exports';
