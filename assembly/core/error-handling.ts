/**
 * Unified Error Handling System for the Prime Resonance Network
 * 
 * This module provides a comprehensive error management framework with:
 * - Standardized error codes and messages
 * - Error recovery strategies
 * - Retry mechanisms
 * - Error context and tracing
 */

// ============================================================================
// Error Code Definitions
// ============================================================================

/**
 * Error categories for classification
 */
export enum ErrorCategory {
  // System errors (1xxx)
  SYSTEM = 1000,
  SYSTEM_INITIALIZATION = 1001,
  SYSTEM_RESOURCE = 1002,
  SYSTEM_MEMORY = 1003,
  SYSTEM_TIMEOUT = 1004,
  
  // Network errors (2xxx)
  NETWORK = 2000,
  NETWORK_CONNECTION = 2001,
  NETWORK_TIMEOUT = 2002,
  NETWORK_PROTOCOL = 2003,
  NETWORK_PEER = 2004,
  
  // Validation errors (3xxx)
  VALIDATION = 3000,
  VALIDATION_REQUIRED = 3001,
  VALIDATION_FORMAT = 3002,
  VALIDATION_RANGE = 3003,
  VALIDATION_TYPE = 3004,
  
  // Cryptographic errors (4xxx)
  CRYPTO = 4000,
  CRYPTO_SIGNATURE = 4001,
  CRYPTO_ENCRYPTION = 4002,
  CRYPTO_KEY = 4003,
  CRYPTO_HASH = 4004,
  
  // Storage errors (5xxx)
  STORAGE = 5000,
  STORAGE_NOT_FOUND = 5001,
  STORAGE_CORRUPT = 5002,
  STORAGE_FULL = 5003,
  STORAGE_PERMISSION = 5004,
  
  // Protocol errors (6xxx)
  PROTOCOL = 6000,
  PROTOCOL_VERSION = 6001,
  PROTOCOL_MESSAGE = 6002,
  PROTOCOL_STATE = 6003,
  PROTOCOL_CONSENSUS = 6004,
  
  // Application errors (7xxx)
  APPLICATION = 7000,
  APPLICATION_STATE = 7001,
  APPLICATION_LOGIC = 7002,
  APPLICATION_CONFIG = 7003,
  APPLICATION_PLUGIN = 7004
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  DEBUG,      // Development information
  INFO,       // Informational messages
  WARNING,    // Warning conditions
  ERROR,      // Error conditions
  CRITICAL,   // Critical conditions requiring immediate attention
  FATAL       // System is unusable
}

// ============================================================================
// Core Error Classes
// ============================================================================

/**
 * Base error class with enhanced context
 */
export class PRNError extends Error {
  readonly code: ErrorCategory;
  readonly severity: ErrorSeverity;
  readonly timestamp: u64;
  readonly context: Map<string, string>;
  readonly cause: Error | null;
  
  constructor(
    message: string,
    code: ErrorCategory = ErrorCategory.APPLICATION,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    cause: Error | null = null
  ) {
    super(message);
    this.name = "PRNError";
    this.code = code;
    this.severity = severity;
    this.timestamp = Date.now();
    this.context = new Map<string, string>();
    this.cause = cause;
  }
  
  /**
   * Add context information
   */
  addContext(key: string, value: string): PRNError {
    this.context.set(key, value);
    return this;
  }
  
  /**
   * Get full error details
   */
  getDetails(): ErrorDetails {
    return new ErrorDetails(
      this.name,
      this.message,
      this.code,
      this.severity,
      this.timestamp,
      this.context,
      this.cause ? this.cause.message : null,
      this.stack || ""
    );
  }
  
  /**
   * Convert to JSON
   */
  toJSON(): string {
    const details = this.getDetails();
    return details.toJSON();
  }
}

/**
 * Error details structure
 */
export class ErrorDetails {
  constructor(
    public name: string,
    public message: string,
    public code: ErrorCategory,
    public severity: ErrorSeverity,
    public timestamp: u64,
    public context: Map<string, string>,
    public cause: string | null,
    public stack: string
  ) {}
  
  toJSON(): string {
    let json = `{"name":"${this.name}","message":"${this.message}","code":${this.code},"severity":${this.severity},"timestamp":${this.timestamp}`;
    
    if (this.context.size > 0) {
      json += ',"context":{';
      const entries: string[] = [];
      const keys = this.context.keys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = this.context.get(key);
        entries.push(`"${key}":"${value}"`);
      }
      json += entries.join(",") + "}";
    }
    
    if (this.cause) {
      json += `,"cause":"${this.cause}"`;
    }
    
