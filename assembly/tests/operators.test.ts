import {
  tensor,
  collapse,
  rotatePhase,
  linkEntanglement,
  route,
  coherence,
  entropy,
} from "../operators";
import {
  EntangledNode,
  ResonantFragment,
  PI,
} from "../resolang";

function createTestFragment(coeffs: Map<u32, f64>, centerX: f64, centerY: f64, entropyValue: f64): ResonantFragment {
  return new ResonantFragment(coeffs, centerX, centerY, entropyValue);
}

function createTestNode(id: string, p1: u32, p2: u32, p3: u32, coherenceValue: f64, phaseRing: f64[]): EntangledNode {
  const node = new EntangledNode(id, p1, p2, p3);
  node.coherence = coherenceValue;
  node.phaseRing = phaseRing;
  return node;
}

export function testTensorOperation(): void {
  const coeffsA = new Map<u32, f64>();
  coeffsA.set(2, 0.5);
  coeffsA.set(3, 0.3);
  const fragmentA = createTestFragment(coeffsA, 1.0, 2.0, 0.5);

  const coeffsB = new Map<u32, f64>();
  coeffsB.set(3, 0.2);
  coeffsB.set(5, 0.7);
  const fragmentB = createTestFragment(coeffsB, 3.0, 4.0, 0.8);

  const result = tensor(fragmentA, fragmentB);
  
  assert(result.coeffs.has(2), "Result should contain prime 2 from fragment A");
  assert(result.coeffs.has(3), "Result should contain prime 3 from both fragments");
  assert(result.coeffs.has(5), "Result should contain prime 5 from fragment B");
  assert(result.entropy >= 0, "Entropy should be non-negative");
}

export function testCollapseOperation(): void {
  const coeffs = new Map<u32, f64>();
  coeffs.set(2, 0.6);
  coeffs.set(3, 0.8);
  const fragment = createTestFragment(coeffs, 1.0, 2.0, 1.2);

  const collapsed = collapse(fragment);
  
  assert(collapsed.coeffs.size == 1, "Collapsed fragment should have exactly one coefficient");
  assert(collapsed.entropy == 0.0, "Collapsed fragment should have zero entropy");
  assert(collapsed.center[0] == fragment.center[0], "Center X should be preserved");
  assert(collapsed.center[1] == fragment.center[1], "Center Y should be preserved");
  
  // Check that the selected prime has amplitude 1.0
  const keys = collapsed.coeffs.keys();
  if (keys.length > 0) {
    const selectedPrime = keys[0];
    assert(collapsed.coeffs.get(selectedPrime) == 1.0, "Selected prime should have amplitude 1.0");
  }
}

export function testRotatePhaseOperation(): void {
  const node = createTestNode("testNode", 2, 3, 5, 0.8, [0.5, 1.0, 1.5]);
  const initialCoherence = node.coherence;
  const phaseShift = PI / 4;
  
  rotatePhase(node, phaseShift);
  
  assert(node.phaseRing[0] > 0.5, "First phase should be shifted");
  assert(node.phaseRing[1] > 1.0, "Second phase should be shifted");
  assert(node.phaseRing[2] > 1.5, "Third phase should be shifted");
  assert(node.coherence < initialCoherence, "Coherence should be slightly reduced");
  
  // Check that phases are wrapped correctly
  for (let i = 0; i < node.phaseRing.length; i++) {
    assert(node.phaseRing[i] >= 0 && node.phaseRing[i] < 2 * PI, "Phases should be wrapped to [0, 2π)");
  }
}

export function testLinkEntanglementSuccess(): void {
  const nodeA = createTestNode("nodeA", 2, 3, 5, 0.9, [1.0, 2.0, 3.0]);
  const nodeB = createTestNode("nodeB", 7, 11, 13, 0.85, [1.1, 2.1, 3.1]);
  
  const initialCoherenceA = nodeA.coherence;
  const initialCoherenceB = nodeB.coherence;
  
  linkEntanglement(nodeA, nodeB);
  
  // With high coherence and low phase difference, entanglement should succeed
  assert(nodeA.coherence >= initialCoherenceA, "Node A coherence should not decrease");
  assert(nodeB.coherence >= initialCoherenceB, "Node B coherence should not decrease");
}

export function testLinkEntanglementFailure(): void {
  const nodeA = createTestNode("nodeA", 2, 3, 5, 0.3, [1.0, 2.0, 3.0]);
  const nodeB = createTestNode("nodeB", 7, 11, 13, 0.4, [4.0, 5.0, 6.0]);
  
  const initialCoherenceA = nodeA.coherence;
  const initialCoherenceB = nodeB.coherence;
  
  linkEntanglement(nodeA, nodeB);
  
  // With low coherence and high phase difference, entanglement should fail
  assert(nodeA.coherence == initialCoherenceA, "Node A coherence should remain unchanged");
  assert(nodeB.coherence == initialCoherenceB, "Node B coherence should remain unchanged");
}

export function testRouteSuccess(): void {
  const source = createTestNode("source", 2, 3, 5, 0.9, []);
  const intermediate = createTestNode("intermediate", 7, 11, 13, 0.8, []);
  const target = createTestNode("target", 17, 19, 23, 0.85, []);
  
  const viaNodes = [intermediate];
  const result = route(source, target, viaNodes);
  
  assert(result == true, "Route should succeed with high coherence nodes");
}

export function testRouteFailure(): void {
  const source = createTestNode("source", 2, 3, 5, 0.4, []);
  const intermediate = createTestNode("intermediate", 7, 11, 13, 0.1, []);
  const target = createTestNode("target", 17, 19, 23, 0.3, []);
  
  const viaNodes = [intermediate];
  const result = route(source, target, viaNodes);
  
  assert(result == false, "Route should fail with low coherence nodes");
}

export function testCoherenceHelper(): void {
  const node = createTestNode("testNode", 2, 3, 5, 0.75, []);
  const result = coherence(node);
  
  assert(result == 0.75, "Coherence helper should return the node's coherence value");
}

export function testEntropyHelper(): void {
  const coeffs = new Map<u32, f64>();
  coeffs.set(2, 0.5);
  const fragment = createTestFragment(coeffs, 0, 0, 1.23);
  const result = entropy(fragment);
  
  assert(result == 1.23, "Entropy helper should return the fragment's entropy value");
}

export function runAllOperatorTests(): void {
  console.log("Running operator tests...");

  testTensorOperation();
  console.log("✓ testTensorOperation passed");

  testCollapseOperation();
  console.log("✓ testCollapseOperation passed");

  testRotatePhaseOperation();
  console.log("✓ testRotatePhaseOperation passed");

  testLinkEntanglementSuccess();
  console.log("✓ testLinkEntanglementSuccess passed");

  testLinkEntanglementFailure();
  console.log("✓ testLinkEntanglementFailure passed");

  testRouteSuccess();
  console.log("✓ testRouteSuccess passed");

  testRouteFailure();
  console.log("✓ testRouteFailure passed");

  testCoherenceHelper();
  console.log("✓ testCoherenceHelper passed");

  testEntropyHelper();
  console.log("✓ testEntropyHelper passed");

  console.log("\nAll operator tests passed! ✨");
}