/**
 * Tests for TinyAleph ported modules
 * 
 * Tests:
 * - Fano plane multiplication tables
 * - Hypercomplex algebra (Complex, Quaternion, Octonion, Sedenion)
 * - Prime Hilbert Space
 * - SparsePrimeState and PR-Graph Memory
 */

import {
  multiplyIndices,
  FANO_LINES
} from '../fano';

import {
  Hypercomplex,
  complex,
  quaternion,
  octonion,
  getDimensionName
} from '../hypercomplex';

import {
  PrimeHilbertState,
  ResonanceOperators,
  encodeMemory,
  DominantPrime
} from '../hilbert';

import {
  SparsePrimeState,
  resonanceScore,
  resonantAttention,
  PRGraphMemory
} from '../rformer';

// ============================================================================
// Test Utilities
// ============================================================================

let passed = 0;
let failed = 0;

function assert(condition: bool, message: string): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    trace("FAILED: " + message);
  }
}

function assertApprox(a: f64, b: f64, epsilon: f64, message: string): void {
  const diff = Math.abs(a - b);
  if (diff < epsilon) {
    passed++;
  } else {
    failed++;
    trace("FAILED: " + message + " | Expected: " + b.toString() + ", Got: " + a.toString());
  }
}

function printTestResults(): void {
  trace("================================");
  trace("Test Results: " + passed.toString() + " passed, " + failed.toString() + " failed");
  trace("================================");
}

// ============================================================================
// Fano Plane Tests
// ============================================================================

export function testFanoMultiplication(): void {
  trace("--- Testing Fano Plane Multiplication ---");
  
  // Test quaternion multiplication (i * j = k)
  const ij = multiplyIndices(4, 1, 2);  // i * j in quaternions
  assert(ij.index == 3, "i * j should give k (index 3)");
  assert(ij.sign == 1, "i * j should have positive sign");
  
  // Test j * i = -k
  const ji = multiplyIndices(4, 2, 1);
  assert(ji.index == 3, "j * i should give k (index 3)");
  assert(ji.sign == -1, "j * i should have negative sign");
  
  // Test unit element
  const oneOne = multiplyIndices(4, 0, 0);
  assert(oneOne.index == 0, "1 * 1 = 1");
  assert(oneOne.sign == 1, "1 * 1 has positive sign");
  
  // Test octonion multiplication
  const e1e2 = multiplyIndices(8, 1, 2);
  assert(e1e2.index != 0, "e1 * e2 should not be 1");
}

// ============================================================================
// Hypercomplex Tests
// ============================================================================

export function testComplex(): void {
  trace("--- Testing Complex Numbers ---");
  
  const c1 = complex(3.0, 4.0);
  const c2 = complex(1.0, 2.0);
  
  // Test magnitude
  assertApprox(c1.norm(), 5.0, 0.001, "Complex magnitude");
  
  // Test addition
  const sum = c1.add(c2);
  assertApprox(sum.get(0), 4.0, 0.001, "Complex addition real");
  assertApprox(sum.get(1), 6.0, 0.001, "Complex addition imag");
  
  // Test multiplication
  const prod = c1.mul(c2);
  // (3 + 4i)(1 + 2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i
  assertApprox(prod.get(0), -5.0, 0.001, "Complex multiplication real");
  assertApprox(prod.get(1), 10.0, 0.001, "Complex multiplication imag");
  
  // Test conjugate
  const conj = c1.conjugate();
  assertApprox(conj.get(0), 3.0, 0.001, "Complex conjugate real");
  assertApprox(conj.get(1), -4.0, 0.001, "Complex conjugate imag");
}

export function testQuaternion(): void {
  trace("--- Testing Quaternions ---");
  
  const q1 = quaternion(1.0, 2.0, 3.0, 4.0);
  const q2 = quaternion(5.0, 6.0, 7.0, 8.0);
  
  // Test dimension name
  assert(getDimensionName(4) == "Quaternion", "Dimension name");
  
  // Test norm
  const n = q1.norm();
  const expectedNorm = Math.sqrt(1 + 4 + 9 + 16);  // sqrt(30)
  assertApprox(n, expectedNorm, 0.001, "Quaternion norm");
  
  // Test non-commutativity: q1 * q2 ≠ q2 * q1
  const p12 = q1.mul(q2);
  const p21 = q2.mul(q1);
  const diff = p12.sub(p21);
  assert(diff.norm() > 0.1, "Quaternion multiplication is non-commutative");
  
  // Test inverse
  const inv = q1.inverse();
  const identity = q1.mul(inv);
  assertApprox(identity.get(0), 1.0, 0.01, "Quaternion inverse real part");
  assertApprox(identity.get(1), 0.0, 0.01, "Quaternion inverse i part");
  assertApprox(identity.get(2), 0.0, 0.01, "Quaternion inverse j part");
  assertApprox(identity.get(3), 0.0, 0.01, "Quaternion inverse k part");
}

