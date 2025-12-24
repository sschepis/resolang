/**
 * Core interfaces for the Prime Resonance Network Identity and Domain System
 * Provides interfaces for identity management, domains, objects, and permissions
 */

import { Serializable, JSONSerializable, Cloneable, Equatable, Hashable, Validatable } from "../core/interfaces";
import { ValidationResult } from "../core/validation";

/**
 * Identity types supported by the system
 */
export enum IdentityType {
  SELF_SOVEREIGN,
  MANAGED,
  SYSTEM
}

/**
 * KYC (Know Your Customer) verification levels
 */
export enum KYCLevel {
  NONE = 0,
  BASIC = 1,      // Email/phone verification
  ENHANCED = 2,   // Government ID verification
  FULL = 3        // Comprehensive verification
}

/**
 * Core identity interface
 * Represents a user or system identity in the network
 */
export interface IIdentity {
  serialize(): Uint8Array;
  deserialize(data: Uint8Array): void;
  toJSON(): string;
  fromJSON(json: string): void;
  clone(): IIdentity;
  equals(other: IIdentity): boolean;
  hashCode(): i32;
  validate(): ValidationResult;
  /**
   * Unique identifier for the identity
   */
  getId(): string;
  
  /**
   * Type of identity (self-sovereign, managed, system)
   */
  getType(): IdentityType;
  
  /**
   * Current KYC verification level
   */
  getKYCLevel(): KYCLevel;
  
  /**
   * Set KYC verification level
   */
  setKYCLevel(level: KYCLevel): void;
  
  /**
   * Get the prime resonance identity if connected to a node
   */
  getPrimeResonanceId(): string | null;
  
  /**
   * Connect this identity to a prime resonance node
   */
  connectToPrimeResonance(nodeId: string): void;
  
  /**
   * Get creation timestamp
   */
  getCreatedAt(): f64;
  
  /**
   * Get last update timestamp
   */
  getUpdatedAt(): f64;
  
  /**
   * Check if identity is active
   */
  isActive(): boolean;
  
  /**
   * Deactivate the identity
   */
  deactivate(): void;
  
  /**
   * Reactivate the identity
   */
  reactivate(): void;
  
  /**
   * Get metadata associated with the identity
   */
  getMetadata(): Map<string, string>;
  
  /**
   * Set metadata value
   */
  setMetadata(key: string, value: string): void;

  getPermissions(): IPermission[];
  getRoles(): IRole[];
}

/**
 * Domain interface
 * Represents a named container that can have members and own objects
 */
export interface IDomain {
  serialize(): Uint8Array;
  deserialize(data: Uint8Array): void;
  toJSON(): string;
  fromJSON(json: string): void;
  clone(): IDomain;
  equals(other: IDomain): boolean;
  hashCode(): i32;
  validate(): ValidationResult;
  /**
   * Get domain identifier (e.g., "example.com" or "sub.example.com")
   */
  getId(): string;
  
  /**
   * Get domain name (last part of the identifier)
   */
  getName(): string;
  
  /**
   * Get parent domain ID if this is a subdomain
   */
  getParentId(): string | null;
  
  /**
   * Get owner identity ID
   */
  getOwnerId(): string;
  
  /**
   * Transfer ownership to another identity
   */
  transferOwnership(newOwnerId: string, authorizedBy: string): boolean;
  
  /**
   * Get all member identity IDs
   */
  getMembers(): string[];
  
  /**
   * Add a member to the domain
   */
  addMember(identityId: string, addedBy: string): boolean;
  
  /**
   * Remove a member from the domain
   */
  removeMember(identityId: string, removedBy: string): boolean;
  
  /**
   * Check if an identity is a member
   */
  isMember(identityId: string): boolean;
  
  /**
   * Get all subdomain IDs
   */
  getSubdomains(): string[];
  
  /**
   * Create a subdomain
   */
  createSubdomain(name: string, ownerId: string): IDomain;
  
  /**
   * Get domain-specific permissions
   */
  getPermissions(): Map<string, IPermission>;
  
  /**
   * Add a custom permission
   */
  addPermission(permission: IPermission): void;
  
  /**
   * Get creation timestamp
   */
  getCreatedAt(): f64;
  
