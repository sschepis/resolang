# ResoLang Quick Reference Guide

A concise reference for ResoLang syntax, concepts, and common patterns.

## 🚀 Core Types

### Primitive Types
```typescript
type Prime = u32;        // Prime number basis
type Phase = f64;        // Angle in radians  
type Amplitude = f64;    // Complex amplitude magnitude
type Entropy = f64;      // Symbolic entropy metric
```

### Quantum Types
```typescript
// Quantum memory fragment
class ResonantFragment {
  coeffs: Map<Prime, Amplitude>;  // Prime coefficients
  center: StaticArray<f64>;       // 2D spatial center
  entropy: Entropy;               // Fragment entropy
}

// Quantum network node
class EntangledNode {
  id: string;                     // Unique identifier
  pri: StaticArray<Prime>;        // Prime triplet identity
  phaseRing: Array<Phase>;        // Phase state array
  coherence: f64;                 // Quantum coherence (0-1)
}

// Quantum teleportation channel
class TeleportationChannel {
  source: EntangledNode;          // Source node
  target: EntangledNode;          // Target node
  strength: f64;                  // Channel strength
  holographicMemory: ResonantFragment; // Transmitted data
}

// Symbolic attractor
class Attractor {
  primes: Array<Prime>;           // Associated primes
  targetPhase: Array<Phase>;      // Target phase configuration
  symbol: string;                 // Symbolic name
  coherence: f64;                 // Attractor coherence
}
```

### Mathematical Types
```typescript
// Complex numbers for quantum amplitudes
class Complex {
  real: f64;
  imag: f64;
  
  static fromPolar(magnitude: f64, phase: f64): Complex;
  add(other: Complex): Complex;
  multiply(other: Complex): Complex;
  magnitude(): f64;
  phase(): f64;
}

// Prime field elements for cryptography
class PrimeFieldElement {
  value: i64;
  modulus: i64;
  
  add(other: PrimeFieldElement): PrimeFieldElement;
  multiply(other: PrimeFieldElement): PrimeFieldElement;
  power(exponent: i64): PrimeFieldElement;
  inverse(): PrimeFieldElement;
}
```

## ⚛️ Quantum Operations

### State Creation
```typescript
// Encode patterns into quantum states
const fragment = ResonantFragment.encode("quantum pattern");

// Generate quantum nodes with prime identities
const node = EntangledNode.generateNode(13, 17, 19);

// Create symbolic attractors
const attractor = Attractor.create("Harmony", 0.95);
```

### Quantum Operators
```typescript
// Tensor product (⊗) - combine quantum states
const combined = tensor(fragmentA, fragmentB);

// Collapse (⇝) - quantum measurement
const measured = collapse(superposition);

// Phase rotation (⟳) - adjust quantum phases
rotatePhase(node, PI / 4);

// Entanglement link (≡) - create quantum correlations
linkEntanglement(nodeA, nodeB);
```

### State Analysis
```typescript
// Check quantum coherence
const coh = coherence(node);  // Returns f64 (0-1)

// Measure entropy
const ent = entropy(fragment);  // Returns f64

// Observe quantum phases
const phases = observe(remoteNode);  // Returns Phase[]
```

## 🌐 Network Programming

### Node Management
```typescript
// Set current execution context
setCurrentNode(myNode);

// Check entanglement status
const isEntangled = entangled(nodeA, nodeB);

// Stabilize quantum states
const stabilized = stabilize(node);
```

### Quantum Communication
```typescript
// Route through quantum network
const routeSuccess = route(source, target, [relay1, relay2]);

// Teleport quantum information
const teleportSuccess = teleport(quantumData, destinationNode);

// Create communication channel
const channel = new TeleportationChannel(source, target, 0.9, data);
```

### Network Topologies
```typescript
// Ring topology
for (let i = 0; i < nodes.length; i++) {
  const next = (i + 1) % nodes.length;
  linkEntanglement(nodes[i], nodes[next]);
}

// Star topology
for (let i = 1; i < nodes.length; i++) {
  linkEntanglement(hubNode, nodes[i]);
}

// Mesh topology
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    linkEntanglement(nodes[i], nodes[j]);
  }
}
```

