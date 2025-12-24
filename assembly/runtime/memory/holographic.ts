// assembly/runtime/memory/holographic.ts
// Holographic memory implementation for RISA runtime

import { IPrimeStateEngine } from '../state/primeState';
import { Complex } from '../../types';

/**
 * Holographic memory pattern interface
 */
export class IHolographicPattern {
  constructor(
    public id: string,
    public name: string,
    public primeField: Map<i32, f64>,
    public metadata: string, // Storing metadata as a JSON string
    public created: f64,
    public lastAccessed: f64,
    public accessCount: i32,
    public strength: f64
  ) {}
}

/**
 * Memory retrieval result
 */
export class IRetrievalResult {
  constructor(
    public pattern: IHolographicPattern,
    public confidence: f64,
    public method: string
  ) {}
}

/**
 * Holographic memory interface
 */
export interface IHolographicMemory {
  store(name: string, primeState: IPrimeStateEngine, metadata: string): string;
  retrieve(partialState: IPrimeStateEngine, threshold: f64): IRetrievalResult[];
  getPattern(id: string): IHolographicPattern | null;
  getPatternsByName(name: string): IHolographicPattern[];
  deletePattern(id: string): bool;
  listPatterns(): IHolographicPattern[];
  clear(): void;
  retrievePattern(name: string): IHolographicPattern | null;
  getStats(): string;
  strengthenPattern(id: string, factor: f64): void;
  weakenPattern(id: string, factor: f64): void;
  decay(deltaTime: f64): void;
  clone(): IHolographicMemory;
  reconstruct(patternId: string, targetState: IPrimeStateEngine): bool;
}

/**
 * Holographic memory implementation
 */
export class HolographicMemory implements IHolographicMemory {
  private patterns: Map<string, IHolographicPattern> = new Map();
  private nameIndex: Map<string, Set<string>> = new Map(); // name -> pattern IDs
  private primeIndex: Map<i32, Set<string>> = new Map(); // prime -> pattern IDs
  private decayRate: f64 = 0.001; // Strength decay per second

  store(name: string, primeState: IPrimeStateEngine, metadata: string = "{}"): string {
    const id = this.generateId();
    const now = f64(Date.now());
    
    // Extract prime field from state
    const primeField = new Map<i32, f64>();
    const oscillators = primeState.getAllOscillators();
    const keys = oscillators.keys();
    
    for (let i = 0; i < keys.length; i++) {
        const prime = keys[i];
        const oscillator = oscillators.get(prime);
        if (oscillator.amplitude > 0) {
            primeField.set(prime, oscillator.amplitude);
        }
    }

    const pattern = new IHolographicPattern(
      id,
      name,
      primeField,
      metadata,
      now,
      now,
      0,
      1.0
    );

    // Store in main collection
    this.patterns.set(id, pattern);

    // Update indices
    this.updateNameIndex(name, id);
    this.updatePrimeIndex(primeField, id);

    return id;
  }

  retrieve(partialState: IPrimeStateEngine, threshold: f64 = 0.5): IRetrievalResult[] {
    const results: IRetrievalResult[] = [];
    const queryPrimes = partialState.getActivePrimes();
    
    if (queryPrimes.length === 0) {
      return results;
    }

    // Find candidate patterns using prime index
    const candidates = new Set<string>();
    for (let i = 0; i < queryPrimes.length; i++) {
        const prime = queryPrimes[i];
        const patternIds = this.primeIndex.get(prime);
        if (patternIds) {
            const ids = patternIds.values();
            for(let j = 0; j < ids.length; j++) {
                candidates.add(ids[j]);
            }
        }
    }

    // Score candidates
    const candidateIds = candidates.values();
    for (let i = 0; i < candidateIds.length; i++) {
        const id = candidateIds[i];
        const pattern = this.patterns.get(id);
        if (!pattern) continue;

        const confidence = this.calculateSimilarity(partialState, pattern);
      
        if (confidence >= threshold) {
            // Update access statistics
            pattern.lastAccessed = f64(Date.now());
            pattern.accessCount++;

            results.push(new IRetrievalResult(
                pattern,
                confidence,
                'prime-field-similarity'
            ));
        }
    }

    // Sort by confidence (highest first)
    return results.sort((a, b) => (b.confidence - a.confidence) as i32);
  }

  getPattern(id: string): IHolographicPattern | null {
    const pattern = this.patterns.get(id);
    if (pattern) {
      pattern.lastAccessed = Date.now() as f64;
      pattern.accessCount++;
    }
    return pattern;
  }

  getPatternsByName(name: string): IHolographicPattern[] {
    const ids = this.nameIndex.get(name) || new Set<string>();
    const idValues = ids.values();
    const patterns: IHolographicPattern[] = [];
    for(let i = 0; i < idValues.length; i++) {
        const pattern = this.patterns.get(idValues[i]);
        if(pattern) {
            patterns.push(pattern);
        }
    }
    return patterns;
  }

  deletePattern(id: string): bool {
    const pattern = this.patterns.get(id);
    if (!pattern) return false;

    // Remove from main collection
    this.patterns.delete(id);

    // Remove from name index
    const nameSet = this.nameIndex.get(pattern.name);
    if (nameSet) {
      nameSet.delete(id);
      if (nameSet.size === 0) {
        this.nameIndex.delete(pattern.name);
      }
    }

    // Remove from prime index
    const primeKeys = pattern.primeField.keys();
    for (let i = 0; i < primeKeys.length; i++) {
        const prime = primeKeys[i];
        const primeSet = this.primeIndex.get(prime);
        if (primeSet) {
            primeSet.delete(id);
            if (primeSet.size === 0) {
                this.primeIndex.delete(prime);
            }
        }
    }

    return true;
  }

