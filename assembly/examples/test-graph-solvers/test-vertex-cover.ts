import { VertexCoverResonanceSolver, GraphBuilder, VertexSet } from '../graph-resonance-solvers';
import { TestResult } from '../test-sat-solver/test-helpers';

export function runVertexCoverTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testVertexCover(test_results, total_tests, passed_tests);
}

function testVertexCover(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("Vertex Cover Problem");
    let start_time = Date.now() as f64;
    
    const graph = GraphBuilder.createTriangleGraph();
    
    const solver = new VertexCoverResonanceSolver();
    const result = solver.solve(graph, 2);
    
    if (result.hasCover && result.cover) {
        test.passed = true;
        test.actual_value = (result.cover as VertexSet).cost as f64;
        test.expected_value = 2.0;
        passed_tests++;
    } else {
        test.error_message = "Vertex cover test failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}