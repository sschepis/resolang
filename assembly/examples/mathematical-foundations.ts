// mathematical-foundations.ts
// Demonstrates the mathematical foundations underlying ResoLang

import {
  Complex,
  PrimeFieldElement,
  Prime,
  Phase,
  Amplitude,
  Entropy
} from "../types";
import {
  isPrime,
  gcd,
  modularExponentiation,
  millerRabin,
  montgomeryMultiplication
} from "../core/math-optimized";
import {
  generatePrime,
  nextPrime,
  primeFactorization
} from "../core/math-primes";
import {
  Quaternion,
  QuaternionEntanglement
} from "../quaternion";
import { toFixed } from "../utils";

/**
 * Example: Complex Number Operations
 * Shows the complex arithmetic underlying quantum computations
 */
export function exampleComplexArithmetic(): void {
  console.log("=== Complex Number Operations Example ===");
  
  // Create complex numbers representing quantum amplitudes
  const amplitude1 = new Complex(0.6, 0.8); // |amplitude| = 1.0
  const amplitude2 = new Complex(0.8, 0.6);
  const phaseRotation = Complex.fromPolar(1.0, Math.PI / 4); // 45° rotation
  
  console.log(`Amplitude 1: ${amplitude1.toString()}`);
  console.log(`Amplitude 2: ${amplitude2.toString()}`);
  console.log(`Phase rotation: ${phaseRotation.toString()}`);
  
  // Demonstrate complex operations
  const sum = amplitude1.add(amplitude2);
  const product = amplitude1.multiply(amplitude2);
  const rotated = amplitude1.multiply(phaseRotation);
  
  console.log(`Sum: ${sum.toString()}`);
  console.log(`Product: ${product.toString()}`);
  console.log(`Rotated amplitude: ${rotated.toString()}`);
  
  // Show magnitude and phase calculations
  console.log(`Amplitude 1 magnitude: ${toFixed(amplitude1.magnitude(), 4)}`);
  console.log(`Amplitude 1 phase: ${toFixed(amplitude1.phase(), 4)} radians`);
  console.log(`Product magnitude: ${toFixed(product.magnitude(), 4)}`);
  console.log(`Product phase: ${toFixed(product.phase(), 4)} radians`);
  
  // Demonstrate normalization (important for quantum states)
  const unnormalized = new Complex(3.0, 4.0);
  const normalized = unnormalized.scale(1.0 / unnormalized.magnitude());
  console.log(`Unnormalized: ${unnormalized.toString()}, magnitude: ${toFixed(unnormalized.magnitude(), 4)}`);
  console.log(`Normalized: ${normalized.toString()}, magnitude: ${toFixed(normalized.magnitude(), 4)}`);
}

/**
 * Example: Prime Number Theory
 * Demonstrates the prime-based mathematics central to ResoLang
 */
export function examplePrimeTheory(): void {
  console.log("\n=== Prime Number Theory Example ===");
  
  // Test primality of various numbers
  const candidates = [97, 98, 99, 100, 101];
  console.log("Primality testing:");
  for (let i = 0; i < candidates.length; i++) {
    const num = candidates[i];
    const prime = isPrime(num);
    console.log(`  ${num}: ${prime ? "prime" : "composite"}`);
  }
  
  // Generate prime numbers
  console.log("\nGenerating primes:");
  const primeCount = 10;
  let current = 2;
  for (let i = 0; i < primeCount; i++) {
    console.log(`  Prime ${i + 1}: ${current}`);
    current = nextPrime(current);
  }
  
  // Prime factorization
  const composite = 2310; // 2 × 3 × 5 × 7 × 11
  console.log(`\nFactorizing ${composite}:`);
  const factors = primeFactorization(composite);
  console.log(`  Factors: [${factors.join(" × ")}]`);
  
  // Demonstrate modular arithmetic (crucial for cryptography)
  const base = 5;
  const exponent = 100;
  const modulus = 97; // prime modulus
  const result = modularExponentiation(base, exponent, modulus);
  console.log(`\nModular exponentiation: ${base}^${exponent} mod ${modulus} = ${result}`);
  
  // Greatest Common Divisor
  const a = 48;
  const b = 18;
  const gcdResult = gcd(a, b);
  console.log(`\nGCD(${a}, ${b}) = ${gcdResult}`);
}

