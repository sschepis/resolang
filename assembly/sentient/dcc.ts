/**
 * Distributed Coherent-Commit (DCC)
 * 
 * Protocol for updating the Global Memory Field with coherence and redundancy gates.
 * From whitepaper Section 6.4 and Algorithm 1:
 * 
 * Accept(Ω) = 1{C >= C_th} · 1{R(Ω) >= τ_R} · 1{Q(Ω) >= τ_Q}
 * 
 * where:
 * - C is coherence
 * - R(Ω) is redundancy score
 * - Q(Ω) is stability/security composite
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { MemoryObject, LocalProof, GlobalMemoryField, GMFDelta } from './gmf';
import { PRRCChannel, PRRCPacket } from './prrc';

// ============================================================================
// ID Generator
// ============================================================================

let _dccIdCounter: i64 = 0;

function generateId(prefix: string = "dcc"): string {
  _dccIdCounter++;
  const timestamp = Date.now() as i64;
  return `${prefix}_${timestamp}_${_dccIdCounter}`;
}

// ============================================================================
// DCC Configuration
// ============================================================================

/**
 * DCC Protocol Configuration
 */
export class DCCConfig {
  // Coherence thresholds
  coherenceThreshold: f64 = 0.7;         // C_th
  entropyRateThreshold: f64 = 0.1;       // ε_S
  
  // SMF thresholds
  smfEntropyMin: f64 = 1.0;
  smfEntropyMax: f64 = 3.5;
  identityAxisMin: f64 = 0.1;
  
  // Reconstruction
  reconstructionThreshold: f64 = 0.9;
  
  // Redundancy
  redundancyThreshold: f64 = 0.51;       // τ_R (majority)
  minVerifiers: i32 = 3;
  maxVerifiers: i32 = 21;
  
  // Security
  securityThreshold: f64 = 0.8;          // τ_Q
  enableAnomalyDetection: bool = true;
  
  // Timing
  proposalTimeoutMs: i64 = 30000;        // 30 seconds
  voteTimeoutMs: i64 = 10000;            // 10 seconds
  
  constructor() {}
}

// ============================================================================
// Proposal
// ============================================================================

/**
 * Proposal for inserting a memory object into GMF
 */
export class DCCProposal implements Serializable {
  id: string;
  timestamp: i64;
  
  // Object being proposed
  object: MemoryObject;
  
  // Local proofs from proposer
  localProof: LocalProof;
  
  // Proposer information
  proposerNodeId: string;
  tickNumber: i64;
  
  // Status
  status: string;  // "pending", "voting", "accepted", "rejected"
  expiresAt: i64;
  
  constructor(object: MemoryObject, proof: LocalProof, nodeId: string) {
    this.id = generateId("prop");
    this.timestamp = Date.now() as i64;
    this.object = object;
    this.localProof = proof;
    this.proposerNodeId = nodeId;
    this.tickNumber = 0;
    this.status = "pending";
    this.expiresAt = this.timestamp + 30000;  // 30s default
  }
  
  /**
   * Check if proposal has expired
   */
  isExpired(): bool {
    return (Date.now() as i64) > this.expiresAt;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("timestamp", f64(this.timestamp))
      .addStringField("objectId", this.object.id)
      .addStringField("proposerNodeId", this.proposerNodeId)
      .addStringField("status", this.status)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Proposal(${this.id.substring(0, 8)}, ${this.status})`;
  }
}

// ============================================================================
// Verification Vote
// ============================================================================

/**
 * Vote from a verifier node
 */
export class VerificationVote implements Serializable {
  id: string;
  timestamp: i64;
  
  // References
  proposalId: string;
  verifierNodeId: string;
  
  // Vote result
  vote: bool;  // true = accept, false = reject
  
  // Verification details
  decodedSuccessfully: bool;
  contentMatch: f64;     // Similarity to original
  coherenceCheck: f64;   // Local coherence verification
  
  // Signature placeholder
  signature: string;
  
  constructor(proposalId: string, verifierId: string) {
    this.id = generateId("vote");
    this.timestamp = Date.now() as i64;
    this.proposalId = proposalId;
    this.verifierNodeId = verifierId;
    this.vote = false;
    this.decodedSuccessfully = false;
    this.contentMatch = 0;
    this.coherenceCheck = 0;
    this.signature = "";
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addStringField("proposalId", this.proposalId)
      .addStringField("verifierNodeId", this.verifierNodeId)
      .addBooleanField("vote", this.vote)
      .addNumberField("contentMatch", this.contentMatch)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Vote(${this.verifierNodeId.substring(0, 8)}, ${this.vote ? "accept" : "reject"})`;
  }
}

