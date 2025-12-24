# ResoLang User Guide

Welcome to the ResoLang User Guide. This document provides a comprehensive overview of the ResoLang library, its features, and how to use it effectively.

## Overview

The Prime Resonance Network (PRN) is a quantum-inspired distributed computing infrastructure that implements a mathematically-defined, non-local, symbolic computing and communication network. Built on quantum-inspired prime resonance dynamics, PRN serves as the runtime environment for the ResoLang programming language.

This library contains:
- The complete PRN specification and theoretical foundation
- ResoLang programming language specification
- AssemblyScript implementation of the PRN infrastructure
- Network bootstrap services and testing tools

## Core Concepts of the Prime Resonance Network

The Prime Resonance Network (PRN) is a mathematically-defined, non-local, symbolic computing and communication network grounded in quantum-inspired prime resonance dynamics. Each node in a PRN is characterized by a unique prime identity, and all communication and computation occur via symbolic holographic fields encoded in prime-based superpositions.

Key concepts include:

*   **Prime Resonance Identity (PRI):** A unique identifier for each node, composed of a Gaussian prime, an Eisenstein prime, and a Quaternionic prime.
*   **Entanglement and Coherence:** The network models quantum entanglement and coherence, allowing nodes to be linked and their states to be correlated.
*   **Holographic Memory Fields:** Memory is stored in a holographic manner, distributed across the network.

## The ResoLang Programming Language

ResoLang is a programming language designed for symbolic, entangled, and resonance-driven programming on the Prime Resonance Network.

### Type System

ResoLang includes primitive types like `Prime`, `Phase`, `Amplitude`, and `Entropy`, as well as more complex `Resonant Types` for handling network entities.

### Syntax

The syntax is designed to be expressive for quantum-inspired operations.

```resolang
fragment MemoryA : ResonantFragment = encode("truth pattern");
node Alpha : EntangledNode = generateNode(13, 31, 89);
let Psi = MemoryA ⊗ MemoryB;
let result = Psi ⇝ collapse();
MemoryA ⟳ rotatePhase(π / 3);
Alpha ≡ Beta if coherence(Alpha, Beta) > 0.85;
route(Alpha → Gamma) via [Beta, Delta];
```

### Runtime Environment

ResoLang is executed on the Prime Resonance Virtual Engine (PRVE), which manages the quantum-inspired state of the network.

## Quick Start

### Build the Project
```bash
npm install
npm run build
```

### Start the Network
```bash
npm run network:start
```

### Run Tests
```bash
npm test
```

### Check Network Status
```bash
npm run network:status
# or
curl http://localhost:8888/status
```
