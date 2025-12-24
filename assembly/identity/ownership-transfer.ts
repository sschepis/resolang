/**
 * Ownership Transfer System for Domains and Objects
 * Handles secure transfer of ownership with validation and audit trails
 */

import { IIdentity, IDomain, IDomainObject } from "./interfaces";
import { IdentityId, DomainId, ObjectId, Timestamp } from "./types";
import { PermissionEvaluator } from "./permissions";
import { globalAuditTrail, AuditEventType, AuditSeverity } from "./audit-trail";
import { BaseSerializable } from "../core/interfaces";

/**
 * Transfer request status
 */
export enum TransferStatus {
  PENDING,
  APPROVED,
  REJECTED,
  CANCELLED,
  EXPIRED,
  COMPLETED
}

/**
 * Transfer type
 */
export enum TransferType {
  DOMAIN,
  OBJECT
}

/**
 * Ownership transfer request
 */
export class TransferRequest extends BaseSerializable {
  id: string;
  type: TransferType;
  entityId: string; // Domain or Object ID
  fromOwnerId: IdentityId;
  toOwnerId: IdentityId;
  initiatorId: IdentityId;
  status: TransferStatus;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  completedAt: Timestamp; // Use -1 to indicate null
  reason: string;
  metadata: Map<string, string>;
  approvals: Map<IdentityId, boolean>; // For multi-sig transfers
  requiredApprovals: i32;

  constructor(
    type: TransferType,
    entityId: string,
    fromOwnerId: IdentityId,
    toOwnerId: IdentityId,
    initiatorId: IdentityId,
    reason: string,
    expirationHours: i32 = 24
  ) {
    super();
    this.id = "transfer-" + Date.now().toString() + "-" + Math.random().toString();
    this.type = type;
    this.entityId = entityId;
    this.fromOwnerId = fromOwnerId;
    this.toOwnerId = toOwnerId;
    this.initiatorId = initiatorId;
    this.status = TransferStatus.PENDING;
    this.createdAt = Date.now();
    this.expiresAt = this.createdAt + (expirationHours * 60 * 60 * 1000);
    this.completedAt = -1; // Use -1 to indicate null
    this.reason = reason;
    this.metadata = new Map<string, string>();
    this.approvals = new Map<IdentityId, boolean>();
    this.requiredApprovals = 1; // Default to single approval
  }

  /**
   * Add approval from an identity
   */
  addApproval(approverId: IdentityId, approved: boolean): void {
    this.approvals.set(approverId, approved);
  }

  /**
   * Check if transfer has enough approvals
   */
  hasRequiredApprovals(): boolean {
    let approvalCount = 0;
    const approvers = this.approvals.keys();
    
    for (let i = 0; i < approvers.length; i++) {
      if (this.approvals.get(approvers[i])) {
        approvalCount++;
      }
    }
    
    return approvalCount >= this.requiredApprovals;
  }

  /**
   * Check if transfer is expired
   */
  isExpired(): boolean {
    return Date.now() > this.expiresAt;
  }

  /**
   * Check if transfer is completed
   */
  isCompleted(): boolean {
    return this.completedAt > 0;
  }

  /**
   * Mark as completed
   */
  markCompleted(): void {
    this.completedAt = Date.now();
  }

  // Serialization
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    return `{"id":"${this.id}","type":${this.type},"entityId":"${this.entityId}","fromOwnerId":"${this.fromOwnerId}","toOwnerId":"${this.toOwnerId}","status":${this.status},"createdAt":${this.createdAt},"expiresAt":${this.expiresAt},"completedAt":${this.completedAt}}`;
  }

  serialize(): Uint8Array {
    const json = this.toJSON();
    const buffer = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) {
      buffer[i] = json.charCodeAt(i);
    }
    return buffer;
  }
}

/**
 * Ownership transfer manager
 */
export class OwnershipTransferManager extends BaseSerializable {
  private pendingTransfers: Map<string, TransferRequest>;
  private completedTransfers: Map<string, TransferRequest>;
  private permissionEvaluator: PermissionEvaluator;
  private transferHandlers: Map<TransferType, (request: TransferRequest) => boolean>;

  constructor() {
    super();
    this.pendingTransfers = new Map<string, TransferRequest>();
    this.completedTransfers = new Map<string, TransferRequest>();
    this.permissionEvaluator = new PermissionEvaluator();
    this.transferHandlers = new Map<TransferType, (request: TransferRequest) => boolean>();
    
    // Register default handlers
    this.registerDefaultHandlers();
  }