// ============================================================================
// Network Evidence
// ============================================================================

/**
 * Network evidence collected for a proposal
 */
export class NetworkEvidence implements Serializable {
  proposalId: string;
  
  // Votes
  votes: VerificationVote[];
  totalVotes: i32;
  acceptVotes: i32;
  rejectVotes: i32;
  
  // Computed scores
  redundancyScore: f64;      // R(Ω)
  resonanceStrength: f64;    // Prime-resonant correlation
  stabilityScore: f64;       // Q(Ω) composite
  
  constructor(proposalId: string) {
    this.proposalId = proposalId;
    this.votes = [];
    this.totalVotes = 0;
    this.acceptVotes = 0;
    this.rejectVotes = 0;
    this.redundancyScore = 0;
    this.resonanceStrength = 0;
    this.stabilityScore = 1.0;
  }
  
  /**
   * Add a vote
   */
  addVote(vote: VerificationVote): void {
    this.votes.push(vote);
    this.totalVotes++;
    
    if (vote.vote) {
      this.acceptVotes++;
    } else {
      this.rejectVotes++;
    }
    
    // Update redundancy score
    if (this.totalVotes > 0) {
      this.redundancyScore = f64(this.acceptVotes) / f64(this.totalVotes);
    }
    
    // Update resonance strength from content match
    let totalMatch: f64 = 0;
    for (let i = 0; i < this.votes.length; i++) {
      totalMatch += this.votes[i].contentMatch;
    }
    this.resonanceStrength = this.votes.length > 0 ? totalMatch / f64(this.votes.length) : 0;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("proposalId", this.proposalId)
      .addNumberField("totalVotes", f64(this.totalVotes))
      .addNumberField("acceptVotes", f64(this.acceptVotes))
      .addNumberField("rejectVotes", f64(this.rejectVotes))
      .addNumberField("redundancyScore", this.redundancyScore)
      .addNumberField("resonanceStrength", this.resonanceStrength)
      .addNumberField("stabilityScore", this.stabilityScore)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Evidence(${this.acceptVotes}/${this.totalVotes}, R=${toFixed(this.redundancyScore, 2)})`;
  }
}

// ============================================================================
// Commit Result
// ============================================================================

/**
 * Result of a commit attempt
 */
export class CommitResult implements Serializable {
  proposalId: string;
  accepted: bool;
  timestamp: i64;
  
  // Scores at commit time
  coherenceScore: f64;
  redundancyScore: f64;
  stabilityScore: f64;
  
  // GMF delta if accepted
  delta: GMFDelta | null;
  
  // Rejection reason if rejected
  rejectionReason: string;
  
  constructor(proposalId: string) {
    this.proposalId = proposalId;
    this.accepted = false;
    this.timestamp = Date.now() as i64;
    this.coherenceScore = 0;
    this.redundancyScore = 0;
    this.stabilityScore = 0;
    this.delta = null;
    this.rejectionReason = "";
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("proposalId", this.proposalId)
      .addBooleanField("accepted", this.accepted)
      .addNumberField("coherenceScore", this.coherenceScore)
      .addNumberField("redundancyScore", this.redundancyScore)
      .addNumberField("stabilityScore", this.stabilityScore)
      .addStringField("rejectionReason", this.rejectionReason)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `CommitResult(${this.accepted ? "accepted" : "rejected"})`;
  }
}

// ============================================================================
// Verifier Node
// ============================================================================

/**
 * Interface for a verifier node in the DCC protocol
 */
export class VerifierNode implements Serializable {
  nodeId: string;
  channel: PRRCChannel | null;
  
  // Node metadata for diversity constraints
  region: string;
  deviceClass: string;
  noiseProfile: f64;
  
  // Statistics
  verificationCount: i32;
  lastVerificationTime: i64;
  
  constructor(nodeId: string) {
    this.nodeId = nodeId;
    this.channel = null;
    this.region = "unknown";
    this.deviceClass = "standard";
    this.noiseProfile = 0;
    this.verificationCount = 0;
    this.lastVerificationTime = 0;
  }
  
  /**
   * Verify a proposal by decoding and checking
   */
  verify(packet: PRRCPacket, original: MemoryObject): VerificationVote {
    const vote = new VerificationVote(packet.originalObjectId, this.nodeId);
    
    // Try to decode
    if (this.channel !== null) {
      const decoded = this.channel!.decode(packet);
      
      if (decoded !== null) {
        vote.decodedSuccessfully = true;
        
        // Check content match
        vote.contentMatch = original.similarity(decoded!);
        
        // Simple coherence check (would be more sophisticated in practice)
        vote.coherenceCheck = vote.contentMatch > 0.8 ? 1.0 : 0.5;
        
        // Vote based on content match
        vote.vote = vote.contentMatch >= 0.9;
      }
    }
    
    this.verificationCount++;
    this.lastVerificationTime = Date.now() as i64;
    
    return vote;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("nodeId", this.nodeId)
      .addStringField("region", this.region)
      .addStringField("deviceClass", this.deviceClass)
      .addNumberField("verificationCount", f64(this.verificationCount))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Verifier(${this.nodeId.substring(0, 8)})`;
  }
}

