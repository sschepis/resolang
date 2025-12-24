// network-topology-routing.ts
// Demonstrates network topology creation and quantum routing in ResoLang

import {
  EntangledNode,
  ResonantFragment,
  TeleportationChannel,
  setCurrentNode
} from "../resolang";
import {
  linkEntanglement,
  route,
  coherence,
  entropy,
  tensor
} from "../operators";
import {
  teleport,
  entangled,
  observe
} from "../functionalBlocks";
import { toFixed } from "../utils";

/**
 * Example: Creating a Simple Network Topology
 * Shows how to build a basic quantum network with multiple nodes
 */
export function exampleBasicTopology(): void {
  console.log("=== Basic Network Topology Example ===");
  
  // Create a simple ring topology with 4 nodes
  const nodes: EntangledNode[] = [];
  const nodeData = [
    { id: "Gateway", primes: [2, 3, 5] },
    { id: "Router1", primes: [7, 11, 13] },
    { id: "Router2", primes: [17, 19, 23] },
    { id: "Terminal", primes: [29, 31, 37] }
  ];
  
  for (let i = 0; i < nodeData.length; i++) {
    const node = EntangledNode.generateNode(
      nodeData[i].primes[0],
      nodeData[i].primes[1],
      nodeData[i].primes[2]
    );
    node.id = nodeData[i].id;
    node.coherence = 0.8 + (Math.random() * 0.15); // Random coherence 0.8-0.95
    nodes.push(node);
  }
  
  console.log("Created network nodes:");
  for (let i = 0; i < nodes.length; i++) {
    console.log(`  ${nodes[i].id}: coherence=${toFixed(coherence(nodes[i]), 4)}`);
  }
  
  // Create ring topology connections
  for (let i = 0; i < nodes.length; i++) {
    const nextIndex = (i + 1) % nodes.length;
    linkEntanglement(nodes[i], nodes[nextIndex]);
  }
  
  console.log("Ring topology established with quantum entanglement links");
}

/**
 * Example: Multi-hop Quantum Routing
 * Demonstrates routing messages through multiple intermediate nodes
 */
export function exampleMultiHopRouting(): void {
  console.log("\n=== Multi-hop Quantum Routing Example ===");
  
  // Create a linear chain of nodes for routing
  const chainNodes: EntangledNode[] = [];
  const chainLength = 5;
  
  for (let i = 0; i < chainLength; i++) {
    // Use consecutive primes for each node
    const baseIndex = i * 3;
    const primes = [
      getPrimeByIndex(baseIndex),
      getPrimeByIndex(baseIndex + 1),
      getPrimeByIndex(baseIndex + 2)
    ];
    
    const node = EntangledNode.generateNode(primes[0], primes[1], primes[2]);
    node.id = `Node${i}`;
    node.coherence = 0.85 + (i * 0.02); // Gradually increasing coherence
    chainNodes.push(node);
  }
  
  // Establish adjacent connections
  for (let i = 0; i < chainNodes.length - 1; i++) {
    linkEntanglement(chainNodes[i], chainNodes[i + 1]);
  }
  
  // Test routing from first to last node through intermediates
  const source = chainNodes[0];
  const destination = chainNodes[chainLength - 1];
  const intermediates = chainNodes.slice(1, chainLength - 1);
  
  console.log(`Routing from ${source.id} to ${destination.id}`);
  console.log(`Via intermediate nodes: [${intermediates.map<string>(n => n.id).join(", ")}]`);
  
  const routingSuccess = route(source, destination, intermediates);
  console.log(`Multi-hop routing successful: ${routingSuccess}`);
}

/**
 * Example: Star Network Topology
 * Creates a hub-and-spoke network with central coordination
 */
