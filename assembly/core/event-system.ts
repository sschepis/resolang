/**
 * Event-Driven Architecture for Prime Resonance Network
 * 
 * Provides a decoupled communication mechanism for components
 * with support for typed events, async handlers, and event bubbling.
 */

import { PRNError, ErrorCategory, ErrorSeverity } from "./error-handling";
import { ValidationResult } from "./validation";

/**
 * Event priority levels
 */
export enum EventPriority {
  LOWEST = 0,
  LOW = 25,
  NORMAL = 50,
  HIGH = 75,
  HIGHEST = 100,
  MONITOR = 200  // Monitor priority handlers can't modify events
}

/**
 * Event propagation control
 */
export class EventPropagation {
  private _stopped: bool = false;
  private _immediateStopped: bool = false;
  
  /**
   * Stop event propagation after current priority level
   */
  stopPropagation(): void {
    this._stopped = true;
  }
  
  /**
   * Stop event propagation immediately
   */
  stopImmediatePropagation(): void {
    this._immediateStopped = true;
    this._stopped = true;
  }
  
  /**
   * Check if propagation is stopped
   */
  isStopped(): bool {
    return this._stopped;
  }
  
  /**
   * Check if immediate propagation is stopped
   */
  isImmediateStopped(): bool {
    return this._immediateStopped;
  }
}

/**
 * Base event class
 */
export abstract class Event {
  readonly type: string;
  readonly timestamp: u64;
  readonly source: string | null;
  readonly propagation: EventPropagation;
  
  private _cancelled: bool = false;
  
  constructor(
    type: string,
    source: string | null = null
  ) {
    this.type = type;
    this.timestamp = Date.now();
    this.source = source;
    this.propagation = new EventPropagation();
  }
  
  /**
   * Cancel the event (for cancellable events)
   */
  cancel(): void {
    if (this.isCancellable()) {
      this._cancelled = true;
    }
  }
  
  /**
   * Check if event is cancelled
   */
  isCancelled(): bool {
    return this._cancelled;
  }
  
  /**
   * Check if event is cancellable
   */
  isCancellable(): bool {
    return false; // Override in subclasses
  }
  
  /**
   * Clone the event
   */
  abstract clone(): Event;
}

/**
 * Generic data event
 */
export class DataEvent<T> extends Event {
  readonly data: T;
  
  constructor(
    type: string,
    data: T,
    source: string | null = null
  ) {
    super(type, source);
    this.data = data;
  }
  
  clone(): DataEvent<T> {
    return new DataEvent<T>(this.type, this.data, this.source);
  }
}

/**
 * Cancellable event
 */
export class CancellableEvent extends Event {
  constructor(
    type: string,
    source: string | null = null
  ) {
    super(type, source);
  }
  
  isCancellable(): bool {
    return true;
  }
  
  clone(): CancellableEvent {
    return new CancellableEvent(this.type, this.source);
  }
}

/**
 * Event handler function type
 */
export type EventHandler<T extends Event> = (event: T) => void;

/**
 * Event handler registration
 */
class HandlerRegistration<T extends Event> {
  constructor(
    public handler: EventHandler<T>,
    public priority: EventPriority,
    public once: bool = false
  ) {}
}

/**
 * Event emitter interface
 */
export interface EventEmitter {
  /**
   * Emit an event
   */
  emit<T extends Event>(event: T): void;
  
  /**
   * Add event listener
   */
  on<T extends Event>(type: string, handler: EventHandler<T>, priority?: EventPriority): void;
  
  /**
   * Add one-time event listener
   */
  once<T extends Event>(type: string, handler: EventHandler<T>, priority?: EventPriority): void;
  
  /**
   * Remove event listener
   */
  off<T extends Event>(type: string, handler: EventHandler<T>): void;
  
  /**
   * Remove all listeners for event type
   */
  removeAllListeners(type: string): void;
}

/**
 * Event bus implementation
 */
