/**
 * Middleware Pattern for Protocol Processing
 * 
 * This module implements a flexible middleware system for processing
 * protocol messages with support for pre/post processing, error handling,
 * and conditional execution.
 */

import { ValidationResult } from './validation';
import { PRNError, ErrorCategory } from './error-handling';
import { EventBus, DataEvent } from './event-system';

/**
 * Middleware context containing request/response data
 */
export class MiddlewareContext<TRequest, TResponse> {
  /** Original request data */
  readonly request: TRequest;
  
  /** Response data (mutable) */
  response: TResponse | null = null;
  
  /** Metadata storage for middleware communication */
  readonly metadata: Map<string, any> = new Map();
  
  /** Error if middleware chain failed */
  error: PRNError | null = null;
  
  /** Whether to stop processing */
  private _stopped: bool = false;
  
  /** Start timestamp */
  readonly startTime: i64;
  
  /** End timestamp */
  endTime: i64 = 0;
  
  constructor(request: TRequest) {
    this.request = request;
    this.startTime = Date.now();
  }
  
  /**
   * Stop middleware chain processing
   */
  stop(): void {
    this._stopped = true;
  }
  
  /**
   * Check if processing is stopped
   */
  isStopped(): bool {
    return this._stopped;
  }
  
  /**
   * Set response data
   */
  setResponse(response: TResponse): void {
    this.response = response;
  }
  
  /**
   * Set error
   */
  setError(error: PRNError): void {
    this.error = error;
    this.stop();
  }
  
  /**
   * Get processing duration
   */
  getDuration(): i64 {
    return this.endTime > 0 ? this.endTime - this.startTime : Date.now() - this.startTime;
  }
  
  /**
   * Mark processing as complete
   */
  complete(): void {
    this.endTime = Date.now();
  }
}

/**
 * Middleware function type
 */
export type MiddlewareFunction<TRequest, TResponse> = (
  context: MiddlewareContext<TRequest, TResponse>,
  next: () => void
) => void;

/**
 * Middleware interface
 */
export interface Middleware<TRequest, TResponse> {
  /** Middleware name */
  readonly name: string;
  
  /** Process the context */
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void;
  
  /** Check if middleware should run */
  shouldRun(context: MiddlewareContext<TRequest, TResponse>): bool;
  
  /** Get middleware priority (higher runs first) */
  getPriority(): i32;
}

/**
 * Base middleware implementation
 */
export abstract class BaseMiddleware<TRequest, TResponse> implements Middleware<TRequest, TResponse> {
  readonly name: string;
  protected priority: i32;
  
  constructor(name: string, priority: i32 = 0) {
    this.name = name;
    this.priority = priority;
  }
  
  abstract process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void;
  
  shouldRun(context: MiddlewareContext<TRequest, TResponse>): bool {
    return true;
  }
  
  getPriority(): i32 {
    return this.priority;
  }
}

/**
 * Function-based middleware wrapper
 */
export class FunctionMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private fn: MiddlewareFunction<TRequest, TResponse>;
  private condition: ((context: MiddlewareContext<TRequest, TResponse>) => bool) | null;
  
  constructor(
    name: string,
    fn: MiddlewareFunction<TRequest, TResponse>,
    priority: i32 = 0,
    condition: ((context: MiddlewareContext<TRequest, TResponse>) => bool) | null = null
  ) {
    super(name, priority);
    this.fn = fn;
    this.condition = condition;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    this.fn(context, next);
  }
  
  shouldRun(context: MiddlewareContext<TRequest, TResponse>): bool {
    return this.condition ? this.condition(context) : true;
  }
}

/**
 * Middleware pipeline for chaining middleware
 */
export class MiddlewarePipeline<TRequest, TResponse> {
  private middlewares: Middleware<TRequest, TResponse>[] = [];
  private eventBus: EventBus | null;
  private errorHandler: ((error: PRNError, context: MiddlewareContext<TRequest, TResponse>) => void) | null = null;
  
