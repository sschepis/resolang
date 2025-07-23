/**
 * Plugin System for Prime Resonance Network
 * 
 * Provides a flexible plugin architecture for extending system functionality
 * without modifying core code. Supports dependency injection, lifecycle
 * management, and dynamic loading.
 */

import { Plugin, PluginMetadata, PluginContext, PluginCapability } from "./base-interfaces";
import { BasePlugin } from "./base-classes";
import { PRNError, ErrorCategory, ErrorSeverity } from "./error-handling";
import { validateString, ValidationResult, StringValidationBuilder } from "./validation";

/**
 * Plugin registration entry
 */
class PluginRegistration {
  constructor(
    public plugin: Plugin,
    public metadata: PluginMetadata,
    public instance: Plugin | null = null
  ) {}
}

/**
 * Plugin dependency resolver
 */
export class DependencyResolver {
  private dependencies: Map<string, Plugin> = new Map<string, Plugin>();

  /**
   * Register a plugin as available for dependency injection
   */
  register(id: string, plugin: Plugin): void {
    this.dependencies.set(id, plugin);
  }

  /**
   * Resolve dependencies for a plugin
   */
  resolve(dependencies: string[]): Map<string, Plugin> {
    const resolved = new Map<string, Plugin>();
    
    for (let i = 0; i < dependencies.length; i++) {
      const dep = dependencies[i];
      const plugin = this.dependencies.get(dep);
      
      if (!plugin) {
        throw new PRNError(
          `Dependency '${dep}' not found`,
          ErrorCategory.APPLICATION_PLUGIN,
          ErrorSeverity.ERROR
        ).addContext("dependency", dep);
      }
      
      resolved.set(dep, plugin);
    }
    
    return resolved;
  }

