// identity-domain-management.ts
// Demonstrates identity creation, domain management, and permissions in ResoLang

import {
  IdentitySystemFactory,
  Identity,
  SelfSovereignIdentity,
  ManagedIdentity,
  Domain,
  RootDomain,
  DomainObject,
  FungibleObject,
  NonFungibleObject,
  Permission,
  Role,
  PermissionEvaluator,
  KYCLevel,
  GlobalPermissions,
  SystemRoles
} from "../identity/index";
import { toFixed } from "../utils";

/**
 * Example: Creating and Managing Identities
 * Shows how to create different types of identities and manage their properties
 */
export function exampleIdentityCreation(): void {
  console.log("=== Identity Creation and Management Example ===");
  
  // Create self-sovereign identities
  const aliceMetadata = new Map<string, string>();
  aliceMetadata.set("email", "alice@example.com");
  aliceMetadata.set("full_name", "Alice Quantum");
  aliceMetadata.set("public_key", "alice_quantum_key_2025");
  
  const alice = IdentitySystemFactory.createSelfSovereignIdentity(aliceMetadata);
  console.log(`Created self-sovereign identity: ${alice.getId()}`);
  console.log(`Alice KYC Level: ${alice.getKYCLevel()}`);
  console.log(`Alice Type: ${alice.getType()}`);
  
  // Create managed identity  
  const bobMetadata = new Map<string, string>();
  bobMetadata.set("employee_id", "EMP001");
  bobMetadata.set("department", "Quantum Research");
  bobMetadata.set("security_clearance", "Level 3");
  
  const bob = IdentitySystemFactory.createManagedIdentity(
    alice.getId(), // Alice creates Bob's managed identity
    "corp-domain", // Domain ID (will be created later)
    bobMetadata
  );
  console.log(`Created managed identity: ${bob.getId()}`);
  console.log(`Bob's creator: ${bob.getCreatedBy()}`);
  console.log(`Bob's domain: ${bob.getDomainId()}`);
  
  // Update KYC levels
  alice.updateKYCLevel(KYCLevel.ENHANCED);
  bob.updateKYCLevel(KYCLevel.BASIC);
  
  console.log(`Updated KYC - Alice: ${alice.getKYCLevel()}, Bob: ${bob.getKYCLevel()}`);
  
  // Connect identities to Prime Resonance Network
  alice.connectToPrimeResonance("prn-node-alpha-001");
  bob.connectToPrimeResonance("prn-node-beta-002");
  
  console.log(`Alice PRN ID: ${alice.getPrimeResonanceId()}`);
  console.log(`Bob PRN ID: ${bob.getPrimeResonanceId()}`);
}

/**
 * Example: Domain Creation and Hierarchy
 * Demonstrates creating domains, subdomains, and managing membership
 */
export function exampleDomainManagement(): void {
  console.log("\n=== Domain Creation and Management Example ===");
  
  // Create admin identity
  const adminMetadata = new Map<string, string>();
  adminMetadata.set("role", "system_administrator");
  adminMetadata.set("organization", "Quantum Corp");
  
  const admin = IdentitySystemFactory.createSelfSovereignIdentity(adminMetadata);
  admin.updateKYCLevel(KYCLevel.FULL);
  
  // Create root domain
  const corpDomain = IdentitySystemFactory.createRootDomain(
    "quantum-corp.prn",
    admin.getId()
  );
  console.log(`Created root domain: ${corpDomain.getName()}`);
  console.log(`Domain owner: ${corpDomain.getOwner()}`);
  
  // Create subdomains
  const researchDomain = corpDomain.createSubdomain("research", admin.getId());
  const engineeringDomain = corpDomain.createSubdomain("engineering", admin.getId());
  const marketingDomain = corpDomain.createSubdomain("marketing", admin.getId());
  
  console.log(`Created subdomains: ${researchDomain.getName()}, ${engineeringDomain.getName()}, ${marketingDomain.getName()}`);
  
  // Set domain KYC requirements
  corpDomain.setRequiredKYCLevel(KYCLevel.BASIC, admin.getId());
  researchDomain.setRequiredKYCLevel(KYCLevel.ENHANCED, admin.getId());
  engineeringDomain.setRequiredKYCLevel(KYCLevel.STANDARD, admin.getId());
  
  console.log(`Set KYC requirements - Corp: ${corpDomain.getRequiredKYCLevel()}, Research: ${researchDomain.getRequiredKYCLevel()}`);
  
  // Add members to domains
  const researcher1Metadata = new Map<string, string>();
  researcher1Metadata.set("specialization", "quantum_algorithms");
  const researcher1 = IdentitySystemFactory.createManagedIdentity(
    admin.getId(),
    researchDomain.getId(),
    researcher1Metadata
  );
  
  const engineer1Metadata = new Map<string, string>();
  engineer1Metadata.set("specialization", "quantum_hardware");
  const engineer1 = IdentitySystemFactory.createManagedIdentity(
    admin.getId(),
    engineeringDomain.getId(),
    engineer1Metadata
  );
  
  researchDomain.addMember(researcher1.getId(), admin.getId());
  engineeringDomain.addMember(engineer1.getId(), admin.getId());
  
  console.log(`Added members to domains - Research: ${researchDomain.getMembers().length}, Engineering: ${engineeringDomain.getMembers().length}`);
}

