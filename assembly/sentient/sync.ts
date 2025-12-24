/**
 * Network Synchronizer
 * 
 * Offline-first synchronization with eventual coherence.
 * From whitepaper Section 6.5:
 * 
 * State = (GMF_snapshot_id, ΔGMF, PL)
 * 
 * On Join:
 * 1. Obtain latest GMF snapshot header and delta index
 * 2. Prime-resonant handshake to align channel frame
 * 3. Pull deltas; apply in order; update GMF_snapshot_id
 * 4. Rebase local LF against GMF (soft merge via resonance blending)
 * 
 * Offline Operation:
 * - LF continues producing moments and local inserts into M_L
 * - Proposals append into PL with local proofs
 * - Background "reconnect" routine attempts resync
 * 
 * On Reconnect:
 * 1. Pull missed GMF deltas
 * 2. Replay local PL proposals into the network
 * 3. Run coherent-commit evaluation; accept/reject
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { 
  MemoryObject, 
  LocalProof, 
  GlobalMemoryField, 
  GMFDelta, 
  GMFSnapshot 
} from './gmf';
import { PRRCChannel, PhaseReference } from './prrc';
import { DCCProtocol, DCCProposal } from './dcc';

// ============================================================================
// ID Generator
// ============================================================================

let _syncIdCounter: i64 = 0;

function generateId(prefix: string = "sync"): string {
  _syncIdCounter++;
  const timestamp = Date.now() as i64;
  return `${prefix}_${timestamp}_${_syncIdCounter}`;
}

// ============================================================================
// Sync Configuration
// ============================================================================

/**
 * Network synchronizer configuration
 */
export class SyncConfig {
  // Connection settings
  reconnectIntervalMs: i64 = 5000;      // 5 seconds
  maxReconnectAttempts: i32 = 10;
  
  // Sync settings
  deltaFetchBatchSize: i32 = 100;
  maxPendingProposals: i32 = 1000;
  
  // Merge settings
  resonanceBlendAlpha: f64 = 0.3;       // Soft merge weight for remote
  conflictResolutionMode: string = "coherence";  // "coherence", "timestamp", "local"
  
  // Offline settings
  offlineProposalLogSize: i32 = 10000;
  autoReconnect: bool = true;
  
  constructor() {}
}

// ============================================================================
// Proposal Log Entry
// ============================================================================

/**
 * Proposal log entry for offline operation
 * π_k = (Ω_k, meta, proofs, t_k)
 */
export class ProposalLogEntry implements Serializable {
  id: string;
  timestamp: i64;
  
  // Object and proofs
  object: MemoryObject;
  proof: LocalProof;
  
  // Metadata
  tickNumber: i64;
  coherenceAtProposal: f64;
  
  // Status
  status: string;  // "pending", "submitted", "accepted", "rejected"
  submissionAttempts: i32;
  lastSubmissionTime: i64;
  
  constructor(object: MemoryObject, proof: LocalProof, tickNumber: i64) {
    this.id = generateId("pl");
    this.timestamp = Date.now() as i64;
    this.object = object;
    this.proof = proof;
    this.tickNumber = tickNumber;
    this.coherenceAtProposal = proof.coherence;
    this.status = "pending";
    this.submissionAttempts = 0;
    this.lastSubmissionTime = 0;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("timestamp", f64(this.timestamp))
      .addStringField("objectId", this.object.id)
      .addStringField("status", this.status)
      .addNumberField("submissionAttempts", f64(this.submissionAttempts))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `PLEntry(${this.id.substring(0, 8)}, ${this.status})`;
  }
}

// ============================================================================
// Sync State
// ============================================================================

/**
 * Current synchronization state
 * State = (GMF_snapshot_id, ΔGMF, PL)
 */
export class SyncState implements Serializable {
  // GMF state
  gmfSnapshotId: string;
  lastDeltaId: string;
  gmfVersion: i32;
  
  // Connection state
  connectionStatus: string;  // "disconnected", "connecting", "connected", "syncing"
  lastConnectedTime: i64;
  lastSyncTime: i64;
  
  // Delta stream
  pendingDeltas: GMFDelta[];
  appliedDeltaCount: i32;
  
  // Proposal log
  proposalLog: ProposalLogEntry[];
  
