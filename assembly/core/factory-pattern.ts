/**
 * Abstract Factory Pattern for Component Instantiation
 * 
 * This module provides abstract factories for creating families of related
 * components with consistent interfaces and behaviors.
 */

import {
  Module,
  ProtocolModule,
  StorageModule,
  CryptoModule,
  TransportModule,
  ModuleStatus,
  ModuleState,
  ModuleMetrics,
  Result,
  KeyPair,
  StorageStats,
  ConnectionHandle,
  ListenerHandle,
  ConnectionStats
} from './module-interfaces';
import { ValidationResult } from './validation';
import { PRNError, ErrorCategory } from './error-handling';
import { PluginMetadata, PluginContext } from './base-interfaces';
import { Event } from './event-system';

/**
 * Component family types
 */
export enum ComponentFamily {
  STANDARD = "standard",
  SECURE = "secure",
  PERFORMANCE = "performance",
  MINIMAL = "minimal"
}

/**
 * Abstract factory interface
 */
export interface AbstractFactory<T> {
  /** Factory name */
  readonly name: string;
  
  /** Create instance */
  create(config: Map<string, string>): T;
  
  /** Validate configuration */
  validateConfig(config: Map<string, string>): ValidationResult;
  
  /** Get factory metadata */
  getMetadata(): FactoryMetadata;
}

/**
 * Factory metadata
 */
export class FactoryMetadata {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly version: string,
    public readonly supportedTypes: string[],
    public readonly requiredConfig: string[],
    public readonly optionalConfig: string[]
  ) {}
}

/**
 * Base abstract factory implementation
 */
export abstract class BaseFactory<T> implements AbstractFactory<T> {
  readonly name: string;
  protected metadata: FactoryMetadata;
  
  constructor(name: string, metadata: FactoryMetadata) {
    this.name = name;
    this.metadata = metadata;
  }
  
  abstract create(config: Map<string, string>): T;
  
  validateConfig(config: Map<string, string>): ValidationResult {
    const errors: string[] = [];
    
    // Check required config
    for (let i = 0; i < this.metadata.requiredConfig.length; i++) {
      const key = this.metadata.requiredConfig[i];
      if (!config.has(key)) {
        errors.push(`Required configuration '${key}' is missing`);
      }
    }
    
    return errors.length > 0
      ? ValidationResult.invalid(errors.join(", "))
      : ValidationResult.valid();
  }
  
  getMetadata(): FactoryMetadata {
    return this.metadata;
  }
}

/**
 * Protocol module factory interface
 */
export interface ProtocolFactory extends AbstractFactory<ProtocolModule> {
  /** Create protocol module for specific family */
  createForFamily(family: ComponentFamily, config: Map<string, string>): ProtocolModule;
}

/**
 * Storage module factory interface
 */
export interface StorageFactory extends AbstractFactory<StorageModule> {
  /** Create storage module for specific family */
  createForFamily(family: ComponentFamily, config: Map<string, string>): StorageModule;
}

/**
 * Crypto module factory interface
 */
export interface CryptoFactory extends AbstractFactory<CryptoModule> {
  /** Create crypto module for specific family */
  createForFamily(family: ComponentFamily, config: Map<string, string>): CryptoModule;
}

/**
 * Transport module factory interface
 */
export interface TransportFactory extends AbstractFactory<TransportModule> {
  /** Create transport module for specific family */
  createForFamily(family: ComponentFamily, config: Map<string, string>): TransportModule;
}

/**
 * Component suite factory - creates families of related components
 */
export abstract class ComponentSuiteFactory {
  readonly family: ComponentFamily;
  
  constructor(family: ComponentFamily) {
    this.family = family;
  }
  
  /** Create protocol module */
  abstract createProtocol(config: Map<string, string>): ProtocolModule;
  
  /** Create storage module */
  abstract createStorage(config: Map<string, string>): StorageModule;
  
  /** Create crypto module */
  abstract createCrypto(config: Map<string, string>): CryptoModule;
  
  /** Create transport module */
  abstract createTransport(config: Map<string, string>): TransportModule;
  
  /** Create complete component suite */
  createSuite(config: Map<string, string>): ComponentSuite {
    return new ComponentSuite(
      this.createProtocol(config),
      this.createStorage(config),
      this.createCrypto(config),
      this.createTransport(config)
    );
  }
}

/**
 * Component suite containing all related modules
 */
export class ComponentSuite {
  constructor(
    public readonly protocol: ProtocolModule,
    public readonly storage: StorageModule,
    public readonly crypto: CryptoModule,
    public readonly transport: TransportModule
  ) {}
  
