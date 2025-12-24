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
import { runInferenceTests } from "./tests/inference-validation.test";

// New tests - import for side effects (registration)
import "./tests/sedenion.test";
import "./tests/twist.test";
import "./tests/enochian.test";
import "./tests/physics.test";

// Main test runner
export function runAllTests(): void {
  console.log("=== Running AssemblyScript Tests ===\n");
  
  // Run existing test suites
  console.log("Running Math Tests...");
  runMathTests();
  
  console.log("Running Crypto Tests...");
  runCryptoTests();

  console.log("Running Engine Tests...");
  runEngineTests();

  console.log("Running Inference Validation Tests...");
  runInferenceTests();
  
  // New tests are run implicitly via describe/test imports if the runner supports it
  // or we would need to wrap them in runAllTests functions like the others.
  // Since we are using a custom runner that mocks describe/test, simply importing them
  // should trigger their execution if they are top-level calls.
}