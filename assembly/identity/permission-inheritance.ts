/**
 * Permission Inheritance System for the Prime Resonance Network
 * Handles hierarchical permission inheritance with quantum-enhanced features
 */

import { IIdentity, IDomain, IPermission } from "./interfaces";
import { IdentityId, DomainId } from "./types";
import { Permission, Role } from "./permissions";
import { BaseSerializable } from "../core/interfaces";
import { globalAuditTrail, AuditEventType, AuditSeverity } from "./audit-trail";

/**
 * Permission inheritance modes
 */
export enum InheritanceMode {
  NONE = 0,                    // No inheritance
  ADDITIVE = 1,                // Child inherits parent permissions
  RESTRICTIVE = 2,             // Child can only have subset of parent permissions
  OVERRIDE = 3                 // Child can override parent permissions
}

/**
 * Inheritance rule for domains
 */
export class InheritanceRule {
  domainId: DomainId;
  parentDomainId: DomainId | null;
  mode: InheritanceMode;
  inheritedPermissions: Array<string>;
  blockedPermissions: Array<string>;
  overriddenPermissions: Array<string>;
  active: boolean;

  constructor(
    domainId: DomainId,
    parentDomainId: DomainId | null,
    mode: InheritanceMode
  ) {
    this.domainId = domainId;
    this.parentDomainId = parentDomainId;
    this.mode = mode;
    this.inheritedPermissions = new Array<string>();
    this.blockedPermissions = new Array<string>();
    this.overriddenPermissions = new Array<string>();
    this.active = true;
  }

  /**
   * Add permission to inheritance
   */
  addInheritedPermission(permissionId: string): void {
    this.inheritedPermissions.push(permissionId);
  }

  /**
   * Block permission from inheritance
   */
  blockPermission(permissionId: string): void {
    this.blockedPermissions.push(permissionId);
  }

  /**
   * Override permission in inheritance
   */
  overridePermission(permissionId: string): void {
    this.overriddenPermissions.push(permissionId);
  }

  /**
   * Check if permission is inherited
   */
  isInherited(permissionId: string): boolean {
    return this.inheritedPermissions.includes(permissionId) ? true : false;
  }

  /**
   * Check if permission is blocked
   */
  isBlocked(permissionId: string): boolean {
    return this.blockedPermissions.includes(permissionId) ? true : false;
  }

  /**
   * Check if permission is overridden
   */
  isOverridden(permissionId: string): boolean {
    return this.overriddenPermissions.includes(permissionId) ? true : false;
  }
}

/**
 * Domain permission context
 */
export class DomainPermissionContext {
  domainId: DomainId;
  permissions: Map<string, Permission>;
  roles: Map<string, Role>;
  inheritanceRule: InheritanceRule | null;
  parentContext: DomainPermissionContext | null;
  childContexts: Array<DomainPermissionContext>;

  constructor(domainId: DomainId) {
    this.domainId = domainId;
    this.permissions = new Map<string, Permission>();
    this.roles = new Map<string, Role>();
    this.inheritanceRule = null;
    this.parentContext = null;
    this.childContexts = new Array<DomainPermissionContext>();
  }

  /**
   * Set inheritance rule
   */
  setInheritanceRule(rule: InheritanceRule): void {
    this.inheritanceRule = rule;
  }

  /**
   * Set parent context
   */
  setParentContext(parent: DomainPermissionContext): void {
    this.parentContext = parent;
    parent.childContexts.push(this);
  }

  /**
   * Add permission to context
   */
  addPermission(permission: Permission): void {
    this.permissions.set(permission.getId(), permission);
  }

  /**
   * Add role to context
   */
  addRole(role: Role): void {
    this.roles.set(role.getId(), role);
  }