  /**
   * Initiate a domain ownership transfer
   */
  initiateDomainTransfer(
    domain: IDomain,
    toOwnerId: IdentityId,
    initiator: IIdentity,
    reason: string,
    requiredApprovals: i32 = 1
  ): TransferRequest | null {
    // Check permissions
    const canTransfer = this.permissionEvaluator.hasPermission(
      initiator.getPermissions().map<string>(p => p.getId()),
      initiator.getRoles(),
      "domain.transfer",
      domain.getId()
    );
    
    if (!canTransfer) {
      globalAuditTrail.logEvent(
        AuditEventType.DOMAIN_OWNERSHIP_TRANSFERRED,
        initiator.getId(),
        "domain",
        domain.getId(),
        "Transfer denied: insufficient permissions",
        AuditSeverity.WARNING
      );
      return null;
    }

    // Create transfer request
    const request = new TransferRequest(
      TransferType.DOMAIN,
      domain.getId(),
      domain.getOwnerId(),
      toOwnerId,
      initiator.getId(),
      reason
    );
    
    request.requiredApprovals = requiredApprovals;
    
    // If initiator is owner, auto-approve
    if (initiator.getId() == domain.getOwnerId()) {
      request.addApproval(initiator.getId(), true);
    }
    
    this.pendingTransfers.set(request.id, request);
    
    // Log audit event
    globalAuditTrail.logEvent(
      AuditEventType.DOMAIN_OWNERSHIP_TRANSFERRED,
      initiator.getId(),
      "domain",
      domain.getId(),
      `Transfer initiated to ${toOwnerId}: ${reason}`
    );
    
    return request;
  }

  /**
   * Initiate an object ownership transfer
   */
  initiateObjectTransfer(
    object: IDomainObject,
    toOwnerId: IdentityId,
    initiator: IIdentity,
    reason: string,
    requiredApprovals: i32 = 1
  ): TransferRequest | null {
    // Check if object is transferable
    if (!object.getProperties().transferable) {
      return null;
    }

    // Check permissions
    const canTransfer = this.permissionEvaluator.hasPermission(
      initiator.getPermissions().map<string>(p => p.getId()),
      initiator.getRoles(),
      "object.transfer",
      object.getDomainId()
    );
    
    if (!canTransfer) {
      globalAuditTrail.logEvent(
        AuditEventType.OBJECT_TRANSFERRED,
        initiator.getId(),
        "object",
        object.getId(),
        "Transfer denied: insufficient permissions",
        AuditSeverity.WARNING
      );
      return null;
    }

    // Create transfer request
    const request = new TransferRequest(
      TransferType.OBJECT,
      object.getId(),
      object.getOwnerId(),
      toOwnerId,
      initiator.getId(),
      reason
    );
    
    request.requiredApprovals = requiredApprovals;
    
    // If initiator is owner, auto-approve
    if (initiator.getId() == object.getOwnerId()) {
      request.addApproval(initiator.getId(), true);
    }
    
    this.pendingTransfers.set(request.id, request);
    
    // Log audit event
    globalAuditTrail.logObjectTransferred(
      initiator.getId(),
      object,
      object.getOwnerId(),
      toOwnerId
    );
    
    return request;
  }

  /**
   * Approve or reject a transfer request
   */
  processApproval(
    requestId: string,
    approver: IIdentity,
    approved: boolean,
    reason: string | null = null
  ): boolean {
    const request = this.pendingTransfers.get(requestId);
    if (!request) {
      return false;
    }

    // Check if request is expired
    if (request.isExpired()) {
      request.status = TransferStatus.EXPIRED;
      this.moveToCompleted(request);
      return false;
    }

    // Check if approver has permission
    const permission = request.type == TransferType.DOMAIN ? "domain.approve_transfer" : "object.approve_transfer";
    const hasPermission = this.permissionEvaluator.hasPermission(
      approver.getPermissions().map<string>(p => p.getId()),
      approver.getRoles(),
      permission,
      request.entityId
    );
    
    if (!hasPermission && approver.getId() != request.fromOwnerId) {
      return false;
    }

    // Add approval
    request.addApproval(approver.getId(), approved);
    
    if (reason) {
      request.metadata.set("approval_reason_" + approver.getId(), reason);
    }

    // Check if we have enough approvals
    if (approved && request.hasRequiredApprovals()) {
      // Execute transfer
      return this.executeTransfer(request);
    } else if (!approved) {
      // Reject transfer
      request.status = TransferStatus.REJECTED;
      this.moveToCompleted(request);
      
      globalAuditTrail.logEvent(
        request.type == TransferType.DOMAIN ? AuditEventType.DOMAIN_OWNERSHIP_TRANSFERRED : AuditEventType.OBJECT_TRANSFERRED,
        approver.getId(),
        request.type == TransferType.DOMAIN ? "domain" : "object",
        request.entityId,
        "Transfer rejected",
        AuditSeverity.INFO
      );
    }

    return true;
  }

