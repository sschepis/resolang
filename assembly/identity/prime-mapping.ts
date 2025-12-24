/**
 * Identity to Prime Resonance Mapping System
 * Maps identities to unique prime resonance signatures for quantum computation
 */

import { IIdentity, IdentityType } from "./interfaces";
import { IdentityId } from "./types";
import { NetworkNode, PrimeResonanceIdentity } from "../prn-node";
import { BaseSerializable } from "../core/interfaces";

/**
 * Prime resonance mapping for an identity
 */
export class IdentityPrimeMapping {
  identityId: IdentityId;
  gaussianPrime: u32;
  eisensteinPrime: u32;
  quaternionicPrime: u32;
  nodeId: string;
  mappedAt: f64;
  strength: f64; // Resonance strength (0-1)

  constructor(
    identityId: IdentityId,
    gaussianPrime: u32,
    eisensteinPrime: u32,
    quaternionicPrime: u32
  ) {
    this.identityId = identityId;
    this.gaussianPrime = gaussianPrime;
    this.eisensteinPrime = eisensteinPrime;
    this.quaternionicPrime = quaternionicPrime;
    this.nodeId = "";
    this.mappedAt = Date.now();
    this.strength = 1.0;
  }

  /**
   * Create a network node from this mapping
   */
  toNetworkNode(): NetworkNode {
    const node = new NetworkNode(
      this.nodeId || this.identityId,
      this.gaussianPrime,
      this.eisensteinPrime,
      this.quaternionicPrime
    );
    return node;
  }

  /**
   * Get prime resonance identity
   */
  getPrimeIdentity(): PrimeResonanceIdentity {
    return new PrimeResonanceIdentity(
      this.gaussianPrime,
      this.eisensteinPrime,
      this.quaternionicPrime
    );
  }
}

/**
 * Prime number generator and validator
 */
export class PrimeGenerator {
  private static primeCache: Set<u32> = new Set<u32>();
  private static lastPrime: u32 = 2;

  /**
   * Check if a number is prime
   */
  static isPrime(n: u32): boolean {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    
    const sqrt = Math.sqrt(n) as u32;
    for (let i: u32 = 3; i <= sqrt; i += 2) {
      if (n % i == 0) return false;
    }
    
    return true;
  }

  /**
   * Generate the next prime number
   */
  static nextPrime(start: u32 = 0): u32 {
    let n = start > 0 ? start : this.lastPrime + 1;
    
    while (!this.isPrime(n)) {
      n++;
    }
    
    this.lastPrime = n;
    this.primeCache.add(n);
    return n;
  }

  /**
   * Generate a prime in a specific range
   */
  static primeInRange(min: u32, max: u32): u32 {
    let n = min;
    while (n <= max) {
      if (this.isPrime(n)) {
        return n;
      }
      n++;
    }
    // If no prime found in range, return next prime after max
    return this.nextPrime(max);
  }

  /**
   * Generate three unique primes for identity mapping
   */
  static generatePrimeTriplet(seed: u32): Array<u32> {
    const primes = new Array<u32>();
    
    // Use seed to generate deterministic but unique primes
    let p1 = this.nextPrime(seed);
    primes.push(p1);
    
    let p2 = this.nextPrime(p1 + seed % 100);
    primes.push(p2);
    
    let p3 = this.nextPrime(p2 + seed % 200);
    primes.push(p3);
    
    return primes;
  }
}

/**
 * Identity to Prime Resonance Mapper
 */
export class IdentityPrimeMapper extends BaseSerializable {
  private mappings: Map<IdentityId, IdentityPrimeMapping>;
  private reverseMap: Map<string, IdentityId>; // nodeId -> identityId
  private usedPrimes: Set<u32>;
  private seedOffset: u32;

  constructor() {
    super();
    this.mappings = new Map<IdentityId, IdentityPrimeMapping>();
    this.reverseMap = new Map<string, IdentityId>();
    this.usedPrimes = new Set<u32>();
    this.seedOffset = 1000; // Start with larger primes for better distribution
  }

