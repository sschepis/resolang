import { superpose, measure, collapse } from "../quantum-ops-impl";
import { PrimeState } from "../quantum/prime-state"; // Corrected path
import { Complex } from "../types"; // Import Complex

export function testSuperposeOperation(): void {
  const amps1 = new Map<u32, f64>();
  amps1.set(2, 0.6);
  amps1.set(3, 0.8);
  const state1 = PrimeState.fromAmplitudes(amps1);

  const amps2 = new Map<u32, f64>();
  amps2.set(3, 0.5);
  amps2.set(5, 0.7);
  const state2 = PrimeState.fromAmplitudes(amps2);

  const superposed = superpose([state1, state2]);

  // Check if primes are combined
  assert(superposed.amplitudes.has(2), "Superposed state should have prime 2");
  assert(superposed.amplitudes.has(3), "Superposed state should have prime 3");
  assert(superposed.amplitudes.has(5), "Superposed state should have prime 5");

  // Check normalization (sum of squares should be approximately 1)
  let sumOfSquares = 0.0;
  const primes = superposed.amplitudes.keys();
  for (let i = 0; i < primes.length; i++) {
    const amp = superposed.amplitudes.get(primes[i]);
    sumOfSquares += amp * amp;
  }
  assert(Math.abs(sumOfSquares - 1.0) < 0.0001, "Superposed state should be normalized");
}

export function testMeasureOperation(): void {
  const amps = new Map<u32, f64>();
  amps.set(2, 0.6); // P = 0.36
  amps.set(3, 0.8); // P = 0.64
  const state = PrimeState.fromAmplitudes(amps);

  // Since Math.random() is not mockable in AssemblyScript directly,
  // this test will have a probabilistic nature.
  // We'll run it multiple times and assert that the measured prime is one of the expected ones.
  const iterations = 100;
  let prime2Count = 0;
  let prime3Count = 0;

  for (let i = 0; i < iterations; i++) {
    const measuredPrime = measure(state);
    if (measuredPrime == 2) {
      prime2Count++;
    } else if (measuredPrime == 3) {
      prime3Count++;
    } else {
      assert(false, "Measured an unexpected prime");
    }
  }

  // Assert that both primes were measured at least once (highly probable over 100 iterations)
  assert(prime2Count > 0, "Prime 2 should be measured at least once");
  assert(prime3Count > 0, "Prime 3 should be measured at least once");
}

export function testCollapseOperation(): void {
  const amps = new Map<u32, f64>();
  amps.set(2, 0.6);
  amps.set(3, 0.8);
  amps.set(5, 0.1);
  const state = PrimeState.fromAmplitudes(amps);

  const collapsedTo3 = collapse(state, 3);

  assert(collapsedTo3.amplitudes.size == 1, "Collapsed state should have only one prime with non-zero amplitude");
  assert(collapsedTo3.amplitudes.has(3), "Collapsed state should contain the collapsed prime");
  assert(collapsedTo3.amplitudes.get(3) == 1.0, "Amplitude of collapsed prime should be 1.0");
}

export function runAllQuantumOpsImplTests(): void {
  console.log("Running quantum operations implementation tests...");

  testSuperposeOperation();
  console.log("✓ testSuperposeOperation passed");

  testMeasureOperation();
  console.log("✓ testMeasureOperation passed");

  testCollapseOperation();
  console.log("✓ testCollapseOperation passed");

  console.log("\nAll quantum operations implementation tests passed! ✨");
}