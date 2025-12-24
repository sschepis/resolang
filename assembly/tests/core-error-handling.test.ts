import {
  ErrorCategory,
  ErrorSeverity,
  PRNError,
  ErrorDetails,
  NetworkError,
  ValidationError,
  CryptoError,
  StorageError,
  ProtocolError,
  RetryStrategy,
  CircuitBreakerStrategy,
  FallbackStrategy,
  ErrorManager,
  ConsoleErrorHandler,
  ErrorStatistics,
  createErrorMessage,
  withErrorHandling,
  assert,
  // validate, // Not directly testable without a validator function
  ErrorMessages,
} from "../core/error-handling";

// Reset ErrorManager before each test to ensure isolation
function resetErrorManager(): void {
  // @ts-ignore
  ErrorManager.instance = null;
  ErrorManager.getInstance().clearLog();
  ErrorManager.getInstance().clearStrategies(); // Clear default strategies
}

export function testErrorCategoryEnum(): void {
  assert(ErrorCategory.SYSTEM == 1000, "SYSTEM category should be 1000");
  assert(ErrorCategory.NETWORK == 2000, "NETWORK category should be 2000");
  assert(ErrorCategory.VALIDATION == 3000, "VALIDATION category should be 3000");
}

export function testErrorSeverityEnum(): void {
  assert(ErrorSeverity.DEBUG == 0, "DEBUG severity should be 0");
  assert(ErrorSeverity.FATAL == 5, "FATAL severity should be 5");
}

export function testPRNErrorConstructor(): void {
  const error = new PRNError("Test message");
  assert(error.message == "Test message", "Message should be correct");
  assert(error.name == "PRNError", "Name should be PRNError");
  assert(error.code == ErrorCategory.APPLICATION, "Default code should be APPLICATION");
  assert(error.severity == ErrorSeverity.ERROR, "Default severity should be ERROR");
  assert(error.timestamp > 0, "Timestamp should be set");
  assert(error.context.size == 0, "Context should be empty");
  assert(error.cause == null, "Cause should be null");

  const customError = new PRNError("Custom message", ErrorCategory.NETWORK, ErrorSeverity.WARNING, new Error("Cause error"));
  assert(customError.code == ErrorCategory.NETWORK, "Custom code should be correct");
  assert(customError.severity == ErrorSeverity.WARNING, "Custom severity should be correct");
  assert(customError.cause!.message == "Cause error", "Cause message should be correct");
}

export function testPRNErrorAddContext(): void {
  const error = new PRNError("Test").addContext("key", "value");
  assert(error.context.get("key") == "value", "Context should be added");
}

export function testPRNErrorGetDetails(): void {
  const error = new PRNError("Test", ErrorCategory.SYSTEM, ErrorSeverity.INFO, new Error("Inner"));
  error.addContext("data", "extra");
  const details = error.getDetails();

  assert(details.name == "PRNError", "Details name should be correct");
  assert(details.message == "Test", "Details message should be correct");
  assert(details.code == ErrorCategory.SYSTEM, "Details code should be correct");
  assert(details.severity == ErrorSeverity.INFO, "Details severity should be correct");
  assert(details.timestamp > 0, "Details timestamp should be set");
  assert(details.context.get("data") == "extra", "Details context should be correct");
  assert(details.cause == "Inner", "Details cause should be correct");
  assert(details.stack.length > 0, "Details stack should be present");
}

export function testPRNErrorToJSON(): void {
  const error = new PRNError("Test", ErrorCategory.SYSTEM, ErrorSeverity.INFO);
  error.addContext("data", "extra");
  const json = error.toJSON();
  assert(json.includes('"name":"PRNError"'), "JSON should contain name");
  assert(json.includes('"message":"Test"'), "JSON should contain message");
  assert(json.includes('"code":1000'), "JSON should contain code");
  assert(json.includes('"severity":1'), "JSON should contain severity");
  assert(json.includes('"context":{"data":"extra"}'), "JSON should contain context");
}

