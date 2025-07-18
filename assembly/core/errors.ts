/**
 * Custom error classes for the Prime Resonance Network
 * Provides standardized error handling with detailed context
 */

import { NetworkError, ProtocolError } from "./constants";

/**
 * Base error class for all PRN errors
 * Extends the built-in Error class with additional context
 */
export class PRNError extends Error {
  /** Error code for programmatic handling */
  readonly code: i32 = 0;
  
  /** Timestamp when the error occurred */
  readonly timestamp: f64;
  
  /** Additional context data */
  readonly context: Map<string, string>;
  
  constructor(message: string, context: Map<string, string> | null = null) {
    super(message);
    this.timestamp = Date.now();
    this.context = context || new Map<string, string>();
  }
  
  /**
   * Get a formatted error message with context
   */
  getDetailedMessage(): string {
    let details = `[${this.getErrorType()}] ${this.message}`;
    details += ` (Code: ${this.code}, Time: ${this.timestamp})`;
    
    if (this.context.size > 0) {
      details += "\nContext:";
      const keys = this.context.keys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = this.context.get(key);
        details += `\n  ${key}: ${value}`;
      }
    }
    
    return details;
  }
  
  /**
   * Get the error type name
   */
  getErrorType(): string {
    return "PRNError";
  }
  
  /**
   * Convert to JSON representation
   */
  toJSON(): string {
    let json = `{"type":"${this.getErrorType()}","code":${this.code},"message":"${this.escapeJSON(this.message)}","timestamp":${this.timestamp}`;
    
    if (this.context.size > 0) {
      json += ',"context":{';
      const keys = this.context.keys();
      for (let i = 0; i < keys.length; i++) {
        if (i > 0) json += ',';
        const key = keys[i];
        const value = this.context.get(key);
        json += `"${this.escapeJSON(key)}":"${this.escapeJSON(value)}"`;
      }
      json += '}';
    }
    
    json += '}';
    return json;
  }
  
  private escapeJSON(str: string): string {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      switch (char) {
        case '"': result += '\\"'; break;
        case '\\': result += '\\\\'; break;
        case '\n': result += '\\n'; break;
        case '\r': result += '\\r'; break;
        case '\t': result += '\\t'; break;
        default: result += char;
      }
    }
    return result;
  }
}

/**
 * Network-related errors
 */
export class NetworkException extends PRNError {
  readonly code: i32;
  
  constructor(code: NetworkError, message: string, context: Map<string, string> | null = null) {
    super(message, context);
    this.code = code;
  }
  
  getErrorType(): string {
    return "NetworkException";
  }
  
  static nodeNotFound(nodeId: string): NetworkException {
    const context = new Map<string, string>();
    context.set("nodeId", nodeId);
    return new NetworkException(
      NetworkError.NODE_NOT_FOUND,
      `Node not found: ${nodeId}`,
      context
    );
  }
  
  static nodeAlreadyExists(nodeId: string): NetworkException {
    const context = new Map<string, string>();
    context.set("nodeId", nodeId);
    return new NetworkException(
      NetworkError.NODE_ALREADY_EXISTS,
      `Node already exists: ${nodeId}`,
      context
    );
  }
  
  static entanglementFailed(source: string, target: string, reason: string = ""): NetworkException {
    const context = new Map<string, string>();
    context.set("source", source);
    context.set("target", target);
    if (reason) context.set("reason", reason);
    return new NetworkException(
      NetworkError.ENTANGLEMENT_FAILED,
      `Entanglement failed between ${source} and ${target}`,
      context
    );
  }
  
  static lowCoherence(nodeId: string, coherence: f64, threshold: f64): NetworkException {
    const context = new Map<string, string>();
    context.set("nodeId", nodeId);
    context.set("coherence", coherence.toString());
    context.set("threshold", threshold.toString());
    return new NetworkException(
      NetworkError.LOW_COHERENCE,
      `Node ${nodeId} coherence ${coherence} below threshold ${threshold}`,
      context
    );
  }
}

/**
 * Protocol-related errors
 */
export class ProtocolException extends PRNError {
  readonly code: i32;
  
  constructor(code: ProtocolError, message: string, context: Map<string, string> | null = null) {
    super(message, context);
    this.code = code;
  }
  
  getErrorType(): string {
    return "ProtocolException";
  }
  
  static timeout(operation: string, timeoutMs: f64): ProtocolException {
    const context = new Map<string, string>();
    context.set("operation", operation);
    context.set("timeoutMs", timeoutMs.toString());
    return new ProtocolException(
      ProtocolError.TIMEOUT,
      `Operation '${operation}' timed out after ${timeoutMs}ms`,
      context
    );
  }
  
