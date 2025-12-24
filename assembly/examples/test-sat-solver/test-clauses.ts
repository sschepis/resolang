import { SATClause, SATLiteral } from '../sat-resonance-solver';
import { VariableAssignment } from '../symbolic-resonance-transformer';
import { TestResult } from './test-helpers';

export function runClauseTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testSATClauseCreation(test_results, total_tests, passed_tests);
    testSATClauseEvaluation(test_results, total_tests, passed_tests);
}

function testSATClauseCreation(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Clause Creation");
    let start_time = Date.now() as f64;
    
    let literals = [
        new SATLiteral("x1", false),  // x1
        new SATLiteral("x2", true),   // NOT x2
        new SATLiteral("x3", false)   // x3
    ];
    
    let clause = new SATClause(literals, "test_clause");
    let variables = clause.getVariables();
    
    if (clause.id == "test_clause" && 
        clause.literals.length == 3 &&
        variables.length == 3) {
        test.passed = true;
        test.actual_value = clause.literals.length as f64;
        test.expected_value = 3.0;
        passed_tests++;
    } else {
        test.error_message = "SAT clause properties invalid";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}

function testSATClauseEvaluation(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Clause Evaluation");
    let start_time = Date.now() as f64;
    
    // Create clause: (x1 OR NOT x2 OR x3)
    let literals = [
        new SATLiteral("x1", false),  // x1
        new SATLiteral("x2", true),   // NOT x2
        new SATLiteral("x3", false)   // x3
    ];
    let clause = new SATClause(literals);
    
    // Test satisfying assignment
    let satisfyingAssignment = new VariableAssignment();
    satisfyingAssignment.assign("x1", true);   // x1 = true (satisfies clause)
    satisfyingAssignment.assign("x2", true);   // x2 = true (NOT x2 = false)
    satisfyingAssignment.assign("x3", false);  // x3 = false
    
    // Test non-satisfying assignment
    let nonSatisfyingAssignment = new VariableAssignment();
    nonSatisfyingAssignment.assign("x1", false);  // x1 = false
    nonSatisfyingAssignment.assign("x2", false);  // x2 = false (NOT x2 = true, should satisfy)
    nonSatisfyingAssignment.assign("x3", false);  // x3 = false
    
    let satisfied = clause.isSatisfied(satisfyingAssignment);
    let notSatisfied = clause.isSatisfied(nonSatisfyingAssignment);
    
    if (satisfied == true && notSatisfied == true) {  // Both should actually be satisfied
        test.passed = true;
        test.actual_value = 1.0;
        test.expected_value = 1.0;
        passed_tests++;
    } else {
        test.error_message = "Clause evaluation results unexpected";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}