import { SATFormula, SATClause, SATLiteral } from '../sat-resonance-solver';
import { VariableAssignment } from '../symbolic-resonance-transformer';
import { TestResult } from './test-helpers';

export function runFormulaTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testSATFormulaCreation(test_results, total_tests, passed_tests);
    testSATFormulaEvaluation(test_results, total_tests, passed_tests);
}

function testSATFormulaCreation(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Formula Creation");
    let start_time = Date.now() as f64;
    
    let clauses = [
        new SATClause([new SATLiteral("x1", false), new SATLiteral("x2", false)]),
        new SATClause([new SATLiteral("x2", true), new SATLiteral("x3", false)])
    ];
    
    let formula = new SATFormula(clauses);
    let dimensions = formula.getDimensions();
    
    if (formula.clauses.length == 2 && 
        formula.variables.length >= 2 &&  // Should extract variables
        dimensions.variables >= 2 &&
        dimensions.constraints == 2) {
        test.passed = true;
        test.actual_value = formula.clauses.length as f64;
        test.expected_value = 2.0;
        passed_tests++;
    } else {
        test.error_message = "SAT formula properties invalid";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}

function testSATFormulaEvaluation(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Formula Evaluation");
    let start_time = Date.now() as f64;
    
    // Create simple satisfiable formula: (x1) AND (x2)
    let clauses = [
        new SATClause([new SATLiteral("x1", false)]),  // x1
        new SATClause([new SATLiteral("x2", false)])   // x2
    ];
    let formula = new SATFormula(clauses);
    
    // Create satisfying assignment
    let assignment = new VariableAssignment();
    assignment.assign("x1", true);
    assignment.assign("x2", true);
    
    let satisfied = formula.isSatisfied(assignment);
    
    if (satisfied == true) {
        test.passed = true;
        test.actual_value = 1.0;  // Satisfied
        test.expected_value = 1.0;
        passed_tests++;
    } else {
        test.error_message = "Formula evaluation incorrect";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}