  /**
   * Initialize all components
   */
  initialize(): ValidationResult {
    const errors: string[] = [];
    
    try {
      this.protocol.initialize();
      this.storage.initialize();
      this.crypto.initialize();
      this.transport.initialize();
    } catch (e) {
      errors.push(`Initialization failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
    
    return errors.length > 0
      ? ValidationResult.invalid(errors.join(", "))
      : ValidationResult.valid();
  }
  
  /**
   * Get all modules as array
   */
  getModules(): Module[] {
    return [
      this.protocol as Module,
      this.storage as Module,
      this.crypto as Module,
      this.transport as Module
    ];
  }
}

/**
 * Standard component suite factory
 */
export class StandardComponentSuiteFactory extends ComponentSuiteFactory {
  constructor() {
    super(ComponentFamily.STANDARD);
  }
  
  createProtocol(config: Map<string, string>): ProtocolModule {
    // Create standard protocol implementation
    return new StandardProtocolModule(config);
  }
  
  createStorage(config: Map<string, string>): StorageModule {
    // Create standard storage implementation
    return new StandardStorageModule(config);
  }
  
  createCrypto(config: Map<string, string>): CryptoModule {
    // Create standard crypto implementation
    return new StandardCryptoModule(config);
  }
  
  createTransport(config: Map<string, string>): TransportModule {
    // Create standard transport implementation
    return new StandardTransportModule(config);
  }
}

/**
 * Secure component suite factory
 */
export class SecureComponentSuiteFactory extends ComponentSuiteFactory {
  constructor() {
    super(ComponentFamily.SECURE);
  }
  
  createProtocol(config: Map<string, string>): ProtocolModule {
    // Create secure protocol with encryption
    config.set("protocol.encryption", "true");
    config.set("protocol.signing", "true");
    return new SecureProtocolModule(config);
  }
  
  createStorage(config: Map<string, string>): StorageModule {
    // Create encrypted storage
    config.set("storage.encryption", "AES-256-GCM");
    return new EncryptedStorageModule(config);
  }
  
  createCrypto(config: Map<string, string>): CryptoModule {
    // Create hardened crypto module
    config.set("crypto.algorithm", "Ed25519");
    config.set("crypto.keySize", "256");
    return new HardenedCryptoModule(config);
  }
  
  createTransport(config: Map<string, string>): TransportModule {
    // Create TLS transport
    config.set("transport.tls", "true");
    config.set("transport.tlsVersion", "1.3");
    return new TLSTransportModule(config);
  }
}

/**
 * Performance-optimized component suite factory
 */
export class PerformanceComponentSuiteFactory extends ComponentSuiteFactory {
  constructor() {
    super(ComponentFamily.PERFORMANCE);
  }
  
  createProtocol(config: Map<string, string>): ProtocolModule {
    // Create high-performance protocol
    config.set("protocol.compression", "lz4");
    config.set("protocol.batchSize", "1000");
    return new HighPerformanceProtocolModule(config);
  }
  
  createStorage(config: Map<string, string>): StorageModule {
    // Create in-memory storage with write-through cache
    config.set("storage.type", "memory");
    config.set("storage.cache", "true");
    return new CachedStorageModule(config);
  }
  
  createCrypto(config: Map<string, string>): CryptoModule {
    // Create optimized crypto with hardware acceleration
    config.set("crypto.hardware", "true");
    return new OptimizedCryptoModule(config);
  }
  
  createTransport(config: Map<string, string>): TransportModule {
    // Create UDP transport for speed
    config.set("transport.protocol", "udp");
    config.set("transport.bufferSize", "65536");
    return new UDPTransportModule(config);
  }
}

/**
 * Minimal component suite factory
 */
export class MinimalComponentSuiteFactory extends ComponentSuiteFactory {
  constructor() {
    super(ComponentFamily.MINIMAL);
  }
  
  createProtocol(config: Map<string, string>): ProtocolModule {
    // Create basic protocol
    return new BasicProtocolModule(config);
  }
  
  createStorage(config: Map<string, string>): StorageModule {
    // Create simple file storage
    config.set("storage.type", "file");
    return new FileStorageModule(config);
  }
  
  createCrypto(config: Map<string, string>): CryptoModule {
    // Create basic crypto
    return new BasicCryptoModule(config);
  }
  
  createTransport(config: Map<string, string>): TransportModule {
    // Create basic TCP transport
    config.set("transport.protocol", "tcp");
    return new TCPTransportModule(config);
  }
}

/**
 * Factory registry for managing factories
 */
export class FactoryRegistry {
  private factories: Map<string, AbstractFactory<any>> = new Map();
  private suiteFactories: Map<ComponentFamily, ComponentSuiteFactory> = new Map();
  
  /**
   * Register a factory
   */
  registerFactory<T>(type: string, factory: AbstractFactory<T>): void {
    this.factories.set(`${type}:${factory.name}`, factory);
  }
  
  /**
   * Register a suite factory
   */
  registerSuiteFactory(factory: ComponentSuiteFactory): void {
    this.suiteFactories.set(factory.family, factory);
  }
  
  /**
   * Get factory by type and name
   */
  getFactory<T>(type: string, name: string): AbstractFactory<T> | null {
    return this.factories.get(`${type}:${name}`) as AbstractFactory<T> | null;
  }
  
  /**
   * Get suite factory by family
   */
  getSuiteFactory(family: ComponentFamily): ComponentSuiteFactory | null {
    return this.suiteFactories.get(family);
  }
  
  /**
   * Create component using factory
   */
  create<T>(type: string, name: string, config: Map<string, string>): T | null {
    const factory = this.getFactory<T>(type, name);
    if (!factory) {
      return null;
    }
    
    const validation = factory.validateConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(", ")}`);
    }
    
    return factory.create(config);
  }
  
