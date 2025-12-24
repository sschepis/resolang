// keytriplet.ts
// Implementation of Prime-Resonant Keytriplets for secure non-local communication
// Based on "Prime-Resonant Keytriplets and Symbolic Field Evolution for Non-Local Communication"

import { PrimeState } from '../quantum/prime-state';
import { Prime, Complex, Amplitude } from "../types";
import { sha256, randomBytes } from "../core/crypto";
import { generatePrimes, isPrime } from "../core/math";

/**
 * Keytriplet structure (K_u^priv, K_u^pub, K_u^res)
 * Central to PR-UTC (Prime-Resonant Universal Translation and Communication)
 */
export class Keytriplet {
  private privateKey: PrimeState;      // K_u^priv ∈ H_P
  public classicalPublicKey: string;   // K_u^pub ∈ H_C (optional)
  public resonanceKey: PrimeState;     // K_u^res ∈ H_P^res
  
  constructor(
    privateKey: PrimeState,
    classicalPublicKey: string,
    resonanceKey: PrimeState
  ) {
    this.privateKey = privateKey;
    this.classicalPublicKey = classicalPublicKey;
    this.resonanceKey = resonanceKey;
  }
  
  /**
   * Generate a new Keytriplet for user
   * K_u^priv = H(S_global || ID_u)
   */
  static generate(globalSeed: string, userId: string): Keytriplet {
    // Generate private key using prime-entropy preserving hash
    const privateKey = KeytripletGenerator.generatePrivateKey(globalSeed, userId);
    
    // Generate classical public key (optional)
    const classicalPublicKey = KeytripletGenerator.generateClassicalPublicKey(privateKey);
    
    // Project to resonance key using Symbolic Projection Operator P
    const resonanceKey = SymbolicProjection.project(privateKey);
    
    return new Keytriplet(privateKey, classicalPublicKey, resonanceKey);
  }
  
  /**
   * Evolve the private key over time
   * K_u^priv(t + Δt) = U(Δt)K_u^priv(t)
   */
  evolve(deltaT: f64): void {
    this.privateKey = KeyEvolution.evolve(this.privateKey, deltaT);
    // Update resonance key after evolution
    this.resonanceKey = SymbolicProjection.project(this.privateKey);
  }
  
  getPrivateKey(): PrimeState {
    return this.privateKey.clone();
  }
  
  getResonanceKey(): PrimeState {
    return this.resonanceKey.clone();
  }
}

/**
 * Key generation utilities
 */
export class KeytripletGenerator {
  private static readonly KEY_PRIMES: i32 = 256; // Number of primes in key
  
  /**
   * Generate private key from global seed and user ID
   * Uses prime-entropy preserving hash function
   */
  static generatePrivateKey(globalSeed: string, userId: string): PrimeState {
    const input = globalSeed + "||" + userId;
    const hash = this.primeEntropyHash(input);
    
    // Generate prime basis
    const primes = generatePrimes(this.KEY_PRIMES);
    const amplitudes = new Map<Prime, Complex>();
    
    // Convert hash to complex amplitudes
    for (let i = 0; i < primes.length; i++) {
      const realPart = this.hashToAmplitude(hash, i * 2);
      const imagPart = this.hashToAmplitude(hash, i * 2 + 1);
      amplitudes.set(primes[i], new Complex(realPart, imagPart));
    }
    
    const state = PrimeState.fromPrimes(primes);
    const values = amplitudes.values();
    for (let i = 0; i < values.length; i++) {
      state.coefficients[i] = values[i];
    }
    state.normalize();
    
    return state;
  }
  
  /**
   * Generate classical public key (optional)
   */
  static generateClassicalPublicKey(privateKey: PrimeState): string {
    // Extract magnitude information only (phase-independent)
    const magnitudes: Array<f64> = [];
    
    for (let i = 0; i < privateKey.coefficients.length; i++) {
      magnitudes.push(privateKey.coefficients[i].magnitude());
    }
    
    // Hash to create classical key
    const magnitudeString = magnitudes.join(",");
    const buffer = new Uint8Array(magnitudeString.length);
    for (let i = 0; i < magnitudeString.length; i++) {
      buffer[i] = magnitudeString.charCodeAt(i);
    }
    const hash = sha256(buffer);
    let hex = "";
    for (let i = 0; i < hash.length; i++) {
      hex += ("0" + hash[i].toString(16)).slice(-2);
    }
    return hex;
  }
  
