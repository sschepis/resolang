import { SATLiteral } from '../sat-resonance-solver';
import { VariableAssignment } from '../symbolic-resonance-transformer';
import { TestResult } from './test-helpers';

export function runLiteralTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testSATLiteralCreation(test_results, total_tests, passed_tests);
    testSATLiteralEvaluation(test_results, total_tests, passed_tests);
}

function testSATLiteralCreation(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Literal Creation");
    let start_time = Date.now() as f64;
    
    let positiveLiteral = new SATLiteral("x1", false);  // x1
    let negativeLiteral = new SATLiteral("x2", true);   // NOT x2
    
    if (positiveLiteral.variable == "x1" && 
        positiveLiteral.negated == false &&
        negativeLiteral.variable == "x2" &&
        negativeLiteral.negated == true) {
        test.passed = true;
        test.actual_value = 1.0;  // Success
        test.expected_value = 1.0;
        passed_tests++;
    } else {
        test.error_message = "SAT literal properties invalid";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}

function testSATLiteralEvaluation(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Literal Evaluation");
    let start_time = Date.now() as f64;
    
    let assignment = new VariableAssignment();
    assignment.assign("x1", true);
    assignment.assign("x2", false);
    
    let positiveLiteral = new SATLiteral("x1", false);  // x1
    let negativeLiteral = new SATLiteral("x2", true);   // NOT x2
    
    let positiveResult = positiveLiteral.evaluate(assignment);  // Should be true
    let negativeResult = negativeLiteral.evaluate(assignment);  // Should be true (NOT false)
    
    if (positiveResult == true && negativeResult == true) {
        test.passed = true;
        test.actual_value = 1.0;  // Both evaluations correct
        test.expected_value = 1.0;
        passed_tests++;
    } else {
        test.error_message = "Literal evaluation incorrect: pos=" + 
            positiveResult.toString() + ", neg=" + negativeResult.toString();
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}