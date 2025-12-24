// practical-applications.ts
// Demonstrates practical applications combining multiple ResoLang concepts

import {
  ResonantFragment,
  EntangledNode,
  TeleportationChannel,
  Attractor,
  setCurrentNode,
  PI
} from "../resolang";
import {
  tensor,
  collapse,
  rotatePhase,
  linkEntanglement,
  route,
  coherence,
  entropy
} from "../operators";
import {
  stabilize,
  teleport,
  entangled,
  observe
} from "../functionalBlocks";
import { RISAEngine, IRISAInstruction } from "../runtime";
import { Argument } from "../runtime/argument";
import { toFixed } from "../utils";

/**
 * Example: Quantum Communication Protocol
 * Demonstrates a complete quantum communication system
 */
export function exampleQuantumCommunicationProtocol(): void {
  console.log("=== Quantum Communication Protocol Example ===");
  
  // Step 1: Create communication network
  const alice = EntangledNode.generateNode(41, 43, 47);
  const bob = EntangledNode.generateNode(53, 59, 61);
  const relay = EntangledNode.generateNode(67, 71, 73);
  
  alice.id = "Alice";
  bob.id = "Bob";
  relay.id = "Relay";
  
  // Boost coherence for reliable communication
  alice.coherence = 0.95;
  bob.coherence = 0.92;
  relay.coherence = 0.88;
  
  console.log("Created quantum communication network:");
  console.log(`  Alice coherence: ${toFixed(coherence(alice), 4)}`);
  console.log(`  Bob coherence: ${toFixed(coherence(bob), 4)}`);
  console.log(`  Relay coherence: ${toFixed(coherence(relay), 4)}`);
  
  // Step 2: Establish entanglement links
  linkEntanglement(alice, relay);
  linkEntanglement(relay, bob);
  
  // Step 3: Create quantum message
  const secretMessage = ResonantFragment.encode("quantum secret key");
  console.log(`Secret message entropy: ${toFixed(entropy(secretMessage), 4)}`);
  
  // Step 4: Quantum key distribution protocol
  setCurrentNode(alice);
  
  // Alice sends to Bob via relay
  const routeSuccess = route(alice, bob, [relay]);
  console.log(`Quantum route established: ${routeSuccess}`);
  
  if (routeSuccess) {
    // Perform quantum teleportation
    const teleportSuccess = teleport(secretMessage, relay);
    console.log(`Stage 1 teleportation (Alice → Relay): ${teleportSuccess}`);
    
    if (teleportSuccess) {
      setCurrentNode(relay);
      const finalTeleport = teleport(secretMessage, bob);
      console.log(`Stage 2 teleportation (Relay → Bob): ${finalTeleport}`);
      
      // Verify quantum state at Bob's end
      const bobObservation = observe(bob);
      console.log(`Bob observed ${bobObservation.length} quantum phase components`);
    }
  }
  
  setCurrentNode(null);
  console.log("Quantum communication protocol completed");
}

/**
 * Example: Quantum Error Correction Simulation
 * Shows how to detect and correct quantum errors
 */