  static invalidMessage(messageType: string, reason: string): ProtocolException {
    const context = new Map<string, string>();
    context.set("messageType", messageType);
    context.set("reason", reason);
    return new ProtocolException(
      ProtocolError.INVALID_MESSAGE,
      `Invalid message of type '${messageType}': ${reason}`,
      context
    );
  }
  
  static notEntangled(source: string, target: string): ProtocolException {
    const context = new Map<string, string>();
    context.set("source", source);
    context.set("target", target);
    return new ProtocolException(
      ProtocolError.NOT_ENTANGLED,
      `Nodes ${source} and ${target} are not entangled`,
      context
    );
  }
  
  static routeNotFound(source: string, destination: string): ProtocolException {
    const context = new Map<string, string>();
    context.set("source", source);
    context.set("destination", destination);
    return new ProtocolException(
      ProtocolError.ROUTE_NOT_FOUND,
      `No route found from ${source} to ${destination}`,
      context
    );
  }
}

/**
 * Cryptographic errors
 */
export class CryptoException extends PRNError {
  readonly code: i32 = 3001; // Custom code range for crypto errors
  
  getErrorType(): string {
    return "CryptoException";
  }
  
  static invalidKeySize(expected: i32, actual: i32): CryptoException {
    const context = new Map<string, string>();
    context.set("expected", expected.toString());
    context.set("actual", actual.toString());
    return new CryptoException(
      `Invalid key size: expected ${expected} bytes, got ${actual} bytes`,
      context
    );
  }
  
  static invalidSignature(reason: string = ""): CryptoException {
    const context = new Map<string, string>();
    if (reason) context.set("reason", reason);
    return new CryptoException(
      "Invalid signature" + (reason ? `: ${reason}` : ""),
      context
    );
  }
  
  static keyDerivationFailed(reason: string): CryptoException {
    const context = new Map<string, string>();
    context.set("reason", reason);
    return new CryptoException(
      `Key derivation failed: ${reason}`,
      context
    );
  }
}

/**
 * Mathematical/computational errors
 */
export class MathException extends PRNError {
  readonly code: i32 = 4001; // Custom code range for math errors
  
  getErrorType(): string {
    return "MathException";
  }
  
  static invalidPrime(value: i64): MathException {
    const context = new Map<string, string>();
    context.set("value", value.toString());
    return new MathException(
      `Invalid prime number: ${value}`,
      context
    );
  }
  
  static noModularInverse(a: i64, m: i64): MathException {
    const context = new Map<string, string>();
    context.set("a", a.toString());
    context.set("m", m.toString());
    return new MathException(
      `No modular inverse exists for ${a} mod ${m}`,
      context
    );
  }
  
  static computationOverflow(operation: string): MathException {
    const context = new Map<string, string>();
    context.set("operation", operation);
    return new MathException(
      `Computation overflow in operation: ${operation}`,
      context
    );
  }
}

/**
 * Configuration errors
 */
export class ConfigException extends PRNError {
  readonly code: i32 = 5001; // Custom code range for config errors
  
  getErrorType(): string {
    return "ConfigException";
  }
  
  static invalidParameter(parameter: string, value: string, reason: string): ConfigException {
    const context = new Map<string, string>();
    context.set("parameter", parameter);
    context.set("value", value);
    context.set("reason", reason);
    return new ConfigException(
      `Invalid configuration parameter '${parameter}': ${reason}`,
      context
    );
  }
  
  static missingRequired(parameter: string): ConfigException {
    const context = new Map<string, string>();
    context.set("parameter", parameter);
    return new ConfigException(
      `Missing required configuration parameter: ${parameter}`,
      context
    );
  }
}

/**
 * State-related errors
 */
export class StateException extends PRNError {
  readonly code: i32 = 6001; // Custom code range for state errors
  
  getErrorType(): string {
    return "StateException";
  }
  
  static invalidState(currentState: string, expectedState: string, operation: string): StateException {
    const context = new Map<string, string>();
    context.set("currentState", currentState);
    context.set("expectedState", expectedState);
    context.set("operation", operation);
    return new StateException(
      `Invalid state for operation '${operation}': expected ${expectedState}, but was ${currentState}`,
      context
    );
  }
  
  static notInitialized(component: string): StateException {
    const context = new Map<string, string>();
    context.set("component", component);
    return new StateException(
      `Component not initialized: ${component}`,
      context
    );
  }
  