  /**
   * Get effective permissions (including inherited)
   */
  getEffectivePermissions(): Map<string, Permission> {
    const effective = new Map<string, Permission>();
    
    // Add direct permissions
    const directPermissions = this.permissions.keys();
    for (let i = 0; i < directPermissions.length; i++) {
      const permissionId = directPermissions[i];
      const permission = this.permissions.get(permissionId);
      if (permission) {
        effective.set(permissionId, permission);
      }
    }

    // Add inherited permissions
    if (this.parentContext && this.inheritanceRule) {
      const parentPermissions = this.parentContext.getEffectivePermissions();
      const parentPermissionIds = parentPermissions.keys();
      
      for (let i = 0; i < parentPermissionIds.length; i++) {
        const permissionId = parentPermissionIds[i];
        const permission = parentPermissions.get(permissionId);
        
        if (permission && this.shouldInheritPermission(permissionId)) {
          effective.set(permissionId, permission);
        }
      }
    }

    return effective;
  }

  /**
   * Check if permission should be inherited
   */
  private shouldInheritPermission(permissionId: string): boolean {
    if (!this.inheritanceRule) return false;

    switch (this.inheritanceRule.mode) {
      case InheritanceMode.NONE:
        return false;
      
      case InheritanceMode.ADDITIVE:
        return !this.inheritanceRule.isBlocked(permissionId);
      
      case InheritanceMode.RESTRICTIVE:
        return this.inheritanceRule.isInherited(permissionId) && 
               !this.inheritanceRule.isBlocked(permissionId);
      
      case InheritanceMode.OVERRIDE:
        return !this.inheritanceRule.isOverridden(permissionId) && 
               !this.inheritanceRule.isBlocked(permissionId);
    }

    return false;
  }

  /**
   * Get effective roles (including inherited)
   */
  getEffectiveRoles(): Map<string, Role> {
    const effective = new Map<string, Role>();
    
    // Add direct roles
    const directRoles = this.roles.keys();
    for (let i = 0; i < directRoles.length; i++) {
      const roleId = directRoles[i];
      const role = this.roles.get(roleId);
      if (role) {
        effective.set(roleId, role);
      }
    }

    // Add inherited roles (simplified - similar logic to permissions)
    if (this.parentContext && this.inheritanceRule && 
        this.inheritanceRule.mode != InheritanceMode.NONE) {
      const parentRoles = this.parentContext.getEffectiveRoles();
      const parentRoleIds = parentRoles.keys();
      
      for (let i = 0; i < parentRoleIds.length; i++) {
        const roleId = parentRoleIds[i];
        const role = parentRoles.get(roleId);
        
        if (role && !effective.has(roleId)) {
          effective.set(roleId, role);
        }
      }
    }

    return effective;
  }

  /**
   * Check if context has permission
   */
  hasPermission(permissionId: string): boolean {
    const effectivePermissions = this.getEffectivePermissions();
    return effectivePermissions.has(permissionId) ? true : false;
  }

  /**
   * Check if context has role
   */
  hasRole(roleId: string): boolean {
    const effectiveRoles = this.getEffectiveRoles();
    return effectiveRoles.has(roleId) ? true : false;
  }
}

/**
 * Permission inheritance manager
 */
export class PermissionInheritanceManager extends BaseSerializable {
  private contexts: Map<DomainId, DomainPermissionContext>;
  private rules: Map<DomainId, InheritanceRule>;
  private domainHierarchy: Map<DomainId, DomainId>; // child -> parent

  constructor() {
    super();
    this.contexts = new Map<DomainId, DomainPermissionContext>();
    this.rules = new Map<DomainId, InheritanceRule>();
    this.domainHierarchy = new Map<DomainId, DomainId>();
  }

  /**
   * Register domain in hierarchy
   */
  registerDomain(domainId: DomainId, parentDomainId: DomainId | null): void {
    const context = new DomainPermissionContext(domainId);
    this.contexts.set(domainId, context);

    if (parentDomainId) {
      this.domainHierarchy.set(domainId, parentDomainId);
      const parentContext = this.contexts.get(parentDomainId);
      if (parentContext) {
        context.setParentContext(parentContext);
      }
    }
  }

