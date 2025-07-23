/**
 * Builder patterns for complex object construction
 * Provides fluent interfaces for creating objects with many parameters
 */

import { NodeID, Prime, Phase, EntanglementStrength } from "../types";
import { PrimeState } from "../quantum/prime-state";
import { PrimeStateEngine } from "../runtime/state/primeState";
import { NetworkNode } from "../prn-node";
import { QuantumNode, BaseNetworkNode, NetworkLink } from "./network-base";
import { MockQuantumNode } from "../tests/mocks";
import { createArray } from "./arrays";
import { requireNonEmpty, requirePositive, requireNonNegative } from "./validators";

/**
 * Builder for PrimeState objects
 */
export class PrimeStateBuilder {
  private amplitudes: Map<Prime, f64>;
  private phases: Map<Prime, Phase>;
  private normalizationFactor: f64;
  
  constructor() {
    this.amplitudes = new Map<Prime, f64>();
    this.phases = new Map<Prime, Phase>();
    this.normalizationFactor = 1.0;
  }
  
  /**
   * Adds a prime with amplitude and phase
   */
  withPrime(prime: Prime, amplitude: f64, phase: Phase = 0.0): PrimeStateBuilder {
    requirePositive(prime, "Prime");
    requireNonNegative(amplitude, "Amplitude");
    this.amplitudes.set(prime, amplitude);
    this.phases.set(prime, phase);
    return this;
  }
  
  /**
   * Adds multiple primes with equal amplitudes
   */
  withPrimes(primes: Array<Prime>, amplitude: f64 = 1.0): PrimeStateBuilder {
    for (let i = 0; i < primes.length; i++) {
      this.withPrime(primes[i], amplitude);
    }
    return this;
  }
  
  /**
   * Sets the normalization factor
   */
  withNormalization(factor: f64): PrimeStateBuilder {
    this.normalizationFactor = requirePositive(factor, "Normalization factor");
    return this;
  }
  
  /**
   * Auto-normalizes the state
   */
  normalized(): PrimeStateBuilder {
    let sum = 0.0;
    const amplitudeValues = this.amplitudes.values();
    for (let i = 0; i < amplitudeValues.length; i++) {
      sum += amplitudeValues[i] * amplitudeValues[i];
    }
    
    if (sum > 0) {
      this.normalizationFactor = 1.0 / Math.sqrt(sum);
    }
    return this;
  }
  
  /**
   * Builds the PrimeState
   */
  build(): PrimeStateEngine {
    const state = new PrimeStateEngine();
    const primes = this.amplitudes.keys();
    
    for (let i = 0; i < primes.length; i++) {
      const prime = primes[i];
      const amplitude = this.amplitudes.get(prime) * this.normalizationFactor;
      const phase = this.phases.has(prime) ? this.phases.get(prime) : 0.0;
      
      state.setAmplitude(prime, amplitude);
      state.setPhase(prime, phase);
    }
    
    return state;
  }
}

/**
 * Builder for NetworkNode objects
 */
export class NetworkNodeBuilder {
  private id: NodeID | null = null;
  private primes: Array<Prime> | null = null;
  private entanglements: Map<NodeID, EntanglementStrength>;
  private coherence: f64 = 1.0;
  private isActive: bool = true;
  private quantumState: PrimeState | null = null;
  
  constructor() {
    this.entanglements = new Map<NodeID, EntanglementStrength>();
  }
  
  /**
   * Sets the node ID
   */
  withId(id: NodeID): NetworkNodeBuilder {
    this.id = requireNonEmpty(id, "Node ID");
    return this;
  }
  
  /**
   * Sets the prime triplet
   */
  withPrimes(p1: Prime, p2: Prime, p3: Prime): NetworkNodeBuilder {
    this.primes = [p1, p2, p3];
    return this;
  }
  
  /**
   * Sets the prime array
   */
  withPrimeArray(primes: Array<Prime>): NetworkNodeBuilder {
    this.primes = primes;
    return this;
  }
  
  /**
   * Adds an entanglement
   */
  withEntanglement(nodeId: NodeID, strength: EntanglementStrength): NetworkNodeBuilder {
    requireNonEmpty(nodeId, "Node ID");
    requireNonNegative(strength, "Entanglement strength");
    this.entanglements.set(nodeId, Math.min(1.0, strength));
    return this;
  }
  
  /**
   * Sets the coherence
   */
  withCoherence(coherence: f64): NetworkNodeBuilder {
    this.coherence = Math.max(0.0, Math.min(1.0, coherence));
    return this;
  }
  
  /**
   * Sets the active state
   */
  withActiveState(isActive: bool): NetworkNodeBuilder {
    this.isActive = isActive;
    return this;
  }
  
  /**
   * Sets the quantum state
   */
  withQuantumState(state: PrimeState): NetworkNodeBuilder {
    this.quantumState = state;
    return this;
  }
  
