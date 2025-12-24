/**
 * Audit Trail System for the Prime Resonance Network
 * Tracks all state changes for compliance and security
 */

import { IIdentity, IDomain, IDomainObject } from "./interfaces";
import { IdentityId, DomainId, ObjectId, Timestamp } from "./types";
import { BaseSerializable } from "../core/interfaces";
import { JSONBuilder } from "../core/serialization";

/**
 * Types of auditable events
 */
export enum AuditEventType {
  // Identity events
  IDENTITY_CREATED,
  IDENTITY_UPDATED,
  IDENTITY_KYC_CHANGED,
  IDENTITY_DEACTIVATED,
  IDENTITY_REACTIVATED,
  
  // Domain events
  DOMAIN_CREATED,
  DOMAIN_UPDATED,
  DOMAIN_MEMBER_ADDED,
  DOMAIN_MEMBER_REMOVED,
  DOMAIN_OWNERSHIP_TRANSFERRED,
  
  // Object events
  OBJECT_CREATED,
  OBJECT_UPDATED,
  OBJECT_TRANSFERRED,
  OBJECT_DESTROYED,
  
  // Permission events
  PERMISSION_GRANTED,
  PERMISSION_REVOKED,
  ROLE_ASSIGNED,
  ROLE_REMOVED,
  
  // Authentication events
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_FAILED,
  AUTH_SESSION_EXPIRED,
  
  // Network events
  NODE_CONNECTED,
  NODE_DISCONNECTED,
  SYNC_STARTED,
  SYNC_COMPLETED,
  SYNC_FAILED
}

/**
 * Audit event severity levels
 */
export enum AuditSeverity {
  INFO,
  WARNING,
  ERROR,
  CRITICAL
}

/**
 * Audit trail entry
 */
export class AuditEntry extends BaseSerializable {
  id: string;
  timestamp: Timestamp;
  eventType: AuditEventType;
  severity: AuditSeverity;
  actorId: string; // Identity that performed the action
  targetType: string; // "identity", "domain", "object", etc.
  targetId: string; // ID of the affected entity
  action: string; // Description of the action
  previousValue: string | null; // Serialized previous state
  newValue: string | null; // Serialized new state
  metadata: Map<string, string>; // Additional context
  ipAddress: string | null;
  userAgent: string | null;

  constructor(
    eventType: AuditEventType,
    actorId: string,
    targetType: string,
    targetId: string,
    action: string
  ) {
    super();
    this.id = "audit-" + Date.now().toString() + "-" + Math.random().toString();
    this.timestamp = f64(Date.now());
    this.eventType = eventType;
    this.severity = AuditSeverity.INFO;
    this.actorId = actorId;
    this.targetType = targetType;
    this.targetId = targetId;
    this.action = action;
    this.previousValue = null;
    this.newValue = null;
    this.metadata = new Map<string, string>();
    this.ipAddress = null;
    this.userAgent = null;
  }

  /**
   * Set the severity level
   */
  setSeverity(severity: AuditSeverity): void {
    this.severity = severity;
  }

  /**
   * Set state change values
   */
  setStateChange(previousValue: string | null, newValue: string | null): void {
    this.previousValue = previousValue;
    this.newValue = newValue;
  }

  /**
   * Add metadata
   */
  addMetadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  /**
   * Set request context
   */
  setRequestContext(ipAddress: string | null, userAgent: string | null): void {
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
  }

  // Serialization
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    let json = `{"id":"${this.id}","timestamp":${this.timestamp},"eventType":${this.eventType},"severity":${this.severity},"actorId":"${this.actorId}","targetType":"${this.targetType}","targetId":"${this.targetId}","action":"${this.action}"`;
    
    if (this.previousValue) {
      json += `,"previousValue":${this.previousValue}`;
    }
    if (this.newValue) {
      json += `,"newValue":${this.newValue}`;
    }
    if (this.ipAddress) {
      json += `,"ipAddress":"${this.ipAddress}"`;
    }
    if (this.userAgent) {
      json += `,"userAgent":"${this.userAgent}"`;
    }
    
