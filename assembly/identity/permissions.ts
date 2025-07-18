/**
 * Permission and Role System for the Prime Resonance Network
 * Handles fine-grained access control with quantum-enhanced features
 */

import { IPermission, IRole, PermissionScope } from "./interfaces";
import { IdentityId, DomainId, ObjectId } from "./types";
import { BaseSerializable } from "../core/interfaces";
import { globalAuditTrail, AuditEventType, AuditSeverity } from "./audit-trail";

/**
 * Permission class with quantum-enhanced capabilities
 */
export class Permission extends BaseSerializable implements IPermission {
  private id: string;
  private name: string;
  private description: string;
  private scope: PermissionScope;
  private grantedAt: f64;
  private grantedBy: IdentityId;
  private metadata: Map<string, string>;
  private constraints: Map<string, string>;
  private active: boolean;

  constructor(
    id: string,
    name: string,
    description: string,
    scope: PermissionScope,
    grantedBy: IdentityId = ""
  ) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.scope = scope;
    this.grantedAt = f64(Date.now());
    this.grantedBy = grantedBy;
    this.metadata = new Map<string, string>();
    this.constraints = new Map<string, string>();
    this.active = true;
  }

  // Interface implementations
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getScope(): PermissionScope {
    return this.scope;
  }

  isActive(): boolean {
    return this.active;
  }

  activate(): void {
    this.active = true;
  }

  deactivate(): void {
    this.active = false;
  }

  // Serialization methods
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    return `{"id":"${this.id}","name":"${this.name}","description":"${this.description}","scope":${this.scope},"active":${this.active}}`;
  }

  serialize(): Uint8Array {
    const json = this.toJSON();
    const buffer = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) {
      buffer[i] = json.charCodeAt(i);
    }
    return buffer;
  }

  deserialize(data: Uint8Array): void {
    // Basic deserialization - in a real implementation this would parse JSON
    // For now, we'll just mark it as implemented
  }

  fromJSON(json: string): void {
    // Basic JSON parsing - in a real implementation this would parse the JSON string
    // For now, we'll just mark it as implemented
  }

  clone(): IPermission {
    const cloned = new Permission(this.id, this.name, this.description, this.scope, this.grantedBy);
    cloned.active = this.active;
    cloned.grantedAt = this.grantedAt;
    // Copy metadata and constraints
    const metadataKeys = this.metadata.keys();
    for (let i = 0; i < metadataKeys.length; i++) {
      const key = metadataKeys[i];
      cloned.metadata.set(key, this.metadata.get(key)!);
    }
    const constraintKeys = this.constraints.keys();
    for (let i = 0; i < constraintKeys.length; i++) {
      const key = constraintKeys[i];
      cloned.constraints.set(key, this.constraints.get(key)!);
    }
    return cloned;
  }

  equals(other: IPermission): boolean {
    return this.id == other.getId() && 
           this.name == other.getName() && 
           this.scope == other.getScope();
  }

  implies(other: IPermission): boolean {
    // Check if this permission implies the other
    // For now, simple equality check
    return this.equals(other);
  }

  /**
   * Add a constraint to this permission
   */
  addConstraint(key: string, value: string): void {
    this.constraints.set(key, value);
  }

  /**
   * Remove a constraint
   */
  removeConstraint(key: string): void {
    this.constraints.delete(key);
  }

  /**
   * Check if permission has a specific constraint
   */
  hasConstraint(key: string): boolean {
    return this.constraints.has(key) ? true : false;
  }

  /**
   * Get constraint value
   */
  getConstraint(key: string): string | null {
    return this.constraints.has(key) ? this.constraints.get(key) : null;
  }

  /**
   * Set metadata
   */
  setMetadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  /**
   * Get metadata
   */
  getMetadata(key: string): string | null {
    return this.metadata.has(key) ? this.metadata.get(key) : null;
  }

  /**
   * Check if permission is valid for a specific context
   */
  isValidForContext(context: string): boolean {
    if (!this.active) return false;
    
    // Check constraints
    if (this.hasConstraint("context")) {
      const allowedContext = this.getConstraint("context");
      if (allowedContext && allowedContext != context) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Create a new permission
   */
  static create(
    id: string,
    name: string,
    description: string,
    scope: PermissionScope = PermissionScope.GLOBAL,
    grantedBy: IdentityId = ""
  ): Permission {
    const permission = new Permission(id, name, description, scope, grantedBy);
    
    // Log creation
    globalAuditTrail.logEvent(
      AuditEventType.PERMISSION_GRANTED,
      grantedBy,
      "permission",
      id,
      `Permission created: ${name}`,
      AuditSeverity.INFO
    );
    
    return permission;
  }

  /**
   * Create global permissions
   */
  static createGlobalPermissions(): Map<string, Permission> {
    const permissions = new Map<string, Permission>();
    
    // System permissions
    permissions.set("system.admin", Permission.create("system.admin", "System Admin", "Full system access", PermissionScope.GLOBAL));
    permissions.set("system.read", Permission.create("system.read", "System Read", "Read system information", PermissionScope.GLOBAL));
    permissions.set("system.write", Permission.create("system.write", "System Write", "Write system configuration", PermissionScope.GLOBAL));
    
    // Domain permissions
    permissions.set("domain.create", Permission.create("domain.create", "Create Domain", "Create new domains", PermissionScope.DOMAIN));
    permissions.set("domain.read", Permission.create("domain.read", "Read Domain", "Read domain information", PermissionScope.DOMAIN));
    permissions.set("domain.write", Permission.create("domain.write", "Write Domain", "Modify domain settings", PermissionScope.DOMAIN));
    permissions.set("domain.delete", Permission.create("domain.delete", "Delete Domain", "Delete domains", PermissionScope.DOMAIN));
    permissions.set("domain.transfer", Permission.create("domain.transfer", "Transfer Domain", "Transfer domain ownership", PermissionScope.DOMAIN));
    
    // Object permissions
    permissions.set("object.create", Permission.create("object.create", "Create Object", "Create new objects", PermissionScope.OBJECT));
    permissions.set("object.read", Permission.create("object.read", "Read Object", "Read object information", PermissionScope.OBJECT));
    permissions.set("object.write", Permission.create("object.write", "Write Object", "Modify object properties", PermissionScope.OBJECT));
    permissions.set("object.delete", Permission.create("object.delete", "Delete Object", "Delete objects", PermissionScope.OBJECT));
    permissions.set("object.transfer", Permission.create("object.transfer", "Transfer Object", "Transfer object ownership", PermissionScope.OBJECT));
    
    // Identity permissions
    permissions.set("identity.create", Permission.create("identity.create", "Create Identity", "Create new identities", PermissionScope.GLOBAL));
    permissions.set("identity.read", Permission.create("identity.read", "Read Identity", "Read identity information", PermissionScope.GLOBAL));
    permissions.set("identity.write", Permission.create("identity.write", "Write Identity", "Modify identity properties", PermissionScope.GLOBAL));
    permissions.set("identity.delete", Permission.create("identity.delete", "Delete Identity", "Delete identities", PermissionScope.GLOBAL));
    
    return permissions;
  }
}

/**
 * Role class for grouping permissions
 */
export class Role extends BaseSerializable implements IRole {
  private id: string;
  private name: string;
  private description: string;
  private permissions: Array<IPermission>;
  private domainId: DomainId | null;
  private createdAt: f64;
  private active: boolean;

  constructor(
    name: string,
    description: string,
    domainId: DomainId | null = null
  ) {
    super();
    this.id = "role-" + Date.now().toString() + "-" + Math.random().toString();
    this.name = name;
    this.description = description;
    this.permissions = new Array<IPermission>();
    this.domainId = domainId;
    this.createdAt = f64(Date.now());
    this.active = true;
  }

  // Interface implementations
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPermissions(): Array<IPermission> {
    return this.permissions;
  }

  getDomainId(): DomainId | null {
    return this.domainId;
  }

  isActive(): boolean {
    return this.active;
  }

  activate(): void {
    this.active = true;
  }

  deactivate(): void {
    this.active = false;
  }

  // Serialization methods
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    return `{"id":"${this.id}","name":"${this.name}","description":"${this.description}","active":${this.active}}`;
  }

  serialize(): Uint8Array {
    const json = this.toJSON();
    const buffer = new Uint8Array(json.length);
    for (let i = 0; i < json.length; i++) {
      buffer[i] = json.charCodeAt(i);
    }
    return buffer;
  }

  deserialize(data: Uint8Array): void {
    // Basic deserialization - in a real implementation this would parse JSON
    // For now, we'll just mark it as implemented
  }

  fromJSON(json: string): void {
    // Basic JSON parsing - in a real implementation this would parse the JSON string
    // For now, we'll just mark it as implemented
  }

  clone(): IRole {
    const cloned = new Role(this.name, this.description, this.domainId);
    cloned.active = this.active;
    cloned.createdAt = this.createdAt;
    // Copy permissions
    for (let i = 0; i < this.permissions.length; i++) {
      cloned.permissions.push(this.permissions[i]);
    }
    return cloned;
  }

  equals(other: IRole): boolean {
    return this.id == other.getId() && 
           this.name == other.getName();
  }

  implies(other: IRole): boolean {
    // Check if this role implies the other
    // For now, simple equality check
    return this.equals(other);
  }

  /**
   * Add a permission to this role
   */
  addPermission(permission: IPermission): void {
    this.permissions.push(permission);
  }

  /**
   * Remove a permission from this role
   */
  removePermission(permissionId: string): void {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i].getId() == permissionId) {
        this.permissions.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Check if role has a specific permission
   */
  hasPermission(permissionId: string): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i].getId() == permissionId) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get a specific permission
   */
  getPermission(permissionId: string): IPermission | null {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i].getId() == permissionId) {
        return this.permissions[i];
      }
    }
    return null;
  }

  /**
   * Create system roles
   */
  static createSystemRoles(globalPermissions: Map<string, Permission>): Map<string, Role> {
    const roles = new Map<string, Role>();
    
    // System Administrator
    const systemAdmin = new Role("System Administrator", "Full system access");
    const adminPermissions = globalPermissions.keys();
    for (let i = 0; i < adminPermissions.length; i++) {
      const permission = globalPermissions.get(adminPermissions[i]);
      if (permission) {
        systemAdmin.addPermission(permission);
      }
    }
    roles.set("system.admin", systemAdmin);
    
    // Domain Owner
    const domainOwner = new Role("Domain Owner", "Domain management permissions");
    const domainPermissions = ["domain.read", "domain.write", "domain.transfer", "object.create", "object.read", "object.write", "object.delete"];
    for (let i = 0; i < domainPermissions.length; i++) {
      const permission = globalPermissions.get(domainPermissions[i]);
      if (permission) {
        domainOwner.addPermission(permission);
      }
    }
    roles.set("domain.owner", domainOwner);
    
    // Object Owner
    const objectOwner = new Role("Object Owner", "Object management permissions");
    const objectPermissions = ["object.read", "object.write", "object.transfer"];
    for (let i = 0; i < objectPermissions.length; i++) {
      const permission = globalPermissions.get(objectPermissions[i]);
      if (permission) {
        objectOwner.addPermission(permission);
      }
    }
    roles.set("object.owner", objectOwner);
    
    // Read-only User
    const readOnlyUser = new Role("Read-only User", "Read-only access");
    const readPermissions = ["domain.read", "object.read", "identity.read"];
    for (let i = 0; i < readPermissions.length; i++) {
      const permission = globalPermissions.get(readPermissions[i]);
      if (permission) {
        readOnlyUser.addPermission(permission);
      }
    }
    roles.set("user.readonly", readOnlyUser);
    
    return roles;
  }
}