/**
 * Example: Prime Field Arithmetic
 * Shows finite field operations used in cryptography
 */
export function examplePrimeFields(): void {
  console.log("\n=== Prime Field Arithmetic Example ===");
  
  const p = 97; // Prime modulus
  console.log(`Working in prime field F_${p}`);
  
  // Create field elements
  const a = new PrimeFieldElement(23, p);
  const b = new PrimeFieldElement(45, p);
  const c = new PrimeFieldElement(67, p);
  
  console.log(`a = ${a.value}, b = ${b.value}, c = ${c.value}`);
  
  // Field operations
  const sum = a.add(b);
  const product = a.multiply(b);
  const power = a.power(10);
  
  console.log(`a + b = ${sum.value}`);
  console.log(`a × b = ${product.value}`);
  console.log(`a^10 = ${power.value}`);
  
  // Multiplicative inverse (exists for all non-zero elements in prime fields)
  try {
    const aInverse = a.inverse();
    const verification = a.multiply(aInverse);
    console.log(`a^(-1) = ${aInverse.value}`);
    console.log(`a × a^(-1) = ${verification.value} (should be 1)`);
  } catch (e) {
    console.log("Error computing inverse:", e.message);
  }
  
  // Demonstrate field polynomial evaluation: f(x) = ax² + bx + c
  const x = new PrimeFieldElement(10, p);
  const x_squared = x.multiply(x);
  const ax_squared = a.multiply(x_squared);
  const bx = b.multiply(x);
  const polynomial_result = ax_squared.add(bx).add(c);
  
  console.log(`Polynomial f(10) = ${a.value}×10² + ${b.value}×10 + ${c.value} = ${polynomial_result.value} (mod ${p})`);
}

/**
 * Example: Quaternion Operations
 * Demonstrates quaternion algebra for 3D rotations and advanced entanglement
 */
export function exampleQuaternionMath(): void {
  console.log("\n=== Quaternion Mathematics Example ===");
  
  // Create quaternions representing rotations
  const q1 = new Quaternion(1.0, 0.5, 0.3, 0.2); // w, x, y, z
  const q2 = new Quaternion(0.8, 0.4, 0.6, 0.1);
  
  console.log(`q1 = ${q1.toString()}`);
  console.log(`q2 = ${q2.toString()}`);
  
  // Normalize quaternions (unit quaternions represent rotations)
  const q1_norm = q1.normalize();
  const q2_norm = q2.normalize();
  
  console.log(`q1 normalized: ${q1_norm.toString()}`);
  console.log(`q1 norm: ${toFixed(q1_norm.norm(), 4)}`);
  
  // Quaternion multiplication (composition of rotations)
  const composition = q1_norm.multiply(q2_norm);
  console.log(`q1 ∘ q2 = ${composition.toString()}`);
  
  // Quaternion conjugate and inverse
  const q1_conj = q1_norm.conjugate();
  const q1_inv = q1_norm.inverse();
  
  console.log(`q1* (conjugate) = ${q1_conj.toString()}`);
  console.log(`q1^(-1) = ${q1_inv.toString()}`);
  
  // Verify inverse: q × q^(-1) = 1
  const identity_check = q1_norm.multiply(q1_inv);
  console.log(`q1 × q1^(-1) = ${identity_check.toString()} (should be ~(1,0,0,0))`);
  
  // Convert to rotation matrix representation
  const matrix = q1_norm.toRotationMatrix();
  console.log("Rotation matrix:");
  for (let i = 0; i < 3; i++) {
    const row = `[${toFixed(matrix[i * 3], 3)}, ${toFixed(matrix[i * 3 + 1], 3)}, ${toFixed(matrix[i * 3 + 2], 3)}]`;
    console.log(`  ${row}`);
  }
}

