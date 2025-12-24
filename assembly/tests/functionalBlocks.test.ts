import {
  stabilize,
  teleport,
  entangled,
  observe,
} from "../functionalBlocks";
import {
  EntangledNode,
  ResonantFragment,
  setCurrentNode,
  currentNode,
  Phase,
} from "../resolang";
import { arrayEquals } from "../core/arrays";

function createTestNode(id: string, p1: u32, p2: u32, p3: u32, coherence: f64, phaseRing: f64[]): EntangledNode {
  const node = new EntangledNode(id, p1, p2, p3);
  node.coherence = coherence;
  node.phaseRing = phaseRing;
  return node;
}

export function testStabilizeShouldReturnTrueForStableNode(): void {
  const nodeA = createTestNode("nodeA", 2, 3, 5, 0.95, [0.1, 0.2, 0.3, 0.2, 0.1]);
  const initialCoherence = nodeA.coherence;
  const result = stabilize(nodeA);
  assert(result == true, "stabilize should return true for a stable node");
  assert(nodeA.coherence > initialCoherence, "coherence should be boosted on stabilization");
}

export function testStabilizeShouldReturnFalseForUnstableNode(): void {
  const nodeA = createTestNode("nodeA", 2, 3, 5, 0.5, [0.1, 0.9, 0.2, 0.8, 0.3]);
  const result = stabilize(nodeA);
  assert(result == false, "stabilize should return false for an unstable node");
}

export function testTeleportShouldSucceed(): void {
  const nodeA = createTestNode("nodeA", 2, 3, 5, 0.9, []);
  const nodeB = createTestNode("nodeB", 7, 11, 13, 0.9, []);
  const coeffs = new Map<u32, f64>();
  coeffs.set(2, 0.5);
  const fragment = new ResonantFragment(coeffs, 0, 0, 0.1);
  
  setCurrentNode(nodeA);
  const result = teleport(fragment, nodeB);
  assert(result == true, "teleport should succeed when nodes are entangled and target is coherent");
  
  setCurrentNode(null);
}

export function testTeleportShouldFailWithNoCurrentNode(): void {
    const nodeB = createTestNode("nodeB", 7, 11, 13, 0.9, []);
    const coeffs = new Map<u32, f64>();
    coeffs.set(2, 0.5);
    const fragment = new ResonantFragment(coeffs, 0, 0, 0.1);
    
    setCurrentNode(null);

    const result = teleport(fragment, nodeB);
    assert(result == false, "teleport should fail if no current node is set");
}

export function testTeleportShouldFailIfNotEntangled(): void {
    const nodeA = createTestNode("nodeA", 2, 3, 5, 0.5, []);
    const nodeB = createTestNode("nodeB", 7, 11, 13, 0.9, []);
    const coeffs = new Map<u32, f64>();
    coeffs.set(2, 0.5);
    const fragment = new ResonantFragment(coeffs, 0, 0, 0.1);
    
    setCurrentNode(nodeA);
    const result = teleport(fragment, nodeB);
    assert(result == false, "teleport should fail if nodes are not entangled");
    setCurrentNode(null);
}

export function testTeleportShouldFailIfTargetNotCoherent(): void {
    const nodeA = createTestNode("nodeA", 2, 3, 5, 0.9, []);
    const nodeB = createTestNode("nodeB", 7, 11, 13, 0.5, []);
    const coeffs = new Map<u32, f64>();
    coeffs.set(2, 0.5);
    const fragment = new ResonantFragment(coeffs, 0, 0, 0.1);
    
    setCurrentNode(nodeA);
    const result = teleport(fragment, nodeB);
    assert(result == false, "teleport should fail if target node is not coherent");
    setCurrentNode(null);
}

export function testEntangledShouldReturnTrueForCoherentNodes(): void {
    const nodeA = createTestNode("nodeA", 2, 3, 5, 0.85, []);
    const nodeB = createTestNode("nodeB", 7, 11, 13, 0.85, []);
    const result = entangled(nodeA, nodeB);
    assert(result == true, "entangled should return true for two coherent nodes");
}

export function testEntangledShouldReturnFalseForIncoherentNode(): void {
    const nodeA = createTestNode("nodeA", 2, 3, 5, 0.85, []);
    const nodeB = createTestNode("nodeB", 7, 11, 13, 0.75, []);
    const result = entangled(nodeA, nodeB);
    assert(result == false, "entangled should return false if one node is not coherent");
}

export function testObserveShouldReturnPhaseRingForCoherentNode(): void {
    const nodeA = createTestNode("nodeA", 2, 3, 5, 0.8, [1.0, 2.0, 3.0]);
    const observedPhases = observe(nodeA);
    assert(observedPhases.length == 3, "observe should return the correct number of phases");
    assert(arrayEquals(observedPhases, [1.0, 2.0, 3.0]), "observe should return the correct phase ring");
}

export function testObserveShouldReturnEmptyArrayForIncoherentNode(): void {
    const nodeA = createTestNode("nodeA", 2, 3, 5, 0.5, []);
    const observedPhases = observe(nodeA);
    assert(observedPhases.length == 0, "observe should return an empty array for a non-coherent node");
}

export function runAllFunctionalBlocksTests(): void {
  console.log("Running functional blocks tests...");

  testStabilizeShouldReturnTrueForStableNode();
  console.log("✓ testStabilizeShouldReturnTrueForStableNode passed");

  testStabilizeShouldReturnFalseForUnstableNode();
  console.log("✓ testStabilizeShouldReturnFalseForUnstableNode passed");

  testTeleportShouldSucceed();
  console.log("✓ testTeleportShouldSucceed passed");

  testTeleportShouldFailWithNoCurrentNode();
  console.log("✓ testTeleportShouldFailWithNoCurrentNode passed");

  testTeleportShouldFailIfNotEntangled();
  console.log("✓ testTeleportShouldFailIfNotEntangled passed");

  testTeleportShouldFailIfTargetNotCoherent();
  console.log("✓ testTeleportShouldFailIfTargetNotCoherent passed");

  testEntangledShouldReturnTrueForCoherentNodes();
  console.log("✓ testEntangledShouldReturnTrueForCoherentNodes passed");

  testEntangledShouldReturnFalseForIncoherentNode();
  console.log("✓ testEntangledShouldReturnFalseForIncoherentNode passed");

  testObserveShouldReturnPhaseRingForCoherentNode();
  console.log("✓ testObserveShouldReturnPhaseRingForCoherentNode passed");

  testObserveShouldReturnEmptyArrayForIncoherentNode();
  console.log("✓ testObserveShouldReturnEmptyArrayForIncoherentNode passed");

  console.log("\nAll functional blocks tests passed! ✨");
}