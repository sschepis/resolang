/**
 * Type definitions and utility types for the Identity and Domain System
 */

import { IIdentity, IPermission, PermissionScope } from "./interfaces";

/**
 * Identity ID type for better type safety
 */
export type IdentityId = string;

/**
 * Domain ID type for better type safety
 */
export type DomainId = string;

/**
 * Object ID type for better type safety
 */
export type ObjectId = string;

/**
 * Timestamp type
 */
export type Timestamp = f64;

/**
 * Identity creation parameters
 */
export class IdentityCreationParams {
  type: string;
  kycLevel: i32;
  metadata: Map<string, string>;
  creatorId: string | null; // null for self-sovereign
  domainId: string | null;  // null for global identities

  constructor() {
    this.type = "self_sovereign";
    this.kycLevel = 0;
    this.metadata = new Map<string, string>();
    this.creatorId = null;
    this.domainId = null;
  }
}

/**
 * Domain creation parameters
 */
export class DomainCreationParams {
  name: string;
  ownerId: string;
  parentId: string | null;
  metadata: Map<string, string>;
  requiredKYCLevel: i32;

  constructor(name: string, ownerId: string) {
    this.name = name;
    this.ownerId = ownerId;
    this.parentId = null;
    this.metadata = new Map<string, string>();
    this.requiredKYCLevel = 0;
  }
}

/**
 * Object creation parameters
 */
export class ObjectCreationParams {
  type: string;
  ownerId: string;
  domainId: string;
  fungible: boolean;
  transferable: boolean;
  destructible: boolean;
  data: Map<string, string>;

  constructor(type: string, ownerId: string, domainId: string) {
    this.type = type;
    this.ownerId = ownerId;
    this.domainId = domainId;
    this.fungible = false;
    this.transferable = true;
    this.destructible = true;
    this.data = new Map<string, string>();
  }
}

/**
 * Transfer request for ownership changes
 */
export class TransferRequest {
  targetId: string;
  targetType: string; // "domain" or "object"
  fromOwnerId: string;
  toOwnerId: string;
  requesterId: string;
  reason: string;
  timestamp: Timestamp;
  signatures: Map<string, string>;

  constructor(
    targetId: string,
    targetType: string,
    fromOwnerId: string,
    toOwnerId: string,
    requesterId: string
  ) {
    this.targetId = targetId;
    this.targetType = targetType;
    this.fromOwnerId = fromOwnerId;
    this.toOwnerId = toOwnerId;
    this.requesterId = requesterId;
    this.reason = "";
    this.timestamp = Date.now();
    this.signatures = new Map<string, string>();
  }
}

/**
 * Permission grant/revoke request
 */
export class PermissionRequest {
  identityId: string;
  permissionId: string;
  domainId: string | null;
  action: string; // "grant" or "revoke"
  grantedBy: string;
  expiresAt: Timestamp | null;
  conditions: Map<string, string>;

  constructor(
    identityId: string,
    permissionId: string,
    action: string,
    grantedBy: string
  ) {
    this.identityId = identityId;
    this.permissionId = permissionId;
    this.action = action;
    this.grantedBy = grantedBy;
    this.domainId = null;
    this.expiresAt = null;
    this.conditions = new Map<string, string>();
  }
}

/**
 * Authentication credentials
 */
export class AuthCredentials {
  identityId: string;
  method: string; // "password", "signature", "biometric", etc.
  credential: string;
  metadata: Map<string, string>;

  constructor(identityId: string, method: string, credential: string) {
    this.identityId = identityId;
    this.method = method;
    this.credential = credential;
    this.metadata = new Map<string, string>();
  }
}

/**
 * Authentication result
 */
export class AuthResult {
  success: boolean;
  sessionId: string | null;
  identityId: string | null;
  expiresAt: Timestamp | null;
  failureReason: string | null;

  constructor(success: boolean) {
    this.success = success;
    this.sessionId = null;
    this.identityId = null;
    this.expiresAt = null;
    this.failureReason = null;
  }
}

/**
 * Recovery request for identity recovery
 */
export class RecoveryRequest {
  identityId: string;
  method: string;
  initiatorId: string;
  requiredSignatures: i32;
  collectedSignatures: Map<string, string>;
  expiresAt: Timestamp;
  metadata: Map<string, string>;

  constructor(
    identityId: string,
    method: string,
    initiatorId: string,
    requiredSignatures: i32
  ) {
    this.identityId = identityId;
    this.method = method;
    this.initiatorId = initiatorId;
    this.requiredSignatures = requiredSignatures;
    this.collectedSignatures = new Map<string, string>();
    this.expiresAt = Date.now() + 86400000; // 24 hours default
    this.metadata = new Map<string, string>();
  }
}

/**
 * Global permissions registry
 */
export class GlobalPermissions {
  // Identity permissions
  static readonly IDENTITY_CREATE: string = "identity.create";
  static readonly IDENTITY_UPDATE: string = "identity.update";
  static readonly IDENTITY_DELETE: string = "identity.delete";
  static readonly IDENTITY_VIEW: string = "identity.view";
  static readonly IDENTITY_VERIFY_KYC: string = "identity.verify_kyc";
  
