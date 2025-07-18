import { IIdentity, IPermission, IdentityType, KYCLevel } from "./interfaces";
import { IdentityId, IdentityCreationParams } from "./types";
import { Identity } from "./identity";
import { Permission } from "./permissions";
import { globalAuditTrail } from "./audit-trail";
import { AuditEventType, AuditSeverity } from "./audit-trail";
import { QuantumIdentityRecovery } from "./resolang-processor";
import { globalPrimeMapper } from "./prime-mapping";

/**
 * Recovery configuration for an identity
 */
export class RecoveryConfig {
  identityId: IdentityId;
  recoveryIdentities: Array<IdentityId>;
  requiredSignatures: i32;
  recoveryDelay: i64; // Time delay before recovery can be executed
  lastModified: i64;

  constructor(
    identityId: IdentityId,
    recoveryIdentities: Array<IdentityId>,
    requiredSignatures: i32,
    recoveryDelay: i64 = 86400000 // 24 hours default
  ) {
    this.identityId = identityId;
    this.recoveryIdentities = recoveryIdentities;
    this.requiredSignatures = requiredSignatures;
    this.recoveryDelay = recoveryDelay;
    this.lastModified = Date.now();
    
    // Validate configuration
    if (requiredSignatures > recoveryIdentities.length) {
      throw new Error("Required signatures cannot exceed number of recovery identities");
    }
    if (requiredSignatures < 1) {
      throw new Error("At least one signature is required for recovery");
    }
  }

  /**
   * Add a recovery identity
   */
  addRecoveryIdentity(identityId: IdentityId): void {
    if (!this.recoveryIdentities.includes(identityId)) {
      this.recoveryIdentities.push(identityId);
      this.lastModified = Date.now();
    }
  }

  /**
   * Remove a recovery identity
   */
  removeRecoveryIdentity(identityId: IdentityId): boolean {
    const index = this.recoveryIdentities.indexOf(identityId);
    if (index >= 0) {
      this.recoveryIdentities.splice(index, 1);
      this.lastModified = Date.now();
      
      // Ensure we still have enough recovery identities
      if (this.recoveryIdentities.length < this.requiredSignatures) {
        this.requiredSignatures = this.recoveryIdentities.length;
      }
      
      return true;
    }
    return false;
  }

  /**
   * Update required signatures
   */
  setRequiredSignatures(count: i32): void {
    if (count > this.recoveryIdentities.length) {
      throw new Error("Required signatures cannot exceed number of recovery identities");
    }
    if (count < 1) {
      throw new Error("At least one signature is required");
    }
    
    this.requiredSignatures = count;
    this.lastModified = Date.now();
  }
}

/**
 * Recovery request tracking
 */
export class RecoveryRequest {
  id: string;
  targetIdentityId: IdentityId;
  newOwnerIdentityId: IdentityId;
  signatures: Map<IdentityId, i64>; // Identity ID -> timestamp
  createdAt: i64;
  executedAt: i64;
  status: RecoveryStatus;
  reason: string;

  constructor(
    targetIdentityId: IdentityId,
    newOwnerIdentityId: IdentityId,
    reason: string
  ) {
    this.id = targetIdentityId + "-recovery-" + Date.now().toString();
    this.targetIdentityId = targetIdentityId;
    this.newOwnerIdentityId = newOwnerIdentityId;
    this.signatures = new Map<IdentityId, i64>();
    this.createdAt = Date.now();
    this.executedAt = 0;
    this.status = RecoveryStatus.PENDING;
    this.reason = reason;
  }

  /**
   * Add a signature to the recovery request
   */
  addSignature(identityId: IdentityId): void {
    if (!this.signatures.has(identityId)) {
      this.signatures.set(identityId, Date.now());
    }
  }

  /**
   * Check if identity has signed
   */
  hasSigned(identityId: IdentityId): boolean {
    return this.signatures.has(identityId) ? true : false;
  }

  /**
   * Get number of signatures
   */
  getSignatureCount(): i32 {
    return this.signatures.size;
  }

  /**
   * Mark as executed
   */
  markExecuted(): void {
    this.executedAt = Date.now();
    this.status = RecoveryStatus.EXECUTED;
  }

  /**
   * Mark as cancelled
   */
  markCancelled(): void {
    this.status = RecoveryStatus.CANCELLED;
  }

  /**
   * Mark as expired
   */
  markExpired(): void {
    this.status = RecoveryStatus.EXPIRED;
  }
}

/**
 * Recovery request status
 */
export enum RecoveryStatus {
  PENDING,
  EXECUTED,
  CANCELLED,
  EXPIRED
}

/**
 * Identity recovery manager
 */
