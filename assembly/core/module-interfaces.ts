/**
 * Module Interfaces for Prime Resonance Network
 * 
 * This file defines the core interfaces for pluggable modules in the PRN system.
 * Each module type has a specific interface that defines its contract and capabilities.
 */

import { Plugin, PluginMetadata } from './base-interfaces';
import { ValidationResult } from './validation';
import { PRNError, ErrorCategory } from './error-handling';
import { Event } from './event-system';

// Re-export for convenience
export { Plugin, PluginMetadata };

/**
 * Base module interface that all modules must implement
 */
export interface Module extends Plugin {
  /** Module type identifier */
  readonly moduleType: string;
  
  /** Module version following semantic versioning */
  readonly version: string;
  
  /** Module configuration */
  configure(config: Map<string, string>): ValidationResult;
  
  /** Get module status */
  getStatus(): ModuleStatus;
  
  /** Get module metrics */
  getMetrics(): ModuleMetrics;
}

/**
 * Module status information
 */
export class ModuleStatus {
  constructor(
    public readonly state: ModuleState,
    public readonly message: string,
    public readonly lastUpdated: i64,
    public readonly errorCount: i32 = 0
  ) {}
}

/**
 * Module state enumeration
 */
export enum ModuleState {
  UNINITIALIZED,
  INITIALIZING,
  READY,
  ACTIVE,
  PAUSED,
  ERROR,
  STOPPED
}

/**
 * Module metrics for monitoring
 */
export class ModuleMetrics {
  constructor(
    public readonly processedCount: i64,
    public readonly errorCount: i64,
    public readonly averageProcessingTime: f64,
    public readonly lastProcessingTime: f64,
    public readonly customMetrics: Map<string, f64> = new Map()
  ) {}
}

/**
 * Protocol module interface for network communication
 */
export interface ProtocolModule extends Module {
  readonly moduleType: string; // = "protocol"
  
  /** Encode a message for transmission */
  encode(message: Uint8Array): Uint8Array;
  
  /** Decode a received message */
  decode(data: Uint8Array): Uint8Array;
  
  /** Validate protocol message format */
  validateMessage(data: Uint8Array): ValidationResult;
  
  /** Get protocol version */
  getProtocolVersion(): string;
  
  /** Check if protocol version is supported */
  isVersionSupported(version: string): bool;
  
  /** Handle protocol-specific events */
  handleProtocolEvent(event: Event): void;
}

/**
 * Storage module interface for data persistence
 */
export interface StorageModule extends Module {
  readonly moduleType: string; // = "storage"
  
  /** Store data with key */
  store(key: string, data: Uint8Array): Result<void>;
  
  /** Retrieve data by key */
  retrieve(key: string): Result<Uint8Array>;
  
  /** Delete data by key */
  delete(key: string): Result<void>;
  
  /** Check if key exists */
  exists(key: string): bool;
  
  /** List keys matching pattern */
  listKeys(pattern: string): string[];
  
  /** Get storage statistics */
  getStorageStats(): StorageStats;
  
  /** Clear all data */
  clear(): Result<void>;
  
  /** Backup storage to specified location */
  backup(location: string): Result<void>;
  
  /** Restore from backup */
  restore(location: string): Result<void>;
}

/**
 * Storage statistics
 */
export class StorageStats {
  constructor(
    public readonly totalKeys: i64,
    public readonly totalSize: i64,
    public readonly availableSpace: i64,
    public readonly lastCompaction: i64
  ) {}
}

/**
 * Cryptography module interface
 */
export interface CryptoModule extends Module {
  readonly moduleType: string; // = "crypto"
  
  /** Generate key pair */
  generateKeyPair(): Result<KeyPair>;
  
  /** Sign data */
  sign(data: Uint8Array, privateKey: Uint8Array): Result<Uint8Array>;
  
  /** Verify signature */
  verify(data: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): bool;
  
  /** Encrypt data */
  encrypt(data: Uint8Array, publicKey: Uint8Array): Result<Uint8Array>;
  
  /** Decrypt data */
  decrypt(data: Uint8Array, privateKey: Uint8Array): Result<Uint8Array>;
  
  /** Generate hash */
  hash(data: Uint8Array, algorithm: string): Uint8Array;
  
  /** Generate random bytes */
  randomBytes(length: i32): Uint8Array;
  