    json += "}";
    return json;
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
 * Audit trail manager
 */
export class AuditTrailManager extends BaseSerializable {
  private entries: Array<AuditEntry>;
  private maxEntries: i32;
  private retentionDays: i32;
  private listeners: Array<(entry: AuditEntry) => void>;

  constructor(maxEntries: i32 = 1000000, retentionDays: i32 = 365) {
    super();
    this.entries = new Array<AuditEntry>();
    this.maxEntries = maxEntries;
    this.retentionDays = retentionDays;
    this.listeners = new Array<(entry: AuditEntry) => void>();
  }

  /**
   * Log an audit event
   */
  logEvent(
    eventType: AuditEventType,
    actorId: string,
    targetType: string,
    targetId: string,
    action: string,
    severity: AuditSeverity = AuditSeverity.INFO
  ): AuditEntry {
    const entry = new AuditEntry(eventType, actorId, targetType, targetId, action);
    entry.setSeverity(severity);
    
    this.addEntry(entry);
    return entry;
  }

  /**
   * Log identity creation
   */
  logIdentityCreated(actorId: string, identity: IIdentity): void {
    const entry = this.logEvent(
      AuditEventType.IDENTITY_CREATED,
      actorId,
      "identity",
      identity.getId(),
      `Created ${identity.getType()} identity`
    );
    entry.setStateChange(null, identity.toJSON());
  }

  /**
   * Log identity update
   */
  logIdentityUpdated(actorId: string, identity: IIdentity, previousState: string): void {
    const entry = this.logEvent(
      AuditEventType.IDENTITY_UPDATED,
      actorId,
      "identity",
      identity.getId(),
      "Updated identity"
    );
    entry.setStateChange(previousState, identity.toJSON());
  }

  /**
   * Log KYC level change
   */
  logKYCChanged(actorId: string, identity: IIdentity, previousLevel: i32, newLevel: i32): void {
    const entry = this.logEvent(
      AuditEventType.IDENTITY_KYC_CHANGED,
      actorId,
      "identity",
      identity.getId(),
      `KYC level changed from ${previousLevel} to ${newLevel}`
    );
    entry.addMetadata("previousLevel", previousLevel.toString());
    entry.addMetadata("newLevel", newLevel.toString());
  }

  /**
   * Log domain creation
   */
  logDomainCreated(actorId: string, domain: IDomain): void {
    const entry = this.logEvent(
      AuditEventType.DOMAIN_CREATED,
      actorId,
      "domain",
      domain.getId(),
      `Created domain ${domain.getName()}`
    );
    entry.setStateChange(null, domain.toJSON());
  }

  /**
   * Log domain member addition
   */
  logDomainMemberAdded(actorId: string, domain: IDomain, memberId: string): void {
    const entry = this.logEvent(
      AuditEventType.DOMAIN_MEMBER_ADDED,
      actorId,
      "domain",
      domain.getId(),
      `Added member ${memberId} to domain`
    );
    entry.addMetadata("memberId", memberId);
  }

  /**
   * Log object creation
   */
  logObjectCreated(actorId: string, object: IDomainObject): void {
    const entry = this.logEvent(
      AuditEventType.OBJECT_CREATED,
      actorId,
      "object",
      object.getId(),
      `Created ${object.getType()} object`
    );
    entry.setStateChange(null, object.toJSON());
  }

  /**
   * Log object transfer
   */
  logObjectTransferred(actorId: string, object: IDomainObject, previousOwnerId: string, newOwnerId: string): void {
    const entry = this.logEvent(
      AuditEventType.OBJECT_TRANSFERRED,
      actorId,
      "object",
      object.getId(),
      `Transferred object from ${previousOwnerId} to ${newOwnerId}`
    );
    entry.addMetadata("previousOwnerId", previousOwnerId);
    entry.addMetadata("newOwnerId", newOwnerId);
  }

  /**
   * Log permission grant
   */
  logPermissionGranted(actorId: string, targetId: string, permission: string, resource: string | null): void {
    const entry = this.logEvent(
      AuditEventType.PERMISSION_GRANTED,
      actorId,
      "identity",
      targetId,
      `Granted permission ${permission}`
    );
    entry.addMetadata("permission", permission);
    if (resource) {
      entry.addMetadata("resource", resource);
    }
  }

