/**
 * Base classes for network components
 * Consolidates common network patterns and functionality
 */

import { NodeID, Prime, Phase, EntanglementStrength } from "../types";
import { Serializable } from "./interfaces";
import { NetworkException } from "./errors";
import { NetworkError } from "./constants";
import { createArray } from "./arrays";
import { requireNonEmpty, requirePositive } from "./validators";
import { Coherence, Timestamp, Hash, NetworkStatus } from "./type-guards";
import { JSONBuilder } from "./serialization";

/**
 * Base class for all network nodes
 */
export abstract class BaseNetworkNode implements Serializable {
  id: NodeID;
  isActive: boolean;
  lastSyncTime: Timestamp;
  coherence: Coherence;
  
  constructor(id: NodeID) {
    this.id = requireNonEmpty(id, "Node ID");
    this.isActive = true;
    this.lastSyncTime = 0.0;
    this.coherence = 1.0;
  }
  
  /**
   * Activates the node
   */
  activate(): void {
    this.isActive = true;
    this.onActivate();
  }
  
  /**
   * Deactivates the node
   */
  deactivate(): void {
    this.isActive = false;
    this.onDeactivate();
  }
  
  /**
   * Updates the last sync time
   */
  updateSyncTime(time: Timestamp = Date.now()): void {
    this.lastSyncTime = time;
  }
  
  /**
   * Gets the time since last sync
   */
  getTimeSinceSync(): f64 {
    return Date.now() - this.lastSyncTime;
  }
  
  /**
   * Checks if the node needs synchronization
   */
  needsSync(maxSyncInterval: f64): bool {
    return this.getTimeSinceSync() > maxSyncInterval;
  }
  
  /**
   * Updates coherence value
   */
  updateCoherence(value: Coherence): void {
    this.coherence = Math.max(0.0, Math.min(1.0, value));
  }
  
  /**
   * Hook called when node is activated
   */
  protected abstract onActivate(): void;
  
  /**
   * Hook called when node is deactivated
   */
  protected abstract onDeactivate(): void;
  
  /**
   * Serializes the node to string
   */
  abstract toString(): string;
}

/**
 * Base class for nodes with entanglement capabilities
 */
export abstract class EntanglableNode extends BaseNetworkNode {
  entanglementMap: Map<NodeID, EntanglementStrength>;
  maxEntanglements: i32;
  
  constructor(id: NodeID, maxEntanglements: i32 = 10) {
    super(id);
    this.entanglementMap = new Map<NodeID, EntanglementStrength>();
    this.maxEntanglements = requirePositive(maxEntanglements, "Max entanglements") as i32;
  }
  
  /**
   * Creates an entanglement with another node
   */
  entangleWith(nodeId: NodeID, strength: EntanglementStrength): void {
    if (this.entanglementMap.size >= this.maxEntanglements) {
      this.pruneWeakEntanglements();
    }
    
    this.entanglementMap.set(nodeId, strength);
    this.onEntangle(nodeId, strength);
  }
  
  /**
   * Removes an entanglement
   */
  disentangleFrom(nodeId: NodeID): void {
    if (this.entanglementMap.has(nodeId)) {
      const strength = this.entanglementMap.get(nodeId);
      this.entanglementMap.delete(nodeId);
      this.onDisentangle(nodeId, strength);
    }
  }
  
  /**
   * Gets entanglement strength with a specific node
   */
  getEntanglementStrength(nodeId: NodeID): EntanglementStrength {
    return this.entanglementMap.has(nodeId) ? this.entanglementMap.get(nodeId) : 0.0;
  }
  
  /**
   * Gets all entangled nodes
   */
  getEntangledNodes(): Array<NodeID> {
    const nodes = createArray<NodeID>();
    const keys = this.entanglementMap.keys();
    for (let i = 0; i < keys.length; i++) {
      nodes.push(keys[i]);
    }
    return nodes;
  }
  
  /**
   * Updates entanglement strength
   */
  updateEntanglementStrength(nodeId: NodeID, strength: EntanglementStrength): void {
    if (strength <= 0.0) {
      this.disentangleFrom(nodeId);
    } else {
      this.entanglementMap.set(nodeId, Math.min(1.0, strength));
    }
  }
  
