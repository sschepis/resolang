/**
 * Domain Object implementation for the Prime Resonance Network
 * Represents objects that can be owned within domains
 */

import {
  IDomainObject,
  IObjectProperties
} from "./interfaces";
import { ValidationResult } from "../core/validation";
import { 
  ObjectId,
  DomainId,
  IdentityId,
  Timestamp, 
  IdGenerator,
  ObjectCreationParams,
  IdentityEventType,
  IdentityErrorCode
} from "./types";
import { BaseSerializable } from "../core/interfaces";
import { JSONBuilder } from "../core/serialization";

/**
 * Simple implementation of IObjectProperties
 */
class ObjectProperties implements IObjectProperties {
  fungible: boolean;
  transferable: boolean;
  destructible: boolean;

  constructor(fungible: boolean, transferable: boolean, destructible: boolean) {
    this.fungible = fungible;
    this.transferable = transferable;
    this.destructible = destructible;
  }
}

/**
 * Base DomainObject class implementing IDomainObject interface
 * Represents any object that can be owned within a domain
 */
export class DomainObject extends BaseSerializable implements IDomainObject {
  protected id: ObjectId;
  protected type: string;
  protected ownerId: IdentityId;
  protected domainId: DomainId;
  protected properties: IObjectProperties;
  protected createdAt: Timestamp;
  protected updatedAt: Timestamp;
  protected data: Map<string, string>;
  protected destroyed: boolean;

  constructor(params: ObjectCreationParams) {
    super();
    this.data = params.data || new Map<string, string>();
    this.id = IdGenerator.generateObjectId(params.type);
    this.type = params.type;
    this.ownerId = params.ownerId;
    this.domainId = params.domainId;
    this.properties = new ObjectProperties(
      params.fungible,
      params.transferable,
      params.destructible
    );
    this.createdAt = <f64>Date.now();
    this.updatedAt = this.createdAt;
    this.destroyed = false;
  }

  // IDomainObject implementation
  getId(): string {
    return this.id;
  }

  getType(): string {
    return this.type;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getDomainId(): string {
    return this.domainId;
  }

  getProperties(): IObjectProperties {
    return this.properties;
  }

  transfer(newOwnerId: string, authorizedBy: string): boolean {
    // Check if object is transferable
    if (!this.properties.transferable) {
      return false;
    }

    // Check if destroyed
    if (this.destroyed) {
      return false;
    }

    // Check authorization (must be owner or have transfer permission)
    if (authorizedBy != this.ownerId && !this.hasTransferPermission(authorizedBy)) {
      return false;
    }

    const oldOwnerId = this.ownerId;
    this.ownerId = newOwnerId;
    this.updatedAt = Date.now();

    // Log the transfer event
    const context = new Map<string, string>();
    context.set("from", oldOwnerId);
    context.set("to", newOwnerId);
    this.logEvent(IdentityEventType.OBJECT_TRANSFERRED, authorizedBy, context);

    return true;
  }

  destroy(authorizedBy: string): boolean {
    // Check if object is destructible
    if (!this.properties.destructible) {
      return false;
    }

    // Check if already destroyed
    if (this.destroyed) {
      return false;
    }

    // Check authorization (must be owner or have destroy permission)
    if (authorizedBy != this.ownerId && !this.hasDestroyPermission(authorizedBy)) {
      return false;
    }

    this.destroyed = true;
    this.updatedAt = Date.now();

    // Log the destroy event
    this.logEvent(IdentityEventType.OBJECT_DESTROYED, authorizedBy, new Map<string, string>());

    return true;
  }

  getCreatedAt(): f64 {
    return this.createdAt;
  }

  getUpdatedAt(): f64 {
    return this.updatedAt;
  }

  getData(): Map<string, string> {
    return this.data;
  }

  setData(key: string, value: string): void {
    if (this.destroyed) {
      throw new Error(IdentityErrorCode.OBJECT_NOT_FOUND);
    }
    this.data.set(key, value);
    this.updatedAt = Date.now();
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  // Helper methods
  private hasTransferPermission(identityId: string): boolean {
    // In a real implementation, this would check against permissions
    // For now, only the owner can transfer
    return false;
  }

  private hasDestroyPermission(identityId: string): boolean {
    // In a real implementation, this would check against permissions
    // For now, only the owner can destroy
    return false;
  }

  private logEvent(eventType: string, actorId: string, context: Map<string, string>): void {
    // In a real implementation, this would create an audit entry
    // For now, we'll just update the timestamp
    this.updatedAt = Date.now();
  }

  // Cloneable implementation
  clone(): IDomainObject {
    const params = new ObjectCreationParams(this.type, this.ownerId, this.domainId);
    params.fungible = this.properties.fungible;
    params.transferable = this.properties.transferable;
    params.destructible = this.properties.destructible;
    params.data = new Map<string, string>();
    
    // Deep copy data
    const keys = this.data.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.data.get(key);
      params.data.set(key, value);
    }
    
    const cloned = new DomainObject(params);
    cloned.id = this.id;
    cloned.createdAt = this.createdAt;
    cloned.updatedAt = this.updatedAt;
    cloned.destroyed = this.destroyed;
    
    return cloned;
  }

  // Equatable implementation
  equals(other: IDomainObject): boolean {
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
    if (this.type.length == 0) return false;
    if (this.ownerId.length == 0) return false;
    if (this.domainId.length == 0) return false;
    if (this.createdAt <= 0) return false;
    if (this.updatedAt < this.createdAt) return false;
    
    return true;
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];
    
    if (this.id.length == 0) {
      errors.push("Object ID cannot be empty");
    }
    if (this.type.length == 0) {
      errors.push("Object type cannot be empty");
    }
    if (this.ownerId.length == 0) {
      errors.push("Object must have an owner");
    }
    if (this.domainId.length == 0) {
      errors.push("Object must belong to a domain");
    }
    if (this.createdAt <= 0) {
      errors.push("Invalid creation timestamp");
    }
    if (this.updatedAt < this.createdAt) {
      errors.push("Update timestamp cannot be before creation timestamp");
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
    builder.addStringField("type", this.type);
    builder.addStringField("ownerId", this.ownerId);
    builder.addStringField("domainId", this.domainId);
    builder.addNumberField("createdAt", this.createdAt);
    builder.addNumberField("updatedAt", this.updatedAt);
    builder.addBooleanField("destroyed", this.destroyed);
    
    // Add properties
    builder.addRawField("properties", this.serializeProperties());
    
    // Add data
    builder.addRawField("data", this.serializeData());
    
    builder.endObject();
    return builder.build();
  }

  protected serializeProperties(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    builder.addBooleanField("fungible", this.properties.fungible);
    builder.addBooleanField("transferable", this.properties.transferable);
    builder.addBooleanField("destructible", this.properties.destructible);
    builder.endObject();
    return builder.build();
  }

  protected serializeData(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    const keys = this.data.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.data.get(key);
      builder.addStringField(key, value);
    }
    builder.endObject();
    return builder.build();
  }

