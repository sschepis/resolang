/**
 * Main test entry point for AssemblyScript tests
 * This file is compiled to WASM and run by the test-runner.js
 */

// Import test modules that have minimal dependencies
import { runAllTests as runMathTests } from "./tests/core-math.test";
import { runAllTests as runCryptoTests } from "./tests/core-crypto.test";
import { runAllTests as runEngineTests } from "./tests/engine.test";

// Main test runner
export function runAllTests(): void {
  console.log("=== Running AssemblyScript Tests ===\n");
  
  let allPassed = true;
  
  // Run math tests
  console.log("Running Math Tests...");
  runMathTests();
  console.log("✅ Math tests completed\n");
  
  // Run crypto tests
  console.log("Running Crypto Tests...");
  runCryptoTests();
  console.log("✅ Crypto tests completed\n");

  // Run engine tests
  console.log("Running Engine Tests...");
  runEngineTests();
  console.log("✅ Engine tests completed\n");
  
  // Summary
  console.log("=== Test Summary ===");
  console.log("✅ All tests completed!");
}

// Export as default for the test runner
export { runAllTests as default };