  /** Derive key from password */
  deriveKey(password: string, salt: Uint8Array, iterations: i32): Uint8Array;
  
  /** Get supported algorithms */
  getSupportedAlgorithms(): string[];
}

/**
 * Key pair for asymmetric cryptography
 */
export class KeyPair {
  constructor(
    public readonly publicKey: Uint8Array,
    public readonly privateKey: Uint8Array,
    public readonly algorithm: string
  ) {}
}

/**
 * Network transport module interface
 */
export interface TransportModule extends Module {
  readonly moduleType: string; // = "transport"
  
  /** Connect to peer */
  connect(address: string, port: i32): Result<ConnectionHandle>;
  
  /** Listen for connections */
  listen(port: i32): Result<ListenerHandle>;
  
  /** Send data to peer */
  send(handle: ConnectionHandle, data: Uint8Array): Result<void>;
  
  /** Receive data from peer */
  receive(handle: ConnectionHandle, timeout: i32): Result<Uint8Array>;
  
  /** Close connection */
  close(handle: ConnectionHandle): void;
  
  /** Get connection statistics */
  getConnectionStats(handle: ConnectionHandle): ConnectionStats;
  
  /** Set transport options */
  setOption(option: string, value: string): Result<void>;
}

/**
 * Connection handle for transport operations
 */
export class ConnectionHandle {
  constructor(
    public readonly id: string,
    public readonly remoteAddress: string,
    public readonly remotePort: i32,
    public readonly localPort: i32
  ) {}
}

/**
 * Listener handle for accepting connections
 */
export class ListenerHandle {
  constructor(
    public readonly id: string,
    public readonly port: i32
  ) {}
}

/**
 * Connection statistics
 */
export class ConnectionStats {
  constructor(
    public readonly bytesSent: i64,
    public readonly bytesReceived: i64,
    public readonly packetsSent: i64,
    public readonly packetsReceived: i64,
    public readonly latency: f64,
    public readonly establishedTime: i64
  ) {}
}

/**
 * Consensus module interface
 */
export interface ConsensusModule extends Module {
  readonly moduleType: string; // = "consensus"
  
  /** Propose a value for consensus */
  propose(value: Uint8Array): Result<ProposalId>;
  
  /** Vote on a proposal */
  vote(proposalId: ProposalId, approve: bool): Result<void>;
  
  /** Get current consensus state */
  getConsensusState(): ConsensusState;
  
  /** Get proposal details */
  getProposal(proposalId: ProposalId): Result<Proposal>;
  
  /** Register consensus event handler */
  onConsensusReached(handler: (value: Uint8Array) => void): void;
  
  /** Get consensus parameters */
  getParameters(): ConsensusParameters;
  
  /** Update consensus parameters */
  updateParameters(params: ConsensusParameters): Result<void>;
}

/**
 * Proposal identifier
 */
export class ProposalId {
  constructor(
    public readonly id: string,
    public readonly round: i64
  ) {}
}

/**
 * Consensus proposal
 */
export class Proposal {
  constructor(
    public readonly id: ProposalId,
    public readonly value: Uint8Array,
    public readonly proposer: string,
    public readonly timestamp: i64,
    public readonly votes: Map<string, bool>
  ) {}
}

/**
 * Consensus state
 */
export class ConsensusState {
  constructor(
    public readonly currentRound: i64,
    public readonly phase: ConsensusPhase,
    public readonly activeProposals: ProposalId[],
    public readonly lastConsensusValue: Uint8Array | null,
    public readonly lastConsensusTime: i64
  ) {}
}

/**
 * Consensus phases
 */
export enum ConsensusPhase {
  IDLE,
  PROPOSING,
  VOTING,
  COMMITTING,
  FINALIZING
}

/**
 * Consensus parameters
 */
export class ConsensusParameters {
  constructor(
    public readonly minVotes: i32,
    public readonly votingTimeout: i64,
    public readonly proposalTimeout: i64,
    public readonly maxProposalsPerRound: i32
  ) {}
}

/**
 * Monitoring module interface
 */
export interface MonitoringModule extends Module {
  readonly moduleType: string; // = "monitoring"
  
  /** Record metric */
  recordMetric(name: string, value: f64, tags: Map<string, string>): void;
  
  /** Record event */
  recordEvent(name: string, data: Map<string, string>): void;
  
  /** Start timer */
  startTimer(name: string): TimerHandle;
  
