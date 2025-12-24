
/**
 * Global Memory Field (GMF)
 * 
 * Network-maintained memory field composed of accepted memory objects
 * with stability weights. From whitepaper Section 6.2:
 * 
 * M_G = Σ w_m Ω_m
 * 
 * where Ω_m is an accepted memory object and w_m is its stability weight
 * (coherence, redundancy, and longevity).
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';

// Simple ID generator (AssemblyScript doesn't have crypto.randomUUID)
let _gmfIdCounter: i64 = 0;

function generateId(prefix: string = "gmf"): string {
  _gmfIdCounter++;
  const timestamp = Date.now() as i64;
  return `${prefix}_${timestamp}_${_gmfIdCounter}`;
}
import { SedenionMemoryField, createSMF } from './smf';

// ============================================================================
// Memory Object
// ============================================================================

/**
 * Memory object that can be stored in GMF
 * Represents a stabilized semantic condensation
 */
export class MemoryObject implements Serializable {
  id: string;
  timestamp: i64;
  
  // Semantic content
  primes: i32[];
  amplitudes: Float64Array;
  phases: Float64Array;
  smfOrientation: Float64Array;
  
  // Metadata
  sourceNodeId: string;
  momentId: string;
  coherenceAtEmission: f64;
  entropyAtEmission: f64;
  
  // Proof data
  proofs: LocalProof | null;
  
  constructor(
    primes: i32[],
    amplitudes: Float64Array,
    phases: Float64Array,
    smfOrientation: Float64Array,
    sourceNodeId: string,
    momentId: string,
    coherence: f64,
    entropy: f64
  ) {
    this.id = generateId("mem");
    this.timestamp = Date.now() as i64;
    this.primes = primes;
    this.amplitudes = amplitudes;
    this.phases = phases;
    this.smfOrientation = smfOrientation;
    this.sourceNodeId = sourceNodeId;
    this.momentId = momentId;
    this.coherenceAtEmission = coherence;
    this.entropyAtEmission = entropy;
    this.proofs = null;
  }
  
  /**
   * Compute hash of object content for comparison
   */
  contentHash(): string {
    // Simple hash based on prime amplitudes
    let hash: f64 = 0;
    for (let i = 0; i < this.primes.length; i++) {
      hash += f64(this.primes[i]) * this.amplitudes[i];
    }
    return `${i64(hash * 1e9)}`;
  }
  
  /**
   * Compute similarity to another memory object
   */
  similarity(other: MemoryObject): f64 {
    // Cosine similarity of amplitude vectors
    let dot: f64 = 0;
    let normA: f64 = 0;
    let normB: f64 = 0;
    
    const minLen = Math.min(this.amplitudes.length, other.amplitudes.length) as i32;
    
    for (let i = 0; i < minLen; i++) {
      dot += this.amplitudes[i] * other.amplitudes[i];
      normA += this.amplitudes[i] * this.amplitudes[i];
      normB += other.amplitudes[i] * other.amplitudes[i];
    }
    
    if (normA < 1e-10 || normB < 1e-10) return 0;
    
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  /**
   * Compute SMF proximity to another object
   */
  smfProximity(other: MemoryObject): f64 {
    let dot: f64 = 0;
    for (let i = 0; i < 16; i++) {
      dot += this.smfOrientation[i] * other.smfOrientation[i];
    }
    return dot;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("timestamp", f64(this.timestamp))
      .addStringField("sourceNodeId", this.sourceNodeId)
      .addStringField("momentId", this.momentId)
      .addNumberField("coherence", this.coherenceAtEmission)
      .addNumberField("entropy", this.entropyAtEmission)
      .addNumberField("primeCount", f64(this.primes.length))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `MemoryObject(${this.id.substring(0, 8)}, primes=${this.primes.length})`;
  }
}

// ============================================================================
// Local Proof (for Coherent-Commit)
// ============================================================================

/**
 * Local evidence proofs attached to a memory object
 */
export class LocalProof implements Serializable {
  coherence: f64;
  entropy: f64;
  entropyRate: f64;  // |dS/dt|
  smfEntropy: f64;
  identityAxisValue: f64;  // s[1] - Identity axis
  reconstructionFidelity: f64;
  timestamp: i64;
  