  /**
   * Create component suite
   */
  createSuite(family: ComponentFamily, config: Map<string, string>): ComponentSuite | null {
    const factory = this.getSuiteFactory(family);
    if (!factory) {
      return null;
    }
    
    return factory.createSuite(config);
  }
  
  /**
   * List available factories
   */
  listFactories(): string[] {
    return this.factories.keys();
  }
  
  /**
   * List available suite factories
   */
  listSuiteFactories(): ComponentFamily[] {
    return this.suiteFactories.keys();
  }
}

/**
 * Concrete factory implementations
 */

/**
 * Standard protocol factory
 */
export class StandardProtocolFactory extends BaseFactory<ProtocolModule> implements ProtocolFactory {
  constructor() {
    super("standard-protocol", new FactoryMetadata(
      "Standard Protocol Factory",
      "Creates standard protocol modules",
      "1.0.0",
      ["protocol"],
      ["protocol.version"],
      ["protocol.compression", "protocol.timeout"]
    ));
  }
  
  create(config: Map<string, string>): ProtocolModule {
    return new StandardProtocolModule(config);
  }
  
  createForFamily(family: ComponentFamily, config: Map<string, string>): ProtocolModule {
    switch (family) {
      case ComponentFamily.SECURE:
        return new SecureProtocolModule(config);
      case ComponentFamily.PERFORMANCE:
        return new HighPerformanceProtocolModule(config);
      case ComponentFamily.MINIMAL:
        return new BasicProtocolModule(config);
      default:
        return this.create(config);
    }
  }
}

/**
 * Builder pattern for complex factory configuration
 */
export class FactoryBuilder<T> {
  private name: string = "";
  private description: string = "";
  private version: string = "1.0.0";
  private supportedTypes: string[] = [];
  private requiredConfig: string[] = [];
  private optionalConfig: string[] = [];
  private createFn: ((config: Map<string, string>) => T) | null = null;
  private validateFn: ((config: Map<string, string>) => ValidationResult) | null = null;
  
  /**
   * Set factory name
   */
  withName(name: string): FactoryBuilder<T> {
    this.name = name;
    return this;
  }
  
  /**
   * Set factory description
   */
  withDescription(description: string): FactoryBuilder<T> {
    this.description = description;
    return this;
  }
  
  /**
   * Set factory version
   */
  withVersion(version: string): FactoryBuilder<T> {
    this.version = version;
    return this;
  }
  
  /**
   * Add supported type
   */
  withSupportedType(type: string): FactoryBuilder<T> {
    this.supportedTypes.push(type);
    return this;
  }
  
  /**
   * Add required config key
   */
  withRequiredConfig(key: string): FactoryBuilder<T> {
    this.requiredConfig.push(key);
    return this;
  }
  
  /**
   * Add optional config key
   */
  withOptionalConfig(key: string): FactoryBuilder<T> {
    this.optionalConfig.push(key);
    return this;
  }
  
  /**
   * Set creation function
   */
  withCreateFunction(fn: (config: Map<string, string>) => T): FactoryBuilder<T> {
    this.createFn = fn;
    return this;
  }
  