  static alreadyDisposed(component: string): StateException {
    const context = new Map<string, string>();
    context.set("component", component);
    return new StateException(
      `Component already disposed: ${component}`,
      context
    );
  }
}

/**
 * Validation errors
 */
export class ValidationException extends PRNError {
  readonly code: i32 = 7001; // Custom code range for validation errors
  
  getErrorType(): string {
    return "ValidationException";
  }
  
  static outOfRange(field: string, value: f64, min: f64, max: f64): ValidationException {
    const context = new Map<string, string>();
    context.set("field", field);
    context.set("value", value.toString());
    context.set("min", min.toString());
    context.set("max", max.toString());
    return new ValidationException(
      `Value ${value} for field '${field}' is out of range [${min}, ${max}]`,
      context
    );
  }
  
  static invalidFormat(field: string, expectedFormat: string, actualValue: string): ValidationException {
    const context = new Map<string, string>();
    context.set("field", field);
    context.set("expectedFormat", expectedFormat);
    context.set("actualValue", actualValue);
    return new ValidationException(
      `Invalid format for field '${field}': expected ${expectedFormat}`,
      context
    );
  }
  
  static failedConstraint(field: string, constraint: string, value: string): ValidationException {
    const context = new Map<string, string>();
    context.set("field", field);
    context.set("constraint", constraint);
    context.set("value", value);
    return new ValidationException(
      `Field '${field}' failed constraint: ${constraint}`,
      context
    );
  }
}

/**
 * Resource-related errors
 */
export class ResourceException extends PRNError {
  readonly code: i32 = 8001; // Custom code range for resource errors
  
  getErrorType(): string {
    return "ResourceException";
  }
  
  static insufficientMemory(required: i32, available: i32): ResourceException {
    const context = new Map<string, string>();
    context.set("required", required.toString());
    context.set("available", available.toString());
    return new ResourceException(
      `Insufficient memory: required ${required} bytes, available ${available} bytes`,
      context
    );
  }
  
  static capacityExceeded(resource: string, current: i32, maximum: i32): ResourceException {
    const context = new Map<string, string>();
    context.set("resource", resource);
    context.set("current", current.toString());
    context.set("maximum", maximum.toString());
    return new ResourceException(
      `Capacity exceeded for resource '${resource}': ${current}/${maximum}`,
      context
    );
  }
}

/**
 * Error handler utility class
 */
export class ErrorHandler {
  private static errorListeners: Array<(error: PRNError) => void> = [];
  
  /**
   * Register an error listener
   */
  static addErrorListener(listener: (error: PRNError) => void): void {
    this.errorListeners.push(listener);
  }
  
  /**
   * Handle an error by notifying all listeners
   */
  static handle(error: PRNError): void {
    // Log the error
    console.error(error.getDetailedMessage());
    
    // Notify listeners
    for (let i = 0; i < this.errorListeners.length; i++) {
      this.errorListeners[i](error);
    }
  }
  
  /**
   * Wrap a function with error handling
   */
  static wrap<T>(fn: () => T, defaultValue: T): T {
    try {
      return fn();
    } catch (e) {
      if (e instanceof PRNError) {
        this.handle(e);
      } else {
        // Wrap unknown errors
        const wrapped = new StateException(
          "Unknown error occurred",
          null
        );
        this.handle(wrapped);
      }
      return defaultValue;
    }
  }
}

/**
 * Result type for operations that can fail
 */
export class Result<T, E extends PRNError> {
  private constructor(
    private readonly value: T | null,
    private readonly error: E | null
  ) {}
  
  static ok<T, E extends PRNError>(value: T): Result<T, E> {
    return new Result<T, E>(value, null);
  }
  
  static err<T, E extends PRNError>(error: E): Result<T, E> {
    return new Result<T, E>(null, error);
  }
  
  isOk(): boolean {
    return this.error === null;
  }
  
  isErr(): boolean {
    return this.error !== null;
  }
  
  unwrap(): T {
    if (this.error !== null) {
      throw this.error;
    }
    return this.value!;
  }
  
  unwrapOr(defaultValue: T): T {
    return this.error === null ? this.value! : defaultValue;
  }
  
  unwrapErr(): E {
    if (this.error === null) {
      throw new StateException("Called unwrapErr on Ok value", null);
    }
    return this.error;
  }
  
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.error !== null) {
      return Result.err<U, E>(this.error);
    }
    return Result.ok<U, E>(fn(this.value!));
  }
  
  mapErr<F extends PRNError>(fn: (error: E) => F): Result<T, F> {
    if (this.error === null) {
      return Result.ok<T, F>(this.value!);
    }
    return Result.err<T, F>(fn(this.error));
  }
}