// ============================================================================
// DCC Protocol
// ============================================================================

/**
 * Distributed Coherent-Commit Protocol
 * Implements Algorithm 1 from the whitepaper
 */
export class DCCProtocol implements Serializable {
  id: string;
  config: DCCConfig;
  
  // Connected verifiers
  verifiers: Map<string, VerifierNode>;
  
  // Active proposals
  proposals: Map<string, DCCProposal>;
  evidence: Map<string, NetworkEvidence>;
  
  // Commit history
  commitHistory: CommitResult[];
  maxHistory: i32;
  
  // Statistics
  totalProposals: i32;
  acceptedProposals: i32;
  rejectedProposals: i32;
  
  constructor(config: DCCConfig = new DCCConfig()) {
    this.id = generateId("dcc");
    this.config = config;
    this.verifiers = new Map<string, VerifierNode>();
    this.proposals = new Map<string, DCCProposal>();
    this.evidence = new Map<string, NetworkEvidence>();
    this.commitHistory = [];
    this.maxHistory = 1000;
    this.totalProposals = 0;
    this.acceptedProposals = 0;
    this.rejectedProposals = 0;
  }
  
  /**
   * Register a verifier node
   */
  registerVerifier(verifier: VerifierNode): void {
    this.verifiers.set(verifier.nodeId, verifier);
  }
  
  /**
   * Remove a verifier node
   */
  removeVerifier(nodeId: string): void {
    if (this.verifiers.has(nodeId)) {
      this.verifiers.delete(nodeId);
    }
  }
  
  /**
   * Select verifier set with diversity constraints
   */
  selectVerifiers(count: i32): VerifierNode[] {
    const selected: VerifierNode[] = [];
    const usedRegions = new Set<string>();
    const usedDeviceClasses = new Set<string>();
    
    const keys = this.verifiers.keys();
    
    // First pass: maximize diversity
    for (let i = 0; i < keys.length && selected.length < count; i++) {
      const verifier = this.verifiers.get(keys[i]);
      
      // Prefer diverse regions and device classes
      if (!usedRegions.has(verifier.region) || !usedDeviceClasses.has(verifier.deviceClass)) {
        selected.push(verifier);
        usedRegions.add(verifier.region);
        usedDeviceClasses.add(verifier.deviceClass);
      }
    }
    
    // Second pass: fill remaining slots
    for (let i = 0; i < keys.length && selected.length < count; i++) {
      const verifier = this.verifiers.get(keys[i]);
      
      // Check if not already selected
      let alreadySelected = false;
      for (let j = 0; j < selected.length; j++) {
        if (selected[j].nodeId == verifier.nodeId) {
          alreadySelected = true;
          break;
        }
      }
      
      if (!alreadySelected) {
        selected.push(verifier);
      }
    }
    
    return selected;
  }
  
