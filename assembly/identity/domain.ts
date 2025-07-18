/**
 * Domain implementation for the Prime Resonance Network
 * Supports hierarchical domain structures with ownership and membership
 */

import { 
  IDomain, 
  IPermission,
  KYCLevel 
} from "./interfaces";
import { 
  DomainId, 
  IdentityId,
  Timestamp, 
  IdGenerator,
  DomainCreationParams,
  DomainMetadataKey,
  GlobalPermissions,
  IdentityEventType
} from "./types";
import { BaseSerializable } from "../core/interfaces";
import { JSONBuilder } from "../core/serialization";

/**
 * Domain class implementing IDomain interface
 * Represents a named container that can have members and own objects
 */
export class Domain extends BaseSerializable implements IDomain {
  serialize(): Uint8Array {
    return new Uint8Array(0);
  }
  deserialize(data: Uint8Array): void {}
  fromJSON(json: string): void {}
  validate(): any { return { valid: true }; }
  protected id: DomainId;
  protected name: string;
  protected parentId: DomainId | null;
  protected ownerId: IdentityId;
  protected members: Set<IdentityId>;
  protected subdomains: Set<DomainId>;
  protected permissions: Map<string, IPermission>;
  protected createdAt: Timestamp;
  protected updatedAt: Timestamp;
  protected metadata: Map<string, string>;
  protected requiredKYCLevel: KYCLevel;

  constructor(params: DomainCreationParams) {
    super();
    this.name = params.name;
    this.parentId = params.parentId;
    this.ownerId = params.ownerId;
    this.members = new Set<IdentityId>();
    this.subdomains = new Set<DomainId>();
    this.permissions = new Map<string, IPermission>();
    this.metadata = params.metadata;
    this.requiredKYCLevel = params.requiredKYCLevel;
    
    // Generate full name without using this
    const fullName = params.parentId ? params.parentId! + "." + params.name : params.name;
    this.id = IdGenerator.generateDomainId(fullName);
    this.createdAt = <f64>Date.now();
    this.updatedAt = this.createdAt;

    // Owner is automatically a member
    this.members.add(this.ownerId);

    // Set creation metadata
    this.metadata.set(DomainMetadataKey.CREATED_BY, this.ownerId);
    this.metadata.set(DomainMetadataKey.REGISTRATION_DATE, this.createdAt.toString());
  }

  // Helper to construct full domain name
  private getFullName(parentId: string | null, name: string): string {
    if (!parentId) return name;
    // In a real implementation, we would look up the parent domain
    // For now, we'll just use the parent ID as a prefix
    return parentId + "." + name;
  }

