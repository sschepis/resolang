/**
 * Core interfaces for the Prime Resonance Network
 * Provides common interfaces and base classes for standardization
 */

import { JSONBuilder, escapeJSON, toFixed } from "./serialization";

/**
 * Interface for objects that can be serialized to string representation
 * All classes implementing this interface must provide a toString() method
 */
export interface Serializable {
  /**
   * Convert the object to a string representation
   * @returns String representation of the object
   */
  toString(): string;
}

/**
 * Interface for objects that can be serialized to JSON
 * Extends Serializable to ensure toString() is available
 */
export interface JSONSerializable extends Serializable {
  /**
   * Convert the object to a JSON string
   * @returns JSON string representation of the object
   */
  toJSON(): string;
}

/**
 * Interface for objects that can be cloned
 */
export interface Cloneable<T> {
  /**
   * Create a deep copy of the object
   * @returns A new instance with the same values
   */
  clone(): T;
}

/**
 * Interface for objects that can be compared for equality
 */
export interface Equatable<T> {
  /**
   * Check if this object is equal to another
   * @param other The object to compare with
   * @returns true if objects are equal, false otherwise
   */
  equals(other: T): boolean;
}

/**
 * Interface for objects that can be hashed
 */
export interface Hashable {
  /**
   * Generate a hash code for the object
   * @returns Hash code as a number
   */
  hashCode(): u32;
}

/**
 * Base abstract class for serializable objects
 * Provides default implementations for common functionality
 */
export abstract class BaseSerializable implements Serializable {
  /**
   * Default toString implementation
   * Subclasses should override this method
   */
  abstract toString(): string;
  
  /**
   * Helper method to format numbers with fixed decimal places
   * @param value The number to format
   * @param decimals Number of decimal places
   * @returns Formatted string
   */
  protected toFixed(value: f64, decimals: i32): string {
    return toFixed(value, decimals);
  }
  
  /**
   * Helper method to escape strings for JSON
   * @param str The string to escape
   * @returns Escaped string
   */
  protected escapeJSON(str: string): string {
    return escapeJSON(str);
  }
  
  /**
   * Helper method to create a JSON builder
   * @returns A new JSONBuilder instance
   */
  protected createJSONBuilder(): JSONBuilder {
    return new JSONBuilder();
  }
}

/**
 * Interface for protocol messages
 * All protocol messages should implement this interface
 */
export interface ProtocolMessage extends Serializable {
  /**
   * Get the message type identifier
   */
  getType(): string;
  
  /**
   * Get the timestamp when the message was created
   */
  getTimestamp(): f64;
  
  /**
   * Validate the message
   * @returns true if message is valid, false otherwise
   */
  validate(): boolean;
}

/**
 * Base class for protocol messages
 */
export abstract class BaseProtocolMessage extends BaseSerializable implements ProtocolMessage {
  protected timestamp: f64;
  
  constructor() {
    super();
    this.timestamp = Date.now();
  }
  
  abstract getType(): string;
  
  getTimestamp(): f64 {
    return this.timestamp;
  }
  
  /**
   * Default validation - can be overridden by subclasses
   */
  validate(): boolean {
    return this.timestamp > 0;
  }
}

/**
 * Interface for objects that can be validated
 */
export interface Validatable {
  /**
   * Check if the object is in a valid state
   * @returns true if valid, false otherwise
   */
  isValid(): boolean;
  
  /**
   * Get validation errors if any
   * @returns Array of error messages, empty if valid
   */
  getValidationErrors(): string[];
}

/**
 * Interface for objects with lifecycle management
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
  isInitialized(): boolean;
  
  /**
   * Check if the object is disposed
   */
  isDisposed(): boolean;
}

/**
 * Base class for node-to-node protocol messages
 * Provides common fields and functionality for messages between nodes
 */
export abstract class NodeProtocolMessage extends BaseProtocolMessage {
  protected sourceId: string;
  protected targetId: string;
  protected messageType: i32;
  