    // Simple string escaping for AssemblyScript
    let escapedStack = "";
    for (let i = 0; i < this.stack.length; i++) {
      const char = this.stack.charAt(i);
      if (char === '"') {
        escapedStack += '\\"';
      } else if (char === '\n') {
        escapedStack += '\\n';
      } else {
        escapedStack += char;
      }
    }
    
    json += `,"stack":"${escapedStack}"}`;
    return json;
  }
}

// ============================================================================
// Specialized Error Classes
// ============================================================================

/**
 * Network-related errors
 */
export class NetworkError extends PRNError {
  constructor(
    message: string,
    code: ErrorCategory = ErrorCategory.NETWORK,
    cause: Error | null = null
  ) {
    super(message, code, ErrorSeverity.ERROR, cause);
    this.name = "NetworkError";
  }
}

/**
 * Validation errors
 */
export class ValidationError extends PRNError {
  readonly field: string | null;
  readonly value: string | null;
  
  constructor(
    message: string,
    field: string | null = null,
    value: string | null = null
  ) {
    super(message, ErrorCategory.VALIDATION, ErrorSeverity.WARNING);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
    
    if (field) this.addContext("field", field);
    if (value) this.addContext("value", value);
  }
}

/**
 * Cryptographic errors
 */
export class CryptoError extends PRNError {
  constructor(
    message: string,
    code: ErrorCategory = ErrorCategory.CRYPTO,
    cause: Error | null = null
  ) {
    super(message, code, ErrorSeverity.ERROR, cause);
    this.name = "CryptoError";
  }
}

/**
 * Storage errors
 */
export class StorageError extends PRNError {
  readonly key: string | null;
  
  constructor(
    message: string,
    key: string | null = null,
    code: ErrorCategory = ErrorCategory.STORAGE
  ) {
    super(message, code, ErrorSeverity.ERROR);
    this.name = "StorageError";
    this.key = key;
    
    if (key) this.addContext("key", key);
  }
}

/**
 * Protocol errors
 */
export class ProtocolError extends PRNError {
  readonly protocolId: string | null;
  readonly messageType: string | null;
  
  constructor(
    message: string,
    protocolId: string | null = null,
    messageType: string | null = null
  ) {
    super(message, ErrorCategory.PROTOCOL, ErrorSeverity.ERROR);
    this.name = "ProtocolError";
    this.protocolId = protocolId;
    this.messageType = messageType;
    
    if (protocolId) this.addContext("protocolId", protocolId);
    if (messageType) this.addContext("messageType", messageType);
  }
}

// ============================================================================
// Error Recovery Strategies
// ============================================================================

/**
 * Recovery strategy interface
 */
export interface RecoveryStrategy {
  /**
   * Attempt to recover from an error
   * @returns true if recovery was successful
   */
  recover(error: PRNError): bool;
  
  /**
   * Check if this strategy can handle the error
   */
  canHandle(error: PRNError): bool;
}

/**
 * Retry strategy with exponential backoff
 */
export class RetryStrategy implements RecoveryStrategy {
  private attempts: Map<string, i32> = new Map();
  
  constructor(
    private maxAttempts: i32 = 3,
    private baseDelay: i32 = 1000,
    private maxDelay: i32 = 30000
  ) {}
  
  canHandle(error: PRNError): bool {
    // Can retry network and timeout errors
    return error.code === ErrorCategory.NETWORK ||
           error.code === ErrorCategory.NETWORK_TIMEOUT ||
           error.code === ErrorCategory.SYSTEM_TIMEOUT;
  }
  
  recover(error: PRNError): bool {
    const errorKey = `${error.code}:${error.message}`;
    const currentAttempts = this.attempts.get(errorKey) || 0;
    
    if (currentAttempts >= this.maxAttempts) {
      this.attempts.delete(errorKey);
      return false;
    }
    
    this.attempts.set(errorKey, currentAttempts + 1);
    
    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.baseDelay * Math.pow(2, currentAttempts),
      this.maxDelay
    ) as i32;
    
