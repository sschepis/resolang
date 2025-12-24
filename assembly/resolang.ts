// resolang.ts
// This file defines the core types and fundamental structures of ResoLang.

import { toFixed } from "./utils";
import { isPrime } from "./core/math";
import { JSONBuilder } from "./core/serialization";

// 2.1 Primitive Types
import { Serializable } from "./core/interfaces";
export type Prime = u32; // Individual prime number basis, using unsigned 32-bit integer
export type Phase = f64; // Angle in radians, using 64-bit floating point
export type Amplitude = f64; // Complex amplitude (r, φ), representing magnitude for simplicity
                               // For a full complex number, a dedicated `Complex` class would be needed.
export type Entropy = f64; // Symbolic entropy metric

// 2.2 Resonant Types

// ResonantFragment: Represents a holographic memory field.
// It contains coefficients (mapping primes to amplitudes), a 2D center, and an entropy value.
export class ResonantFragment implements Serializable {
  coeffs: Map<Prime, Amplitude>; // Maps prime numbers to their corresponding amplitudes
  center: StaticArray<f64>;    // [Float, Float] for a 2D coordinate representing the field's center
  entropy: Entropy;            // The symbolic entropy metric of the fragment

  /**
   * Constructs a new ResonantFragment.
   * @param coeffs A map of prime coefficients.
   * @param centerX The X-coordinate of the fragment's center.
   * @param centerY The Y-coordinate of the fragment's center.
   * @param entropy The entropy value of the fragment.
   */
  constructor(coeffs: Map<Prime, Amplitude>, centerX: f64, centerY: f64, entropy: Entropy) {
    this.coeffs = coeffs;
    this.center = StaticArray.fromArray<f64>([centerX, centerY]);
    this.entropy = entropy;
  }

  /**
   * Simulates the 'encode' operation from ResoLang, creating a ResonantFragment
   * from a given string pattern. This is a conceptual encoding.
   * @param pattern The string pattern to encode.
   * @returns A new ResonantFragment representing the encoded pattern.
   */
  static encode(pattern: string, spatialEntropy: f64 = 0.5, angularPosition: f64 = Math.PI / 4): ResonantFragment {
    const coeffs = new Map<Prime, Amplitude>();
    let totalAmplitudeSq: f64 = 0.0;
    let primeCandidate: Prime = 2;

    for (let i = 0; i < pattern.length; i++) {
      const charCode = pattern.charCodeAt(i);
      let currentPrime = primeCandidate;
      while (!isPrime(currentPrime)) {
        currentPrime++;
      }

      // Holographic encoding formula: A_p * e^(-S(x,y)) * e^(ipθ)
      // For simplicity, we'll use the charCode as the base amplitude A_p
      // and combine the exponential terms into a single amplitude value.
      const baseAmplitude = <f64>charCode / 255.0;
      const spatialFactor = Math.exp(-spatialEntropy);
      const phaseFactor = Math.cos(<f64>currentPrime * angularPosition); // Using real part of e^(ipθ)
      const amplitude = baseAmplitude * spatialFactor * phaseFactor;

      coeffs.set(currentPrime, amplitude);
      totalAmplitudeSq += amplitude * amplitude;
      primeCandidate = currentPrime + 1;
    }

    // Normalize the amplitudes so that Σ|α_p|² = 1
    const normalizationFactor = Math.sqrt(totalAmplitudeSq);
    if (normalizationFactor > 0) {
      const keys = coeffs.keys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        coeffs.set(key, coeffs.get(key) / normalizationFactor);
      }
    }

    // Calculate Shannon entropy: S = -Σ_p |α_p|² log|α_p|²
    let entropy: f64 = 0.0;
    const values = coeffs.values();
    for (let i = 0; i < values.length; i++) {
      const p = values[i] * values[i]; // |α_p|²
      if (p > 0) {
        entropy -= p * Math.log(p);
      }
    }

    // Determine center based on pattern properties
    const centerX = <f64>pattern.length / 2.0;
    const centerY = totalAmplitudeSq / <f64>pattern.length;

    return new ResonantFragment(coeffs, centerX, centerY, entropy);
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("entropy", this.entropy);
    
    // Add center array
    let centerJson = `[${this.center[0]},${this.center[1]}]`;
    builder.addRawField("center", centerJson);
    