  /**
   * Prime-entropy preserving hash function
   */
  private static primeEntropyHash(input: string): Uint8Array {
    const buffer = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
      buffer[i] = input.charCodeAt(i);
    }
    let hash = sha256(buffer);
    
    // Apply prime-based mixing
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
    
    for (let round = 0; round < 3; round++) {
      const newHash = new Uint8Array(hash.length);
      
      for (let i = 0; i < hash.length; i++) {
        let mixed = hash[i];
        
        // Mix with prime operations
        for (let j = 0; j < primes.length; j++) {
          const prime = primes[j];
          const offset = (i * prime) % hash.length;
          mixed ^= hash[offset];
          mixed = (mixed * prime) % 256;
        }
        
        newHash[i] = mixed;
      }
      
      hash = newHash;
    }
    
    return hash;
  }
  
  /**
   * Convert hash bytes to normalized amplitude
   */
  private static hashToAmplitude(hash: Uint8Array, index: i32): f64 {
    const byte1 = hash[index % hash.length];
    const byte2 = hash[(index + 1) % hash.length];
    const value = (byte1 << 8) | byte2;
    
    // Normalize to [-1, 1]
    return (value / 32767.5) - 1.0;
  }
}

/**
 * Symbolic Projection Operator P
 * Projects private key to resonance key
 */
export class SymbolicProjection {
  private static readonly ATTENUATION_FACTOR: f64 = 0.7;
  
  /**
   * K_u^res = P(K_u^priv)
   * Selectively exposes prime modes with attenuation and phase shift
   */
  static project(privateKey: PrimeState): PrimeState {
    const resonanceKey = privateKey.clone();
    const allowedPrimes = this.selectAllowedPrimes(privateKey.primes);
    
    // Apply projection
    for (let i = 0; i < resonanceKey.primes.length; i++) {
      const prime = resonanceKey.primes[i];
      
      if (allowedPrimes.has(prime)) {
        // Apply attenuation factor s_p ∈ (0, 1]
        const s_p = this.getAttenuationFactor(prime);
        
        // Apply random phase shift θ_p ∈ [0, 2π)
        const theta_p = Math.random() * 2 * Math.PI;
        
        const coeff = resonanceKey.coefficients[i];
        const magnitude = coeff.magnitude() * s_p;
        const phase = coeff.phase() + theta_p;
        
        resonanceKey.coefficients[i] = Complex.fromPolar(magnitude, phase);
      } else {
        // Zero out non-allowed primes
        resonanceKey.coefficients[i] = new Complex(0, 0);
      }
    }
    
    resonanceKey.normalize();
    return resonanceKey;
  }
  
  /**
   * Select subset of primes to expose in resonance key
   */
  private static selectAllowedPrimes(primes: Array<Prime>): Set<Prime> {
    const allowed = new Set<Prime>();
    
    // Select approximately 60% of primes
    // Favor smaller primes for stability
    for (let i = 0; i < primes.length; i++) {
      const selectionProb = 0.6 * Math.exp(-i / (primes.length * 0.3));
      if (Math.random() < selectionProb) {
        allowed.add(primes[i]);
      }
    }
    
    // Ensure minimum set size
    if (allowed.size < primes.length * 0.3) {
      for (let i = 0; i < primes.length * 0.3; i++) {
        allowed.add(primes[i]);
      }
    }
    
    return allowed;
  }
  
  /**
   * Get attenuation factor for a prime
   */
  private static getAttenuationFactor(prime: Prime): f64 {
    // Larger primes get more attenuation
    const baseFactor = this.ATTENUATION_FACTOR;
    const primeLog = Math.log(prime as f64);
    return baseFactor * Math.exp(-primeLog / 10);
  }
}

/**
 * Key Evolution Operator U(Δt)
 * Maintains entropy freshness through controlled drift
 */