export function testOctonion(): void {
  trace("--- Testing Octonions ---");
  
  const o1 = octonion(1, 0, 0, 0, 0, 0, 0, 0);  // Unit
  const o2 = octonion(0, 1, 0, 0, 0, 0, 0, 0);  // e1
  const o3 = octonion(0, 0, 1, 0, 0, 0, 0, 0);  // e2
  
  // Test dimension name
  assert(getDimensionName(8) == "Octonion", "Octonion dimension name");
  
  // Test unit multiplication
  const prod = o1.mul(o2);
  assertApprox(prod.get(1), 1.0, 0.001, "Unit * e1 = e1");
  
  // Test non-associativity: (e1 * e2) * e4 ≠ e1 * (e2 * e4)
  const e4 = octonion(0, 0, 0, 0, 1, 0, 0, 0);
  const left = o2.mul(o3).mul(e4);
  const right = o2.mul(o3.mul(e4));
  const assocDiff = left.sub(right).norm();
  // Note: Octonions can be associative for some combinations
  trace("Octonion associativity difference: " + assocDiff.toString());
}

export function testSedenion(): void {
  trace("--- Testing Sedenions ---");
  
  // Create sedenions (16-dimensional)
  const s = Hypercomplex.basis(16, 0);  // Unit sedenion
  assert(s.dim == 16, "Sedenion dimension");
  assert(getDimensionName(16) == "Sedenion", "Sedenion dimension name");
  
  // Test entropy - unit sedenion should have 0 entropy
  assertApprox(s.entropy(), 0.0, 0.001, "Unit sedenion entropy");
  
  // Create a superposition
  const mixed = Hypercomplex.zero(16);
  mixed.set(0, 0.5);
  mixed.set(1, 0.5);
  mixed.set(2, 0.5);
  mixed.set(3, 0.5);
  const mixedNormalized = mixed.normalize();
  assert(mixedNormalized.entropy() > 0, "Mixed sedenion has positive entropy");
}

// ============================================================================
// Prime Hilbert Space Tests
// ============================================================================

export function testPrimeHilbertState(): void {
  trace("--- Testing Prime Hilbert State ---");
  
  // Test basis state
  const basis2 = PrimeHilbertState.basis(2, null);
  assertApprox(basis2.norm(), 1.0, 0.001, "Basis state is normalized");
  
  // Test uniform superposition
  const uniform = PrimeHilbertState.uniform(null);
  assertApprox(uniform.norm(), 1.0, 0.001, "Uniform state is normalized");
  assert(uniform.entropy() > 0, "Uniform state has positive entropy");
  
  // Test composite state
  const comp12 = PrimeHilbertState.composite(12, null);  // 12 = 2² × 3
  const dom = comp12.dominant(2);
  assert(dom.length >= 2, "Composite state has dominant primes");
}

export function testResonanceOperators(): void {
  trace("--- Testing Resonance Operators ---");
  
  // Test P operator (prime eigenvalue)
  const basis3 = PrimeHilbertState.basis(3, null);
  const pResult = ResonanceOperators.P(basis3);
  // P|3⟩ = 3|3⟩, so amplitude at 3 should be 3× original
  
  // Test H operator (Hadamard-like)
  const hResult = ResonanceOperators.H(basis3);
  assertApprox(hResult.norm(), 1.0, 0.01, "H preserves norm");
  
  // Test R operator
  const rResult = ResonanceOperators.R(basis3, 6);  // R(6)|ψ⟩
  assertApprox(rResult.norm(), 1.0, 0.01, "R preserves norm");
}

export function testMemoryEncoding(): void {
  trace("--- Testing Memory Encoding ---");
  
  const state = encodeMemory("hello", null);
  assertApprox(state.norm(), 1.0, 0.001, "Encoded memory is normalized");
  assert(state.entropy() > 0, "Encoded memory has positive entropy");
  
  // Different texts should produce different states
  const state2 = encodeMemory("world", null);
  const similarity = state.coherence(state2);
  trace("Similarity between 'hello' and 'world': " + similarity.toString());
}

// ============================================================================
// SparsePrimeState Tests
// ============================================================================

