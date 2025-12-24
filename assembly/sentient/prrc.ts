/**
 * Prime-Resonant Resonance Channel (PRRC)
 * 
 * Non-local communication channel for the Distributed Sentience Network.
 * From whitepaper Section 6.3:
 * 
 * A PRRC session establishes shared synchronization context:
 * - Prime set: P_c used as the channel basis (selected for stability and sparsity)
 * - Phase alignment: handshake aligns sender/receiver phase reference frames
 * - Protection layers: topological transport and holonomy-based wrapping
 * 
 * Practical Channel Interface:
 * encode: (Ω, P_c, θ) → σ
 * decode: σ → Ω̂
 * 
 * σ = T_topo(T_hol(ResEncode(Ω)))
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { generatePrimesOptimized } from '../core/math-primes';
import { MemoryObject } from './gmf';

// ============================================================================
// ID Generator
// ============================================================================

let _prrcIdCounter: i64 = 0;

function generateId(prefix: string = "prrc"): string {
  _prrcIdCounter++;
  const timestamp = Date.now() as i64;
  return `${prefix}_${timestamp}_${_prrcIdCounter}`;
}

// ============================================================================
// Channel Configuration
// ============================================================================

/**
 * PRRC Channel Configuration
 */
export class PRRCConfig {
  // Prime set configuration
  channelPrimeCount: i32 = 32;
  primeSelectionMode: string = "sparse";  // "sparse", "dense", "random"
  
  // Phase alignment
  phaseReferenceMode: string = "zero";  // "zero", "random", "derived"
  phaseTolerance: f64 = 0.1;  // Radians
  
  // Protection layers
  enableTopologicalProtection: bool = true;
  enableHolonomyWrapping: bool = true;
  
  // Encoding parameters
  encodingPrecision: i32 = 64;  // Bits
  compressionLevel: i32 = 1;  // 0=none, 1=light, 2=heavy
  
  // Security
  maxPacketSize: i32 = 65536;
  checksumEnabled: bool = true;
  
  constructor() {}
}

// ============================================================================
// Channel State
// ============================================================================

/**
 * Phase reference frame for a channel endpoint
 */
export class PhaseReference implements Serializable {
  phases: Float64Array;
  timestamp: i64;
  nodeId: string;
  
  constructor(primeCount: i32) {
    this.phases = new Float64Array(primeCount);
    this.timestamp = Date.now() as i64;
    this.nodeId = "";
  }
  
  /**
   * Compute phase difference to another reference
   */
  phaseDifference(other: PhaseReference): Float64Array {
    const diff = new Float64Array(this.phases.length);
    const len = Math.min(this.phases.length, other.phases.length) as i32;
    
    for (let i = 0; i < len; i++) {
      diff[i] = this.phases[i] - other.phases[i];
      // Normalize to [-π, π]
      while (diff[i] > Math.PI) diff[i] -= 2 * Math.PI;
      while (diff[i] < -Math.PI) diff[i] += 2 * Math.PI;
    }
    
    return diff;
  }
  
  /**
   * Align to another reference
   */
  alignTo(other: PhaseReference): void {
    const diff = this.phaseDifference(other);
    for (let i = 0; i < this.phases.length; i++) {
      this.phases[i] -= diff[i];
    }
    this.timestamp = Date.now() as i64;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("nodeId", this.nodeId)
      .addNumberField("timestamp", f64(this.timestamp))
      .addNumberField("phaseCount", f64(this.phases.length))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `PhaseRef(${this.nodeId}, phases=${this.phases.length})`;
  }
}

// ============================================================================
// Encoded Packet
// ============================================================================

/**
 * Encoded PRRC packet
 * σ = T_topo(T_hol(ResEncode(Ω)))
 */
export class PRRCPacket implements Serializable {
  id: string;
  timestamp: i64;
  
  // Header
  sourceNodeId: string;
  targetNodeId: string;
  channelId: string;
  sequenceNumber: i32;
  
  // Encoded content
  encodedAmplitudes: Float64Array;
  encodedPhases: Float64Array;
  channelPrimes: i32[];
  
  // Protection layers
  topologicalSignature: Float64Array;
  holonomyPhase: f64;
  
