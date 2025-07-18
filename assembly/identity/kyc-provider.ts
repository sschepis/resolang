/**
 * KYC (Know Your Customer) Provider Implementation
 * Handles identity verification at different levels
 */

import { IKYCProvider, KYCLevel, IIdentity, KYCVerificationStatus, KYCVerificationResult } from "./interfaces";
import { IdentityId, Timestamp } from "./types";
import { BaseSerializable } from "../core/interfaces";
import { JSONBuilder } from "../core/serialization";

/**
 * KYC verification request
 */
export class KYCRequest {
  id: string;
  identityId: IdentityId;
  requestedLevel: KYCLevel;
  currentLevel: KYCLevel;
  documents: Map<string, string>;
  status: string; // "pending", "approved", "rejected"
  createdAt: Timestamp;
  updatedAt: Timestamp;
  verifierId: string | null;
  rejectionReason: string | null;

  constructor(identityId: IdentityId, requestedLevel: KYCLevel, currentLevel: KYCLevel) {
    this.id = "kyc-" + Date.now().toString();
    this.identityId = identityId;
    this.requestedLevel = requestedLevel;
    this.currentLevel = currentLevel;
    this.documents = new Map<string, string>();
    this.status = "pending";
    this.createdAt = Date.now();
    this.updatedAt = this.createdAt;
    this.verifierId = null;
    this.rejectionReason = null;
  }

  addDocument(type: string, documentHash: string): void {
    this.documents.set(type, documentHash);
    this.updatedAt = Date.now();
  }
}

/**
 * Base KYC Provider implementation
 */
export class BaseKYCProvider extends BaseSerializable implements IKYCProvider {
  protected providerId: string;
  protected name: string;
  protected supportedLevels: Array<KYCLevel>;
  protected verifications: Map<string, KYCVerificationResult>;
  protected trustedVerifiers: Set<string>;

  constructor(providerId: string, name: string) {
    super();
    this.providerId = providerId;
    this.name = name;
    this.supportedLevels = new Array<KYCLevel>();
    this.verifications = new Map<string, KYCVerificationResult>();
    this.trustedVerifiers = new Set<string>();

    // Initialize supported levels
    this.supportedLevels.push(KYCLevel.BASIC);
    this.supportedLevels.push(KYCLevel.ENHANCED);
    this.supportedLevels.push(KYCLevel.FULL);
  }

  /**
   * Get provider name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get supported KYC levels
   */
  getSupportedLevels(): KYCLevel[] {
    return this.supportedLevels;
  }

  /**
   * Initiate verification process
   */
  initiateVerification(identity: IIdentity, level: KYCLevel): string {
    const verificationId = "kyc-" + this.providerId + "-" + Date.now().toString();
    
    const result: KYCVerificationResult = {
      verificationId: verificationId,
      identityId: identity.getId(),
      level: level,
      status: KYCVerificationStatus.PENDING,
      verifiedAt: 0,
      expiresAt: 0,
      verifiedData: new Map<string, string>(),
      provider: this.providerId
    };
    
    this.verifications.set(verificationId, result);
    
    // Start verification process
    this.performVerification(identity, level, verificationId);
    
    return verificationId;
  }

  /**
   * Check verification status
   */
  checkVerificationStatus(verificationId: string): KYCVerificationStatus {
    const result = this.verifications.get(verificationId);
    return result ? result.status : KYCVerificationStatus.FAILED;
  }

  /**
   * Get verification result
   */
  getVerificationResult(verificationId: string): KYCVerificationResult | null {
    return this.verifications.get(verificationId);
  }


  /**
   * Add a trusted verifier
   */
  addTrustedVerifier(verifierId: string): void {
    this.trustedVerifiers.add(verifierId);
  }

  /**
   * Perform actual verification (to be overridden by specific providers)
   */
  protected performVerification(identity: IIdentity, level: KYCLevel, verificationId: string): void {
    const result = this.verifications.get(verificationId);
    if (!result) return;
    
    result.status = KYCVerificationStatus.IN_PROGRESS;
    
    // Base implementation - simulate verification based on level
    let verified = false;
    switch (level) {
      case KYCLevel.BASIC:
        verified = this.verifyBasic(identity);
        break;
      case KYCLevel.ENHANCED:
        verified = this.verifyEnhanced(identity);
        break;
      case KYCLevel.FULL:
        verified = this.verifyFull(identity);
        break;
    }
    
    if (verified) {
      result.status = KYCVerificationStatus.COMPLETED;
      result.verifiedAt = Date.now();
      result.expiresAt = result.verifiedAt + 365 * 24 * 60 * 60 * 1000; // 1 year
      identity.setKYCLevel(level);
    } else {
      result.status = KYCVerificationStatus.FAILED;
    }
  }