/**
 * Example: Quantum Entanglement Mathematics
 * Shows the mathematical foundations of quantum entanglement in ResoLang
 */
export function exampleEntanglementMath(): void {
  console.log("\n=== Quantum Entanglement Mathematics Example ===");
  
  // Create entangled quaternion system
  const entanglement = new QuaternionEntanglement();
  
  // Add quaternion pairs representing entangled particles
  const particle1a = new Quaternion(0.6, 0.8, 0.0, 0.0).normalize();
  const particle1b = new Quaternion(0.8, -0.6, 0.0, 0.0).normalize(); // Entangled pair
  
  const particle2a = new Quaternion(0.5, 0.5, 0.5, 0.5);
  const particle2b = new Quaternion(0.5, -0.5, -0.5, -0.5);
  
  entanglement.addPair(particle1a, particle1b);
  entanglement.addPair(particle2a, particle2b);
  
  console.log(`Created entanglement system with ${entanglement.getPairCount()} entangled pairs`);
  
  // Calculate entanglement fidelity
  const fidelity = entanglement.calculateFidelity();
  console.log(`Entanglement fidelity: ${toFixed(fidelity, 4)}`);
  
  // Measure correlations
  const correlations = entanglement.measureCorrelations();
  console.log(`Correlation measurements:`);
  for (let i = 0; i < correlations.length; i++) {
    console.log(`  Pair ${i + 1}: ${toFixed(correlations[i], 4)}`);
  }
  
  // Demonstrate Bell state analysis
  const bellState = entanglement.generateBellState(0); // |Φ+⟩ state
  console.log(`Bell state |Φ+⟩: ${bellState.toString()}`);
  
  // Quantum teleportation calculation
  const targetState = new Quaternion(0.3, 0.4, 0.5, 0.6).normalize();
  const teleported = entanglement.simulateTeleportation(targetState, 0);
  
  console.log(`Original state: ${targetState.toString()}`);
  console.log(`Teleported state: ${teleported.toString()}`);
  
  // Calculate teleportation fidelity
  const teleportationFidelity = targetState.dot(teleported);
  console.log(`Teleportation fidelity: ${toFixed(Math.abs(teleportationFidelity), 4)}`);
}

/**
 * Example: Cryptographic Mathematics
 * Shows the mathematical foundations for quantum-resistant cryptography
 */
export function exampleCryptographicMath(): void {
  console.log("\n=== Cryptographic Mathematics Example ===");
  
  // Demonstrate large prime generation for cryptographic keys
  console.log("Generating cryptographic primes:");
  
  const keySize = 64; // bits (simplified for example)
  const minValue = Math.pow(2, keySize - 1);
  const maxValue = Math.pow(2, keySize) - 1;
  
  // Find primes in cryptographic range
  let p = Math.floor(minValue + Math.random() * (maxValue - minValue));
  while (!isPrime(p)) {
    p++;
  }
  
  let q = Math.floor(minValue + Math.random() * (maxValue - minValue));
  while (!isPrime(q) || q === p) {
    q++;
  }
  
  console.log(`Prime p: ${p}`);
  console.log(`Prime q: ${q}`);
  
  // RSA-like construction
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  console.log(`n = p × q = ${n}`);
  console.log(`φ(n) = ${phi}`);
  
  // Choose public exponent (commonly 65537)
  const e = 65537;
  console.log(`Public exponent e: ${e}`);
  
  // Verify gcd(e, φ(n)) = 1
  const gcd_check = gcd(e, phi);
  console.log(`gcd(e, φ(n)) = ${gcd_check} (should be 1 for valid key)`);
  
  // Demonstrate Montgomery multiplication for efficient modular arithmetic
  const a_mont = 12345;
  const b_mont = 67890;
  const mod_mont = 97;
  
  const montgomery_result = montgomeryMultiplication(a_mont, b_mont, mod_mont);
  const regular_result = (a_mont * b_mont) % mod_mont;
  
  console.log(`\nMontgomery multiplication demo:`);
  console.log(`${a_mont} × ${b_mont} mod ${mod_mont}:`);
  console.log(`  Montgomery method: ${montgomery_result}`);
  console.log(`  Regular method: ${regular_result}`);
  console.log(`  Results match: ${montgomery_result === regular_result}`);
}

