/**
 * Base Identity implementation for the Prime Resonance Network
 * Supports both self-sovereign and managed identity models
 */

import {
  IIdentity,
  IdentityType,
  KYCLevel,
  IPermission,
  IRole
} from "./interfaces";
import { ValidationResult } from "../core/validation";
import { 
  IdentityId, 
  Timestamp, 
  IdGenerator,
  IdentityCreationParams,
  IdentityMetadataKey
} from "./types";
import { BaseSerializable } from "../core/interfaces";
import { JSONBuilder } from "../core/serialization";

/**
 * Base Identity class implementing IIdentity interface
 */
export class Identity extends BaseSerializable implements IIdentity {
  protected id: IdentityId;
  protected type: IdentityType;
  protected kycLevel: KYCLevel;
  protected primeResonanceId: string | null;
  protected createdAt: Timestamp;
  protected updatedAt: Timestamp;
  protected active: boolean;
  protected metadata: Map<string, string>;
  protected creatorId: string | null;
  protected domainId: string | null;

  constructor(params: IdentityCreationParams) {
    super();
    this.metadata = params.metadata || new Map<string, string>();
    this.id = IdGenerator.generateIdentityId();
    this.type = params.type == "self_sovereign" ? IdentityType.SELF_SOVEREIGN :
                params.type == "managed" ? IdentityType.MANAGED :
                IdentityType.SYSTEM;
    this.kycLevel = params.kycLevel as KYCLevel;
    this.primeResonanceId = null;
    this.createdAt = <f64>Date.now();
    this.updatedAt = this.createdAt;
    this.active = true;
    this.creatorId = params.creatorId;
    this.domainId = params.domainId;

    // Set creator metadata
    if (this.creatorId) {
      this.metadata.set(IdentityMetadataKey.CREATED_BY, this.creatorId!);
    }
    if (this.domainId) {
      this.metadata.set(IdentityMetadataKey.MANAGED_BY, this.domainId!);
    }
  }

  // IIdentity implementation
  getId(): string {
    return this.id;
  }

  getType(): IdentityType {
    return this.type;
  }

  getKYCLevel(): KYCLevel {
    return this.kycLevel;
  }

  setKYCLevel(level: KYCLevel): void {
    this.kycLevel = level;
    this.updatedAt = Date.now();
  }

  getPrimeResonanceId(): string | null {
    return this.primeResonanceId;
  }

  connectToPrimeResonance(nodeId: string): void {
    this.primeResonanceId = nodeId;
    this.metadata.set(IdentityMetadataKey.PRIME_NODE_ID, nodeId);
    this.updatedAt = Date.now();
  }

  getCreatedAt(): f64 {
    return this.createdAt;
  }

  getUpdatedAt(): f64 {
    return this.updatedAt;
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate(): void {
    this.active = false;
    this.updatedAt = Date.now();
  }

  reactivate(): void {
    this.active = true;
    this.updatedAt = Date.now();
  }

  getMetadata(): Map<string, string> {
    return this.metadata;
  }

  setMetadata(key: string, value: string): void {
    this.metadata.set(key, value);
    this.updatedAt = Date.now();
  }

  // Cloneable implementation
  clone(): IIdentity {
    const params = new IdentityCreationParams();
    params.type = this.type.toString();
    params.kycLevel = this.kycLevel;
    params.metadata = new Map<string, string>();
    
    // Deep copy metadata
    const keys = this.metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.metadata.get(key);
      params.metadata.set(key, value);
    }
    
    params.creatorId = this.creatorId;
    params.domainId = this.domainId;
    
    const cloned = new Identity(params);
    cloned.id = this.id;
    cloned.primeResonanceId = this.primeResonanceId;
    cloned.createdAt = this.createdAt;
    cloned.updatedAt = this.updatedAt;
    cloned.active = this.active;
    
    return cloned;
  }

  // Equatable implementation
  equals(other: IIdentity): boolean {
    return this.id == other.getId();
  }