  constructor() {
    this.coherence = 0;
    this.entropy = 0;
    this.entropyRate = 0;
    this.smfEntropy = 0;
    this.identityAxisValue = 0;
    this.reconstructionFidelity = 1.0;
    this.timestamp = Date.now() as i64;
  }
  
  /**
   * Check if local evidence passes criteria
   */
  passes(
    coherenceThreshold: f64 = 0.7,
    entropyRateThreshold: f64 = 0.1,
    smfEntropyMin: f64 = 1.0,
    smfEntropyMax: f64 = 3.5,
    identityMin: f64 = 0.1,
    reconstructionThreshold: f64 = 0.9
  ): bool {
    // C(t) >= C_th
    if (this.coherence < coherenceThreshold) return false;
    
    // |dS/dt| <= ε_S
    if (this.entropyRate > entropyRateThreshold) return false;
    
    // SMF entropy within operating band
    if (this.smfEntropy < smfEntropyMin || this.smfEntropy > smfEntropyMax) return false;
    
    // Identity axis not collapsing
    if (this.identityAxisValue < identityMin) return false;
    
    // Reconstruction fidelity
    if (this.reconstructionFidelity < reconstructionThreshold) return false;
    
    return true;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("coherence", this.coherence)
      .addNumberField("entropy", this.entropy)
      .addNumberField("entropyRate", this.entropyRate)
      .addNumberField("smfEntropy", this.smfEntropy)
      .addNumberField("identityAxisValue", this.identityAxisValue)
      .addNumberField("reconstructionFidelity", this.reconstructionFidelity)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `LocalProof(C=${toFixed(this.coherence, 3)})`;
  }
}

// ============================================================================
// Stability Weight
// ============================================================================

/**
 * Stability weight for a memory object in GMF
 * w_m = f(coherence, redundancy, longevity)
 */
export class StabilityWeight implements Serializable {
  coherenceScore: f64;
  redundancyScore: f64;
  longevityScore: f64;
  securityScore: f64;  // Q(Ω) from topology/holonomy checks
  
  constructor() {
    this.coherenceScore = 0;
    this.redundancyScore = 0;
    this.longevityScore = 0;
    this.securityScore = 1.0;
  }
  
  /**
   * Compute composite weight
   */
  weight(): f64 {
    // Weighted combination
    return (
      0.35 * this.coherenceScore +
      0.35 * this.redundancyScore +
      0.15 * this.longevityScore +
      0.15 * this.securityScore
    );
  }
  
  /**
   * Update longevity based on age
   */
  updateLongevity(ageMs: i64, halfLifeMs: i64 = 3600000): void {
    // Exponential decay toward stable value
    const decay = Math.exp(-f64(ageMs) / f64(halfLifeMs));
    this.longevityScore = 1.0 - decay * 0.5;  // Approaches 1.0 over time
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("coherenceScore", this.coherenceScore)
      .addNumberField("redundancyScore", this.redundancyScore)
      .addNumberField("longevityScore", this.longevityScore)
      .addNumberField("securityScore", this.securityScore)
      .addNumberField("weight", this.weight())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `StabilityWeight(${toFixed(this.weight(), 3)})`;
  }
}

// ============================================================================
// GMF Entry
// ============================================================================

/**
 * Entry in the Global Memory Field
 */
export class GMFEntry implements Serializable {
  object: MemoryObject;
  weight: StabilityWeight;
  commitTime: i64;
  version: i32;
  
  constructor(object: MemoryObject) {
    this.object = object;
    this.weight = new StabilityWeight();
    this.commitTime = Date.now() as i64;
    this.version = 1;
  }
  
