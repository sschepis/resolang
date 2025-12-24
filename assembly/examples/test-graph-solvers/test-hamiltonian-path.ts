import { HamiltonianPathResonanceSolver, GraphBuilder, GraphPath } from '../graph-resonance-solvers';
import { TestResult } from '../test-sat-solver/test-helpers';
import { toFixed } from '../../utils';

export function runHamiltonianPathTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testHamiltonianPath(test_results, total_tests, passed_tests);
}

function testHamiltonianPath(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("Hamiltonian Path Problem");
    let start_time = Date.now() as f64;
    
    const graph = GraphBuilder.createPathGraph(4);
    
    const solver = new HamiltonianPathResonanceSolver();
    const result = solver.solve(graph);
    
    if (result.hasPath && result.path) {
        test.passed = true;
        test.actual_value = (result.path as GraphPath).length;
        test.expected_value = 3.0;
        passed_tests++;
    } else {
        test.error_message = "Hamiltonian path test failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}