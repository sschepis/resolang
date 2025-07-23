/**
 * Base Class Implementations for the Prime Resonance Network
 * 
 * This module provides abstract base classes that implement common
 * functionality for the core interfaces.
 */

import {
  Serializable,
  Validatable,
  Lifecycle,
  Observable,
  NetworkMessage,
  NetworkNode,
  NetworkEvent,
  NodeStats,
  Persistable,
  Monitorable,
  HealthCheckable,
  HealthStatus,
  Plugin,
  PluginContext
} from './base-interfaces';
import { NodeID } from '../types';
import { JSONBuilder } from './serialization';
import { sha256 } from './crypto';

// ============================================================================
// Base Serializable Implementation
// ============================================================================

/**
 * Abstract base class for serializable objects
 */
export abstract class BaseSerializable implements Serializable {
  /**
   * Convert to JSON string using JSONBuilder
   */
  toJSON(): string {
    const builder = new JSONBuilder();
    this.buildJSON(builder);
    return builder.build();
  }
  
  /**
   * Convert to plain object
   */
  toObject(): any {
    // Default implementation - subclasses should override
    // AssemblyScript doesn't have JSON.parse, so this is a placeholder
    throw new Error("toObject() must be implemented by subclass");
  }
  
  /**
   * Abstract method for subclasses to implement JSON building
   */
  protected abstract buildJSON(builder: JSONBuilder): void;
}

// ============================================================================
// Base Validatable Implementation
// ============================================================================

/**
 * Abstract base class for validatable objects
 */
export abstract class BaseValidatable implements Validatable {
  protected validationErrors: string[] = [];
  
  /**
   * Validate the object
   */
  validate(): bool {
    this.validationErrors = [];
    this.performValidation();
    return this.validationErrors.length === 0;
  }
  
  /**
   * Get validation errors
   */
  getValidationErrors(): string[] {
    return this.validationErrors.slice(); // Return copy
  }
  
  /**
   * Add validation error
   */
  protected addValidationError(error: string): void {
    this.validationErrors.push(error);
  }
  
  /**
   * Abstract method for subclasses to implement validation logic
   */
  protected abstract performValidation(): void;
}

// ============================================================================
// Base Lifecycle Implementation
// ============================================================================

/**
 * Abstract base class for objects with lifecycle management
 */
export abstract class BaseLifecycle implements Lifecycle {
  private _initialized: bool = false;
  private _disposed: bool = false;
  
  /**
   * Initialize the object
   */
  initialize(): void {
    if (this._initialized) {
      throw new Error("Already initialized");
    }
    if (this._disposed) {
      throw new Error("Cannot initialize disposed object");
    }
    
    this.onInitialize();
    this._initialized = true;
  }
  
  /**
   * Dispose the object
   */
  dispose(): void {
    if (!this._initialized) {
      throw new Error("Cannot dispose uninitialized object");
    }
    if (this._disposed) {
      return; // Already disposed
    }
    
    this.onDispose();
    this._disposed = true;
    this._initialized = false;
  }
  
  /**
   * Check if initialized
   */
  isInitialized(): bool {
    return this._initialized && !this._disposed;
  }
  
  /**
   * Abstract initialization logic
   */
  protected abstract onInitialize(): void;
  
  /**
   * Abstract disposal logic
   */
  protected abstract onDispose(): void;
}

// ============================================================================
// Base Observable Implementation
// ============================================================================

/**
 * Event handler type
 */
type EventHandler<T> = (data: T) => void;

/**
 * Abstract base class for observable objects
 */
export abstract class BaseObservable<T> implements Observable<T> {
  private listeners: Map<string, Array<EventHandler<T>>> = new Map();
  
  /**
   * Subscribe to events
   */
  on(event: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    const handlers = this.listeners.get(event)!;
    handlers.push(handler);
    
    // Return unsubscribe function
    return (): void => {
      const index = handlers.indexOf(handler);
      if (index >= 0) {
        handlers.splice(index, 1);
      }
    };
  }
  
  /**
   * Emit an event
   */
  emit(event: string, data: T): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      // Create a copy to avoid issues if handlers modify the list
      const handlersCopy = handlers.slice();
      for (let i = 0; i < handlersCopy.length; i++) {
        handlersCopy[i](data);
      }
    }
  }
  
  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event: string): void {
    this.listeners.delete(event);
  }
  
  /**
   * Remove all listeners
   */
  protected clearAllListeners(): void {
    this.listeners.clear();
  }
}

// ============================================================================
// Base Network Message Implementation
// ============================================================================

/**
 * Abstract base class for network messages
 */