  // Hashable implementation
  hashCode(): u32 {
    let hash: u32 = 0;
    for (let i = 0; i < this.id.length; i++) {
      hash = ((hash << 5) - hash) + this.id.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Validatable implementation
  isValid(): boolean {
    // Basic validation rules
    if (this.id.length == 0) return false;
    if (this.createdAt <= 0) return false;
    if (this.updatedAt < this.createdAt) return false;
    
    // Type-specific validation
    if (this.type == IdentityType.MANAGED && !this.creatorId) {
      return false;
    }
    
    return true;
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];
    
    if (this.id.length == 0) {
      errors.push("Identity ID cannot be empty");
    }
    if (this.createdAt <= 0) {
      errors.push("Invalid creation timestamp");
    }
    if (this.updatedAt < this.createdAt) {
      errors.push("Update timestamp cannot be before creation timestamp");
    }
    if (this.type == IdentityType.MANAGED && !this.creatorId) {
      errors.push("Managed identity must have a creator");
    }
    
    return errors;
  }

  // Serializable implementation
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    
    builder.addStringField("id", this.id);
    builder.addStringField("type", this.type.toString());
    builder.addNumberField("kycLevel", this.kycLevel);
    
    if (this.primeResonanceId) {
      builder.addStringField("primeResonanceId", this.primeResonanceId);
    }
    
    builder.addNumberField("createdAt", this.createdAt);
    builder.addNumberField("updatedAt", this.updatedAt);
    builder.addBooleanField("isActive", this.active);
    
    if (this.creatorId) {
      builder.addStringField("creatorId", this.creatorId);
    }
    
    if (this.domainId) {
      builder.addStringField("domainId", this.domainId);
    }
    
    // Add metadata
    let metadataJson = "{";
    const keys = this.metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.metadata.get(key);
      if (i > 0) {
        metadataJson += ",";
      }
      metadataJson += '"' + key + '":"' + value + '"';
    }
    metadataJson += "}";
    builder.addStringField("metadata", metadataJson);
    
    builder.endObject();
    return builder.build();
  }

  /**
   * Create a self-sovereign identity
   */
  static createSelfSovereign(metadata: Map<string, string> = new Map<string, string>()): Identity {
    const params = new IdentityCreationParams();
    params.type = "self_sovereign";
    params.metadata = metadata;
    return new Identity(params);
  }

  /**
   * Create a managed identity
   */
  static createManaged(
    creatorId: string, 
    domainId: string, 
    metadata: Map<string, string> = new Map<string, string>()
  ): Identity {
    const params = new IdentityCreationParams();
    params.type = "managed";
    params.creatorId = creatorId;
    params.domainId = domainId;
    params.metadata = metadata;
    return new Identity(params);
  }

  /**
   * Create a system identity
   */
  static createSystem(metadata: Map<string, string> = new Map<string, string>()): Identity {
    const params = new IdentityCreationParams();
    params.type = "system";
    params.metadata = metadata;
    return new Identity(params);
  }

  /**
   * Serialize the identity to binary format
   */
  serialize(): Uint8Array {
    const json = this.toJSON();
    const bytes = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) {
      bytes[i] = json.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Deserialize identity from binary data
   */
  deserialize(data: Uint8Array): void {
    let json = "";
    for (let i = 0; i < data.length; i++) {
      json += String.fromCharCode(data[i]);
    }
    this.fromJSON(json);
  }

  /**
   * Create identity from JSON string
   */
  fromJSON(json: string): void {
    // Simple JSON parsing for basic properties
    // This is a simplified implementation for AssemblyScript
    this.metadata = new Map<string, string>();
    // For now, just reset to defaults - proper JSON parsing would be more complex
    this.updatedAt = Date.now();
  }

  /**
   * Validate the identity
   */
  validate(): ValidationResult {
    if (!this.id || this.id.length === 0) {
      return ValidationResult.invalid("Identity ID is required");
    }
    if (this.createdAt <= 0) {
      return ValidationResult.invalid("Invalid creation timestamp");
    }
    if (this.updatedAt < this.createdAt) {
      return ValidationResult.invalid("Updated timestamp cannot be before creation timestamp");
    }
    return ValidationResult.valid();
  }

  /**
   * Get permissions for this identity
   */
  getPermissions(): IPermission[] {
    // Return empty array for base implementation
    // Subclasses should override this method
    return new Array<IPermission>();
  }

  /**
   * Get roles for this identity
   */
  getRoles(): IRole[] {
    // Return empty array for base implementation
    // Subclasses should override this method
    return new Array<IRole>();
  }
}

/**
 * Extended identity class for self-sovereign identities
 * Includes additional cryptographic capabilities
 */
export class SelfSovereignIdentity extends Identity {
  private publicKey: string | null;
  private recoveryKeys: string[];

  constructor(params: IdentityCreationParams) {
    params.type = "self_sovereign";
    super(params);
    this.publicKey = null;
    this.recoveryKeys = [];
  }

  /**
   * Set the public key for cryptographic operations
   */
  setPublicKey(publicKey: string): void {
    this.publicKey = publicKey;
    this.metadata.set(IdentityMetadataKey.PUBLIC_KEY, publicKey);
    this.updatedAt = Date.now();
  }

  /**
   * Get the public key
   */
  getPublicKey(): string | null {
    return this.publicKey;
  }

  /**
   * Add a recovery key for identity recovery
   */
  addRecoveryKey(recoveryKey: string): void {
    this.recoveryKeys.push(recoveryKey);
    this.updatedAt = Date.now();
  }

