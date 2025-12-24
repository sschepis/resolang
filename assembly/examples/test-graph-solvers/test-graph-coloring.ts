import { GraphColoringResonanceSolver, GraphBuilder, GraphColoring } from '../graph-resonance-solvers';
import { TestResult } from '../test-sat-solver/test-helpers';

export function runGraphColoringTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testGraphColoring(test_results, total_tests, passed_tests);
}

function testGraphColoring(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("Graph Coloring Problem");
    let start_time = Date.now() as f64;
    
    const graph = GraphBuilder.createCycleGraph(4);
    
    const solver = new GraphColoringResonanceSolver();
    const result = solver.solve(graph, 2);
    
    if (result.isColorable && result.coloring) {
        test.passed = true;
        test.actual_value = (result.coloring as GraphColoring).numColors as f64;
        test.expected_value = 2.0;
        passed_tests++;
    } else {
        test.error_message = "Graph coloring test failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}