  constructor(messageType: i32, sourceId: string, targetId: string) {
    super();
    this.messageType = messageType;
    this.sourceId = sourceId;
    this.targetId = targetId;
  }
  
  getSourceId(): string {
    return this.sourceId;
  }
  
  getTargetId(): string {
    return this.targetId;
  }
  
  /**
   * Validate node IDs
   */
  validate(): boolean {
    return super.validate() &&
           this.sourceId.length > 0 &&
           this.targetId.length > 0;
  }
  
  /**
   * Helper for serializing node fields
   */
  protected serializeNodeFields(): string {
    return `"sourceId":"${this.escapeJSON(this.sourceId)}","targetId":"${this.escapeJSON(this.targetId)}"`;
  }
}

/**
 * Base class for state-related protocol messages
 * Provides common fields for messages dealing with state synchronization
 */
export abstract class StateProtocolMessage extends BaseProtocolMessage {
  protected nodeId: string;
  protected stateHash: string;
  protected messageType: i32;
  
  constructor(messageType: i32, nodeId: string, stateHash: string) {
    super();
    this.messageType = messageType;
    this.nodeId = nodeId;
    this.stateHash = stateHash;
  }
  
  getNodeId(): string {
    return this.nodeId;
  }
  
  getStateHash(): string {
    return this.stateHash;
  }
  
  /**
   * Validate state hash
   */
  validate(): boolean {
    return super.validate() &&
           this.nodeId.length > 0 &&
           this.stateHash.length > 0;
  }
  
  /**
   * Helper for serializing state fields
   */
  protected serializeStateFields(): string {
    return `"nodeId":"${this.escapeJSON(this.nodeId)}","stateHash":"${this.escapeJSON(this.stateHash)}"`;
  }
}

/**
 * Base class for messages with signatures
 * Provides signature functionality for secure message exchange
 */
export abstract class SignedProtocolMessage extends BaseProtocolMessage {
  protected signature: string;
  
  constructor() {
    super();
    this.signature = "";
  }
  
  /**
   * Get the signature
   */
  getSignature(): string {
    return this.signature;
  }
  
  /**
   * Set the signature
   */
  setSignature(signature: string): void {
    this.signature = signature;
  }
  
  /**
   * Check if message is signed
   */
  isSigned(): boolean {
    return this.signature.length > 0;
  }
  
  /**
   * Get the data to be signed (excluding the signature itself)
   * Subclasses should implement this to return the canonical representation
   */
  abstract getSignableData(): string;
  
  /**
   * Validate including signature check
   */
  validate(): boolean {
    return super.validate();
  }
}

/**
 * Base class for protocol messages with payloads
 * Provides common functionality for messages carrying data
 */
export abstract class PayloadProtocolMessage extends BaseProtocolMessage {
  protected payload: string;
  protected messageType: i32;
  
  constructor(messageType: i32, payload: string = "") {
    super();
    this.messageType = messageType;
    this.payload = payload;
  }
  
  getPayload(): string {
    return this.payload;
  }
  
  setPayload(payload: string): void {
    this.payload = payload;
  }
  
  /**
   * Helper for serializing payload
   */
  protected serializePayload(): string {
    return `"payload":"${this.escapeJSON(this.payload)}"`;
  }
}

/**
 * Interface for observable objects (Observer pattern)
 */
export interface Observable<T> {
  /**
   * Subscribe to changes
   * @param observer The observer function
   * @returns Unsubscribe function
   */
  subscribe(observer: (value: T) => void): () => void;
  
  /**
   * Notify all observers of a change
   * @param value The new value
   */
  notify(value: T): void;
}

/**
 * Interface for configuration objects
 */
export interface Configurable<T> {
  /**
   * Get the current configuration
   */
  getConfig(): T;
  
  /**
   * Update the configuration
   * @param config New configuration
   */
  setConfig(config: T): void;
  
  /**
   * Reset to default configuration
   */
  resetConfig(): void;
}