  /**
   * Set validation function
   */
  withValidationFunction(fn: (config: Map<string, string>) => ValidationResult): FactoryBuilder<T> {
    this.validateFn = fn;
    return this;
  }
  
  /**
   * Build the factory
   */
  build(): AbstractFactory<T> {
    if (!this.name) {
      throw new Error("Factory name is required");
    }
    
    if (!this.createFn) {
      throw new Error("Create function is required");
    }
    
    const metadata = new FactoryMetadata(
      this.name,
      this.description,
      this.version,
      this.supportedTypes,
      this.requiredConfig,
      this.optionalConfig
    );
    
    return new CustomFactory<T>(
      this.name,
      metadata,
      this.createFn,
      this.validateFn
    );
  }
}

/**
 * Custom factory implementation
 */
class CustomFactory<T> extends BaseFactory<T> {
  private createFn: (config: Map<string, string>) => T;
  private validateFn: ((config: Map<string, string>) => ValidationResult) | null;
  
  constructor(
    name: string,
    metadata: FactoryMetadata,
    createFn: (config: Map<string, string>) => T,
    validateFn: ((config: Map<string, string>) => ValidationResult) | null = null
  ) {
    super(name, metadata);
    this.createFn = createFn;
    this.validateFn = validateFn;
  }
  
  create(config: Map<string, string>): T {
    return this.createFn(config);
  }
  
  validateConfig(config: Map<string, string>): ValidationResult {
    // Use custom validation if provided
    if (this.validateFn) {
      return this.validateFn(config);
    }
    
    // Otherwise use base validation
    return super.validateConfig(config);
  }
}

/**
 * Factory method pattern for simple cases
 */
export class ComponentFactory {
  /**
   * Create protocol module
   */
  static createProtocol(type: string, config: Map<string, string>): ProtocolModule {
    switch (type) {
      case "standard":
        return new StandardProtocolModule(config);
      case "secure":
        return new SecureProtocolModule(config);
      case "performance":
        return new HighPerformanceProtocolModule(config);
      case "basic":
        return new BasicProtocolModule(config);
      default:
        throw new Error(`Unknown protocol type: ${type}`);
    }
  }
  
  /**
   * Create storage module
   */
  static createStorage(type: string, config: Map<string, string>): StorageModule {
    switch (type) {
      case "standard":
        return new StandardStorageModule(config);
      case "encrypted":
        return new EncryptedStorageModule(config);
      case "cached":
        return new CachedStorageModule(config);
      case "file":
        return new FileStorageModule(config);
      default:
        throw new Error(`Unknown storage type: ${type}`);
    }
  }
  
  /**
   * Create crypto module
   */
  static createCrypto(type: string, config: Map<string, string>): CryptoModule {
    switch (type) {
      case "standard":
        return new StandardCryptoModule(config);
      case "hardened":
        return new HardenedCryptoModule(config);
      case "optimized":
        return new OptimizedCryptoModule(config);
      case "basic":
        return new BasicCryptoModule(config);
      default:
        throw new Error(`Unknown crypto type: ${type}`);
    }
  }
  
  /**
   * Create transport module
   */
  static createTransport(type: string, config: Map<string, string>): TransportModule {
    switch (type) {
      case "standard":
        return new StandardTransportModule(config);
      case "tls":
        return new TLSTransportModule(config);
      case "udp":
        return new UDPTransportModule(config);
      case "tcp":
        return new TCPTransportModule(config);
      default:
        throw new Error(`Unknown transport type: ${type}`);
    }
  }
}

// Placeholder implementations for concrete modules
// In a real implementation, these would be fully implemented

class StandardProtocolModule implements ProtocolModule {
  readonly moduleType: string = "protocol";
  readonly version: string = "1.0.0";
  readonly id: string = "standard-protocol";
  readonly name: string = "Standard Protocol";
  readonly description: string = "Standard protocol implementation";
  readonly dependencies: string[] = [];
  
  constructor(config: Map<string, string>) {}
  
  configure(config: Map<string, string>): ValidationResult {
    return ValidationResult.valid();
  }
  
  initialize(): void {}
  
  register(context: PluginContext): void {}
  
  dispose(): void {}
  
  isInitialized(): bool { return true; }
  
  getStatus(): ModuleStatus {
    return new ModuleStatus(
      ModuleState.READY,
      "Ready",
      Date.now()
    );
  }
  
  getMetrics(): ModuleMetrics {
    return new ModuleMetrics(0, 0, 0, 0);
  }
  