  /**
   * Check if all dependencies are available
   */
  canResolve(dependencies: string[]): boolean {
    for (let i = 0; i < dependencies.length; i++) {
      if (!this.dependencies.has(dependencies[i])) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Plugin lifecycle manager
 */
export class PluginLifecycleManager {
  private plugins: Map<string, PluginRegistration> = new Map<string, PluginRegistration>();
  private startOrder: string[] = [];
  private initialized: Set<string> = new Set<string>();
  private started: Set<string> = new Set<string>();

  /**
   * Add plugin to lifecycle management
   */
  addPlugin(registration: PluginRegistration): void {
    this.plugins.set(registration.metadata.id, registration);
  }

  /**
   * Initialize all plugins in dependency order
   */
  initializeAll(context: PluginContext): void {
    const order = this.calculateInitOrder();
    
    for (let i = 0; i < order.length; i++) {
      const id = order[i];
      this.initializePlugin(id, context);
    }
  }

  /**
   * Start all plugins in dependency order
   */
  startAll(): void {
    const order = this.calculateInitOrder();
    
    for (let i = 0; i < order.length; i++) {
      const id = order[i];
      this.startPlugin(id);
    }
  }

  /**
   * Stop all plugins in reverse dependency order
   */
  stopAll(): void {
    const order = this.calculateInitOrder();
    
    // Stop in reverse order
    for (let i = order.length - 1; i >= 0; i--) {
      const id = order[i];
      this.stopPlugin(id);
    }
  }

  /**
   * Initialize a single plugin
   */
  private initializePlugin(id: string, context: PluginContext): void {
    if (this.initialized.has(id)) return;
    
    const registration = this.plugins.get(id);
    if (!registration) {
      throw new PRNError(
        `Plugin '${id}' not found`,
        ErrorCategory.APPLICATION_PLUGIN,
        ErrorSeverity.ERROR
      );
    }

    // Initialize dependencies first
    const deps = registration.metadata.dependencies;
    for (let i = 0; i < deps.length; i++) {
      this.initializePlugin(deps[i], context);
    }

    // Initialize the plugin
    if (registration.instance) {
      // Set context on BasePlugin instances
      if (registration.instance instanceof BasePlugin) {
        (registration.instance as BasePlugin).setContext(context);
      }
      registration.instance.initialize();
      this.initialized.add(id);
    }
  }

  /**
   * Start a single plugin
   */
  private startPlugin(id: string): void {
    if (this.started.has(id)) return;
    
    const registration = this.plugins.get(id);
    if (!registration || !registration.instance) return;

    // Ensure initialized
    if (!this.initialized.has(id)) {
      throw new PRNError(
        `Plugin '${id}' not initialized`,
        ErrorCategory.APPLICATION_PLUGIN,
        ErrorSeverity.ERROR
      );
    }

    // Start dependencies first
    const deps = registration.metadata.dependencies;
    for (let i = 0; i < deps.length; i++) {
      this.startPlugin(deps[i]);
    }

    // Start the plugin (if it has a start method)
    if (registration.instance instanceof BasePlugin) {
      (registration.instance as BasePlugin).start();
    }
    this.started.add(id);
  }

  /**
   * Stop a single plugin
   */
  private stopPlugin(id: string): void {
    if (!this.started.has(id)) return;
    
    const registration = this.plugins.get(id);
    if (!registration || !registration.instance) return;

    // Stop the plugin (if it has a stop method)
    if (registration.instance instanceof BasePlugin) {
      (registration.instance as BasePlugin).stop();
    }
    this.started.delete(id);
  }

  /**
   * Calculate initialization order based on dependencies
   */
  private calculateInitOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      
      if (visiting.has(id)) {
        throw new PRNError(
          `Circular dependency detected: ${id}`,
          ErrorCategory.APPLICATION_PLUGIN,
          ErrorSeverity.CRITICAL
        );
      }

      visiting.add(id);
      
      const registration = this.plugins.get(id);
      if (registration) {
        const deps = registration.metadata.dependencies;
        for (let i = 0; i < deps.length; i++) {
          visit(deps[i]);
        }
      }

      visiting.delete(id);
      visited.add(id);
      order.push(id);
    };

    // Visit all plugins
    const ids = this.plugins.keys();
    for (let i = 0; i < ids.length; i++) {
      visit(ids[i]);
    }

    return order;
  }
}

/**
 * Main plugin manager
 */
export class PluginManager {
  private registry: Map<string, PluginRegistration> = new Map<string, PluginRegistration>();
  private resolver: DependencyResolver = new DependencyResolver();
  private lifecycle: PluginLifecycleManager = new PluginLifecycleManager();
  private capabilities: Map<string, Set<string>> = new Map<string, Set<string>>();
  private hooks: Map<string, Array<(data: string) => string>> = new Map<string, Array<(data: string) => string>>();
  private context: PluginContext | null = null;

  /**
   * Register a plugin
   */
  register(plugin: Plugin, metadata: PluginMetadata): ValidationResult {
    // Validate metadata
    const validation = this.validateMetadata(metadata);
    if (!validation.valid) {
      return validation;
    }

    // Check for duplicate registration
    if (this.registry.has(metadata.id)) {
      return ValidationResult.invalid(
        `Plugin '${metadata.id}' is already registered`
      );
    }

    // Check dependencies
    if (!this.resolver.canResolve(metadata.dependencies)) {
      return ValidationResult.invalid(
        `Plugin '${metadata.id}' has unresolved dependencies`
      );
    }

    // Register the plugin
    const registration = new PluginRegistration(plugin, metadata);
    this.registry.set(metadata.id, registration);
    this.lifecycle.addPlugin(registration);

    // Register capabilities
    for (let i = 0; i < metadata.capabilities.length; i++) {
      this.registerCapability(metadata.id, metadata.capabilities[i]);
    }

    // Register as dependency provider
    this.resolver.register(metadata.id, plugin);

    return ValidationResult.valid();
  }

  /**
   * Initialize all plugins
   */
  initialize(context: PluginContext): void {
    this.context = context;
    
    // Create plugin instances
    const registrations = this.registry.values();
    for (let i = 0; i < registrations.length; i++) {
      const reg = registrations[i];
      if (!reg.instance) {
        reg.instance = this.createInstance(reg.plugin);
      }
    }

    // Initialize all plugins
    this.lifecycle.initializeAll(context);
  }

