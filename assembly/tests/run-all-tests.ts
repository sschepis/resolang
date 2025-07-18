// run-all-tests.ts
// Main test runner for all Prime Resonance Network tests

import { runAllCryptoUtilTests } from "./crypto-utils.test";
import { runAllKeytripletTests } from "./keytriplet.test";

// Test result tracking
class TestResult {
  suite: string;
  passed: boolean;
  error: string | null;
  
  constructor(suite: string, passed: boolean, error: string | null = null) {
    this.suite = suite;
    this.passed = passed;
    this.error = error;
  }
}

// Main test runner
export function runAllTests(): void {
  console.log("\n");
  console.log("========================================");
  console.log("   PRIME RESONANCE NETWORK TEST SUITE   ");
  console.log("========================================");
  console.log("\n");
  
  const results: Array<TestResult> = [];
  const startTime = Date.now();
  
  // Run crypto utility tests
  try {
    runAllCryptoUtilTests();
    results.push(new TestResult("Crypto Utilities", true));
  } catch (e) {
    const error = e instanceof Error ? e.message : "Unknown error";
    results.push(new TestResult("Crypto Utilities", false, error));
  }
  
  // Run keytriplet tests
  try {
    runAllKeytripletTests();
    results.push(new TestResult("Keytriplet System", true));
  } catch (e) {
    const error = e instanceof Error ? e.message : "Unknown error";
    results.push(new TestResult("Keytriplet System", false, error));
  }
  
  // Calculate statistics
  const endTime = Date.now();
  const duration = endTime - startTime;
  let passedCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < results.length; i++) {
    if (results[i].passed) {
      passedCount++;
    } else {
      failedCount++;
    }
  }
  
  // Print summary
  console.log("\n");
  console.log("========================================");
  console.log("           TEST SUMMARY                 ");
  console.log("========================================");
  console.log("\n");
  
  console.log(`Total Test Suites: ${results.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Duration: ${duration}ms`);
  console.log("\n");
  
  // Print detailed results
  if (failedCount > 0) {
    console.log("Failed Test Suites:");
    console.log("-------------------");
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (!result.passed) {
        console.log(`\n❌ ${result.suite}`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
      }
    }
    console.log("\n");
  }
  
  // Print passed suites
  console.log("Passed Test Suites:");
  console.log("-------------------");
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.passed) {
      console.log(`✅ ${result.suite}`);
    }
  }
  
  console.log("\n");
  
  // Final status
  if (failedCount === 0) {
    console.log("🎉 ALL TESTS PASSED! 🎉");
  } else {
    console.log(`⚠️  ${failedCount} TEST SUITE(S) FAILED`);
  }
  
  console.log("\n");
}

// Export for direct execution
export { runAllTests as default };

// Run tests if this is the main module
runAllTests();