export class KeyEvolution {
  private static readonly KAPPA: f64 = 2.718; // Symbolic scaling constant
  private static readonly NOISE_SCALE: f64 = 0.01; // Bounded Gaussian phase noise
  
  /**
   * Evolve private key over time interval Δt
   * α_p(t + Δt) = α_p(t) * exp(i(2π log_p(κ)Δt + ε_p(Δt)))
   */
  static evolve(privateKey: PrimeState, deltaT: f64): PrimeState {
    const evolved = privateKey.clone();
    
    for (let i = 0; i < evolved.primes.length; i++) {
      const prime = evolved.primes[i];
      const coeff = evolved.coefficients[i];
      
      // Calculate phase evolution
      const logPrimeKappa = Math.log(this.KAPPA) / Math.log(prime as f64);
      const deterministicPhase = 2 * Math.PI * logPrimeKappa * deltaT;
      
      // Add bounded Gaussian noise
      const noise = this.boundedGaussianNoise() * this.NOISE_SCALE * deltaT;
      
      // Apply evolution
      const evolutionPhase = deterministicPhase + noise;
      const evolution = Complex.fromPolar(1.0, evolutionPhase);
      
      evolved.coefficients[i] = coeff.multiply(evolution);
    }
    
    evolved.normalize();
    return evolved;
  }
  
  /**
   * Generate bounded Gaussian noise
   */
  private static boundedGaussianNoise(): f64 {
    // Box-Muller transform for Gaussian
    const u1 = Math.random();
    const u2 = Math.random();
    const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Bound to [-3, 3] (99.7% of Gaussian)
    return Math.max(-3, Math.min(3, gaussian));
  }
}

/**
 * Resonance Field Initialization Operator R
 * Creates initial shared field from two resonance keys
 */
export class ResonanceFieldInitializer {
  private static readonly SIGMA: f64 = 5.0; // Prime frequency matching width
  
  /**
   * Initialize shared field Ψ_AB(0) from K_A^res and K_B^res
   */
  static initialize(
    keyA: PrimeState,
    keyB: PrimeState
  ): PrimeState {
    // Get union of prime bases
    const allPrimes = new Set<Prime>();
    keyA.primes.forEach(p => allPrimes.add(p));
    keyB.primes.forEach(p => allPrimes.add(p));
    
    const primeArray = allPrimes.values().sort((a, b) => a - b);
    const sharedField = PrimeState.fromPrimes(primeArray);
    
    // Initialize amplitudes with resonance matching
    let normalizationFactor = 0.0;
    
    for (let i = 0; i < primeArray.length; i++) {
      const p = primeArray[i];
      
      // Get coefficients from both keys
      const coeffA = this.getCoefficient(keyA, p);
      const coeffB = this.getCoefficient(keyB, p);
      
      // Calculate resonance amplitude
      let amplitude = new Complex(0, 0);
      
      for (let j = 0; j < primeArray.length; j++) {
        const q = primeArray[j];
        const coeffAq = this.getCoefficient(keyA, q);
        const coeffBq = this.getCoefficient(keyB, q);
        
        // Gaussian resonance kernel
        const resonance = Math.exp(-Math.pow(p - q, 2) / (2 * this.SIGMA * this.SIGMA));
        
        // Combine amplitudes
        const combined = coeffAq.multiply(coeffBq).scale(resonance);
        amplitude = amplitude.add(combined);
      }
      
      sharedField.coefficients[i] = amplitude;
      normalizationFactor += amplitude.magnitudeSquared();
    }
    
    // Normalize
    if (normalizationFactor > 0) {
      const norm = 1.0 / Math.sqrt(normalizationFactor);
      for (let i = 0; i < sharedField.coefficients.length; i++) {
        sharedField.coefficients[i] = sharedField.coefficients[i].scale(norm);
      }
    }
    
    return sharedField;
  }
  
  /**
   * Get coefficient for a prime, or zero if not present
   */
  private static getCoefficient(state: PrimeState, prime: Prime): Complex {
    const index = state.primes.indexOf(prime);
    if (index >= 0) {
      return state.coefficients[index];
    }
    return new Complex(0, 0);
  }
}

/**
 * Session Field Evolution
 * Governs the dynamics of shared field during communication
 */
