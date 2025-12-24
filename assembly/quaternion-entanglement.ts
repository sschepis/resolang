/**
 * Entangled Quaternionic Transmission System
 * Implements non-local communication via entangled quaternion pairs
 */

import { Quaternion, QuaternionicResonanceField, TwistDynamics, QuaternionicProjector } from './quaternion';
import { Prime, Entropy } from './resolang';
import { PrimeState } from './quantum/prime-state';

/**
 * Represents an entangled pair of quaternions for non-local communication
 */
export class EntangledQuaternionPair {
  private q1: Quaternion;
  private q2: Quaternion;
  private couplingStrength: f64;
  private crossCouplings: Float64Array;  // J_ij matrix (3x3 flattened)
  
  constructor(q1: Quaternion, q2: Quaternion, couplingStrength: f64 = 0.5) {
    this.q1 = q1;
    this.q2 = q2;
    this.couplingStrength = couplingStrength;
    this.crossCouplings = new Float64Array(9);
    
    // Initialize cross-coupling matrix with small random values
    for (let i = 0; i < 9; i++) {
      this.crossCouplings[i] = (Math.random() - 0.5) * 0.1;
    }
  }

  /**
   * Evolve the entangled system using composite Hamiltonian
   * H = H(p)⊗I + I⊗H(q) + γ(σz⊗σz) + Σ J_ij σ(p)_i⊗σ(q)_j
   */
  evolve(dt: f64): void {
    // Extract Bloch vectors
    const bloch1 = this.q1.toBlochVector();
    const bloch2 = this.q2.toBlochVector();
    
    // Compute Hamiltonian evolution
    // First, individual evolution
    const omega1 = 2.0 * Math.PI * bloch1[2];  // z-component determines frequency
    const omega2 = 2.0 * Math.PI * bloch2[2];
    
    // Apply individual rotations
    this.q1 = this.q1.rotate(omega1 * dt);
    this.q2 = this.q2.rotate(omega2 * dt);
    
    // Apply coupling interaction
    const interaction = this.couplingStrength * bloch1[2] * bloch2[2];
    this.q1 = this.q1.rotate(interaction * dt);
    this.q2 = this.q2.rotate(-interaction * dt);
    
    // Apply cross-coupling terms
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const coupling = this.crossCouplings[i * 3 + j];
        const effect = coupling * bloch1[i] * bloch2[j] * dt;
        
        // Apply small perturbations based on cross-coupling
        if (Math.abs(effect) > 1e-10) {
          const axis = new Quaternion(0, 
            i == 0 ? effect : 0,
            i == 1 ? effect : 0,
            i == 2 ? effect : 0
          );
          this.q1 = this.q1.multiply(axis.exp());
          this.q2 = this.q2.multiply(axis.conjugate().exp());
        }
      }
    }
    
    // Renormalize to maintain unit quaternions
    this.q1 = this.q1.normalize();
    this.q2 = this.q2.normalize();
  }

  /**
   * Compute entanglement fidelity
   */
  computeFidelity(target: EntangledQuaternionPair): f64 {
    // Fidelity = |⟨ψ_target|ψ⟩|²
    const dot1 = this.q1.w * target.q1.w + this.q1.x * target.q1.x + 
                 this.q1.y * target.q1.y + this.q1.z * target.q1.z;
    const dot2 = this.q2.w * target.q2.w + this.q2.x * target.q2.x + 
                 this.q2.y * target.q2.y + this.q2.z * target.q2.z;
    
    return Math.abs(dot1 * dot2);
  }

  /**
   * Optimize entanglement parameters
   */
  optimizeEntanglement(target: EntangledQuaternionPair, iterations: i32 = 100): void {
    const learningRate = 0.01;
    const epsilon = 1e-6;
    
    for (let iter = 0; iter < iterations; iter++) {
      const currentFidelity = this.computeFidelity(target);
      
      // If fidelity is good enough, stop
      if (currentFidelity > 0.95) break;
      
      // Optimize coupling strength
      this.couplingStrength += epsilon;
      this.evolve(0.01);
      const fidelityPlus = this.computeFidelity(target);
      
      this.couplingStrength -= 2 * epsilon;
      this.evolve(0.01);
      const fidelityMinus = this.computeFidelity(target);
      
      this.couplingStrength += epsilon;
      const gradientCoupling = (fidelityPlus - fidelityMinus) / (2 * epsilon);
      this.couplingStrength += learningRate * gradientCoupling;
      
      // Optimize cross-couplings
      for (let i = 0; i < 9; i++) {
        this.crossCouplings[i] += epsilon;
        this.evolve(0.01);
        const fPlus = this.computeFidelity(target);
        
        this.crossCouplings[i] -= 2 * epsilon;
        this.evolve(0.01);
        const fMinus = this.computeFidelity(target);
        
        this.crossCouplings[i] += epsilon;
        const gradient = (fPlus - fMinus) / (2 * epsilon);
        this.crossCouplings[i] += learningRate * gradient;
      }
    }
  }

  getQuaternions(): Quaternion[] {
    return [this.q1, this.q2];
  }
}