  constructor(eventBus: EventBus | null = null) {
    this.eventBus = eventBus;
  }
  
  /**
   * Add middleware to pipeline
   */
  use(middleware: Middleware<TRequest, TResponse>): MiddlewarePipeline<TRequest, TResponse> {
    this.middlewares.push(middleware);
    this.sortMiddlewares();
    return this;
  }
  
  /**
   * Add function middleware
   */
  useFunction(
    name: string,
    fn: MiddlewareFunction<TRequest, TResponse>,
    priority: i32 = 0,
    condition: ((context: MiddlewareContext<TRequest, TResponse>) => bool) | null = null
  ): MiddlewarePipeline<TRequest, TResponse> {
    return this.use(new FunctionMiddleware(name, fn, priority, condition));
  }
  
  /**
   * Remove middleware by name
   */
  remove(name: string): bool {
    const index = this.middlewares.findIndex(m => m.name === name);
    if (index >= 0) {
      this.middlewares.splice(index, 1);
      return true;
    }
    return false;
  }
  
  /**
   * Clear all middleware
   */
  clear(): void {
    this.middlewares = [];
  }
  
  /**
   * Set error handler
   */
  onError(handler: (error: PRNError, context: MiddlewareContext<TRequest, TResponse>) => void): void {
    this.errorHandler = handler;
  }
  
  /**
   * Execute middleware pipeline
   */
  execute(request: TRequest): MiddlewareContext<TRequest, TResponse> {
    const context = new MiddlewareContext<TRequest, TResponse>(request);
    
    // Emit pipeline start event
    if (this.eventBus) {
      const eventData = new Map<string, string>();
      eventData.set("pipeline", "start");
      this.eventBus.emit(new DataEvent<Map<string, string>>("middleware.pipeline.start", eventData));
    }
    
    try {
      this.executeMiddleware(context, 0);
    } catch (e) {
      const error = new PRNError(
        e instanceof Error ? e.message : "Unknown error",
        ErrorCategory.SYSTEM
      );
      context.setError(error);
      
      if (this.errorHandler) {
        this.errorHandler(error, context);
      }
    }
    
    context.complete();
    
    // Emit pipeline complete event
    if (this.eventBus) {
      const eventData = new Map<string, string>();
      eventData.set("pipeline", "complete");
      eventData.set("duration", context.getDuration().toString());
      eventData.set("success", (context.error === null).toString());
      this.eventBus.emit(new DataEvent<Map<string, string>>("middleware.pipeline.complete", eventData));
    }
    
    return context;
  }
  
  /**
   * Execute middleware at index
   */
  private executeMiddleware(context: MiddlewareContext<TRequest, TResponse>, index: i32): void {
    // Check if stopped
    if (context.isStopped()) {
      return;
    }
    
    // Check if we've processed all middleware
    if (index >= this.middlewares.length) {
      return;
    }
    
    const middleware = this.middlewares[index];
    
    // Check if middleware should run
    if (!middleware.shouldRun(context)) {
      this.executeMiddleware(context, index + 1);
      return;
    }
    
    // Emit middleware start event
    if (this.eventBus) {
      const eventData = new Map<string, string>();
      eventData.set("middleware", middleware.name);
      this.eventBus.emit(new DataEvent<Map<string, string>>("middleware.start", eventData));
    }
    
    const startTime = Date.now();
    
    // Create next function
    const next = (): void => {
      const duration = Date.now() - startTime;
      
      // Emit middleware complete event
      if (this.eventBus) {
        const eventData = new Map<string, string>();
        eventData.set("middleware", middleware.name);
        eventData.set("duration", duration.toString());
        this.eventBus.emit(new DataEvent<Map<string, string>>("middleware.complete", eventData));
      }
      
      // Execute next middleware
      this.executeMiddleware(context, index + 1);
    };
    
    try {
      middleware.process(context, next);
    } catch (e) {
      const error = new PRNError(
        `Middleware ${middleware.name} failed: ${e instanceof Error ? e.message : "Unknown error"}`,
        ErrorCategory.APPLICATION
      );
      context.setError(error);
      
      if (this.errorHandler) {
        this.errorHandler(error, context);
      }
      
      // Emit middleware error event
      if (this.eventBus) {
        const eventData = new Map<string, string>();
        eventData.set("middleware", middleware.name);
        eventData.set("error", error.message);
        this.eventBus.emit(new DataEvent<Map<string, string>>("middleware.error", eventData));
      }
    }
  }
  
