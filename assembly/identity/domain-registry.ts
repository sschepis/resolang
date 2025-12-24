/**
 * Domain Registry for the Prime Resonance Network
 * Manages root domains and domain name resolution
 */

import { IDomain, IIdentity, IPermission } from "./interfaces";
import { DomainId, IdentityId, Timestamp } from "./types";
import { Domain } from "./domain";
import { DomainCreationParams } from "./types";
import { Permission } from "./permissions";
import { globalAuditTrail } from "./audit-trail";
import { AuditEventType, AuditSeverity } from "./audit-trail";
import { PermissionEvaluator } from "./permissions";
import { QuantumPermissionEvaluator } from "./resolang-processor";
import { IdentityQuantumState } from "./resolang-processor";
import { ValidationResult } from "../core/validation";

/**
 * Domain registration record
 */
export class DomainRecord {
  domainId: DomainId;
  name: string;
  parentId: DomainId | null;
  ownerId: IdentityId;
  registeredAt: Timestamp;
  expiresAt: Timestamp | null;
  status: DomainStatus;
  metadata: Map<string, string>;

  constructor(
    domainId: DomainId,
    name: string,
    ownerId: IdentityId,
    parentId: DomainId | null = null,
    expiresAt: Timestamp | null = null
  ) {
    this.domainId = domainId;
    this.name = name;
    this.parentId = parentId;
    this.ownerId = ownerId;
    this.registeredAt = Date.now();
    this.expiresAt = expiresAt;
    this.status = DomainStatus.ACTIVE;
    this.metadata = new Map<string, string>();
  }

  /**
   * Check if domain is expired
   */
  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return Date.now() > this.expiresAt!;
  }

  /**
   * Renew domain registration
   */
  renew(additionalTime: i64): void {
    if (this.expiresAt) {
      this.expiresAt = (this.expiresAt! + additionalTime);
    } else {
      this.expiresAt = Date.now() + additionalTime;
    }
  }

  /**
   * Get full domain path
   */
  getFullPath(registry: DomainRegistry): string {
    const parts = new Array<string>();
    let current: DomainRecord | null = this;
    
    while (current) {
      parts.unshift(current.name);
      if (current.parentId) {
        current = registry.getRecord(current.parentId!);
      } else {
        current = null;
      }
    }
    
    return parts.join(".");
  }
}

/**
 * Domain status
 */
export enum DomainStatus {
  ACTIVE,
  SUSPENDED,
  EXPIRED,
  RESERVED
}

/**
 * Domain name validation rules
 */
export class DomainNameRules {
  static readonly MIN_LENGTH: i32 = 3;
  static readonly MAX_LENGTH: i32 = 63;
  static readonly VALID_CHARS: string = "^[a-z0-9-]+$";
  static readonly RESERVED_NAMES: string[] = [
    "www", "mail", "ftp", "admin", "root", "system",
    "api", "app", "test", "dev", "staging", "prod"
  ];

  /**
   * Validate domain name
   */
  static validate(name: string): ValidationResult {
    // Check length
    if (name.length < this.MIN_LENGTH) {
      return ValidationResult.invalid("Domain name too short");
    }
    if (name.length > this.MAX_LENGTH) {
      return ValidationResult.invalid("Domain name too long");
    }

    // Check characters (simple validation for AssemblyScript)
    for (let i = 0; i < name.length; i++) {
      const char = name.charAt(i);
      if (!((char >= 'a' && char <= 'z') ||
            (char >= '0' && char <= '9') ||
            char == '-')) {
        return ValidationResult.invalid("Invalid characters in domain name");
      }
    }

    // Check format
    if (name.startsWith("-") || name.endsWith("-")) {
      return ValidationResult.invalid("Domain name cannot start or end with hyphen");
    }

    // Check reserved names
    if (this.RESERVED_NAMES.includes(name)) {
      return ValidationResult.invalid("Domain name is reserved");
    }

    return ValidationResult.valid();
  }
}

/**
 * Domain registry for managing all domains
 */