  /**
   * Get domain metadata
   */
  getMetadata(): Map<string, string>;
  
  /**
   * Set domain metadata
   */
  setMetadata(key: string, value: string): void;
}

/**
 * Object ownership properties
 */
export interface IObjectProperties {
  fungible: boolean;
  transferable: boolean;
  destructible: boolean;
}

/**
 * Domain object interface
 * Represents any object that can be owned within a domain
 */
export interface IDomainObject {
  serialize(): Uint8Array;
  deserialize(data: Uint8Array): void;
  toJSON(): string;
  fromJSON(json: string): void;
  clone(): IDomainObject;
  equals(other: IDomainObject): boolean;
  hashCode(): i32;
  validate(): ValidationResult;
  /**
   * Get object identifier
   */
  getId(): string;
  
  /**
   * Get object type
   */
  getType(): string;
  
  /**
   * Get owner identity or domain ID
   */
  getOwnerId(): string;
  
  /**
   * Get domain ID where this object exists
   */
  getDomainId(): string;
  
  /**
   * Get object properties
   */
  getProperties(): IObjectProperties;
  
  /**
   * Transfer ownership (if transferable)
   */
  transfer(newOwnerId: string, authorizedBy: string): boolean;
  
  /**
   * Destroy the object (if destructible)
   */
  destroy(authorizedBy: string): boolean;
  
  /**
   * Get creation timestamp
   */
  getCreatedAt(): f64;
  
  /**
   * Get last update timestamp
   */
  getUpdatedAt(): f64;
  
  /**
   * Get object data
   */
  getData(): Map<string, string>;
  
  /**
   * Set object data
   */
  setData(key: string, value: string): void;
  
  /**
   * Check if object is destroyed
   */
  isDestroyed(): boolean;
}

/**
 * Permission interface
 * Represents a capability that can be granted to identities or roles
 */
export interface IPermission {
  serialize(): Uint8Array;
  deserialize(data: Uint8Array): void;
  toJSON(): string;
  fromJSON(json: string): void;
  clone(): IPermission;
  equals(other: IPermission): boolean;
  /**
   * Get permission identifier (e.g., "domain.create", "object.transfer")
   */
  getId(): string;
  
  /**
   * Get human-readable name
   */
  getName(): string;
  
  /**
   * Get permission description
   */
  getDescription(): string;
  
  /**
   * Get the scope (global, domain, object)
   */
  getScope(): PermissionScope;
  
  /**
   * Check if this permission implies another permission
   */
  implies(other: IPermission): boolean;
}

/**
 * Permission scope
 */
export enum PermissionScope {
  GLOBAL,
  DOMAIN,
  OBJECT
}

/**
 * Role interface
 * Represents a collection of permissions that can be assigned to identities
 */
export interface IRole {
  serialize(): Uint8Array;
  deserialize(data: Uint8Array): void;
  toJSON(): string;
  fromJSON(json: string): void;
  clone(): IRole;
  equals(other: IRole): boolean;
  /**
   * Get role identifier
   */
  getId(): string;
  
  /**
   * Get role name
   */
  getName(): string;
  
  /**
   * Get role description
   */
  getDescription(): string;
  
  /**
   * Get domain ID if this is a domain-specific role
   */
  getDomainId(): string | null;
  
  /**
   * Get all permissions in this role
   */
  getPermissions(): IPermission[];
  
  /**
   * Add a permission to the role
   */
  addPermission(permission: IPermission): void;
  
  /**
   * Remove a permission from the role
   */
  removePermission(permissionId: string): void;
  
  /**
   * Check if role has a specific permission
   */
  hasPermission(permissionId: string): boolean;
}

/**
 * KYC provider interface
 * Implements verification logic for different KYC levels
 */
export interface IKYCProvider {
  /**
   * Get provider name
   */
  getName(): string;
  
  /**
   * Get supported KYC levels
   */
  getSupportedLevels(): KYCLevel[];
  
  /**
   * Initiate verification process
   */
  initiateVerification(identity: IIdentity, level: KYCLevel): string; // Returns verification ID
  
  /**
   * Check verification status
   */
  checkVerificationStatus(verificationId: string): KYCVerificationStatus;
  
