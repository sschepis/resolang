/**
 * Sentient Module - AssemblyScript Port
 *
 * Port of the core sentient observer architecture from "A Design for a
 * Sentient Observer" paper.
 *
 * Exports:
 * - SMF: Sedenion Memory Field (16D semantic orientation)
 * - PRSC: Prime Resonance Semantic Computation (oscillator dynamics)
 * - HQE: Holographic Quantum Encoding (distributed memory)
 * - Temporal: Emergent time from coherence events
 * - Entanglement: Semantic binding and phrase segmentation
 * - Core: Sentient Observer orchestrator
 * - GMF: Global Memory Field (network memory)
 * - PRRC: Prime-Resonant Resonance Channel (non-local communication)
 * - DCC: Distributed Coherent-Commit (consensus protocol)
 * - Sync: Network Synchronizer (offline-first sync)
 */

// SMF - Sedenion Memory Field
export {
  SedenionMemoryField,
  SMFAxis,
  SMF_AXES,
  DominantAxisInfo,
  getAxisIndex,
  getAxisName,
  createSMF,
  createSMFFromText
} from './smf';

// PRSC - Prime Resonance Semantic Computation
export {
  PRSCLayer,
  PrimeOscillator,
  PRSCState,
  EntanglementDetector,
  EntangledPair as PRSCEntangledPair,
  CoherenceHistoryEntry,
  CoherencePeak,
  createPRSC,
  createEntanglementDetector
} from './prsc';

// HQE - Holographic Quantum Encoding
export {
  HolographicEncoder,
  HolographicMemory,
  HolographicMemoryEntry,
  HolographicRecallResult,
  StabilizationController,
  StabilizationStats,
  HQEEvolutionResult,
  LambdaHistoryEntry,
  SpatialFrequency,
  Complex,
  createHolographicEncoder,
  createHolographicMemory,
  createStabilizationController
} from './hqe';

// Temporal - Emergent Time
export {
  TemporalLayer,
  Moment,
  TemporalStats,
  TemporalHistoryEntry,
  PhaseHistoryEntry,
  MomentTriggerResult,
  TemporalPatternDetector,
  MomentSignature,
  DetectedPattern,
  createTemporalLayer,
  createPatternDetector
} from './temporal';

// Entanglement - Semantic Binding
export {
  EntanglementLayer,
  EntangledPair,
  Phrase,
  EntanglementEdge,
  EntanglementUpdateResult,
  MostEntangledResult,
  AssociativeRecallResult,
  EntanglementStats,
  createEntanglementLayer
} from './entanglement';

// Core - Sentient Observer
export {
  SentientObserver,
  SentientState,
  SentientStatus,
  IntrospectionReport,
  TickResult,
  SemanticStateEntry,
  createSentientObserver,
  runTick,
  processInput,
  getStatus,
  introspect
} from './core';

// GMF - Global Memory Field
export {
  GlobalMemoryField,
  MemoryObject,
  MemoryCluster,
  GMFEntry,
  GMFDelta,
  GMFSnapshot,
  GMFStats,
  LocalProof,
  StabilityWeight,
  createGMF,
  createMemoryObject,
  createLocalProof
} from './gmf';

// PRRC - Prime-Resonant Resonance Channel
export {
  PRRCChannel,
  PRRCConfig,
  PRRCPacket,
  PRRCStats,
  PhaseReference,
  TopologicalTransport,
  HolonomyWrapper,
  ResonanceEncoder,
  createPRRCChannel,
  createPRRCChannelWithConfig,
  createPhaseReference,
  createPRRCConfig
} from './prrc';

// DCC - Distributed Coherent-Commit
export {
  DCCProtocol,
  DCCConfig,
  DCCProposal,
  DCCStats,
  VerificationVote,
  NetworkEvidence,
  CommitResult,
  VerifierNode,
  createDCCProtocol,
  createDCCProtocolWithConfig,
  createDCCConfig,
  createVerifierNode
} from './dcc';

// Sync - Network Synchronizer
export {
  NetworkSynchronizer,
  SyncConfig,
  SyncState,
  SyncResult,
  SyncStats,
  ProposalLogEntry,
  createSynchronizer,
  createSynchronizerWithConfig,
  createSyncConfig
} from './sync';