  /**
   * Prunes weak entanglements to make room for new ones
   */
  private pruneWeakEntanglements(): void {
    const threshold = 0.1;
    const toRemove = createArray<NodeID>();
    
    const keys = this.entanglementMap.keys();
    for (let i = 0; i < keys.length; i++) {
      const strength = this.entanglementMap.get(keys[i]);
      if (strength < threshold) {
        toRemove.push(keys[i]);
      }
    }
    
    for (let i = 0; i < toRemove.length; i++) {
      this.disentangleFrom(toRemove[i]);
    }
  }
  
  /**
   * Hook called when entanglement is created
   */
  protected abstract onEntangle(nodeId: NodeID, strength: EntanglementStrength): void;
  
  /**
   * Hook called when entanglement is removed
   */
  protected abstract onDisentangle(nodeId: NodeID, strength: EntanglementStrength): void;
}

/**
 * Base class for nodes with quantum properties
 */
export abstract class QuantumNode extends EntanglableNode {
  phases: Array<Phase>;
  primes: Array<Prime>;
  quantumCoherence: f64;
  
  constructor(id: NodeID, primes: Array<Prime>) {
    super(id);
    this.primes = primes;
    this.phases = createArray<Phase>(primes.length);
    this.quantumCoherence = 1.0;
    
    // Initialize phases
    for (let i = 0; i < primes.length; i++) {
      this.phases[i] = this.calculateInitialPhase(primes[i]);
    }
  }
  
  /**
   * Updates quantum phases
   */
  updatePhases(deltaTime: f64): void {
    for (let i = 0; i < this.phases.length; i++) {
      const frequency = this.calculateFrequency(this.primes[i]);
      this.phases[i] = (this.phases[i] + frequency * deltaTime) % (2.0 * Math.PI);
    }
    this.onPhasesUpdated();
  }
  
  /**
   * Synchronizes phases with another quantum node
   */
  syncPhasesWith(other: QuantumNode, weight: f64 = 0.5): void {
    if (other.phases.length !== this.phases.length) {
      throw new NetworkException(
        NetworkError.ENTANGLEMENT_FAILED,
        "Phase arrays must have same length for synchronization"
      );
    }
    
    for (let i = 0; i < this.phases.length; i++) {
      const diff = other.phases[i] - this.phases[i];
      this.phases[i] += diff * weight;
      this.phases[i] = this.phases[i] % (2.0 * Math.PI);
    }
    
    this.onPhasesSynchronized(other.id);
  }
  
  /**
   * Calculates phase coherence with another node
   */
  calculatePhaseCoherence(other: QuantumNode): f64 {
    if (other.phases.length !== this.phases.length) return 0.0;
    
    let coherence = 0.0;
    for (let i = 0; i < this.phases.length; i++) {
      const diff = Math.abs(this.phases[i] - other.phases[i]);
      const normalized = Math.min(diff, 2.0 * Math.PI - diff) / Math.PI;
      coherence += 1.0 - normalized;
    }
    
    return coherence / this.phases.length;
  }
  
  /**
   * Updates quantum coherence based on entanglements
   */
  updateQuantumCoherence(): void {
    if (this.entanglementMap.size === 0) {
      this.quantumCoherence *= 0.99; // Decay when isolated
      return;
    }
    
    let totalStrength = 0.0;
    const strengths = this.entanglementMap.values();
    for (let i = 0; i < strengths.length; i++) {
      totalStrength += strengths[i];
    }
    
    this.quantumCoherence = totalStrength / this.entanglementMap.size;
    this.coherence = this.quantumCoherence; // Update base coherence
  }
  
  /**
   * Calculates initial phase for a prime
   */
  protected abstract calculateInitialPhase(prime: Prime): Phase;
  
  /**
   * Calculates frequency for a prime
   */
  protected abstract calculateFrequency(prime: Prime): f64;
  
  /**
   * Hook called when phases are updated
   */
  protected abstract onPhasesUpdated(): void;
  