export class DomainRegistry {
  private records: Map<DomainId, DomainRecord>;
  private nameIndex: Map<string, DomainId>; // Full path -> ID
  private ownerIndex: Map<IdentityId, Array<DomainId>>;
  private domainStore: Map<DomainId, IDomain>;
  private permissionEvaluator: PermissionEvaluator;
  private quantumEvaluator: QuantumPermissionEvaluator;
  private registrationFee: i64;
  private renewalFee: i64;
  private defaultExpiration: i64;

  constructor(
    domainStore: Map<DomainId, IDomain>,
    registrationFee: i64 = 1000,
    renewalFee: i64 = 500,
    defaultExpiration: i64 = 31536000000 // 1 year in ms
  ) {
    this.records = new Map<DomainId, DomainRecord>();
    this.nameIndex = new Map<string, DomainId>();
    this.ownerIndex = new Map<IdentityId, Array<DomainId>>();
    this.domainStore = domainStore;
    this.permissionEvaluator = new PermissionEvaluator();
    this.quantumEvaluator = new QuantumPermissionEvaluator();
    this.registrationFee = registrationFee;
    this.renewalFee = renewalFee;
    this.defaultExpiration = defaultExpiration;
  }

  /**
   * Register a root domain
   */
  registerRootDomain(
    name: string,
    ownerId: IdentityId,
    registrarId: IdentityId
  ): Domain {
    // Validate name
    const validation = DomainNameRules.validate(name);
    if (!validation.valid) {
      throw new Error("Invalid domain name: " + validation.getErrorMessages().join(", "));
    }

    // Check if name is available
    if (this.nameIndex.has(name)) {
      throw new Error("Domain name already registered");
    }

    // Verify registrar has permission
    const registrar = this.getIdentity(registrarId);
    if (!registrar) {
      throw new Error("Registrar identity not found");
    }

    // For now, assume registrar has permission if they exist
    // In a real implementation, this would check against actual permissions
    const hasPermission = true;

    if (!hasPermission) {
      throw new Error("Registrar does not have permission to register root domains");
    }

    // Create domain
    const params = new DomainCreationParams(name, ownerId);
    const domain = new Domain(params);
    const domainId = domain.getId();

    // Create registration record
    const record = new DomainRecord(
      domainId,
      name,
      ownerId,
      null,
      Date.now() + this.defaultExpiration
    );

    // Store domain and record
    this.domainStore.set(domainId, domain);
    this.records.set(domainId, record);
    this.nameIndex.set(name, domainId);

    // Update owner index
    if (!this.ownerIndex.has(ownerId)) {
      this.ownerIndex.set(ownerId, new Array<DomainId>());
    }
    this.ownerIndex.get(ownerId)!.push(domainId);

    // Log registration
    globalAuditTrail.logEvent(
      AuditEventType.DOMAIN_CREATED,
      registrarId,
      "domain",
      domainId,
      "Root domain registered: " + name,
      AuditSeverity.INFO
    );

    return domain;
  }