  // Domain permissions
  static readonly DOMAIN_CREATE: string = "domain.create";
  static readonly DOMAIN_UPDATE: string = "domain.update";
  static readonly DOMAIN_DELETE: string = "domain.delete";
  static readonly DOMAIN_TRANSFER: string = "domain.transfer";
  static readonly DOMAIN_ADD_MEMBER: string = "domain.add_member";
  static readonly DOMAIN_REMOVE_MEMBER: string = "domain.remove_member";
  static readonly DOMAIN_CREATE_SUBDOMAIN: string = "domain.create_subdomain";
  
  // Object permissions
  static readonly OBJECT_CREATE: string = "object.create";
  static readonly OBJECT_UPDATE: string = "object.update";
  static readonly OBJECT_DELETE: string = "object.delete";
  static readonly OBJECT_TRANSFER: string = "object.transfer";
  static readonly OBJECT_VIEW: string = "object.view";
  
  // Permission management
  static readonly PERMISSION_GRANT: string = "permission.grant";
  static readonly PERMISSION_REVOKE: string = "permission.revoke";
  static readonly PERMISSION_CREATE: string = "permission.create";
  
  // Role management
  static readonly ROLE_CREATE: string = "role.create";
  static readonly ROLE_UPDATE: string = "role.update";
  static readonly ROLE_DELETE: string = "role.delete";
  static readonly ROLE_ASSIGN: string = "role.assign";
  static readonly ROLE_UNASSIGN: string = "role.unassign";
  
  // System permissions
  static readonly SYSTEM_ADMIN: string = "system.admin";
  static readonly SYSTEM_AUDIT_VIEW: string = "system.audit_view";
  static readonly SYSTEM_REGISTRY_MANAGE: string = "system.registry_manage";
}

/**
 * Default system roles
 */
export class SystemRoles {
  static readonly SUPER_ADMIN: string = "system.super_admin";
  static readonly DOMAIN_OWNER: string = "domain.owner";
  static readonly DOMAIN_ADMIN: string = "domain.admin";
  static readonly DOMAIN_MEMBER: string = "domain.member";
  static readonly IDENTITY_VERIFIER: string = "identity.verifier";
  static readonly AUDITOR: string = "system.auditor";
}

/**
 * Error codes for identity system
 */
export class IdentityErrorCode {
  static readonly IDENTITY_NOT_FOUND: string = "IDENTITY_NOT_FOUND";
  static readonly IDENTITY_ALREADY_EXISTS: string = "IDENTITY_ALREADY_EXISTS";
  static readonly IDENTITY_INACTIVE: string = "IDENTITY_INACTIVE";
  static readonly INSUFFICIENT_PERMISSIONS: string = "INSUFFICIENT_PERMISSIONS";
  static readonly INVALID_CREDENTIALS: string = "INVALID_CREDENTIALS";
  static readonly SESSION_EXPIRED: string = "SESSION_EXPIRED";
  static readonly KYC_VERIFICATION_FAILED: string = "KYC_VERIFICATION_FAILED";
  static readonly DOMAIN_NOT_FOUND: string = "DOMAIN_NOT_FOUND";
  static readonly DOMAIN_ALREADY_EXISTS: string = "DOMAIN_ALREADY_EXISTS";
  static readonly OBJECT_NOT_FOUND: string = "OBJECT_NOT_FOUND";
  static readonly OBJECT_NOT_TRANSFERABLE: string = "OBJECT_NOT_TRANSFERABLE";
  static readonly OBJECT_NOT_DESTRUCTIBLE: string = "OBJECT_NOT_DESTRUCTIBLE";
  static readonly INVALID_TRANSFER_REQUEST: string = "INVALID_TRANSFER_REQUEST";
  static readonly RECOVERY_THRESHOLD_NOT_MET: string = "RECOVERY_THRESHOLD_NOT_MET";
  static readonly INVALID_SIGNATURE: string = "INVALID_SIGNATURE";
}

/**
 * Event types for audit logging
 */
export class IdentityEventType {
  static readonly IDENTITY_CREATED: string = "identity.created";
  static readonly IDENTITY_UPDATED: string = "identity.updated";
  static readonly IDENTITY_DEACTIVATED: string = "identity.deactivated";
  static readonly IDENTITY_REACTIVATED: string = "identity.reactivated";
  static readonly IDENTITY_KYC_VERIFIED: string = "identity.kyc_verified";
  static readonly DOMAIN_CREATED: string = "domain.created";
  static readonly DOMAIN_TRANSFERRED: string = "domain.transferred";
  static readonly DOMAIN_MEMBER_ADDED: string = "domain.member_added";
  static readonly DOMAIN_MEMBER_REMOVED: string = "domain.member_removed";
  static readonly OBJECT_CREATED: string = "object.created";
  static readonly OBJECT_TRANSFERRED: string = "object.transferred";
  static readonly OBJECT_DESTROYED: string = "object.destroyed";
  static readonly PERMISSION_GRANTED: string = "permission.granted";
  static readonly PERMISSION_REVOKED: string = "permission.revoked";
  static readonly ROLE_ASSIGNED: string = "role.assigned";
  static readonly ROLE_UNASSIGNED: string = "role.unassigned";
  static readonly SESSION_CREATED: string = "session.created";
  static readonly SESSION_EXPIRED: string = "session.expired";
  static readonly RECOVERY_INITIATED: string = "recovery.initiated";
  static readonly RECOVERY_COMPLETED: string = "recovery.completed";
}

