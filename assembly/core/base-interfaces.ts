/**
 * Base Interface Definitions for the Prime Resonance Network
 * 
 * This module defines the core interfaces that establish contracts
 * for all major component types in the system.
 */

import { NodeID } from '../types';

// ============================================================================
// Core Functionality Interfaces
// ============================================================================

/**
 * Serializable interface for objects that can be converted to JSON
 */
export interface Serializable {
  /**
   * Convert the object to a JSON string representation
   */
  toJSON(): string;
  
  /**
   * Convert the object to a plain JavaScript object
   */
  toObject(): any;
}

/**
 * Validatable interface for objects that can validate their state
 */
export interface Validatable {
  /**
   * Validate the object's current state
   * @returns true if valid, false otherwise
   */
  validate(): bool;
  
  /**
   * Get validation errors if any
   * @returns Array of validation error messages
   */
  getValidationErrors(): string[];
}

/**
 * Lifecycle interface for objects with initialization and cleanup
 */
export interface Lifecycle {
  /**
   * Initialize the object
   */
  initialize(): void;
  
  /**
   * Clean up resources
   */
  dispose(): void;
  
  /**
   * Check if the object is initialized
   */
  isInitialized(): bool;
}

/**
 * Observable interface for objects that emit events
 */
export interface Observable<T> {
  /**
   * Subscribe to events
   * @param event Event name
   * @param handler Event handler function
   * @returns Unsubscribe function
   */
  on(event: string, handler: (data: T) => void): () => void;
  
  /**
   * Emit an event
   * @param event Event name
   * @param data Event data
   */
  emit(event: string, data: T): void;
  
  /**
   * Remove all listeners for an event
   * @param event Event name
   */
  removeAllListeners(event: string): void;
}

/**
 * Cloneable interface for objects that can create copies of themselves
 */
export interface Cloneable<T> {
  /**
   * Create a deep copy of the object
   */
  clone(): T;
}

/**
 * Comparable interface for objects that can be compared
 */
export interface Comparable<T> {
  /**
   * Compare this object with another
   * @returns negative if less than, 0 if equal, positive if greater than
   */
  compareTo(other: T): i32;
}

// ============================================================================
// Network and Protocol Interfaces
// ============================================================================

/**
 * Network message interface
 */
export interface NetworkMessage extends Serializable {
  /**
   * Unique message ID
   */
  readonly id: string;
  
  /**
   * Message type identifier
   */
  readonly type: string;
  
  /**
   * Timestamp when the message was created
   */
  readonly timestamp: u64;
  
  /**
   * Source node ID
   */
  readonly source: NodeID;
  
  /**
   * Destination node ID (optional for broadcast)
   */
  readonly destination: NodeID | null;
  
  /**
   * Message payload
   */
  readonly payload: Uint8Array;
  
  /**
   * Calculate message hash
   */
  hash(): string;
  
  /**
   * Sign the message
   * @param privateKey Private key for signing
   */
  sign(privateKey: Uint8Array): void;
  
  /**
   * Verify message signature
   * @param publicKey Public key for verification
   */
  verify(publicKey: Uint8Array): bool;
}

/**
 * Protocol handler interface
 */
export interface ProtocolHandler {
  /**
   * Protocol identifier
   */
  readonly protocolId: string;
  
  /**
   * Protocol version
   */
  readonly version: string;
  
  /**
   * Handle incoming message
   * @param message Incoming network message
   * @returns Response message or null
   */
  handleMessage(message: NetworkMessage): NetworkMessage | null;
  
  /**
   * Check if this handler can process the message
   * @param message Network message to check
   */
  canHandle(message: NetworkMessage): bool;
}

/**
 * Network node interface
 */
export interface NetworkNode extends Lifecycle {
  /**
   * Node identifier
   */
  readonly nodeId: NodeID;
  
  /**
   * Node public key
   */
  readonly publicKey: Uint8Array;
  
  /**
   * Connect to the network
   */
  connect(): void;
  
  /**
   * Disconnect from the network
   */
  disconnect(): void;
  
  /**
   * Send a message
   * @param message Message to send
   */
  send(message: NetworkMessage): void;
  
  /**
   * Broadcast a message to all peers
   * @param message Message to broadcast
   */
  broadcast(message: NetworkMessage): void;
  
  /**
   * Get connected peers
   */
  getPeers(): NodeID[];
  
  /**
   * Get node statistics
   */
  getStats(): NodeStats;
}

/**
 * Network event data
 */
export class NetworkEvent {
  constructor(
    public type: string,
    public data: any
  ) {}
}

/**
 * Node statistics
 */
export class NodeStats {
  constructor(
    public messagesReceived: u64,
    public messagesSent: u64,
    public bytesReceived: u64,
    public bytesSent: u64,
    public connectedPeers: i32,
    public uptime: u64
  ) {}
}

// ============================================================================
// Storage and Persistence Interfaces
// ============================================================================

/**
 * Persistable interface for objects that can be saved/loaded
 */
export interface Persistable {
  /**
   * Save the object state
   * @returns Serialized state
   */
  save(): Uint8Array;
  
  /**
   * Load object state
   * @param data Serialized state
   */
  load(data: Uint8Array): void;
  
  /**
   * Get storage key for this object
   */
  getStorageKey(): string;
}

/**
 * Storage provider interface
 */
export interface StorageProvider {
  /**
   * Store data
   * @param key Storage key
   * @param data Data to store
   */
  put(key: string, data: Uint8Array): void;
  
  /**
   * Retrieve data
   * @param key Storage key
   * @returns Stored data or null
   */
  get(key: string): Uint8Array | null;
  
  /**
   * Delete data
   * @param key Storage key
   */
  delete(key: string): void;
  