export class IdentityRecoveryManager {
  private recoveryConfigs: Map<IdentityId, RecoveryConfig>;
  private recoveryRequests: Map<string, RecoveryRequest>;
  private identityStore: Map<IdentityId, IIdentity>;
  private quantumRecovery: QuantumIdentityRecovery;
  private requestTimeout: i64;

  constructor(
    identityStore: Map<IdentityId, IIdentity>,
    requestTimeout: i64 = 604800000 // 7 days default
  ) {
    this.recoveryConfigs = new Map<IdentityId, RecoveryConfig>();
    this.recoveryRequests = new Map<string, RecoveryRequest>();
    this.identityStore = identityStore;
    this.quantumRecovery = new QuantumIdentityRecovery();
    this.requestTimeout = requestTimeout;
  }

  /**
   * Set recovery configuration for an identity
   */
  setRecoveryConfig(
    identityId: IdentityId,
    config: RecoveryConfig,
    actorId: IdentityId
  ): void {
    // Verify actor has permission
    const identity = this.identityStore.get(identityId);
    if (!identity) {
      throw new Error("Identity not found");
    }
    
    // Only identity owner can set recovery config
    if (actorId != identityId) {
      throw new Error("Only identity owner can set recovery configuration");
    }
    
    this.recoveryConfigs.set(identityId, config);
    
    // Log configuration change
    globalAuditTrail.logEvent(
      AuditEventType.PERMISSION_GRANTED,
      actorId,
      identityId,
      "Recovery configuration updated",
      AuditSeverity.WARNING
    );
  }

  /**
   * Get recovery configuration
   */
  getRecoveryConfig(identityId: IdentityId): RecoveryConfig | null {
    return this.recoveryConfigs.has(identityId) 
      ? this.recoveryConfigs.get(identityId) 
      : null;
  }

  /**
   * Initiate identity recovery
   */
  initiateRecovery(
    targetIdentityId: IdentityId,
    newOwnerIdentityId: IdentityId,
    initiatorId: IdentityId,
    reason: string
  ): RecoveryRequest {
    // Get recovery configuration
    const config = this.recoveryConfigs.get(targetIdentityId);
    if (!config) {
      throw new Error("No recovery configuration found for identity");
    }
    
    // Verify initiator is in recovery list
    if (!config.recoveryIdentities.includes(initiatorId)) {
      throw new Error("Initiator is not authorized for recovery");
    }
    
    // Check for existing pending request
    const existingRequests = this.recoveryRequests.values();
    for (let i = 0; i < existingRequests.length; i++) {
      const request = existingRequests[i];
      if (request.targetIdentityId == targetIdentityId && 
          request.status == RecoveryStatus.PENDING) {
        throw new Error("Recovery request already pending for this identity");
      }
    }
    
    // Create new recovery request
    const request = new RecoveryRequest(
      targetIdentityId,
      newOwnerIdentityId,
      reason
    );
    
    // Add initiator's signature
    request.addSignature(initiatorId);
    
    this.recoveryRequests.set(request.id, request);
    
    // Log recovery initiation
    globalAuditTrail.logEvent(
      AuditEventType.PERMISSION_GRANTED,
      initiatorId,
      targetIdentityId,
      "Recovery initiated: " + reason,
      AuditSeverity.CRITICAL
    );
    
    return request;
  }

  /**
   * Sign a recovery request
   */
  signRecoveryRequest(
    requestId: string,
    signerId: IdentityId
  ): void {
    const request = this.recoveryRequests.get(requestId);
    if (!request) {
      throw new Error("Recovery request not found");
    }
    
    if (request.status != RecoveryStatus.PENDING) {
      throw new Error("Recovery request is not pending");
    }
    
    // Check if request has expired
    if (Date.now() - request.createdAt > this.requestTimeout) {
      request.markExpired();
      throw new Error("Recovery request has expired");
    }
    
    // Get recovery configuration
    const config = this.recoveryConfigs.get(request.targetIdentityId);
    if (!config) {
      throw new Error("No recovery configuration found");
    }
    
    // Verify signer is authorized
    if (!config.recoveryIdentities.includes(signerId)) {
      throw new Error("Signer is not authorized for recovery");
    }
    
    // Add signature
    request.addSignature(signerId);
    
    // Log signature
    globalAuditTrail.logEvent(
      AuditEventType.PERMISSION_GRANTED,
      signerId,
      request.targetIdentityId,
      "Recovery request signed",
      AuditSeverity.WARNING
    );
    
    // Check if we can execute recovery
    if (request.getSignatureCount() >= config.requiredSignatures) {
      this.tryExecuteRecovery(request);
    }
  }