/**
 * Example: Creating and Managing Domain Objects
 * Shows creation of fungible and non-fungible objects within domains
 */
export function exampleObjectManagement(): void {
  console.log("\n=== Domain Object Management Example ===");
  
  // Create domain and owner
  const ownerMetadata = new Map<string, string>();
  ownerMetadata.set("role", "asset_manager");
  const owner = IdentitySystemFactory.createSelfSovereignIdentity(ownerMetadata);
  
  const assetDomain = IdentitySystemFactory.createRootDomain("assets.prn", owner.getId());
  
  // Create fungible tokens (currency-like)
  const quantumCoin = IdentitySystemFactory.createFungibleObject(
    "quantum_coin",
    owner.getId(),
    assetDomain.getId(),
    1000000.0, // 1 million tokens
    8, // 8 decimal places
    "QC" // Symbol
  );
  
  console.log(`Created fungible token: ${quantumCoin.getType()}`);
  console.log(`Total supply: ${quantumCoin.getAmount()} ${quantumCoin.getSymbol()}`);
  console.log(`Decimals: ${quantumCoin.getDecimals()}`);
  
  // Create research credits
  const researchCredits = IdentitySystemFactory.createFungibleObject(
    "research_credit",
    owner.getId(),
    assetDomain.getId(),
    50000.0,
    2,
    "RC"
  );
  
  // Create non-fungible tokens (unique assets)
  const certificateMetadata = new Map<string, string>();
  certificateMetadata.set("course", "Quantum Computing Fundamentals");
  certificateMetadata.set("institution", "Quantum University");
  certificateMetadata.set("grade", "A+");
  certificateMetadata.set("issue_date", "2025-01-15");
  
  const certificate = IdentitySystemFactory.createNonFungibleObject(
    "certificate",
    owner.getId(),
    assetDomain.getId(),
    "CERT-QCF-2025-001",
    certificateMetadata,
    "https://quantum-university.edu/certificates/QCF-2025-001"
  );
  
  console.log(`Created certificate NFT: ${certificate.getTokenId()}`);
  console.log(`Certificate course: ${certificate.getData().get("course")}`);
  console.log(`Certificate URI: ${certificate.getURI()}`);
  
  // Create quantum experiment results NFT
  const experimentMetadata = new Map<string, string>();
  experimentMetadata.set("experiment_id", "QE-2025-042");
  experimentMetadata.set("protocol", "Bell State Measurement");
  experimentMetadata.set("fidelity", "99.7%");
  experimentMetadata.set("timestamp", "2025-01-20T10:30:00Z");
  
  const experimentResult = IdentitySystemFactory.createNonFungibleObject(
    "experiment_result",
    owner.getId(),
    assetDomain.getId(),
    "QE-2025-042-RESULT",
    experimentMetadata,
    "ipfs://QmExperimentResult042"
  );
  
  console.log(`Created experiment result NFT: ${experimentResult.getTokenId()}`);
  console.log(`Experiment fidelity: ${experimentResult.getData().get("fidelity")}`);
}