export class SessionFieldEvolution {
  private readonly lambda: f64 = 0.1; // Resonance collapse rate
  private readonly rStable: f64 = 0.25; // Stable resonance target
  
  /**
   * Evolve shared field according to:
   * d|Ψ(t)⟩/dt = iĤ|Ψ(t)⟩ - λ(R̂ - r_stable)|Ψ(t)⟩ + M̂(t)|Ψ(t)⟩
   */
  evolveField(
    field: PrimeState,
    deltaT: f64,
    message: MessagePerturbation | null = null
  ): PrimeState {
    let evolved = field.clone();
    
    // 1. Intrinsic prime-symbolic phase drift (Ĥ term)
    evolved = this.applyHamiltonian(evolved, deltaT);
    
    // 2. Resonance collapse toward semantic attractors (R̂ term)
    evolved = this.applyResonanceCollapse(evolved, deltaT);
    
    // 3. Message perturbation injection (M̂ term)
    if (message) {
      evolved = this.applyMessagePerturbation(evolved, message);
    }
    
    evolved.normalize();
    return evolved;
  }
  
  /**
   * Apply Hamiltonian evolution (intrinsic phase drift)
   */
  private applyHamiltonian(field: PrimeState, deltaT: f64): PrimeState {
    const evolved = field.clone();
    
    for (let i = 0; i < evolved.primes.length; i++) {
      const prime = evolved.primes[i];
      const energy = Math.log(prime as f64); // Prime-based energy levels
      const phase = energy * deltaT;
      
      const evolution = Complex.fromPolar(1.0, phase);
      evolved.coefficients[i] = evolved.coefficients[i].multiply(evolution);
    }
    
    return evolved;
  }
  
  /**
   * Apply resonance collapse dynamics
   */
  private applyResonanceCollapse(field: PrimeState, deltaT: f64): PrimeState {
    const evolved = field.clone();
    const currentResonance = this.calculateResonance(field);
    const resonanceDiff = currentResonance - this.rStable;
    
    // Apply damping based on resonance difference
    const damping = Math.exp(-this.lambda * resonanceDiff * deltaT);
    
    for (let i = 0; i < evolved.coefficients.length; i++) {
      evolved.coefficients[i] = evolved.coefficients[i].scale(damping);
    }
    
    return evolved;
  }
  
  /**
   * Apply message perturbation
   */
  private applyMessagePerturbation(
    field: PrimeState,
    message: MessagePerturbation
  ): PrimeState {
    const perturbed = field.clone();
    
    // Encode message as phase modulation on specific primes
    const messagePrimes = message.getTargetPrimes();
    
    for (let i = 0; i < perturbed.primes.length; i++) {
      const prime = perturbed.primes[i];
      
      if (messagePrimes.has(prime)) {
        const modulation = message.getModulation(prime);
        perturbed.coefficients[i] = perturbed.coefficients[i].multiply(modulation);
      }
    }
    
    return perturbed;
  }
  
  /**
   * Calculate current resonance metric
   */
  private calculateResonance(field: PrimeState): f64 {
    let resonance = 0.0;
    
    // Sum pairwise coherences
    for (let i = 0; i < field.coefficients.length; i++) {
      for (let j = i + 1; j < field.coefficients.length; j++) {
        const coherence = field.coefficients[i]
          .conjugate()
          .multiply(field.coefficients[j])
          .magnitude();
        resonance += coherence;
      }
    }
    
    // Normalize by number of pairs
    const numPairs = (field.coefficients.length * (field.coefficients.length - 1)) / 2;
    return resonance / numPairs;
  }
  
  /**
   * Check for collapse detection
   * S(t) ∈ [S_min, S_max] triggers message decoding
   */
  checkCollapse(field: PrimeState): boolean {
    const entropy = this.calculateSymbolicEntropy(field);
    return entropy >= 0.2 && entropy <= 0.3;
  }
  
  /**
   * Calculate symbolic entropy
   */
  private calculateSymbolicEntropy(field: PrimeState): f64 {
    let entropy = 0.0;
    
    for (let i = 0; i < field.coefficients.length; i++) {
      const prob = field.coefficients[i].magnitudeSquared();
      if (prob > 0) {
        entropy -= prob * Math.log2(prob);
      }
    }
    
    // Normalize to [0, 1]
    return entropy / Math.log2(field.coefficients.length);
  }
}

