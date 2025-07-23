// operators.ts
// This file implements the core operators defined in the ResoLang syntax.

import { ResonantFragment, EntangledNode, Phase, Entropy, Prime, Amplitude, PI } from "./resolang";
import { toFixed } from "./utils";

// 3.2 Operators

/**
 * Tensor (⊗) operator: Simulates field interaction between two ResonantFragments.
 * This operation conceptually merges their coefficients, combines entropy, and finds a new center.
 * @param fragmentA The first ResonantFragment.
 * @param fragmentB The second ResonantFragment.
 * @returns A new ResonantFragment representing the tensored result.
 */
export function tensor(fragmentA: ResonantFragment, fragmentB: ResonantFragment): ResonantFragment {
  const newCoeffs = new Map<Prime, Amplitude>();
  let totalAmplitudeSq: f64 = 0.0;

  const keysA = fragmentA.coeffs.keys();
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    const amp = fragmentA.coeffs.get(key);
    newCoeffs.set(key, amp);
    totalAmplitudeSq += amp * amp;
  }

  const keysB = fragmentB.coeffs.keys();
  for (let i = 0; i < keysB.length; i++) {
    const key = keysB[i];
    const amp = fragmentB.coeffs.get(key);
    if (newCoeffs.has(key)) {
      const existingAmp = newCoeffs.get(key);
      totalAmplitudeSq -= existingAmp * existingAmp;
      newCoeffs.set(key, existingAmp + amp);
    } else {
      newCoeffs.set(key, amp);
    }
    const newAmp = newCoeffs.get(key);
    totalAmplitudeSq += newAmp * newAmp;
  }

  // Normalize the new fragment
  const normalizationFactor = Math.sqrt(totalAmplitudeSq);
  if (normalizationFactor > 0) {
    const keys = newCoeffs.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      newCoeffs.set(key, newCoeffs.get(key) / normalizationFactor);
    }
  }

  // Recalculate entropy
  let newEntropy: f64 = 0.0;
  const values = newCoeffs.values();
  for (let i = 0; i < values.length; i++) {
    const p = values[i] * values[i];
    if (p > 0) {
      newEntropy -= p * Math.log(p);
    }
  }

  // Weighted average for the new center
  const totalEntropy = fragmentA.entropy + fragmentB.entropy;
  const weightA = totalEntropy > 0 ? fragmentA.entropy / totalEntropy : 0.5;
  const weightB = totalEntropy > 0 ? fragmentB.entropy / totalEntropy : 0.5;
  const newCenterX = fragmentA.center[0] * weightA + fragmentB.center[0] * weightB;
  const newCenterY = fragmentA.center[1] * weightA + fragmentB.center[1] * weightB;

  return new ResonantFragment(newCoeffs, newCenterX, newCenterY, newEntropy);
}

/**
 * Collapse (⇝) operator: Simulates observation and entropy lock on a ResonantFragment.
 * This operation conceptually finalizes the fragment's state, reducing its entropy.
 * @param fragment The ResonantFragment to collapse.
 * @returns A new ResonantFragment with reduced entropy, representing the collapsed state.
 */
export function collapse(fragment: ResonantFragment): ResonantFragment {
  // In a quantum system, measurement collapses a superposition to a single state.
  // We'll simulate this by choosing one prime based on the probabilities |α_p|².
  const probabilities = new Map<Prime, f64>();
  const keys = fragment.coeffs.keys();
  let totalProbability: f64 = 0.0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const amp = fragment.coeffs.get(key);
    const p = amp * amp;
    probabilities.set(key, p);
    totalProbability += p;
  }

  // Select a prime based on the probability distribution
  const rand = Math.random() * totalProbability;
  let cumulativeProbability: f64 = 0.0;
  let selectedPrime: Prime = 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    cumulativeProbability += probabilities.get(key);
    if (rand < cumulativeProbability) {
      selectedPrime = key;
      break;
    }
  }

  // The collapsed state has only one prime with amplitude 1.0
  const newCoeffs = new Map<Prime, Amplitude>();
  if (selectedPrime > 0) {
    newCoeffs.set(selectedPrime, 1.0);
  }

  // The entropy of a pure state is 0
  const collapsedEntropy = 0.0;

  return new ResonantFragment(newCoeffs, fragment.center[0], fragment.center[1], collapsedEntropy);
}

/**
 * Phase Modulation (⟳) operator: Applies a phase shift to an EntangledNode's phase ring.
 * This modifies the phases within the node's phase ring and can affect its coherence.
 * @param node The EntangledNode whose phase ring will be modulated.
 * @param phaseShift The amount of phase to shift by, in radians.
 */