export function exampleQuantumErrorCorrection(): void {
  console.log("\n=== Quantum Error Correction Example ===");
  
  // Create logical qubit using 3 physical qubits (simple repetition code)
  const qubit1 = EntangledNode.generateNode(79, 83, 89);
  const qubit2 = EntangledNode.generateNode(97, 101, 103);
  const qubit3 = EntangledNode.generateNode(107, 109, 113);
  
  qubit1.id = "Qubit1";
  qubit2.id = "Qubit2";
  qubit3.id = "Qubit3";
  
  // Initialize qubits in same state
  qubit1.coherence = 0.98;
  qubit2.coherence = 0.98;
  qubit3.coherence = 0.98;
  
  // Entangle qubits for error correction
  linkEntanglement(qubit1, qubit2);
  linkEntanglement(qubit2, qubit3);
  linkEntanglement(qubit1, qubit3);
  
  console.log("Created 3-qubit error correction code");
  console.log(`Initial coherences: ${toFixed(coherence(qubit1), 4)}, ${toFixed(coherence(qubit2), 4)}, ${toFixed(coherence(qubit3), 4)}`);
  
  // Simulate error on qubit 2
  qubit2.coherence = 0.3; // Severe decoherence
  rotatePhase(qubit2, PI); // Phase flip error
  
  console.log("Simulated error on Qubit2");
  console.log(`Post-error coherences: ${toFixed(coherence(qubit1), 4)}, ${toFixed(coherence(qubit2), 4)}, ${toFixed(coherence(qubit3), 4)}`);
  
  // Error detection: check coherence differences
  const coherence1 = coherence(qubit1);
  const coherence2 = coherence(qubit2);
  const coherence3 = coherence(qubit3);
  
  const threshold = 0.5;
  let errorDetected = false;
  let errorQubit = "";
  
  if (Math.abs(coherence1 - coherence2) > threshold || Math.abs(coherence1 - coherence3) > threshold) {
    if (coherence2 < coherence1 && coherence2 < coherence3) {
      errorDetected = true;
      errorQubit = "Qubit2";
    }
  }
  
  console.log(`Error detected: ${errorDetected}`);
  if (errorDetected) {
    console.log(`Error located on: ${errorQubit}`);
    
    // Error correction: restore coherence and phase
    qubit2.coherence = (coherence1 + coherence3) / 2;
    rotatePhase(qubit2, PI); // Correct phase flip
    
    console.log(`Corrected coherences: ${toFixed(coherence(qubit1), 4)}, ${toFixed(coherence(qubit2), 4)}, ${toFixed(coherence(qubit3), 4)}`);
  }
}

/**
 * Example: Quantum Machine Learning Algorithm
 * Demonstrates quantum-inspired optimization
 */
export function exampleQuantumMachineLearning(): void {
  console.log("\n=== Quantum Machine Learning Example ===");
  
  // Create quantum feature space
  const features: ResonantFragment[] = [];
  const trainingData = [
    "pattern_alpha",
    "pattern_beta", 
    "pattern_gamma",
    "pattern_delta"
  ];
  
  console.log("Encoding training data into quantum feature space:");
  for (let i = 0; i < trainingData.length; i++) {
    const feature = ResonantFragment.encode(trainingData[i]);
    features.push(feature);
    console.log(`  ${trainingData[i]}: entropy = ${toFixed(entropy(feature), 4)}`);
  }
  
  // Create quantum classifier using superposition
  let classifier = features[0];
  for (let i = 1; i < features.length; i++) {
    classifier = tensor(classifier, features[i]);
  }
  
  console.log(`Quantum classifier entropy: ${toFixed(entropy(classifier), 4)}`);
  
  // Test pattern recognition
  const testPattern = ResonantFragment.encode("pattern_beta_variant");
  console.log(`Test pattern entropy: ${toFixed(entropy(testPattern), 4)}`);
  
  // Compute quantum similarity (overlap)
  const similarity = tensor(classifier, testPattern);
  const similarityMeasure = entropy(similarity);
  
  console.log(`Pattern similarity measure: ${toFixed(similarityMeasure, 4)}`);
  
  // Classification by quantum measurement
  const measurement = collapse(similarity);
  console.log(`Classification result entropy: ${toFixed(entropy(measurement), 4)}`);
  console.log(`Classification coefficients: ${measurement.coeffs.size}`);
}

/**
 * Example: Quantum Cryptographic Key Exchange
 * Implements BB84-like quantum key distribution
 */