  /**
   * Update the entry with new weight information
   */
  updateWeight(
    coherence: f64,
    redundancy: f64,
    security: f64 = 1.0
  ): void {
    this.weight.coherenceScore = coherence;
    this.weight.redundancyScore = redundancy;
    this.weight.securityScore = security;
    
    const age = (Date.now() as i64) - this.commitTime;
    this.weight.updateLongevity(age);
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("objectId", this.object.id)
      .addNumberField("weight", this.weight.weight())
      .addNumberField("commitTime", f64(this.commitTime))
      .addNumberField("version", f64(this.version))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `GMFEntry(${this.object.id.substring(0, 8)}, w=${toFixed(this.weight.weight(), 3)})`;
  }
}

// ============================================================================
// Delta (GMF Update)
// ============================================================================

/**
 * Delta representing an update to the GMF
 */
export class GMFDelta implements Serializable {
  id: string;
  timestamp: i64;
  type: string;  // "add", "update", "remove", "merge"
  objectId: string;
  object: MemoryObject | null;
  previousVersion: i32;
  newVersion: i32;
  
  constructor(type: string, objectId: string) {
    this.id = generateId("delta");
    this.timestamp = Date.now() as i64;
    this.type = type;
    this.objectId = objectId;
    this.object = null;
    this.previousVersion = 0;
    this.newVersion = 0;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("timestamp", f64(this.timestamp))
      .addStringField("type", this.type)
      .addStringField("objectId", this.objectId)
      .addNumberField("previousVersion", f64(this.previousVersion))
      .addNumberField("newVersion", f64(this.newVersion))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Delta(${this.type}, ${this.objectId.substring(0, 8)})`;
  }
}

// ============================================================================
// Snapshot
// ============================================================================

/**
 * GMF Snapshot - point-in-time capture of the field
 */
export class GMFSnapshot implements Serializable {
  id: string;
  timestamp: i64;
  entryCount: i32;
  totalWeight: f64;
  checksum: string;
  
  // Compressed representation of entries
  entryIds: string[];
  entryWeights: Float64Array;
  
  constructor() {
    this.id = generateId("gmf");
    this.timestamp = Date.now() as i64;
    this.entryCount = 0;
    this.totalWeight = 0;
    this.checksum = "";
    this.entryIds = [];
    this.entryWeights = new Float64Array(0);
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("timestamp", f64(this.timestamp))
      .addNumberField("entryCount", f64(this.entryCount))
      .addNumberField("totalWeight", this.totalWeight)
      .addStringField("checksum", this.checksum)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Snapshot(${this.id.substring(0, 8)}, entries=${this.entryCount})`;
  }
}

// ============================================================================
// Global Memory Field
// ============================================================================

/**
 * Global Memory Field
 * 
 * Network-maintained field M_G = Σ w_m Ω_m
 * 
 * Features:
 * - Weighted storage of memory objects
 * - Delta-based updates for synchronization
 * - Snapshot support for efficient state transfer
 * - Semantic clustering for coherence-preserving merge
 */
export class GlobalMemoryField implements Serializable {
  id: string;
  
  // Storage
  entries: Map<string, GMFEntry>;
  
  // Delta stream
  deltas: GMFDelta[];
  maxDeltas: i32;
  
  // Snapshots
  snapshots: GMFSnapshot[];
  maxSnapshots: i32;
  currentSnapshotId: string;
  
  // Statistics
  totalWeight: f64;
  totalEntries: i32;
  
  // Configuration
  weightDecayRate: f64;
  minWeight: f64;
  
  constructor() {
    this.id = generateId("gmf");
    this.entries = new Map<string, GMFEntry>();
    this.deltas = [];
    this.maxDeltas = 1000;
    this.snapshots = [];
    this.maxSnapshots = 10;
    this.currentSnapshotId = "";
    this.totalWeight = 0;
    this.totalEntries = 0;
    this.weightDecayRate = 0.001;
    this.minWeight = 0.01;
  }
  
  /**
   * Add a memory object to the field
   */
  addObject(object: MemoryObject, coherence: f64, redundancy: f64): GMFDelta {
    const entry = new GMFEntry(object);
    entry.updateWeight(coherence, redundancy);
    
    this.entries.set(object.id, entry);
    this.totalEntries++;
    this.totalWeight += entry.weight.weight();
    
    // Create delta
    const delta = new GMFDelta("add", object.id);
    delta.object = object;
    delta.newVersion = 1;
    this.addDelta(delta);
    
    return delta;
  }
  