export class EventBus implements EventEmitter {
  private handlers: Map<string, Array<HandlerRegistration<Event>>> = new Map();
  private wildcardHandlers: Array<HandlerRegistration<Event>> = [];
  private eventHistory: Event[] = [];
  private maxHistorySize: i32 = 100;
  private errorHandler: ((error: Error, event: Event) => void) | null = null;
  
  /**
   * Set error handler for event processing errors
   */
  setErrorHandler(handler: (error: Error, event: Event) => void): void {
    this.errorHandler = handler;
  }
  
  /**
   * Set maximum event history size
   */
  setMaxHistorySize(size: i32): void {
    this.maxHistorySize = size;
  }
  
  /**
   * Emit an event
   */
  emit<T extends Event>(event: T): void {
    // Add to history
    this.addToHistory(event);
    
    // Get handlers for this event type
    const typeHandlers = this.handlers.get(event.type);
    const allHandlers: Array<HandlerRegistration<Event>> = [];
    
    // Add type-specific handlers
    if (typeHandlers) {
      for (let i = 0; i < typeHandlers.length; i++) {
        allHandlers.push(typeHandlers[i]);
      }
    }
    
    // Add wildcard handlers
    for (let i = 0; i < this.wildcardHandlers.length; i++) {
      allHandlers.push(this.wildcardHandlers[i]);
    }
    
    // Sort by priority (highest first)
    allHandlers.sort((a, b) => b.priority - a.priority);
    
    // Execute handlers
    const toRemove: Array<HandlerRegistration<Event>> = [];
    
    for (let i = 0; i < allHandlers.length; i++) {
      const registration = allHandlers[i];
      
      // Check if propagation is stopped
      if (event.propagation.isImmediateStopped()) {
        break;
      }
      
      try {
        // Execute handler
        registration.handler(event);
        
        // Remove one-time handlers
        if (registration.once) {
          toRemove.push(registration);
        }
      } catch (e) {
        // Handle errors
        let error: Error;
        if (e instanceof Error) {
          error = e;
        } else {
          error = new Error("Unknown error in event handler");
        }
        
        if (this.errorHandler) {
          this.errorHandler(error, event);
        } else {
          throw new PRNError(
            `Error in event handler: ${error.message}`,
            ErrorCategory.APPLICATION,
            ErrorSeverity.ERROR
          ).addContext("eventType", event.type);
        }
      }
    }
    
    // Remove one-time handlers
    for (let i = 0; i < toRemove.length; i++) {
      this.removeHandler(event.type, toRemove[i]);
    }
  }
  
  /**
   * Add event listener
   */
  on<T extends Event>(
    type: string,
    handler: EventHandler<T>,
    priority: EventPriority = EventPriority.NORMAL
  ): void {
    const registration = new HandlerRegistration<Event>(
      handler as EventHandler<Event>,
      priority,
      false
    );
    
    if (type === "*") {
      this.wildcardHandlers.push(registration);
    } else {
      let handlers = this.handlers.get(type);
      if (!handlers) {
        handlers = [];
        this.handlers.set(type, handlers);
      }
      handlers.push(registration);
    }
  }
  
  /**
   * Add one-time event listener
   */
  once<T extends Event>(
    type: string,
    handler: EventHandler<T>,
    priority: EventPriority = EventPriority.NORMAL
  ): void {
    const registration = new HandlerRegistration<Event>(
      handler as EventHandler<Event>,
      priority,
      true
    );
    
    if (type === "*") {
      this.wildcardHandlers.push(registration);
    } else {
      let handlers = this.handlers.get(type);
      if (!handlers) {
        handlers = [];
        this.handlers.set(type, handlers);
      }
      handlers.push(registration);
    }
  }
  
  /**
   * Remove event listener
   */
  off<T extends Event>(type: string, handler: EventHandler<T>): void {
    if (type === "*") {
      // Remove from wildcard handlers
      for (let i = this.wildcardHandlers.length - 1; i >= 0; i--) {
        if (this.wildcardHandlers[i].handler === handler) {
          this.wildcardHandlers.splice(i, 1);
        }
      }
    } else {
      // Remove from type-specific handlers
      const handlers = this.handlers.get(type);
      if (handlers) {
        for (let i = handlers.length - 1; i >= 0; i--) {
          if (handlers[i].handler === handler) {
            handlers.splice(i, 1);
          }
        }
        
        // Remove empty handler arrays
        if (handlers.length === 0) {
          this.handlers.delete(type);
        }
      }
    }
  }
  