    // In a real implementation, this would schedule a retry
    // For now, we just return true to indicate retry should be attempted
    return true;
  }
  
  reset(): void {
    this.attempts.clear();
  }
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreakerStrategy implements RecoveryStrategy {
  private failures: Map<string, i32> = new Map();
  private lastFailureTime: Map<string, u64> = new Map();
  private circuitOpen: Map<string, bool> = new Map();
  
  constructor(
    private threshold: i32 = 5,
    private timeout: u64 = 60000, // 1 minute
    private halfOpenAttempts: i32 = 1
  ) {}
  
  canHandle(error: PRNError): bool {
    return error.severity >= ErrorSeverity.ERROR;
  }
  
  recover(error: PRNError): bool {
    const key = this.getCircuitKey(error);
    const now = Date.now();
    
    // Check if circuit is open
    if (this.circuitOpen.get(key)) {
      const lastFailure = this.lastFailureTime.get(key) || 0;
      if (now - lastFailure < this.timeout) {
        return false; // Circuit still open
      }
      // Try half-open state
      this.circuitOpen.set(key, false);
    }
    
    // Record failure
    const failures = (this.failures.get(key) || 0) + 1;
    this.failures.set(key, failures);
    this.lastFailureTime.set(key, now);
    
    // Check if we should open the circuit
    if (failures >= this.threshold) {
      this.circuitOpen.set(key, true);
      return false;
    }
    
    return true;
  }
  
  private getCircuitKey(error: PRNError): string {
    return `${error.code}:${error.name}`;
  }
  
  reset(key: string | null = null): void {
    if (key) {
      this.failures.delete(key);
      this.lastFailureTime.delete(key);
      this.circuitOpen.delete(key);
    } else {
      this.failures.clear();
      this.lastFailureTime.clear();
      this.circuitOpen.clear();
    }
  }
}

/**
 * Fallback strategy for graceful degradation
 */
export class FallbackStrategy implements RecoveryStrategy {
  constructor(
    private fallbackHandlers: Map<ErrorCategory, () => void>
  ) {}
  
  canHandle(error: PRNError): bool {
    return this.fallbackHandlers.has(error.code);
  }
  
  recover(error: PRNError): bool {
    const handler = this.fallbackHandlers.get(error.code);
    if (handler) {
      try {
        handler();
        return true;
      } catch (e) {
        // Fallback failed
        return false;
      }
    }
    return false;
  }
}

// ============================================================================
// Error Manager
// ============================================================================

/**
 * Central error management system
 */
export class ErrorManager {
  private static instance: ErrorManager | null = null;
  private handlers: Array<ErrorHandler> = [];
  private strategies: Array<RecoveryStrategy> = [];
  private errorLog: Array<ErrorDetails> = [];
  private maxLogSize: i32 = 1000;

  // Public method to clear strategies for testing
  clearStrategies(): void {
    this.strategies = [];
  }
  
  private constructor() {
    // Initialize default strategies
    this.strategies.push(new RetryStrategy());
    this.strategies.push(new CircuitBreakerStrategy());
  }
  
  static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }
  
  /**
   * Register an error handler
   */
  registerHandler(handler: ErrorHandler): void {
    this.handlers.push(handler);
  }
  
  /**
   * Register a recovery strategy
   */
  registerStrategy(strategy: RecoveryStrategy): void {
    this.strategies.push(strategy);
  }
  
  /**
   * Handle an error
   */
  handleError(error: PRNError): bool {
    // Log the error
    this.logError(error);
    
    // Notify handlers
    for (let i = 0; i < this.handlers.length; i++) {
      this.handlers[i].handle(error);
    }
    
    // Try recovery strategies
    for (let i = 0; i < this.strategies.length; i++) {
      const strategy = this.strategies[i];
      if (strategy.canHandle(error) && strategy.recover(error)) {
        return true; // Recovery successful
      }
    }
    
    return false; // Recovery failed
  }
  
  /**
   * Log an error
   */
  private logError(error: PRNError): void {
    this.errorLog.push(error.getDetails());
    
    // Maintain log size limit
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }
  
  /**
   * Get error statistics
   */
  getStatistics(): ErrorStatistics {
    const stats = new ErrorStatistics();
    
    for (let i = 0; i < this.errorLog.length; i++) {
      const error = this.errorLog[i];
      stats.recordError(error);
    }
    
    return stats;
  }
  
  /**
   * Clear error log
   */
  clearLog(): void {
    this.errorLog = [];
  }
}

/**
 * Error handler interface
 */
export interface ErrorHandler {
  handle(error: PRNError): void;
}

/**
 * Console error handler
 */
export class ConsoleErrorHandler implements ErrorHandler {
  handle(error: PRNError): void {
    const details = error.getDetails();
    const severityName = this.getSeverityName(details.severity);
    console.error(`[${severityName}] ${details.name}: ${details.message}`);
    
    if (details.context.size > 0) {
      console.error("Context: " + details.toJSON());
    }
    
    if (details.stack) {
      console.error("Stack trace: " + details.stack);
    }
  }
  
