import { EntangledQuaternionPair, QuaternionicSynchronizer, QuaternionicAgent, transmitQuaternionicMessage } from "../quaternion-entanglement";
import { Quaternion } from "../quaternion"; // Use actual Quaternion

export function testEntangledQuaternionPairConstructor(): void {
  const q1 = new Quaternion(1, 0, 0, 0);
  const q2 = new Quaternion(0, 1, 0, 0);
  const pair = new EntangledQuaternionPair(q1, q2, 0.7);

  assert(pair.getQuaternions()[0].w == q1.w, "Quaternion 1 should be set");
  assert(pair.getQuaternions()[1].x == q2.x, "Quaternion 2 should be set");
}

export function testEntangledQuaternionPairEvolve(): void {
  const q1 = new Quaternion(1, 0.1, 0.2, 0.3); // Add small imaginary components
  const q2 = new Quaternion(0, 0.4, 0.5, 0.6); // Add small imaginary components
  const pair = new EntangledQuaternionPair(q1, q2, 0.5);

  const initialQ1 = q1.clone();
  const initialQ2 = q2.clone();

  pair.evolve(0.01); // Small time step

  const evolvedQ1 = pair.getQuaternions()[0];
  const evolvedQ2 = pair.getQuaternions()[1];

  assert(evolvedQ1.w != initialQ1.w || evolvedQ1.x != initialQ1.x || evolvedQ1.y != initialQ1.y || evolvedQ1.z != initialQ1.z, "Quaternion 1 should evolve");
  assert(evolvedQ2.w != initialQ2.w || evolvedQ2.x != initialQ2.x || evolvedQ2.y != initialQ2.y || evolvedQ2.z != initialQ2.z, "Quaternion 2 should evolve");
}

export function testEntangledQuaternionPairComputeFidelity(): void {
  const q1 = new Quaternion(1, 0, 0, 0);
  const q2 = new Quaternion(0, 1, 0, 0);
  const pair1 = new EntangledQuaternionPair(q1, q2);

  const q3 = new Quaternion(1, 0, 0, 0);
  const q4 = new Quaternion(0, 1, 0, 0);
  const pair2 = new EntangledQuaternionPair(q3, q4);

  const fidelity = pair1.computeFidelity(pair2);
  assert(fidelity == 1.0, "Fidelity of identical pairs should be 1.0");

  const q5 = new Quaternion(0, 0, 1, 0);
  const q6 = new Quaternion(0, 0, 0, 1);
  const pair3 = new EntangledQuaternionPair(q5, q6);

  const fidelity2 = pair1.computeFidelity(pair3);
  assert(fidelity2 == 0.0, "Fidelity of orthogonal pairs should be 0.0");
}

export function testEntangledQuaternionPairOptimizeEntanglement(): void {
  const q1 = new Quaternion(1, 0, 0, 0);
  const q2 = new Quaternion(0, 1, 0, 0);
  const pair = new EntangledQuaternionPair(q1, q2, 0.1); // Low initial coupling

  const targetQ1 = new Quaternion(1, 0, 0, 0);
  const targetQ2 = new Quaternion(0, 1, 0, 0);
  const targetPair = new EntangledQuaternionPair(targetQ1, targetQ2, 1.0); // High target coupling

  const initialFidelity = pair.computeFidelity(targetPair);
  pair.optimizeEntanglement(targetPair, 10); // Run a few iterations
  const finalFidelity = pair.computeFidelity(targetPair);

  assert(finalFidelity >= initialFidelity, "Fidelity should improve or stay same after optimization");
}

export function runAllQuaternionEntanglementTests(): void {
  console.log("Running quaternion entanglement tests...");

  testEntangledQuaternionPairConstructor();
  console.log("✓ testEntangledQuaternionPairConstructor passed");

  testEntangledQuaternionPairEvolve();
  console.log("✓ testEntangledQuaternionPairEvolve passed");

  testEntangledQuaternionPairComputeFidelity();
  console.log("✓ testEntangledQuaternionPairComputeFidelity passed");

  testEntangledQuaternionPairOptimizeEntanglement();
  console.log("✓ testEntangledQuaternionPairOptimizeEntanglement passed");

  console.log("\nAll quaternion entanglement tests passed! ✨");
}