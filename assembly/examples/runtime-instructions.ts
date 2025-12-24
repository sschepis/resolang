// runtime-instructions.ts
// Demonstrates the ResoLang runtime instruction system (RISA)

import { RISAEngine, IRISAInstruction, IExecutionResult } from "../runtime";
import { Argument } from "../runtime/argument";
import { toFixed } from "../utils";

/**
 * Example: Basic RISA Assembly Operations
 * Shows fundamental symbolic and arithmetic operations
 */
export function exampleBasicInstructions(): void {
  console.log("=== Basic RISA Instructions Example ===");
  
  const engine = new RISAEngine();
  
  // Create a simple program: load values, add them, output result
  const instructions: IRISAInstruction[] = [
    new IRISAInstruction("LOAD", [Argument.fromFloat(42.0), Argument.fromString("R1")]),
    new IRISAInstruction("LOAD", [Argument.fromFloat(13.5), Argument.fromString("R2")]),
    new IRISAInstruction("ADD", [Argument.fromString("R1"), Argument.fromString("R2"), Argument.fromString("R3")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("R3")]),
    new IRISAInstruction("HALT", [])
  ];
  
  console.log("Program: Load 42.0 → R1, Load 13.5 → R2, Add R1+R2 → R3, Output R3");
  
  engine.loadProgram(instructions);
  const result = engine.execute();
  
  console.log(`Execution successful: ${result.success}`);
  console.log(`Instructions executed: ${result.instructionsExecuted}`);
  console.log(`Execution time: ${toFixed(result.executionTime, 2)}ms`);
}

/**
 * Example: Quantum Phase Operations
 * Demonstrates phase manipulation instructions
 */
export function examplePhaseOperations(): void {
  console.log("\n=== Quantum Phase Operations Example ===");
  
  const engine = new RISAEngine();
  
  const instructions: IRISAInstruction[] = [
    // Initialize prime state with primes 7, 11, 13
    new IRISAInstruction("LOAD", [Argument.fromInt(7), Argument.fromString("P1")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(11), Argument.fromString("P2")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(13), Argument.fromString("P3")]),
    
    // Set initial phases
    new IRISAInstruction("SETPHASE", [Argument.fromString("P1"), Argument.fromFloat(1.57)]), // π/2
    new IRISAInstruction("SETPHASE", [Argument.fromString("P2"), Argument.fromFloat(3.14)]), // π
    new IRISAInstruction("SETPHASE", [Argument.fromString("P3"), Argument.fromFloat(4.71)]), // 3π/2
    
    // Advance phases by π/4
    new IRISAInstruction("ADVPHASE", [Argument.fromString("P1"), Argument.fromFloat(0.785)]),
    new IRISAInstruction("ADVPHASE", [Argument.fromString("P2"), Argument.fromFloat(0.785)]),
    new IRISAInstruction("ADVPHASE", [Argument.fromString("P3"), Argument.fromFloat(0.785)]),
    
    // Output phase states
    new IRISAInstruction("OUTPUT", [Argument.fromString("P1")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("P2")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("P3")]),
    
    new IRISAInstruction("HALT", [])
  ];
  
  console.log("Program: Initialize 3 primes with phases, advance by π/4, output states");
  
  engine.loadProgram(instructions);
  const result = engine.execute();
  
  console.log(`Phase operations completed: ${result.success}`);
  console.log(`Instructions executed: ${result.instructionsExecuted}`);
}

/**
 * Example: Quantum Entanglement Operations
 * Shows how to create and manipulate entangled states
 */
export function exampleEntanglementOperations(): void {
  console.log("\n=== Quantum Entanglement Operations Example ===");
  
  const engine = new RISAEngine();
  
  const instructions: IRISAInstruction[] = [
    // Initialize two quantum states
    new IRISAInstruction("LOAD", [Argument.fromInt(17), Argument.fromString("Q1")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(19), Argument.fromString("Q2")]),
    
    // Set coherence values
    new IRISAInstruction("COHERENCE", [Argument.fromString("Q1"), Argument.fromFloat(0.95)]),
    new IRISAInstruction("COHERENCE", [Argument.fromString("Q2"), Argument.fromFloat(0.90)]),
    
    // Create entanglement
    new IRISAInstruction("ENTANGLE", [Argument.fromString("Q1"), Argument.fromString("Q2")]),
    
    // Measure coherence after entanglement
    new IRISAInstruction("COHERENCE", [Argument.fromString("Q1")]),
    new IRISAInstruction("COHERENCE", [Argument.fromString("Q2")]),
    
    // Test quantum measurement
    new IRISAInstruction("MEASURE", [Argument.fromString("Q1"), Argument.fromString("M1")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("M1")]),
    
    new IRISAInstruction("HALT", [])
  ];
  
  console.log("Program: Create entangled states, measure coherence, perform measurement");
  
  engine.loadProgram(instructions);
  const result = engine.execute();
  
  console.log(`Entanglement operations completed: ${result.success}`);
  console.log(`Instructions executed: ${result.instructionsExecuted}`);
}