  /**
   * Sort middlewares by priority
   */
  private sortMiddlewares(): void {
    this.middlewares.sort((a, b) => b.getPriority() - a.getPriority());
  }
  
  /**
   * Get middleware count
   */
  getCount(): i32 {
    return this.middlewares.length;
  }
  
  /**
   * Get middleware names
   */
  getNames(): string[] {
    return this.middlewares.map<string>(m => m.name);
  }
}

/**
 * Common middleware implementations
 */

/**
 * Logging middleware
 */
export class LoggingMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  constructor(priority: i32 = 100) {
    super("logging", priority);
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    console.log(`[${this.name}] Processing request`);
    
    next();
    
    console.log(`[${this.name}] Processed in ${context.getDuration()}ms`);
  }
}

/**
 * Validation middleware
 */
export class ValidationMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private validator: (request: TRequest) => ValidationResult;
  
  constructor(
    validator: (request: TRequest) => ValidationResult,
    priority: i32 = 90
  ) {
    super("validation", priority);
    this.validator = validator;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    const result = this.validator(context.request);
    
    if (!result.valid) {
      context.setError(
        new PRNError(
          `Validation failed: ${result.errors.join(", ")}`,
          ErrorCategory.VALIDATION
        )
      );
      return;
    }
    
    next();
  }
}

/**
 * Authentication middleware
 */
export class AuthenticationMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private authenticate: (context: MiddlewareContext<TRequest, TResponse>) => bool;
  
  constructor(
    authenticate: (context: MiddlewareContext<TRequest, TResponse>) => bool,
    priority: i32 = 80
  ) {
    super("authentication", priority);
    this.authenticate = authenticate;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    if (!this.authenticate(context)) {
      context.setError(
        new PRNError(
          "Authentication failed",
          ErrorCategory.NETWORK_PEER
        )
      );
      return;
    }
    
    next();
  }
}

/**
 * Rate limiting middleware
 */
export class RateLimitMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private requests: Map<string, i64[]> = new Map();
  private maxRequests: i32;
  private windowMs: i64;
  private keyExtractor: (request: TRequest) => string;
  
  constructor(
    maxRequests: i32,
    windowMs: i64,
    keyExtractor: (request: TRequest) => string,
    priority: i32 = 70
  ) {
    super("rate-limit", priority);
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.keyExtractor = keyExtractor;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    const key = this.keyExtractor(context.request);
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get or create request timestamps
    let timestamps = this.requests.get(key);
    if (!timestamps) {
      timestamps = [];
      this.requests.set(key, timestamps);
    }
    
    // Remove old timestamps
    timestamps = timestamps.filter(t => t > windowStart);
    this.requests.set(key, timestamps);
    
    // Check rate limit
    if (timestamps.length >= this.maxRequests) {
      context.setError(
        new PRNError(
          "Rate limit exceeded",
          ErrorCategory.NETWORK
        )
      );
      return;
    }
    
    // Add current timestamp
    timestamps.push(now);
    
    next();
  }
}

/**
 * Caching middleware
 */