  listPatterns(): IHolographicPattern[] {
    return this.patterns.values();
  }

  clear(): void {
    this.patterns.clear();
    this.nameIndex.clear();
    this.primeIndex.clear();
  }

  retrievePattern(name: string): IHolographicPattern | null {
    const patterns = this.getPatternsByName(name);
    return patterns.length > 0 ? patterns[0] : null;
  }

  getStats(): string {
    const patterns = this.patterns.values();
    let totalAccesses = 0;
    let totalStrength: f64 = 0;
    for(let i = 0; i < patterns.length; i++) {
        totalAccesses += patterns[i].accessCount;
        totalStrength += patterns[i].strength;
    }
    const avgStrength = patterns.length > 0 ? totalStrength / patterns.length : 0;

    return `{ "totalPatterns": ${patterns.length}, "uniqueNames": ${this.nameIndex.size}, "indexedPrimes": ${this.primeIndex.size}, "totalAccesses": ${totalAccesses}, "averageStrength": ${avgStrength} }`;
  }

  strengthenPattern(id: string, factor: f64 = 1.1): void {
    const pattern = this.patterns.get(id);
    if (pattern) {
      pattern.strength = Math.min(1.0, pattern.strength * factor);
    }
  }

  weakenPattern(id: string, factor: f64 = 0.9): void {
    const pattern = this.patterns.get(id);
    if (pattern) {
      pattern.strength = Math.max(0.0, pattern.strength * factor);
    }
  }

  decay(deltaTime: f64): void {
    const decayFactor = Math.exp(-this.decayRate * deltaTime);
    const now = Date.now();
    const toDelete: string[] = [];

    const patternKeys = this.patterns.keys();
    for (let i = 0; i < patternKeys.length; i++) {
        const id = patternKeys[i];
        const pattern = this.patterns.get(id);
        if (pattern) {
            // Apply time-based decay
            pattern.strength *= decayFactor;

            // Additional decay based on last access time
            const timeSinceAccess = (now - pattern.lastAccessed) / 1000; // seconds
            const accessDecay = Math.exp(-this.decayRate * timeSinceAccess * 0.1);
            pattern.strength *= accessDecay;

            // Mark for deletion if strength is too low
            if (pattern.strength < 0.01) {
                toDelete.push(id);
            }
        }
    }

    // Delete weak patterns
    for (let i = 0; i < toDelete.length; i++) {
      this.deletePattern(toDelete[i]);
    }
  }

  reconstruct(patternId: string, targetState: IPrimeStateEngine): bool {
    const pattern = this.getPattern(patternId);
    if (!pattern) return false;

    targetState.reset();

    // Restore prime amplitudes
    const primeKeys = pattern.primeField.keys();
    for (let i = 0; i < primeKeys.length; i++) {
        const prime = primeKeys[i];
        const amplitude = pattern.primeField.get(prime);
        targetState.setAmplitude(prime, amplitude);
    }

    targetState.normalize();
    return true;
  }

  // Private helper methods

  private generateId(): string {
    // A simplified ID generator
    return `pattern-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  private updateNameIndex(name: string, id: string): void {
    if (!this.nameIndex.has(name)) {
      this.nameIndex.set(name, new Set<string>());
    }
    this.nameIndex.get(name).add(id);
  }

  private updatePrimeIndex(primeField: Map<i32, f64>, id: string): void {
    const keys = primeField.keys();
    for (let i = 0; i < keys.length; i++) {
        const prime = keys[i];
        if (!this.primeIndex.has(prime)) {
            this.primeIndex.set(prime, new Set<string>());
        }
        this.primeIndex.get(prime).add(id);
    }
  }

  private calculateSimilarity(queryState: IPrimeStateEngine, pattern: IHolographicPattern): f64 {
    const queryOscillators = queryState.getAllOscillators();
    let dotProduct: f64 = 0;
    let queryMagnitude: f64 = 0;
    let patternMagnitude: f64 = 0;

    // Calculate all primes involved
    const allPrimes = new Set<i32>();
    const queryKeys = queryOscillators.keys();
    for(let i = 0; i < queryKeys.length; i++) {
        allPrimes.add(queryKeys[i]);
    }
    const patternKeys = pattern.primeField.keys();
    for(let i = 0; i < patternKeys.length; i++) {
        allPrimes.add(patternKeys[i]);
    }

    // Calculate cosine similarity
    const allPrimesValues = allPrimes.values();
    for (let i = 0; i < allPrimesValues.length; i++) {
        const prime = allPrimesValues[i];
        const queryAmp = queryOscillators.has(prime) ? queryOscillators.get(prime).amplitude : 0;
        const patternAmp = pattern.primeField.get(prime) || 0;

        dotProduct += queryAmp * patternAmp;
        queryMagnitude += queryAmp * queryAmp;
        patternMagnitude += patternAmp * patternAmp;
    }

    if (queryMagnitude === 0 || patternMagnitude === 0) {
      return 0;
    }

    const similarity = dotProduct / (Math.sqrt(queryMagnitude) * Math.sqrt(patternMagnitude));
    
    // Weight by pattern strength
    return similarity * pattern.strength;
  }

  clone(): IHolographicMemory {
    const cloned = new HolographicMemory();
    cloned.patterns = this.patterns; // Deep clone needed
    cloned.nameIndex = this.nameIndex; // Deep clone needed
    cloned.primeIndex = this.primeIndex; // Deep clone needed
    return cloned;
  }
}