  constructor() {
    this.gmfSnapshotId = "";
    this.lastDeltaId = "";
    this.gmfVersion = 0;
    this.connectionStatus = "disconnected";
    this.lastConnectedTime = 0;
    this.lastSyncTime = 0;
    this.pendingDeltas = [];
    this.appliedDeltaCount = 0;
    this.proposalLog = [];
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("gmfSnapshotId", this.gmfSnapshotId)
      .addStringField("lastDeltaId", this.lastDeltaId)
      .addNumberField("gmfVersion", f64(this.gmfVersion))
      .addStringField("connectionStatus", this.connectionStatus)
      .addNumberField("pendingDeltaCount", f64(this.pendingDeltas.length))
      .addNumberField("proposalLogSize", f64(this.proposalLog.length))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `SyncState(${this.connectionStatus}, deltas=${this.pendingDeltas.length})`;
  }
}

// ============================================================================
// Sync Result
// ============================================================================

/**
 * Result of a synchronization operation
 */
export class SyncResult implements Serializable {
  success: bool;
  timestamp: i64;
  
  // What was synced
  deltasApplied: i32;
  proposalsSubmitted: i32;
  proposalsAccepted: i32;
  proposalsRejected: i32;
  
  // Conflicts resolved
  conflictsDetected: i32;
  conflictsResolved: i32;
  
  // Errors
  errorMessage: string;
  
  constructor() {
    this.success = false;
    this.timestamp = Date.now() as i64;
    this.deltasApplied = 0;
    this.proposalsSubmitted = 0;
    this.proposalsAccepted = 0;
    this.proposalsRejected = 0;
    this.conflictsDetected = 0;
    this.conflictsResolved = 0;
    this.errorMessage = "";
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addBooleanField("success", this.success)
      .addNumberField("deltasApplied", f64(this.deltasApplied))
      .addNumberField("proposalsSubmitted", f64(this.proposalsSubmitted))
      .addNumberField("proposalsAccepted", f64(this.proposalsAccepted))
      .addNumberField("proposalsRejected", f64(this.proposalsRejected))
      .addNumberField("conflictsDetected", f64(this.conflictsDetected))
      .addStringField("errorMessage", this.errorMessage)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `SyncResult(${this.success ? "ok" : "fail"}, deltas=${this.deltasApplied})`;
  }
}

// ============================================================================
// Network Synchronizer
// ============================================================================

/**
 * Network Synchronizer
 * Handles offline-first synchronization with eventual coherence
 */
export class NetworkSynchronizer implements Serializable {
  id: string;
  nodeId: string;
  config: SyncConfig;
  
  // State
  state: SyncState;
  
  // Local and global memory fields
  localField: GlobalMemoryField | null;
  globalField: GlobalMemoryField | null;
  
  // Communication
  channel: PRRCChannel | null;
  phaseReference: PhaseReference | null;
  
  // Protocol
  dccProtocol: DCCProtocol | null;
  
  // Reconnection
  reconnectAttempts: i32;
  nextReconnectTime: i64;
  
  // Statistics
  totalSyncs: i32;
  successfulSyncs: i32;
  failedSyncs: i32;
  
  constructor(nodeId: string, config: SyncConfig = new SyncConfig()) {
    this.id = generateId("sync");
    this.nodeId = nodeId;
    this.config = config;
    this.state = new SyncState();
    this.localField = null;
    this.globalField = null;
    this.channel = null;
    this.phaseReference = null;
    this.dccProtocol = null;
    this.reconnectAttempts = 0;
    this.nextReconnectTime = 0;
    this.totalSyncs = 0;
    this.successfulSyncs = 0;
    this.failedSyncs = 0;
  }
  
  /**
   * Set the local memory field
   */
  setLocalField(field: GlobalMemoryField): void {
    this.localField = field;
  }
  
  /**
   * Set the global memory field reference
   */
  setGlobalField(field: GlobalMemoryField): void {
    this.globalField = field;
  }
  
  /**
   * Set the communication channel
   */
  setChannel(channel: PRRCChannel): void {
    this.channel = channel;
  }
  
  /**
   * Set the DCC protocol
   */
  setDCCProtocol(protocol: DCCProtocol): void {
    this.dccProtocol = protocol;
  }
  
  /**
   * Add a proposal to the log (for offline operation)
   */
  addProposal(object: MemoryObject, proof: LocalProof, tickNumber: i64): ProposalLogEntry {
    const entry = new ProposalLogEntry(object, proof, tickNumber);
    
    this.state.proposalLog.push(entry);
    
    // Prune if too many
    if (this.state.proposalLog.length > this.config.offlineProposalLogSize) {
      // Remove oldest pending entries
      const toRemove: i32[] = [];
      for (let i = 0; i < this.state.proposalLog.length; i++) {
        if (this.state.proposalLog[i].status == "pending") {
          toRemove.push(i);
          if (toRemove.length >= 100) break;
        }
      }
      
      // Remove in reverse order
      for (let i = toRemove.length - 1; i >= 0; i--) {
        const idx = toRemove[i];
        this.state.proposalLog.splice(idx, 1);
      }
    }
    
    return entry;
  }
  
