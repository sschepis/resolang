/**
 * Test runner for all unit tests
 * Execute this file to run all tests for the consolidated modules
 */

import { runAllTests as runCryptoTests } from "./core-crypto.test";
import { runAllTests as runMathTests } from "./core-math.test";

// Main test runner
export function runAllTests(): void {
  console.log("=== Running All Unit Tests ===\n");
  
  let allPassed = true;
  
  try {
    runCryptoTests();
  } catch (e) {
    console.error("❌ Crypto tests failed");
    allPassed = false;
  }
  
  console.log("\n---\n");
  
  try {
    runMathTests();
  } catch (e) {
    console.error("❌ Math tests failed");
    allPassed = false;
  }
  
  console.log("\n=== Test Summary ===");
  if (allPassed) {
    console.log("✅ All tests passed!");
  } else {
    console.log("❌ Some tests failed. Please check the output above.");
  }
}

// Export for use in other test files or as entry point
export { runAllTests as default };