/**
 * Example: Control Flow and Conditional Execution
 * Demonstrates branching and loops in RISA
 */
export function exampleControlFlow(): void {
  console.log("\n=== Control Flow Example ===");
  
  const engine = new RISAEngine();
  
  const instructions: IRISAInstruction[] = [
    // Initialize counter and threshold
    new IRISAInstruction("LOAD", [Argument.fromInt(0), Argument.fromString("COUNTER")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(5), Argument.fromString("THRESHOLD")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(1), Argument.fromString("INCREMENT")]),
    
    // Loop start label
    new IRISAInstruction("LABEL", [Argument.fromString("LOOP_START")]),
    
    // Check if counter < threshold
    new IRISAInstruction("IF", [Argument.fromString("COUNTER < THRESHOLD")]),
    
    // Loop body: increment counter and output
    new IRISAInstruction("ADD", [Argument.fromString("COUNTER"), Argument.fromString("INCREMENT"), Argument.fromString("COUNTER")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("COUNTER")]),
    
    // Jump back to loop start
    new IRISAInstruction("GOTO", [Argument.fromString("LOOP_START")]),
    
    // End if
    new IRISAInstruction("ENDIF", []),
    
    // Final output
    new IRISAInstruction("OUTPUT", [Argument.fromString("Loop completed")]),
    new IRISAInstruction("HALT", [])
  ];
  
  console.log("Program: Count from 1 to 5 using loop with conditional");
  
  engine.loadProgram(instructions);
  const result = engine.execute();
  
  console.log(`Control flow completed: ${result.success}`);
  console.log(`Instructions executed: ${result.instructionsExecuted}`);
}

/**
 * Example: Advanced Quantum Circuit Simulation
 * Shows complex quantum operations with multiple qubits
 */
export function exampleQuantumCircuit(): void {
  console.log("\n=== Advanced Quantum Circuit Example ===");
  
  const engine = new RISAEngine();
  
  const instructions: IRISAInstruction[] = [
    // Initialize 4 qubits with different primes
    new IRISAInstruction("LOAD", [Argument.fromInt(23), Argument.fromString("Q0")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(29), Argument.fromString("Q1")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(31), Argument.fromString("Q2")]),
    new IRISAInstruction("LOAD", [Argument.fromInt(37), Argument.fromString("Q3")]),
    
    // Apply Hadamard-like operations (superposition)
    new IRISAInstruction("SETPHASE", [Argument.fromString("Q0"), Argument.fromFloat(1.57)]),
    new IRISAInstruction("SETPHASE", [Argument.fromString("Q1"), Argument.fromFloat(1.57)]),
    
    // Create entanglement network
    new IRISAInstruction("ENTANGLE", [Argument.fromString("Q0"), Argument.fromString("Q1")]),
    new IRISAInstruction("ENTANGLE", [Argument.fromString("Q1"), Argument.fromString("Q2")]),
    new IRISAInstruction("ENTANGLE", [Argument.fromString("Q2"), Argument.fromString("Q3")]),
    
    // Measure coherence across the circuit
    new IRISAInstruction("COHERENCEALL", []),
    
    // Apply controlled operations
    new IRISAInstruction("IFCOH", [Argument.fromString("Q0"), Argument.fromFloat(0.8)]),
    new IRISAInstruction("ADVPHASE", [Argument.fromString("Q3"), Argument.fromFloat(3.14)]), // Controlled-Z like
    new IRISAInstruction("ENDIF", []),
    
    // Final measurement of all qubits
    new IRISAInstruction("MEASURE", [Argument.fromString("Q0"), Argument.fromString("M0")]),
    new IRISAInstruction("MEASURE", [Argument.fromString("Q1"), Argument.fromString("M1")]),
    new IRISAInstruction("MEASURE", [Argument.fromString("Q2"), Argument.fromString("M2")]),
    new IRISAInstruction("MEASURE", [Argument.fromString("Q3"), Argument.fromString("M3")]),
    
    // Output results
    new IRISAInstruction("OUTPUT", [Argument.fromString("M0")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("M1")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("M2")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("M3")]),
    
    new IRISAInstruction("HALT", [])
  ];
  
  console.log("Program: 4-qubit quantum circuit with entanglement and controlled operations");
  
  engine.loadProgram(instructions);
  const result = engine.execute();
  
  console.log(`Quantum circuit completed: ${result.success}`);
  console.log(`Instructions executed: ${result.instructionsExecuted}`);
}

/**
 * Example: Holographic Memory Operations
 * Demonstrates storing and retrieving data in holographic memory
 */
