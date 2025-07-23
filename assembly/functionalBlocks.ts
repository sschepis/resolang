// functionalBlocks.ts
// This file implements the functional blocks described in the ResoLang specification.

import { EntangledNode, ResonantFragment, setCurrentNode, currentNode, Phase } from "./resolang";
import { coherence } from "./operators"; // Import coherence function
import { entropyRate as calculateEntropyRate, toFixed } from "./utils"; // Import utility functions

// 4. Functional Blocks

/**
 * Stabilizes an EntangledNode.
 * A node is considered stable if its phase ring's entropy rate is low
 * and its overall coherence is high. Stabilization attempts to improve coherence.
 * @param node The EntangledNode to stabilize.
 * @returns True if the node meets stabilization criteria and is (conceptually) stabilized, false otherwise.
 */
export function stabilize(node: EntangledNode): boolean {
  const currentEntropyRate = calculateEntropyRate(node.phaseRing);
  console.log(`[FN] Stabilizing ${node.id}: Current Entropy Rate = ${toFixed(currentEntropyRate, 4)}, Coherence = ${toFixed(coherence(node), 4)}`);

  // Conditions for stabilization as per ResoLang spec
  if (currentEntropyRate < -0.03 && coherence(node) > 0.9) {
    // In a real ResoLang, stabilization might involve complex phase corrections
    // or re-aligning prime frequencies. Here, we simulate by boosting coherence.
    node.coherence = Math.min(1.0, node.coherence + 0.05); // Small boost to coherence
    console.log(`[FN] ${node.id} stabilized. New coherence: ${toFixed(node.coherence, 4)}`);
    return true;
  }
  console.log(`[FN] ${node.id} stabilization not needed or failed conditions.`);
  return false;
}

/**
 * Teleports a ResonantFragment to a target EntangledNode.
 * Teleportation is successful if the current node and target node are entangled
 * and the target node's coherence is sufficiently high.
 * @param mem The ResonantFragment to teleport.
 * @param to The target EntangledNode.
 * @returns True if teleportation is successful, false otherwise.
 */
export function teleport(mem: ResonantFragment, to: EntangledNode): boolean {
  // Ensure there is a 'currentNode' set for the teleportation to originate from.
  if (currentNode == null) {
    console.log("[FN] Teleportation failed: No current node (thisNode) set.");
    return false;
  }

  // Simplified `entangled` check: mutual high coherence between current and target node.
  // In a full ResoLang, `entangled` would likely be a more explicit state or property.
  const isEntangled = (coherence(currentNode!) > 0.8 && coherence(to) > 0.8);

  console.log(`[FN] Attempting to teleport fragment (entropy: ${toFixed(mem.entropy, 4)}) from ${currentNode!.id} to ${to.id}. Entangled? ${isEntangled}, Target Coherence: ${toFixed(coherence(to), 4)}`);

  // Check conditions for successful teleportation as per ResoLang spec
  if (isEntangled && coherence(to) > 0.85) {
    // `emit mem ⇝ to;` - This is the core "teleportation" action.
    // In AssemblyScript, this means conceptually transferring the data.
    // We simulate this by logging the transfer. A more advanced system
    // would involve replicating `mem` at `to`'s memory space or modifying `to`'s state.
    console.log(`[FN] Fragment "${mem.toString()}" successfully teleported to ${to.id}!`);
    return true;
  }
  console.log(`[FN] Teleportation failed. Conditions not met.`);
  return false;
}

/**
 * Helper function to conceptually check if two nodes are entangled.
 * For this simulation, entanglement is inferred from high mutual coherence.
 * @param nodeA The first EntangledNode.
 * @param nodeB The second EntangledNode.
 * @returns True if both nodes have high coherence, indicating conceptual entanglement.
 */
export function entangled(nodeA: EntangledNode, nodeB: EntangledNode): boolean {
  return coherence(nodeA) > 0.8 && coherence(nodeB) > 0.8;
}

// 10. Meta-Constructs (implemented as regular functions for now)

/**
 * @entangled observe function: Measures the phase ring of a remote EntangledNode.
 * This function is conceptually marked `@entangled` in ResoLang, implying it relies
 * on an established entanglement link or sufficient coherence.
 * @param remote The remote EntangledNode to observe.
 * @returns An array of Phases from the remote node's phase ring, or an empty array if observation fails.
 */
export function observe(remote: EntangledNode): Array<Phase> {
  console.log(`[META] Observing phase ring of remote node ${remote.id}`);
  // Simplified entanglement check for observation: remote node must have sufficient coherence.
  if (remote.coherence > 0.7) {
    return remote.phaseRing;
  } else {
    console.log(`[META] Observation failed: Remote node ${remote.id} coherence too low (${toFixed(remote.coherence, 4)}).`);
    return new Array<Phase>(); // Return empty array if not coherent enough
  }
}

// The `@resonant` meta-construct for attractors is handled by the `Attractor.create` static method.

