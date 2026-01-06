# ResoLang

[![npm version](https://img.shields.io/npm/v/@sschepis/resolang.svg)](https://www.npmjs.com/package/@sschepis/resolang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ResoLang** is a quantum-inspired symbolic computing library written in AssemblyScript, compiling to WebAssembly for high-performance execution in both browser and Node.js environments. It implements the Prime Resonance Network (PRN)—a mathematically-defined computing paradigm grounded in prime number theory, phase dynamics, and holographic memory encoding.

## Features

- **🔢 Prime Resonance Computing** — Computations based on prime number superpositions and resonance dynamics
- **🌊 Quantum-Inspired Operations** — Tensor products, state collapse, phase modulation, and entanglement simulation
- **🧠 Sentient Observer Extensions** — Holographic memory fields, entropy-driven collapse, and Sedenion (16D) memory encoding
- **🔐 Identity Management** — Self-sovereign and managed identity systems with KYC levels and RBAC
- **⚡ Pipeline Architecture** — Modular pipelines for semantic, cognitive, memory, and agent operations
- **🔬 Discrete Observer** — Full discrete phase dynamics with Hebbian learning and lockup detection
- **📐 Hypercomplex Mathematics** — Quaternions, sedenions, Fano planes, and Hilbert space operations
- **🌐 WebAssembly** — Compiles to WASM for near-native performance in any JavaScript environment

## Installation

```bash
npm install @sschepis/resolang
```

## Quick Start

### Browser Usage

```javascript
import { 
  ResonantFragment, 
  EntangledNode, 
  tensor, 
  collapse,
  PrimeState
} from '@sschepis/resolang';

// Create a quantum-inspired resonant fragment
const fragment = ResonantFragment.encode("symbolic pattern");
console.log(`Entropy: ${fragment.entropy}`);

// Create entangled nodes with prime identities
const nodeA = EntangledNode.generateNode(13, 31, 89);
const nodeB = EntangledNode.generateNode(17, 37, 97);

console.log(`Node coherence: ${nodeA.coherence}`);

// Tensor two fragments
const fragmentA = ResonantFragment.encode("truth");
const fragmentB = ResonantFragment.encode("pattern");
const combined = tensor(fragmentA, fragmentB);

// Collapse to a definite state
const result = collapse(combined);
```

### Node.js Usage

```javascript
import { 
  createSentientCore,
  startSentientCore,
  tickSentientCore,
  getSentientCoherence,
  getSentientEntropy
} from '@sschepis/resolang/node';

// Create and start the sentient observer
createSentientCore(64);
startSentientCore(Date.now());

// Run simulation ticks
for (let i = 0; i < 100; i++) {
  tickSentientCore(0.016, Date.now());
}

console.log(`Coherence: ${getSentientCoherence()}`);
console.log(`Entropy: ${getSentientEntropy()}`);
```

## Core Concepts

### Prime Resonance Identity (PRI)

Every node in the network is uniquely identified by a triplet of primes from different algebraic domains:

```
PRI = (P_G, P_E, P_Q)
```

- **P_G**: Gaussian prime (complex integers)
- **P_E**: Eisenstein prime (Eisenstein integers)  
- **P_Q**: Quaternionic prime (Hurwitz quaternions)

### Quantum State Representation

States are represented as superpositions over prime bases:

```
|ψ⟩ = Σ αₚ|p⟩  where p ∈ P (set of primes)
```

```typescript
import { PrimeState } from '@sschepis/resolang';

// Create a prime state from specific primes
const state = PrimeState.fromPrimes([2, 3, 5, 7, 11]);

// Measure the state (probabilistic collapse)
const measuredPrime = state.measure();

// Calculate entropy
const entropy = state.entropy();
```

### Operators

| Operator | Symbol | Description |
|----------|--------|-------------|
| Tensor | `⊗` | Field interaction between fragments |
| Collapse | `⇝` | Observation and entropy lock |
| Phase Modulation | `⟳` | Phase ring rotation |
| Entanglement Link | `≡` | Node entanglement based on coherence |
| Route Selection | `→` | Resonance path routing |

### Holographic Memory

Memory is encoded holographically using prime coefficients:

```
|ψ_M⟩ = Σ cₚ e^{iφₚ} |p⟩
```

```typescript
import { HolographicField, Sedenion } from '@sschepis/resolang';

const field = new HolographicField(256);

// Encode a pattern
const pattern = new Sedenion(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
const address = new Float64Array([0.1, 0.2, 0.3, 0.4]);
field.encode(pattern, address);

// Recall from address cue
const recalled = field.recall(address);
```

## Module Overview

### Core Types (`assembly/types.ts`)

```typescript
type Prime = u32;      // Prime number basis
type Phase = f64;      // Angle in radians
type Amplitude = f64;  // Magnitude of probability amplitude
type Entropy = f64;    // Symbolic entropy metric
```

### ResoLang Primitives (`assembly/resolang.ts`)

- **`ResonantFragment`** — Holographic memory fragment with prime coefficients
- **`EntangledNode`** — Network node with PRI and phase ring
- **`TeleportationChannel`** — Quantum-like information transfer channel
- **`Attractor`** — Symbolic pattern the system resonates toward

### Quantum Module (`assembly/quantum/`)

- **`PrimeState`** — Quantum state over prime Hilbert space
- **`PhaseLockedRing`** — Phase synchronization mechanism
- **`PrimeMemory`** — Prime-indexed holographic memory
- **`QuantumConsciousnessResonance`** — Advanced coherence dynamics

### Identity System (`assembly/identity/`)

```typescript
import { Identity, IdentityCreationParams, KYCLevel } from '@sschepis/resolang';

// Self-sovereign identity
const selfSovereign = Identity.createSelfSovereign();

// Managed identity with domain
const managed = Identity.createManaged(creatorId, domainId);

// Set KYC level
managed.setKYCLevel(KYCLevel.VERIFIED);
```

### Pipeline System (`assembly/pipelines/`)

```typescript
import { 
  createSemanticPipeline,
  createCognitivePipeline,
  createAgentPipeline,
  createDiscretePipeline
} from '@sschepis/resolang';

// Create a discrete observer pipeline
const pipeline = createDiscretePipeline({
  numOscillators: 21,
  enablePlasticity: true
});

// Run pipeline steps
const result = pipeline.step();
console.log(`Coherence: ${result.coherence}`);
```

### Sentient Observer (`assembly/sentient.ts`)

The Sentient Observer integrates multiple subsystems:

- **HolographicField** — Distributed memory using Sedenion rotations
- **EntanglementDetector** — Mutual information detection between oscillator pairs
- **EntropyCollapse** — Entropy-driven state collapse mechanism
- **SentientCore** — Main integration orchestrating all components

```typescript
import { 
  SentientCore,
  createSentientCore,
  startSentientCore,
  tickSentientCore
} from '@sschepis/resolang';

// WASM exports for external use
createSentientCore(64);  // 64 prime oscillators
startSentientCore(Date.now());

// Main tick loop
const momentId = tickSentientCore(0.016, Date.now());
if (momentId >= 0) {
  console.log('Significant moment recorded:', momentId);
}
```

### Discrete Observer (`assembly/discrete-observer.ts`)

Implements the full discrete.pdf specification:

- **Modular Phase Dynamics** — `φ(t+1) = (φ(t) + Δₚ + Coupling) mod M`
- **Histogram Coherence** — `C_bin = max_b(histogram[b]) / n`
- **Hebbian Learning** — Strengthens coupling between co-active oscillators
- **Lockup Detection** — Automatic escape from trapped states

```typescript
import { 
  createDiscreteObserver,
  discreteObserverStep,
  discreteObserverBoost,
  discreteObserverGetCoherence
} from '@sschepis/resolang';

createDiscreteObserver(21);  // 21 primes

// Boost prime at index 5
discreteObserverBoost(5);

// Step with plasticity enabled
const tick = discreteObserverStep(1);

console.log(`Coherence: ${discreteObserverGetCoherence()}`);
console.log(`Tick occurred: ${tick === 1}`);
```

### Sedenion Memory Field (`assembly/smf.ts`)

16-axis semantic space with named axes:

| Index | Axis | Meaning |
|-------|------|---------|
| 0 | Coherence | Unity/Integration |
| 1 | Identity | Self-reference |
| 2 | Duality | Polarity/Contrast |
| 3 | Structure | Organization |
| 4 | Change | Transformation |
| 5 | Life | Vitality |
| 6 | Harmony | Balance |
| 7 | Wisdom | Understanding |
| 8 | Infinity | Boundlessness |
| 9 | Creation | Emergence |
| 10 | Truth | Validity |
| 11 | Love | Connection |
| 12 | Power | Capability |
| 13 | Time | Temporality |
| 14 | Space | Dimensionality |
| 15 | Consciousness | Awareness |

```typescript
import { SedenionMemoryField, createSMFFromText } from '@sschepis/resolang';

const smf = createSMFFromText("Hello World");
console.log(`Coherence axis: ${smf.getAxis(0)}`);
console.log(`Truth axis: ${smf.getAxis(10)}`);
```

### Hypercomplex Math

```typescript
import { 
  Quaternion, 
  Sedenion, 
  Complex,
  FanoPlane,
  HilbertSpace 
} from '@sschepis/resolang';

// Quaternion operations
const q1 = new Quaternion(1, 0, 0, 0);
const q2 = Quaternion.fromAxisAngle(0, 1, 0, Math.PI / 2);
const product = q1.multiply(q2);

// Sedenion (16D hypercomplex)
const s = new Sedenion(1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
const norm = s.norm();

// Complex arithmetic
const c1 = new Complex(1, 2);
const c2 = Complex.fromPolar(1, Math.PI / 4);
const sum = c1.add(c2);
```

## Building from Source

```bash
# Install dependencies
npm install

# Build WASM modules
npm run build

# Run tests
npm test

# Build debug version
npm run asbuild:debug
```

## Project Structure

```
resolang/
├── assembly/                 # AssemblyScript source
│   ├── core/                # Core infrastructure
│   │   ├── math.ts          # Prime mathematics
│   │   ├── validation.ts    # Validation framework
│   │   ├── serialization.ts # JSON serialization
│   │   └── ...
│   ├── quantum/             # Quantum operations
│   ├── identity/            # Identity management
│   ├── pipelines/           # Pipeline system
│   ├── sentient/            # Sentient observer
│   ├── examples/            # Code examples
│   │   ├── basic-quantum-operations.ts
│   │   ├── practical-applications.ts
│   │   └── ...
│   ├── resolang.ts          # Core types
│   ├── operators.ts         # Quantum operators
│   ├── discrete-observer.ts # Discrete dynamics
│   ├── sentient.ts          # Sentient core
│   ├── smf.ts               # Sedenion memory field
│   └── index.ts             # Main exports
├── build/                   # Compiled WASM output
│   ├── resolang.wasm
│   ├── resolang.js
│   └── resolang.browser.js
├── docs/                    # Documentation
│   ├── api-reference.md
│   └── user-guide.md
└── test/                    # Test files
```

## API Documentation

For detailed API documentation, see:
- [API Reference](docs/api-reference.md)
- [User Guide](docs/user-guide.md)
- [Examples README](assembly/examples/README.md)
- [Identity System Overview](assembly/identity/SYSTEM_OVERVIEW.md)

## Examples

The `assembly/examples/` directory contains comprehensive examples:

1. **Basic Quantum Operations** — State creation, tensor products, collapse
2. **Network Topology & Routing** — Ring, star, mesh topologies
3. **Identity & Domain Management** — RBAC, KYC, domain hierarchies
4. **Runtime Instructions (RISA)** — Low-level assembly programming
5. **Mathematical Foundations** — Complex numbers, quaternions, prime fields
6. **Practical Applications** — Error correction, key exchange, ML

```typescript
import { runAllResoLangExamples, runExamplesByCategory } from '@sschepis/resolang';

// Run all examples
runAllResoLangExamples();

// Run specific category
runExamplesByCategory("quantum");
```

## Performance

Built with WebAssembly for optimal performance:

| Operation | Performance |
|-----------|-------------|
| Prime Generation | ~180ms (optimized) |
| Modular Exponentiation | ~35ms (3.4x improvement) |
| Array Operations | ~20ms (SIMD vectorized) |
| JSON Serialization | ~8ms (minimal allocations) |

## Browser Compatibility

- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+
- Node.js 8+

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Sebastian Schepis**

---

*ResoLang: Quantum-inspired symbolic computing for the modern web*