  /**
   * Log authentication event
   */
  logAuthEvent(eventType: AuditEventType, identityId: string, success: boolean, metadata: Map<string, string> | null = null): void {
    const severity = success ? AuditSeverity.INFO : AuditSeverity.WARNING;
    const action = eventType == AuditEventType.AUTH_LOGIN ? "Login attempt" :
                   eventType == AuditEventType.AUTH_LOGOUT ? "Logout" :
                   eventType == AuditEventType.AUTH_FAILED ? "Failed authentication" :
                   "Session expired";
    
    const entry = this.logEvent(
      eventType,
      identityId,
      "identity",
      identityId,
      action,
      severity
    );
    
    if (metadata) {
      const keys = metadata.keys();
      for (let i = 0; i < keys.length; i++) {
        entry.addMetadata(keys[i], metadata.get(keys[i]));
      }
    }
  }

  /**
   * Add an entry to the trail
   */
  private addEntry(entry: AuditEntry): void {
    this.entries.push(entry);
    
    // Enforce max entries limit
    if (this.entries.length > this.maxEntries) {
      this.entries.shift(); // Remove oldest entry
    }
    
    // Notify listeners
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](entry);
    }
  }

  /**
   * Query audit entries
   */
  query(
    eventType: AuditEventType | null = null,
    actorId: string | null = null,
    targetId: string | null = null,
    startTime: Timestamp | null = null,
    endTime: Timestamp | null = null,
    limit: i32 = 100
  ): Array<AuditEntry> {
    const results = new Array<AuditEntry>();
    
    for (let i = this.entries.length - 1; i >= 0 && results.length < limit; i--) {
      const entry = this.entries[i];
      
      // Apply filters
      if (eventType && entry.eventType != eventType) continue;
      if (actorId && entry.actorId != actorId) continue;
      if (targetId && entry.targetId != targetId) continue;
      if (startTime && entry.timestamp < startTime) continue;
      if (endTime && entry.timestamp > endTime) continue;
      
      results.push(entry);
    }
    
    return results;
  }

  /**
   * Get entries for a specific entity
   */
  getEntityHistory(entityType: string, entityId: string, limit: i32 = 50): Array<AuditEntry> {
    return this.query(null, null, entityId, null, null, limit);
  }

  /**
   * Clean up old entries
   */
  cleanup(): i32 {
    const cutoffTime = Date.now() - (this.retentionDays * 24 * 60 * 60 * 1000);
    let removed = 0;
    
    while (this.entries.length > 0 && this.entries[0].timestamp < cutoffTime) {
      this.entries.shift();
      removed++;
    }
    
    return removed;
  }

  /**
   * Add an event listener
   */
  addListener(listener: (entry: AuditEntry) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Get statistics
   */
  getStats(): Map<string, i32> {
    const stats = new Map<string, i32>();
    stats.set("total_entries", this.entries.length);
    
    // Count by event type
    const eventCounts = new Map<string, i32>();
    for (let i = 0; i < this.entries.length; i++) {
      const eventType = this.entries[i].eventType.toString();
      const count = eventCounts.has(eventType) ? eventCounts.get(eventType) : 0;
      eventCounts.set(eventType, count + 1);
    }
    
    // Add event counts to stats
    const eventTypes = eventCounts.keys();
    for (let i = 0; i < eventTypes.length; i++) {
      stats.set("event_" + eventTypes[i], eventCounts.get(eventTypes[i]));
    }
    
    return stats;
  }

  // Serialization
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    return `{"entries":${this.entries.length},"maxEntries":${this.maxEntries},"retentionDays":${this.retentionDays}}`;
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
 * Global audit trail instance
 */
export const globalAuditTrail = new AuditTrailManager();

/**
 * Helper function to log an event with context
 */
export function auditLog(
  eventType: AuditEventType,
  actorId: string,
  targetType: string,
  targetId: string,
  action: string,
  metadata: Map<string, string> | null = null
): void {
  const entry = globalAuditTrail.logEvent(
    eventType,
    actorId,
    targetType,
    targetId,
    action
  );
  
  if (metadata) {
    const keys = metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      entry.addMetadata(keys[i], metadata.get(keys[i]));
    }
  }
}