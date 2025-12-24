// assembly/tests/utils.test.ts

import { entropyRate, align, generateSymbol, toFixed } from "../utils";
import { Phase } from "../resolang";

export function testEntropyRate(): void {
  const emptyRing: Array<Phase> = [];
  assert(entropyRate(emptyRing) == 0.0, "Entropy rate of empty ring should be 0.0");

  const phaseRing: Array<Phase> = [0.1, 0.5, 1.2];
  assert(entropyRate(phaseRing) != 0.0, "Entropy rate of non-empty ring should not be 0.0");
}

export function testAlign(): void {
  const emptyRing: Array<Phase> = [];
  assert(align(emptyRing).length == 0, "Aligning an empty ring should result in an empty ring");

  const phaseRing: Array<Phase> = [0.1, 0.5, 1.2];
  const aligned = align(phaseRing);
  assert(aligned.length == 3, "Aligned ring should have the same length");
  for (let i = 0; i < aligned.length; i++) {
    assert(aligned[i] == 0.0, "All phases in an aligned ring should be 0.0");
  }
}

export function testGenerateSymbol(): void {
  const primes1: Array<u32> = [2, 3, 5];
  const symbol1 = generateSymbol(primes1);
  const symbol2 = generateSymbol(primes1);
  assert(symbol1 == symbol2, "generateSymbol should be deterministic");

  const primes2: Array<u32> = [7, 11, 13];
  const symbol3 = generateSymbol(primes2);
  assert(symbol3.length == 3, "Generated symbol should be 3 characters long");
}

export function testToFixed(): void {
  assert(toFixed(3.14159) == "3.14", "toFixed should default to 2 decimal places");
  assert(toFixed(3.14159, 3) == "3.142", "toFixed should handle specified decimal places");
  assert(toFixed(1.5, 4) == "1.5000", "toFixed should add trailing zeros");
  assert(toFixed(5, 2) == "5.00", "toFixed should handle integers correctly");
}

export function runAllUtilsTests(): void {
  console.log("Running utils module tests...");

  testEntropyRate();
  console.log("✓ entropyRate test passed");

  testAlign();
  console.log("✓ align test passed");

  testGenerateSymbol();
  console.log("✓ generateSymbol test passed");

  testToFixed();
  console.log("✓ toFixed test passed");

  console.log("\nAll utils module tests passed! ✨");
}