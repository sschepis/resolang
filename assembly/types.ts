// types.ts
// Core type definitions for the Prime Resonance Network

import { Serializable } from "./core/interfaces";
import { JSONBuilder } from "./core/serialization";
import { toFixed } from "./utils";

export type Prime = u32;
export type Phase = f64;
export type Amplitude = f64;
export type Entropy = f64;

/**
 * Complex number implementation
 */
export class Complex implements Serializable {
  real: f64;
  imag: f64;
  
  constructor(real: f64 = 0, imag: f64 = 0) {
    this.real = real;
    this.imag = imag;
  }
  
  /**
   * Create complex number from polar coordinates
   */
  static fromPolar(magnitude: f64, phase: f64): Complex {
    return new Complex(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }
  
  /**
   * Add two complex numbers
   */
  add(other: Complex): Complex {
    return new Complex(
      this.real + other.real,
      this.imag + other.imag
    );
  }
  
  /**
   * Subtract complex numbers
   */
  subtract(other: Complex): Complex {
    return new Complex(
      this.real - other.real,
      this.imag - other.imag
    );
  }
  
  /**
   * Multiply two complex numbers
   */
  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }
  
  /**
   * Divide complex numbers
   */
  divide(other: Complex): Complex {
    const denominator = other.real * other.real + other.imag * other.imag;
    if (denominator === 0) {
      throw new Error("Division by zero");
    }
    
    return new Complex(
      (this.real * other.real + this.imag * other.imag) / denominator,
      (this.imag * other.real - this.real * other.imag) / denominator
    );
  }

  /**
   * Alias for divide
   */
  div(other: Complex): Complex {
    return this.divide(other);
  }
  
  /**
   * Scale by a real number
   */
  scale(factor: f64): Complex {
    return new Complex(
      this.real * factor,
      this.imag * factor
    );
  }
  
  /**
   * Complex conjugate
   */
  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }
  
  /**
   * Magnitude (absolute value)
   */
  magnitude(): f64 {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  magnitudeSquared(): f64 {
    return this.real * this.real + this.imag * this.imag;
  }

  /**
   * Alias for magnitude()
   */
  abs(): f64 {
    return this.magnitude();
  }
  
  /**
   * Magnitude squared (more efficient when you don't need the actual magnitude)
   */
  squaredMagnitude(): f64 {
    return this.real * this.real + this.imag * this.imag;
  }
  
  /**
   * Phase angle in radians
   */
  phase(): f64 {
    return Math.atan2(this.imag, this.real);
  }
  
  /**
   * String representation
   */
  toString(): string {
    const realStr = toFixed(this.real, 4); // Limit to 4 decimal places
    const imagStr = toFixed(this.imag, 4); // Limit to 4 decimal places
    if (this.imag >= 0) {
      return `${realStr}+${imagStr}i`;
    } else {
      return `${realStr}${imagStr}i`;
    }
  }
  
  /**
   * JSON representation
   */
  toJSON(): string {
    const builder = new JSONBuilder();
    return builder
      .startObject()
      .addNumberField("real", this.real)
      .addNumberField("imag", this.imag)
      .endObject()
      .build();
  }
  
  /**
   * Clone the complex number
   */
  clone(): Complex {
    return new Complex(this.real, this.imag);
  }

  /**
   * Complex exponential
   */
  exp(): Complex {
    const e_real = Math.exp(this.real);
    return new Complex(
      e_real * Math.cos(this.imag),
      e_real * Math.sin(this.imag)
    );
  }
}

/**
 * Resonant fragment for holographic memory
 */
export class ResonantFragment {
  data: Uint8Array;
  entropy: f64;
  timestamp: i64;
  primeSignature: Array<Prime>;
  
  constructor(
    data: Uint8Array,
    entropy: f64,
    timestamp: i64,
    primeSignature: Array<Prime>
  ) {
    this.data = data;
    this.entropy = entropy;
    this.timestamp = timestamp;
    this.primeSignature = primeSignature;
  }
}

/**
 * Node ID type
 */
export type NodeID = string;

/**
 * Entanglement strength type
 */
export type EntanglementStrength = f64;

/**
 * Protocol message types
 */