  encode(message: Uint8Array): Uint8Array { return message; }
  decode(data: Uint8Array): Uint8Array { return data; }
  validateMessage(data: Uint8Array): ValidationResult { return ValidationResult.valid(); }
  getProtocolVersion(): string { return "1.0"; }
  isVersionSupported(version: string): bool { return version === "1.0"; }
  handleProtocolEvent(event: Event): void {}
}

// Similar placeholder implementations for other module types...
class SecureProtocolModule extends StandardProtocolModule {
  readonly id: string = "secure-protocol";
  readonly name: string = "Secure Protocol";
  readonly description: string = "Secure protocol with encryption";
}

class HighPerformanceProtocolModule extends StandardProtocolModule {
  readonly id: string = "performance-protocol";
  readonly name: string = "High Performance Protocol";
  readonly description: string = "Performance-optimized protocol";
}

class BasicProtocolModule extends StandardProtocolModule {
  readonly id: string = "basic-protocol";
  readonly name: string = "Basic Protocol";
  readonly description: string = "Minimal protocol implementation";
}

// Storage module placeholders
class StandardStorageModule implements StorageModule {
  readonly moduleType: string = "storage";
  readonly version: string = "1.0.0";
  readonly id: string = "standard-storage";
  readonly name: string = "Standard Storage";
  readonly description: string = "Standard storage implementation";
  readonly dependencies: string[] = [];
  
  constructor(config: Map<string, string>) {}
  
  configure(config: Map<string, string>): ValidationResult { return ValidationResult.valid(); }
  initialize(): void {}
  register(context: PluginContext): void {}
  dispose(): void {}
  isInitialized(): bool { return true; }
  
  getStatus(): ModuleStatus {
    return new ModuleStatus(
      ModuleState.READY,
      "Ready",
      Date.now()
    );
  }
  getMetrics(): ModuleMetrics {
    return new ModuleMetrics(0, 0, 0, 0);
  }
  
  store(key: string, data: Uint8Array): Result<void> {
    // @ts-ignore: AssemblyScript void handling
    return Result.ok<void>(0 as void);
  }
  retrieve(key: string): Result<Uint8Array> {
    return Result.ok(new Uint8Array(0));
  }
  delete(key: string): Result<void> {
    // @ts-ignore: AssemblyScript void handling
    return Result.ok<void>(0 as void);
  }
  exists(key: string): bool { return false; }
  listKeys(pattern: string): string[] { return []; }
  getStorageStats(): StorageStats {
    return new StorageStats(0, 0, 0, Date.now());
  }
  clear(): Result<void> {
    // @ts-ignore: AssemblyScript void handling
    return Result.ok<void>(0 as void);
  }
  backup(location: string): Result<void> {
    // @ts-ignore: AssemblyScript void handling
    return Result.ok<void>(0 as void);
  }
  restore(location: string): Result<void> {
    // @ts-ignore: AssemblyScript void handling
    return Result.ok<void>(0 as void);
  }
}

class EncryptedStorageModule extends StandardStorageModule {
  readonly id: string = "encrypted-storage";
  readonly name: string = "Encrypted Storage";
  readonly description: string = "Storage with encryption";
}

class CachedStorageModule extends StandardStorageModule {
  readonly id: string = "cached-storage";
  readonly name: string = "Cached Storage";
  readonly description: string = "Storage with caching";
}

class FileStorageModule extends StandardStorageModule {
  readonly id: string = "file-storage";
  readonly name: string = "File Storage";
  readonly description: string = "Simple file-based storage";
}

// Crypto module placeholders
class StandardCryptoModule implements CryptoModule {
  readonly moduleType: string = "crypto";
  readonly version: string = "1.0.0";
  readonly id: string = "standard-crypto";
  readonly name: string = "Standard Crypto";
  readonly description: string = "Standard cryptography implementation";
  readonly dependencies: string[] = [];
  
  constructor(config: Map<string, string>) {}
  
  configure(config: Map<string, string>): ValidationResult { return ValidationResult.valid(); }
  initialize(): void {}
  register(context: PluginContext): void {}
  dispose(): void {}
  isInitialized(): bool { return true; }
  
  getStatus(): ModuleStatus {
    return new ModuleStatus(
      ModuleState.READY,
      "Ready",
      Date.now()
    );
  }
  getMetrics(): ModuleMetrics {
    return new ModuleMetrics(0, 0, 0, 0);
  }
  