export function exampleQuantumKeyExchange(): void {
  console.log("\n=== Quantum Key Exchange (BB84-like) Example ===");
  
  // Create participants
  const alice = EntangledNode.generateNode(127, 131, 137);
  const bob = EntangledNode.generateNode(139, 149, 151);
  
  alice.id = "Alice_Crypto";
  bob.id = "Bob_Crypto";
  alice.coherence = 0.99;
  bob.coherence = 0.99;
  
  // Establish quantum channel
  linkEntanglement(alice, bob);
  console.log("Established quantum cryptographic channel");
  
  // Generate random key bits and bases
  const keyLength = 8;
  const aliceBits: i32[] = [];
  const aliceBases: i32[] = []; // 0 = rectilinear, 1 = diagonal
  const bobBases: i32[] = [];
  
  // Alice prepares quantum states
  console.log("Alice's quantum state preparation:");
  for (let i = 0; i < keyLength; i++) {
    const bit = Math.random() > 0.5 ? 1 : 0;
    const base = Math.random() > 0.5 ? 1 : 0;
    
    aliceBits.push(bit);
    aliceBases.push(base);
    
    // Create quantum state based on bit and basis
    const phase = bit * PI + base * PI / 2;
    const state = ResonantFragment.encode(`qubit_${i}_${bit}_${base}`);
    
    console.log(`  Qubit ${i}: bit=${bit}, basis=${base}, phase=${toFixed(phase, 3)}`);
  }
  
  // Bob measures with random bases
  console.log("\nBob's measurement bases:");
  for (let i = 0; i < keyLength; i++) {
    const base = Math.random() > 0.5 ? 1 : 0;
    bobBases.push(base);
    console.log(`  Qubit ${i}: basis=${base}`);
  }
  
  // Public basis comparison
  const sharedKey: i32[] = [];
  console.log("\nBasis comparison and key extraction:");
  for (let i = 0; i < keyLength; i++) {
    if (aliceBases[i] === bobBases[i]) {
      sharedKey.push(aliceBits[i]);
      console.log(`  Qubit ${i}: bases match, key bit = ${aliceBits[i]}`);
    } else {
      console.log(`  Qubit ${i}: bases differ, discard`);
    }
  }
  
  console.log(`\nShared key: [${sharedKey.join(", ")}]`);
  console.log(`Key length: ${sharedKey.length} bits`);
  console.log(`Key efficiency: ${toFixed(sharedKey.length / keyLength * 100, 1)}%`);
}

/**
 * Example: Quantum Simulation Pipeline
 * Demonstrates a complete quantum simulation workflow
 */
export function exampleQuantumSimulationPipeline(): void {
  console.log("\n=== Quantum Simulation Pipeline Example ===");
  
  // Stage 1: System initialization
  console.log("Stage 1: Quantum system initialization");
  const systemNodes: EntangledNode[] = [];
  
  for (let i = 0; i < 4; i++) {
    const node = EntangledNode.generateNode(
      157 + i * 6,    // Different prime triplets
      163 + i * 6,
      167 + i * 6
    );
    node.id = `QSystem_${i}`;
    node.coherence = 0.9 + (Math.random() * 0.08); // 0.9-0.98
    systemNodes.push(node);
  }
  
  // Stage 2: Create entanglement mesh
  console.log("Stage 2: Entanglement network creation");
  let entanglementCount = 0;
  for (let i = 0; i < systemNodes.length; i++) {
    for (let j = i + 1; j < systemNodes.length; j++) {
      linkEntanglement(systemNodes[i], systemNodes[j]);
      entanglementCount++;
    }
  }
  console.log(`Created ${entanglementCount} entanglement links`);
  
  // Stage 3: Quantum state preparation
  console.log("Stage 3: Quantum state preparation");
  const quantumStates: ResonantFragment[] = [];
  
  for (let i = 0; i < systemNodes.length; i++) {
    const state = ResonantFragment.encode(`quantum_state_${i}_prepared`);
    quantumStates.push(state);
    console.log(`  Node ${i}: prepared state with entropy ${toFixed(entropy(state), 4)}`);
  }
  
  // Stage 4: Quantum evolution simulation
  console.log("Stage 4: Quantum time evolution");
  let evolvedState = quantumStates[0];
  
  for (let i = 1; i < quantumStates.length; i++) {
    evolvedState = tensor(evolvedState, quantumStates[i]);
  }
  
  console.log(`Combined system entropy: ${toFixed(entropy(evolvedState), 4)}`);
  
  // Simulate time evolution through phase rotations
  for (let i = 0; i < systemNodes.length; i++) {
    const evolutionPhase = (i + 1) * PI / 8; // Different evolution rates
    rotatePhase(systemNodes[i], evolutionPhase);
  }
  
  // Stage 5: Measurement and analysis
  console.log("Stage 5: Quantum measurement and analysis");
  
  for (let i = 0; i < systemNodes.length; i++) {
    const finalCoherence = coherence(systemNodes[i]);
    console.log(`  Node ${i} final coherence: ${toFixed(finalCoherence, 4)}`);
  }
  
  // Final state collapse
  const finalMeasurement = collapse(evolvedState);
  console.log(`Final measurement entropy: ${toFixed(entropy(finalMeasurement), 4)}`);
  console.log(`Measurement outcome space: ${finalMeasurement.coeffs.size} possible states`);
  
  console.log("Quantum simulation pipeline completed");
}