/**
 * Message perturbation for symbolic field communication
 */
export class MessagePerturbation {
  private targetPrimes: Set<Prime>;
  private modulations: Map<Prime, Complex>;
  
  constructor(message: string, primeMapping: PrimeMapping) {
    this.targetPrimes = new Set();
    this.modulations = new Map();
    
    // Encode message into prime modulations
    this.encodeMessage(message, primeMapping);
  }
  
  private encodeMessage(message: string, mapping: PrimeMapping): void {
    const bytes = new Uint8Array(message.length);
    for (let i = 0; i < message.length; i++) {
      bytes[i] = message.charCodeAt(i);
    }
    
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      const primes = mapping.byteToPrimes(byte);
      
      for (let i = 0; i < primes.length; i++) {
        const prime = primes[i];
        this.targetPrimes.add(prime);
        
        // Create phase modulation based on byte value and position
        const phase = (byte / 255) * 2 * Math.PI + (i / bytes.length) * Math.PI;
        const modulation = Complex.fromPolar(1.0, phase);
        
        this.modulations.set(prime, modulation);
      }
    }
  }
  
  getTargetPrimes(): Set<Prime> {
    return this.targetPrimes;
  }
  
  getModulation(prime: Prime): Complex {
    return this.modulations.get(prime) || new Complex(1, 0);
  }
}

/**
 * Prime mapping for message encoding
 */
export class PrimeMapping {
  private primePool: Array<Prime>;
  private byteMap: Map<u8, Array<Prime>>;
  
  constructor(numPrimes: i32 = 1024) {
    this.primePool = generatePrimes(numPrimes);
    this.byteMap = new Map();
    this.initializeMapping();
  }
  
  private initializeMapping(): void {
    // Map each byte value to a unique set of 3 primes
    for (let byte = 0; byte < 256; byte++) {
      const primes: Array<Prime> = [];
      
      // Use deterministic mapping based on byte value
      const offset = byte * 3;
      for (let i = 0; i < 3; i++) {
        const index = (offset + i) % this.primePool.length;
        primes.push(this.primePool[index]);
      }
      
      this.byteMap.set(byte as u8, primes);
    }
  }
  
  byteToPrimes(byte: u8): Array<Prime> {
    return this.byteMap.get(byte) || [];
  }
}

/**
 * Complete PR-UTC Communication System
 */
export class PRUTCSystem {
  private keytriplets: Map<string, Keytriplet>;
  private sessions: Map<string, CommunicationSession>;
  private globalSeed: string;
  
  constructor(globalSeed: string) {
    this.globalSeed = globalSeed;
    this.keytriplets = new Map();
    this.sessions = new Map();
  }
  
  /**
   * Register a new user in the system
   */
  registerUser(userId: string): Keytriplet {
    const keytriplet = Keytriplet.generate(this.globalSeed, userId);
    this.keytriplets.set(userId, keytriplet);
    return keytriplet;
  }
  
  /**
   * Establish communication session between two users
   */
  establishSession(userA: string, userB: string): string {
    const keyA = this.keytriplets.get(userA);
    const keyB = this.keytriplets.get(userB);
    
    if (!keyA || !keyB) {
      throw new Error("Users not registered");
    }
    
    // Initialize shared resonance field
    const sharedField = ResonanceFieldInitializer.initialize(
      keyA.getResonanceKey(),
      keyB.getResonanceKey()
    );
    
    const sessionId = `${userA}-${userB}-${Date.now()}`;
    const session = new CommunicationSession(
      sessionId,
      userA,
      userB,
      sharedField
    );
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }
  
  /**
   * Send message through established session
   */
  sendMessage(sessionId: string, sender: string, message: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    
    session.injectMessage(sender, message);
  }
  
  /**
   * Receive messages from session
   */
  receiveMessages(sessionId: string, receiver: string): Array<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    
    return session.extractMessages(receiver);
  }
  
  /**
   * Evolve all keytriplets (periodic maintenance)
   */
  evolveKeys(deltaT: f64): void {
    const entries = this.keytriplets.keys();
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const key = this.keytriplets.get(entry);
      if (key) {
        key.evolve(deltaT);
      }
    }
  }
}