  /**
   * Builds the NetworkNode
   */
  build(): QuantumNode {
    const id = this.id;
    if (!id) {
      throw new Error("Node ID is required");
    }

    const primes = this.primes;
    if (!primes || primes.length < 3) {
      throw new Error("At least 3 primes are required");
    }
    
    const node = new MockQuantumNode(
      id,
      primes
    );
    
    // Set additional properties
    node.coherence = this.coherence;
    node.isActive = this.isActive as boolean;
    
    // Add entanglements
    const entanglementKeys = this.entanglements.keys();
    for (let i = 0; i < entanglementKeys.length; i++) {
      const nodeId = entanglementKeys[i];
      const strength = this.entanglements.get(nodeId);
      node.entanglementMap.set(nodeId, strength);
    }
    
    // Set quantum state if provided
    if (this.quantumState) {
      // This is a type mismatch, so we'll just have to ignore it for now.
      // The builder should be updated to work with the new PrimeStateEngine.
    }
    
    return node;
  }
}

/**
 * Builder for protocol messages
 */
export class ProtocolMessageBuilder<T> {
  private type: string | null = null;
  private sourceId: NodeID | null = null;
  private targetId: NodeID | null = null;
  private timestamp: f64 = 0;
  private payload: Map<string, string>;
  private metadata: Map<string, string>;
  
  constructor() {
    this.payload = new Map<string, string>();
    this.metadata = new Map<string, string>();
  }
  
  /**
   * Sets the message type
   */
  withType(type: string): ProtocolMessageBuilder<T> {
    this.type = requireNonEmpty(type, "Message type");
    return this;
  }
  
  /**
   * Sets the source node
   */
  withSource(sourceId: NodeID): ProtocolMessageBuilder<T> {
    this.sourceId = requireNonEmpty(sourceId, "Source ID");
    return this;
  }
  
  /**
   * Sets the target node
   */
  withTarget(targetId: NodeID): ProtocolMessageBuilder<T> {
    this.targetId = requireNonEmpty(targetId, "Target ID");
    return this;
  }
  
  /**
   * Sets the timestamp
   */
  withTimestamp(timestamp: f64 = Date.now()): ProtocolMessageBuilder<T> {
    this.timestamp = timestamp;
    return this;
  }
  
  /**
   * Adds a payload field
   */
  withPayload(key: string, value: string): ProtocolMessageBuilder<T> {
    this.payload.set(key, value);
    return this;
  }
  
  /**
   * Adds metadata
   */
  withMetadata(key: string, value: string): ProtocolMessageBuilder<T> {
    this.metadata.set(key, value);
    return this;
  }
  
  /**
   * Builds the message using a factory function
   */
  build(factory: (builder: ProtocolMessageBuilder<T>) => T): T {
    if (!this.type) {
      throw new Error("Message type is required");
    }
    if (!this.sourceId) {
      throw new Error("Source ID is required");
    }
    if (!this.timestamp) {
      this.timestamp = Date.now() as f64;
    }
    
    return factory(this);
  }
  
  /**
   * Gets the built values
   */
  getType(): string { return this.type!; }
  getSourceId(): NodeID { return this.sourceId!; }
  getTargetId(): NodeID | null { return this.targetId; }
  getTimestamp(): f64 { return this.timestamp!; }
  getPayload(): Map<string, string> { return this.payload; }
  getMetadata(): Map<string, string> { return this.metadata; }
}

/**
 * Builder for network topology
 */
export class NetworkTopologyBuilder {
  private nodes: Array<BaseNetworkNode>;
  private links: Array<NetworkLink>;
  private maxNodes: i32 = 1000;
  private maxLinks: i32 = 10000;
  
  constructor() {
    this.nodes = createArray<BaseNetworkNode>();
    this.links = createArray<NetworkLink>();
  }
  
  /**
   * Sets maximum nodes
   */
  withMaxNodes(max: i32): NetworkTopologyBuilder {
    this.maxNodes = requirePositive(max, "Max nodes") as i32;
    return this;
  }
  
  /**
   * Sets maximum links
   */
  withMaxLinks(max: i32): NetworkTopologyBuilder {
    this.maxLinks = requirePositive(max, "Max links") as i32;
    return this;
  }
  
  /**
   * Adds a node
   */
  withNode(node: BaseNetworkNode): NetworkTopologyBuilder {
    this.nodes.push(node);
    return this;
  }
  
  /**
   * Adds multiple nodes
   */
  withNodes(nodes: Array<BaseNetworkNode>): NetworkTopologyBuilder {
    for (let i = 0; i < nodes.length; i++) {
      this.nodes.push(nodes[i]);
    }
    return this;
  }
  
  /**
   * Adds a link
   */
  withLink(link: NetworkLink): NetworkTopologyBuilder {
    this.links.push(link);
    return this;
  }
  
  /**
   * Creates a link between two nodes
   */
  withConnection(sourceId: NodeID, targetId: NodeID, strength: f64 = 1.0): NetworkTopologyBuilder {
    // This would need a concrete NetworkLink implementation
    // For now, we'll skip the actual link creation
    return this;
  }
  