export function testErrorDetailsToJSON(): void {
  const details = new ErrorDetails("CustomError", "Detail message", ErrorCategory.APPLICATION, ErrorSeverity.ERROR, 12345, new Map<string, string>(), null, "stacktrace");
  details.context.set("extra", "info");
  const json = details.toJSON();
  assert(json.includes('"name":"CustomError"'), "JSON should contain name");
  assert(json.includes('"message":"Detail message"'), "JSON should contain message");
  assert(json.includes('"context":{"extra":"info"}'), "JSON should contain context");
  assert(json.includes('"stack":"stacktrace"'), "JSON should contain stack");
}

export function testSpecializedErrors(): void {
  const netError = new NetworkError("Net issue");
  assert(netError.name == "NetworkError", "NetworkError name should be correct");
  assert(netError.code == ErrorCategory.NETWORK, "NetworkError code should be NETWORK");

  const validationError = new ValidationError("Invalid input", "field1", "value1");
  assert(validationError.name == "ValidationError", "ValidationError name should be correct");
  assert(validationError.code == ErrorCategory.VALIDATION, "ValidationError code should be VALIDATION");
  assert(validationError.field == "field1", "ValidationError field should be correct");
  assert(validationError.value == "value1", "ValidationError value should be correct");
  assert(validationError.context.get("field") == "field1", "ValidationError context field should be correct");

  const cryptoError = new CryptoError("Crypto issue");
  assert(cryptoError.name == "CryptoError", "CryptoError name should be correct");

  const storageError = new StorageError("Storage issue", "myKey");
  assert(storageError.name == "StorageError", "StorageError name should be correct");
  assert(storageError.key == "myKey", "StorageError key should be correct");

  const protocolError = new ProtocolError("Protocol issue", "proto1", "msgType");
  assert(protocolError.name == "ProtocolError", "ProtocolError name should be correct");
  assert(protocolError.protocolId == "proto1", "ProtocolError protocolId should be correct");
  assert(protocolError.messageType == "msgType", "ProtocolError messageType should be correct");
}

export function testRetryStrategy(): void {
  resetErrorManager();
  const strategy = new RetryStrategy(2, 10, 100); // 2 attempts, 10ms base delay, 100ms max delay
  ErrorManager.getInstance().registerStrategy(strategy);

  const networkError = new PRNError("Network timeout", ErrorCategory.NETWORK_TIMEOUT);
  assert(strategy.canHandle(networkError), "RetryStrategy should handle network timeout");

  assert(ErrorManager.getInstance().handleError(networkError), "First retry should succeed");
  assert(ErrorManager.getInstance().handleError(networkError), "Second retry should succeed");
  assert(!ErrorManager.getInstance().handleError(networkError), "Third retry should fail (max attempts reached)");

  strategy.reset();
  assert(ErrorManager.getInstance().handleError(networkError), "Reset should allow retries again");
}

export function testCircuitBreakerStrategy(): void {
  resetErrorManager();
  const strategy = new CircuitBreakerStrategy(2, 100, 1); // 2 failures, 100ms timeout, 1 half-open attempt
  ErrorManager.getInstance().registerStrategy(strategy);

  const criticalError = new PRNError("Critical system failure", ErrorCategory.SYSTEM, ErrorSeverity.CRITICAL);
  assert(strategy.canHandle(criticalError), "CircuitBreakerStrategy should handle critical errors");

  assert(ErrorManager.getInstance().handleError(criticalError), "First error should pass through");
  assert(ErrorManager.getInstance().handleError(criticalError), "Second error should pass through");
  assert(!ErrorManager.getInstance().handleError(criticalError), "Third error should open circuit"); // Circuit open

  // Wait for timeout
  // In a real test, you'd use a mock timer or advance time
  // For AssemblyScript, we can't easily mock Date.now(), so this is conceptual
  // Simulate time passing
  const oldDateNow = Date.now;
  // @ts-ignore
  Date.now = (): u64 => oldDateNow() + 200; // Advance time by 200ms

  assert(ErrorManager.getInstance().handleError(criticalError), "After timeout, should be half-open and allow one attempt");
  assert(!ErrorManager.getInstance().handleError(criticalError), "Subsequent errors should open circuit again");

  // @ts-ignore
  Date.now = oldDateNow; // Restore Date.now()
}