  generateKeyPair(): Result<KeyPair> {
    return Result.ok(
      new KeyPair(
        new Uint8Array(32),
        new Uint8Array(32),
        "Ed25519"
      )
    );
  }
  sign(data: Uint8Array, privateKey: Uint8Array): Result<Uint8Array> {
    return Result.ok(new Uint8Array(64));
  }
  verify(data: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): bool { return true; }
  encrypt(data: Uint8Array, publicKey: Uint8Array): Result<Uint8Array> {
    return Result.ok(data);
  }
  decrypt(data: Uint8Array, privateKey: Uint8Array): Result<Uint8Array> {
    return Result.ok(data);
  }
  hash(data: Uint8Array, algorithm: string): Uint8Array { return new Uint8Array(32); }
  randomBytes(length: i32): Uint8Array { return new Uint8Array(length); }
  deriveKey(password: string, salt: Uint8Array, iterations: i32): Uint8Array {
    return new Uint8Array(32);
  }
  getSupportedAlgorithms(): string[] { return ["SHA256", "Ed25519"]; }
}

class HardenedCryptoModule extends StandardCryptoModule {
  readonly id: string = "hardened-crypto";
  readonly name: string = "Hardened Crypto";
  readonly description: string = "Security-hardened cryptography";
}

class OptimizedCryptoModule extends StandardCryptoModule {
  readonly id: string = "optimized-crypto";
  readonly name: string = "Optimized Crypto";
  readonly description: string = "Performance-optimized cryptography";
}

class BasicCryptoModule extends StandardCryptoModule {
  readonly id: string = "basic-crypto";
  readonly name: string = "Basic Crypto";
  readonly description: string = "Basic cryptography implementation";
}

// Transport module placeholders
class StandardTransportModule implements TransportModule {
  readonly moduleType: string = "transport";
  readonly version: string = "1.0.0";
  readonly id: string = "standard-transport";
  readonly name: string = "Standard Transport";
  readonly description: string = "Standard transport implementation";
  readonly dependencies: string[] = [];
  
  constructor(config: Map<string, string>) {}
  
  configure(config: Map<string, string>): ValidationResult { return ValidationResult.valid(); }
  initialize(): void {}
  register(context: PluginContext): void {}
  dispose(): void {}
  isInitialized(): bool { return true; }
  
  getStatus(): ModuleStatus {
    return new ModuleStatus(
      ModuleState.READY,
      "Ready",
      Date.now()
    );
  }
  getMetrics(): ModuleMetrics {
    return new ModuleMetrics(0, 0, 0, 0);
  }
  
  connect(address: string, port: i32): Result<ConnectionHandle> {
    return Result.ok(
      new ConnectionHandle("conn-1", address, port, 8080)
    );
  }
  listen(port: i32): Result<ListenerHandle> {
    return Result.ok(
      new ListenerHandle("listener-1", port)
    );
  }
  send(handle: ConnectionHandle, data: Uint8Array): Result<void> {
    // @ts-ignore: AssemblyScript void handling
    return Result.ok<void>(0 as void);
  }
  receive(handle: ConnectionHandle, timeout: i32): Result<Uint8Array> {
    return Result.ok(new Uint8Array(0));
  }
  close(handle: ConnectionHandle): void {}
  getConnectionStats(handle: ConnectionHandle): ConnectionStats {
    return new ConnectionStats(0, 0, 0, 0, 0, Date.now());
  }
  setOption(option: string, value: string): Result<void> {
    // @ts-ignore: AssemblyScript void handling
    return Result.ok<void>(0 as void);
  }
}

class TLSTransportModule extends StandardTransportModule {
  readonly id: string = "tls-transport";
  readonly name: string = "TLS Transport";
  readonly description: string = "TLS-secured transport";
}

class UDPTransportModule extends StandardTransportModule {
  readonly id: string = "udp-transport";
  readonly name: string = "UDP Transport";
  readonly description: string = "UDP transport for speed";
}

class TCPTransportModule extends StandardTransportModule {
  readonly id: string = "tcp-transport";
  readonly name: string = "TCP Transport";
  readonly description: string = "Reliable TCP transport";
}

// Export singleton registry
export const factoryRegistry = new FactoryRegistry();

// Register default factories
factoryRegistry.registerSuiteFactory(new StandardComponentSuiteFactory());
factoryRegistry.registerSuiteFactory(new SecureComponentSuiteFactory());
factoryRegistry.registerSuiteFactory(new PerformanceComponentSuiteFactory());
factoryRegistry.registerSuiteFactory(new MinimalComponentSuiteFactory());