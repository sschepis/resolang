/**
 * Identity and Domain System for the Prime Resonance Network
 * Main export file for all identity-related components
 */

// Export interfaces
export {
  // Core interfaces
  IIdentity,
  IDomain,
  IDomainObject,
  IObjectProperties,
  IPermission,
  IRole,
  
  // KYC interfaces
  IKYCProvider,
  KYCVerificationResult,
  
  // Audit interfaces
  IAuditEntry,
  
  // Recovery interfaces
  IIdentityRecovery,
  
  // Session interfaces
  ISession,
  
  // Registry interfaces
  IDomainRegistry,
  
  // Enums
  IdentityType,
  KYCLevel,
  KYCVerificationStatus,
  PermissionScope,
  AuditAction,
  AuditResult,
  RecoveryMethod
} from "./interfaces";

// Export types
export {
  // Type aliases
  IdentityId,
  DomainId,
  ObjectId,
  Timestamp,
  
  // Creation parameters
  IdentityCreationParams,
  DomainCreationParams,
  ObjectCreationParams,
  
  // Request types
  TransferRequest,
  PermissionRequest,
  AuthCredentials,
  AuthResult,
  RecoveryRequest,
  
  // Constants
  GlobalPermissions,
  SystemRoles,
  IdentityErrorCode,
  IdentityEventType,
  IdentityMetadataKey,
  DomainMetadataKey,
  
  // Utilities
  IdGenerator,
  PermissionBuilder,
  PermissionDefinition,
  AccessDecision
} from "./types";

// Export implementations
export {
  // Identity classes
  Identity,
  SelfSovereignIdentity,
  ManagedIdentity
} from "./identity";

export {
  // Domain classes
  Domain,
  RootDomain
} from "./domain";

export {
  // Object classes
  DomainObject,
  FungibleObject,
  NonFungibleObject
} from "./domain-object";

export {
  // Permission and role classes
  Permission,
  Role,
  PermissionEvaluator
} from "./permissions";

// Export new components that don't conflict with existing exports
export {
  // KYC System
  AutomatedKYCProvider,
  ManualKYCProvider
} from "./kyc-provider";

export {
  // Prime Mapping
  IdentityPrimeMapper,
  globalPrimeMapper
} from "./prime-mapping";

export {
  // Ownership Transfer (excluding duplicates)
  TransferType,
  TransferStatus,
  OwnershipTransferManager,
  globalTransferManager
} from "./ownership-transfer";

export {
  // Audit Trail
  AuditEntry,
  AuditEventType,
  AuditSeverity,
  globalAuditTrail
} from "./audit-trail";

export {
  // ResoLang Integration
  IdentityQuantumState,
  QuantumPermissionEvaluator,
  QuantumTransferProcessor,
  QuantumIdentityRecovery,
  QuantumAuditProcessor,
  IdentityResoLangProcessor,
  globalResoLangProcessor,
  quantumCheckPermission,
  quantumProcessTransfer,
  quantumRecoverIdentity,
  quantumCreateAuditEntry,
  quantumVerifyAuditIntegrity
} from "./resolang-processor";

export {
  // Identity Recovery (excluding duplicates)
  RecoveryConfig,
  RecoveryStatus,
  IdentityRecoveryManager,
  globalRecoveryManager
} from "./identity-recovery";

export {
  // Domain Registry
  DomainRecord,
  DomainStatus,
  DomainNameRules,
  DomainRegistry
} from "./domain-registry";

export {
  // Permission Inheritance
  InheritanceMode,
  InheritanceRule,
  DomainPermissionContext,
  PermissionInheritanceManager,
  globalPermissionInheritance
} from "./permission-inheritance";

export {
  // Authentication
  AuthMethod,
  SessionStatus,
  AuthChallenge,
  AuthSession,
  QuantumAuthenticator,
  AuthenticationManager,
  globalAuthManager
} from "./authentication";

// Re-export ValidationResult from core validation
export { ValidationResult } from "../core/validation";

// Import for internal use in factory
import { Identity } from "./identity";
import { Domain, RootDomain } from "./domain";
import { DomainObject, FungibleObject, NonFungibleObject } from "./domain-object";
import { Permission, Role, PermissionEvaluator } from "./permissions";
import { PermissionScope } from "./interfaces";
import {
  DomainCreationParams,
  ObjectCreationParams,
  GlobalPermissions,
  SystemRoles
} from "./types";

/**
 * Factory class for creating identity system components
 */
export class IdentitySystemFactory {
  /**
   * Create a new self-sovereign identity
   */
  static createSelfSovereignIdentity(metadata: Map<string, string> = new Map<string, string>()): Identity {
    return Identity.createSelfSovereign(metadata);
  }