  /**
   * Submit a proposal for a memory object
   * Step 1 of Algorithm 1
   */
  propose(object: MemoryObject, proof: LocalProof, nodeId: string): DCCProposal | null {
    // Check local evidence first
    if (!proof.passes(
      this.config.coherenceThreshold,
      this.config.entropyRateThreshold,
      this.config.smfEntropyMin,
      this.config.smfEntropyMax,
      this.config.identityAxisMin,
      this.config.reconstructionThreshold
    )) {
      return null;
    }
    
    const proposal = new DCCProposal(object, proof, nodeId);
    proposal.expiresAt = proposal.timestamp + this.config.proposalTimeoutMs;
    proposal.status = "pending";
    
    this.proposals.set(proposal.id, proposal);
    this.evidence.set(proposal.id, new NetworkEvidence(proposal.id));
    this.totalProposals++;
    
    return proposal;
  }
  
  /**
   * Broadcast proposal to verifier set
   * Step 2 of Algorithm 1
   */
  broadcast(proposal: DCCProposal, channel: PRRCChannel): PRRCPacket[] {
    const packets: PRRCPacket[] = [];
    
    proposal.status = "voting";
    
    // Select verifier set
    const verifierCount = Math.min(
      Math.max(this.verifiers.size, this.config.minVerifiers),
      this.config.maxVerifiers
    ) as i32;
    
    const verifiers = this.selectVerifiers(verifierCount);
    
    // Encode and create packets for each verifier
    for (let i = 0; i < verifiers.length; i++) {
      const packet = channel.encode(proposal.object, verifiers[i].nodeId);
      packets.push(packet);
    }
    
    return packets;
  }
  
  /**
   * Collect a verification vote
   * Steps 3-6 of Algorithm 1
   */
  collectVote(vote: VerificationVote): void {
    if (!this.evidence.has(vote.proposalId)) return;
    
    const ev = this.evidence.get(vote.proposalId);
    ev.addVote(vote);
  }
  
  /**
   * Evaluate proposal for commit
   * Steps 7-12 of Algorithm 1
   */
  evaluate(proposalId: string): CommitResult {
    const result = new CommitResult(proposalId);
    
    if (!this.proposals.has(proposalId) || !this.evidence.has(proposalId)) {
      result.rejectionReason = "proposal_not_found";
      return result;
    }
    
    const proposal = this.proposals.get(proposalId);
    const ev = this.evidence.get(proposalId);
    
    // Check expiration
    if (proposal.isExpired()) {
      result.rejectionReason = "proposal_expired";
      proposal.status = "rejected";
      this.rejectedProposals++;
      return result;
    }
    
    // Step 7: Compute redundancy score
    result.redundancyScore = ev.redundancyScore;
    result.coherenceScore = proposal.localProof.coherence;
    result.stabilityScore = ev.stabilityScore;
    
    // Step 8: Check acceptance criteria
    // Accept(Ω) = 1{C >= C_th} · 1{R(Ω) >= τ_R} · 1{Q(Ω) >= τ_Q}
    
    const passesCoherence = proposal.localProof.passes(
      this.config.coherenceThreshold,
      this.config.entropyRateThreshold,
      this.config.smfEntropyMin,
      this.config.smfEntropyMax,
      this.config.identityAxisMin,
      this.config.reconstructionThreshold
    );
    
    const passesRedundancy = ev.redundancyScore >= this.config.redundancyThreshold;
    const passesSecurity = ev.stabilityScore >= this.config.securityThreshold;
    
    if (!passesCoherence) {
      result.rejectionReason = "coherence_failed";
    } else if (!passesRedundancy) {
      result.rejectionReason = "redundancy_failed";
    } else if (!passesSecurity) {
      result.rejectionReason = "security_failed";
    }
    
    if (passesCoherence && passesRedundancy && passesSecurity) {
      // Step 9: Accept
      result.accepted = true;
      proposal.status = "accepted";
      this.acceptedProposals++;
    } else {
      // Step 11: Reject
      proposal.status = "rejected";
      this.rejectedProposals++;
    }
    
    // Record in history
    this.commitHistory.push(result);
    if (this.commitHistory.length > this.maxHistory) {
      this.commitHistory.shift();
    }
    
    return result;
  }
  