  /**
   * Register a subdomain
   */
  registerSubdomain(
    name: string,
    parentDomainId: DomainId,
    ownerId: IdentityId,
    actorId: IdentityId
  ): Domain {
    // Validate name
    const validation = DomainNameRules.validate(name);
    if (!validation.valid) {
      throw new Error("Invalid domain name: " + validation.getErrorMessages().join(", "));
    }

    // Get parent domain
    const parentDomain = this.domainStore.get(parentDomainId);
    if (!parentDomain) {
      throw new Error("Parent domain not found");
    }

    const parentRecord = this.records.get(parentDomainId);
    if (!parentRecord) {
      throw new Error("Parent domain record not found");
    }

    // Check if parent is active
    if (parentRecord.status != DomainStatus.ACTIVE || parentRecord.isExpired()) {
      throw new Error("Parent domain is not active");
    }

    // Build full path
    const fullPath = name + "." + parentRecord.getFullPath(this);

    // Check if name is available
    if (this.nameIndex.has(fullPath)) {
      throw new Error("Subdomain already exists");
    }

    // Verify actor has permission
    const actor = this.getIdentity(actorId);
    if (!actor) {
      throw new Error("Actor identity not found");
    }

    // Use quantum evaluator for permission check
    const actorState = new IdentityQuantumState(actor);
    const hasPermission = this.quantumEvaluator.evaluatePermission(
      actorState,
      "domain.create_subdomain",
      parentDomainId
    );

    if (!hasPermission && actorId != parentDomain.getOwnerId()) {
      throw new Error("Actor does not have permission to create subdomains");
    }

    // Create subdomain
    const subdomain = parentDomain.createSubdomain(name, ownerId);
    const subdomainId = subdomain.getId();

    // Create registration record
    const record = new DomainRecord(
      subdomainId,
      name,
      ownerId,
      parentDomainId,
      parentRecord.expiresAt // Inherit parent expiration
    );

    // Store subdomain and record
    this.domainStore.set(subdomainId, subdomain);
    this.records.set(subdomainId, record);
    this.nameIndex.set(fullPath, subdomainId);

    // Update owner index
    if (!this.ownerIndex.has(ownerId)) {
      this.ownerIndex.set(ownerId, new Array<DomainId>());
    }
    this.ownerIndex.get(ownerId)!.push(subdomainId);

    // Log registration
    globalAuditTrail.logEvent(
      AuditEventType.DOMAIN_CREATED,
      actorId,
      "domain",
      subdomainId,
      "Subdomain registered: " + fullPath,
      AuditSeverity.INFO
    );

    return subdomain as Domain;
  }

  /**
   * Resolve domain name to ID
   */
  resolveName(fullPath: string): DomainId | null {
    return this.nameIndex.has(fullPath) ? this.nameIndex.get(fullPath)! : null;
  }

  /**
   * Get domain record
   */
  getRecord(domainId: DomainId): DomainRecord | null {
    return this.records.has(domainId) ? this.records.get(domainId)! : null;
  }

  /**
   * Get domains owned by identity
   */
  getDomainsOwnedBy(ownerId: IdentityId): Array<DomainRecord> {
    const domainIds = this.ownerIndex.get(ownerId);
    if (!domainIds) return new Array<DomainRecord>();

    const records = new Array<DomainRecord>();
    for (let i = 0; i < domainIds.length; i++) {
      const record = this.records.get(domainIds[i]);
      if (record && record.status == DomainStatus.ACTIVE) {
        records.push(record);
      }
    }

    return records;
  }

  /**
   * Transfer domain ownership
   */
  transferDomain(
    domainId: DomainId,
    newOwnerId: IdentityId,
    actorId: IdentityId
  ): void {
    const record = this.records.get(domainId);
    if (!record) {
      throw new Error("Domain record not found");
    }

    const domain = this.domainStore.get(domainId);
    if (!domain) {
      throw new Error("Domain not found");
    }

    // Verify actor is current owner
    if (actorId != record.ownerId) {
      throw new Error("Only domain owner can transfer ownership");
    }

    // Update owner index
    const oldOwnerDomains = this.ownerIndex.get(record.ownerId);
    if (oldOwnerDomains) {
      const index = oldOwnerDomains.indexOf(domainId);
      if (index >= 0) {
        oldOwnerDomains.splice(index, 1);
      }
    }

    if (!this.ownerIndex.has(newOwnerId)) {
      this.ownerIndex.set(newOwnerId, new Array<DomainId>());
    }
    this.ownerIndex.get(newOwnerId)!.push(domainId);

    // Update record
    const oldOwnerId = record.ownerId;
    record.ownerId = newOwnerId;

    // Update domain
    domain.transferOwnership(newOwnerId, actorId);

    // Log transfer
    globalAuditTrail.logEvent(
      AuditEventType.DOMAIN_OWNERSHIP_TRANSFERRED,
      actorId,
      "domain",
      domainId,
      "Domain transferred from " + oldOwnerId + " to " + newOwnerId,
      AuditSeverity.WARNING
    );
  }