  /**
   * Hook called when phases are synchronized
   */
  protected abstract onPhasesSynchronized(withNodeId: NodeID): void;
}

/**
 * Base class for network connections/links
 */
export abstract class NetworkLink implements Serializable {
  sourceId: NodeID;
  targetId: NodeID;
  strength: f64;
  latency: f64;
  isActive: boolean;
  createdAt: Timestamp;
  lastUsed: Timestamp;
  
  constructor(sourceId: NodeID, targetId: NodeID, strength: f64 = 1.0) {
    this.sourceId = requireNonEmpty(sourceId, "Source ID");
    this.targetId = requireNonEmpty(targetId, "Target ID");
    this.strength = requirePositive(strength, "Link strength");
    this.latency = 0.0;
    this.isActive = true;
    this.createdAt = Date.now();
    this.lastUsed = this.createdAt;
  }
  
  /**
   * Gets the link ID
   */
  getId(): string {
    return `${this.sourceId}->${this.targetId}`;
  }
  
  /**
   * Updates link strength
   */
  updateStrength(delta: f64): void {
    this.strength = Math.max(0.0, Math.min(1.0, this.strength + delta));
    if (this.strength <= 0.0) {
      this.deactivate();
    }
  }
  
  /**
   * Updates link latency
   */
  updateLatency(latency: f64): void {
    this.latency = Math.max(0.0, latency);
  }
  
  /**
   * Marks the link as used
   */
  markUsed(): void {
    this.lastUsed = Date.now();
  }
  
  /**
   * Gets the age of the link
   */
  getAge(): f64 {
    return Date.now() - this.createdAt;
  }
  
  /**
   * Gets time since last use
   */
  getTimeSinceUse(): f64 {
    return Date.now() - this.lastUsed;
  }
  
  /**
   * Activates the link
   */
  activate(): void {
    this.isActive = true;
    this.onActivate();
  }
  
  /**
   * Deactivates the link
   */
  deactivate(): void {
    this.isActive = false;
    this.onDeactivate();
  }
  
  /**
   * Hook called when link is activated
   */
  protected abstract onActivate(): void;
  
  /**
   * Hook called when link is deactivated
   */
  protected abstract onDeactivate(): void;
  