  /**
   * Basic verification (email/phone)
   */
  protected verifyBasic(identity: IIdentity): boolean {
    const metadata = identity.getMetadata();
    const hasEmail = metadata.has("email");
    const hasPhone = metadata.has("phone");
    
    // Require at least email or phone
    return (hasEmail || hasPhone) as boolean;
  }

  /**
   * Enhanced verification (government ID)
   */
  protected verifyEnhanced(identity: IIdentity): boolean {
    // In a real implementation, this would check documents
    // For now, check if identity has required metadata
    const metadata = identity.getMetadata();
    return metadata.has("government_id") as boolean;
  }

  /**
   * Full verification (comprehensive)
   */
  protected verifyFull(identity: IIdentity): boolean {
    // In a real implementation, this would do comprehensive checks
    // For now, check multiple metadata fields
    const metadata = identity.getMetadata();
    const hasGovId = metadata.has("government_id");
    const hasAddress = metadata.has("address");
    const hasBank = metadata.has("bank_verified");
    
    return (hasGovId && hasAddress && hasBank) as boolean;
  }

  // Implement abstract toString method
  toString(): string {
    return this.toJSON();
  }

  // Serialization methods
  toJSON(): string {
    return `{"providerId":"${this.providerId}","name":"${this.name}","verifications":${this.verifications.size}}`;
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
 * Automated KYC Provider for testing
 */
export class AutomatedKYCProvider extends BaseKYCProvider {
  private autoApproveThreshold: KYCLevel;

  constructor() {
    super("automated-kyc", "Automated KYC Provider");
    this.autoApproveThreshold = KYCLevel.ENHANCED;
  }

  protected performVerification(identity: IIdentity, level: KYCLevel, verificationId: string): void {
    const result = this.verifications.get(verificationId);
    if (!result) return;
    
    result.status = KYCVerificationStatus.IN_PROGRESS;
    
    // Auto-approve up to threshold
    if (level <= this.autoApproveThreshold) {
      result.status = KYCVerificationStatus.COMPLETED;
      result.verifiedAt = Date.now();
      result.expiresAt = result.verifiedAt + 365 * 24 * 60 * 60 * 1000;
      identity.setKYCLevel(level);
    } else {
      // For FULL level, use base implementation
      super.performVerification(identity, level, verificationId);
    }
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * Manual KYC Provider requiring human verification
 */
export class ManualKYCProvider extends BaseKYCProvider {
  private approvedIdentities: Set<string>;

  constructor() {
    super("manual-kyc", "Manual KYC Provider");
    this.approvedIdentities = new Set<string>();
  }

  /**
   * Manually approve an identity
   */
  approveIdentity(identityId: string, level: KYCLevel, verificationId: string): boolean {
    const result = this.verifications.get(verificationId);
    if (!result || result.identityId != identityId) {
      return false;
    }
    
    this.approvedIdentities.add(identityId + ":" + level.toString());
    result.status = KYCVerificationStatus.COMPLETED;
    result.verifiedAt = Date.now();
    result.expiresAt = result.verifiedAt + 365 * 24 * 60 * 60 * 1000;
    
    return true;
  }

  protected performVerification(identity: IIdentity, level: KYCLevel, verificationId: string): void {
    const result = this.verifications.get(verificationId);
    if (!result) return;
    
    // Check if manually approved
    const key = identity.getId() + ":" + level.toString();
    if (this.approvedIdentities.has(key)) {
      result.status = KYCVerificationStatus.COMPLETED;
      result.verifiedAt = Date.now();
      result.expiresAt = result.verifiedAt + 365 * 24 * 60 * 60 * 1000;
      identity.setKYCLevel(level);
    } else {
      result.status = KYCVerificationStatus.PENDING; // Wait for manual approval
    }
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * Global KYC provider registry
 */
export class KYCProviderRegistry {
  private static providers: Map<string, IKYCProvider> = new Map<string, IKYCProvider>();
  private static defaultProvider: string = "automated-kyc";

  /**
   * Register a KYC provider
   */
  static registerProvider(providerId: string, provider: IKYCProvider): void {
    this.providers.set(providerId, provider);
  }

  /**
   * Get a provider by ID
   */
  static getProvider(providerId: string): IKYCProvider | null {
    return this.providers.get(providerId);
  }

  /**
   * Get the default provider
   */
  static getDefaultProvider(): IKYCProvider | null {
    return this.providers.get(this.defaultProvider);
  }

  /**
   * Set the default provider
   */
  static setDefaultProvider(providerId: string): void {
    if (this.providers.has(providerId)) {
      this.defaultProvider = providerId;
    }
  }

  /**
   * Initialize with default providers
   */
  static initialize(): void {
    // Register automated provider
    const automated = new AutomatedKYCProvider();
    this.registerProvider("automated-kyc", automated);
    
    // Register manual provider
    const manual = new ManualKYCProvider();
    this.registerProvider("manual-kyc", manual);
  }
}

// Initialize the registry
KYCProviderRegistry.initialize();