  /**
   * Attempt to connect to the network
   * Step 1-2 of On Join protocol
   */
  connect(): bool {
    if (this.channel === null) return false;
    
    this.state.connectionStatus = "connecting";
    
    // Create phase reference for handshake
    this.phaseReference = new PhaseReference(this.channel!.channelPrimes.length);
    this.phaseReference!.nodeId = this.nodeId;
    
    // In real implementation, would handshake with remote node
    // For now, simulate successful connection
    this.state.connectionStatus = "connected";
    this.state.lastConnectedTime = Date.now() as i64;
    this.reconnectAttempts = 0;
    
    return true;
  }
  
  /**
   * Disconnect from the network
   */
  disconnect(): void {
    this.state.connectionStatus = "disconnected";
  }
  
  /**
   * Check if connected
   */
  isConnected(): bool {
    return this.state.connectionStatus == "connected" || 
           this.state.connectionStatus == "syncing";
  }
  
  /**
   * Pull deltas from global field
   * Step 3 of On Join / Step 1 of On Reconnect
   */
  pullDeltas(): GMFDelta[] {
    if (this.globalField === null) return [];
    
    const deltas = this.globalField!.getDeltasSince(this.state.lastDeltaId);
    
    // Add to pending
    for (let i = 0; i < deltas.length; i++) {
      this.state.pendingDeltas.push(deltas[i]);
    }
    
    return deltas;
  }
  
  /**
   * Apply pending deltas to local field
   * Step 3 continued
   */
  applyDeltas(): i32 {
    if (this.localField === null) return 0;
    
    let applied = 0;
    
    while (this.state.pendingDeltas.length > 0) {
      const delta = this.state.pendingDeltas.shift()!;
      
      if (delta.type == "add" && delta.object !== null) {
        // Add object to local field
        this.localField!.addObject(delta.object!, 0.5, 0.5);
        applied++;
      } else if (delta.type == "remove") {
        // Remove from local field
        this.localField!.removeObject(delta.objectId);
        applied++;
      }
      
      this.state.lastDeltaId = delta.id;
      this.state.appliedDeltaCount++;
    }
    
    return applied;
  }
  
  /**
   * Rebase local field against global
   * Step 4 of On Join - soft merge via resonance blending
   */
  rebase(): i32 {
    if (this.localField === null || this.globalField === null) return 0;
    
    let merged = 0;
    const alpha = this.config.resonanceBlendAlpha;
    
    // For each global entry, blend with local
    const globalKeys = this.globalField!.entries.keys();
    
    for (let i = 0; i < globalKeys.length; i++) {
      const globalEntry = this.globalField!.entries.get(globalKeys[i]);
      
      if (this.localField!.entries.has(globalKeys[i])) {
        // Entry exists locally - blend weights
        const localEntry = this.localField!.entries.get(globalKeys[i]);
        
        // Resonance blending of weights
        localEntry.weight.coherenceScore = 
          (1 - alpha) * localEntry.weight.coherenceScore + 
          alpha * globalEntry.weight.coherenceScore;
        
        localEntry.weight.redundancyScore = 
          (1 - alpha) * localEntry.weight.redundancyScore + 
          alpha * globalEntry.weight.redundancyScore;
        
        merged++;
      }
    }
    
    return merged;
  }
  
  /**
   * Submit pending proposals from log
   * Step 2 of On Reconnect
   */
  submitPendingProposals(): i32 {
    if (this.dccProtocol === null || this.channel === null) return 0;
    
    let submitted = 0;
    
    for (let i = 0; i < this.state.proposalLog.length; i++) {
      const entry = this.state.proposalLog[i];
      
      if (entry.status != "pending") continue;
      
      // Try to submit
      const proposal = this.dccProtocol!.propose(entry.object, entry.proof, this.nodeId);
      
      if (proposal !== null) {
        entry.status = "submitted";
        entry.submissionAttempts++;
        entry.lastSubmissionTime = Date.now() as i64;
        submitted++;
      }
    }
    
    return submitted;
  }
  