  /**
   * Update an existing object's weight
   */
  updateWeight(objectId: string, coherence: f64, redundancy: f64): GMFDelta | null {
    if (!this.entries.has(objectId)) return null;
    
    const entry = this.entries.get(objectId);
    const oldWeight = entry.weight.weight();
    
    entry.updateWeight(coherence, redundancy);
    entry.version++;
    
    this.totalWeight += entry.weight.weight() - oldWeight;
    
    // Create delta
    const delta = new GMFDelta("update", objectId);
    delta.previousVersion = entry.version - 1;
    delta.newVersion = entry.version;
    this.addDelta(delta);
    
    return delta;
  }
  
  /**
   * Remove an object from the field
   */
  removeObject(objectId: string): GMFDelta | null {
    if (!this.entries.has(objectId)) return null;
    
    const entry = this.entries.get(objectId);
    this.totalWeight -= entry.weight.weight();
    this.totalEntries--;
    
    this.entries.delete(objectId);
    
    // Create delta
    const delta = new GMFDelta("remove", objectId);
    delta.previousVersion = entry.version;
    this.addDelta(delta);
    
    return delta;
  }
  
  /**
   * Get an object by ID
   */
  getObject(objectId: string): MemoryObject | null {
    if (!this.entries.has(objectId)) return null;
    return this.entries.get(objectId).object;
  }
  
  /**
   * Get entry by ID
   */
  getEntry(objectId: string): GMFEntry | null {
    if (!this.entries.has(objectId)) return null;
    return this.entries.get(objectId);
  }
  
  /**
   * Add a delta to the stream
   */
  addDelta(delta: GMFDelta): void {
    this.deltas.push(delta);
    
    // Prune old deltas if needed
    if (this.deltas.length > this.maxDeltas) {
      // Keep the newest half
      const keepCount = this.maxDeltas / 2;
      this.deltas = this.deltas.slice(this.deltas.length - keepCount);
    }
  }
  
  /**
   * Get deltas since a given delta ID
   */
  getDeltasSince(deltaId: string): GMFDelta[] {
    let foundStart = false;
    const result: GMFDelta[] = [];
    
    for (let i = 0; i < this.deltas.length; i++) {
      if (foundStart) {
        result.push(this.deltas[i]);
      } else if (this.deltas[i].id == deltaId) {
        foundStart = true;
      }
    }
    
    // If deltaId not found, return all deltas
    if (!foundStart && deltaId != "") {
      return this.deltas;
    }
    
    return result;
  }
  
  /**
   * Create a snapshot of current state
   */
  createSnapshot(): GMFSnapshot {
    const snapshot = new GMFSnapshot();
    snapshot.entryCount = this.totalEntries;
    snapshot.totalWeight = this.totalWeight;
    
    // Collect entry data
    const ids: string[] = [];
    const weights: f64[] = [];
    
    const keys = this.entries.keys();
    for (let i = 0; i < keys.length; i++) {
      const entry = this.entries.get(keys[i]);
      ids.push(keys[i]);
      weights.push(entry.weight.weight());
    }
    
    snapshot.entryIds = ids;
    snapshot.entryWeights = new Float64Array(weights.length);
    for (let i = 0; i < weights.length; i++) {
      snapshot.entryWeights[i] = weights[i];
    }
    
    // Compute checksum
    let checksum: f64 = 0;
    for (let i = 0; i < weights.length; i++) {
      checksum += weights[i] * f64(i + 1);
    }
    snapshot.checksum = `${i64(checksum * 1e9)}`;
    
    // Store snapshot
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
    
    this.currentSnapshotId = snapshot.id;
    
    return snapshot;
  }
  