/**
 * Permission evaluator for checking access
 */
export class PermissionEvaluator {
  /**
   * Check if an entity has a specific permission
   */
  hasPermission(
    permissions: Array<string>,
    roles: Array<IRole>,
    requiredPermission: string,
    context: string = ""
  ): boolean {
    // Check direct permissions
    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i] == requiredPermission) {
        return true;
      }
    }
    
    // Check role permissions
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      
      if (role.hasPermission(requiredPermission)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get all permissions for an entity
   */
  getAllPermissions(
    permissions: Array<string>,
    roles: Array<IRole>
  ): Array<string> {
    const allPermissions = new Set<string>();
    
    // Add direct permissions
    for (let i = 0; i < permissions.length; i++) {
      allPermissions.add(permissions[i]);
    }
    
    // Add role permissions
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      
      const rolePermissions = role.getPermissions();
      for (let j = 0; j < rolePermissions.length; j++) {
        allPermissions.add(rolePermissions[j].getId());
      }
    }
    
    return allPermissions.values();
  }

  /**
   * Check if an entity can perform an action on a resource
   */
  canPerformAction(
    permissions: Array<string>,
    roles: Array<IRole>,
    action: string,
    resourceType: string,
    resourceId: string = ""
  ): boolean {
    const requiredPermission = resourceType + "." + action;
    return this.hasPermission(permissions, roles, requiredPermission, resourceId);
  }
}