/**
 * Permission builder for creating complex permissions
 */
export class PermissionBuilder {
  private id: string;
  private name: string;
  private description: string;
  private scope: PermissionScope;
  private implications: string[];
  private conditions: Map<string, string>;

  constructor(id: string) {
    this.id = id;
    this.name = "";
    this.description = "";
    this.scope = PermissionScope.GLOBAL;
    this.implications = [];
    this.conditions = new Map<string, string>();
  }

  withName(name: string): PermissionBuilder {
    this.name = name;
    return this;
  }

  withDescription(description: string): PermissionBuilder {
    this.description = description;
    return this;
  }

  withScope(scope: PermissionScope): PermissionBuilder {
    this.scope = scope;
    return this;
  }

  implies(permissionId: string): PermissionBuilder {
    this.implications.push(permissionId);
    return this;
  }

  withCondition(key: string, value: string): PermissionBuilder {
    this.conditions.set(key, value);
    return this;
  }

  build(): PermissionDefinition {
    return new PermissionDefinition(
      this.id,
      this.name,
      this.description,
      this.scope,
      this.implications,
      this.conditions
    );
  }
}

/**
 * Permission definition
 */
export class PermissionDefinition {
  id: string;
  name: string;
  description: string;
  scope: PermissionScope;
  implications: string[];
  conditions: Map<string, string>;

  constructor(
    id: string,
    name: string,
    description: string,
    scope: PermissionScope,
    implications: string[],
    conditions: Map<string, string>
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.scope = scope;
    this.implications = implications;
    this.conditions = conditions;
  }
}

/**
 * Access control decision
 */
export class AccessDecision {
  allowed: boolean;
  reason: string;
  requiredPermissions: string[];
  missingPermissions: string[];

  constructor(allowed: boolean) {
    this.allowed = allowed;
    this.reason = "";
    this.requiredPermissions = [];
    this.missingPermissions = [];
  }

  static allow(): AccessDecision {
    const decision = new AccessDecision(true);
    decision.reason = "Access granted";
    return decision;
  }

  static deny(reason: string, missingPermissions: string[] = []): AccessDecision {
    const decision = new AccessDecision(false);
    decision.reason = reason;
    decision.missingPermissions = missingPermissions;
    return decision;
  }
}

/**
 * Identity metadata keys
 */
export class IdentityMetadataKey {
  static readonly EMAIL: string = "email";
  static readonly PHONE: string = "phone";
  static readonly FULL_NAME: string = "full_name";
  static readonly COUNTRY: string = "country";
  static readonly CREATED_BY: string = "created_by";
  static readonly MANAGED_BY: string = "managed_by";
  static readonly PRIME_NODE_ID: string = "prime_node_id";
  static readonly PUBLIC_KEY: string = "public_key";
  static readonly RECOVERY_EMAIL: string = "recovery_email";
  static readonly RECOVERY_PHONE: string = "recovery_phone";
}

/**
 * Domain metadata keys
 */
export class DomainMetadataKey {
  static readonly DESCRIPTION: string = "description";
  static readonly WEBSITE: string = "website";
  static readonly CONTACT_EMAIL: string = "contact_email";
  static readonly LOGO_URL: string = "logo_url";
  static readonly CREATED_BY: string = "created_by";
  static readonly REGISTRATION_DATE: string = "registration_date";
  static readonly EXPIRY_DATE: string = "expiry_date";
  static readonly MAX_MEMBERS: string = "max_members";
  static readonly MAX_SUBDOMAINS: string = "max_subdomains";
}

/**
 * Utility class for ID generation
 */
export class IdGenerator {
  private static counter: u64 = 0;

  static generateIdentityId(): string {
    return "id_" + Date.now().toString() + "_" + (++IdGenerator.counter).toString();
  }

  static generateDomainId(name: string): string {
    return "dom_" + name.replace(".", "_") + "_" + Date.now().toString();
  }

  static generateObjectId(type: string): string {
    return "obj_" + type + "_" + Date.now().toString() + "_" + (++IdGenerator.counter).toString();
  }

  static generateSessionId(): string {
    return "sess_" + Date.now().toString() + "_" + (++IdGenerator.counter).toString();
  }

  static generateAuditId(): string {
    return "audit_" + Date.now().toString() + "_" + (++IdGenerator.counter).toString();
  }

  static generateRecoveryId(): string {
    return "rec_" + Date.now().toString() + "_" + (++IdGenerator.counter).toString();
  }
}