  toJSON(): string {
    const builder = new JSONBuilder();
    return builder
      .startObject()
      .addStringField("id", this.getId())
      .addStringField("sourceId", this.sourceId)
      .addStringField("targetId", this.targetId)
      .addNumberField("strength", this.strength)
      .addNumberField("latency", this.latency)
      .addBooleanField("isActive", this.isActive)
      .addNumberField("createdAt", this.createdAt)
      .addNumberField("lastUsed", this.lastUsed)
      .endObject()
      .build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

/**
 * Base class for network topology managers
 */
export abstract class NetworkTopology {
  nodes: Map<NodeID, BaseNetworkNode>;
  links: Map<string, NetworkLink>;
  maxNodes: i32;
  maxLinks: i32;
  
  constructor(maxNodes: i32 = 1000, maxLinks: i32 = 10000) {
    this.nodes = new Map<NodeID, BaseNetworkNode>();
    this.links = new Map<string, NetworkLink>();
    this.maxNodes = requirePositive(maxNodes, "Max nodes");
    this.maxLinks = requirePositive(maxLinks, "Max links");
  }
  
  /**
   * Adds a node to the topology
   */
  addNode(node: BaseNetworkNode): void {
    if (this.nodes.size >= this.maxNodes) {
      throw new NetworkException(
        NetworkError.NODE_ALREADY_EXISTS,
        `Maximum node limit (${this.maxNodes}) reached`
      );
    }
    
    this.nodes.set(node.id, node);
    this.onNodeAdded(node);
  }
  
  /**
   * Removes a node from the topology
   */
  removeNode(nodeId: NodeID): void {
    if (this.nodes.has(nodeId)) {
      const node = this.nodes.get(nodeId);
      
      // Remove all links involving this node
      const linksToRemove = createArray<string>();
      const linkKeys = this.links.keys();
      for (let i = 0; i < linkKeys.length; i++) {
        const link = this.links.get(linkKeys[i]);
        if (link.sourceId === nodeId || link.targetId === nodeId) {
          linksToRemove.push(linkKeys[i]);
        }
      }
      
      for (let i = 0; i < linksToRemove.length; i++) {
        this.removeLink(linksToRemove[i]);
      }
      
      this.nodes.delete(nodeId);
      this.onNodeRemoved(node);
    }
  }
  
  /**
   * Adds a link to the topology
   */
  addLink(link: NetworkLink): void {
    if (this.links.size >= this.maxLinks) {
      throw new NetworkException(
        NetworkError.ENTANGLEMENT_FAILED,
        `Maximum link limit (${this.maxLinks}) reached`
      );
    }
    
    const linkId = link.getId();
    this.links.set(linkId, link);
    this.onLinkAdded(link);
  }
  
  /**
   * Removes a link from the topology
   */
  removeLink(linkId: string): void {
    if (this.links.has(linkId)) {
      const link = this.links.get(linkId);
      this.links.delete(linkId);
      this.onLinkRemoved(link);
    }
  }
  
  /**
   * Gets all neighbors of a node
   */
  getNeighbors(nodeId: NodeID): Array<NodeID> {
    const neighbors = createArray<NodeID>();
    const linkValues = this.links.values();
    
    for (let i = 0; i < linkValues.length; i++) {
      const link = linkValues[i];
      if (link.isActive) {
        if (link.sourceId === nodeId) {
          neighbors.push(link.targetId);
        } else if (link.targetId === nodeId) {
          neighbors.push(link.sourceId);
        }
      }
    }
    
    return neighbors;
  }
  
  /**
   * Gets the shortest path between two nodes
   */
  abstract findShortestPath(sourceId: NodeID, targetId: NodeID): Array<NodeID> | null;
  
  /**
   * Hook called when a node is added
   */
  protected abstract onNodeAdded(node: BaseNetworkNode): void;
  
  /**
   * Hook called when a node is removed
   */
  protected abstract onNodeRemoved(node: BaseNetworkNode): void;
  
  /**
   * Hook called when a link is added
   */
  protected abstract onLinkAdded(link: NetworkLink): void;
  
  /**
   * Hook called when a link is removed
   */
  protected abstract onLinkRemoved(link: NetworkLink): void;
}

/**
 * Base class for network metrics collectors
 */
export abstract class NetworkMetrics {
  nodeCount: i32 = 0;
  linkCount: i32 = 0;
  averageCoherence: f64 = 0.0;
  averageLatency: f64 = 0.0;
  networkUtilization: f64 = 0.0;
  lastUpdateTime: Timestamp = 0.0;
  
  /**
   * Updates metrics from topology
   */
  updateFromTopology(topology: NetworkTopology): void {
    this.nodeCount = topology.nodes.size;
    this.linkCount = topology.links.size;
    
    // Calculate average coherence
    let totalCoherence = 0.0;
    const nodeValues = topology.nodes.values();
    for (let i = 0; i < nodeValues.length; i++) {
      totalCoherence += nodeValues[i].coherence;
    }
    this.averageCoherence = this.nodeCount > 0 ? totalCoherence / this.nodeCount : 0.0;
    
    // Calculate average latency
    let totalLatency = 0.0;
    let activeLinks = 0;
    const linkValues = topology.links.values();
    for (let i = 0; i < linkValues.length; i++) {
      if (linkValues[i].isActive) {
        totalLatency += linkValues[i].latency;
        activeLinks++;
      }
    }
    this.averageLatency = activeLinks > 0 ? totalLatency / activeLinks : 0.0;
    
    // Calculate network utilization
    const maxPossibleLinks = (this.nodeCount * (this.nodeCount - 1)) / 2;
    this.networkUtilization = maxPossibleLinks > 0 ? f64(this.linkCount) / f64(maxPossibleLinks) : 0.0;
    
    this.lastUpdateTime = Date.now();
    this.onMetricsUpdated();
  }
  
  /**
   * Hook called when metrics are updated
   */
  protected abstract onMetricsUpdated(): void;
}