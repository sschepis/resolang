/**
 * Mathematical Performance Statistics Module
 * Provides performance tracking for mathematical operations
 */

/**
 * Performance statistics for mathematical operations
 */
export class MathPerformanceStats {
  static primalityTests: i32 = 0;
  static modularExponentiations: i32 = 0;
  static montgomeryMultiplications: i32 = 0;
  static primeGenerations: i32 = 0;
  static cacheHits: i32 = 0;
  static cacheMisses: i32 = 0;
  
  static reset(): void {
    this.primalityTests = 0;
    this.modularExponentiations = 0;
    this.montgomeryMultiplications = 0;
    this.primeGenerations = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
  
  static getStats(): string {
    return `MathPerformanceStats: {
      primalityTests: ${this.primalityTests},
      modularExponentiations: ${this.modularExponentiations},
      montgomeryMultiplications: ${this.montgomeryMultiplications},
      primeGenerations: ${this.primeGenerations},
      cacheHits: ${this.cacheHits},
      cacheMisses: ${this.cacheMisses},
      cacheHitRate: ${this.cacheHits + this.cacheMisses > 0 ? (this.cacheHits * 100) / (this.cacheHits + this.cacheMisses) : 0}%
    }`;
  }
  
  static incrementPrimalityTests(): void {
    this.primalityTests++;
  }
  
  static incrementModularExponentiations(): void {
    this.modularExponentiations++;
  }
  
  static incrementMontgomeryMultiplications(): void {
    this.montgomeryMultiplications++;
  }
  
  static incrementPrimeGenerations(): void {
    this.primeGenerations++;
  }
  
  static incrementCacheHits(): void {
    this.cacheHits++;
  }
  
  static incrementCacheMisses(): void {
    this.cacheMisses++;
  }
}

/**
 * Simple timer for performance measurements
 */
export class SimpleTimer {
  private startTime: f64 = 0.0;
  private endTime: f64 = 0.0;
  
  start(): void {
    this.startTime = f64(Date.now());
  }
  
  stop(): void {
    this.endTime = f64(Date.now());
  }
  
  getElapsedMs(): f64 {
    return this.endTime - this.startTime;
  }
  
  getElapsedSeconds(): f64 {
    return this.getElapsedMs() / 1000.0;
  }
  
  reset(): void {
    this.startTime = 0.0;
    this.endTime = 0.0;
  }
}

/**
 * Performance profiler for mathematical operations
 */
export class MathProfiler {
  private timers: Map<string, SimpleTimer> = new Map();
  private counts: Map<string, i32> = new Map();
  
  startTimer(name: string): void {
    let timer = this.timers.get(name);
    if (!timer) {
      timer = new SimpleTimer();
      this.timers.set(name, timer);
    }
    timer.start();
  }
  
  stopTimer(name: string): void {
    const timer = this.timers.get(name);
    if (timer) {
      timer.stop();
      const count = this.counts.has(name) ? this.counts.get(name) : 0;
      this.counts.set(name, count + 1);
    }
  }
  
  getElapsedMs(name: string): f64 {
    const timer = this.timers.get(name);
    return timer ? timer.getElapsedMs() : 0.0;
  }
  
  getAverageMs(name: string): f64 {
    const timer = this.timers.get(name);
    const count = this.counts.has(name) ? this.counts.get(name) : 0;
    if (!timer || count == 0) return 0.0;
    return timer.getElapsedMs() / f64(count);
  }
  
  getCallCount(name: string): i32 {
    return this.counts.has(name) ? this.counts.get(name) : 0;
  }
  
  reset(): void {
    this.timers.clear();
    this.counts.clear();
  }
  
  getReport(): string {
    let report = "Math Profiler Report:\n";
    const names = this.timers.keys();
    
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const elapsed = this.getElapsedMs(name);
      const count = this.getCallCount(name);
      const average = this.getAverageMs(name);
      
      report += `  ${name}: ${count} calls, ${elapsed.toString()}ms total, ${average.toString()}ms avg\n`;
    }
    
    return report;
  }
}

// Global profiler instance
export const globalMathProfiler = new MathProfiler();

/**
 * Decorator function for profiling mathematical operations
 */
export function profileMathOperation(name: string, operation: () => void): void {
  globalMathProfiler.startTimer(name);
  operation();
  globalMathProfiler.stopTimer(name);
}

/**
 * Memory usage tracker for mathematical operations
 */
export class MathMemoryTracker {
  private allocations: Map<string, i32> = new Map();
  private deallocations: Map<string, i32> = new Map();
  
  recordAllocation(type: string, size: i32): void {
    const current = this.allocations.has(type) ? this.allocations.get(type) : 0;
    this.allocations.set(type, current + size);
  }
  
  recordDeallocation(type: string, size: i32): void {
    const current = this.deallocations.has(type) ? this.deallocations.get(type) : 0;
    this.deallocations.set(type, current + size);
  }
  
  getCurrentUsage(type: string): i32 {
    const allocated = this.allocations.has(type) ? this.allocations.get(type) : 0;
    const deallocated = this.deallocations.has(type) ? this.deallocations.get(type) : 0;
    return allocated - deallocated;
  }
  
  getTotalAllocated(type: string): i32 {
    return this.allocations.has(type) ? this.allocations.get(type) : 0;
  }
  
  reset(): void {
    this.allocations.clear();
    this.deallocations.clear();
  }
  
  getReport(): string {
    let report = "Math Memory Tracker Report:\n";
    const types = this.allocations.keys();
    
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const current = this.getCurrentUsage(type);
      const total = this.getTotalAllocated(type);
      
      report += `  ${type}: ${current} bytes current, ${total} bytes total allocated\n`;
    }
    
    return report;
  }
}

// Global memory tracker instance
export const globalMathMemoryTracker = new MathMemoryTracker();