export function exampleStarTopology(): void {
  console.log("\n=== Star Network Topology Example ===");
  
  // Create central hub node
  const hub = EntangledNode.generateNode(41, 43, 47);
  hub.id = "Hub";
  hub.coherence = 0.95; // High coherence for central coordination
  
  // Create spoke nodes
  const spokes: EntangledNode[] = [];
  const spokeCount = 6;
  
  for (let i = 0; i < spokeCount; i++) {
    const baseIndex = 15 + (i * 3); // Start from higher primes
    const node = EntangledNode.generateNode(
      getPrimeByIndex(baseIndex),
      getPrimeByIndex(baseIndex + 1),
      getPrimeByIndex(baseIndex + 2)
    );
    node.id = `Spoke${i + 1}`;
    node.coherence = 0.75 + (Math.random() * 0.15);
    spokes.push(node);
  }
  
  console.log(`Created star topology with hub (${hub.id}) and ${spokeCount} spokes`);
  
  // Connect each spoke to the hub
  for (let i = 0; i < spokes.length; i++) {
    linkEntanglement(hub, spokes[i]);
  }
  
  // Test hub-mediated communication between spokes
  setCurrentNode(spokes[0]);
  const message = ResonantFragment.encode("star network message");
  
  console.log(`Sending message from ${spokes[0].id} to ${spokes[3].id} via hub`);
  
  // Route through hub
  const routeViaHub = route(spokes[0], spokes[3], [hub]);
  console.log(`Hub-mediated routing successful: ${routeViaHub}`);
  
  setCurrentNode(null);
}

/**
 * Example: Mesh Network with Redundant Paths
 * Creates a fully connected mesh for maximum resilience
 */
export function exampleMeshTopology(): void {
  console.log("\n=== Mesh Network Topology Example ===");
  
  // Create mesh nodes
  const meshNodes: EntangledNode[] = [];
  const meshSize = 4;
  
  for (let i = 0; i < meshSize; i++) {
    const baseIndex = 30 + (i * 3);
    const node = EntangledNode.generateNode(
      getPrimeByIndex(baseIndex),
      getPrimeByIndex(baseIndex + 1),
      getPrimeByIndex(baseIndex + 2)
    );
    node.id = `Mesh${String.fromCharCode(65 + i)}`; // MeshA, MeshB, etc.
    node.coherence = 0.8 + (Math.random() * 0.1);
    meshNodes.push(node);
  }
  
  // Create full mesh connectivity
  let connectionCount = 0;
  for (let i = 0; i < meshNodes.length; i++) {
    for (let j = i + 1; j < meshNodes.length; j++) {
      linkEntanglement(meshNodes[i], meshNodes[j]);
      connectionCount++;
    }
  }
  
  console.log(`Created mesh topology with ${meshNodes.length} nodes and ${connectionCount} connections`);
  
  // Test multiple routing paths
  const source = meshNodes[0];
  const destination = meshNodes[3];
  
  // Test direct route
  const directRoute = route(source, destination, []);
  console.log(`Direct route from ${source.id} to ${destination.id}: ${directRoute}`);
  
  // Test route via one intermediate
  const viaOne = route(source, destination, [meshNodes[1]]);
  console.log(`Route via ${meshNodes[1].id}: ${viaOne}`);
  
  // Test route via two intermediates
  const viaTwo = route(source, destination, [meshNodes[1], meshNodes[2]]);
  console.log(`Route via ${meshNodes[1].id} and ${meshNodes[2].id}: ${viaTwo}`);
}

/**
 * Example: Dynamic Network Reconfiguration
 * Shows how network topology can adapt to changing conditions
 */