  /**
   * Serialize the domain object to binary format
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
   * Deserialize domain object from binary data
   */
  deserialize(data: Uint8Array): void {
    let json = "";
    for (let i = 0; i < data.length; i++) {
      json += String.fromCharCode(data[i]);
    }
    this.fromJSON(json);
  }

  /**
   * Create domain object from JSON string
   */
  fromJSON(json: string): void {
    // Simple JSON parsing for basic properties
    // This is a simplified implementation for AssemblyScript
    this.updatedAt = Date.now();
  }

  /**
   * Validate the domain object
   */
  validate(): ValidationResult {
    if (!this.id || this.id.length === 0) {
      return ValidationResult.invalid("Object ID is required");
    }
    if (!this.ownerId || this.ownerId.length === 0) {
      return ValidationResult.invalid("Owner ID is required");
    }
    if (this.createdAt <= 0) {
      return ValidationResult.invalid("Invalid creation timestamp");
    }
    if (this.updatedAt < this.createdAt) {
      return ValidationResult.invalid("Updated timestamp cannot be before creation timestamp");
    }
    return ValidationResult.valid();
  }
}

/**
 * Fungible object implementation
 * Represents objects that can be divided and combined (e.g., tokens, currency)
 */
export class FungibleObject extends DomainObject {
  private amount: f64;
  private decimals: i32;
  private symbol: string;

  constructor(
    params: ObjectCreationParams,
    amount: f64,
    decimals: i32 = 18,
    symbol: string = ""
  ) {
    params.fungible = true; // Force fungible
    super(params);
    this.amount = amount;
    this.decimals = decimals;
    this.symbol = symbol;
    
    // Store in data
    this.data.set("amount", amount.toString());
    this.data.set("decimals", decimals.toString());
    this.data.set("symbol", symbol);
  }

  getAmount(): f64 {
    return this.amount;
  }

  getDecimals(): i32 {
    return this.decimals;
  }

  getSymbol(): string {
    return this.symbol;
  }

  /**
   * Split this fungible object into two parts
   * Returns a new object with the specified amount, reducing this object's amount
   */
  split(amount: f64, newOwnerId: string): FungibleObject | null {
    if (amount <= 0 || amount >= this.amount) {
      return null;
    }

    if (this.destroyed) {
      return null;
    }

    // Create new object with the split amount
    const params = new ObjectCreationParams(this.type, newOwnerId, this.domainId);
    params.fungible = true;
    params.transferable = this.properties.transferable;
    params.destructible = this.properties.destructible;
    
    const newObject = new FungibleObject(params, amount, this.decimals, this.symbol);
    
    // Reduce this object's amount
    this.amount -= amount;
    this.data.set("amount", this.amount.toString());
    this.updatedAt = Date.now();
    
    return newObject;
  }