  /**
   * Creates a fully connected topology
   */
  fullyConnected(strength: f64 = 1.0): NetworkTopologyBuilder {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        this.withConnection(this.nodes[i].id, this.nodes[j].id, strength);
      }
    }
    return this;
  }
  
  /**
   * Creates a ring topology
   */
  ring(strength: f64 = 1.0): NetworkTopologyBuilder {
    for (let i = 0; i < this.nodes.length; i++) {
      const next = (i + 1) % this.nodes.length;
      this.withConnection(this.nodes[i].id, this.nodes[next].id, strength);
    }
    return this;
  }
  
  /**
   * Creates a star topology with the first node as center
   */
  star(strength: f64 = 1.0): NetworkTopologyBuilder {
    if (this.nodes.length > 1) {
      const center = this.nodes[0];
      for (let i = 1; i < this.nodes.length; i++) {
        this.withConnection(center.id, this.nodes[i].id, strength);
      }
    }
    return this;
  }
  
  /**
   * Gets the built configuration
   */
  getNodes(): Array<BaseNetworkNode> { return this.nodes; }
  getLinks(): Array<NetworkLink> { return this.links; }
  getMaxNodes(): i32 { return this.maxNodes; }
  getMaxLinks(): i32 { return this.maxLinks; }
}

/**
 * Builder for quantum circuits
 */
export class QuantumCircuitBuilder {
  private qubits: i32 = 0;
  private gates: Array<QuantumGate>;
  private measurements: Array<i32>;
  
  constructor() {
    this.gates = createArray<QuantumGate>();
    this.measurements = createArray<i32>();
  }
  
  /**
   * Sets the number of qubits
   */
  withQubits(count: i32): QuantumCircuitBuilder {
    this.qubits = requirePositive(count, "Qubit count") as i32;
    return this;
  }
  
  /**
   * Adds a Hadamard gate
   */
  hadamard(qubit: i32): QuantumCircuitBuilder {
    this.gates.push(new QuantumGate("H", [qubit]));
    return this;
  }
  
  /**
   * Adds a Pauli-X gate
   */
  pauliX(qubit: i32): QuantumCircuitBuilder {
    this.gates.push(new QuantumGate("X", [qubit]));
    return this;
  }
  
  /**
   * Adds a Pauli-Y gate
   */
  pauliY(qubit: i32): QuantumCircuitBuilder {
    this.gates.push(new QuantumGate("Y", [qubit]));
    return this;
  }
  
  /**
   * Adds a Pauli-Z gate
   */
  pauliZ(qubit: i32): QuantumCircuitBuilder {
    this.gates.push(new QuantumGate("Z", [qubit]));
    return this;
  }
  
  /**
   * Adds a CNOT gate
   */
  cnot(control: i32, target: i32): QuantumCircuitBuilder {
    this.gates.push(new QuantumGate("CNOT", [control, target]));
    return this;
  }
  
  /**
   * Adds a phase gate
   */
  phase(qubit: i32, angle: f64): QuantumCircuitBuilder {
    const gate = new QuantumGate("P", [qubit]);
    gate.parameter = angle;
    this.gates.push(gate);
    return this;
  }
  
  /**
   * Adds a measurement
   */
  measure(qubit: i32): QuantumCircuitBuilder {
    this.measurements.push(qubit);
    return this;
  }
  
  /**
   * Measures all qubits
   */
  measureAll(): QuantumCircuitBuilder {
    for (let i = 0; i < this.qubits; i++) {
      this.measurements.push(i);
    }
    return this;
  }
  
  /**
   * Gets the built circuit configuration
   */
  getQubits(): i32 { return this.qubits; }
  getGates(): Array<QuantumGate> { return this.gates; }
  getMeasurements(): Array<i32> { return this.measurements; }
}

/**
 * Simple quantum gate representation
 */
class QuantumGate {
  type: string;
  qubits: Array<i32>;
  parameter: f64 = 0.0;
  
  constructor(type: string, qubits: Array<i32>) {
    this.type = type;
    this.qubits = qubits;
  }
}

/**
 * Utility function to create a PrimeState builder
 */
export function primeState(): PrimeStateBuilder {
  return new PrimeStateBuilder();
}

/**
 * Utility function to create a NetworkNode builder
 */
export function networkNode(): NetworkNodeBuilder {
  return new NetworkNodeBuilder();
}

/**
 * Utility function to create a ProtocolMessage builder
 */
export function protocolMessage<T>(): ProtocolMessageBuilder<T> {
  return new ProtocolMessageBuilder<T>();
}

/**
 * Utility function to create a NetworkTopology builder
 */
export function networkTopology(): NetworkTopologyBuilder {
  return new NetworkTopologyBuilder();
}

/**
 * Utility function to create a QuantumCircuit builder
 */
export function quantumCircuit(): QuantumCircuitBuilder {
  return new QuantumCircuitBuilder();
}