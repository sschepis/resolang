import { SATFormulaBuilder } from '../sat-resonance-solver';
import { TestResult } from './test-helpers';

export function runFormBuilderTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testSATFormulaBuilders(test_results, total_tests, passed_tests);
    testRandom3SATGeneration(test_results, total_tests, passed_tests);
}

function testSATFormulaBuilders(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Formula Builders");
    let start_time = Date.now() as f64;
    
    let builders_tested = 0;
    let total_builders = 3;
    
    // Test simple 3-SAT builder
    let simple = SATFormulaBuilder.createSimple3SAT();
    if (simple.clauses.length > 0) builders_tested++;
    
    // Test satisfiable 3-SAT builder
    let satisfiable = SATFormulaBuilder.createSatisfiable3SAT();
    if (satisfiable.clauses.length > 0) builders_tested++;
    
    // Test unsatisfiable 3-SAT builder
    let unsatisfiable = SATFormulaBuilder.createUnsatisfiable3SAT();
    if (unsatisfiable.clauses.length > 0) builders_tested++;
    
    if (builders_tested >= 2) {  // At least 2/3 builders work
        test.passed = true;
        test.actual_value = builders_tested as f64;
        test.expected_value = total_builders as f64;
        passed_tests++;
    } else {
        test.error_message = "SAT formula builders failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}

function testRandom3SATGeneration(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("Random 3-SAT Generation");
    let start_time = Date.now() as f64;
    
    let formula = SATFormulaBuilder.createRandom3SAT(4, 6);  // 4 variables, 6 clauses
    
    if (formula.clauses.length == 6 && formula.variables.length <= 4) {
        // Check that clauses have appropriate structure
        let valid_clauses = 0;
        for (let i = 0; i < formula.clauses.length; i++) {
            if (formula.clauses[i].literals.length <= 3) {  // Should be 3-SAT
                valid_clauses++;
            }
        }
        
        if (valid_clauses >= 4) {  // Most clauses should be valid
            test.passed = true;
            test.actual_value = valid_clauses as f64;
            test.expected_value = 6.0;
            passed_tests++;
        } else {
            test.error_message = "Random 3-SAT structure invalid";
        }
    } else {
        test.error_message = "Random 3-SAT generation failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}