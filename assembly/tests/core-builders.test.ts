// assembly/tests/core-builders.test.ts

import {
  primeState,
  networkNode,
  protocolMessage,
  networkTopology,
  quantumCircuit,
} from "../core/builders";
import { PrimeStateEngine } from "../runtime/state/primeState";
import { QuantumNode } from "../core/network-base";
import { MockQuantumNode } from "./mocks";

export function testPrimeStateBuilder(): void {
  const builder = primeState();
  const state = builder
    .withPrime(2, 0.5)
    .withPrime(3, 0.5)
    .normalized()
    .build() as PrimeStateEngine;

  assert(state.getAmplitude(2) > 0, "PrimeState should have an amplitude for prime 2");
  assert(state.getAmplitude(3) > 0, "PrimeState should have an amplitude for prime 3");
  
  const amp2 = state.getAmplitude(2);
  const amp3 = state.getAmplitude(3);
  const sumOfSquares = amp2 * amp2 + amp3 * amp3;
  
  assert(Math.abs(sumOfSquares - 1.0) < 0.0001, "The sum of squared amplitudes should be close to 1 after normalization");
}

export function testNetworkNodeBuilder(): void {
  const builder = networkNode();
  const node = builder
    .withId("test-node")
    .withPrimes(2, 3, 5)
    .withCoherence(0.8)
    .withEntanglement("other-node", 0.5)
    .build() as QuantumNode;

  assert(node.id == "test-node", "QuantumNode should have the correct ID");
  assert(node.primes[0] == 2 && node.primes[1] == 3 && node.primes[2] == 5, "QuantumNode should have the correct primes");
  assert(node.coherence == 0.8, "QuantumNode should have the correct coherence");
  assert(node.entanglementMap.has("other-node"), "QuantumNode should have the correct entanglement");
}

export function runAllBuilderTests(): void {
  console.log("Running builder tests...");

  testPrimeStateBuilder();
  console.log("✓ PrimeStateBuilder test passed");

  testNetworkNodeBuilder();
  console.log("✓ NetworkNodeBuilder test passed");

  testProtocolMessageBuilder();
  console.log("✓ ProtocolMessageBuilder test passed");

  testNetworkTopologyBuilder();
  console.log("✓ NetworkTopologyBuilder test passed");

  testQuantumCircuitBuilder();
  console.log("✓ QuantumCircuitBuilder test passed");

  console.log("\nAll builder tests passed! ✨");
}

export function testQuantumCircuitBuilder(): void {
  const builder = quantumCircuit();
  const circuit = builder
    .withQubits(2)
    .hadamard(0)
    .cnot(0, 1)
    .measureAll();

  assert(circuit.getQubits() == 2, "QuantumCircuitBuilder should have the correct number of qubits");
  assert(circuit.getGates().length == 2, "QuantumCircuitBuilder should have the correct number of gates");
  assert(circuit.getMeasurements().length == 2, "QuantumCircuitBuilder should have the correct number of measurements");
}

export function testNetworkTopologyBuilder(): void {
  const builder = networkTopology();
  const node1 = new MockQuantumNode("node-1", [2, 3, 5]);
  const node2 = new MockQuantumNode("node-2", [7, 11, 13]);
  const topology = builder
    .withNode(node1)
    .withNode(node2)
    .withMaxNodes(10)
    .withMaxLinks(100);

  assert(topology.getNodes().length == 2, "NetworkTopologyBuilder should have the correct number of nodes");
  assert(topology.getMaxNodes() == 10, "NetworkTopologyBuilder should have the correct max nodes");
  assert(topology.getMaxLinks() == 100, "NetworkTopologyBuilder should have the correct max links");
}

class MockProtocolMessage {
  constructor(
    public type: string,
    public sourceId: string,
    public targetId: string | null,
    public timestamp: f64,
    public payload: Map<string, string>,
    public metadata: Map<string, string>
  ) {}
}

export function testProtocolMessageBuilder(): void {
  const builder = protocolMessage<MockProtocolMessage>();
  const message = builder
    .withType("test-message")
    .withSource("node-a")
    .withTarget("node-b")
    .withPayload("data", "hello")
    .build(
      (b) =>
        new MockProtocolMessage(
          b.getType(),
          b.getSourceId(),
          b.getTargetId(),
          b.getTimestamp(),
          b.getPayload(),
          b.getMetadata()
        )
    );

  assert(message.type == "test-message", "ProtocolMessage should have the correct type");
  assert(message.sourceId == "node-a", "ProtocolMessage should have the correct source ID");
  assert(message.targetId == "node-b", "ProtocolMessage should have the correct target ID");
  assert(message.payload.has("data"), "ProtocolMessage should have the correct payload");
}