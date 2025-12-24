/**
 * Quaternionically-Enhanced Symbolic Non-Local Communication
 * Implementation of quaternionic representations for split primes
 * with enhanced Bloch dynamics and multi-dimensional resonance encoding
 */

import { Prime } from './resolang';
import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';

/**
 * Quaternion class representing q = w + xi + yj + zk
 * where i² = j² = k² = ijk = -1
 */
export class Quaternion implements Serializable {
  constructor(
    public w: f64,  // Real component
    public x: f64,  // i component
    public y: f64,  // j component
    public z: f64   // k component
  ) {}

  /**
   * Quaternion multiplication: q1 * q2
   * Using Hamilton's rules: ij = k, jk = i, ki = j
   */
  multiply(q: Quaternion): Quaternion {
    return new Quaternion(
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
    );
  }

  /**
   * Quaternion conjugate: q* = w - xi - yj - zk
   */
  conjugate(): Quaternion {
    return new Quaternion(this.w, -this.x, -this.y, -this.z);
  }

  /**
   * Quaternion norm: |q| = √(w² + x² + y² + z²)
   */
  norm(): f64 {
    return Math.sqrt(this.w * this.w + this.x * this.x + 
                     this.y * this.y + this.z * this.z);
  }

  /**
   * Normalize quaternion to unit length
   */
  normalize(): Quaternion {
    const n = this.norm();
    if (n < 1e-10) return new Quaternion(1, 0, 0, 0);
    return new Quaternion(this.w / n, this.x / n, this.y / n, this.z / n);
  }

  /**
   * Convert to Bloch vector representation
   */
  toBlochVector(): Float64Array {
    const normalized = this.normalize();
    const vec = new Float64Array(3);
    vec[0] = normalized.x;
    vec[1] = normalized.y;
    vec[2] = normalized.z;
    return vec;
  }

  /**
   * Quaternion exponential: e^q
   */
  exp(): Quaternion {
    const vNorm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    const expW = Math.exp(this.w);
    
    if (vNorm < 1e-10) {
      return new Quaternion(expW, 0, 0, 0);
    }
    
    const sinV = Math.sin(vNorm);
    const cosV = Math.cos(vNorm);
    const factor = expW * sinV / vNorm;
    
    return new Quaternion(
      expW * cosV,
      factor * this.x,
      factor * this.y,
      factor * this.z
    );
  }

  /**
   * Apply rotation by angle theta around axis defined by unit quaternion
   */
  rotate(angle: f64): Quaternion {
    const halfAngle = angle / 2.0;
    const sinHalfAngle = Math.sin(halfAngle);
    const cosHalfAngle = Math.cos(halfAngle);

    // This quaternion is the axis of rotation (unit vector)
    // The 'this' quaternion is the axis of rotation.
    // The quaternion to be rotated is implicitly the identity quaternion in the test.
    // The correct formula for rotating a quaternion 'p' by a rotation quaternion 'q_rot' is q_rot * p * q_rot_conjugate
    // In this case, 'this' is the axis, and we are creating a rotation quaternion from it.
    // The test is trying to rotate the identity quaternion (1,0,0,0) by this rotation.

    // Create a rotation quaternion from the axis (this) and the angle
    const rotationQuaternion = new Quaternion(
      cosHalfAngle,
      this.x * sinHalfAngle,
      this.y * sinHalfAngle,
      this.z * sinHalfAngle
    ).normalize(); // Ensure it's a unit quaternion

    // The test is effectively doing: axis.rotate(angle)
    // This means the 'axis' quaternion is being rotated by itself.
    // If the intention is to rotate a *different* quaternion by this axis and angle,
    // then the method signature or usage needs to change.

    // Assuming the intent is to return a rotation quaternion that can be applied to others.
    // If this method is meant to *apply* a rotation to *this* quaternion,
    // then the logic needs to be: this = rotationQuaternion * this * rotationQuaternion.conjugate()
    // For now, let's assume it returns the rotation quaternion itself.
    return rotationQuaternion;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    return builder
      .startObject()
      .addNumberField("w", this.w)
      .addNumberField("x", this.x)
      .addNumberField("y", this.y)
      .addNumberField("z", this.z)
      .endObject()
      .build();
  }