export class CachingMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private cache: Map<string, TResponse> = new Map();
  private ttl: i64;
  private keyExtractor: (request: TRequest) => string;
  private timestamps: Map<string, i64> = new Map();
  
  constructor(
    ttl: i64,
    keyExtractor: (request: TRequest) => string,
    priority: i32 = 60
  ) {
    super("caching", priority);
    this.ttl = ttl;
    this.keyExtractor = keyExtractor;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    const key = this.keyExtractor(context.request);
    const cached = this.cache.get(key);
    const timestamp = this.timestamps.get(key);
    
    // Check if cached and not expired
    if (cached && timestamp && Date.now() - timestamp < this.ttl) {
      context.setResponse(cached);
      context.metadata.set("cached", "true");
      return;
    }
    
    // Process request
    next();
    
    // Cache response if successful
    if (context.response && !context.error) {
      this.cache.set(key, context.response);
      this.timestamps.set(key, Date.now());
    }
  }
  
  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.timestamps.clear();
  }
}

/**
 * Retry middleware
 */
export class RetryMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private maxRetries: i32;
  private retryDelay: i64;
  private shouldRetry: (error: PRNError) => bool;
  
  constructor(
    maxRetries: i32 = 3,
    retryDelay: i64 = 1000,
    shouldRetry: (error: PRNError) => bool = (e) => true,
    priority: i32 = 50
  ) {
    super("retry", priority);
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
    this.shouldRetry = shouldRetry;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    let retries = 0;
    
    const attempt = (): void => {
      // Clear previous error
      context.error = null;
      
      // Process request
      next();
      
      // Check if should retry
      if (context.error && retries < this.maxRetries && this.shouldRetry(context.error)) {
        retries++;
        context.metadata.set("retry", retries.toString());
        
        // Wait and retry
        // Note: In AssemblyScript, we can't use setTimeout
        // This is a simplified version - in real implementation
        // you would need an async mechanism
        attempt();
      }
    };
    
    attempt();
  }
}

/**
 * Transform middleware for modifying requests/responses
 */
export class TransformMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private requestTransform: ((request: TRequest) => TRequest) | null;
  private responseTransform: ((response: TResponse) => TResponse) | null;
  
  constructor(
    requestTransform: ((request: TRequest) => TRequest) | null = null,
    responseTransform: ((response: TResponse) => TResponse) | null = null,
    priority: i32 = 40
  ) {
    super("transform", priority);
    this.requestTransform = requestTransform;
    this.responseTransform = responseTransform;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    // Transform request if needed
    if (this.requestTransform) {
      const transformed = this.requestTransform(context.request);
      context.metadata.set("original-request", context.request);
      // Note: Can't modify readonly request, store in metadata
      context.metadata.set("transformed-request", transformed);
    }
    
    next();
    
    // Transform response if needed
    if (this.responseTransform && context.response) {
      const transformed = this.responseTransform(context.response);
      context.setResponse(transformed);
    }
  }
}

/**
 * Metrics middleware for collecting performance data
 */
export class MetricsMiddleware<TRequest, TResponse> extends BaseMiddleware<TRequest, TResponse> {
  private metrics: Map<string, f64[]> = new Map();
  private metricExtractor: (context: MiddlewareContext<TRequest, TResponse>) => string;
  
  constructor(
    metricExtractor: (context: MiddlewareContext<TRequest, TResponse>) => string,
    priority: i32 = 30
  ) {
    super("metrics", priority);
    this.metricExtractor = metricExtractor;
  }
  
  process(
    context: MiddlewareContext<TRequest, TResponse>,
    next: () => void
  ): void {
    const startTime = Date.now();
    
    next();
    
    const duration = Date.now() - startTime;
    const metric = this.metricExtractor(context);
    
    // Store metric
    let durations = this.metrics.get(metric);
    if (!durations) {
      durations = [];
      this.metrics.set(metric, durations);
    }
    
    durations.push(duration as f64);
    
    // Keep only last 1000 measurements
    if (durations.length > 1000) {
      durations.shift();
    }
  }
  
  /**
   * Get average duration for a metric
   */
  getAverageDuration(metric: string): f64 {
    const durations = this.metrics.get(metric);
    if (!durations || durations.length === 0) {
      return 0;
    }
    
    let sum: f64 = 0;
    for (let i = 0; i < durations.length; i++) {
      sum += durations[i];
    }
    
    return sum / durations.length;
  }
  
  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, f64> {
    const result = new Map<string, f64>();
    const keys = this.metrics.keys();
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result.set(key, this.getAverageDuration(key));
    }
    