  // IDomain implementation
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getParentId(): string | null {
    return this.parentId;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  transferOwnership(newOwnerId: string, authorizedBy: string): boolean {
    // Check if authorized (must be current owner or have transfer permission)
    if (authorizedBy != this.ownerId && !this.hasPermission(authorizedBy, GlobalPermissions.DOMAIN_TRANSFER)) {
      return false;
    }

    const oldOwnerId = this.ownerId;
    this.ownerId = newOwnerId;
    
    // Ensure new owner is a member
    this.members.add(newOwnerId);
    
    this.updatedAt = <f64>Date.now();
    
    // Log the transfer event
    const context = new Map<string, string>();
    context.set("from", oldOwnerId);
    context.set("to", newOwnerId);
    this.logEvent(IdentityEventType.DOMAIN_TRANSFERRED, authorizedBy, context);
    
    return true;
  }

  getMembers(): string[] {
    return this.members.values();
  }

  addMember(identityId: string, addedBy: string): boolean {
    // Check if authorized
    if (!this.canManageMembers(addedBy)) {
      return false;
    }

    if (this.members.has(identityId)) {
      return false; // Already a member
    }

    this.members.add(identityId);
    this.updatedAt = <f64>Date.now();

    // Log the event
    const context = new Map<string, string>();
    context.set("member", identityId);
    this.logEvent(IdentityEventType.DOMAIN_MEMBER_ADDED, addedBy, context);

    return true;
  }

  removeMember(identityId: string, removedBy: string): boolean {
    // Check if authorized
    if (!this.canManageMembers(removedBy)) {
      return false;
    }

    // Cannot remove the owner
    if (identityId == this.ownerId) {
      return false;
    }

    if (!this.members.has(identityId)) {
      return false; // Not a member
    }

    this.members.delete(identityId);
    this.updatedAt = <f64>Date.now();

    // Log the event
    const context = new Map<string, string>();
    context.set("member", identityId);
    this.logEvent(IdentityEventType.DOMAIN_MEMBER_REMOVED, removedBy, context);

    return true;
  }

  isMember(identityId: string): boolean {
    return this.members.has(identityId) as boolean;
  }

  getSubdomains(): string[] {
    return this.subdomains.values();
  }

  createSubdomain(name: string, ownerId: string): IDomain {
    const params = new DomainCreationParams(name, ownerId);
    params.parentId = this.id;
    params.requiredKYCLevel = this.requiredKYCLevel; // Inherit KYC requirement by default
    
    const subdomain = new Domain(params);
    this.subdomains.add(subdomain.getId());
    this.updatedAt = <f64>Date.now();

    return subdomain;
  }

  getPermissions(): Map<string, IPermission> {
    return this.permissions;
  }

  addPermission(permission: IPermission): void {
    this.permissions.set(permission.getId(), permission);
    this.updatedAt = <f64>Date.now();
  }

  getCreatedAt(): f64 {
    return this.createdAt;
  }

  getMetadata(): Map<string, string> {
    return this.metadata;
  }

  setMetadata(key: string, value: string): void {
    this.metadata.set(key, value);
    this.updatedAt = <f64>Date.now();
  }

  // Additional methods
  getRequiredKYCLevel(): KYCLevel {
    return this.requiredKYCLevel;
  }

  setRequiredKYCLevel(level: KYCLevel, setBy: string): boolean {
    if (setBy != this.ownerId && !this.hasPermission(setBy, GlobalPermissions.DOMAIN_UPDATE)) {
      return false;
    }

    this.requiredKYCLevel = level;
    this.updatedAt = <f64>Date.now();
    return true;
  }

  // Helper methods
  private canManageMembers(identityId: string): boolean {
    return identityId == this.ownerId || 
           this.hasPermission(identityId, GlobalPermissions.DOMAIN_ADD_MEMBER) ||
           this.hasPermission(identityId, GlobalPermissions.DOMAIN_REMOVE_MEMBER);
  }

  private hasPermission(identityId: string, permissionId: string): boolean {
    // In a real implementation, this would check against the identity's permissions
    // For now, we'll just check if they're the owner
    return identityId == this.ownerId;
  }

  private logEvent(eventType: string, actorId: string, context: Map<string, string>): void {
    // In a real implementation, this would create an audit entry
    // For now, we'll just update the timestamp
    this.updatedAt = <f64>Date.now();
  }

  // Cloneable implementation
  clone(): IDomain {
    const params = new DomainCreationParams(this.name, this.ownerId);
    params.parentId = this.parentId;
    params.requiredKYCLevel = this.requiredKYCLevel;
    params.metadata = new Map<string, string>();
    
    // Deep copy metadata
    const keys = this.metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.metadata.get(key);
      params.metadata.set(key, value);
    }
    
    const cloned = new Domain(params);
    cloned.id = this.id;
    cloned.createdAt = this.createdAt;
    cloned.updatedAt = this.updatedAt;
    
    // Copy members
    const memberIds = this.members.values();
    for (let i = 0; i < memberIds.length; i++) {
      cloned.members.add(memberIds[i]);
    }
    
    // Copy subdomains
    const subdomainIds = this.subdomains.values();
    for (let i = 0; i < subdomainIds.length; i++) {
      cloned.subdomains.add(subdomainIds[i]);
    }
    
    // Copy permissions
    const permissionKeys = this.permissions.keys();
    for (let i = 0; i < permissionKeys.length; i++) {
      const key = permissionKeys[i];
      const permission = this.permissions.get(key);
      cloned.permissions.set(key, permission);
    }
    
    return cloned;
  }

  // Equatable implementation
  equals(other: IDomain): boolean {
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
    if (this.id.length == 0) return false;
    if (this.name.length == 0) return false;
    if (this.ownerId.length == 0) return false;
    if (!this.members.has(this.ownerId)) return false; // Owner must be a member
    if (this.createdAt <= 0) return false;
    if (this.updatedAt < this.createdAt) return false;
    
    // Validate domain name format
    if (!this.isValidDomainName(this.name)) return false;
    
    return true;
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];
    
    if (this.id.length == 0) {
      errors.push("Domain ID cannot be empty");
    }
    if (this.name.length == 0) {
      errors.push("Domain name cannot be empty");
    }
    if (this.ownerId.length == 0) {
      errors.push("Domain must have an owner");
    }
    if (!this.members.has(this.ownerId)) {
      errors.push("Domain owner must be a member");
    }
    if (this.createdAt <= 0) {
      errors.push("Invalid creation timestamp");
    }
    if (this.updatedAt < this.createdAt) {
      errors.push("Update timestamp cannot be before creation timestamp");
    }
    if (!this.isValidDomainName(this.name)) {
      errors.push("Invalid domain name format");
    }
    