/**
 * Example: Object Transfer and Splitting Operations
 * Demonstrates transferring ownership and splitting fungible objects
 */
export function exampleObjectTransfers(): void {
  console.log("\n=== Object Transfer and Operations Example ===");
  
  // Create users and domain
  const alice = IdentitySystemFactory.createSelfSovereignIdentity(new Map<string, string>());
  const bob = IdentitySystemFactory.createSelfSovereignIdentity(new Map<string, string>());
  const domain = IdentitySystemFactory.createRootDomain("transfers.prn", alice.getId());
  
  // Create fungible tokens
  const tokens = IdentitySystemFactory.createFungibleObject(
    "transfer_token",
    alice.getId(),
    domain.getId(),
    1000.0,
    2,
    "TT"
  );
  
  console.log(`Alice initial balance: ${tokens.getAmount()} ${tokens.getSymbol()}`);
  
  // Transfer some tokens to Bob
  const transferAmount = 250.0;
  const bobTokens = tokens.split(transferAmount, bob.getId());
  
  if (bobTokens) {
    console.log(`Transfer successful - Alice: ${tokens.getAmount()}, Bob: ${bobTokens.getAmount()}`);
    
    // Bob transfers some back to Alice
    const returnAmount = 50.0;
    const aliceReturn = bobTokens.split(returnAmount, alice.getId());
    
    if (aliceReturn) {
      // Alice merges the returned tokens
      tokens.merge(aliceReturn);
      console.log(`After return and merge - Alice: ${tokens.getAmount()}, Bob: ${bobTokens.getAmount()}`);
    }
  }
  
  // Create and transfer NFT
  const nftMetadata = new Map<string, string>();
  nftMetadata.set("name", "Quantum Artifact");
  nftMetadata.set("rarity", "Legendary");
  
  const artifact = IdentitySystemFactory.createNonFungibleObject(
    "artifact",
    alice.getId(),
    domain.getId(),
    "ARTIFACT-001",
    nftMetadata,
    "https://quantum-artifacts.prn/001"
  );
  
  console.log(`Created artifact owned by: ${artifact.getOwner()}`);
  
  // Transfer NFT to Bob
  const transferSuccess = artifact.transfer(bob.getId(), alice.getId());
  console.log(`NFT transfer to Bob successful: ${transferSuccess}`);
  console.log(`Artifact now owned by: ${artifact.getOwner()}`);
}

/**
 * Example: Permission System and Role-Based Access Control
 * Demonstrates creating permissions, roles, and evaluating access
 */