/**
 * Quaternionic Phase Synchronization
 * Implements adaptive synchronization protocol for non-local communication
 */
export class QuaternionicSynchronizer {
  private phaseReferences: Map<string, f64>;
  private feedbackGains: Map<string, f64>;
  private baseFrequency: f64;
  private adaptiveGainFactor: f64;
  
  constructor() {
    this.phaseReferences = new Map<string, f64>();
    this.feedbackGains = new Map<string, f64>();
    this.baseFrequency = 1.0;  // Ω₀
    this.adaptiveGainFactor = 0.1;  // α
  }

  /**
   * Measure phase difference between quaternions
   * Δφ_q = arg(q_p* q_q)
   */
  measurePhaseDifference(q1: Quaternion, q2: Quaternion): f64 {
    const product = q1.conjugate().multiply(q2);
    return Math.atan2(
      Math.sqrt(product.x * product.x + product.y * product.y + product.z * product.z),
      product.w
    );
  }

  /**
   * Synchronize two quaternions using adaptive feedback
   */
  synchronize(
    q1: Quaternion, 
    q2: Quaternion, 
    id1: string, 
    id2: string,
    targetPhaseDiff: f64 = 0.0,
    tolerance: f64 = 0.01
  ): boolean {
    // Initialize feedback gains if not present
    if (!this.feedbackGains.has(id1)) {
      this.feedbackGains.set(id1, 0.1);
    }
    if (!this.feedbackGains.has(id2)) {
      this.feedbackGains.set(id2, 0.1);
    }
    
    // Measure current phase difference
    const currentPhaseDiff = this.measurePhaseDifference(q1, q2);
    const error = targetPhaseDiff - currentPhaseDiff;
    
    // Check if already synchronized
    if (Math.abs(error) < tolerance) {
      return true;
    }
    
    // Get feedback gains
    const K1 = this.feedbackGains.get(id1)!;
    const K2 = this.feedbackGains.get(id2)!;
    
    // Apply phase corrections
    const correction1 = new Quaternion(0, K1 * error, 0, 0);
    const correction2 = new Quaternion(0, -K2 * error, 0, 0);
    
    q1 = q1.multiply(correction1.exp());
    q2 = q2.multiply(correction2.exp());
    
    // Update adaptive gains
    const newK1 = K1 * (1.0 + this.adaptiveGainFactor * Math.abs(error));
    const newK2 = K2 * (1.0 + this.adaptiveGainFactor * Math.abs(error));
    
    this.feedbackGains.set(id1, Math.min(newK1, 1.0));  // Cap at 1.0
    this.feedbackGains.set(id2, Math.min(newK2, 1.0));
    
    return false;
  }

  /**
   * Run full adaptive synchronization protocol
   */
  runAdaptiveSynchronization(
    pair: EntangledQuaternionPair,
    maxIterations: i32 = 100,
    dt: f64 = 0.01
  ): boolean {
    const quaternions = pair.getQuaternions();
    let synchronized = false;
    
    for (let iter = 0; iter < maxIterations; iter++) {
      // Evolve the system
      pair.evolve(dt);
      
      // Attempt synchronization
      synchronized = this.synchronize(
        quaternions[0],
        quaternions[1],
        "q1",
        "q2",
        0.0,
        0.01
      );
      
      if (synchronized) {
        break;
      }
    }
    
    return synchronized;
  }
}

/**
 * Quaternionic Communication Agent
 * Handles encoding/decoding of messages in quaternionic form
 */
export class QuaternionicAgent {
  private quaternion: Quaternion;
  private resonanceField: QuaternionicResonanceField;
  private twistDynamics: TwistDynamics;
  private projector: QuaternionicProjector;
  private messageBuffer: Map<string, f64>;
  
  constructor(q: Quaternion) {
    this.quaternion = q;
    this.resonanceField = new QuaternionicResonanceField();
    this.twistDynamics = new TwistDynamics();
    this.projector = new QuaternionicProjector();
    this.messageBuffer = new Map<string, f64>();
  }