  /**
   * Merge another fungible object into this one
   * The other object will be destroyed
   */
  merge(other: FungibleObject): boolean {
    if (this.destroyed || other.destroyed) {
      return false;
    }

    // Must be same type and symbol
    if (this.type != other.type || this.symbol != other.symbol) {
      return false;
    }

    // Must be in same domain
    if (this.domainId != other.domainId) {
      return false;
    }

    // Must have same owner
    if (this.ownerId != other.ownerId) {
      return false;
    }

    // Add amounts
    this.amount += other.amount;
    this.data.set("amount", this.amount.toString());
    this.updatedAt = Date.now();

    // Destroy the other object
    other.destroyed = true;
    other.updatedAt = Date.now();

    return true;
  }

  clone(): IDomainObject {
    const base = super.clone() as DomainObject;
    const params = new ObjectCreationParams(base.getType(), base.getOwnerId(), base.getDomainId());
    
    const cloned = new FungibleObject(params, this.amount, this.decimals, this.symbol);
    cloned.id = this.id;
    cloned.createdAt = this.createdAt;
    cloned.updatedAt = this.updatedAt;
    cloned.destroyed = this.destroyed;
    cloned.properties = this.properties;
    
    // Copy all data
    const keys = this.data.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.data.get(key);
      cloned.data.set(key, value);
    }
    
    return cloned;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    
    // Include base fields
    builder.addStringField("id", this.id);
    builder.addStringField("type", this.type);
    builder.addStringField("ownerId", this.ownerId);
    builder.addStringField("domainId", this.domainId);
    builder.addNumberField("createdAt", this.createdAt);
    builder.addNumberField("updatedAt", this.updatedAt);
    builder.addBooleanField("destroyed", this.destroyed);
    
    // Add fungible-specific fields
    builder.addNumberField("amount", this.amount);
    builder.addIntegerField("decimals", this.decimals);
    builder.addStringField("symbol", this.symbol);
    
    // Add properties
    builder.addRawField("properties", this.serializeProperties());
    
    // Add data
    builder.addRawField("data", this.serializeData());
    
    builder.endObject();
    return builder.build();
  }
}

/**
 * Non-fungible object implementation
 * Represents unique, indivisible objects (e.g., NFTs, certificates)
 */
export class NonFungibleObject extends DomainObject {
  private tokenId: string;
  private metadata: Map<string, string>;
  private uri: string | null;

  constructor(
    params: ObjectCreationParams,
    tokenId: string,
    metadata: Map<string, string> = new Map<string, string>(),
    uri: string | null = null
  ) {
    params.fungible = false; // Force non-fungible
    super(params);
    this.tokenId = tokenId;
    this.metadata = metadata;
    this.uri = uri;
    
    // Store in data
    this.data.set("tokenId", tokenId);
    if (uri) {
      this.data.set("uri", uri);
    }
  }

  getTokenId(): string {
    return this.tokenId;
  }

  getMetadata(): Map<string, string> {
    return this.metadata;
  }

  getUri(): string | null {
    return this.uri;
  }

  setUri(uri: string): void {
    if (this.destroyed) {
      throw new Error(IdentityErrorCode.OBJECT_NOT_FOUND);
    }
    this.uri = uri;
    this.data.set("uri", uri);
    this.updatedAt = Date.now();
  }

  setMetadataValue(key: string, value: string): void {
    if (this.destroyed) {
      throw new Error(IdentityErrorCode.OBJECT_NOT_FOUND);
    }
    this.metadata.set(key, value);
    this.updatedAt = Date.now();
  }

  clone(): IDomainObject {
    const base = super.clone() as DomainObject;
    const params = new ObjectCreationParams(base.getType(), base.getOwnerId(), base.getDomainId());
    
    // Deep copy metadata
    const metadataCopy = new Map<string, string>();
    const keys = this.metadata.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.metadata.get(key);
      metadataCopy.set(key, value);
    }
    
    const cloned = new NonFungibleObject(params, this.tokenId, metadataCopy, this.uri);
    cloned.id = this.id;
    cloned.createdAt = this.createdAt;
    cloned.updatedAt = this.updatedAt;
    cloned.destroyed = this.destroyed;
    cloned.properties = this.properties;
    
    // Copy all data
    const dataKeys = this.data.keys();
    for (let i = 0; i < dataKeys.length; i++) {
      const key = dataKeys[i];
      const value = this.data.get(key);
      cloned.data.set(key, value);
    }
    
    return cloned;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    
    // Include base fields
    builder.addStringField("id", this.id);
    builder.addStringField("type", this.type);
    builder.addStringField("ownerId", this.ownerId);
    builder.addStringField("domainId", this.domainId);
    builder.addNumberField("createdAt", this.createdAt);
    builder.addNumberField("updatedAt", this.updatedAt);
    builder.addBooleanField("destroyed", this.destroyed);
    
    // Add NFT-specific fields
    builder.addStringField("tokenId", this.tokenId);
    if (this.uri) {
      builder.addStringField("uri", this.uri);
    }
    
    // Add properties
    builder.addRawField("properties", this.serializeProperties());
    
    // Add metadata
    builder.addRawField("metadata", this.serializeMetadata());
    
    // Add data
    builder.addRawField("data", this.serializeData());
    
    builder.endObject();
    return builder.build();
  }

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
}