  /**
   * Create a new managed identity
   */
  static createManagedIdentity(
    creatorId: string,
    domainId: string,
    metadata: Map<string, string> = new Map<string, string>()
  ): Identity {
    return Identity.createManaged(creatorId, domainId, metadata);
  }

  /**
   * Create a new domain
   */
  static createDomain(name: string, ownerId: string, parentId: string | null = null): Domain {
    const params = new DomainCreationParams(name, ownerId);
    params.parentId = parentId;
    return new Domain(params);
  }

  /**
   * Create a new root domain
   */
  static createRootDomain(name: string, ownerId: string): RootDomain {
    const params = new DomainCreationParams(name, ownerId);
    return new RootDomain(params);
  }

  /**
   * Create a new domain object
   */
  static createDomainObject(
    type: string,
    ownerId: string,
    domainId: string,
    fungible: boolean = false,
    transferable: boolean = true,
    destructible: boolean = true
  ): DomainObject {
    const params = new ObjectCreationParams(type, ownerId, domainId);
    params.fungible = fungible;
    params.transferable = transferable;
    params.destructible = destructible;
    return new DomainObject(params);
  }

  /**
   * Create a new fungible object
   */
  static createFungibleObject(
    type: string,
    ownerId: string,
    domainId: string,
    amount: f64,
    decimals: i32 = 18,
    symbol: string = ""
  ): FungibleObject {
    const params = new ObjectCreationParams(type, ownerId, domainId);
    return new FungibleObject(params, amount, decimals, symbol);
  }

  /**
   * Create a new non-fungible object
   */
  static createNonFungibleObject(
    type: string,
    ownerId: string,
    domainId: string,
    tokenId: string,
    metadata: Map<string, string> = new Map<string, string>(),
    uri: string | null = null
  ): NonFungibleObject {
    const params = new ObjectCreationParams(type, ownerId, domainId);
    return new NonFungibleObject(params, tokenId, metadata, uri);
  }

  /**
   * Create a new permission
   */
  static createPermission(
    id: string,
    name: string,
    description: string,
    scope: PermissionScope = PermissionScope.GLOBAL
  ): Permission {
    return Permission.create(id, name, description, scope);
  }

  /**
   * Create a new role
   */
  static createRole(
    name: string,
    description: string,
    domainId: string | null = null
  ): Role {
    return new Role(name, description, domainId);
  }

  /**
   * Create standard global permissions
   */
  static createGlobalPermissions(): Map<string, Permission> {
    return Permission.createGlobalPermissions();
  }

  /**
   * Create standard system roles
   */
  static createSystemRoles(globalPermissions: Map<string, Permission>): Map<string, Role> {
    return Role.createSystemRoles(globalPermissions);
  }

  /**
   * Create a permission evaluator
   */
  static createPermissionEvaluator(): PermissionEvaluator {
    return new PermissionEvaluator();
  }
}

/**
 * Example usage of the identity system
 */
export function exampleUsage(): void {
  // Create a self-sovereign identity
  const userMetadata = new Map<string, string>();
  userMetadata.set("email", "user@example.com");
  userMetadata.set("full_name", "John Doe");
  
  const user = IdentitySystemFactory.createSelfSovereignIdentity(userMetadata);
  console.log("Created user: " + user.getId());

  // Create a root domain
  const domain = IdentitySystemFactory.createRootDomain("example.com", user.getId());
  console.log("Created domain: " + domain.getId());

  // Create a subdomain
  const subdomain = domain.createSubdomain("app", user.getId());
  console.log("Created subdomain: " + subdomain.getId());

  // Create a fungible object (token)
  const token = IdentitySystemFactory.createFungibleObject(
    "token",
    user.getId(),
    domain.getId(),
    1000.0,
    18,
    "TKN"
  );
  console.log("Created token: " + token.getId());

  // Create a non-fungible object (NFT)
  const nftMetadata = new Map<string, string>();
  nftMetadata.set("name", "My NFT");
  nftMetadata.set("description", "A unique digital asset");
  
  const nft = IdentitySystemFactory.createNonFungibleObject(
    "nft",
    user.getId(),
    domain.getId(),
    "NFT-001",
    nftMetadata,
    "https://example.com/nft/001"
  );
  console.log("Created NFT: " + nft.getId());

  // Create permissions and roles
  const permissions = IdentitySystemFactory.createGlobalPermissions();
  const roles = IdentitySystemFactory.createSystemRoles(permissions);
  
  // Create a permission evaluator
  const evaluator = IdentitySystemFactory.createPermissionEvaluator();
  
  // Check permissions
  const domainOwnerRole = roles.get(SystemRoles.DOMAIN_OWNER);
  if (domainOwnerRole) {
    const canTransfer = evaluator.hasPermission(
      [],
      [domainOwnerRole],
      GlobalPermissions.DOMAIN_TRANSFER,
      domain.getId()
    );
    console.log("Can transfer domain: " + canTransfer.toString());
  }
}