/**
 * Example: Statistical and Information Theory
 * Shows entropy calculations and information-theoretic measures
 */
export function exampleInformationTheory(): void {
  console.log("\n=== Information Theory Example ===");
  
  // Create probability distributions for quantum states
  const distribution1 = [0.5, 0.3, 0.15, 0.05]; // 4-state system
  const distribution2 = [0.25, 0.25, 0.25, 0.25]; // Uniform distribution
  const distribution3 = [0.9, 0.05, 0.03, 0.02]; // Highly concentrated
  
  console.log("Probability distributions:");
  console.log(`  Dist 1: [${distribution1.map(p => toFixed(p, 3)).join(", ")}]`);
  console.log(`  Dist 2: [${distribution2.map(p => toFixed(p, 3)).join(", ")}]`);
  console.log(`  Dist 3: [${distribution3.map(p => toFixed(p, 3)).join(", ")}]`);
  
  // Calculate Shannon entropy: H = -Σ p_i log₂(p_i)
  function shannonEntropy(probs: f64[]): f64 {
    let entropy = 0.0;
    for (let i = 0; i < probs.length; i++) {
      if (probs[i] > 0) {
        entropy -= probs[i] * Math.log2(probs[i]);
      }
    }
    return entropy;
  }
  
  const h1 = shannonEntropy(distribution1);
  const h2 = shannonEntropy(distribution2);
  const h3 = shannonEntropy(distribution3);
  
  console.log("\nShannon entropies:");
  console.log(`  H(Dist 1) = ${toFixed(h1, 4)} bits`);
  console.log(`  H(Dist 2) = ${toFixed(h2, 4)} bits (maximum for 4 states)`);
  console.log(`  H(Dist 3) = ${toFixed(h3, 4)} bits (minimum uncertainty)`);
  
  // Von Neumann entropy for quantum states (simplified)
  // For a pure state ρ = |ψ⟩⟨ψ|, S = -Tr(ρ log ρ) = 0
  // For mixed states, it's more complex
  
  console.log("\nQuantum state analysis:");
  console.log("  Pure state entropy: 0 (perfectly determined)");
  console.log(`  Mixed state entropy: ${toFixed(h1, 4)} (classical mixture)`);
  console.log(`  Maximally mixed entropy: ${toFixed(h2, 4)} (maximum uncertainty)`);
  
  // Mutual information example
  // I(X;Y) = H(X) + H(Y) - H(X,Y)
  const jointEntropy = 3.2; // Hypothetical joint entropy
  const mutualInfo = h1 + h1 - jointEntropy;
  
  console.log(`\nMutual information example:`);
  console.log(`  I(X;Y) = ${toFixed(mutualInfo, 4)} bits (shared information)`);
}

/**
 * Run all mathematical foundation examples
 */
export function runAllMathExamples(): void {
  console.log("=== Running All Mathematical Foundation Examples ===\n");
  
  exampleComplexArithmetic();
  examplePrimeTheory();
  examplePrimeFields();
  exampleQuaternionMath();
  exampleEntanglementMath();
  exampleCryptographicMath();
  exampleInformationTheory();
  
  console.log("\n=== All Mathematical Examples Completed ===");
}