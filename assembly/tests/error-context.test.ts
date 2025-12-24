/**
 * Tests for enhanced error context and telemetry
 */

import { 
  EnhancedError, ErrorSeverity, ErrorAggregator, ErrorTelemetry,
  EnhancedErrorHandler, RecoveryStrategies, StackFrame
} from "../core/error-context";
import { 
  NetworkException, ProtocolException, CryptoException,
  ValidationException 
} from "../core/errors";
import { NetworkError, ProtocolError } from "../core/constants";

// Test enhanced error creation and reporting
export function testEnhancedError(): void {
  console.log("Testing Enhanced Error...");
  
  // Create a network error
  const networkError = NetworkException.nodeNotFound("test-node-123");
  
  // Create stack trace
  const stackTrace: Array<StackFrame> = [
    new StackFrame("testFunction", "test.ts", 10, 5),
    new StackFrame("main", "index.ts", 50, 3)
  ];
  
  // Enhance the error
  const enhanced = new EnhancedError(networkError, ErrorSeverity.ERROR, stackTrace);
  
  // Test error properties
  assert(enhanced.code === NetworkError.NODE_NOT_FOUND, "Error code should match");
  assert(enhanced.severity === ErrorSeverity.ERROR, "Severity should be ERROR");
  assert(enhanced.getErrorType() === "NetworkException", "Error type should be NetworkException");
  
  // Test stack trace
  const trace = enhanced.getStackTrace();
  assert(trace.includes("testFunction"), "Stack trace should include function name");
  assert(trace.includes("test.ts:10:5"), "Stack trace should include file location");
  
  // Test full report
  const report = enhanced.getFullReport();
  console.log("Full Error Report:");
  console.log(report);
  
  assert(report.includes("[ERROR]"), "Report should include severity");
  assert(report.includes("Node not found"), "Report should include error message");
  assert(report.includes("Stack Trace:"), "Report should include stack trace");
  
  console.log("✓ Enhanced Error tests passed");
}

// Test error aggregation
export function testErrorAggregator(): void {
  console.log("\nTesting Error Aggregator...");
  
  const aggregator = new ErrorAggregator();
  
  // Add various errors
  aggregator.add(NetworkException.nodeNotFound("node1"), ErrorSeverity.ERROR);
  aggregator.add(NetworkException.nodeNotFound("node2"), ErrorSeverity.ERROR);
  aggregator.add(ProtocolException.timeout("sync", 5000), ErrorSeverity.WARNING);
  aggregator.add(CryptoException.invalidKeySize(32, 16), ErrorSeverity.CRITICAL);
  aggregator.add(ValidationException.outOfRange("coherence", 1.5, 0.0, 1.0), ErrorSeverity.ERROR);
  
  // Test counts
  assert(aggregator.hasErrors(), "Aggregator should have errors");
  assert(aggregator.getErrorCount() === 5, "Should have 5 errors");
  
  // Test filtering by severity
  const criticalErrors = aggregator.getErrorsBySeverity(ErrorSeverity.CRITICAL);
  assert(criticalErrors.length === 1, "Should have 1 critical error");
  
  const warningErrors = aggregator.getErrorsBySeverity(ErrorSeverity.WARNING);
  assert(warningErrors.length === 1, "Should have 1 warning");
  
  // Test filtering by type
  const networkErrors = aggregator.getErrorsByType("NetworkException");
  assert(networkErrors.length === 2, "Should have 2 network errors");
  
  // Test summary
  const summary = aggregator.getSummary();
  console.log("\nError Summary:");
  console.log(summary);
  
  assert(summary.includes("Total Errors: 5"), "Summary should show total count");
  assert(summary.includes("NetworkException: 2"), "Summary should show network error count");
  assert(summary.includes("CRITICAL: 1"), "Summary should show critical count");
  
  // Test detailed report
  const detailed = aggregator.getDetailedReport();
  console.log("\nDetailed Report (first 500 chars):");
  console.log(detailed.substring(0, 500) + "...");
  
  assert(detailed.includes("Error 1:"), "Detailed report should include individual errors");
  assert(detailed.includes("Error 5:"), "Detailed report should include all errors");
  
  console.log("✓ Error Aggregator tests passed");
}