/**
 * Communication session between two users
 */
class CommunicationSession {
  private sessionId: string;
  private userA: string;
  private userB: string;
  private sharedField: PrimeState;
  private evolution: SessionFieldEvolution;
  private primeMapping: PrimeMapping;
  private messageQueue: Array<QueuedMessage>;
  private extractedMessages: Map<string, Array<string>>;
  
  constructor(
    sessionId: string,
    userA: string,
    userB: string,
    initialField: PrimeState
  ) {
    this.sessionId = sessionId;
    this.userA = userA;
    this.userB = userB;
    this.sharedField = initialField;
    this.evolution = new SessionFieldEvolution();
    this.primeMapping = new PrimeMapping();
    this.messageQueue = [];
    this.extractedMessages = new Map();
    this.extractedMessages.set(userA, []);
    this.extractedMessages.set(userB, []);
  }
  
  /**
   * Inject message into the field
   */
  injectMessage(sender: string, message: string): void {
    const perturbation = new MessagePerturbation(message, this.primeMapping);
    this.messageQueue.push({
      sender: sender,
      message: message,
      perturbation: perturbation,
      timestamp: Date.now()
    });
  }
  
  /**
   * Extract messages for a user
   */
  extractMessages(receiver: string): Array<string> {
    // Process message queue
    this.processMessageQueue();
    
    // Return and clear extracted messages
    const messages = this.extractedMessages.get(receiver) || [];
    this.extractedMessages.set(receiver, []);
    
    return messages;
  }
  
  /**
   * Process queued messages through field evolution
   */
  private processMessageQueue(): void {
    const deltaT = 0.01; // Time step
    
    for (let i = 0; i < this.messageQueue.length; i++) {
      const queuedMsg = this.messageQueue[i];
      // Evolve field with message perturbation
      this.sharedField = this.evolution.evolveField(
        this.sharedField,
        deltaT,
        queuedMsg.perturbation
      );
      
      // Check for collapse
      if (this.evolution.checkCollapse(this.sharedField)) {
        // Decode message from collapsed field
        const decoded = this.decodeFromField();
        
        // Add to receiver's queue
        const receiver = queuedMsg.sender === this.userA ? this.userB : this.userA;
        const messages = this.extractedMessages.get(receiver) || [];
        messages.push(decoded);
        this.extractedMessages.set(receiver, messages);
        
        // Reset field after collapse
        this.resetField();
      }
    }
    
    // Clear processed messages
    this.messageQueue = [];
  }
  
  /**
   * Decode message from collapsed field
   */
  private decodeFromField(): string {
    // Extract dominant prime modes
    const dominantModes = new Array<any>();
    
    for (let i = 0; i < this.sharedField.primes.length; i++) {
      const amplitude = this.sharedField.coefficients[i].magnitude();
      if (amplitude > 0.1) { // Threshold for significance
        dominantModes.push({
          prime: this.sharedField.primes[i],
          amplitude: amplitude
        });
      }
    }
    
    // Sort by amplitude
    dominantModes.sort((a, b) => b.amplitude - a.amplitude);
    
    // Reconstruct message from prime patterns
    // This is a simplified decoding - real implementation would use
    // inverse of the encoding process
    return `[Decoded from ${dominantModes.length} prime modes]`;
  }
  
  /**
   * Reset field after message extraction
   */
  private resetField(): void {
    // Re-normalize and remove extracted information
    for (let i = 0; i < this.sharedField.coefficients.length; i++) {
      const coeff = this.sharedField.coefficients[i];
      // Add small random perturbation to break symmetry
      const perturbation = Complex.fromPolar(
        0.01 * Math.random(),
        Math.random() * 2 * Math.PI
      );
      this.sharedField.coefficients[i] = coeff.scale(0.5).add(perturbation);
    }
    
    this.sharedField.normalize();
  }
}

interface QueuedMessage {
  sender: string;
  message: string;
  perturbation: MessagePerturbation;
  timestamp: number;
}

// Export main components