/**
 * Type guard functions and improved type definitions
 * Provides runtime type checking and type narrowing
 */

import { Prime, NodeID, Phase } from "../types";

/**
 * Checks if a value is a valid Prime number
 */
export function isPrimeValue(value: any): bool {
  if (typeof value !== "number") return false;
  const num = value as number;
  return num >= 2 && num % 1 === 0; // Check for integer
}

/**
 * Checks if a value is a valid NodeID
 */
export function isNodeID(value: any): bool {
  return typeof value === "string" && value.length > 0;
}

/**
 * Checks if a value is a valid Phase (0 to 2π)
 */
export function isPhase(value: any): bool {
  if (typeof value !== "number") return false;
  const num = value as number;
  return num >= 0 && num < 2 * Math.PI;
}

/**
 * Checks if a value is a valid probability (0 to 1)
 */
export function isProbability(value: any): bool {
  if (typeof value !== "number") return false;
  const num = value as number;
  return num >= 0 && num <= 1;
}

/**
 * Checks if a value is a valid positive number
 */
export function isPositive(value: any): bool {
  if (typeof value !== "number") return false;
  return (value as number) > 0;
}

/**
 * Checks if a value is a valid non-negative number
 */
export function isNonNegative(value: any): bool {
  if (typeof value !== "number") return false;
  return (value as number) >= 0;
}

/**
 * Checks if a value is a valid array of a specific type
 */
export function isArrayOf<T>(value: any, itemGuard: (item: any) => bool): bool {
  if (!Array.isArray(value)) return false;
  const arr = value as Array<any>;
  for (let i = 0; i < arr.length; i++) {
    if (!itemGuard(arr[i])) return false;
  }
  return true;
}

/**
 * Checks if a value is a valid Uint8Array
 */
export function isUint8Array(value: any): bool {
  return value instanceof Uint8Array;
}

/**
 * Checks if a value is a valid Map
 */
export function isMap<K, V>(value: any): bool {
  return value instanceof Map;
}

/**
 * Checks if a value is a valid Set
 */
export function isSet<T>(value: any): bool {
  return value instanceof Set;
}

/**
 * Type for quantum state amplitude
 */
export type Amplitude = f64;

/**
 * Type for entanglement strength
 */
export type EntanglementStrength = f64;

/**
 * Type for coherence value
 */
export type Coherence = f64;

/**
 * Type for timestamp
 */
export type Timestamp = f64;

/**
 * Type for hash value
 */
export type Hash = string;

/**
 * Type for state ID
 */
export type StateID = string;

/**
 * Type for message ID
 */
export type MessageID = string;

/**
 * Type for session ID
 */
export type SessionID = string;

/**
 * Type for route type
 */
export enum RouteType {
  DIRECT,
  MULTI_HOP,
  BROADCAST
}

/**
 * Type for network status
 */
export enum NetworkStatus {
  ACTIVE,
  INACTIVE,
  DEGRADED,
  UNKNOWN
}

/**
 * Type for protocol status
 */
export enum ProtocolStatus {
  INITIALIZED,
  IN_PROGRESS,
  COMPLETED,
  FAILED
}

/**
 * Type for sync method
 */
export enum SyncMethod {
  QUANTUM_TELEPORTATION,
  COHERENCE_BASED,
  HOLOGRAPHIC_PROJECTION,
  RESONANCE_WAVE
}

/**
 * Type for alert severity
 */
export enum AlertSeverity {
  INFO,
  WARNING,
  ERROR,
  CRITICAL
}

/**
 * Interface for objects that can be validated
 */
export interface Validatable {
  /**
   * Validates the object and returns true if valid
   */
  isValid(): bool;
  
  /**
   * Gets validation errors if any
   */
  getValidationErrors(): Array<string>;
}

/**
 * Interface for objects that can be measured
 */
export interface Measurable {
  /**
   * Gets the size or magnitude of the object
   */
  getSize(): f64;
}

/**
 * Interface for objects that can be compared
 */