  /** Stop timer and record duration */
  stopTimer(handle: TimerHandle): f64;
  
  /** Get metric value */
  getMetric(name: string, tags: Map<string, string>): f64;
  
  /** Get metric history */
  getMetricHistory(name: string, startTime: i64, endTime: i64): MetricPoint[];
  
  /** Set alert threshold */
  setAlert(name: string, condition: AlertCondition, threshold: f64): void;
  
  /** Get active alerts */
  getActiveAlerts(): Alert[];
}

/**
 * Timer handle for performance measurement
 */
export class TimerHandle {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startTime: i64
  ) {}
}

/**
 * Metric data point
 */
export class MetricPoint {
  constructor(
    public readonly timestamp: i64,
    public readonly value: f64,
    public readonly tags: Map<string, string>
  ) {}
}

/**
 * Alert conditions
 */
export enum AlertCondition {
  GREATER_THAN,
  LESS_THAN,
  EQUALS,
  NOT_EQUALS,
  RATE_INCREASE,
  RATE_DECREASE
}

/**
 * Alert information
 */
export class Alert {
  constructor(
    public readonly name: string,
    public readonly condition: AlertCondition,
    public readonly threshold: f64,
    public readonly currentValue: f64,
    public readonly triggeredAt: i64
  ) {}
}

/**
 * Result type for operations that can fail
 */
export class Result<T> {
  constructor(
    public readonly success: bool,
    public readonly value: T | null,
    public readonly error: PRNError | null
  ) {}
  
  static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value, null);
  }
  
  static err<T>(error: PRNError): Result<T> {
    return new Result<T>(false, null, error);
  }
  
  isOk(): bool {
    return this.success;
  }
  
  isErr(): bool {
    return !this.success;
  }
  
  unwrap(): T {
    if (!this.success || this.value === null) {
      throw new Error("Called unwrap on error result");
    }
    return this.value!;
  }
  
  unwrapOr(defaultValue: T): T {
    return this.success && this.value !== null ? this.value! : defaultValue;
  }
}

/**
 * Module factory for creating module instances
 */
export interface ModuleFactory {
  /** Create module instance */
  createModule(type: string, config: Map<string, string>): Result<Module>;
  
  /** Get supported module types */
  getSupportedTypes(): string[];
  
  /** Register custom module type */
  registerModuleType(type: string, factory: () => Module): void;
}

/**
 * Module registry for managing loaded modules
 */
export class ModuleRegistry {
  private modules: Map<string, Module> = new Map();
  private factories: Map<string, () => Module> = new Map();
  
  /** Register a module */
  register(id: string, module: Module): void {
    this.modules.set(id, module);
  }
  
  /** Unregister a module */
  unregister(id: string): bool {
    return this.modules.delete(id);
  }
  
  /** Get module by ID */
  getModule(id: string): Module | null {
    return this.modules.get(id);
  }
  
  /** Get modules by type */
  getModulesByType(type: string): Module[] {
    const result: Module[] = [];
    const values = this.modules.values();
    for (let i = 0; i < values.length; i++) {
      const module = values[i];
      if (module.moduleType === type) {
        result.push(module);
      }
    }
    return result;
  }
  
  /** Get all modules */
  getAllModules(): Module[] {
    return this.modules.values();
  }
  
  /** Register module factory */
  registerFactory(type: string, factory: () => Module): void {
    this.factories.set(type, factory);
  }
  
  /** Create module from factory */
  createModule(type: string, config: Map<string, string>): Result<Module> {
    const factory = this.factories.get(type);
    if (!factory) {
      return Result.err<Module>(
        new PRNError(
          `No factory registered for module type: ${type}`,
          ErrorCategory.APPLICATION_CONFIG
        )
      );
    }
    
    try {
      const module = factory();
      const configResult = module.configure(config);
      if (!configResult.valid) {
        return Result.err<Module>(
          new PRNError(
            `Module configuration failed: ${configResult.errors.join(", ")}`,
            ErrorCategory.APPLICATION_CONFIG
          )
        );
      }
      return Result.ok(module);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      return Result.err<Module>(
        new PRNError(
          `Failed to create module: ${errorMessage}`,
          ErrorCategory.SYSTEM
        )
      );
    }
  }
}

// Export a singleton registry instance
export const moduleRegistry = new ModuleRegistry();