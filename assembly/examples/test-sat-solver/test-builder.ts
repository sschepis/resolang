import { SATResonanceBuilder, SATFormula, SATClause, SATLiteral } from '../sat-resonance-solver';
import { TestResult } from './test-helpers';

export function runBuilderTests(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    testSATResonanceBuilder(test_results, total_tests, passed_tests);
    testClauseOperatorCreation(test_results, total_tests, passed_tests);
}

function testSATResonanceBuilder(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("SAT Resonance Builder");
    let start_time = Date.now() as f64;
    
    let builder = new SATResonanceBuilder();
    
    let clauses = [
        new SATClause([new SATLiteral("x1", false), new SATLiteral("x2", false)]),
        new SATClause([new SATLiteral("x2", true), new SATLiteral("x3", false)])
    ];
    let formula = new SATFormula(clauses);
    
    let resonanceOperator = builder.buildSATResonanceOperator(formula);
    
    if (resonanceOperator.clauseOperators.length == 2 &&
        resonanceOperator.weights.length == 2) {
        test.passed = true;
        test.actual_value = resonanceOperator.clauseOperators.length as f64;
        test.expected_value = 2.0;
        passed_tests++;
    } else {
        test.error_message = "SAT resonance operator building failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}

function testClauseOperatorCreation(test_results: Array<TestResult>, total_tests: i32, passed_tests: i32): void {
    let test = new TestResult("Clause Operator Creation");
    let start_time = Date.now() as f64;
    
    let builder = new SATResonanceBuilder();
    let clause = new SATClause([new SATLiteral("x1", false), new SATLiteral("x2", true)]);
    let formula = new SATFormula([clause]);
    
    let resonanceOperator = builder.buildSATResonanceOperator(formula);
    
    if (resonanceOperator.clauseOperators.length == 1) {
        let clauseOp = resonanceOperator.clauseOperators[0];
        if (clauseOp.constraint.type == "SAT_CLAUSE") {
            test.passed = true;
            test.actual_value = 1.0;  // Successfully created
            test.expected_value = 1.0;
            passed_tests++;
        } else {
            test.error_message = "Clause operator type incorrect";
        }
    } else {
        test.error_message = "Clause operator creation failed";
    }
    
    test.execution_time = (Date.now() as f64) - start_time;
    test_results.push(test);
    total_tests++;
}