  /**
   * Try to execute recovery
   */
  private tryExecuteRecovery(request: RecoveryRequest): void {
    const config = this.recoveryConfigs.get(request.targetIdentityId);
    if (!config) {
      return;
    }
    
    // Check recovery delay
    const timeSinceRequest = Date.now() - request.createdAt;
    if (timeSinceRequest < config.recoveryDelay) {
      return; // Still in delay period
    }
    
    // Collect recovery identities
    const recoveryIdentities = new Array<IIdentity>();
    const signerIds = request.signatures.keys();
    
    for (let i = 0; i < signerIds.length; i++) {
      const identity = this.identityStore.get(signerIds[i]);
      if (identity) {
        recoveryIdentities.push(identity);
      }
    }
    
    // Use quantum recovery to verify
    const recoverySuccessful = this.quantumRecovery.recoverIdentity(
      request.targetIdentityId,
      recoveryIdentities,
      config.requiredSignatures
    );
    
    if (recoverySuccessful) {
      // Execute recovery
      this.executeRecovery(request);
    }
  }

  /**
   * Execute identity recovery
   */
  private executeRecovery(request: RecoveryRequest): void {
    const identity = this.identityStore.get(request.targetIdentityId);
    if (!identity) {
      throw new Error("Target identity not found");
    }
    
    // Create new identity with recovered access
    const params = new IdentityCreationParams();
    params.type = identity.getType() == IdentityType.SELF_SOVEREIGN ? "self_sovereign" :
                  identity.getType() == IdentityType.MANAGED ? "managed" : "system";
    params.kycLevel = identity.getKYCLevel() as i32;
    params.metadata = new Map<string, string>();
    params.metadata.set("recovered_from", request.targetIdentityId);
    params.metadata.set("recovery_reason", request.reason);
    
    const recoveredIdentity = new Identity(params);
    
    // Update identity store
    this.identityStore.set(request.newOwnerIdentityId, recoveredIdentity);
    
    // Mark original identity as deactivated
    if (identity.isActive()) {
      identity.deactivate();
    }
    
    // Create new prime mapping for recovered identity
    const mapping = globalPrimeMapper.getMapping(request.targetIdentityId);
    if (mapping) {
      // The mapper will automatically create a new mapping when needed
      globalPrimeMapper.getMapping(recoveredIdentity.getId());
    }
    
    // Mark request as executed
    request.markExecuted();
    
    // Log recovery execution
    globalAuditTrail.logEvent(
      AuditEventType.IDENTITY_CREATED,
      request.newOwnerIdentityId,
      request.targetIdentityId,
      "Identity recovered: " + request.reason,
      AuditSeverity.CRITICAL
    );
  }

  /**
   * Cancel a recovery request
   */
  cancelRecoveryRequest(
    requestId: string,
    actorId: IdentityId
  ): void {
    const request = this.recoveryRequests.get(requestId);
    if (!request) {
      throw new Error("Recovery request not found");
    }
    
    if (request.status != RecoveryStatus.PENDING) {
      throw new Error("Recovery request is not pending");
    }
    
    // Only target identity or recovery signers can cancel
    if (actorId != request.targetIdentityId && !request.hasSigned(actorId)) {
      throw new Error("Not authorized to cancel recovery request");
    }
    
    request.markCancelled();
    
    // Log cancellation
    globalAuditTrail.logEvent(
      AuditEventType.PERMISSION_REVOKED,
      actorId,
      request.targetIdentityId,
      "Recovery request cancelled",
      AuditSeverity.WARNING
    );
  }

  /**
   * Get pending recovery requests for an identity
   */
  getPendingRequests(identityId: IdentityId): Array<RecoveryRequest> {
    const requests = new Array<RecoveryRequest>();
    const allRequests = this.recoveryRequests.values();
    
    for (let i = 0; i < allRequests.length; i++) {
      const request = allRequests[i];
      if (request.targetIdentityId == identityId && 
          request.status == RecoveryStatus.PENDING) {
        requests.push(request);
      }
    }
    
    return requests;
  }

  /**
   * Clean up expired requests
   */
  cleanupExpiredRequests(): void {
    const now = Date.now();
    const requestIds = this.recoveryRequests.keys();
    
    for (let i = 0; i < requestIds.length; i++) {
      const request = this.recoveryRequests.get(requestIds[i]);
      
      if (request && request.status == RecoveryStatus.PENDING &&
          now - request.createdAt > this.requestTimeout) {
        request.markExpired();
      }
    }
  }
}

// Global recovery manager instance
export const globalRecoveryManager = new IdentityRecoveryManager(
  new Map<IdentityId, IIdentity>() // Will be set by the identity system
);