export function rotatePhase(node: EntangledNode, phaseShift: Phase): void {
  for (let i = 0; i < node.phaseRing.length; i++) {
    node.phaseRing[i] = (node.phaseRing[i] + phaseShift) % (2 * PI);
    // Ensure the phase remains positive (between 0 and 2*PI)
    if (node.phaseRing[i] < 0) {
      node.phaseRing[i] += 2 * PI;
    }
  }
  // Phase modulation might subtly affect coherence; here, a small reduction.
  node.coherence = Math.max(0.0, node.coherence - Math.abs(phaseShift) / (2 * PI * 10.0));
}

/**
 * Entanglement Link (≡) operator: Attempts to entangle two EntangledNodes.
 * This operation conceptually links nodes if their mutual coherence is high enough.
 * @param nodeA The first EntangledNode.
 * @param nodeB The second EntangledNode.
 */
export function linkEntanglement(nodeA: EntangledNode, nodeB: EntangledNode): void {
  // Entanglement should depend on both coherence and phase alignment.
  const avgCoherence = (nodeA.coherence + nodeB.coherence) / 2.0;

  // Calculate phase difference between the nodes' phase rings
  let phaseDifference: f64 = 0.0;
  const len = Math.min(nodeA.phaseRing.length, nodeB.phaseRing.length);
  for (let i = 0; i < len; i++) {
    phaseDifference += Math.abs(nodeA.phaseRing[i] - nodeB.phaseRing[i]);
  }
  if (len > 0) {
    phaseDifference /= len;
  }

  // Entanglement is more likely with high coherence and low phase difference.
  const entanglementProbability = avgCoherence * (1.0 - phaseDifference / (2 * PI));

  if (entanglementProbability > 0.75) { // Threshold for entanglement
    const entanglementFactor = (entanglementProbability - 0.75) / 5.0; // Small increase
    nodeA.coherence = Math.min(1.0, nodeA.coherence + entanglementFactor);
    nodeB.coherence = Math.min(1.0, nodeB.coherence + entanglementFactor);
    console.log(`[OPERATOR] Nodes ${nodeA.id} and ${nodeB.id} are entangled. New coherence: A=${toFixed(nodeA.coherence, 4)}, B=${toFixed(nodeB.coherence, 4)}`);
  } else {
    console.log(`[OPERATOR] Nodes ${nodeA.id} and ${nodeB.id} cannot entangle. Probability too low: ${toFixed(entanglementProbability, 4)}`);
  }
}

/**
 * Route Selection (→) operator: Simulates resonance path routing between nodes.
 * This function checks if a conceptual route can be established via intermediate nodes,
 * based on their coherence.
 * @param source The source EntangledNode.
 * @param target The target EntangledNode.
 * @param viaNodes An array of intermediate EntangledNodes to route through.
 * @returns True if routing is conceptually successful, false otherwise.
 */
export function route(source: EntangledNode, target: EntangledNode, viaNodes: Array<EntangledNode>): boolean {
  console.log(`[OPERATOR] Attempting to route from ${source.id} to ${target.id} via [${viaNodes.map<string>(n => n.id).join(", ")}]`);

  // This is a simplified routing simulation. A real implementation would use a
  // graph traversal algorithm (like Dijkstra's) to find the optimal path.
  let totalCost: f64 = 0;
  const beta = 0.5; // Weighting factor for entropy vs. coherence

  let currentNode = source;
  const path = viaNodes.slice();
  path.push(target);

  for (let i = 0; i < path.length; i++) {
    const nextNode = path[i];
    const avgCoherence = (currentNode.coherence + nextNode.coherence) / 2.0;
    
    if (avgCoherence < 0.5) {
      console.log(`[OPERATOR] Routing failed: Coherence too low between ${currentNode.id} and ${nextNode.id}.`);
      return false;
    }

    // Cost function from entropy-coherence.md: Cost = Σ (1/C_ij + β * S_i)
    // We don't have entropy on nodes, so we'll use (1 - coherence) as a proxy.
    const cost = (1.0 / avgCoherence) + beta * (1.0 - currentNode.coherence);
    totalCost += cost;
    currentNode = nextNode;
  }

  // Arbitrary cost threshold for success
  if (totalCost < path.length * 2.5) {
    console.log(`[OPERATOR] Routing successful with a total cost of ${toFixed(totalCost, 4)}.`);
    return true;
  } else {
    console.log(`[OPERATOR] Routing failed: Total cost of ${toFixed(totalCost, 4)} exceeds threshold.`);
    return false;
  }
}

/**
 * Helper function to retrieve the coherence of an EntangledNode.
 * @param node The EntangledNode to query.
 * @returns The coherence value of the node.
 */
export function coherence(node: EntangledNode): f64 {
  return node.coherence;
}

/**
 * Helper function to retrieve the entropy of a ResonantFragment.
 * @param fragment The ResonantFragment to query.
 * @returns The entropy value of the fragment.
 */
export function entropy(fragment: ResonantFragment): Entropy {
  return fragment.entropy;
}