export function examplePermissionSystem(): void {
  console.log("\n=== Permission System and RBAC Example ===");
  
  // Create global permissions and system roles
  const permissions = IdentitySystemFactory.createGlobalPermissions();
  const roles = IdentitySystemFactory.createSystemRoles(permissions);
  
  console.log(`Created ${permissions.size} global permissions`);
  console.log(`Created ${roles.size} system roles`);
  
  // Create custom domain and permissions
  const admin = IdentitySystemFactory.createSelfSovereignIdentity(new Map<string, string>());
  const domain = IdentitySystemFactory.createRootDomain("rbac-test.prn", admin.getId());
  
  // Create custom role for domain
  const dataScientistRole = IdentitySystemFactory.createRole(
    "Data Scientist",
    "Can analyze quantum data and create reports",
    domain.getId()
  );
  
  // Add permissions to the custom role
  dataScientistRole.addPermission(permissions.get(GlobalPermissions.OBJECT_VIEW)!);
  dataScientistRole.addPermission(permissions.get(GlobalPermissions.OBJECT_CREATE)!);
  dataScientistRole.addPermission(permissions.get(GlobalPermissions.OBJECT_UPDATE)!);
  
  console.log(`Created custom role with ${dataScientistRole.getPermissions().length} permissions`);
  
  // Create user and assign role
  const scientist = IdentitySystemFactory.createManagedIdentity(
    admin.getId(),
    domain.getId(),
    new Map<string, string>()
  );
  
  // Create permission evaluator
  const evaluator = IdentitySystemFactory.createPermissionEvaluator();
  
  // Test permission evaluation
  const userPermissions = new Array<Permission>();
  const userRoles = new Array<Role>();
  userRoles.push(dataScientistRole);
  
  const canView = evaluator.hasPermission(
    userPermissions,
    userRoles,
    permissions.get(GlobalPermissions.OBJECT_VIEW)!,
    domain.getId()
  );
  
  const canDelete = evaluator.hasPermission(
    userPermissions,
    userRoles,
    permissions.get(GlobalPermissions.OBJECT_DELETE)!,
    domain.getId()
  );
  
  console.log(`User can view objects: ${canView}`);
  console.log(`User can delete objects: ${canDelete}`);
  
  // Test system-level permissions
  const adminRole = roles.get(SystemRoles.SUPER_ADMINISTRATOR)!;
  const adminRoles = new Array<Role>();
  adminRoles.push(adminRole);
  
  const adminCanManage = evaluator.hasPermission(
    new Array<Permission>(),
    adminRoles,
    permissions.get(GlobalPermissions.SYSTEM_ADMIN)!,
    domain.getId()
  );
  
  console.log(`Admin can manage system: ${adminCanManage}`);
}

/**
 * Example: Advanced Identity Features
 * Shows identity recovery, authentication, and audit trails
 */
export function exampleAdvancedIdentityFeatures(): void {
  console.log("\n=== Advanced Identity Features Example ===");
  
  // Create identity with recovery setup
  const userMetadata = new Map<string, string>();
  userMetadata.set("email", "user@quantum.prn");
  userMetadata.set("backup_email", "user.backup@quantum.prn");
  
  const user = IdentitySystemFactory.createSelfSovereignIdentity(userMetadata);
  user.updateKYCLevel(KYCLevel.ENHANCED);
  
  // Create recovery identities
  const recovery1 = IdentitySystemFactory.createSelfSovereignIdentity(new Map<string, string>());
  const recovery2 = IdentitySystemFactory.createSelfSovereignIdentity(new Map<string, string>());
  const recovery3 = IdentitySystemFactory.createSelfSovereignIdentity(new Map<string, string>());
  
  // Set up recovery system (requiring 2 out of 3 signatures)
  const recoveryIdentities = new Array<string>();
  recoveryIdentities.push(recovery1.getId());
  recoveryIdentities.push(recovery2.getId());
  recoveryIdentities.push(recovery3.getId());
  
  user.configureRecovery(recoveryIdentities, 2); // 2-of-3 multisig
  console.log(`Configured identity recovery with ${recoveryIdentities.length} recovery identities`);
  console.log(`Recovery threshold: ${user.getRecoveryThreshold()} signatures required`);
  
  // Demonstrate metadata updates
  user.updateMetadata("last_login", "2025-01-20T15:30:00Z");
  user.updateMetadata("login_count", "42");
  
  console.log(`User metadata entries: ${user.getMetadata().size}`);
  console.log(`Last login: ${user.getMetadata().get("last_login")}`);
  
  // Show identity state
  console.log(`User ID: ${user.getId()}`);
  console.log(`User Type: ${user.getType()}`);
  console.log(`KYC Level: ${user.getKYCLevel()}`);
  console.log(`Has Recovery: ${user.getRecoveryIdentities().length > 0}`);
  console.log(`PRN Connected: ${user.getPrimeResonanceId() !== null}`);
}

/**
 * Run all identity and domain management examples
 */
export function runAllIdentityExamples(): void {
  console.log("=== Running All Identity and Domain Management Examples ===\n");
  
  exampleIdentityCreation();
  exampleDomainManagement();
  exampleObjectManagement();
  exampleObjectTransfers();
  examplePermissionSystem();
  exampleAdvancedIdentityFeatures();
  
  console.log("\n=== All Identity and Domain Examples Completed ===");
}