export abstract class BaseNetworkMessage extends BaseSerializable implements NetworkMessage, Validatable {
  readonly id: string;
  readonly type: string;
  readonly timestamp: u64;
  readonly source: NodeID;
  readonly destination: NodeID | null;
  readonly payload: Uint8Array;
  
  private _signature: Uint8Array | null = null;
  private validationErrors: string[] = [];
  
  constructor(
    type: string,
    source: NodeID,
    payload: Uint8Array,
    destination: NodeID | null = null
  ) {
    super();
    this.id = this.generateId();
    this.type = type;
    this.timestamp = Date.now();
    this.source = source;
    this.destination = destination;
    this.payload = payload;
  }
  
  /**
   * Calculate message hash
   */
  hash(): string {
    const data = this.getHashableData();
    const hashBytes = sha256(data);
    return this.bytesToHex(hashBytes);
  }
  
  /**
   * Sign the message
   */
  sign(privateKey: Uint8Array): void {
    // TODO: Implement actual signing with private key
    // For now, just create a dummy signature
    const hash = this.hash();
    this._signature = Uint8Array.wrap(String.UTF8.encode(hash));
  }
  
  /**
   * Verify message signature
   */
  verify(publicKey: Uint8Array): bool {
    if (!this._signature) return false;
    
    // TODO: Implement actual signature verification
    // For now, just check that signature exists
    return this._signature.length > 0;
  }
  
  /**
   * Validate the message
   */
  validate(): bool {
    this.validationErrors = [];
    
    if (!this.id || this.id.length === 0) {
      this.validationErrors.push("Message ID is required");
    }
    
    if (!this.type || this.type.length === 0) {
      this.validationErrors.push("Message type is required");
    }
    
    if (this.timestamp === 0) {
      this.validationErrors.push("Timestamp is required");
    }
    
    if (!this.source) {
      this.validationErrors.push("Source node ID is required");
    }
    
    if (!this.payload || this.payload.length === 0) {
      this.validationErrors.push("Payload is required");
    }
    
    // Allow subclasses to add additional validation
    this.performAdditionalValidation();
    
    return this.validationErrors.length === 0;
  }
  
  /**
   * Get validation errors
   */
  getValidationErrors(): string[] {
    return this.validationErrors.slice();
  }
  
  /**
   * Build JSON representation
   */
  protected buildJSON(builder: JSONBuilder): void {
    builder
      .addStringField("id", this.id)
      .addStringField("type", this.type)
      .addNumberField("timestamp", this.timestamp)
      .addStringField("source", this.source.toString())
      .addStringField("destination", this.destination ? this.destination.toString() : "null")
      .addStringField("payloadHash", this.hash());
    
    if (this._signature) {
      builder.addStringField("signature", this.bytesToHex(this._signature));
    }
  }
  
