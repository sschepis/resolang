// basic-quantum-operations.ts
// Demonstrates fundamental quantum-inspired operations in ResoLang

import {
  ResonantFragment,
  EntangledNode,
  Attractor,
  setCurrentNode,
  PI
} from "../resolang";
import {
  tensor,
  collapse,
  rotatePhase,
  linkEntanglement,
  coherence,
  entropy
} from "../operators";
import {
  stabilize,
  teleport,
  observe
} from "../functionalBlocks";
import { toFixed } from "../utils";

/**
 * Example: Creating and Manipulating Quantum States
 * Shows how to create resonant fragments and perform basic operations
 */
export function exampleQuantumStates(): void {
  console.log("=== Basic Quantum States Example ===");
  
  // Create quantum states by encoding patterns
  const truthPattern = ResonantFragment.encode("truth");
  const beautyPattern = ResonantFragment.encode("beauty");
  const unityPattern = ResonantFragment.encode("unity");
  
  console.log(`Truth entropy: ${toFixed(entropy(truthPattern), 4)}`);
  console.log(`Beauty entropy: ${toFixed(entropy(beautyPattern), 4)}`);
  console.log(`Unity entropy: ${toFixed(entropy(unityPattern), 4)}`);
  
  // Perform tensor operations to combine quantum states
  const superposition = tensor(truthPattern, beautyPattern);
  console.log(`Superposition entropy: ${toFixed(entropy(superposition), 4)}`);
  
  // Create a three-way entangled state
  const tripleState = tensor(superposition, unityPattern);
  console.log(`Triple state entropy: ${toFixed(entropy(tripleState), 4)}`);
  
  // Collapse the superposition to observe a definite state
  const collapsed = collapse(tripleState);
  console.log(`Collapsed state entropy: ${toFixed(entropy(collapsed), 4)}`);
  console.log(`Collapsed state coefficients: ${collapsed.coeffs.size}`);
}

/**
 * Example: Quantum Node Creation and Entanglement
 * Demonstrates creating nodes and establishing quantum links
 */
export function exampleQuantumNodes(): void {
  console.log("\n=== Quantum Node Operations Example ===");
  
  // Create quantum nodes with different prime identities
  const alice = EntangledNode.generateNode(13, 17, 19);
  const bob = EntangledNode.generateNode(23, 29, 31);
  const charlie = EntangledNode.generateNode(37, 41, 43);
  
  console.log(`Alice coherence: ${toFixed(coherence(alice), 4)}`);
  console.log(`Bob coherence: ${toFixed(coherence(bob), 4)}`);
  console.log(`Charlie coherence: ${toFixed(coherence(charlie), 4)}`);
  
  // Perform phase rotations to align nodes
  rotatePhase(alice, PI / 6);
  rotatePhase(bob, PI / 4);
  rotatePhase(charlie, PI / 3);
  
  console.log("Phase rotations applied...");
  
  // Attempt to establish entanglement links
  linkEntanglement(alice, bob);
  linkEntanglement(bob, charlie);
  linkEntanglement(alice, charlie);
  
  console.log(`Post-entanglement Alice coherence: ${toFixed(coherence(alice), 4)}`);
  console.log(`Post-entanglement Bob coherence: ${toFixed(coherence(bob), 4)}`);
  console.log(`Post-entanglement Charlie coherence: ${toFixed(coherence(charlie), 4)}`);
}

/**
 * Example: Quantum State Stabilization
 * Shows how to stabilize quantum nodes for reliable operation
 */
export function exampleStabilization(): void {
  console.log("\n=== Quantum Stabilization Example ===");
  
  // Create a node that needs stabilization
  const unstableNode = EntangledNode.generateNode(47, 53, 59);
  
  // Manually adjust to make it more stable
  unstableNode.coherence = 0.95;
  unstableNode.phaseRing = [0.1, 0.15, 0.12, 0.11, 0.13]; // Low entropy phase ring
  
  console.log(`Initial coherence: ${toFixed(coherence(unstableNode), 4)}`);
  
  const wasStabilized = stabilize(unstableNode);
  console.log(`Stabilization successful: ${wasStabilized}`);
  console.log(`Final coherence: ${toFixed(coherence(unstableNode), 4)}`);
}

/**
 * Example: Quantum Teleportation
 * Demonstrates transferring quantum information between entangled nodes
 */