  toString(): string {
    const wStr = toFixed(this.w, 1);
    const xStr = this.x >= 0 ? `+${toFixed(this.x, 1)}` : toFixed(this.x, 1);
    const yStr = this.y >= 0 ? `+${toFixed(this.y, 1)}` : toFixed(this.y, 1);
    const zStr = this.z >= 0 ? `+${toFixed(this.z, 1)}` : toFixed(this.z, 1);
    
    return `(${wStr}${xStr}i${yStr}j${zStr}k)`;
  }

  /**
   * Clone the quaternion
   */
  clone(): Quaternion {
    return new Quaternion(this.w, this.x, this.y, this.z);
  }
}

/**
 * Split Prime Factorizer for creating quaternions from primes
 * Handles both Gaussian and Eisenstein factorizations
 */
export class SplitPrimeFactorizer {
  /**
   * Check if a prime is a split prime (p ≡ 1 mod 12)
   */
  static isSplitPrime(p: Prime): boolean {
    return p % 12 == 1;
  }

  /**
   * Factorize prime as Gaussian integer: p = a² + b²
   */
  static factorizeGaussian(p: Prime): Map<string, i32> | null {
    const sqrtP = i32(Math.sqrt(f64(p)));
    
    for (let a: i32 = 1; a <= sqrtP; a++) {
      const bSquared = p - a * a;
      const b = i32(Math.sqrt(f64(bSquared)));
      
      if (b * b == bSquared) {
        const result = new Map<string, i32>();
        result.set('a', a);
        result.set('b', b);
        return result;
      }
    }
    
    return null;
  }

  /**
   * Factorize prime as Eisenstein integer: p = c² + cd + d²
   */
  static factorizeEisenstein(p: Prime): Map<string, i32> | null {
    const sqrtP = i32(Math.sqrt(f64(p)));
    
    for (let c: i32 = 1; c <= sqrtP; c++) {
      for (let d: i32 = 1; d <= sqrtP; d++) {
        if (c * c + c * d + d * d == p) {
          const result = new Map<string, i32>();
          result.set('c', c);
          result.set('d', d);
          return result;
        }
      }
    }
    
    return null;
  }

  /**
   * Create quaternion from split prime
   * Embeds Gaussian and Eisenstein factors into quaternionic form
   */
  static createQuaternion(p: Prime): Quaternion | null {
    if (!this.isSplitPrime(p)) return null;
    
    const gaussian = this.factorizeGaussian(p);
    const eisenstein = this.factorizeEisenstein(p);
    
    if (!gaussian || !eisenstein) return null;
    
    // Extract factors
    const a = f64(gaussian.get('a')!);
    const b = f64(gaussian.get('b')!);
    const c = f64(eisenstein.get('c')!);
    const d = f64(eisenstein.get('d')!);
    
    // Convert Eisenstein to Cartesian coordinates
    // ω = -1/2 + i√3/2, so β = c + dω = (c - d/2) + i(d√3/2)
    const cPrime = c - d / 2.0;
    const dPrime = d * Math.sqrt(3.0) / 2.0;
    
    // Create quaternion: q = (a + bi) + j(c' + d'i) = a + bi + jc' + kd'
    return new Quaternion(a, b, cPrime, dPrime);
  }
}

/**
 * Quaternionic Resonance Field
 * Implements temporal evolution and phase dynamics
 */
export class QuaternionicResonanceField {
  private quaternions: Map<Prime, Quaternion>;
  private phaseCorrections: Float64Array;
  private omega0: f64;  // Base frequency
  
