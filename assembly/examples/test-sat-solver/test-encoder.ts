import { SATSymbolicEncoder, SATFormula, SATClause, SATLiteral } from '../sat-resonance-solver';
import { VariableAssignment } from '../symbolic-resonance-transformer';
import { TestResult } from './test-helpers';

export function runEncoderTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testSATSymbolicEncoder(test_results, total_tests, passed_tests);
    testSATConstraintEncoding(test_results, total_tests, passed_tests);
}

function testSATSymbolicEncoder(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Symbolic Encoder");
    let start_time = Date.now() as f64;
    
    let encoder = new SATSymbolicEncoder();
    
    // Create simple formula
    let clauses = [
        new SATClause([new SATLiteral("x1", false), new SATLiteral("x2", false)])
    ];
    let formula = new SATFormula(clauses);
    
    let symbolicState = encoder.encodeSATFormula(formula);
    
    if (symbolicState.constraintStates.length >= 1 &&
        symbolicState.amplitudes.length >= 1 &&
        symbolicState.entropy > 0.0) {
        test.passed = true;
        test.actual_value = symbolicState.constraintStates.length as f64;
        test.expected_value = 1.0;
        passed_tests++;
    } else {
        test.error_message = "SAT symbolic encoding failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}

function testSATConstraintEncoding(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Constraint Encoding");
    let start_time = Date.now() as f64;
    
    let encoder = new SATSymbolicEncoder();
    let assignment = new VariableAssignment();
    assignment.assign("x1", true);
    assignment.assign("x2", false);
    
    let variables = ["x1", "x2"];
    let encoded = encoder.encodeVariableAssignment(variables, assignment);
    
    if (encoded.entropy >= 0.0 && encoded.center.length == 2) {
        test.passed = true;
        test.actual_value = encoded.entropy;
        test.expected_value = 0.0;  // Any valid entropy
        passed_tests++;
    } else {
        test.error_message = "Variable assignment encoding failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}