## 🔧 Runtime Instructions (RISA)

### Basic Instructions
```typescript
// Load values into registers
new IRISAInstruction("LOAD", [Argument.fromFloat(42.0), Argument.fromString("R1")]);

// Arithmetic operations
new IRISAInstruction("ADD", [Argument.fromString("R1"), Argument.fromString("R2"), Argument.fromString("R3")]);

// Output results
new IRISAInstruction("OUTPUT", [Argument.fromString("R1")]);

// Program termination
new IRISAInstruction("HALT", []);
```

### Quantum Instructions
```typescript
// Set quantum phase
new IRISAInstruction("SETPHASE", [Argument.fromString("Q1"), Argument.fromFloat(1.57)]);

// Advance phase
new IRISAInstruction("ADVPHASE", [Argument.fromString("Q1"), Argument.fromFloat(0.785)]);

// Create entanglement
new IRISAInstruction("ENTANGLE", [Argument.fromString("Q1"), Argument.fromString("Q2")]);

// Quantum measurement
new IRISAInstruction("MEASURE", [Argument.fromString("Q1"), Argument.fromString("M1")]);

// Quantum collapse
new IRISAInstruction("COLLAPSE", [Argument.fromString("Q1")]);
```

### Control Flow
```typescript
// Conditional execution
new IRISAInstruction("IF", [Argument.fromString("condition")]);
new IRISAInstruction("ELSE", []);
new IRISAInstruction("ENDIF", []);

// Loops
new IRISAInstruction("LABEL", [Argument.fromString("LOOP_START")]);
new IRISAInstruction("GOTO", [Argument.fromString("LOOP_START")]);

// Coherence-based conditionals
new IRISAInstruction("IFCOH", [Argument.fromString("Q1"), Argument.fromFloat(0.8)]);
```

### Advanced Instructions
```typescript
// Holographic memory
new IRISAInstruction("HOLO_STORE", [Argument.fromString("FRAG1"), Argument.fromInt(100)]);
new IRISAInstruction("HOLO_RETRIEVE", [Argument.fromInt(100), Argument.fromString("RETRIEVED")]);

// Prime operations
new IRISAInstruction("FACTORIZE", [Argument.fromString("COMPOSITE"), Argument.fromString("F1"), Argument.fromString("F2")]);
new IRISAInstruction("RESONANCE", [Argument.fromString("P1"), Argument.fromString("P2"), Argument.fromString("PATTERN")]);

// Entropy calculations
new IRISAInstruction("ENTROPY", [Argument.fromString("STATE"), Argument.fromString("RESULT")]);
```

## 🔐 Identity & Security

### Identity Creation
```typescript
// Self-sovereign identity
const metadata = new Map<string, string>();
metadata.set("email", "user@example.com");
const identity = IdentitySystemFactory.createSelfSovereignIdentity(metadata);

// Managed identity
const managed = IdentitySystemFactory.createManagedIdentity(creatorId, domainId, metadata);
```

### Domain Management
```typescript
// Create root domain
const domain = IdentitySystemFactory.createRootDomain("company.prn", ownerId);

// Create subdomain
const subdomain = domain.createSubdomain("research", adminId);

// Add members
domain.addMember(userId, adminId);
```

### Digital Objects
```typescript
// Fungible tokens
const tokens = IdentitySystemFactory.createFungibleObject(
  "utility_token", ownerId, domainId, 1000000.0, 8, "UTK"
);

// Non-fungible tokens
const nft = IdentitySystemFactory.createNonFungibleObject(
  "certificate", ownerId, domainId, "CERT-001", metadata, "https://..."
);
```

### Permissions
```typescript
// Create permission evaluator
const evaluator = IdentitySystemFactory.createPermissionEvaluator();

// Check permissions
const hasPermission = evaluator.hasPermission(
  userPermissions, userRoles, requiredPermission, domainId
);
```