  /**
   * Map an identity to prime resonance values
   */
  mapIdentity(identity: IIdentity): IdentityPrimeMapping {
    const identityId = identity.getId();
    
    // Check if already mapped
    const existing = this.mappings.get(identityId);
    if (existing) {
      return existing;
    }

    // Generate unique prime triplet based on identity
    const seed = this.generateSeed(identity);
    const primes = this.generateUniquePrimes(seed);
    
    // Create mapping
    const mapping = new IdentityPrimeMapping(
      identityId,
      primes[0],
      primes[1],
      primes[2]
    );
    
    // Generate node ID
    mapping.nodeId = this.generateNodeId(mapping);
    
    // Store mapping
    this.mappings.set(identityId, mapping);
    this.reverseMap.set(mapping.nodeId, identityId);
    
    // Mark primes as used
    this.usedPrimes.add(primes[0]);
    this.usedPrimes.add(primes[1]);
    this.usedPrimes.add(primes[2]);
    
    return mapping;
  }

  /**
   * Get mapping for an identity
   */
  getMapping(identityId: IdentityId): IdentityPrimeMapping | null {
    return this.mappings.get(identityId);
  }

  /**
   * Get identity ID from node ID
   */
  getIdentityFromNode(nodeId: string): IdentityId | null {
    return this.reverseMap.get(nodeId);
  }

  /**
   * Update resonance strength for a mapping
   */
  updateResonanceStrength(identityId: IdentityId, strength: f64): boolean {
    const mapping = this.mappings.get(identityId);
    if (!mapping) return false;
    
    mapping.strength = Math.max(0, Math.min(1, strength));
    return true;
  }

  /**
   * Generate seed from identity for deterministic prime generation
   */
  private generateSeed(identity: IIdentity): u32 {
    const id = identity.getId();
    const type = identity.getType();
    
    // Create seed from identity properties
    let seed: u32 = 0;
    for (let i = 0; i < id.length; i++) {
      seed = (seed * 31 + id.charCodeAt(i)) as u32;
    }
    
    // Add type influence
    if (type == IdentityType.SELF_SOVEREIGN) {
      seed += 1000000;
    } else if (type == IdentityType.MANAGED) {
      seed += 2000000;
    } else {
      seed += 3000000;
    }
    
    // Add KYC level influence
    seed += (identity.getKYCLevel() as u32) * 100000;
    
    return seed + this.seedOffset;
  }

  /**
   * Generate unique primes that haven't been used
   */
  private generateUniquePrimes(seed: u32): Array<u32> {
    const primes = new Array<u32>();
    let currentSeed = seed;
    
    // Generate three unique primes
    for (let i = 0; i < 3; i++) {
      let prime = PrimeGenerator.nextPrime(currentSeed);
      
      // Ensure prime is not already used
      while (this.usedPrimes.has(prime)) {
        prime = PrimeGenerator.nextPrime(prime + 1);
      }
      
      primes.push(prime);
      currentSeed = prime + 100; // Offset for next prime
    }
    
    return primes;
  }

  /**
   * Generate node ID from mapping
   */
  private generateNodeId(mapping: IdentityPrimeMapping): string {
    return `prn-${mapping.gaussianPrime}-${mapping.eisensteinPrime}-${mapping.quaternionicPrime}`;
  }

  /**
   * Get all mapped identities
   */
  getMappedIdentities(): Array<IdentityId> {
    return this.mappings.keys();
  }

  /**
   * Get mapping statistics
   */
  getStats(): Map<string, f64> {
    const stats = new Map<string, f64>();
    stats.set("total_mappings", this.mappings.size as f64);
    stats.set("unique_primes", this.usedPrimes.size as f64);
    
    // Calculate average resonance strength
    let totalStrength: f64 = 0;
    const mappingValues = this.mappings.values();
    for (let i = 0; i < mappingValues.length; i++) {
      totalStrength += mappingValues[i].strength;
    }
    
    stats.set("average_strength", totalStrength / (this.mappings.size as f64));
    
    return stats;
  }

  // Serialization
  toString(): string {
    return this.toJSON();
  }

  toJSON(): string {
    const stats = this.getStats();
    return `{"mappings":${this.mappings.size},"avgStrength":${stats.get("average_strength")}}`;
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
 * Global identity prime mapper instance
 */
export const globalPrimeMapper = new IdentityPrimeMapper();

/**
 * Helper function to map identity and create network node
 */
export function mapIdentityToNode(identity: IIdentity): NetworkNode {
  const mapping = globalPrimeMapper.mapIdentity(identity);
  return mapping.toNetworkNode();
}

/**
 * Helper function to get prime resonance identity for an identity
 */
export function getPrimeResonance(identity: IIdentity): PrimeResonanceIdentity | null {
  const mapping = globalPrimeMapper.getMapping(identity.getId());
  return mapping ? mapping.getPrimeIdentity() : null;
}