export interface Comparable<T> {
  /**
   * Compares this object with another
   * Returns negative if this < other, 0 if equal, positive if this > other
   */
  compareTo(other: T): i32;
}

/**
 * Interface for objects that can be cloned
 */
export interface Cloneable<T> {
  /**
   * Creates a deep copy of the object
   */
  clone(): T;
}

/**
 * Interface for objects that can be hashed
 */
export interface Hashable {
  /**
   * Computes a hash of the object
   */
  hash(): Hash;
}

/**
 * Interface for objects that can be reset
 */
export interface Resettable {
  /**
   * Resets the object to its initial state
   */
  reset(): void;
}

/**
 * Type for a range of values
 */
export class Range<T> {
  constructor(
    public min: T,
    public max: T
  ) {}
  
  /**
   * Checks if a value is within the range (inclusive)
   */
  contains(value: T): bool {
    return value >= this.min && value <= this.max;
  }
  
  /**
   * Gets the size of the range (only works for numeric types)
   */
  size(): f64 {
    // Convert to f64 for arithmetic
    return (this.max as f64) - (this.min as f64);
  }
}

/**
 * Type for optional values
 */
export class Optional<T> {
  private value: T | null;
  
  constructor(value: T | null = null) {
    this.value = value;
  }
  
  /**
   * Creates an Optional with a value
   */
  static of<T>(value: T): Optional<T> {
    return new Optional<T>(value);
  }
  
  /**
   * Creates an empty Optional
   */
  static empty<T>(): Optional<T> {
    return new Optional<T>(null);
  }
  
  /**
   * Checks if the Optional has a value
   */
  isPresent(): bool {
    return this.value !== null;
  }
  
  /**
   * Gets the value if present, throws if not
   */
  get(): T {
    if (this.value === null) {
      throw new Error("Optional value is not present");
    }
    return this.value;
  }
  
  /**
   * Gets the value if present, or returns a default
   */
  orElse(defaultValue: T): T {
    return this.value !== null ? this.value : defaultValue;
  }
  
  /**
   * Maps the value if present
   */
  map<U>(mapper: (value: T) => U): Optional<U> {
    if (this.value === null) {
      return Optional.empty<U>();
    }
    return Optional.of(mapper(this.value));
  }
  
  /**
   * Filters the value based on a predicate
   */
  filter(predicate: (value: T) => bool): Optional<T> {
    if (this.value === null || !predicate(this.value)) {
      return Optional.empty<T>();
    }
    return this;
  }
}

/**
 * Type for a pair of values
 */
export class Pair<T, U> {
  constructor(
    public first: T,
    public second: U
  ) {}
  
  /**
   * Creates a new pair with swapped values
   */
  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }
  
  /**
   * Maps both values
   */
  map<V, W>(firstMapper: (value: T) => V, secondMapper: (value: U) => W): Pair<V, W> {
    return new Pair(firstMapper(this.first), secondMapper(this.second));
  }
}

/**
 * Type for a triple of values
 */
export class Triple<T, U, V> {
  constructor(
    public first: T,
    public second: U,
    public third: V
  ) {}
}

/**
 * Utility function to assert a type at runtime
 */
export function assertType<T>(value: any, guard: (value: any) => bool, message: string): T {
  if (!guard(value)) {
    throw new Error(message);
  }
  return value as T;
}

/**
 * Utility function to safely cast a value
 */
export function safeCast<T>(value: any, guard: (value: any) => bool, defaultValue: T): T {
  return guard(value) ? value as T : defaultValue;
}

/**
 * Type for a lazy-evaluated value
 */
export class Lazy<T> {
  private value: T | null = null;
  private computed: bool = false;
  
  constructor(
    private supplier: () => T
  ) {}
  
  /**
   * Gets the value, computing it if necessary
   */
  get(): T {
    if (!this.computed) {
      this.value = this.supplier();
      this.computed = true;
    }
    return this.value!;
  }
  
  /**
   * Checks if the value has been computed
   */
  isComputed(): bool {
    return this.computed;
  }
  
  /**
   * Resets the lazy value
   */
  reset(): void {
    this.value = null;
    this.computed = false;
  }
}