    return errors;
  }

  private isValidDomainName(name: string): boolean {
    // Basic domain name validation
    if (name.length == 0 || name.length > 63) return false;
    
    // Check for valid characters (alphanumeric and hyphen)
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      const isAlphaNum = (char >= 48 && char <= 57) || // 0-9
                        (char >= 65 && char <= 90) || // A-Z
                        (char >= 97 && char <= 122);  // a-z
      const isHyphen = char == 45; // -
      
      if (!isAlphaNum && !isHyphen) return false;
    }
    
    // Cannot start or end with hyphen
    if (name.charCodeAt(0) == 45 || name.charCodeAt(name.length - 1) == 45) {
      return false;
    }
    
    return true;
  }

  // Serializable implementation
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    
    builder.addStringField("id", this.id);
    builder.addStringField("name", this.name);
    
    if (this.parentId) {
      builder.addStringField("parentId", this.parentId);
    }
    
    builder.addStringField("ownerId", this.ownerId);
    builder.addNumberField("requiredKYCLevel", this.requiredKYCLevel);
    builder.addNumberField("createdAt", this.createdAt);
    builder.addNumberField("updatedAt", this.updatedAt);
    
    // Add members array
    builder.addRawField("members", this.serializeStringArray(this.members.values()));
    
    // Add subdomains array
    builder.addRawField("subdomains", this.serializeStringArray(this.subdomains.values()));
    
    // Add metadata
    builder.addRawField("metadata", this.serializeMetadata());
    
    builder.endObject();
    return builder.build();
  }

  // Helper method to serialize string array
  private serializeStringArray(values: string[]): string {
    const parts: string[] = [];
    parts.push("[");
    for (let i = 0; i < values.length; i++) {
      if (i > 0) parts.push(",");
      parts.push('"' + this.escapeJSON(values[i]) + '"');
    }
    parts.push("]");
    return parts.join("");
  }

  // Helper method to serialize metadata
  private serializeMetadata(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    const keys = this.metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.metadata.get(key);
      builder.addStringField(key, value);
    }
    builder.endObject();
    return builder.build();
  }

  /**
   * Get the full domain path (e.g., "root.sub1.sub2")
   */
  getFullPath(): string {
    // In a real implementation, this would recursively build the path
    // For now, we'll return the ID which contains the full path
    return this.id.replace("dom_", "").split("_")[0];
  }

  /**
   * Check if this domain is a subdomain of another
   */
  isSubdomainOf(domainId: string): boolean {
    let currentParentId = this.parentId;
    while (currentParentId) {
      if (currentParentId == domainId) return true;
      // In a real implementation, we would look up the parent domain
      // and continue traversing up the hierarchy
      break;
    }
    return false;
  }

  /**
   * Get the root domain ID
   */
  getRootDomainId(): string {
    if (!this.parentId) return this.id;
    // In a real implementation, we would traverse up to find the root
    return this.parentId;
  }

  /**
   * Check if identity meets KYC requirements
   */
  meetsKYCRequirement(identityKYCLevel: KYCLevel): boolean {
    return identityKYCLevel >= this.requiredKYCLevel;
  }
}

/**
 * Root domain class with additional registry features
 */
export class RootDomain extends Domain {
  private maxSubdomains: i32;
  private maxMembers: i32;
  private expiresAt: Timestamp;

  constructor(params: DomainCreationParams) {
    params.parentId = null; // Root domains have no parent
    super(params);
    
    this.maxSubdomains = 100; // Default limits
    this.maxMembers = 1000;
    this.expiresAt = 0; // 0 indicates no expiration
    
    // Set default metadata for root domains
    this.metadata.set(DomainMetadataKey.MAX_SUBDOMAINS, this.maxSubdomains.toString());
    this.metadata.set(DomainMetadataKey.MAX_MEMBERS, this.maxMembers.toString());
  }

  setMaxSubdomains(max: i32): void {
    this.maxSubdomains = max;
    this.metadata.set(DomainMetadataKey.MAX_SUBDOMAINS, max.toString());
    this.updatedAt = <f64>Date.now();
  }

  setMaxMembers(max: i32): void {
    this.maxMembers = max;
    this.metadata.set(DomainMetadataKey.MAX_MEMBERS, max.toString());
    this.updatedAt = <f64>Date.now();
  }

  setExpiration(expiresAt: Timestamp): void {
    this.expiresAt = expiresAt;
    this.metadata.set(DomainMetadataKey.EXPIRY_DATE, expiresAt.toString());
    this.updatedAt = <f64>Date.now();
  }

  isExpired(): boolean {
    return this.expiresAt != null && Date.now() > this.expiresAt;
  }

  canAddSubdomain(): boolean {
    return this.subdomains.size < this.maxSubdomains;
  }

  canAddMember(): boolean {
    return this.members.size < this.maxMembers;
  }

  addMember(identityId: string, addedBy: string): boolean {
    if (!this.canAddMember()) {
      return false;
    }
    return super.addMember(identityId, addedBy);
  }

  createSubdomain(name: string, ownerId: string): IDomain {
    if (!this.canAddSubdomain()) {
      throw new Error("Maximum subdomains reached");
    }
    return super.createSubdomain(name, ownerId);
  }

  isValid(): boolean {
    if (!super.isValid()) return false;
    if (this.isExpired()) return false;
    if (this.parentId != null) return false; // Root domains must not have parents
    return true;
  }

  getValidationErrors(): string[] {
    const errors = super.getValidationErrors();
    if (this.isExpired()) {
      errors.push("Root domain has expired");
    }
    if (this.parentId != null) {
      errors.push("Root domain cannot have a parent");
    }
    return errors;
  }
}