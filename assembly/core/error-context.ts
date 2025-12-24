/**
 * Enhanced error context and telemetry for the Prime Resonance Network
 * Provides comprehensive error tracking, recovery, and aggregation
 */

import { PRNError, NetworkException, ProtocolException, CryptoException,
         MathException, ConfigException, StateException, ValidationException,
         ResourceException } from "./errors";
import { ProtocolError } from "./constants";

/**
 * Error severity levels for telemetry
 */
export enum ErrorSeverity {
  DEBUG = 0,
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
  CRITICAL = 4,
  FATAL = 5
}

/**
 * Error recovery strategy interface
 */
export interface ErrorRecoveryStrategy {
  /**
   * Attempt to recover from the error
   * Returns true if recovery was successful
   */
  recover(error: PRNError): bool;
  
  /**
   * Check if this strategy can handle the given error
   */
  canHandle(error: PRNError): bool;
}

/**
 * Stack frame information (limited in AssemblyScript)
 */
export class StackFrame {
  constructor(
    public functionName: string,
    public fileName: string,
    public lineNumber: i32,
    public columnNumber: i32
  ) {}
  
  toString(): string {
    return `  at ${this.functionName} (${this.fileName}:${this.lineNumber}:${this.columnNumber})`;
  }
}

/**
 * Enhanced error with stack trace and recovery information
 */
export class EnhancedError extends PRNError {
  readonly code: i32;
  readonly severity: ErrorSeverity;
  readonly stackTrace: Array<StackFrame>;
  recoveryAttempts: i32; // Made mutable for recovery tracking
  readonly originalError: PRNError | null;
  
  constructor(
    error: PRNError,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    stackTrace: Array<StackFrame> = []
  ) {
    const context = new Map<string, string>();
    // Copy original context
    const keys = error.context.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      context.set(key, error.context.get(key));
    }
    