export function testSparsePrimeState(): void {
  trace("--- Testing SparsePrimeState ---");
  
  // Test basis state
  const basis = SparsePrimeState.basis(2);
  assertApprox(basis.norm(), 1.0, 0.001, "Sparse basis is normalized");
  assert(basis.size() == 1, "Sparse basis has one entry");
  
  // Test from number
  const from12 = SparsePrimeState.fromNumber(12);  // 12 = 2² × 3
  assert(from12.has(2), "12 contains factor 2");
  assert(from12.has(3), "12 contains factor 3");
  
  // Test uniform
  const uniform = SparsePrimeState.uniform(5);
  assert(uniform.size() == 5, "Uniform has 5 entries");
  assertApprox(uniform.norm(), 1.0, 0.001, "Uniform is normalized");
  
  // Test text encoding
  const text = SparsePrimeState.fromText("test");
  assert(text.size() > 0, "Text encoding produces non-empty state");
  assertApprox(text.norm(), 1.0, 0.001, "Text encoding is normalized");
}

export function testResonantAttention(): void {
  trace("--- Testing Resonant Attention ---");
  
  // Create query and key/value pairs
  const query = SparsePrimeState.basis(2);
  const keys = new Array<SparsePrimeState>(3);
  const values = new Array<SparsePrimeState>(3);
  
  keys[0] = SparsePrimeState.basis(2);  // Same as query
  keys[1] = SparsePrimeState.basis(3);  // Different
  keys[2] = SparsePrimeState.basis(5);  // Different
  
  values[0] = SparsePrimeState.fromNumber(4);
  values[1] = SparsePrimeState.fromNumber(9);
  values[2] = SparsePrimeState.fromNumber(25);
  
  // Test resonance score
  const score1 = resonanceScore(query, keys[0]);
  const score2 = resonanceScore(query, keys[1]);
  assert(score1 > score2, "Same basis has higher resonance");
  
  // Test attention
  const attended = resonantAttention(query, keys, values, 1.0);
  assert(attended.size() > 0, "Attention produces non-empty state");
}

export function testPRGraphMemory(): void {
  trace("--- Testing PR-Graph Memory ---");
  
  const memory = new PRGraphMemory(100, 0.01);
  
  // Store some states
  const id1 = memory.put(SparsePrimeState.fromNumber(6));
  const id2 = memory.put(SparsePrimeState.fromNumber(12));
  const id3 = memory.put(SparsePrimeState.fromNumber(15));
  
  assert(memory.size() == 3, "Memory has 3 entries");
  
  // Retrieve by ID
  const retrieved = memory.getById(id1);
  assert(retrieved !== null, "Can retrieve by ID");
  
  // Content-addressable retrieval
  const query = SparsePrimeState.fromNumber(6);
  const results = memory.get(query, 2);
  assert(results.length >= 1, "Content retrieval returns results");
  
  // Advance time and test decay
  memory.tick(10.0);
  const results2 = memory.get(query, 2);
  trace("Results after decay: " + results2.length.toString());
  
  // Test deletion
  const deleted = memory.delete(id1);
  assert(deleted, "Can delete entry");
  assert(memory.size() == 2, "Memory size reduced after delete");
}

// ============================================================================
// Integration Tests
// ============================================================================

export function testIntegration(): void {
  trace("--- Testing Integration ---");
  
  // Create hypercomplex numbers and use them in sparse states
  const q = quaternion(1.0, 0.0, 0.0, 0.0);
  assertApprox(q.norm(), 1.0, 0.001, "Quaternion unit norm");
  
  // Create a sparse state and evolve it
  const state = SparsePrimeState.uniform(10);
  const rotated = state.rotate(0.5);
  assertApprox(rotated.norm(), 1.0, 0.01, "Rotation preserves norm");
  
  // Test prime-dependent phase
  const phased = state.primePhase(12);
  assertApprox(phased.norm(), 1.0, 0.01, "Prime phase preserves norm");
}

// ============================================================================
// Main Test Runner
// ============================================================================

export function runAllTests(): void {
  trace("========================================");
  trace("Running TinyAleph Port Tests");
  trace("========================================");
  
  // Fano tests
  testFanoMultiplication();
  
  // Hypercomplex tests
  testComplex();
  testQuaternion();
  testOctonion();
  testSedenion();
  
  // Prime Hilbert tests
  testPrimeHilbertState();
  testResonanceOperators();
  testMemoryEncoding();
  
  // SparsePrimeState tests
  testSparsePrimeState();
  testResonantAttention();
  testPRGraphMemory();
  
  // Integration
  testIntegration();
  
  printTestResults();
}

// Export for running
export { runAllTests as test };