  private getSeverityName(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.DEBUG: return "DEBUG";
      case ErrorSeverity.INFO: return "INFO";
      case ErrorSeverity.WARNING: return "WARNING";
      case ErrorSeverity.ERROR: return "ERROR";
      case ErrorSeverity.CRITICAL: return "CRITICAL";
      case ErrorSeverity.FATAL: return "FATAL";
      default: return "UNKNOWN";
    }
  }
}

/**
 * Error statistics
 */
export class ErrorStatistics {
  totalErrors: i32 = 0;
  errorsByCategory: Map<ErrorCategory, i32> = new Map();
  errorsBySeverity: Map<ErrorSeverity, i32> = new Map();
  recentErrors: Array<ErrorDetails> = [];
  
  recordError(error: ErrorDetails): void {
    this.totalErrors++;
    
    // Count by category
    const categoryCount = this.errorsByCategory.get(error.code) || 0;
    this.errorsByCategory.set(error.code, categoryCount + 1);
    
    // Count by severity
    const severityCount = this.errorsBySeverity.get(error.severity) || 0;
    this.errorsBySeverity.set(error.severity, severityCount + 1);
    
    // Keep recent errors
    this.recentErrors.push(error);
    if (this.recentErrors.length > 10) {
      this.recentErrors.shift();
    }
  }
  
  toJSON(): string {
    return `{"totalErrors":${this.totalErrors},"criticalErrors":${this.errorsBySeverity.get(ErrorSeverity.CRITICAL) || 0}}`;
  }
}

// ============================================================================
// Error Utilities
// ============================================================================

/**
 * Create a standardized error message
 */
export function createErrorMessage(
  template: string,
  params: Map<string, string>
): string {
  let message = template;
  const keys = params.keys();
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = params.get(key);
    message = message.replace(`{${key}}`, value);
  }
  
  return message;
}

/**
 * Wrap a function with error handling
 */
export function withErrorHandling<T>(
  fn: () => T,
  errorCode: ErrorCategory = ErrorCategory.APPLICATION
): T | null {
  try {
    return fn();
  } catch (e) {
    // In AssemblyScript, we need to handle the error type carefully
    let message = "Unknown error";
    if (e instanceof Error) {
      message = e.message;
    }
    const error = new PRNError(message, errorCode);
    ErrorManager.getInstance().handleError(error);
    return null;
  }
}

/**
 * Assert a condition or throw an error
 */
export function assert(
  condition: bool,
  message: string,
  code: ErrorCategory = ErrorCategory.APPLICATION
): void {
  if (!condition) {
    throw new PRNError(message, code);
  }
}

/**
 * Validate and throw if invalid
 */
export function validate(
  value: any,
  validator: (value: any) => bool,
  field: string,
  message: string
): void {
  if (!validator(value)) {
    throw new ValidationError(message, field, value ? value.toString() : "null");
  }
}

// ============================================================================
// Standard Error Messages
// ============================================================================

export class ErrorMessages {
  // System errors
  static readonly SYSTEM_NOT_INITIALIZED: string = "System not initialized";
  static readonly SYSTEM_ALREADY_INITIALIZED: string = "System already initialized";
  static readonly SYSTEM_OUT_OF_MEMORY: string = "Out of memory";
  static readonly SYSTEM_TIMEOUT: string = "Operation timed out";
  
  // Network errors
  static readonly NETWORK_CONNECTION_FAILED: string = "Failed to establish connection to {host}";
  static readonly NETWORK_PEER_UNREACHABLE: string = "Peer {peerId} is unreachable";
  static readonly NETWORK_PROTOCOL_MISMATCH: string = "Protocol version mismatch: expected {expected}, got {actual}";
  
  // Validation errors
  static readonly VALIDATION_REQUIRED_FIELD: string = "Field '{field}' is required";
  static readonly VALIDATION_INVALID_FORMAT: string = "Field '{field}' has invalid format: {format}";
  static readonly VALIDATION_OUT_OF_RANGE: string = "Value {value} is out of range [{min}, {max}]";
  
  // Crypto errors
  static readonly CRYPTO_INVALID_SIGNATURE: string = "Invalid signature for message {messageId}";
  static readonly CRYPTO_KEY_NOT_FOUND: string = "Cryptographic key not found: {keyId}";
  static readonly CRYPTO_ENCRYPTION_FAILED: string = "Encryption failed: {reason}";
  
  // Storage errors
  static readonly STORAGE_KEY_NOT_FOUND: string = "Key not found: {key}";
  static readonly STORAGE_CORRUPT_DATA: string = "Corrupt data at key: {key}";
  static readonly STORAGE_QUOTA_EXCEEDED: string = "Storage quota exceeded";
}