## 🧮 Mathematical Operations

### Complex Numbers
```typescript
const z1 = new Complex(0.6, 0.8);  // 0.6 + 0.8i
const z2 = Complex.fromPolar(1.0, PI/4);  // e^(iπ/4)

const sum = z1.add(z2);
const product = z1.multiply(z2);
const magnitude = z1.magnitude();
const phase = z1.phase();
```

### Prime Operations
```typescript
// Test primality
const isPrimeNumber = isPrime(97);

// Find next prime
const nextPrimeNumber = nextPrime(100);

// Generate large prime
const largePrime = generatePrime(64);  // 64-bit prime

// Factorize composite
const factors = primeFactorization(143);  // [11, 13]
```

### Modular Arithmetic
```typescript
// Modular exponentiation
const result = modularExponentiation(base, exponent, modulus);

// Greatest common divisor
const gcdResult = gcd(48, 18);

// Prime field operations
const element = new PrimeFieldElement(23, 97);
const inverse = element.inverse();
```

## 📊 Common Patterns

### Quantum Algorithm Template
```typescript
function quantumAlgorithm(): void {
  // 1. Initialize quantum states
  const qubits = [
    EntangledNode.generateNode(p1, p2, p3),
    EntangledNode.generateNode(p4, p5, p6)
  ];
  
  // 2. Create superposition
  const superposition = ResonantFragment.encode("input_data");
  
  // 3. Apply quantum operations
  linkEntanglement(qubits[0], qubits[1]);
  rotatePhase(qubits[0], PI/2);
  
  // 4. Measure and analyze
  const result = collapse(superposition);
  const finalCoherence = coherence(qubits[0]);
  
  // 5. Classical post-processing
  console.log(`Result entropy: ${entropy(result)}`);
}
```

### Network Communication Pattern
```typescript
function quantumCommunication(): void {
  // 1. Setup network
  const alice = EntangledNode.generateNode(13, 17, 19);
  const bob = EntangledNode.generateNode(23, 29, 31);
  
  // 2. Establish entanglement
  linkEntanglement(alice, bob);
  
  // 3. Prepare quantum message
  const message = ResonantFragment.encode("secret_data");
  
  // 4. Send via teleportation
  setCurrentNode(alice);
  const success = teleport(message, bob);
  
  // 5. Verify reception
  if (success) {
    const observation = observe(bob);
    console.log(`Received ${observation.length} phase components`);
  }
}
```

### Error Correction Pattern
```typescript
function quantumErrorCorrection(): void {
  // 1. Create logical qubit (3 physical qubits)
  const qubits = [
    EntangledNode.generateNode(41, 43, 47),
    EntangledNode.generateNode(53, 59, 61),
    EntangledNode.generateNode(67, 71, 73)
  ];
  
  // 2. Entangle for redundancy
  linkEntanglement(qubits[0], qubits[1]);
  linkEntanglement(qubits[1], qubits[2]);
  linkEntanglement(qubits[0], qubits[2]);
  
  // 3. Detect errors by coherence monitoring
  const coherences = qubits.map(q => coherence(q));
  
  // 4. Correct if error detected
  for (let i = 0; i < qubits.length; i++) {
    if (coherences[i] < 0.5) {
      qubits[i].coherence = 0.9; // Error correction
    }
  }
}
```

## 🎯 Best Practices

### Performance
- Use object pooling for frequently created objects
- Minimize quantum state collapse operations
- Cache prime calculations when possible
- Batch network operations for efficiency

### Security
- Always validate input parameters
- Use proper key management for cryptographic operations
- Implement proper access controls
- Monitor for quantum decoherence

### Code Organization
- Group related quantum operations
- Use meaningful variable names
- Document complex mathematical operations
- Implement proper error handling

### Testing
- Test with various coherence levels
- Verify mathematical correctness
- Check network fault tolerance
- Validate cryptographic security

---

This quick reference covers the essential ResoLang concepts and patterns. For complete examples and detailed explanations, see the full example files in this directory.