  /**
   * Start all plugins
   */
  start(): void {
    this.lifecycle.startAll();
  }

  /**
   * Stop all plugins
   */
  stop(): void {
    this.lifecycle.stopAll();
  }

  /**
   * Get plugins by capability
   */
  getByCapability(capability: string): Plugin[] {
    const pluginIds = this.capabilities.get(capability);
    if (!pluginIds) return [];

    const plugins: Plugin[] = [];
    const ids = pluginIds.values();
    
    for (let i = 0; i < ids.length; i++) {
      const registration = this.registry.get(ids[i]);
      if (registration && registration.instance) {
        plugins.push(registration.instance);
      }
    }

    return plugins;
  }

  /**
   * Get plugin by ID
   */
  getById(id: string): Plugin | null {
    const registration = this.registry.get(id);
    return registration ? registration.instance : null;
  }

  /**
   * Register a hook
   */
  registerHook(name: string, handler: (data: string) => string): void {
    let handlers = this.hooks.get(name);
    if (!handlers) {
      handlers = [];
      this.hooks.set(name, handlers);
    }
    handlers.push(handler);
  }

  /**
   * Execute hooks
   */
  executeHooks(name: string, data: string): string {
    const handlers = this.hooks.get(name);
    if (!handlers) return data;

    let result = data;
    for (let i = 0; i < handlers.length; i++) {
      result = handlers[i](result);
    }

    return result;
  }

  /**
   * Create plugin instance
   */
  private createInstance(plugin: Plugin): Plugin {
    // In a real implementation, this would use a factory or reflection
    // For AssemblyScript, we need to handle this differently
    return plugin;
  }

  /**
   * Register capability
   */
  private registerCapability(pluginId: string, capability: string): void {
    let plugins = this.capabilities.get(capability);
    if (!plugins) {
      plugins = new Set<string>();
      this.capabilities.set(capability, plugins);
    }
    plugins.add(pluginId);
  }

  /**
   * Validate plugin metadata
   */
  private validateMetadata(metadata: PluginMetadata): ValidationResult {
    const results: ValidationResult[] = [];

    // Validate ID
    results.push(
      validateString()
        .forField("id")
        .required()
        .validate(metadata.id)
    );

    // Validate name
    results.push(
      validateString()
        .forField("name")
        .required()
        .validate(metadata.name)
    );

    // Validate version
    results.push(
      validateString()
        .forField("version")
        .required()
        .validate(metadata.version)
    );

    // Combine results
    for (let i = 0; i < results.length; i++) {
      if (!results[i].valid) {
        return results[i];
      }
    }

    return ValidationResult.valid();
  }
}

/**
 * Service locator for dynamic service discovery
 */
export class ServiceLocator {
  private services: Map<string, string> = new Map<string, string>();
  private factories: Map<string, () => string> = new Map<string, () => string>();

  /**
   * Register a service instance
   */
  register(name: string, service: string): void {
    this.services.set(name, service);
  }

  /**
   * Register a service factory
   */
  registerFactory(name: string, factory: () => string): void {
    this.factories.set(name, factory);
  }

  /**
   * Get a service by name
   */
  get<T>(name: string): T | null {
    // Check for existing instance
    const service = this.services.get(name);
    if (service) return service as T;

    // Check for factory
    const factory = this.factories.get(name);
    if (factory) {
      const instance = factory();
      this.services.set(name, instance);
      return instance as T;
    }

    return null;
  }

  /**
   * Check if service exists
   */
  has(name: string): boolean {
    return this.services.has(name) || this.factories.has(name) ? true : false;
  }

  /**
   * Remove a service
   */
  remove(name: string): void {
    this.services.delete(name);
    this.factories.delete(name);
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

/**
 * Global plugin manager instance
 */
export const pluginManager = new PluginManager();

/**
 * Global service locator instance
 */
export const serviceLocator = new ServiceLocator();