    // Build coeffs object
    let coeffsJson = "{";
    const keys = this.coeffs.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.coeffs.get(key);
      if (i > 0) coeffsJson += ",";
      coeffsJson += `"${key}":${value}`;
    }
    coeffsJson += "}";
    
    builder.addRawField("coeffs", coeffsJson)
      .endObject();
    
    return builder.build();
  }

  /**
   * Returns a string representation of the ResonantFragment.
   */
  toString(): string {
    return this.toJSON();
  }
}


// EntangledNode: Represents a node in the Prime Resonance Network.
// It has an ID, a triplet of prime numbers (pri), a phase ring, and a coherence value.
export class EntangledNode implements Serializable {
  id: string;              // Unique identifier for the node
  pri: StaticArray<Prime>; // (Prime, Prime, Prime) - a triplet of prime numbers
  phaseRing: Array<Phase>; // Array representing the phase ring
  coherence: f64;          // A float value indicating the coherence of the node

  /**
   * Constructs a new EntangledNode.
   * @param id The unique ID of the node.
   * @param p1 The first prime in the triplet.
   * @param p2 The second prime in the triplet.
   * @param p3 The third prime in the triplet.
   */
  constructor(id: string, p1: Prime, p2: Prime, p3: Prime) {
    this.id = id;
    this.pri = StaticArray.fromArray<Prime>([p1, p2, p3]);
    this.phaseRing = new Array<Phase>();
    this.coherence = 0.0; // Initial coherence is zero
  }

  /**
   * Simulates the 'generateNode' operation, creating a new EntangledNode.
   * @param p1 The first prime.
   * @param p2 The second prime.
   * @param p3 The third prime.
   * @returns A new EntangledNode with initialized properties.
   */
  static generateNode(p1: Prime, p2: Prime, p3: Prime): EntangledNode {
    // In a real implementation, p1, p2, and p3 would be carefully selected
    // from different algebraic domains (Gaussian, Eisenstein, Quaternionic).
    // The ID should be a secure hash of the public key or PRI.
    const id = `Node_${p1}_${p2}_${p3}`; // Placeholder ID
    const node = new EntangledNode(id, p1, p2, p3);

    // Initialize the phase ring based on prime properties
    // This is still a simplified model; a real system would use complex phase relationships.
    node.phaseRing.push((<f64>p1 % 100.0) / 100.0 * 2 * Math.PI);
    node.phaseRing.push((<f64>p2 % 100.0) / 100.0 * 2 * Math.PI);
    node.phaseRing.push((<f64>p3 % 100.0) / 100.0 * 2 * Math.PI);

    // Initial coherence based on the geometric mean of the primes, normalized.
    // This is a more theoretically grounded approach than a simple sum.
    const primeProduct = <f64>p1 * <f64>p2 * <f64>p3;
    const geometricMean = Math.pow(primeProduct, 1.0 / 3.0);
    node.coherence = Math.min(1.0, Math.log(geometricMean) / 10.0); // Normalize with log

    return node;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id);
    
    // Add pri array
    let priJson = `[${this.pri[0]},${this.pri[1]},${this.pri[2]}]`;
    builder.addRawField("pri", priJson);
    
    // Add phaseRing array
    let phaseRingJson = "[";
    for (let i = 0; i < this.phaseRing.length; i++) {
      if (i > 0) phaseRingJson += ",";
      phaseRingJson += this.phaseRing[i].toString();
    }
    phaseRingJson += "]";
    
    builder.addRawField("phaseRing", phaseRingJson)
      .addNumberField("coherence", this.coherence)
      .endObject();
    
    return builder.build();
  }

  /**
   * Returns a string representation of the EntangledNode.
   */
  toString(): string {
    return this.toJSON();
  }
}

// TeleportationChannel: Represents a channel for teleporting ResonantFragments between nodes.
export class TeleportationChannel implements Serializable {
  source: EntangledNode;          // The source node of the channel
  target: EntangledNode;          // The target node of the channel
  strength: f64;                  // The strength of the teleportation channel
  holographicMemory: ResonantFragment; // The fragment being teleported through this channel

  /**
   * Constructs a new TeleportationChannel.
   * @param source The source EntangledNode.
   * @param target The target EntangledNode.
   * @param strength The strength of the channel.
   * @param memory The ResonantFragment being transmitted.
   */
  constructor(source: EntangledNode, target: EntangledNode, strength: f64, memory: ResonantFragment) {
    this.source = source;
    this.target = target;
    this.strength = strength;
    this.holographicMemory = memory;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    return builder
      .startObject()
      .addRawField("source", this.source.toJSON())
      .addRawField("target", this.target.toJSON())
      .addNumberField("strength", this.strength)
      .addRawField("holographicMemory", this.holographicMemory.toJSON())
      .endObject()
      .build();
  }