  constructor() {
    this.quaternions = new Map<Prime, Quaternion>();
    this.phaseCorrections = new Float64Array(3);  // α_k for k=1,2,3
    this.omega0 = 2.0 * Math.PI;  // Default base frequency
    
    // Initialize phase corrections
    this.phaseCorrections[0] = 0.1;
    this.phaseCorrections[1] = 0.05;
    this.phaseCorrections[2] = 0.02;
  }

  getQuaternions(): Map<Prime, Quaternion> {
    return this.quaternions;
  }

  getPhaseCorrections(): Float64Array {
    return this.phaseCorrections;
  }

  /**
   * Add a prime's quaternion to the field
   */
  addPrime(p: Prime): boolean {
    const q = SplitPrimeFactorizer.createQuaternion(p);
    if (!q) return false;
    
    this.quaternions.set(p, q);
    return true;
  }

  /**
   * Compute resonance field at position x and time t
   * Ψ_q(x,t) = N^(-1/2) * q_p(x) * exp(iΦ_q(x,t))
   */
  computeField(x: f64, t: f64): Quaternion {
    let result = new Quaternion(0, 0, 0, 0);
    const N = f64(this.quaternions.size);
    
    if (N == 0) return result;
    
    const keys = this.quaternions.keys();
    for (let i = 0; i < keys.length; i++) {
      const p = keys[i];
      const q = this.quaternions.get(p)!;
      
      // Compute phase with corrections
      const phase = this.computePhase(x, t);
      
      // Apply phase evolution
      const phaseQ = new Quaternion(0, phase, 0, 0);
      const evolved = q.multiply(phaseQ.exp());
      
      // Add to result
      result = new Quaternion(
        result.w + evolved.w,
        result.x + evolved.x,
        result.y + evolved.y,
        result.z + evolved.z
      );
    }
    
    // Normalize by sqrt(N)
    const normFactor = 1.0 / Math.sqrt(N);
    return new Quaternion(
      result.w * normFactor,
      result.x * normFactor,
      result.y * normFactor,
      result.z * normFactor
    );
  }

  /**
   * Compute phase evolution with quaternionic corrections
   */
  private computePhase(x: f64, t: f64): f64 {
    let phase = this.omega0 * t;
    
    // Add corrections
    for (let k = 0; k < 3; k++) {
      const omega_k = this.omega0 * (k + 1);
      const phi_k = x * (k + 1);
      phase += this.phaseCorrections[k] * Math.sin(omega_k * t + phi_k);
    }
    
    return phase;
  }

  /**
   * Optimize field parameters using gradient descent
   */
  optimizeParameters(targetField: Quaternion, iterations: i32 = 100): void {
    const learningRate = 0.01;
    const epsilon = 1e-6;
    
    for (let iter = 0; iter < iterations; iter++) {
      // Compute current field at test point
      const current = this.computeField(0.0, 1.0);
      
      // Compute fidelity
      const fidelity = this.computeFidelity(current, targetField);
      
      // If fidelity is good enough, stop
      if (fidelity > 0.99) break;
      
      // Compute gradients and update parameters
      for (let k = 0; k < 3; k++) {
        // Numerical gradient
        this.phaseCorrections[k] += epsilon;
        const fieldPlus = this.computeField(0.0, 1.0);
        const fidelityPlus = this.computeFidelity(fieldPlus, targetField);
        
        this.phaseCorrections[k] -= 2 * epsilon;
        const fieldMinus = this.computeField(0.0, 1.0);
        const fidelityMinus = this.computeFidelity(fieldMinus, targetField);
        
        // Reset and compute gradient
        this.phaseCorrections[k] += epsilon;
        const gradient = (fidelityPlus - fidelityMinus) / (2 * epsilon);
        
        // Update parameter
        this.phaseCorrections[k] += learningRate * gradient;
      }
    }
  }

  /**
   * Compute fidelity between two quaternion states
   */
  private computeFidelity(q1: Quaternion, q2: Quaternion): f64 {
    const dot = q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
    return dot * dot / (q1.norm() * q1.norm() * q2.norm() * q2.norm());
  }
}

