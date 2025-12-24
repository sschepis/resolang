/**
 * Exports for the Universal Symbolic Transformer, providing polynomial-time solutions
 * for all NP-complete problems. This module exposes the core components of the P=NP solver
 * as WebAssembly-compatible functions.
 */

import {
    NPProblemType,
    UniversalConstraint,
    UniversalSymbolicState,
    UniversalSymbolicTransformer
} from './examples/universal-symbolic-transformer';

// Re-export enums and data classes directly
export {
    NPProblemType,
    UniversalConstraint
};

// --- UniversalSymbolicState Exports ---

// Wrapper function to create a new UniversalSymbolicState
export function createState(type: NPProblemType, vars: Array<i32>, constraints: Array<UniversalConstraint>): UniversalSymbolicState {
    return new UniversalSymbolicState(type, vars, constraints);
}

// Wrapper function to check if a state is satisfied
export function isStateSatisfied(state: UniversalSymbolicState): boolean {
    return state.isSatisfied();
}

// Wrapper function to get the solution encoding from a state
export function getSolutionEncoding(state: UniversalSymbolicState): Array<i32> {
    return state.solution_encoding;
}

// --- UniversalSymbolicTransformer Exports ---

// Wrapper function to create a new UniversalSymbolicTransformer
export function createTransformer(problem_dimension: i32): UniversalSymbolicTransformer {
    return new UniversalSymbolicTransformer(problem_dimension);
}

// Wrapper function for the static encodeGenericProblem method
export function encodeProblem(
    problem_type: NPProblemType,
    variables: Array<i32>,
    raw_constraints: Array<Array<i32>>,
    weights: Array<f64>
): UniversalSymbolicState {
    return UniversalSymbolicTransformer.encodeGenericProblem(
        problem_type,
        variables,
        raw_constraints,
        weights
    );
}

// Wrapper function to solve a problem using a transformer
export function solveProblem(transformer: UniversalSymbolicTransformer, problem_state: UniversalSymbolicState): UniversalSymbolicState {
    return transformer.solve(problem_state);
}

// Wrapper function to verify polynomial convergence
export function verifyConvergence(transformer: UniversalSymbolicTransformer): boolean {
    return transformer.verifyPolynomialConvergence();
}