export function testFallbackStrategy(): void {
  resetErrorManager();
  let fallbackExecuted = false;
  const fallbackHandlers = new Map<ErrorCategory, () => void>();
  fallbackHandlers.set(ErrorCategory.NETWORK, (): void => { fallbackExecuted = true; });
  const strategy = new FallbackStrategy(fallbackHandlers);
  ErrorManager.getInstance().registerStrategy(strategy);

  const networkError = new PRNError("Network issue", ErrorCategory.NETWORK);
  assert(strategy.canHandle(networkError), "FallbackStrategy should handle network errors");

  ErrorManager.getInstance().handleError(networkError);
  assert(fallbackExecuted, "Fallback handler should be executed");
}

export function testErrorManagerSingleton(): void {
  resetErrorManager();
  const instance1 = ErrorManager.getInstance();
  const instance2 = ErrorManager.getInstance();
  assert(instance1 == instance2, "ErrorManager should be a singleton");
}

export function testErrorManagerHandleErrorAndLog(): void {
  resetErrorManager();
  const manager = ErrorManager.getInstance();
  const error = new PRNError("Test log", ErrorCategory.SYSTEM);
  manager.handleError(error);
  const stats = manager.getStatistics();
  assert(stats.totalErrors == 1, "Total errors should be 1");
  assert(stats.errorsByCategory.get(ErrorCategory.SYSTEM) == 1, "System errors should be 1");
}

export function testErrorManagerClearLog(): void {
  resetErrorManager();
  const manager = ErrorManager.getInstance();
  manager.handleError(new PRNError("Error 1"));
  manager.clearLog();
  const stats = manager.getStatistics();
  assert(stats.totalErrors == 0, "Error log should be cleared");
}

export function testConsoleErrorHandler(): void {
  // This test primarily checks if the handler runs without throwing errors
  // Actual console output cannot be asserted directly in AssemblyScript tests
  const handler = new ConsoleErrorHandler();
  const error = new PRNError("Console test", ErrorCategory.APPLICATION, ErrorSeverity.INFO);
  error.addContext("key", "value");
  handler.handle(error);
  assert(true, "ConsoleErrorHandler should run without error"); // Placeholder assertion
}

export function testErrorStatistics(): void {
  const stats = new ErrorStatistics();
  const error1 = new ErrorDetails("Err1", "Msg1", ErrorCategory.SYSTEM, ErrorSeverity.ERROR, 1, new Map(), null, "");
  const error2 = new ErrorDetails("Err2", "Msg2", ErrorCategory.NETWORK, ErrorSeverity.CRITICAL, 2, new Map(), null, "");
  
  stats.recordError(error1);
  stats.recordError(error2);

  assert(stats.totalErrors == 2, "Total errors should be 2");
  assert(stats.errorsByCategory.get(ErrorCategory.SYSTEM) == 1, "System errors count should be 1");
  assert(stats.errorsByCategory.get(ErrorCategory.NETWORK) == 1, "Network errors count should be 1");
  assert(stats.errorsBySeverity.get(ErrorSeverity.ERROR) == 1, "Error severity count should be 1");
  assert(stats.errorsBySeverity.get(ErrorSeverity.CRITICAL) == 1, "Critical severity count should be 1");
  assert(stats.recentErrors.length == 2, "Recent errors should contain 2 entries");

  const json = stats.toJSON();
  assert(json.includes('"totalErrors":2'), "JSON should contain totalErrors");
  assert(json.includes('"criticalErrors":1'), "JSON should contain criticalErrors");
}

