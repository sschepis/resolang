/**
 * Main test entry point for AssemblyScript tests
 * This file is compiled to WASM and run by the test-runner.js
 */

// Import test modules that have minimal dependencies
import { runAllTests as runMathTests } from "./tests/core-math.test";
import { runAllTests as runCryptoTests } from "./tests/core-crypto.test";
import { runAllTests as runEngineTests } from "./tests/engine.test";
import { runAllUtilsTests } from "./tests/utils.test";
import { runAllArrayTests } from "./tests/core-arrays.test";
import { runAllBuilderTests } from "./tests/core-builders.test";
import { runAllConfigLoaderTests } from "./tests/core-config-loader.test";
import { runAllConstantsTests } from "./tests/core-constants.test";
import { runAllFunctionalBlocksTests } from "./tests/functionalBlocks.test";
import { runAllOperatorTests } from "./tests/operators.test";
import { runAllResoLangTests } from "./tests/resonlang.test";
import { runAllTypesTests } from "./tests/types.test";
import { runAllRuntimeTests } from "./tests/runtime.test";
import { runAllQuantumOpsImplTests } from "./tests/quantum-ops-impl.test";
import { runAllQuaternionEntanglementTests } from "./tests/quaternion-entanglement.test";
import { runAllQuaternionTests } from "./tests/quaternion.test";
import { runAllEntropyVizTests } from "./tests/entropy-viz.test";


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

  // Run utils tests
  console.log("Running Utils Tests...");
  runAllUtilsTests();
  console.log("✅ Utils tests completed\n");

  // Run array tests
  console.log("Running Array Tests...");
  runAllArrayTests();
  console.log("✅ Array tests completed\n");

  // Run builder tests
  console.log("Running Builder Tests...");
  runAllBuilderTests();
  console.log("✅ Builder tests completed\n");

  // Run config loader tests
  console.log("Running Config Loader Tests...");
  runAllConfigLoaderTests();
  console.log("✅ Config Loader tests completed\n");

  // Run Constants tests
  console.log("Running Constants Tests...");
  runAllConstantsTests();
  console.log("✅ Constants tests completed\n");

  // Run functional blocks tests
  console.log("Running Functional Blocks Tests...");
  runAllFunctionalBlocksTests();
  console.log("✅ Functional Blocks tests completed\n");

  // Run operator tests
  console.log("Running Operator Tests...");
  runAllOperatorTests();
  console.log("✅ Operator tests completed\n");

  // Run ResoLang tests
  console.log("Running ResoLang Tests...");
  runAllResoLangTests();
  console.log("✅ ResoLang tests completed\n");

  // Run Types tests
  console.log("Running Types Tests...");
  runAllTypesTests();
  console.log("✅ Types tests completed\n");

  // Run Runtime tests
  console.log("Running Runtime Tests...");
  runAllRuntimeTests();
  console.log("✅ Runtime tests completed\n");

  // Run Quantum Operations Implementation tests
  console.log("Running Quantum Operations Implementation Tests...");
  runAllQuantumOpsImplTests();
  console.log("✅ Quantum Operations Implementation tests completed\n");

  // Run Quaternion Entanglement tests
  console.log("Running Quaternion Entanglement Tests...");
  runAllQuaternionEntanglementTests();
  console.log("✅ Quaternion Entanglement tests completed\n");

  // Run Quaternion tests
  console.log("Running Quaternion Tests...");
  runAllQuaternionTests();
  console.log("✅ Quaternion tests completed\n");

  // Run Entropy Visualization tests
  console.log("Running Entropy Visualization Tests...");
  runAllEntropyVizTests();
  console.log("✅ Entropy Visualization tests completed\n");
  
  // Summary
  console.log("=== Test Summary ===");
  console.log("✅ All tests completed!");
}

// Export as default for the test runner
export { runAllTests as default };