// Test error telemetry
export function testErrorTelemetry(): void {
  console.log("\nTesting Error Telemetry...");
  
  const telemetry = ErrorTelemetry.getInstance();
  telemetry.clear(); // Clear any previous data
  
  // Set up listener
  let listenerCalled = false;
  telemetry.addListener((error: EnhancedError): void => {
    listenerCalled = true;
    console.log(`Telemetry listener called for: ${error.getErrorType()}`);
  });
  
  // Record some errors
  telemetry.recordError(NetworkException.nodeNotFound("node1"), ErrorSeverity.ERROR);
  telemetry.recordError(NetworkException.nodeNotFound("node2"), ErrorSeverity.ERROR);
  telemetry.recordError(ProtocolException.timeout("operation", 1000), ErrorSeverity.WARNING);
  
  assert(listenerCalled, "Telemetry listener should be called");
  
  // Test metrics
  const networkMetrics = telemetry.getMetrics("NetworkException");
  assert(networkMetrics !== null, "Should have network metrics");
  assert(networkMetrics!.totalCount === 2, "Should have 2 network errors");
  
  const protocolMetrics = telemetry.getMetrics("ProtocolException");
  assert(protocolMetrics !== null, "Should have protocol metrics");
  assert(protocolMetrics!.totalCount === 1, "Should have 1 protocol error");
  
  // Test recent errors
  const recent = telemetry.getRecentErrors(2);
  assert(recent.length === 2, "Should get 2 recent errors");
  assert(recent[1].getErrorType() === "ProtocolException", "Most recent should be protocol error");
  
  // Test all metrics
  const allMetrics = telemetry.getAllMetrics();
  assert(allMetrics.size === 2, "Should have metrics for 2 error types");
  
  console.log("✓ Error Telemetry tests passed");
}

// Test recovery strategies
export function testRecoveryStrategies(): void {
  console.log("\nTesting Recovery Strategies...");
  
  // Test retry strategy
  const retryStrategy = new RecoveryStrategies.RetryStrategy(3, 100, 1000);
  
  const timeoutError = ProtocolException.timeout("test", 1000);
  assert(retryStrategy.canHandle(timeoutError), "Retry should handle timeout errors");
  
  const cryptoError = CryptoException.invalidKeySize(32, 16);
  assert(!retryStrategy.canHandle(cryptoError), "Retry should not handle crypto errors");
  
  // Test fallback strategy
  let fallbackCalled = false;
  const fallbackHandlers = new Map<string, () => bool>();
  fallbackHandlers.set("NetworkException", (): bool => {
    fallbackCalled = true;
    return true;
  });
  
  const fallbackStrategy = new RecoveryStrategies.FallbackStrategy(fallbackHandlers);
  const networkError = NetworkException.nodeNotFound("test");
  
  assert(fallbackStrategy.canHandle(networkError), "Fallback should handle network errors");
  assert(fallbackStrategy.recover(networkError), "Fallback recovery should succeed");
  assert(fallbackCalled, "Fallback handler should be called");
  
  // Test circuit breaker
  const circuitBreaker = new RecoveryStrategies.CircuitBreakerStrategy(2, 1000);
  
  // Should handle network errors
  assert(circuitBreaker.canHandle(networkError), "Circuit breaker should handle network errors");
  
  // First few failures should allow recovery
  assert(circuitBreaker.recover(networkError), "First recovery should succeed");
  assert(circuitBreaker.recover(networkError), "Second recovery should succeed");
  
  // After threshold, circuit should open
  assert(!circuitBreaker.recover(networkError), "Third recovery should fail (circuit open)");
  
  console.log("✓ Recovery Strategies tests passed");
}

// Test enhanced error handler
export function testEnhancedErrorHandler(): void {
  console.log("\nTesting Enhanced Error Handler...");
  
  // Add recovery strategies
  EnhancedErrorHandler.addRecoveryStrategy(new RecoveryStrategies.RetryStrategy());
  
  let fallbackExecuted = false;
  const fallbackHandlers = new Map<string, () => bool>();
  fallbackHandlers.set("CryptoException", (): bool => {
    fallbackExecuted = true;
    return true;
  });
  EnhancedErrorHandler.addRecoveryStrategy(new RecoveryStrategies.FallbackStrategy(fallbackHandlers));
  
  // Test handling with recovery
  const timeoutError = ProtocolException.timeout("test", 1000);
  const recovered = EnhancedErrorHandler.handleWithRecovery(timeoutError, ErrorSeverity.WARNING);
  assert(recovered, "Timeout error should be recovered");
  
  // Test crypto error with fallback
  const cryptoError = CryptoException.invalidKeySize(32, 16);
  const cryptoRecovered = EnhancedErrorHandler.handleWithRecovery(cryptoError, ErrorSeverity.ERROR);
  assert(cryptoRecovered, "Crypto error should be recovered via fallback");
  assert(fallbackExecuted, "Fallback should have been executed");
  
  // Test creating contextual error
  const context = new Map<string, string>();
  context.set("operation", "test");
  context.set("timestamp", Date.now().toString());
  
  const contextualError = EnhancedErrorHandler.createContextualError(
    ValidationException,
    "Test validation error",
    context,
    true
  );
  
  assert(contextualError instanceof EnhancedError, "Should create enhanced error");
  assert(contextualError.context.has("operation"), "Should preserve context");
  assert(contextualError.stackTrace.length > 0, "Should have stack trace");
  
  console.log("✓ Enhanced Error Handler tests passed");
}

// Run all tests
export function runErrorContextTests(): void {
  console.log("=== Running Error Context Tests ===\n");
  
  testEnhancedError();
  testErrorAggregator();
  testErrorTelemetry();
  testRecoveryStrategies();
  testEnhancedErrorHandler();
  
  console.log("\n=== All Error Context Tests Passed! ===");
}

// Helper assertion function
function assert(condition: bool, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}