  /**
   * Query entries by similarity to a target
   */
  querySimilar(target: MemoryObject, threshold: f64 = 0.7, maxResults: i32 = 10): GMFEntry[] {
    // Collect all matching entries with their similarities
    const matchingEntries: GMFEntry[] = [];
    const matchingSimilarities: f64[] = [];
    
    const keys = this.entries.keys();
    for (let i = 0; i < keys.length; i++) {
      const entry = this.entries.get(keys[i]);
      const sim = target.similarity(entry.object);
      
      if (sim >= threshold) {
        matchingEntries.push(entry);
        matchingSimilarities.push(sim);
      }
    }
    
    // Sort by similarity (simple selection sort)
    for (let i = 0; i < matchingEntries.length - 1; i++) {
      let maxIdx = i;
      for (let j = i + 1; j < matchingEntries.length; j++) {
        if (matchingSimilarities[j] > matchingSimilarities[maxIdx]) {
          maxIdx = j;
        }
      }
      if (maxIdx != i) {
        // Swap entries
        const tempEntry = matchingEntries[i];
        matchingEntries[i] = matchingEntries[maxIdx];
        matchingEntries[maxIdx] = tempEntry;
        
        // Swap similarities
        const tempSim = matchingSimilarities[i];
        matchingSimilarities[i] = matchingSimilarities[maxIdx];
        matchingSimilarities[maxIdx] = tempSim;
      }
    }
    
    // Return top results
    const resultCount = Math.min(matchingEntries.length, maxResults) as i32;
    const results: GMFEntry[] = [];
    for (let i = 0; i < resultCount; i++) {
      results.push(matchingEntries[i]);
    }
    
    return results;
  }
  
  /**
   * Find semantic clusters for conflict resolution
   */
  findClusters(objects: MemoryObject[], threshold: f64 = 0.8): MemoryCluster[] {
    const clusters: MemoryCluster[] = [];
    const assigned = new Set<string>();
    
    for (let i = 0; i < objects.length; i++) {
      if (assigned.has(objects[i].id)) continue;
      
      // Start new cluster
      const cluster = new MemoryCluster();
      cluster.members.push(objects[i]);
      assigned.add(objects[i].id);
      
      // Find similar objects
      for (let j = i + 1; j < objects.length; j++) {
        if (assigned.has(objects[j].id)) continue;
        
        const sim = objects[i].similarity(objects[j]);
        const smfProx = objects[i].smfProximity(objects[j]);
        
        if (sim >= threshold && smfProx >= threshold * 0.8) {
          cluster.members.push(objects[j]);
          assigned.add(objects[j].id);
        }
      }
      
      clusters.push(cluster);
    }
    
    // Select basis for each cluster
    for (let i = 0; i < clusters.length; i++) {
      clusters[i].selectBasis();
    }
    
    return clusters;
  }
  
  /**
   * Apply weight decay to all entries
   */
  decayWeights(): void {
    const toRemove: string[] = [];
    
    const keys = this.entries.keys();
    for (let i = 0; i < keys.length; i++) {
      const entry = this.entries.get(keys[i]);
      
      // Update longevity
      const age = (Date.now() as i64) - entry.commitTime;
      entry.weight.updateLongevity(age);
      
      // Check minimum weight
      if (entry.weight.weight() < this.minWeight) {
        toRemove.push(keys[i]);
      }
    }
    
    // Remove entries below threshold
    for (let i = 0; i < toRemove.length; i++) {
      this.removeObject(toRemove[i]);
    }
  }
  
  /**
   * Get weighted field value for a prime index
   */
  getFieldValue(primeIndex: i32): f64 {
    let value: f64 = 0;
    let totalWeight: f64 = 0;
    
    const keys = this.entries.keys();
    for (let i = 0; i < keys.length; i++) {
      const entry = this.entries.get(keys[i]);
      const weight = entry.weight.weight();
      
      if (primeIndex < entry.object.amplitudes.length) {
        value += weight * entry.object.amplitudes[primeIndex];
        totalWeight += weight;
      }
    }
    
    return totalWeight > 0 ? value / totalWeight : 0;
  }
  
  /**
   * Get field entropy
   */
  fieldEntropy(): f64 {
    if (this.totalWeight < 1e-10) return 0;
    
    let entropy: f64 = 0;
    
    const keys = this.entries.keys();
    for (let i = 0; i < keys.length; i++) {
      const entry = this.entries.get(keys[i]);
      const p = entry.weight.weight() / this.totalWeight;
      if (p > 1e-10) {
        entropy -= p * Math.log(p);
      }
    }
    
    return entropy;
  }
  