  /**
   * Set inheritance rule for domain
   */
  setInheritanceRule(
    domainId: DomainId,
    parentDomainId: DomainId | null,
    mode: InheritanceMode
  ): void {
    const rule = new InheritanceRule(domainId, parentDomainId, mode);
    this.rules.set(domainId, rule);

    const context = this.contexts.get(domainId);
    if (context) {
      context.setInheritanceRule(rule);
    }

    // Log rule creation
    globalAuditTrail.logEvent(
      AuditEventType.PERMISSION_GRANTED,
      "system",
      "domain",
      domainId,
      `Inheritance rule set: mode=${mode}`,
      AuditSeverity.INFO
    );
  }

  /**
   * Add permission to domain
   */
  addPermissionToDomain(domainId: DomainId, permission: Permission): void {
    const context = this.contexts.get(domainId);
    if (context) {
      context.addPermission(permission);
    }
  }

  /**
   * Add role to domain
   */
  addRoleToDomain(domainId: DomainId, role: Role): void {
    const context = this.contexts.get(domainId);
    if (context) {
      context.addRole(role);
    }
  }

  /**
   * Get effective permissions for domain
   */
  getEffectivePermissions(domainId: DomainId): Map<string, Permission> {
    const context = this.contexts.get(domainId);
    if (context) {
      return context.getEffectivePermissions();
    }
    return new Map<string, Permission>();
  }

  /**
   * Get effective roles for domain
   */
  getEffectiveRoles(domainId: DomainId): Map<string, Role> {
    const context = this.contexts.get(domainId);
    if (context) {
      return context.getEffectiveRoles();
    }
    return new Map<string, Role>();
  }

  /**
   * Check if domain has permission
   */
  domainHasPermission(domainId: DomainId, permissionId: string): boolean {
    const context = this.contexts.get(domainId);
    if (context) {
      return context.hasPermission(permissionId);
    }
    return false;
  }

  /**
   * Check if domain has role
   */
  domainHasRole(domainId: DomainId, roleId: string): boolean {
    const context = this.contexts.get(domainId);
    if (context) {
      return context.hasRole(roleId);
    }
    return false;
  }

  /**
   * Update inheritance rule
   */
  updateInheritanceRule(domainId: DomainId, mode: InheritanceMode): void {
    const rule = this.rules.get(domainId);
    if (rule) {
      rule.mode = mode;
      
      // Log rule update
      globalAuditTrail.logEvent(
        AuditEventType.PERMISSION_REVOKED,
        "system",
        "domain",
        domainId,
        `Inheritance rule updated: mode=${mode}`,
        AuditSeverity.INFO
      );
    }
  }

  /**
   * Get domain hierarchy path
   */
  getDomainPath(domainId: DomainId): Array<DomainId> {
    const path = new Array<DomainId>();
    let current = domainId;
    
    while (current) {
      path.push(current);
      const parent = this.domainHierarchy.get(current);
      if (parent) {
        current = parent;
      } else {
        break;
      }
    }
    
    return path;
  }

  /**
   * Validate inheritance hierarchy
   */
  validateHierarchy(): boolean {
    // Check for cycles in domain hierarchy
    const visited = new Set<DomainId>();
    const domainIds = this.domainHierarchy.keys();
    
    for (let i = 0; i < domainIds.length; i++) {
      const domainId = domainIds[i];
      if (this.hasCycle(domainId, visited)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check for cycles in domain hierarchy
   */
  private hasCycle(domainId: DomainId, visited: Set<DomainId>): boolean {
    if (visited.has(domainId)) {
      return true;
    }
    
    visited.add(domainId);
    const parent = this.domainHierarchy.get(domainId);
    if (parent) {
      return this.hasCycle(parent, visited);
    }
    
    visited.delete(domainId);
    return false;
  }

  // Serialization
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    return `{"contexts":${this.contexts.size},"rules":${this.rules.size}}`;
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
 * Global permission inheritance manager
 */
export const globalPermissionInheritance = new PermissionInheritanceManager();