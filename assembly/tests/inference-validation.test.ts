import { parseEnochian, primesToEnochian } from "../enochian";
import { PrimeState } from "../quantum/prime-state";
import { QuantumConsciousnessResonance } from "../quantum/quantum-consciousness-resonance";
import { describe, test, expect } from "./mocks";

export function runInferenceTests(): void {
  console.log("\nInference Validation Tests");
  
  // Test 1: Round Trip
  console.log("  Test: Enochian Parsing Round-Trip");
  const input = "OL SONUF VAORESA"; // "I reign over"
  const parsed = parseEnochian(input);
  
  if (parsed.primes.length > 0) console.log("    PASS: Got primes");
  else console.error("    FAIL: No primes");
  
  const reconstructed = primesToEnochian(parsed.primes);
  if (reconstructed.length == parsed.primes.length) console.log("    PASS: Reconstructed length match");
  else console.error("    FAIL: Reconstruction mismatch");
  
  console.log(`    Input: ${input}`);
  console.log(`    Primes: ${parsed.primes.toString()}`);
  console.log(`    Reconstructed: ${reconstructed}`);

  // Test 2: Evolution
  console.log("  Test: Wave Function Evolution");
  const input2 = "MADRIAX"; // "Heaven"
  const parsed2 = parseEnochian(input2);
  
  const u32Primes = new Array<u32>(parsed2.primes.length);
  for(let i = 0; i < parsed2.primes.length; i++) {
    u32Primes[i] = <u32>parsed2.primes[i];
  }
  
  const state = PrimeState.fromPrimes(u32Primes);
  const initialEntropy = state.entropy();
  console.log(`    Initial Entropy: ${initialEntropy}`);
  
  const steps = 10;
  const dt = 0.1;
  
  for(let i = 0; i < steps; i++) {
    state.evolveWithEntropy(dt);
  }
  
  const finalEntropy = state.entropy();
  console.log(`    Final Entropy: ${finalEntropy}`);
  console.log(`    Entropy Change: ${finalEntropy - initialEntropy}`);

  // Test 3: Resonance
  console.log("  Test: Resonance Between Sentences");
  const s1 = PrimeState.fromPrimes([7, 11, 13]);
  const s2 = PrimeState.fromPrimes([7, 11, 17]);
  
  const resonance = new QuantumConsciousnessResonance([s1, s2], 0.5);
  
  const initialCoh1 = s1.globalCoherence;
  resonance.evolve(1.0);
  const finalCoh1 = s1.globalCoherence;
  
  if (finalCoh1 != initialCoh1) console.log("    PASS: Coherence changed due to resonance");
  else console.log("    WARN: Coherence did not change (check coupling logic)");
  
  console.log(`    Initial Coherence: ${initialCoh1}`);
  console.log(`    Final Coherence: ${finalCoh1}`);
}