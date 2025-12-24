import { runVertexCoverTests } from './test-vertex-cover';
import { runHamiltonianPathTests } from './test-hamiltonian-path';
import { runGraphColoringTests } from './test-graph-coloring';
import { TestResult } from '../test-sat-solver/test-helpers';

export function runGraphResonanceTests(): void {
    let test_results = new Array<TestResult>();
    let total_tests = 0;
    let passed_tests = 0;

    console.log("=== GRAPH RESONANCE SOLVER TEST SUITE ===");

    runVertexCoverTests(test_results, total_tests, passed_tests);
    runHamiltonianPathTests(test_results, total_tests, passed_tests);
    runGraphColoringTests(test_results, total_tests, passed_tests);

    generateTestReport(test_results, total_tests, passed_tests);
}

function generateTestReport(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    console.log("\n=== GRAPH RESONANCE SOLVER TEST RESULTS ===");
    console.log("Total Tests: " + total_tests.toString());
    console.log("Passed Tests: " + passed_tests.toString());
    console.log("Failed Tests: " + (total_tests - passed_tests).toString());
    console.log("Success Rate: " + Math.floor((passed_tests as f64) / (total_tests as f64) * 100.0).toString() + "%");
    
    console.log("\nDETAILED RESULTS:");
    for (let i = 0; i < test_results.length; i++) {
        let result = test_results[i];
        let status = result.passed ? "PASS" : "FAIL";
        console.log("[" + status + "] " + result.test_name + 
                   " (" + Math.floor(result.execution_time).toString() + "ms)");
        
        if (!result.passed && result.error_message.length > 0) {
            console.log("  Error: " + result.error_message);
        }
        
        if (result.expected_value != 0.0 || result.actual_value != 0.0) {
            console.log("  Expected: " + result.expected_value.toString() + 
                       ", Actual: " + result.actual_value.toString());
        }
    }
    
    console.log("\n=== GRAPH RESONANCE SOLVER TESTS COMPLETE ===");
}