  /**
   * Encode a message into quaternionic state
   * Each bit pair maps to a quaternion component
   */
  encodeMessage(message: string): void {
    // Clear buffer
    this.messageBuffer.clear();
    
    // Process message in 2-bit chunks (quaternion has 4 components)
    for (let i = 0; i < message.length; i += 2) {
      const bit1 = i < message.length ? (message.charCodeAt(i) == 49 ? 1.0 : 0.0) : 0.0;
      const bit2 = i + 1 < message.length ? (message.charCodeAt(i + 1) == 49 ? 1.0 : 0.0) : 0.0;
      
      // Map to quaternion components
      const index = i / 2;
      if (index == 0) {
        this.quaternion.w = bit1;
        this.quaternion.x = bit2;
      } else if (index == 1) {
        this.quaternion.y = bit1;
        this.quaternion.z = bit2;
      }
      
      // Store in buffer for multi-part messages
      this.messageBuffer.set(`chunk_${index}`, bit1 * 2 + bit2);
    }
    
    // Normalize to maintain unit quaternion
    this.quaternion = this.quaternion.normalize();
  }

  /**
   * Decode message from quaternionic state
   */
  decodeMessage(): string {
    let message = "";
    
    // Decode from quaternion components
    const threshold = 0.5;
    
    // First chunk from w, x
    const bit1 = Math.abs(this.quaternion.w) > threshold ? "1" : "0";
    const bit2 = Math.abs(this.quaternion.x) > threshold ? "1" : "0";
    message += bit1 + bit2;
    
    // Second chunk from y, z
    const bit3 = Math.abs(this.quaternion.y) > threshold ? "1" : "0";
    const bit4 = Math.abs(this.quaternion.z) > threshold ? "1" : "0";
    message += bit3 + bit4;
    
    return message;
  }

  /**
   * Entangle with another agent
   */
  entangleWith(other: QuaternionicAgent, targetFidelity: f64 = 0.9): EntangledQuaternionPair {
    const pair = new EntangledQuaternionPair(
      this.quaternion,
      other.quaternion,
      0.5
    );
    
    // Create target state for optimization
    const targetPair = new EntangledQuaternionPair(
      this.quaternion.normalize(),
      other.quaternion.normalize(),
      1.0
    );
    
    // Optimize entanglement
    pair.optimizeEntanglement(targetPair, 100);
    
    return pair;
  }

  /**
   * Apply symbolic collapse based on entropy and twist dynamics
   */
  applySymbolicCollapse(entropyThreshold: f64 = 0.1): boolean {
    // Compute current entropy (simplified)
    const entropy = this.computeEntropy();
    
    // Update twist dynamics
    this.twistDynamics.evolve(0.01);
    
    // Check collapse condition
    if (this.twistDynamics.checkCollapse(entropy, entropyThreshold, 0.1)) {
      // Apply projection
      const projected = this.projector.project(this.quaternion);
      
      // Collapse to dominant axis
      const absW = Math.abs(this.quaternion.w);
      const absX = Math.abs(this.quaternion.x);
      const absY = Math.abs(this.quaternion.y);
      const absZ = Math.abs(this.quaternion.z);
      
      const maxComponent = Math.max(
        Math.max(absW, absX),
        Math.max(absY, absZ)
      );
      
      if (Math.abs(this.quaternion.w) == maxComponent) {
        this.quaternion = new Quaternion(1, 0, 0, 0);
      } else if (Math.abs(this.quaternion.x) == maxComponent) {
        this.quaternion = new Quaternion(0, 1, 0, 0);
      } else if (Math.abs(this.quaternion.y) == maxComponent) {
        this.quaternion = new Quaternion(0, 0, 1, 0);
      } else {
        this.quaternion = new Quaternion(0, 0, 0, 1);
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Compute entropy of quaternionic state
   */
  private computeEntropy(): f64 {
    const components = [
      this.quaternion.w,
      this.quaternion.x,
      this.quaternion.y,
      this.quaternion.z
    ];
    
    let entropy = 0.0;
    for (let i = 0; i < 4; i++) {
      const p = components[i] * components[i];  // Probability
      if (p > 1e-10) {
        entropy -= p * Math.log(p);
      }
    }
    
    return entropy;
  }

  getQuaternion(): Quaternion {
    return this.quaternion;
  }

  getEntanglementFidelity(): f64 {
    // Simplified fidelity based on quaternion norm
    return this.quaternion.norm();
  }
}

/**
 * Quaternionic transmission protocol
 */
export function transmitQuaternionicMessage(
  sender: QuaternionicAgent,
  receiver: QuaternionicAgent,
  message: string,
  synchronizer: QuaternionicSynchronizer
): boolean {
  // Encode message at sender
  sender.encodeMessage(message);
  
  // Create entangled pair
  const entangledPair = sender.entangleWith(receiver);
  
  // Synchronize the pair
  const synchronized = synchronizer.runAdaptiveSynchronization(entangledPair);
  
  if (!synchronized) {
    return false;
  }
  
  // Apply symbolic collapse at sender
  sender.applySymbolicCollapse();
  
  // Receiver decodes the message
  const decoded = receiver.decodeMessage();
  
  // Verify transmission
  return decoded == message;
}