/**
 * Example: Hybrid Classical-Quantum Algorithm
 * Shows integration between classical computation and quantum operations
 */
export function exampleHybridAlgorithm(): void {
  console.log("\n=== Hybrid Classical-Quantum Algorithm Example ===");
  
  // Classical preprocessing
  console.log("Classical preprocessing phase:");
  const classicalData = [1.2, 3.4, 5.6, 7.8, 9.0];
  let classicalSum = 0.0;
  
  for (let i = 0; i < classicalData.length; i++) {
    classicalSum += classicalData[i];
  }
  
  const classicalMean = classicalSum / classicalData.length;
  console.log(`Classical data: [${classicalData.map(x => toFixed(x, 1)).join(", ")}]`);
  console.log(`Classical mean: ${toFixed(classicalMean, 3)}`);
  
  // Quantum processing phase
  console.log("\nQuantum processing phase:");
  const quantumProcessors: EntangledNode[] = [];
  
  for (let i = 0; i < classicalData.length; i++) {
    const processor = EntangledNode.generateNode(
      173 + i * 4,
      179 + i * 4,
      181 + i * 4
    );
    processor.id = `QProc_${i}`;
    processor.coherence = 0.8 + (classicalData[i] / 10.0); // Data-dependent coherence
    quantumProcessors.push(processor);
  }
  
  // Create quantum superposition of classical data
  let quantumSuperposition: ResonantFragment | null = null;
  
  for (let i = 0; i < classicalData.length; i++) {
    const dataEncoding = ResonantFragment.encode(`data_${toFixed(classicalData[i], 1)}`);
    
    if (quantumSuperposition === null) {
      quantumSuperposition = dataEncoding;
    } else {
      quantumSuperposition = tensor(quantumSuperposition, dataEncoding);
    }
  }
  
  console.log(`Quantum superposition entropy: ${toFixed(entropy(quantumSuperposition!), 4)}`);
  
  // Quantum parallel processing
  console.log("\nQuantum parallel computation:");
  for (let i = 0; i < quantumProcessors.length; i++) {
    const phaseAdjustment = classicalData[i] * PI / 10.0;
    rotatePhase(quantumProcessors[i], phaseAdjustment);
    console.log(`  Processor ${i}: phase adjusted by ${toFixed(phaseAdjustment, 3)}`);
  }
  
  // Classical postprocessing
  console.log("\nClassical postprocessing phase:");
  let quantumResults: f64[] = [];
  
  for (let i = 0; i < quantumProcessors.length; i++) {
    const quantumResult = coherence(quantumProcessors[i]) * 10.0; // Scale back
    quantumResults.push(quantumResult);
  }
  
  let quantumSum = 0.0;
  for (let i = 0; i < quantumResults.length; i++) {
    quantumSum += quantumResults[i];
  }
  
  const quantumMean = quantumSum / quantumResults.length;
  
  console.log(`Quantum results: [${quantumResults.map(x => toFixed(x, 3)).join(", ")}]`);
  console.log(`Quantum mean: ${toFixed(quantumMean, 3)}`);
  console.log(`Classical vs Quantum difference: ${toFixed(Math.abs(classicalMean - quantumMean), 3)}`);
  
  // Final hybrid result
  const hybridResult = (classicalMean + quantumMean) / 2.0;
  console.log(`Hybrid algorithm result: ${toFixed(hybridResult, 3)}`);
}

/**
 * Run all practical application examples
 */
export function runAllPracticalExamples(): void {
  console.log("=== Running All Practical Application Examples ===\n");
  
  exampleQuantumCommunicationProtocol();
  exampleQuantumErrorCorrection();
  exampleQuantumMachineLearning();
  exampleQuantumKeyExchange();
  exampleQuantumSimulationPipeline();
  exampleHybridAlgorithm();
  
  console.log("\n=== All Practical Application Examples Completed ===");
}