  /**
   * Get statistics
   */
  getStats(): GMFStats {
    return new GMFStats(
      this.totalEntries,
      this.totalWeight,
      this.fieldEntropy(),
      this.deltas.length,
      this.snapshots.length
    );
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("totalEntries", f64(this.totalEntries))
      .addNumberField("totalWeight", this.totalWeight)
      .addNumberField("fieldEntropy", this.fieldEntropy())
      .addNumberField("deltaCount", f64(this.deltas.length))
      .addStringField("currentSnapshotId", this.currentSnapshotId)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `GMF(entries=${this.totalEntries}, weight=${toFixed(this.totalWeight, 3)})`;
  }
}

// ============================================================================
// Memory Cluster
// ============================================================================

/**
 * Cluster of semantically related memory objects
 * Used for coherence-preserving merge (Section 6.6)
 */
export class MemoryCluster implements Serializable {
  members: MemoryObject[];
  basis: MemoryObject | null;
  satellites: MemoryObject[];
  
  constructor() {
    this.members = [];
    this.basis = null;
    this.satellites = [];
  }
  
  /**
   * Select the basis element (highest coherence + longevity)
   */
  selectBasis(): void {
    if (this.members.length == 0) return;
    
    let bestIndex = 0;
    let bestScore: f64 = -1;
    
    for (let i = 0; i < this.members.length; i++) {
      const obj = this.members[i];
      const score = obj.coherenceAtEmission;
      
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    
    this.basis = this.members[bestIndex];
    this.satellites = [];
    
    for (let i = 0; i < this.members.length; i++) {
      if (i != bestIndex) {
        this.satellites.push(this.members[i]);
      }
    }
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("memberCount", f64(this.members.length))
      .addBooleanField("hasBasis", this.basis !== null)
      .addNumberField("satelliteCount", f64(this.satellites.length))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Cluster(members=${this.members.length})`;
  }
}

// ============================================================================
// GMF Statistics
// ============================================================================

/**
 * GMF statistics summary
 */
export class GMFStats implements Serializable {
  entryCount: i32;
  totalWeight: f64;
  fieldEntropy: f64;
  deltaCount: i32;
  snapshotCount: i32;
  
  constructor(
    entryCount: i32,
    totalWeight: f64,
    fieldEntropy: f64,
    deltaCount: i32,
    snapshotCount: i32
  ) {
    this.entryCount = entryCount;
    this.totalWeight = totalWeight;
    this.fieldEntropy = fieldEntropy;
    this.deltaCount = deltaCount;
    this.snapshotCount = snapshotCount;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("entryCount", f64(this.entryCount))
      .addNumberField("totalWeight", this.totalWeight)
      .addNumberField("fieldEntropy", this.fieldEntropy)
      .addNumberField("deltaCount", f64(this.deltaCount))
      .addNumberField("snapshotCount", f64(this.snapshotCount))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `GMFStats(entries=${this.entryCount}, weight=${toFixed(this.totalWeight, 3)})`;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a new Global Memory Field
 */
export function createGMF(): GlobalMemoryField {
  return new GlobalMemoryField();
}

/**
 * Create a memory object from current node state
 */
export function createMemoryObject(
  primes: i32[],
  amplitudes: Float64Array,
  phases: Float64Array,
  smfOrientation: Float64Array,
  sourceNodeId: string,
  momentId: string,
  coherence: f64,
  entropy: f64
): MemoryObject {
  return new MemoryObject(
    primes,
    amplitudes,
    phases,
    smfOrientation,
    sourceNodeId,
    momentId,
    coherence,
    entropy
  );
}

/**
 * Create a local proof for a memory object
 */
export function createLocalProof(
  coherence: f64,
  entropy: f64,
  entropyRate: f64,
  smfEntropy: f64,
  identityAxisValue: f64,
  reconstructionFidelity: f64
): LocalProof {
  const proof = new LocalProof();
  proof.coherence = coherence;
  proof.entropy = entropy;
  proof.entropyRate = entropyRate;
  proof.smfEntropy = smfEntropy;
  proof.identityAxisValue = identityAxisValue;
  proof.reconstructionFidelity = reconstructionFidelity;
  return proof;
}