  /**
   * Get all recovery keys
   */
  getRecoveryKeys(): string[] {
    return this.recoveryKeys;
  }

  /**
   * Verify ownership using cryptographic signature
   * Note: Actual signature verification would require crypto implementation
   */
  verifyOwnership(message: string, signature: string): boolean {
    // TODO: Implement actual signature verification
    // This is a placeholder that would use the public key to verify
    return this.publicKey != null && signature.length > 0;
  }

  clone(): IIdentity {
    const params = new IdentityCreationParams();
    params.type = "self_sovereign";
    params.metadata = new Map<string, string>();
    
    // Deep copy metadata
    const keys = this.metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.metadata.get(key);
      params.metadata.set(key, value);
    }
    
    params.creatorId = this.creatorId;
    params.domainId = this.domainId;
    
    const cloned = new SelfSovereignIdentity(params);
    cloned.id = this.id;
    cloned.primeResonanceId = this.primeResonanceId;
    cloned.createdAt = this.createdAt;
    cloned.updatedAt = this.updatedAt;
    cloned.active = this.active;
    cloned.kycLevel = this.kycLevel;
    
    // Copy extended properties
    cloned.publicKey = this.publicKey;
    cloned.recoveryKeys = this.recoveryKeys.slice(0);
    
    return cloned;
  }
}

/**
 * Extended identity class for managed identities
 * Includes domain-specific management features
 */
export class ManagedIdentity extends Identity {
  private permissions: Set<string>;
  private roles: Set<string>;
  private expiresAt: Timestamp | null;

  constructor(params: IdentityCreationParams) {
    params.type = "managed";
    super(params);
    this.permissions = new Set<string>();
    this.roles = new Set<string>();
    this.expiresAt = null;
  }

  /**
   * Set expiration time for the managed identity
   */
  setExpiration(expiresAt: Timestamp): void {
    this.expiresAt = expiresAt;
    this.updatedAt = Date.now();
  }

  /**
   * Check if the identity has expired
   */
  isExpired(): boolean {
    return this.expiresAt != null && Date.now() > this.expiresAt;
  }

  /**
   * Grant a permission to this identity
   */
  grantPermission(permissionId: string): void {
    this.permissions.add(permissionId);
    this.updatedAt = Date.now();
  }

  /**
   * Revoke a permission from this identity
   */
  revokePermission(permissionId: string): void {
    this.permissions.delete(permissionId);
    this.updatedAt = Date.now();
  }

  /**
   * Check if identity has a specific permission
   */
  hasPermission(permissionId: string): boolean {
    return this.permissions.has(permissionId) as boolean;
  }

  /**
   * Assign a role to this identity
   */
  assignRole(roleId: string): void {
    this.roles.add(roleId);
    this.updatedAt = Date.now();
  }

  /**
   * Unassign a role from this identity
   */
  unassignRole(roleId: string): void {
    this.roles.delete(roleId);
    this.updatedAt = Date.now();
  }

  /**
   * Check if identity has a specific role
   */
  hasRole(roleId: string): boolean {
    return this.roles.has(roleId) as boolean;
  }

  /**
   * Get all permissions
   */
  getPermissions(): IPermission[] {
    // Return empty array for now - would need to convert string IDs to IPermission objects
    return new Array<IPermission>();
  }

  /**
   * Get all roles
   */
  getRoles(): IRole[] {
    // Return empty array for now - would need to convert string IDs to IRole objects
    return new Array<IRole>();
  }

  isValid(): boolean {
    if (!super.isValid()) return false;
    if (this.isExpired()) return false;
    return true;
  }

  getValidationErrors(): string[] {
    const errors = super.getValidationErrors();
    if (this.isExpired()) {
      errors.push("Managed identity has expired");
    }
    return errors;
  }

  clone(): IIdentity {
    const params = new IdentityCreationParams();
    params.type = "managed";
    params.metadata = new Map<string, string>();
    
    // Deep copy metadata
    const keys = this.metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.metadata.get(key);
      params.metadata.set(key, value);
    }
    
    params.creatorId = this.creatorId;
    params.domainId = this.domainId;
    
    const cloned = new ManagedIdentity(params);
    cloned.id = this.id;
    cloned.primeResonanceId = this.primeResonanceId;
    cloned.createdAt = this.createdAt;
    cloned.updatedAt = this.updatedAt;
    cloned.active = this.active;
    cloned.kycLevel = this.kycLevel;
    
    // Copy extended properties
    const perms = this.permissions.values();
    for (let i = 0; i < perms.length; i++) {
      cloned.permissions.add(perms[i]);
    }
    
    const roleVals = this.roles.values();
    for (let i = 0; i < roleVals.length; i++) {
      cloned.roles.add(roleVals[i]);
    }
    
    cloned.expiresAt = this.expiresAt;
    
    return cloned;
  }
}