    super(error.message, context);
    this.code = error.code;
    this.severity = severity;
    this.stackTrace = stackTrace;
    this.recoveryAttempts = 0;
    this.originalError = error;
  }
  
  getErrorType(): string {
    return this.originalError ? this.originalError.getErrorType() : "EnhancedError";
  }
  
  /**
   * Get full stack trace as string
   */
  getStackTrace(): string {
    if (this.stackTrace.length === 0) {
      return "  No stack trace available";
    }
    
    let trace = "";
    for (let i = 0; i < this.stackTrace.length; i++) {
      trace += this.stackTrace[i].toString() + "\n";
    }
    return trace;
  }
  
  /**
   * Get complete error report
   */
  getFullReport(): string {
    let report = `[${this.getSeverityString()}] ${this.getDetailedMessage()}\n`;
    report += "Stack Trace:\n";
    report += this.getStackTrace();
    
    if (this.recoveryAttempts > 0) {
      report += `\nRecovery Attempts: ${this.recoveryAttempts}`;
    }
    
    return report;
  }
  
  private getSeverityString(): string {
    switch (this.severity) {
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
 * Error aggregator for batch operations
 */
export class ErrorAggregator {
  private errors: Array<EnhancedError> = [];
  private errorCounts: Map<string, i32> = new Map<string, i32>();
  
  /**
   * Add an error to the aggregator
   */
  add(error: PRNError, severity: ErrorSeverity = ErrorSeverity.ERROR): void {
    const enhanced = error instanceof EnhancedError 
      ? error 
      : new EnhancedError(error, severity);
    
    this.errors.push(enhanced);
    
    // Update error counts by type
    const errorType = enhanced.getErrorType();
    const currentCount = this.errorCounts.has(errorType) 
      ? this.errorCounts.get(errorType) 
      : 0;
    this.errorCounts.set(errorType, currentCount + 1);
  }
  
  /**
   * Check if there are any errors
   */
  hasErrors(): bool {
    return this.errors.length > 0;
  }
  
  /**
   * Get total error count
   */
  getErrorCount(): i32 {
    return this.errors.length;
  }
  
  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): Array<EnhancedError> {
    const result: Array<EnhancedError> = [];
    for (let i = 0; i < this.errors.length; i++) {
      if (this.errors[i].severity === severity) {
        result.push(this.errors[i]);
      }
    }
    return result;
  }
  
  /**
   * Get errors by type
   */
  getErrorsByType(errorType: string): Array<EnhancedError> {
    const result: Array<EnhancedError> = [];
    for (let i = 0; i < this.errors.length; i++) {
      if (this.errors[i].getErrorType() === errorType) {
        result.push(this.errors[i]);
      }
    }
    return result;
  }
  
  /**
   * Get summary report
   */
  getSummary(): string {
    if (this.errors.length === 0) {
      return "No errors recorded";
    }
    
    let summary = `Total Errors: ${this.errors.length}\n`;
    summary += "Error Breakdown:\n";
    
    const types = this.errorCounts.keys();
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const count = this.errorCounts.get(type);
      summary += `  ${type}: ${count}\n`;
    }
    
    // Add severity breakdown
    summary += "\nSeverity Breakdown:\n";
    for (let sev = 0; sev <= 5; sev++) {
      const errors = this.getErrorsBySeverity(sev as ErrorSeverity);
      if (errors.length > 0) {
        summary += `  ${this.getSeverityName(sev as ErrorSeverity)}: ${errors.length}\n`;
      }
    }
    
    return summary;
  }
  
  /**
   * Get detailed report of all errors
   */
  getDetailedReport(): string {
    if (this.errors.length === 0) {
      return "No errors recorded";
    }
    
    let report = this.getSummary() + "\n\nDetailed Errors:\n";
    report += "================\n\n";
    
    for (let i = 0; i < this.errors.length; i++) {
      report += `Error ${i + 1}:\n`;
      report += this.errors[i].getFullReport();
      report += "\n----------------\n\n";
    }
    
    return report;
  }
  
  /**
   * Clear all errors
   */
  clear(): void {
    this.errors = [];
    this.errorCounts.clear();
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
 * Error telemetry collector
 */
export class ErrorTelemetry {
  private static instance: ErrorTelemetry | null = null;
  
  private errorHistory: Array<EnhancedError> = [];
  private maxHistorySize: i32 = 1000;
  private errorMetrics: Map<string, ErrorMetrics> = new Map<string, ErrorMetrics>();
  private listeners: Array<(error: EnhancedError) => void> = [];
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  static getInstance(): ErrorTelemetry {
    if (!this.instance) {
      this.instance = new ErrorTelemetry();
    }
    return this.instance;
  }
  
  /**
   * Record an error
   */
  recordError(error: PRNError, severity: ErrorSeverity = ErrorSeverity.ERROR): void {
    const enhanced = error instanceof EnhancedError 
      ? error 
      : new EnhancedError(error, severity, this.captureStackTrace());
    
    // Add to history
    this.errorHistory.push(enhanced);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
    
    // Update metrics
    this.updateMetrics(enhanced);
    
    // Notify listeners
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](enhanced);
    }
  }
  
  /**
   * Add error listener
   */
  addListener(listener: (error: EnhancedError) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Get error metrics for a specific error type
   */
  getMetrics(errorType: string): ErrorMetrics | null {
    return this.errorMetrics.has(errorType) 
      ? this.errorMetrics.get(errorType) 
      : null;
  }
  
  /**
   * Get all error metrics
   */
  getAllMetrics(): Map<string, ErrorMetrics> {
    return this.errorMetrics;
  }
  
  /**
   * Get recent errors
   */
  getRecentErrors(count: i32 = 10): Array<EnhancedError> {
    const start = Math.max(0, this.errorHistory.length - count) as i32;
    const result: Array<EnhancedError> = [];
    
    for (let i = start; i < this.errorHistory.length; i++) {
      result.push(this.errorHistory[i]);
    }
    
    return result;
  }
  
  /**
   * Clear telemetry data
   */
  clear(): void {
    this.errorHistory = [];
    this.errorMetrics.clear();
  }
  
  private updateMetrics(error: EnhancedError): void {
    const errorType = error.getErrorType();
    
    if (!this.errorMetrics.has(errorType)) {
      this.errorMetrics.set(errorType, new ErrorMetrics(errorType));
    }
    
    const metrics = this.errorMetrics.get(errorType);
    metrics.recordError(error);
  }
  
  private captureStackTrace(): Array<StackFrame> {
    // In AssemblyScript, we have limited stack trace capabilities
    // This is a placeholder that could be enhanced with source maps
    return [
      new StackFrame("unknown", "unknown", 0, 0)
    ];
  }
}

/**
 * Error metrics for telemetry
 */
export class ErrorMetrics {
  public totalCount: i32 = 0;
  public firstOccurrence: f64 = 0;
  public lastOccurrence: f64 = 0;
  public severityCounts: Map<i32, i32> = new Map<i32, i32>();
  
  constructor(public errorType: string) {}
  
  recordError(error: EnhancedError): void {
    this.totalCount++;
    
    const now = Date.now();
    if (this.firstOccurrence === 0) {
      this.firstOccurrence = now;
    }
    this.lastOccurrence = now;
    
    // Update severity counts
    const severityCount = this.severityCounts.has(error.severity) 
      ? this.severityCounts.get(error.severity) 
      : 0;
    this.severityCounts.set(error.severity, severityCount + 1);
  }
  
  getAverageRate(): f64 {
    if (this.totalCount === 0 || this.firstOccurrence === this.lastOccurrence) {
      return 0;
    }
    
    const duration = this.lastOccurrence - this.firstOccurrence;
    return this.totalCount as f64 / duration * 1000 * 60; // errors per minute
  }
}

/**
 * Common error recovery strategies
 */
export namespace RecoveryStrategies {
  /**
   * Retry strategy with exponential backoff
   */
  export class RetryStrategy implements ErrorRecoveryStrategy {
    constructor(
      private maxRetries: i32 = 3,
      private baseDelay: f64 = 1000,
      private maxDelay: f64 = 30000
    ) {}
    
    canHandle(error: PRNError): bool {
      // Can handle network and protocol timeouts
      return error instanceof NetworkException || 
             (error instanceof ProtocolException && error.code === ProtocolError.TIMEOUT);
    }
    
    recover(error: PRNError): bool {
      if (!this.canHandle(error)) return false;
      
      const enhanced = error as EnhancedError;
      if (enhanced.recoveryAttempts >= this.maxRetries) {
        return false;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        this.baseDelay * Math.pow(2, enhanced.recoveryAttempts),
        this.maxDelay
      ) as f64;
      
      // In a real implementation, this would schedule a retry
      // For now, we just increment the counter
      enhanced.recoveryAttempts++;
      
      return true;
    }
  }
  
  /**
   * Fallback strategy for using alternative resources
   */
  export class FallbackStrategy implements ErrorRecoveryStrategy {
    constructor(
      private fallbackHandlers: Map<string, () => bool>
    ) {}
    
    canHandle(error: PRNError): bool {
      return this.fallbackHandlers.has(error.getErrorType());
    }
    
    recover(error: PRNError): bool {
      if (!this.canHandle(error)) return false;
      
      const handler = this.fallbackHandlers.get(error.getErrorType());
      return handler();
    }
  }
  
  /**
   * Circuit breaker strategy
   */
  export class CircuitBreakerStrategy implements ErrorRecoveryStrategy {
    private failureCount: i32 = 0;
    private lastFailureTime: f64 = 0;
    private state: string = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    
    constructor(
      private failureThreshold: i32 = 5,
      private resetTimeout: f64 = 60000 // 1 minute
    ) {}
    
    canHandle(error: PRNError): bool {
      return error instanceof NetworkException || 
             error instanceof ProtocolException;
    }
    
    recover(error: PRNError): bool {
      if (!this.canHandle(error)) return false;
      
      const now = Date.now();
      
      // Check if we should reset the circuit
      if (this.state === "OPEN" && 
          now - this.lastFailureTime > this.resetTimeout) {
        this.state = "HALF_OPEN";
        this.failureCount = 0;
      }
      
      if (this.state === "OPEN") {
        return false; // Circuit is open, reject immediately
      }
      
      // Record failure
      this.failureCount++;
      this.lastFailureTime = now;
      
      // Check if we should open the circuit
      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN";
        return false;
      }
      
      return true;
    }
  }
}