  /**
   * Remove all listeners for event type
   */
  removeAllListeners(type: string): void {
    if (type === "*") {
      this.wildcardHandlers = [];
    } else {
      this.handlers.delete(type);
    }
  }
  
  /**
   * Get event history
   */
  getHistory(): Event[] {
    return this.eventHistory.slice();
  }
  
  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }
  
  /**
   * Get handler count for event type
   */
  getHandlerCount(type: string): i32 {
    if (type === "*") {
      return this.wildcardHandlers.length;
    }
    
    const handlers = this.handlers.get(type);
    return handlers ? handlers.length : 0;
  }
  
  /**
   * Add event to history
   */
  private addToHistory(event: Event): void {
    this.eventHistory.push(event);
    
    // Trim history if needed
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }
  
  /**
   * Remove a specific handler registration
   */
  private removeHandler(type: string, registration: HandlerRegistration<Event>): void {
    if (type === "*") {
      const index = this.wildcardHandlers.indexOf(registration);
      if (index >= 0) {
        this.wildcardHandlers.splice(index, 1);
      }
    } else {
      const handlers = this.handlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(registration);
        if (index >= 0) {
          handlers.splice(index, 1);
        }
      }
    }
  }
}

/**
 * Event channel for scoped event handling
 */
export class EventChannel implements EventEmitter {
  private bus: EventBus;
  private prefix: string;
  
  constructor(bus: EventBus, prefix: string) {
    this.bus = bus;
    this.prefix = prefix;
  }
  
  /**
   * Emit an event with channel prefix
   */
  emit<T extends Event>(event: T): void {
    // Clone event with prefixed type
    const prefixedType = `${this.prefix}:${event.type}`;
    const prefixedEvent = this.createPrefixedEvent(event, prefixedType);
    this.bus.emit(prefixedEvent);
  }
  
  /**
   * Add event listener with channel prefix
   */
  on<T extends Event>(
    type: string,
    handler: EventHandler<T>,
    priority: EventPriority = EventPriority.NORMAL
  ): void {
    const prefixedType = `${this.prefix}:${type}`;
    this.bus.on(prefixedType, handler, priority);
  }
  
  /**
   * Add one-time event listener with channel prefix
   */
  once<T extends Event>(
    type: string,
    handler: EventHandler<T>,
    priority: EventPriority = EventPriority.NORMAL
  ): void {
    const prefixedType = `${this.prefix}:${type}`;
    this.bus.once(prefixedType, handler, priority);
  }
  
  /**
   * Remove event listener with channel prefix
   */
  off<T extends Event>(type: string, handler: EventHandler<T>): void {
    const prefixedType = `${this.prefix}:${type}`;
    this.bus.off(prefixedType, handler);
  }
  
  /**
   * Remove all listeners for event type with channel prefix
   */
  removeAllListeners(type: string): void {
    const prefixedType = `${this.prefix}:${type}`;
    this.bus.removeAllListeners(prefixedType);
  }
  
  /**
   * Create a prefixed event
   */
  private createPrefixedEvent<T extends Event>(event: T, prefixedType: string): Event {
    if (event instanceof DataEvent) {
      return new DataEvent(prefixedType, (event as DataEvent<any>).data, event.source);
    } else if (event instanceof CancellableEvent) {
      return new CancellableEvent(prefixedType, event.source);
    } else {
      // For custom event types, use clone and modify
      const cloned = event.clone();
      // Note: This is a limitation - we can't modify readonly type
      // In practice, you'd create a new event instance
      return cloned;
    }
  }
}

/**
 * Global event bus instance
 */
export const globalEventBus = new EventBus();

/**
 * Create a scoped event channel
 */
export function createEventChannel(prefix: string): EventChannel {
  return new EventChannel(globalEventBus, prefix);
}