  /**
   * Commit a proposal to GMF
   * Step 9 of Algorithm 1
   */
  commit(proposalId: string, gmf: GlobalMemoryField): CommitResult {
    const result = this.evaluate(proposalId);
    
    if (result.accepted) {
      const proposal = this.proposals.get(proposalId);
      const ev = this.evidence.get(proposalId);
      
      // Add to GMF with computed scores
      const delta = gmf.addObject(
        proposal.object,
        proposal.localProof.coherence,
        ev.redundancyScore
      );
      
      result.delta = delta;
    }
    
    // Cleanup proposal
    this.proposals.delete(proposalId);
    this.evidence.delete(proposalId);
    
    return result;
  }
  
  /**
   * Clean up expired proposals
   */
  cleanup(): i32 {
    let cleaned = 0;
    const toRemove: string[] = [];
    
    const keys = this.proposals.keys();
    for (let i = 0; i < keys.length; i++) {
      const proposal = this.proposals.get(keys[i]);
      if (proposal.isExpired()) {
        toRemove.push(keys[i]);
      }
    }
    
    for (let i = 0; i < toRemove.length; i++) {
      this.proposals.delete(toRemove[i]);
      this.evidence.delete(toRemove[i]);
      this.rejectedProposals++;
      cleaned++;
    }
    
    return cleaned;
  }
  
  /**
   * Get protocol statistics
   */
  getStats(): DCCStats {
    return new DCCStats(
      this.totalProposals,
      this.acceptedProposals,
      this.rejectedProposals,
      this.proposals.size,
      this.verifiers.size
    );
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("totalProposals", f64(this.totalProposals))
      .addNumberField("acceptedProposals", f64(this.acceptedProposals))
      .addNumberField("rejectedProposals", f64(this.rejectedProposals))
      .addNumberField("pendingProposals", f64(this.proposals.size))
      .addNumberField("verifierCount", f64(this.verifiers.size))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `DCC(${this.acceptedProposals}/${this.totalProposals} accepted)`;
  }
}

// ============================================================================
// DCC Statistics
// ============================================================================

/**
 * DCC protocol statistics
 */
export class DCCStats implements Serializable {
  totalProposals: i32;
  acceptedProposals: i32;
  rejectedProposals: i32;
  pendingProposals: i32;
  verifierCount: i32;
  
  constructor(
    totalProposals: i32,
    acceptedProposals: i32,
    rejectedProposals: i32,
    pendingProposals: i32,
    verifierCount: i32
  ) {
    this.totalProposals = totalProposals;
    this.acceptedProposals = acceptedProposals;
    this.rejectedProposals = rejectedProposals;
    this.pendingProposals = pendingProposals;
    this.verifierCount = verifierCount;
  }
  
  /**
   * Compute acceptance rate
   */
  acceptanceRate(): f64 {
    if (this.totalProposals == 0) return 0;
    return f64(this.acceptedProposals) / f64(this.totalProposals);
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("totalProposals", f64(this.totalProposals))
      .addNumberField("acceptedProposals", f64(this.acceptedProposals))
      .addNumberField("rejectedProposals", f64(this.rejectedProposals))
      .addNumberField("pendingProposals", f64(this.pendingProposals))
      .addNumberField("verifierCount", f64(this.verifierCount))
      .addNumberField("acceptanceRate", this.acceptanceRate())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `DCCStats(${this.acceptedProposals}/${this.totalProposals}, rate=${toFixed(this.acceptanceRate(), 2)})`;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a DCC protocol with default configuration
 */
export function createDCCProtocol(): DCCProtocol {
  return new DCCProtocol();
}

/**
 * Create a DCC protocol with custom configuration
 */
export function createDCCProtocolWithConfig(config: DCCConfig): DCCProtocol {
  return new DCCProtocol(config);
}

/**
 * Create a DCC configuration
 */
export function createDCCConfig(): DCCConfig {
  return new DCCConfig();
}

/**
 * Create a verifier node
 */
export function createVerifierNode(nodeId: string): VerifierNode {
  return new VerifierNode(nodeId);
}