/**
 * Enhanced error handler with recovery and telemetry
 */
export class EnhancedErrorHandler {
  private static recoveryStrategies: Array<ErrorRecoveryStrategy> = [];
  private static telemetry = ErrorTelemetry.getInstance();
  
  /**
   * Add a recovery strategy
   */
  static addRecoveryStrategy(strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.push(strategy);
  }
  
  /**
   * Handle an error with recovery attempts
   */
  static handleWithRecovery(error: PRNError, severity: ErrorSeverity = ErrorSeverity.ERROR): bool {
    // Record in telemetry
    this.telemetry.recordError(error, severity);
    
    // Try recovery strategies
    for (let i = 0; i < this.recoveryStrategies.length; i++) {
      const strategy = this.recoveryStrategies[i];
      if (strategy.canHandle(error) && strategy.recover(error)) {
        return true; // Recovery successful
      }
    }
    
    return false; // Recovery failed
  }
  
  /**
   * Create a context-aware error
   */
  static createContextualError<T extends PRNError>(
    errorClass: { new(...args: any[]): T },
    message: string,
    context: Map<string, string>,
    captureStack: bool = true
  ): EnhancedError {
    const baseError = new errorClass(message, context);
    const stackTrace = captureStack 
      ? this.captureCurrentStack() 
      : [];
    
    return new EnhancedError(baseError, ErrorSeverity.ERROR, stackTrace);
  }
  
  private static captureCurrentStack(): Array<StackFrame> {
    // Placeholder for stack capture
    // In a real implementation, this would use source maps or debug info
    return [
      new StackFrame("handleWithRecovery", "error-context.ts", 0, 0)
    ];
  }
}

// Re-export original error types for convenience
export { NetworkError, ProtocolError } from "./constants";