  /**
   * Check if key exists
   * @param key Storage key
   */
  has(key: string): bool;
  
  /**
   * List all keys with optional prefix
   * @param prefix Key prefix filter
   */
  list(prefix: string): string[];
}

// ============================================================================
// Computation and Task Interfaces
// ============================================================================

/**
 * Computable interface for objects that perform computations
 */
export interface Computable<TInput, TOutput> {
  /**
   * Perform computation
   * @param input Input data
   * @returns Computation result
   */
  compute(input: TInput): TOutput;
  
  /**
   * Estimate computation cost
   * @param input Input data
   * @returns Estimated cost in arbitrary units
   */
  estimateCost(input: TInput): u64;
}

/**
 * Task interface for asynchronous operations
 */
export interface Task<T> {
  /**
   * Task identifier
   */
  readonly id: string;
  
  /**
   * Task status
   */
  readonly status: TaskStatus;
  
  /**
   * Execute the task
   * @returns Task result
   */
  execute(): T;
  
  /**
   * Cancel the task
   */
  cancel(): void;
  
  /**
   * Get task progress (0-100)
   */
  getProgress(): u8;
}

/**
 * Task status enumeration
 */
export enum TaskStatus {
  Pending,
  Running,
  Completed,
  Failed,
  Cancelled
}

// ============================================================================
// Security and Cryptography Interfaces
// ============================================================================

/**
 * Encryptable interface for objects that support encryption
 */
export interface Encryptable {
  /**
   * Encrypt the object
   * @param key Encryption key
   * @returns Encrypted data
   */
  encrypt(key: Uint8Array): Uint8Array;
  
  /**
   * Decrypt data into the object
   * @param data Encrypted data
   * @param key Decryption key
   */
  decrypt(data: Uint8Array, key: Uint8Array): void;
}

/**
 * Signable interface for objects that can be signed
 */
export interface Signable {
  /**
   * Get data to be signed
   */
  getSignableData(): Uint8Array;
  
  /**
   * Set signature
   * @param signature Digital signature
   */
  setSignature(signature: Uint8Array): void;
  
  /**
   * Get signature
   */
  getSignature(): Uint8Array | null;
}

// ============================================================================
// Configuration and Plugin Interfaces
// ============================================================================

/**
 * Configurable interface for objects that accept configuration
 */
export interface Configurable<T> {
  /**
   * Apply configuration
   * @param config Configuration object
   */
  configure(config: T): void;
  
  /**
   * Get current configuration
   */
  getConfiguration(): T;
  
  /**
   * Validate configuration
   * @param config Configuration to validate
   */
  validateConfiguration(config: T): bool;
}

/**
 * Plugin interface for extensible components
 */
export interface Plugin extends Lifecycle {
  /**
   * Plugin identifier
   */
  readonly id: string;
  
  /**
   * Plugin name
   */
  readonly name: string;
  
  /**
   * Plugin version
   */
  readonly version: string;
  
  /**
   * Plugin dependencies
   */
  readonly dependencies: string[];
  
  /**
   * Register plugin functionality
   * @param context Plugin context
   */
  register(context: PluginContext): void;
}

/**
 * Plugin context interface
 */
export interface PluginContext {
  /**
   * Register a service
   * @param name Service name
   * @param service Service instance
   */
  registerService(name: string, service: any): void;
  
  /**
   * Get a service
   * @param name Service name
   */
  getService(name: string): any;
  
  /**
   * Register an event handler
   * @param event Event name
   * @param handler Event handler
   */
  on(event: string, handler: (data: any) => void): void;
  
  /**
   * Emit an event
   * @param event Event name
   * @param data Event data
   */
  emit(event: string, data: any): void;
}

/**
 * Plugin metadata
 */
export class PluginMetadata {
  constructor(
    public id: string,
    public name: string,
    public version: string,
    public description: string,
    public author: string,
    public dependencies: string[],
    public capabilities: string[]
  ) {}
}

/**
 * Plugin capability types
 */
export enum PluginCapability {
  PROTOCOL_HANDLER,
  STORAGE_PROVIDER,
  CRYPTO_PROVIDER,
  NETWORK_TRANSPORT,
  COMPUTATION_ENGINE,
  MONITORING_PROVIDER,
  CUSTOM
}

// ============================================================================
// Factory and Builder Interfaces
// ============================================================================

/**
 * Factory interface for creating objects
 */
export interface Factory<T> {
  /**
   * Create an instance
   * @param params Creation parameters
   */
  create(params: any): T;
  
  /**
   * Check if factory can create the requested type
   * @param type Type identifier
   */
  canCreate(type: string): bool;
}

/**
 * Builder interface for constructing complex objects
 */
export interface Builder<T> {
  /**
   * Build the object
   */
  build(): T;
  
  /**
   * Reset the builder
   */
  reset(): void;
}

// ============================================================================
// Monitoring and Metrics Interfaces
// ============================================================================

/**
 * Monitorable interface for objects that expose metrics
 */
export interface Monitorable {
  /**
   * Get current metrics
   */
  getMetrics(): Map<string, f64>;
  
  /**
   * Reset metrics
   */
  resetMetrics(): void;
  
  /**
   * Enable/disable monitoring
   * @param enabled Whether monitoring is enabled
   */
  setMonitoringEnabled(enabled: bool): void;
}

/**
 * Health check interface
 */
export interface HealthCheckable {
  /**
   * Perform health check
   * @returns Health status
   */
  checkHealth(): HealthStatus;
}

/**
 * Health status
 */
export class HealthStatus {
  constructor(
    public healthy: bool,
    public message: string,
    public details: Map<string, string> = new Map()
  ) {}
}