export enum ProtocolType {
  EIP = 0,  // Entanglement Initialization Protocol
  MTP = 1,  // Memory Teleportation Protocol
  RRP = 2,  // Resonance Routing Protocol
  PSP = 3   // Phase Synchronization Protocol
}

/**
 * Network error codes
 */
export enum NetworkError {
  NODE_NOT_FOUND = 1001,
  NODE_ALREADY_EXISTS = 1002,
  ENTANGLEMENT_FAILED = 1003,
  LOW_COHERENCE = 1004,
  NOT_ENTANGLED = 1005,
  MEMORY_FULL = 1006,
  NETWORK_UNSTABLE = 1007,
  INVALID_PRIME = 1008,
  SYNCHRONIZATION_FAILED = 1009
}

/**
 * Protocol error codes
 */
export enum ProtocolError {
  TIMEOUT = 2001,
  INVALID_MESSAGE = 2002,
  NOT_ENTANGLED = 2003,
  LOW_COHERENCE = 2004,
  ROUTE_NOT_FOUND = 2005,
  SYNC_FAILED = 2006,
  FIDELITY_TOO_LOW = 2007,
  MESSAGE_TOO_LARGE = 2008,
  SIGNATURE_INVALID = 2009
}

/**
 * Entanglement link between nodes
 */
export class EntanglementLink {
  sourceId: NodeID;
  targetId: NodeID;
  strength: EntanglementStrength;
  establishedAt: i64;
  lastSync: i64;
  
  constructor(
    sourceId: NodeID,
    targetId: NodeID,
    strength: EntanglementStrength,
    establishedAt: i64 = 0,
    lastSync: i64 = 0
  ) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.strength = strength;
    this.establishedAt = establishedAt;
    this.lastSync = lastSync;
  }
}

/**
 * Node metadata
 */
export class NodeMetadata {
  nodeId: NodeID;
  coherence: f64;
  entropy: f64;
  memoryUsage: i32;
  lastHeartbeat: i64;
  
  constructor(
    nodeId: NodeID,
    coherence: f64 = 1.0,
    entropy: f64 = 0.0,
    memoryUsage: i32 = 0,
    lastHeartbeat: i64 = 0
  ) {
    this.nodeId = nodeId;
    this.coherence = coherence;
    this.entropy = entropy;
    this.memoryUsage = memoryUsage;
    this.lastHeartbeat = lastHeartbeat;
  }
}

/**
 * Prime field element for cryptographic operations
 */
export class PrimeFieldElement {
  value: i64;
  modulus: i64;
  
  constructor(value: i64, modulus: i64) {
    this.value = value % modulus;
    if (this.value < 0) {
      this.value += modulus;
    }
    this.modulus = modulus;
  }
  
  add(other: PrimeFieldElement): PrimeFieldElement {
    if (this.modulus !== other.modulus) {
      throw new Error("Modulus mismatch");
    }
    return new PrimeFieldElement(this.value + other.value, this.modulus);
  }
  
  multiply(other: PrimeFieldElement): PrimeFieldElement {
    if (this.modulus !== other.modulus) {
      throw new Error("Modulus mismatch");
    }
    return new PrimeFieldElement(this.value * other.value, this.modulus);
  }
  
  power(exponent: i64): PrimeFieldElement {
    let result = new PrimeFieldElement(1, this.modulus);
    let base = new PrimeFieldElement(this.value, this.modulus);
    
    while (exponent > 0) {
      if (exponent & 1) {
        result = result.multiply(base);
      }
      base = base.multiply(base);
      exponent >>= 1;
    }
    
    return result;
  }
  
  inverse(): PrimeFieldElement {
    // Extended Euclidean algorithm
    let a = this.value;
    let b = this.modulus;
    let x: i64 = 0;
    let y: i64 = 1;
    let lastX: i64 = 1;
    let lastY: i64 = 0;
    
    while (b !== 0) {
      const quotient = a / b;
      
      let temp = b;
      b = a % b;
      a = temp;
      
      temp = x;
      x = lastX - quotient * x;
      lastX = temp;
      
      temp = y;
      y = lastY - quotient * y;
      lastY = temp;
    }
    
    if (a !== 1) {
      throw new Error("Element has no inverse");
    }
    
    return new PrimeFieldElement(lastX, this.modulus);
  }
}