export function exampleTeleportation(): void {
  console.log("\n=== Quantum Teleportation Example ===");
  
  // Create highly coherent nodes for reliable teleportation
  const sender = EntangledNode.generateNode(61, 67, 71);
  const receiver = EntangledNode.generateNode(73, 79, 83);
  
  // Boost coherence for successful entanglement
  sender.coherence = 0.92;
  receiver.coherence = 0.88;
  
  // Set up current node context
  setCurrentNode(sender);
  
  // Create a quantum message to teleport
  const message = ResonantFragment.encode("quantum information");
  console.log(`Message entropy: ${toFixed(entropy(message), 4)}`);
  
  // Attempt teleportation
  const teleportSuccess = teleport(message, receiver);
  console.log(`Teleportation successful: ${teleportSuccess}`);
  
  // Observe the receiver's state
  const observedPhases = observe(receiver);
  console.log(`Observed ${observedPhases.length} phase components at receiver`);
  
  // Clean up
  setCurrentNode(null);
}

/**
 * Example: Quantum Attractors
 * Shows creation and use of symbolic attractors for system resonance
 */
export function exampleAttractors(): void {
  console.log("\n=== Quantum Attractors Example ===");
  
  // Create attractors for different concepts
  const harmonyAttractor = Attractor.create("Harmony", 0.95);
  const balanceAttractor = Attractor.create("Balance", 0.88);
  const wisdomAttractor = Attractor.create("Wisdom", 0.92);
  
  console.log(`Harmony attractor: ${harmonyAttractor.primes.length} primes, coherence: ${harmonyAttractor.coherence}`);
  console.log(`Balance attractor: ${balanceAttractor.primes.length} primes, coherence: ${balanceAttractor.coherence}`);
  console.log(`Wisdom attractor: ${wisdomAttractor.primes.length} primes, coherence: ${wisdomAttractor.coherence}`);
  
  // Show the prime signatures
  console.log(`Harmony primes: [${harmonyAttractor.primes.join(", ")}]`);
  console.log(`Balance primes: [${balanceAttractor.primes.join(", ")}]`);
  console.log(`Wisdom primes: [${wisdomAttractor.primes.join(", ")}]`);
}

/**
 * Example: Complex Quantum Circuit
 * Demonstrates a more complex quantum computation pattern
 */
export function exampleQuantumCircuit(): void {
  console.log("\n=== Complex Quantum Circuit Example ===");
  
  // Create a network of interconnected quantum nodes
  const nodes: EntangledNode[] = [];
  const nodeNames = ["Alpha", "Beta", "Gamma", "Delta"];
  const primeBases = [[2, 3, 5], [7, 11, 13], [17, 19, 23], [29, 31, 37]];
  
  for (let i = 0; i < nodeNames.length; i++) {
    const node = EntangledNode.generateNode(
      primeBases[i][0],
      primeBases[i][1], 
      primeBases[i][2]
    );
    node.coherence = 0.8 + (i * 0.05); // Gradually increasing coherence
    nodes.push(node);
  }
  
  console.log("Created quantum circuit with 4 nodes");
  
  // Create entanglement mesh
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      linkEntanglement(nodes[i], nodes[j]);
    }
  }
  
  // Create quantum information to process
  const inputData = [
    ResonantFragment.encode("data1"),
    ResonantFragment.encode("data2"),
    ResonantFragment.encode("data3")
  ];
  
  // Process through the quantum circuit
  let processedData = inputData[0];
  for (let i = 1; i < inputData.length; i++) {
    processedData = tensor(processedData, inputData[i]);
  }
  
  console.log(`Circuit input entropy: ${inputData.map<string>(d => toFixed(entropy(d), 4)).join(", ")}`);
  console.log(`Circuit output entropy: ${toFixed(entropy(processedData), 4)}`);
  
  // Final measurement
  const result = collapse(processedData);
  console.log(`Final measurement entropy: ${toFixed(entropy(result), 4)}`);
  console.log("Quantum circuit computation completed");
}

/**
 * Run all basic quantum operation examples
 */
export function runAllBasicQuantumExamples(): void {
  console.log("=== Running All Basic Quantum Operation Examples ===\n");
  
  exampleQuantumStates();
  exampleQuantumNodes();
  exampleStabilization();
  exampleTeleportation();
  exampleAttractors();
  exampleQuantumCircuit();
  
  console.log("\n=== All Basic Quantum Examples Completed ===");
}