  /**
   * Get verification result
   */
  getVerificationResult(verificationId: string): KYCVerificationResult | null;
}

/**
 * KYC verification status
 */
export enum KYCVerificationStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  FAILED,
  EXPIRED
}

/**
 * KYC verification result
 */
export interface KYCVerificationResult {
  verificationId: string;
  identityId: string;
  level: KYCLevel;
  status: KYCVerificationStatus;
  verifiedAt: f64;
  expiresAt: f64;
  verifiedData: Map<string, string>;
  provider: string;
}

/**
 * Audit entry interface
 * Records all state changes in the system
 */
export interface IAuditEntry {
  serialize(): Uint8Array;
  deserialize(data: Uint8Array): void;
  toJSON(): string;
  fromJSON(json: string): void;
  /**
   * Get audit entry ID
   */
  getId(): string;
  
  /**
   * Get timestamp of the action
   */
  getTimestamp(): f64;
  
  /**
   * Get the identity that performed the action
   */
  getActorId(): string;
  
  /**
   * Get the action type
   */
  getAction(): AuditAction;
  
  /**
   * Get the target entity ID
   */
  getTargetId(): string;
  
  /**
   * Get the target entity type
   */
  getTargetType(): string;
  
  /**
   * Get additional context data
   */
  getContext(): Map<string, string>;
  
  /**
   * Get the result of the action
   */
  getResult(): AuditResult;
}

/**
 * Audit actions
 */
export enum AuditAction {
  CREATE,
  UPDATE,
  DELETE,
  TRANSFER,
  GRANT_PERMISSION,
  REVOKE_PERMISSION,
  ADD_MEMBER,
  REMOVE_MEMBER,
  VERIFY_KYC,
  AUTHENTICATE,
  DEACTIVATE,
  REACTIVATE
}

/**
 * Audit result
 */
export enum AuditResult {
  SUCCESS,
  FAILURE,
  PARTIAL
}

/**
 * Identity recovery interface
 * Handles multi-signature recovery mechanisms
 */
export interface IIdentityRecovery {
  /**
   * Initiate recovery process
   */
  initiateRecovery(identityId: string, recoveryMethod: RecoveryMethod): string; // Returns recovery ID
  
  /**
   * Add recovery signature
   */
  addRecoverySignature(recoveryId: string, signature: string, signerId: string): boolean;
  
  /**
   * Check if recovery threshold is met
   */
  isRecoveryThresholdMet(recoveryId: string): boolean;
  
  /**
   * Complete recovery process
   */
  completeRecovery(recoveryId: string, newCredentials: Map<string, string>): boolean;
  
  /**
   * Cancel recovery process
   */
  cancelRecovery(recoveryId: string, reason: string): boolean;
}

/**
 * Recovery methods
 */
export enum RecoveryMethod {
  MULTI_SIGNATURE,
  SOCIAL_RECOVERY,
  TIME_LOCKED,
  HARDWARE_KEY
}

/**
 * Session interface for authentication
 */
export interface ISession extends Serializable {
  /**
   * Get session ID
   */
  getId(): string;
  
  /**
   * Get identity ID associated with session
   */
  getIdentityId(): string;
  
  /**
   * Get session creation time
   */
  getCreatedAt(): f64;
  
  /**
   * Get session expiration time
   */
  getExpiresAt(): f64;
  
  /**
   * Check if session is valid
   */
  isValid(): boolean;
  
  /**
   * Refresh session
   */
  refresh(): void;
  
  /**
   * Invalidate session
   */
  invalidate(): void;
  
  /**
   * Get session metadata
   */
  getMetadata(): Map<string, string>;
}

/**
 * Domain registry interface
 * Manages root domain registration and lookup
 */
export interface IDomainRegistry {
  /**
   * Register a new root domain
   */
  registerDomain(name: string, ownerId: string): IDomain;
  
  /**
   * Check if domain name is available
   */
  isAvailable(name: string): boolean;
  
  /**
   * Lookup domain by name
   */
  lookupDomain(name: string): IDomain | null;
  
  /**
   * Get all registered domains
   */
  getAllDomains(): string[];
  
  /**
   * Transfer domain between registries
   */
  transferDomain(domainId: string, targetRegistry: string): boolean;
}