  /**
   * Renew domain registration
   */
  renewDomain(
    domainId: DomainId,
    actorId: IdentityId,
    additionalTime: i64 = 0
  ): void {
    const record = this.records.get(domainId);
    if (!record) {
      throw new Error("Domain record not found");
    }

    // Verify actor is owner
    if (actorId != record.ownerId) {
      throw new Error("Only domain owner can renew registration");
    }

    // Check if domain can be renewed
    if (record.status != DomainStatus.ACTIVE && record.status != DomainStatus.EXPIRED) {
      throw new Error("Domain cannot be renewed in current status");
    }

    // Renew domain
    const renewalTime = additionalTime > 0 ? additionalTime : this.defaultExpiration;
    record.renew(renewalTime);

    // Reactivate if expired
    if (record.status == DomainStatus.EXPIRED) {
      record.status = DomainStatus.ACTIVE;
    }

    // Log renewal
    globalAuditTrail.logEvent(
      AuditEventType.DOMAIN_UPDATED,
      actorId,
      "domain",
      domainId,
      "Domain renewed until " + record.expiresAt!.toString(),
      AuditSeverity.INFO
    );
  }

  /**
   * Suspend domain
   */
  suspendDomain(
    domainId: DomainId,
    reason: string,
    actorId: IdentityId
  ): void {
    const record = this.records.get(domainId);
    if (!record) {
      throw new Error("Domain record not found");
    }

    // Verify actor has permission
    const actor = this.getIdentity(actorId);
    if (!actor) {
      throw new Error("Actor identity not found");
    }

    // For now, assume actor has permission if they exist
    // In a real implementation, this would check against actual permissions
    const hasPermission = true;

    if (!hasPermission) {
      throw new Error("Actor does not have permission to suspend domains");
    }

    // Suspend domain
    record.status = DomainStatus.SUSPENDED;
    record.metadata.set("suspension_reason", reason);
    record.metadata.set("suspended_by", actorId);

    // Log suspension
    globalAuditTrail.logEvent(
      AuditEventType.DOMAIN_UPDATED,
      actorId,
      "domain",
      domainId,
      "Domain suspended: " + reason,
      AuditSeverity.WARNING
    );
  }

  /**
   * Check for and update expired domains
   */
  checkExpirations(): Array<DomainId> {
    const expiredDomains = new Array<DomainId>();
    const records = this.records.values();
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (record.status == DomainStatus.ACTIVE && record.isExpired()) {
        record.status = DomainStatus.EXPIRED;
        expiredDomains.push(record.domainId);
        
        globalAuditTrail.logEvent(
          AuditEventType.DOMAIN_UPDATED,
          "system",
          "domain",
          record.domainId,
          "Domain expired",
          AuditSeverity.WARNING
        );
      }
    }
    
    return expiredDomains;
  }

  /**
   * Get identity (placeholder)
   */
  private getIdentity(identityId: IdentityId): IIdentity | null {
    // In a real implementation, this would fetch the identity from a store
    return null;
  }

  /**
   * Reserve a domain name
   */
  reserveDomain(name: string, ownerId: IdentityId, actorId: IdentityId): void {
    const validation = DomainNameRules.validate(name);
    if (!validation.valid) {
      throw new Error("Invalid domain name: " + validation.getErrorMessages().join(", "));
    }

    if (this.nameIndex.has(name)) {
      throw new Error("Domain name already exists");
    }

    const domainId = "reserved-" + name;
    const record = new DomainRecord(domainId, name, ownerId);
    record.status = DomainStatus.RESERVED;

    this.records.set(domainId, record);
    this.nameIndex.set(name, domainId);

    // Log reservation
    globalAuditTrail.logEvent(
      AuditEventType.DOMAIN_CREATED,
      actorId,
      "domain",
      domainId,
      "Domain reserved: " + name,
      AuditSeverity.INFO
    );
  }
}