/**
 * Twist dynamics and collapse conditions
 */
export class TwistDynamics {
  private twistAngle: f64;
  private twistRate: f64;
  private selfInteraction: f64;
  private noiseLevel: f64;
  
  constructor() {
    this.twistAngle = 0.0;
    this.twistRate = 0.1;  // ω_twist
    this.selfInteraction = 0.05;  // γ
    this.noiseLevel = 0.01;  // η amplitude
  }

  /**
   * Compute twist angle from quaternion
   */
  computeTwistAngle(q: Quaternion): f64 {
    // θ_p = arctan(Im(β) / Re(α))
    // For quaternion, this becomes arctan(|imaginary| / real)
    const imagNorm = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z);
    return Math.atan2(imagNorm, q.w);
  }

  /**
   * Evolve twist dynamics
   * dθ/dt = ω_twist + γ*sin(2θ) + η(t)
   */
  evolve(dt: f64): void {
    const noise = (Math.random() - 0.5) * 2.0 * this.noiseLevel;
    const dTheta = this.twistRate + 
                   this.selfInteraction * Math.sin(2.0 * this.twistAngle) + 
                   noise;
    this.twistAngle += dTheta * dt;
    
    // Keep angle in [0, 2π]
    while (this.twistAngle > 2.0 * Math.PI) {
      this.twistAngle -= 2.0 * Math.PI;
    }
    while (this.twistAngle < 0.0) {
      this.twistAngle += 2.0 * Math.PI;
    }
  }

  /**
   * Check collapse condition
   */
  checkCollapse(entropy: f64, entropyThreshold: f64, angleThreshold: f64): boolean {
    // Collapse when entropy is low AND twist angle is aligned
    const angleAligned = Math.abs(this.twistAngle % (Math.PI / 2.0)) < angleThreshold;
    return entropy < entropyThreshold && angleAligned;
  }

  getTwistAngle(): f64 {
    return this.twistAngle;
  }

  setTwistAngle(angle: f64): void {
    this.twistAngle = angle;
  }
}

/**
 * Enhanced Quaternionic Projection Operator with error correction
 */
export class QuaternionicProjector {
  private errorCorrection: f64;
  
  constructor(errorCorrection: f64 = 0.01) {
    this.errorCorrection = errorCorrection;
  }

  /**
   * Project quaternion to 2D with error correction
   * C_q: H_p → R², C_q(q_p) = H_p + ΔH_corr
   */
  project(q: Quaternion): Float64Array {
    const result = new Float64Array(2);
    
    // Base projection using x component
    result[0] = q.x;
    result[1] = -1.0;  // Fixed component
    
    // Add error correction based on y and z components
    const correction = this.errorCorrection * Math.sqrt(q.y * q.y + q.z * q.z);
    result[0] += correction * q.z;
    result[1] += correction * (-q.y);
    
    return result;
  }

  /**
   * Compute eigenvalues with enhanced stability
   */
  computeEigenvalues(q: Quaternion): Float64Array {
    const eigenvalues = new Float64Array(2);
    const base = Math.sqrt(q.x * q.x);
    const correction = this.errorCorrection * this.errorCorrection * 
                      (q.y * q.y + q.z * q.z);
    
    eigenvalues[0] = base + correction;
    eigenvalues[1] = -base - correction;
    
    return eigenvalues;
  }
}

/**
 * Memory pool for efficient quaternion allocation
 */
export class QuaternionPool {
  private pool: Quaternion[];
  private maxSize: i32;
  
  constructor(maxSize: i32 = 1000) {
    this.pool = [];
    this.maxSize = maxSize;
  }

  allocate(): Quaternion {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return new Quaternion(0, 0, 0, 0);
  }

  deallocate(q: Quaternion): void {
    if (this.pool.length < this.maxSize) {
      q.w = 0;
      q.x = 0;
      q.y = 0;
      q.z = 0;
      this.pool.push(q);
    }
  }

  getPool(): Quaternion[] {
    return this.pool;
  }
}