export function exampleDynamicReconfiguration(): void {
  console.log("\n=== Dynamic Network Reconfiguration Example ===");
  
  // Create initial network
  const nodes: EntangledNode[] = [];
  for (let i = 0; i < 4; i++) {
    const baseIndex = 45 + (i * 3);
    const node = EntangledNode.generateNode(
      getPrimeByIndex(baseIndex),
      getPrimeByIndex(baseIndex + 1),
      getPrimeByIndex(baseIndex + 2)
    );
    node.id = `Dynamic${i}`;
    node.coherence = 0.9;
    nodes.push(node);
  }
  
  // Initial linear topology
  for (let i = 0; i < nodes.length - 1; i++) {
    linkEntanglement(nodes[i], nodes[i + 1]);
  }
  
  console.log("Initial linear topology established");
  
  // Test initial routing
  let routeSuccess = route(nodes[0], nodes[3], [nodes[1], nodes[2]]);
  console.log(`Initial routing success: ${routeSuccess}`);
  
  // Simulate node failure by reducing coherence
  nodes[1].coherence = 0.3; // Critical coherence reduction
  console.log(`Simulated failure of ${nodes[1].id} (coherence reduced to ${toFixed(nodes[1].coherence, 2)})`);
  
  // Test routing with failed node
  routeSuccess = route(nodes[0], nodes[3], [nodes[1], nodes[2]]);
  console.log(`Routing with failed node: ${routeSuccess}`);
  
  // Reconfigure with backup connection
  linkEntanglement(nodes[0], nodes[2]); // Direct backup link
  console.log("Established backup direct connection");
  
  // Test alternative routing
  routeSuccess = route(nodes[0], nodes[3], [nodes[2]]);
  console.log(`Alternative routing success: ${routeSuccess}`);
}

/**
 * Example: Network-wide Quantum State Distribution
 * Demonstrates distributing quantum information across the network
 */
export function exampleStateDistribution(): void {
  console.log("\n=== Network-wide State Distribution Example ===");
  
  // Create distribution network
  const distributionNodes: EntangledNode[] = [];
  for (let i = 0; i < 5; i++) {
    const baseIndex = 60 + (i * 3);
    const node = EntangledNode.generateNode(
      getPrimeByIndex(baseIndex),
      getPrimeByIndex(baseIndex + 1),
      getPrimeByIndex(baseIndex + 2)
    );
    node.id = `Dist${i}`;
    node.coherence = 0.88 + (i * 0.02);
    distributionNodes.push(node);
  }
  
  // Create star topology for efficient distribution
  const centralNode = distributionNodes[0];
  for (let i = 1; i < distributionNodes.length; i++) {
    linkEntanglement(centralNode, distributionNodes[i]);
  }
  
  // Create quantum state to distribute
  const sharedState = ResonantFragment.encode("distributed quantum state");
  console.log(`Created shared state with entropy: ${toFixed(entropy(sharedState), 4)}`);
  
  // Distribute state from central node to all others
  setCurrentNode(centralNode);
  let distributionSuccess = true;
  
  for (let i = 1; i < distributionNodes.length; i++) {
    const success = teleport(sharedState, distributionNodes[i]);
    console.log(`Distribution to ${distributionNodes[i].id}: ${success}`);
    distributionSuccess = distributionSuccess && success;
  }
  
  console.log(`Overall distribution success: ${distributionSuccess}`);
  
  // Verify state coherence across network
  for (let i = 1; i < distributionNodes.length; i++) {
    const observedPhases = observe(distributionNodes[i]);
    console.log(`${distributionNodes[i].id} observed ${observedPhases.length} phase components`);
  }
  
  setCurrentNode(null);
}

/**
 * Helper function to get the nth prime number
 */
function getPrimeByIndex(index: i32): u32 {
  const primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
    239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419
  ];
  
  if (index >= 0 && index < primes.length) {
    return primes[index];
  }
  return 2; // Fallback to first prime
}

/**
 * Run all network topology and routing examples
 */
export function runAllNetworkExamples(): void {
  console.log("=== Running All Network Topology and Routing Examples ===\n");
  
  exampleBasicTopology();
  exampleMultiHopRouting();
  exampleStarTopology();
  exampleMeshTopology();
  exampleDynamicReconfiguration();
  exampleStateDistribution();
  
  console.log("\n=== All Network Examples Completed ===");
}