  /**
   * Perform full synchronization
   */
  sync(): SyncResult {
    const result = new SyncResult();
    this.totalSyncs++;
    
    this.state.connectionStatus = "syncing";
    
    // Step 1: Pull deltas
    const deltas = this.pullDeltas();
    
    // Step 2: Apply deltas
    result.deltasApplied = this.applyDeltas();
    
    // Step 3: Rebase local field
    const merged = this.rebase();
    if (merged > 0) {
      result.conflictsResolved = merged;
    }
    
    // Step 4: Submit pending proposals
    if (this.isConnected()) {
      result.proposalsSubmitted = this.submitPendingProposals();
    }
    
    // Update state
    this.state.lastSyncTime = Date.now() as i64;
    this.state.connectionStatus = "connected";
    
    result.success = true;
    this.successfulSyncs++;
    
    return result;
  }
  
  /**
   * Attempt reconnection
   */
  tryReconnect(): bool {
    const now = Date.now() as i64;
    
    if (now < this.nextReconnectTime) {
      return false;
    }
    
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      return false;
    }
    
    this.reconnectAttempts++;
    
    const connected = this.connect();
    
    if (!connected) {
      // Schedule next attempt
      this.nextReconnectTime = now + this.config.reconnectIntervalMs;
      this.failedSyncs++;
      return false;
    }
    
    return true;
  }
  
  /**
   * Main update loop - call periodically
   */
  update(): SyncResult | null {
    // Check if we need to reconnect
    if (!this.isConnected() && this.config.autoReconnect) {
      if (!this.tryReconnect()) {
        return null;
      }
    }
    
    // If connected, sync
    if (this.isConnected()) {
      return this.sync();
    }
    
    return null;
  }
  
  /**
   * Get synchronization statistics
   */
  getStats(): SyncStats {
    const pendingProposals = this.state.proposalLog.filter(
      (e: ProposalLogEntry): bool => e.status == "pending"
    ).length;
    
    return new SyncStats(
      this.totalSyncs,
      this.successfulSyncs,
      this.failedSyncs,
      this.state.appliedDeltaCount,
      pendingProposals,
      this.isConnected()
    );
  }
  
  /**
   * Reset synchronizer state
   */
  reset(): void {
    this.state = new SyncState();
    this.reconnectAttempts = 0;
    this.nextReconnectTime = 0;
    this.totalSyncs = 0;
    this.successfulSyncs = 0;
    this.failedSyncs = 0;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addStringField("nodeId", this.nodeId)
      .addStringField("connectionStatus", this.state.connectionStatus)
      .addNumberField("totalSyncs", f64(this.totalSyncs))
      .addNumberField("successfulSyncs", f64(this.successfulSyncs))
      .addNumberField("proposalLogSize", f64(this.state.proposalLog.length))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Synchronizer(${this.nodeId.substring(0, 8)}, ${this.state.connectionStatus})`;
  }
}

// ============================================================================
// Sync Statistics
// ============================================================================

/**
 * Synchronization statistics
 */
export class SyncStats implements Serializable {
  totalSyncs: i32;
  successfulSyncs: i32;
  failedSyncs: i32;
  appliedDeltaCount: i32;
  pendingProposalCount: i32;
  isConnected: bool;
  
  constructor(
    totalSyncs: i32,
    successfulSyncs: i32,
    failedSyncs: i32,
    appliedDeltaCount: i32,
    pendingProposalCount: i32,
    isConnected: bool
  ) {
    this.totalSyncs = totalSyncs;
    this.successfulSyncs = successfulSyncs;
    this.failedSyncs = failedSyncs;
    this.appliedDeltaCount = appliedDeltaCount;
    this.pendingProposalCount = pendingProposalCount;
    this.isConnected = isConnected;
  }
  
  /**
   * Compute sync success rate
   */
  successRate(): f64 {
    if (this.totalSyncs == 0) return 0;
    return f64(this.successfulSyncs) / f64(this.totalSyncs);
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("totalSyncs", f64(this.totalSyncs))
      .addNumberField("successfulSyncs", f64(this.successfulSyncs))
      .addNumberField("failedSyncs", f64(this.failedSyncs))
      .addNumberField("appliedDeltaCount", f64(this.appliedDeltaCount))
      .addNumberField("pendingProposalCount", f64(this.pendingProposalCount))
      .addBooleanField("isConnected", this.isConnected)
      .addNumberField("successRate", this.successRate())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `SyncStats(syncs=${this.successfulSyncs}/${this.totalSyncs})`;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a network synchronizer
 */
export function createSynchronizer(nodeId: string): NetworkSynchronizer {
  return new NetworkSynchronizer(nodeId);
}

/**
 * Create a network synchronizer with custom config
 */
export function createSynchronizerWithConfig(nodeId: string, config: SyncConfig): NetworkSynchronizer {
  return new NetworkSynchronizer(nodeId, config);
}

/**
 * Create a sync configuration
 */
export function createSyncConfig(): SyncConfig {
  return new SyncConfig();
}