  // Metadata
  originalObjectId: string;
  checksum: string;
  
  constructor() {
    this.id = generateId("pkt");
    this.timestamp = Date.now() as i64;
    this.sourceNodeId = "";
    this.targetNodeId = "";
    this.channelId = "";
    this.sequenceNumber = 0;
    this.encodedAmplitudes = new Float64Array(0);
    this.encodedPhases = new Float64Array(0);
    this.channelPrimes = [];
    this.topologicalSignature = new Float64Array(0);
    this.holonomyPhase = 0;
    this.originalObjectId = "";
    this.checksum = "";
  }
  
  /**
   * Compute checksum of packet
   */
  computeChecksum(): string {
    let sum: f64 = 0;
    for (let i = 0; i < this.encodedAmplitudes.length; i++) {
      sum += this.encodedAmplitudes[i] * f64(i + 1);
      sum += this.encodedPhases[i] * f64(i + 1) * 0.1;
    }
    sum += this.holonomyPhase * 1000;
    return `${i64(sum * 1e12)}`;
  }
  
  /**
   * Verify packet integrity
   */
  verify(): bool {
    return this.checksum == this.computeChecksum();
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("timestamp", f64(this.timestamp))
      .addStringField("sourceNodeId", this.sourceNodeId)
      .addStringField("targetNodeId", this.targetNodeId)
      .addStringField("channelId", this.channelId)
      .addNumberField("sequenceNumber", f64(this.sequenceNumber))
      .addNumberField("primeCount", f64(this.channelPrimes.length))
      .addNumberField("holonomyPhase", this.holonomyPhase)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Packet(${this.id.substring(0, 8)}, seq=${this.sequenceNumber})`;
  }
}

// ============================================================================
// Topological Transport
// ============================================================================

/**
 * Topological transport protection layer
 * Provides stability through topological invariants
 */
export class TopologicalTransport {
  // Winding numbers for protection
  windingNumbers: i32[];
  
  constructor(primeCount: i32) {
    this.windingNumbers = new Array<i32>(primeCount);
    for (let i = 0; i < primeCount; i++) {
      this.windingNumbers[i] = 0;
    }
  }
  
  /**
   * Apply topological wrapping to phases
   * Returns topological signature
   */
  wrap(phases: Float64Array): Float64Array {
    const signature = new Float64Array(phases.length);
    
    for (let i = 0; i < phases.length; i++) {
      // Compute winding number
      const winding = i32(Math.floor(phases[i] / (2 * Math.PI)));
      this.windingNumbers[i] = winding;
      
      // Create signature based on winding
      signature[i] = f64(winding) * Math.PI / 10.0;
    }
    
    return signature;
  }
  
  /**
   * Unwrap phases using topological signature
   */
  unwrap(phases: Float64Array, signature: Float64Array): Float64Array {
    const unwrapped = new Float64Array(phases.length);
    
    for (let i = 0; i < phases.length; i++) {
      // Recover winding from signature
      const winding = i32(Math.round(signature[i] * 10.0 / Math.PI));
      
      // Apply inverse wrapping
      unwrapped[i] = phases[i] + f64(winding) * 2 * Math.PI;
    }
    
    return unwrapped;
  }
  
  /**
   * Compute topological invariant (total winding)
   */
  invariant(): i32 {
    let total = 0;
    for (let i = 0; i < this.windingNumbers.length; i++) {
      total += this.windingNumbers[i];
    }
    return total;
  }
}

// ============================================================================
// Holonomy Wrapper
// ============================================================================

/**
 * Holonomy-based phase wrapping for security
 * Based on geometric phase accumulation around closed loops
 */
export class HolonomyWrapper {
  // Reference loop path
  loopPath: Float64Array;
  accumulatedPhase: f64;
  
  constructor(primeCount: i32) {
    this.loopPath = new Float64Array(primeCount);
    this.accumulatedPhase = 0;
    
    // Initialize with golden angle loop
    for (let i = 0; i < primeCount; i++) {
      this.loopPath[i] = f64(i) * 2.399963229728653;  // Golden angle
    }
  }
  
  /**
   * Apply holonomy wrapping
   * Returns holonomy phase
   */
  wrap(phases: Float64Array): f64 {
    let holonomy: f64 = 0;
    
    // Compute geometric phase around loop
    for (let i = 0; i < phases.length; i++) {
      const next = (i + 1) % phases.length;
      holonomy += Math.sin(phases[i] - phases[next] + this.loopPath[i]);
    }
    
    this.accumulatedPhase = holonomy;
    return holonomy;
  }
  
  /**
   * Verify holonomy matches expected value
   */
  verify(phases: Float64Array, expectedHolonomy: f64, tolerance: f64 = 0.01): bool {
    const computed = this.wrap(phases);
    return Math.abs(computed - expectedHolonomy) < tolerance;
  }
  
  /**
   * Apply phase correction based on holonomy
   */
  correct(phases: Float64Array, targetHolonomy: f64): Float64Array {
    const corrected = new Float64Array(phases.length);
    const currentHolonomy = this.wrap(phases);
    
    const correction = (targetHolonomy - currentHolonomy) / f64(phases.length);
    
    for (let i = 0; i < phases.length; i++) {
      corrected[i] = phases[i] + correction;
    }
    
    return corrected;
  }
}

// ============================================================================
// Resonance Encoder
// ============================================================================

/**
 * Prime-resonant encoding of memory objects
 */
export class ResonanceEncoder {
  channelPrimes: i32[];
  primeFrequencies: Float64Array;
  
  constructor(channelPrimes: i32[]) {
    this.channelPrimes = channelPrimes;
    this.primeFrequencies = new Float64Array(channelPrimes.length);
    
    // Compute prime frequencies: f(p) = 1 + ln(p)/10
    for (let i = 0; i < channelPrimes.length; i++) {
      this.primeFrequencies[i] = 1.0 + Math.log(f64(channelPrimes[i])) / 10.0;
    }
  }
  
  /**
   * Encode memory object amplitudes to channel basis
   */
  encodeAmplitudes(object: MemoryObject): Float64Array {
    const encoded = new Float64Array(this.channelPrimes.length);
    
    // Map object primes to channel primes
    for (let i = 0; i < this.channelPrimes.length; i++) {
      const channelPrime = this.channelPrimes[i];
      
      // Find matching prime in object
      for (let j = 0; j < object.primes.length; j++) {
        if (object.primes[j] == channelPrime) {
          encoded[i] = object.amplitudes[j];
          break;
        }
      }
      
      // Apply frequency modulation for resonance
      encoded[i] *= Math.cos(this.primeFrequencies[i] * 0.1);
    }
    
    return encoded;
  }
  
  /**
   * Encode memory object phases with phase coherence
   */
  encodePhases(object: MemoryObject): Float64Array {
    const encoded = new Float64Array(this.channelPrimes.length);
    
    for (let i = 0; i < this.channelPrimes.length; i++) {
      const channelPrime = this.channelPrimes[i];
      
      for (let j = 0; j < object.primes.length; j++) {
        if (object.primes[j] == channelPrime) {
          encoded[i] = object.phases[j];
          break;
        }
      }
    }
    
    return encoded;
  }
  
  /**
   * Decode amplitudes back to object basis
   */
  decodeAmplitudes(
    encoded: Float64Array,
    targetPrimes: i32[]
  ): Float64Array {
    const decoded = new Float64Array(targetPrimes.length);
    
    for (let i = 0; i < targetPrimes.length; i++) {
      const targetPrime = targetPrimes[i];
      
      for (let j = 0; j < this.channelPrimes.length; j++) {
        if (this.channelPrimes[j] == targetPrime) {
          // Reverse frequency modulation
          decoded[i] = encoded[j] / Math.cos(this.primeFrequencies[j] * 0.1);
          break;
        }
      }
    }
    
    return decoded;
  }
  
  /**
   * Decode phases
   */
  decodePhases(
    encoded: Float64Array,
    targetPrimes: i32[]
  ): Float64Array {
    const decoded = new Float64Array(targetPrimes.length);
    
    for (let i = 0; i < targetPrimes.length; i++) {
      const targetPrime = targetPrimes[i];
      
      for (let j = 0; j < this.channelPrimes.length; j++) {
        if (this.channelPrimes[j] == targetPrime) {
          decoded[i] = encoded[j];
          break;
        }
      }
    }
    
    return decoded;
  }
}

// ============================================================================
// PRRC Channel
// ============================================================================

/**
 * Prime-Resonant Resonance Channel
 * Main channel class for encoding/decoding memory objects
 */
export class PRRCChannel implements Serializable {
  id: string;
  config: PRRCConfig;
  
  // Channel primes
  channelPrimes: i32[];
  
  // Components
  encoder: ResonanceEncoder;
  topology: TopologicalTransport;
  holonomy: HolonomyWrapper;
  
  // Phase references
  localReference: PhaseReference;
  remoteReference: PhaseReference | null;
  
  // State
  sequenceCounter: i32;
  isConnected: bool;
  lastPacketTime: i64;
  
  // Statistics
  packetsSent: i32;
  packetsReceived: i32;
  decodeErrors: i32;
  
  constructor(config: PRRCConfig = new PRRCConfig()) {
    this.id = generateId("chan");
    this.config = config;
    
    // Generate channel primes using local variable first
    // (to avoid using 'this' before all properties are initialized)
    const primes = generatePrimesOptimized(config.channelPrimeCount);
    const channelPrimesLocal = new Array<i32>(primes.length);
    for (let i = 0; i < primes.length; i++) {
      channelPrimesLocal[i] = i32(primes[i]);
    }
    
    // Initialize all properties before assigning channelPrimes
    // (AssemblyScript requires all properties initialized before using 'this')
    this.channelPrimes = channelPrimesLocal;
    this.encoder = new ResonanceEncoder(channelPrimesLocal);
    this.topology = new TopologicalTransport(config.channelPrimeCount);
    this.holonomy = new HolonomyWrapper(config.channelPrimeCount);
    this.localReference = new PhaseReference(config.channelPrimeCount);
    this.remoteReference = null;
    
    // State
    this.sequenceCounter = 0;
    this.isConnected = false;
    this.lastPacketTime = 0;
    
    // Statistics
    this.packetsSent = 0;
    this.packetsReceived = 0;
    this.decodeErrors = 0;
  }
  
  /**
   * Perform handshake with remote endpoint
   */
  handshake(remoteReference: PhaseReference): bool {
    this.remoteReference = remoteReference;
    
    // Align local reference to remote
    this.localReference.alignTo(remoteReference);
    
    this.isConnected = true;
    return true;
  }
  
  /**
   * Encode a memory object into a packet
   * σ = T_topo(T_hol(ResEncode(Ω)))
   */
  encode(object: MemoryObject, targetNodeId: string): PRRCPacket {
    const packet = new PRRCPacket();
    
    // Header
    packet.sourceNodeId = this.localReference.nodeId;
    packet.targetNodeId = targetNodeId;
    packet.channelId = this.id;
    packet.sequenceNumber = this.sequenceCounter++;
    packet.originalObjectId = object.id;
    packet.channelPrimes = this.channelPrimes;
    
    // Step 1: ResEncode - encode to channel basis
    const encodedAmplitudes = this.encoder.encodeAmplitudes(object);
    let encodedPhases = this.encoder.encodePhases(object);
    
    // Step 2: T_hol - holonomy wrapping
    if (this.config.enableHolonomyWrapping) {
      packet.holonomyPhase = this.holonomy.wrap(encodedPhases);
    }
    
    // Step 3: T_topo - topological protection
    if (this.config.enableTopologicalProtection) {
      packet.topologicalSignature = this.topology.wrap(encodedPhases);
    }
    
    // Store encoded data
    packet.encodedAmplitudes = encodedAmplitudes;
    packet.encodedPhases = encodedPhases;
    
    // Compute checksum
    if (this.config.checksumEnabled) {
      packet.checksum = packet.computeChecksum();
    }
    
    this.packetsSent++;
    this.lastPacketTime = Date.now() as i64;
    
    return packet;
  }
  
  /**
   * Decode a packet back into a memory object
   * Ω̂ ← decode(σ)
   */
  decode(packet: PRRCPacket): MemoryObject | null {
    this.packetsReceived++;
    
    // Verify checksum if enabled
    if (this.config.checksumEnabled && !packet.verify()) {
      this.decodeErrors++;
      return null;
    }
    
    // Step 1: Inverse T_topo - unwrap topological protection
    let decodedPhases = packet.encodedPhases;
    if (this.config.enableTopologicalProtection) {
      decodedPhases = this.topology.unwrap(decodedPhases, packet.topologicalSignature);
    }
    
    // Step 2: Verify T_hol - holonomy verification
    if (this.config.enableHolonomyWrapping) {
      if (!this.holonomy.verify(decodedPhases, packet.holonomyPhase, 0.1)) {
        // Try to correct
        decodedPhases = this.holonomy.correct(decodedPhases, packet.holonomyPhase);
      }
    }
    
    // Step 3: ResDecode - decode from channel basis to object basis
    const objectPrimes = this.channelPrimes.slice();
    const objectAmplitudes = this.encoder.decodeAmplitudes(packet.encodedAmplitudes, objectPrimes);
    const objectPhases = this.encoder.decodePhases(decodedPhases, objectPrimes);
    
    // Create reconstructed memory object
    const smfOrientation = new Float64Array(16);
    // Default SMF orientation (would be encoded in real implementation)
    for (let i = 0; i < 16; i++) {
      smfOrientation[i] = 1.0 / 16.0;
    }
    
    const object = new MemoryObject(
      objectPrimes,
      objectAmplitudes,
      objectPhases,
      smfOrientation,
      packet.sourceNodeId,
      "",  // momentId not preserved
      0,   // coherence not preserved
      0    // entropy not preserved
    );
    
    return object;
  }
  
  /**
   * Get channel statistics
   */
  getStats(): PRRCStats {
    return new PRRCStats(
      this.packetsSent,
      this.packetsReceived,
      this.decodeErrors,
      this.isConnected,
      this.lastPacketTime
    );
  }
  
  /**
   * Reset channel state
   */
  reset(): void {
    this.sequenceCounter = 0;
    this.isConnected = false;
    this.remoteReference = null;
    this.packetsSent = 0;
    this.packetsReceived = 0;
    this.decodeErrors = 0;
    this.lastPacketTime = 0;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addBooleanField("isConnected", this.isConnected)
      .addNumberField("packetsSent", f64(this.packetsSent))
      .addNumberField("packetsReceived", f64(this.packetsReceived))
      .addNumberField("decodeErrors", f64(this.decodeErrors))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `PRRCChannel(${this.id.substring(0, 8)}, connected=${this.isConnected})`;
  }
}

// ============================================================================
// PRRC Statistics
// ============================================================================

/**
 * Channel statistics
 */
export class PRRCStats implements Serializable {
  packetsSent: i32;
  packetsReceived: i32;
  decodeErrors: i32;
  isConnected: bool;
  lastPacketTime: i64;
  
  constructor(
    packetsSent: i32,
    packetsReceived: i32,
    decodeErrors: i32,
    isConnected: bool,
    lastPacketTime: i64
  ) {
    this.packetsSent = packetsSent;
    this.packetsReceived = packetsReceived;
    this.decodeErrors = decodeErrors;
    this.isConnected = isConnected;
    this.lastPacketTime = lastPacketTime;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("packetsSent", f64(this.packetsSent))
      .addNumberField("packetsReceived", f64(this.packetsReceived))
      .addNumberField("decodeErrors", f64(this.decodeErrors))
      .addBooleanField("isConnected", this.isConnected)
      .addNumberField("lastPacketTime", f64(this.lastPacketTime))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `PRRCStats(sent=${this.packetsSent}, recv=${this.packetsReceived})`;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a new PRRC channel with default configuration
 */
export function createPRRCChannel(): PRRCChannel {
  return new PRRCChannel();
}

/**
 * Create a new PRRC channel with custom configuration
 */
export function createPRRCChannelWithConfig(config: PRRCConfig): PRRCChannel {
  return new PRRCChannel(config);
}

/**
 * Create a phase reference for a node
 */
export function createPhaseReference(nodeId: string, primeCount: i32 = 32): PhaseReference {
  const ref = new PhaseReference(primeCount);
  ref.nodeId = nodeId;
  return ref;
}

/**
 * Create a PRRC configuration
 */
export function createPRRCConfig(): PRRCConfig {
  return new PRRCConfig();
}