  /**
   * Generate unique message ID
   */
  private generateId(): string {
    // Simple ID generation - can be improved
    return `${this.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get data for hashing
   */
  private getHashableData(): Uint8Array {
    const parts: string[] = [
      this.id,
      this.type,
      this.timestamp.toString(),
      this.source.toString(),
      this.destination ? this.destination.toString() : "",
      this.bytesToHex(this.payload)
    ];
    
    return Uint8Array.wrap(String.UTF8.encode(parts.join("|")));
  }
  
  /**
   * Convert bytes to hex string
   */
  private bytesToHex(bytes: Uint8Array): string {
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      hex += ((byte >> 4) & 0xF).toString(16);
      hex += (byte & 0xF).toString(16);
    }
    return hex;
  }
  
  /**
   * Hook for additional validation in subclasses
   */
  protected performAdditionalValidation(): void {
    // Subclasses can override
  }
}

// ============================================================================
// Base Network Node Implementation
// ============================================================================

/**
 * Abstract base class for network nodes
 */
export abstract class BaseNetworkNode extends BaseLifecycle implements NetworkNode {
  readonly nodeId: NodeID;
  readonly publicKey: Uint8Array;
  
  private eventHandlers: Map<string, Array<(data: NetworkEvent) => void>> = new Map();
  private stats: NodeStats;
  private startTime: u64 = 0;
  
  constructor(nodeId: NodeID, publicKey: Uint8Array) {
    super();
    this.nodeId = nodeId;
    this.publicKey = publicKey;
    this.stats = new NodeStats(0, 0, 0, 0, 0, 0);
  }
  
  /**
   * Observable implementation
   */
  on(event: string, handler: (data: NetworkEvent) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    
    const handlers = this.eventHandlers.get(event)!;
    handlers.push(handler);
    
    // Return unsubscribe function
    return (): void => {
      const index = handlers.indexOf(handler);
      if (index >= 0) {
        handlers.splice(index, 1);
      }
    };
  }
  
  emit(event: string, data: NetworkEvent): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const handlersCopy = handlers.slice();
      for (let i = 0; i < handlersCopy.length; i++) {
        handlersCopy[i](data);
      }
    }
  }
  
  removeAllListeners(event: string): void {
    this.eventHandlers.delete(event);
  }
  
  /**
   * Get node statistics
   */
  getStats(): NodeStats {
    return new NodeStats(
      this.stats.messagesReceived,
      this.stats.messagesSent,
      this.stats.bytesReceived,
      this.stats.bytesSent,
      this.getPeers().length,
      this.startTime > 0 ? Date.now() - this.startTime : 0
    );
  }
  
  /**
   * Lifecycle hooks
   */
  protected onInitialize(): void {
    this.startTime = Date.now();
    this.connect();
  }
  
  protected onDispose(): void {
    this.disconnect();
    this.eventHandlers.clear();
  }
  
  /**
   * Update statistics when message received
   */
  protected updateReceivedStats(message: NetworkMessage): void {
    this.stats.messagesReceived++;
    this.stats.bytesReceived += u64(message.payload.length);
  }
  
  /**
   * Update statistics when message sent
   */
  protected updateSentStats(message: NetworkMessage): void {
    this.stats.messagesSent++;
    this.stats.bytesSent += u64(message.payload.length);
  }
  
  /**
   * Abstract methods for subclasses
   */
  abstract connect(): void;
  abstract disconnect(): void;
  abstract send(message: NetworkMessage): void;
  abstract broadcast(message: NetworkMessage): void;
  abstract getPeers(): NodeID[];
}

// ============================================================================
// Base Monitorable Implementation
// ============================================================================

/**
 * Abstract base class for monitorable objects
 */
export abstract class BaseMonitorable implements Monitorable {
  protected metrics: Map<string, f64> = new Map();
  protected monitoringEnabled: bool = true;
  
  /**
   * Get current metrics
   */
  getMetrics(): Map<string, f64> {
    if (!this.monitoringEnabled) {
      return new Map();
    }
    
    // Update metrics before returning
    this.updateMetrics();
    
    // Return a copy
    const copy = new Map<string, f64>();
    const keys = this.metrics.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      copy.set(key, this.metrics.get(key));
    }
    return copy;
  }
  
  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics.clear();
    this.initializeMetrics();
  }
  
  /**
   * Enable/disable monitoring
   */
  setMonitoringEnabled(enabled: bool): void {
    this.monitoringEnabled = enabled;
    if (enabled && this.metrics.size === 0) {
      this.initializeMetrics();
    }
  }
  
  /**
   * Record a metric value
   */
  protected recordMetric(name: string, value: f64): void {
    if (this.monitoringEnabled) {
      this.metrics.set(name, value);
    }
  }
  
  /**
   * Increment a metric value
   */
  protected incrementMetric(name: string, delta: f64 = 1.0): void {
    if (this.monitoringEnabled) {
      const current = this.metrics.get(name) || 0.0;
      this.metrics.set(name, current + delta);
    }
  }
  
  /**
   * Abstract methods for subclasses
   */
  protected abstract initializeMetrics(): void;
  protected abstract updateMetrics(): void;
}

// ============================================================================
// Base Health Checkable Implementation
// ============================================================================

/**
 * Abstract base class for health checkable objects
 */
export abstract class BaseHealthCheckable implements HealthCheckable {
  /**
   * Perform health check
   */
  checkHealth(): HealthStatus {
    const checks = new Map<string, bool>();
    const details = new Map<string, string>();
    
    // Perform individual health checks
    this.performHealthChecks(checks, details);
    
    // Determine overall health
    let healthy = true;
    const checkKeys = checks.keys();
    for (let i = 0; i < checkKeys.length; i++) {
      if (!checks.get(checkKeys[i])) {
        healthy = false;
        break;
      }
    }
    
    const message = healthy ? "All health checks passed" : "One or more health checks failed";
    return new HealthStatus(healthy, message, details);
  }
  
  /**
   * Abstract method for subclasses to implement health checks
   */
  protected abstract performHealthChecks(
    checks: Map<string, bool>,
    details: Map<string, string>
  ): void;
}

// ============================================================================
// Composite Base Classes
// ============================================================================

/**
 * Base class combining serialization and validation
 */
export abstract class BaseSerializableValidatable extends BaseSerializable implements Validatable {
  protected validationErrors: string[] = [];
  
  validate(): bool {
    this.validationErrors = [];
    this.performValidation();
    return this.validationErrors.length === 0;
  }
  
  getValidationErrors(): string[] {
    return this.validationErrors.slice();
  }
  
  protected addValidationError(error: string): void {
    this.validationErrors.push(error);
  }
  
  protected abstract performValidation(): void;
}

/**
 * Base protocol message combining multiple interfaces
 */
export abstract class BaseProtocolMessage extends BaseNetworkMessage 
  implements Persistable, Monitorable {
  
  private monitorable: BaseMonitorable;
  
  constructor(
    type: string,
    source: NodeID,
    payload: Uint8Array,
    destination: NodeID | null = null
  ) {
    super(type, source, payload, destination);
    this.monitorable = new MonitorableDelegate();
  }
  
  // Persistable implementation
  save(): Uint8Array {
    return Uint8Array.wrap(String.UTF8.encode(this.toJSON()));
  }
  
  load(data: Uint8Array): void {
    // Subclasses should implement deserialization
    throw new Error("Load not implemented");
  }
  
  getStorageKey(): string {
    return `message:${this.type}:${this.id}`;
  }
  
  // Monitorable delegation
  getMetrics(): Map<string, f64> {
    return this.monitorable.getMetrics();
  }
  
  resetMetrics(): void {
    this.monitorable.resetMetrics();
  }
  
  setMonitoringEnabled(enabled: bool): void {
    this.monitorable.setMonitoringEnabled(enabled);
  }
}

/**
 * Monitorable delegate for composition
 */
class MonitorableDelegate extends BaseMonitorable {
  protected initializeMetrics(): void {
    this.recordMetric("created", Date.now());
    this.recordMetric("accessCount", 0);
  }
  
  protected updateMetrics(): void {
    this.incrementMetric("accessCount");
  }
}

// ============================================================================
// Base Plugin Implementation
// ============================================================================

/**
 * Abstract base class for plugins
 */
export abstract class BasePlugin implements Plugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly dependencies: string[];
  
  private _context: PluginContext | null = null;
  private _registered: bool = false;
  private _initialized: bool = false;
  private _started: bool = false;
  private _disposed: bool = false;
  
  constructor(
    id: string,
    name: string,
    version: string,
    dependencies: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.dependencies = dependencies;
  }
  
  /**
   * Initialize the plugin
   */
  initialize(): void {
    if (this._initialized) return;
    
    if (!this._context) {
      throw new Error("Plugin context not set");
    }
    
    // Perform plugin-specific initialization
    this.onInitialize();
    
    this._initialized = true;
  }
  
  /**
   * Start the plugin
   */
  start(): void {
    if (!this._initialized) {
      throw new Error("Plugin must be initialized before starting");
    }
    
    if (this._started) return;
    
    // Register plugin functionality
    if (!this._registered && this._context) {
      this.register(this._context);
      this._registered = true;
    }
    
    // Perform plugin-specific startup
    this.onStart();
    
    this._started = true;
  }
  
  /**
   * Stop the plugin
   */
  stop(): void {
    if (!this._started) return;
    
    // Perform plugin-specific shutdown
    this.onStop();
    
    this._started = false;
  }
  
  /**
   * Dispose the plugin
   */
  dispose(): void {
    if (this._disposed) return;
    
    if (this._started) {
      this.stop();
    }
    
    // Perform plugin-specific cleanup
    this.onDispose();
    
    this._disposed = true;
    this._initialized = false;
  }
  
  /**
   * Check if initialized
   */
  isInitialized(): bool {
    return this._initialized && !this._disposed;
  }

  /**
   * Check if started
   */
  isStarted(): bool {
    return this._started;
  }

  /**
   * Check if disposed
   */
  isDisposed(): bool {
    return this._disposed;
  }
  
  /**
   * Set plugin context
   */
  setContext(context: PluginContext): void {
    this._context = context;
  }
  
  /**
   * Get plugin context
   */
  protected getContext(): PluginContext {
    if (!this._context) {
      throw new Error("Plugin context not available");
    }
    return this._context;
  }
  
  /**
   * Register plugin functionality
   */
  abstract register(context: PluginContext): void;
  
  /**
   * Plugin-specific initialization
   */
  protected abstract onInitialize(): void;
  
  /**
   * Plugin-specific startup
   */
  protected abstract onStart(): void;
  
  /**
   * Plugin-specific shutdown
   */
  protected abstract onStop(): void;
  
  /**
   * Plugin-specific cleanup
   */
  protected onDispose(): void {
    // Default implementation - subclasses can override
  }
}