    return result;
  }
}

/**
 * Create a middleware pipeline builder
 */
export class MiddlewarePipelineBuilder<TRequest, TResponse> {
  private pipeline: MiddlewarePipeline<TRequest, TResponse>;
  
  constructor(eventBus: EventBus | null = null) {
    this.pipeline = new MiddlewarePipeline<TRequest, TResponse>(eventBus);
  }
  
  /**
   * Add logging
   */
  withLogging(priority: i32 = 100): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new LoggingMiddleware<TRequest, TResponse>(priority));
    return this;
  }
  
  /**
   * Add validation
   */
  withValidation(
    validator: (request: TRequest) => ValidationResult,
    priority: i32 = 90
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new ValidationMiddleware<TRequest, TResponse>(validator, priority));
    return this;
  }
  
  /**
   * Add authentication
   */
  withAuthentication(
    authenticate: (context: MiddlewareContext<TRequest, TResponse>) => bool,
    priority: i32 = 80
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new AuthenticationMiddleware<TRequest, TResponse>(authenticate, priority));
    return this;
  }
  
  /**
   * Add rate limiting
   */
  withRateLimit(
    maxRequests: i32,
    windowMs: i64,
    keyExtractor: (request: TRequest) => string,
    priority: i32 = 70
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new RateLimitMiddleware<TRequest, TResponse>(
      maxRequests,
      windowMs,
      keyExtractor,
      priority
    ));
    return this;
  }
  
  /**
   * Add caching
   */
  withCaching(
    ttl: i64,
    keyExtractor: (request: TRequest) => string,
    priority: i32 = 60
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new CachingMiddleware<TRequest, TResponse>(ttl, keyExtractor, priority));
    return this;
  }
  
  /**
   * Add retry logic
   */
  withRetry(
    maxRetries: i32 = 3,
    retryDelay: i64 = 1000,
    shouldRetry: (error: PRNError) => bool = (e) => true,
    priority: i32 = 50
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new RetryMiddleware<TRequest, TResponse>(
      maxRetries,
      retryDelay,
      shouldRetry,
      priority
    ));
    return this;
  }
  
  /**
   * Add transforms
   */
  withTransform(
    requestTransform: ((request: TRequest) => TRequest) | null = null,
    responseTransform: ((response: TResponse) => TResponse) | null = null,
    priority: i32 = 40
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new TransformMiddleware<TRequest, TResponse>(
      requestTransform,
      responseTransform,
      priority
    ));
    return this;
  }
  
  /**
   * Add metrics collection
   */
  withMetrics(
    metricExtractor: (context: MiddlewareContext<TRequest, TResponse>) => string,
    priority: i32 = 30
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(new MetricsMiddleware<TRequest, TResponse>(metricExtractor, priority));
    return this;
  }
  
  /**
   * Add custom middleware
   */
  use(middleware: Middleware<TRequest, TResponse>): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.use(middleware);
    return this;
  }
  
  /**
   * Add custom function middleware
   */
  useFunction(
    name: string,
    fn: MiddlewareFunction<TRequest, TResponse>,
    priority: i32 = 0,
    condition: ((context: MiddlewareContext<TRequest, TResponse>) => bool) | null = null
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.useFunction(name, fn, priority, condition);
    return this;
  }
  
  /**
   * Set error handler
   */
  onError(
    handler: (error: PRNError, context: MiddlewareContext<TRequest, TResponse>) => void
  ): MiddlewarePipelineBuilder<TRequest, TResponse> {
    this.pipeline.onError(handler);
    return this;
  }
  
  /**
   * Build the pipeline
   */
  build(): MiddlewarePipeline<TRequest, TResponse> {
    return this.pipeline;
  }
}