  /**
   * Cancel a transfer request
   */
  cancelTransfer(requestId: string, canceller: IIdentity): boolean {
    const request = this.pendingTransfers.get(requestId);
    if (!request) {
      return false;
    }

    // Only initiator or current owner can cancel
    if (canceller.getId() != request.initiatorId && canceller.getId() != request.fromOwnerId) {
      return false;
    }

    request.status = TransferStatus.CANCELLED;
    this.moveToCompleted(request);
    
    globalAuditTrail.logEvent(
      request.type == TransferType.DOMAIN ? AuditEventType.DOMAIN_OWNERSHIP_TRANSFERRED : AuditEventType.OBJECT_TRANSFERRED,
      canceller.getId(),
      request.type == TransferType.DOMAIN ? "domain" : "object",
      request.entityId,
      "Transfer cancelled",
      AuditSeverity.INFO
    );
    
    return true;
  }

  /**
   * Execute the actual transfer
   */
  private executeTransfer(request: TransferRequest): boolean {
    const handler = this.transferHandlers.get(request.type);
    if (!handler) {
      return false;
    }

    const success = handler(request);
    
    if (success) {
      request.status = TransferStatus.COMPLETED;
      request.markCompleted();
      
      globalAuditTrail.logEvent(
        request.type == TransferType.DOMAIN ? AuditEventType.DOMAIN_OWNERSHIP_TRANSFERRED : AuditEventType.OBJECT_TRANSFERRED,
        request.initiatorId,
        request.type == TransferType.DOMAIN ? "domain" : "object",
        request.entityId,
        `Transfer completed from ${request.fromOwnerId} to ${request.toOwnerId}`,
        AuditSeverity.INFO
      );
    } else {
      request.status = TransferStatus.REJECTED;
    }
    
    this.moveToCompleted(request);
    return success;
  }

  /**
   * Move request to completed
   */
  private moveToCompleted(request: TransferRequest): void {
    this.pendingTransfers.delete(request.id);
    this.completedTransfers.set(request.id, request);
  }

  /**
   * Register a transfer handler
   */
  registerTransferHandler(type: TransferType, handler: (request: TransferRequest) => boolean): void {
    this.transferHandlers.set(type, handler);
  }

  /**
   * Register default handlers
   */
  private registerDefaultHandlers(): void {
    // Domain transfer handler
    this.registerTransferHandler(TransferType.DOMAIN, (request: TransferRequest): boolean => {
      // In a real implementation, this would update the domain's owner
      // For now, we'll just return true to indicate success
      return true;
    });

    // Object transfer handler
    this.registerTransferHandler(TransferType.OBJECT, (request: TransferRequest): boolean => {
      // In a real implementation, this would update the object's owner
      // For now, we'll just return true to indicate success
      return true;
    });
  }

  /**
   * Get pending transfers for an identity
   */
  getPendingTransfers(identityId: IdentityId): Array<TransferRequest> {
    const results = new Array<TransferRequest>();
    const transfers = this.pendingTransfers.values();
    
    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];
      if (transfer.fromOwnerId == identityId || 
          transfer.toOwnerId == identityId || 
          transfer.initiatorId == identityId) {
        results.push(transfer);
      }
    }
    
    return results;
  }

  /**
   * Clean up expired transfers
   */
  cleanupExpired(): i32 {
    let cleaned = 0;
    const pendingIds = this.pendingTransfers.keys();
    
    for (let i = 0; i < pendingIds.length; i++) {
      const request = this.pendingTransfers.get(pendingIds[i]);
      if (request && request.isExpired()) {
        request.status = TransferStatus.EXPIRED;
        this.moveToCompleted(request);
        cleaned++;
      }
    }
    
    return cleaned;
  }

  /**
   * Get transfer statistics
   */
  getStats(): Map<string, i32> {
    const stats = new Map<string, i32>();
    stats.set("pending", this.pendingTransfers.size);
    stats.set("completed", this.completedTransfers.size);
    
    // Count by status
    const statusCounts = new Map<string, i32>();
    const completed = this.completedTransfers.values();
    
    for (let i = 0; i < completed.length; i++) {
      const status = completed[i].status;
      const statusString = status.toString();
      const count = statusCounts.has(statusString) ? statusCounts.get(statusString) : 0;
      statusCounts.set(statusString, count + 1);
    }
    
    const statuses = statusCounts.keys();
    for (let i = 0; i < statuses.length; i++) {
      stats.set("status_" + statuses[i], statusCounts.get(statuses[i]));
    }
    
    return stats;
  }

  // Serialization
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    const stats = this.getStats();
    return `{"pending":${stats.get("pending")},"completed":${stats.get("completed")}}`;
  }

  serialize(): Uint8Array {
    const json = this.toJSON();
    const buffer = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) {
      buffer[i] = json.charCodeAt(i);
    }
    return buffer;
  }
}

/**
 * Global transfer manager instance
 */
export const globalTransferManager = new OwnershipTransferManager();