  /**
   * Returns a string representation of the TeleportationChannel.
   */
  toString(): string {
    return this.toJSON();
  }
}

// Global variable to represent the 'currentNode' in the ResoLang environment.
// This is used for operations like `teleport` which refer to `thisNode`.
export var currentNode: EntangledNode | null = null;

/**
 * Sets the global current node.
 * @param node The EntangledNode to set as the current node.
 */
export function setCurrentNode(node: EntangledNode | null): void {
  currentNode = node;
}

// Export PI for convenience, as specified in ResoLang syntax.
export const PI: f64 = Math.PI;

// Attractor: Represents a symbolic pattern or state the system resonates with.
export class Attractor implements Serializable {
  primes: Array<Prime>;      // A set of prime numbers associated with the attractor
  targetPhase: Array<Phase>; // The target phase configuration for this attractor
  symbol: string;            // A symbolic name for the attractor (e.g., "UNITY")
  coherence: f64;            // The coherence level of the attractor

  /**
   * Constructs a new Attractor.
   * @param symbol The symbolic name of the attractor.
   * @param primes An array of prime numbers.
   * @param targetPhase An array of target phases.
   * @param coherence The coherence of the attractor.
   */
  constructor(symbol: string, primes: Array<Prime>, targetPhase: Array<Phase>, coherence: f64 = 0.0) {
    this.symbol = symbol;
    this.primes = primes;
    this.targetPhase = targetPhase;
    this.coherence = coherence;
  }

  /**
   * Creates a conceptual Attractor based on a symbol and coherence.
   * This simulates the `@resonant` meta-construct for attractors.
   * @param symbol The symbolic name (e.g., "truth", "Harmony").
   * @param coherence The desired coherence of the attractor.
   * @returns A new Attractor instance.
   */
  static create(symbol: string, coherence: f64 = 0.0): Attractor {
    // In a real ResoLang, these would be derived from complex prime field calculations
    // based on the symbol. This is a more deterministic, yet still simplified, approach.
    const primes = new Array<Prime>();
    const targetPhase = new Array<Phase>();
    let primeCandidate: Prime = 2;

    for (let i = 0; i < symbol.length; i++) {
      let currentPrime = primeCandidate;
      while(!isPrime(currentPrime)) {
        currentPrime++;
      }
      primes.push(currentPrime);
      targetPhase.push((<f64>symbol.charCodeAt(i) / 255.0) * 2 * Math.PI);
      primeCandidate = currentPrime + 1;
    }

    return new Attractor(symbol, primes, targetPhase, coherence);
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("symbol", this.symbol)
      .addNumberField("coherence", this.coherence);
    
    // Add primes array
    let primesJson = "[";
    for (let i = 0; i < this.primes.length; i++) {
      if (i > 0) primesJson += ",";
      primesJson += this.primes[i].toString();
    }
    primesJson += "]";
    
    // Add targetPhase array
    let targetPhaseJson = "[";
    for (let i = 0; i < this.targetPhase.length; i++) {
      if (i > 0) targetPhaseJson += ",";
      targetPhaseJson += this.targetPhase[i].toString();
    }
    targetPhaseJson += "]";
    
    builder.addRawField("primes", primesJson)
      .addRawField("targetPhase", targetPhaseJson)
      .endObject();
    
    return builder.build();
  }

  /**
   * Returns a string representation of the Attractor.
   */
  toString(): string {
    return this.toJSON();
  }
}


// Export wrapper functions for static class methods to be available in JS bindings
export function createResonantFragment(pattern: string, spatialEntropy: f64 = 0.5, angularPosition: f64 = Math.PI / 4): ResonantFragment {
  return ResonantFragment.encode(pattern, spatialEntropy, angularPosition);
}

export function generateEntangledNode(p1: Prime, p2: Prime, p3: Prime): EntangledNode {
  return EntangledNode.generateNode(p1, p2, p3);
}

export function createAttractor(symbol: string, coherence: f64 = 0.0): Attractor {
  return Attractor.create(symbol, coherence);
}

export function resonantFragmentToJSON(fragment: ResonantFragment): string {
  return fragment.toJSON();
}