export function exampleHolographicMemory(): void {
  console.log("\n=== Holographic Memory Operations Example ===");
  
  const engine = new RISAEngine();
  
  const instructions: IRISAInstruction[] = [
    // Create holographic fragments
    new IRISAInstruction("HOLO_FRAGMENT", [
      Argument.fromString("FRAG1"),
      Argument.fromString("quantum_data_pattern"),
      Argument.fromFloat(0.75) // coherence
    ]),
    
    new IRISAInstruction("HOLO_FRAGMENT", [
      Argument.fromString("FRAG2"),
      Argument.fromString("entangled_information"),
      Argument.fromFloat(0.82)
    ]),
    
    // Store fragments in holographic memory
    new IRISAInstruction("HOLO_STORE", [
      Argument.fromString("FRAG1"),
      Argument.fromInt(100), // memory address
      Argument.fromInt(200)  // backup address
    ]),
    
    new IRISAInstruction("HOLO_STORE", [
      Argument.fromString("FRAG2"),
      Argument.fromInt(300),
      Argument.fromInt(400)
    ]),
    
    // Retrieve fragments from memory
    new IRISAInstruction("HOLO_RETRIEVE", [
      Argument.fromInt(100),
      Argument.fromString("RETRIEVED1")
    ]),
    
    new IRISAInstruction("HOLO_RETRIEVE", [
      Argument.fromInt(300),
      Argument.fromString("RETRIEVED2")
    ]),
    
    // Reconstruct combined holographic state
    new IRISAInstruction("HOLO_RECONSTRUCT", [
      Argument.fromString("RETRIEVED1"),
      Argument.fromString("RETRIEVED2"),
      Argument.fromString("COMBINED")
    ]),
    
    // Output reconstructed state
    new IRISAInstruction("OUTPUT", [Argument.fromString("COMBINED")]),
    
    new IRISAInstruction("HALT", [])
  ];
  
  console.log("Program: Create, store, retrieve and reconstruct holographic memory fragments");
  
  engine.loadProgram(instructions);
  const result = engine.execute();
  
  console.log(`Holographic memory operations completed: ${result.success}`);
  console.log(`Instructions executed: ${result.instructionsExecuted}`);
}

/**
 * Example: Prime Factorization and Resonance
 * Shows prime-based mathematical operations
 */
export function examplePrimeOperations(): void {
  console.log("\n=== Prime Operations and Resonance Example ===");
  
  const engine = new RISAEngine();
  
  const instructions: IRISAInstruction[] = [
    // Load composite number for factorization
    new IRISAInstruction("LOAD", [Argument.fromInt(143), Argument.fromString("COMPOSITE")]), // 11 * 13
    
    // Attempt prime factorization
    new IRISAInstruction("FACTORIZE", [
      Argument.fromString("COMPOSITE"),
      Argument.fromString("FACTOR1"),
      Argument.fromString("FACTOR2")
    ]),
    
    // Output factors
    new IRISAInstruction("OUTPUT", [Argument.fromString("FACTOR1")]),
    new IRISAInstruction("OUTPUT", [Argument.fromString("FACTOR2")]),
    
    // Create resonance pattern with the factors
    new IRISAInstruction("RESONANCE", [
      Argument.fromString("FACTOR1"),
      Argument.fromString("FACTOR2"),
      Argument.fromString("RESONANCE_PATTERN")
    ]),
    
    // Evolve the resonance pattern
    new IRISAInstruction("EVOLVE", [
      Argument.fromString("RESONANCE_PATTERN"),
      Argument.fromFloat(1.0), // time step
      Argument.fromString("EVOLVED_PATTERN")
    ]),
    
    // Calculate entropy of evolved pattern
    new IRISAInstruction("ENTROPY", [
      Argument.fromString("EVOLVED_PATTERN"),
      Argument.fromString("PATTERN_ENTROPY")
    ]),
    
    new IRISAInstruction("OUTPUT", [Argument.fromString("PATTERN_ENTROPY")]),
    
    new IRISAInstruction("HALT", [])
  ];
  
  console.log("Program: Factorize 143, create resonance pattern, evolve and measure entropy");
  
  engine.loadProgram(instructions);
  const result = engine.execute();
  
  console.log(`Prime operations completed: ${result.success}`);
  console.log(`Instructions executed: ${result.instructionsExecuted}`);
}

/**
 * Run all runtime instruction examples
 */
export function runAllRuntimeExamples(): void {
  console.log("=== Running All Runtime Instruction Examples ===\n");
  
  exampleBasicInstructions();
  examplePhaseOperations();
  exampleEntanglementOperations();
  exampleControlFlow();
  exampleQuantumCircuit();
  exampleHolographicMemory();
  examplePrimeOperations();
  
  console.log("\n=== All Runtime Examples Completed ===");
}