export function testCreateErrorMessage(): void {
  const params = new Map<string, string>();
  params.set("host", "example.com");
  params.set("port", "8080");
  const message = createErrorMessage("Failed to connect to {host}:{port}", params);
  assert(message == "Failed to connect to example.com:8080", "Message should be correctly formatted");
}

export function testWithErrorHandling(): void {
  resetErrorManager();
  const manager = ErrorManager.getInstance();
  
  // Test successful execution
  let result = withErrorHandling<i32>((): i32 => { return 10; }, ErrorCategory.APPLICATION);
  assert(result == 10, "Successful function should return result");
  assert(manager.getStatistics().totalErrors == 0, "No errors should be logged for successful execution");

  // Test error handling
  result = withErrorHandling<i32>((): i32 => { throw new Error("Test error"); }, ErrorCategory.SYSTEM);
  assert(result == null, "Function throwing error should return null");
  assert(manager.getStatistics().totalErrors == 1, "One error should be logged for erroring function");
}

export function testAssertFunction(): void {
  // Test true condition
  assert(true, "This should not throw");

  // Test false condition
  let threwError = false;
  try {
    assert(false, "This should throw", ErrorCategory.VALIDATION);
  } catch (e) {
    threwError = true;
    const error = e as PRNError;
    assert(error.message == "This should throw", "Error message should match");
    assert(error.code == ErrorCategory.VALIDATION, "Error code should match");
  }
  assert(threwError, "Assert with false condition should throw an error");
}

export function testErrorMessages(): void {
  assert(ErrorMessages.SYSTEM_NOT_INITIALIZED == "System not initialized", "System not initialized message correct");
  assert(ErrorMessages.NETWORK_CONNECTION_FAILED == "Failed to establish connection to {host}", "Network connection failed message correct");
}

export function runAllErrorHandlingTests(): void {
  console.log("Running error handling tests...");

  testErrorCategoryEnum();
  console.log("✓ testErrorCategoryEnum passed");

  testErrorSeverityEnum();
  console.log("✓ testErrorSeverityEnum passed");

  testPRNErrorConstructor();
  console.log("✓ testPRNErrorConstructor passed");

  testPRNErrorAddContext();
  console.log("✓ testPRNErrorAddContext passed");

  testPRNErrorGetDetails();
  console.log("✓ testPRNErrorGetDetails passed");

  testPRNErrorToJSON();
  console.log("✓ testPRNErrorToJSON passed");

  testErrorDetailsToJSON();
  console.log("✓ testErrorDetailsToJSON passed");

  testSpecializedErrors();
  console.log("✓ testSpecializedErrors passed");

  testRetryStrategy();
  console.log("✓ testRetryStrategy passed");

  testCircuitBreakerStrategy();
  console.log("✓ testCircuitBreakerStrategy passed");

  testFallbackStrategy();
  console.log("✓ testFallbackStrategy passed");

  testErrorManagerSingleton();
  console.log("✓ testErrorManagerSingleton passed");

  testErrorManagerHandleErrorAndLog();
  console.log("✓ testErrorManagerHandleErrorAndLog passed");

  testErrorManagerClearLog();
  console.log("✓ testErrorManagerClearLog passed");

  testConsoleErrorHandler();
  console.log("✓ testConsoleErrorHandler passed");

  testErrorStatistics();
  console.log("✓ testErrorStatistics passed");

  testCreateErrorMessage();
  console.log("✓ testCreateErrorMessage passed");

  testWithErrorHandling();
  console.log("✓ testWithErrorHandling passed");

  testAssertFunction();
  console.log("✓ testAssertFunction passed");

  testErrorMessages();
  console.log("✓ testErrorMessages passed");

  console.log("\nAll error handling tests passed! ✨");
}