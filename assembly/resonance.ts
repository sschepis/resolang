/**
 * Prime Resonance Network Components
 * 
 * Port from tinyaleph/core/resonance.js to AssemblyScript
 * 
 * Implementation of:
 * - Prime Resonance Identity (PRI) = (P_G, P_E, P_Q)
 * - Entanglement and Coherence
 * - Phase-Locked Prime Rings
 * - Holographic Memory Fields
 */

import { Complex, Prime } from './types';
import { Quaternion } from './quaternion';
import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';
import { isPrime, generatePrimes } from './core/math';
import { PI } from './core/math';

// ============================================================================
// Constants
// ============================================================================

/** Golden ratio φ = (1 + √5) / 2 */
export const PHI: f64 = (1.0 + Math.sqrt(5.0)) / 2.0;  // 1.618...

/** Golden ratio conjugate φ' = (1 - √5) / 2 */
export const PHI_CONJ: f64 = (1.0 - Math.sqrt(5.0)) / 2.0;  // -0.618...

/** √2 - another irrational for phase locks */
export const DELTA_S: f64 = Math.sqrt(2.0);

/** Two π */
export const TWO_PI: f64 = 2.0 * PI;

// ============================================================================
// Gaussian Integer
// ============================================================================

/**
 * Gaussian Integer: Z[i] = {a + bi : a, b ∈ Z}
 */
export class GaussianInteger implements Serializable {
  real: i32;
  imag: i32;
  
  constructor(real: i32, imag: i32) {
    this.real = real;
    this.imag = imag;
  }
  
  /**
   * Norm: N(a + bi) = a² + b²
   */
  norm(): i32 {
    return this.real * this.real + this.imag * this.imag;
  }
  
  /**
   * Add two Gaussian integers
   */
  add(other: GaussianInteger): GaussianInteger {
    return new GaussianInteger(this.real + other.real, this.imag + other.imag);
  }
  
  /**
   * Multiply two Gaussian integers
   * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
   */
  mul(other: GaussianInteger): GaussianInteger {
    return new GaussianInteger(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }
  
  /**
   * Conjugate: (a + bi)* = a - bi
   */
  conjugate(): GaussianInteger {
    return new GaussianInteger(this.real, -this.imag);
  }
  
  /**
   * Check if this is a Gaussian prime
   * Gaussian prime if:
   * - Norm is prime AND (p ≡ 3 mod 4 OR both parts non-zero)
   */
  isGaussianPrime(): bool {
    const n = this.norm();
    if (!isPrime(n)) return false;
    return (n % 4 == 3) || (this.real != 0 && this.imag != 0);
  }
  
  /**
   * Phase angle
   */
  phase(): f64 {
    return Math.atan2(<f64>this.imag, <f64>this.real);
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("real", <f64>this.real)
      .addNumberField("imag", <f64>this.imag)
      .addNumberField("norm", <f64>this.norm())
      .addBooleanField("isPrime", this.isGaussianPrime())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    if (this.imag == 0) return this.real.toString();
    if (this.real == 0) return this.imag.toString() + "i";
    const sign = this.imag > 0 ? "+" : "";
    return this.real.toString() + sign + this.imag.toString() + "i";
  }
}

// ============================================================================
// Eisenstein Integer
// ============================================================================

/**
 * Eisenstein Integer: Z[ω] where ω = e^(2πi/3) = -1/2 + (√3/2)i
 * Represented as a + bω
 */
export class EisensteinInteger implements Serializable {
  a: i32;
  b: i32;
  
  constructor(a: i32, b: i32) {
    this.a = a;
    this.b = b;
  }
  
  /**
   * Norm: N(a + bω) = a² - ab + b²
   */
  norm(): i32 {
    return this.a * this.a - this.a * this.b + this.b * this.b;
  }
  
  /**
   * Add two Eisenstein integers
   */
  add(other: EisensteinInteger): EisensteinInteger {
    return new EisensteinInteger(this.a + other.a, this.b + other.b);
  }
  
  /**
   * Multiply two Eisenstein integers
   * (a + bω)(c + dω) = (ac - bd) + (ad + bc - bd)ω
   */
  mul(other: EisensteinInteger): EisensteinInteger {
    return new EisensteinInteger(
      this.a * other.a - this.b * other.b,
      this.a * other.b + this.b * other.a - this.b * other.b
    );
  }
  
  /**
   * Conjugate: (a + bω)* = a - b - bω
   */
  conjugate(): EisensteinInteger {
    return new EisensteinInteger(this.a - this.b, -this.b);
  }
  
  /**
   * Check if this is an Eisenstein prime
   * Eisenstein prime if norm is prime and n ≡ 2 (mod 3)
   */
  isEisensteinPrime(): bool {
    const n = this.norm();
    return isPrime(n) && (n % 3 == 2);
  }
  
  /**
   * Phase angle (complex representation)
   * ω = -1/2 + (√3/2)i
   */
  phase(): f64 {
    const real = <f64>this.a - <f64>this.b / 2.0;
    const imag = <f64>this.b * Math.sqrt(3.0) / 2.0;
    return Math.atan2(imag, real);
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("a", <f64>this.a)
      .addNumberField("b", <f64>this.b)
      .addNumberField("norm", <f64>this.norm())
      .addBooleanField("isPrime", this.isEisensteinPrime())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    if (this.b == 0) return this.a.toString();
    if (this.a == 0) return this.b.toString() + "ω";
    const sign = this.b > 0 ? "+" : "";
    return this.a.toString() + sign + this.b.toString() + "ω";
  }
}

// ============================================================================
// Prime Resonance Identity
// ============================================================================

/**
 * Prime Resonance Identity (PRI)
 * A triadic identity composed of:
 * - P_G: Gaussian prime
 * - P_E: Eisenstein prime
 * - P_Q: Quaternionic prime
 */
export class PrimeResonanceIdentity implements Serializable {
  gaussian: GaussianInteger;
  eisenstein: EisensteinInteger;
  quaternion: Quaternion;
  signature: Float64Array;
  hash: i32;
  
  constructor(gaussian: GaussianInteger, eisenstein: EisensteinInteger, quaternion: Quaternion) {
    this.gaussian = gaussian;
    this.eisenstein = eisenstein;
    this.quaternion = quaternion;
    this.signature = new Float64Array(3);
    this.hash = 0;
    this._computeSignature();
  }
  
  private _computeSignature(): void {
    const gNorm = <f64>this.gaussian.norm();
    const eNorm = <f64>this.eisenstein.norm();
    const qNorm = this.quaternion.norm();
    
    this.signature[0] = gNorm;
    this.signature[1] = eNorm;
    this.signature[2] = qNorm;
    
    // Hash from signature
    this.hash = i32((gNorm * 997 + eNorm * 991 + Math.round(qNorm) * 983) % 1000000007);
  }
  
  /**
   * Generate a PRI from a seed integer
   */
  static fromSeed(seed: i32): PrimeResonanceIdentity {
    const primes = generatePrimes(seed + 20);
    
    const p1 = primes[seed % 10 + 5];
    const p2 = primes[seed % 10 + 8];
    const p3 = primes[seed % 10 + 12];
    
    const g = new GaussianInteger(p1 % 100, (seed * 7) % 50);
    const e = new EisensteinInteger(p2 % 100, (seed * 11) % 50);
    const q = new Quaternion(<f64>p3, <f64>(seed % 10), <f64>((seed * 3) % 10), <f64>((seed * 7) % 10));
    
    return new PrimeResonanceIdentity(g, e, q);
  }
  
  /**
   * Generate a random PRI
   */
  static random(): PrimeResonanceIdentity {
    const primes = generatePrimes(50);
    
    const idx1 = i32(Math.random() * <f64>primes.length);
    const idx2 = i32(Math.random() * <f64>primes.length);
    const idx3 = i32(Math.random() * <f64>primes.length);
    
    const p1 = primes[idx1];
    const p2 = primes[idx2];
    const p3 = primes[idx3];
    
    const g = new GaussianInteger(p1, i32(Math.random() * 10));
    const e = new EisensteinInteger(p2, i32(Math.random() * 10));
    const q = new Quaternion(
      <f64>p3,
      Math.random() * 5,
      Math.random() * 5,
      Math.random() * 5
    );
    
    return new PrimeResonanceIdentity(g, e, q);
  }
  
  /**
   * Compute entanglement strength with another PRI
   */
  entanglementStrength(other: PrimeResonanceIdentity): f64 {
    // Based on phase alignment and norm similarity
    const gPhase = this.gaussian.phase();
    const gPhaseOther = other.gaussian.phase();
    
    const ePhase = this.eisenstein.phase();
    const ePhaseOther = other.eisenstein.phase();
    
    const gAlignment = Math.cos(gPhase - gPhaseOther);
    const eAlignment = Math.cos(ePhase - ePhaseOther);
    
    // Quaternion alignment via normalized dot product
    const qNorm = this.quaternion.norm() * other.quaternion.norm();
    const qDot = this.quaternion.w * other.quaternion.w +
                 this.quaternion.x * other.quaternion.x +
                 this.quaternion.y * other.quaternion.y +
                 this.quaternion.z * other.quaternion.z;
    const qAlignment = qNorm > 0 ? qDot / qNorm : 0;
    
    return (gAlignment + eAlignment + qAlignment) / 3.0;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addRawField("gaussian", this.gaussian.toJSON())
      .addRawField("eisenstein", this.eisenstein.toJSON())
      .addRawField("quaternion", this.quaternion.toJSON())
      .addNumberField("hash", <f64>this.hash)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

// ============================================================================
// Phase-Locked Ring
// ============================================================================

/**
 * Phase-Locked Prime Ring
 * Implements stable communication via irrational phase locks
 */
export class PhaseLockedRing implements Serializable {
  primes: Array<Prime>;
  phases: Float64Array;
  phaseMultiplier: f64;
  
  constructor(primes: Array<Prime>, phaseType: string = "phi") {
    this.primes = primes;
    const n = primes.length;
    this.phases = new Float64Array(n);
    
    // Select irrational phase lock
    if (phaseType == "phi") {
      this.phaseMultiplier = PHI;
    } else if (phaseType == "deltaS") {
      this.phaseMultiplier = DELTA_S;
    } else {
      this.phaseMultiplier = TWO_PI / PHI;
    }
    
    // Initialize phases using irrational multiples
    for (let i = 0; i < n; i++) {
      this.phases[i] = (<f64>i * this.phaseMultiplier) % TWO_PI;
    }
  }
  
  /**
   * Advance all phases by one step
   */
  tick(dt: f64 = 0.01): void {
    for (let i = 0; i < this.primes.length; i++) {
      // Each prime oscillates at frequency proportional to log(p)
      const freq = Math.log(<f64>this.primes[i]);
      this.phases[i] = (this.phases[i] + freq * dt * this.phaseMultiplier) % TWO_PI;
    }
  }
  
  /**
   * Compute order parameter (Kuramoto-style)
   * r = |1/N Σ e^(iθ_j)|
   */
  orderParameter(): f64 {
    let sumReal: f64 = 0;
    let sumImag: f64 = 0;
    
    for (let i = 0; i < this.phases.length; i++) {
      sumReal += Math.cos(this.phases[i]);
      sumImag += Math.sin(this.phases[i]);
    }
    
    const n = <f64>this.phases.length;
    return Math.sqrt(sumReal * sumReal + sumImag * sumImag) / n;
  }
  
  /**
   * Mean phase
   */
  meanPhase(): f64 {
    let sumReal: f64 = 0;
    let sumImag: f64 = 0;
    
    for (let i = 0; i < this.phases.length; i++) {
      sumReal += Math.cos(this.phases[i]);
      sumImag += Math.sin(this.phases[i]);
    }
    
    return Math.atan2(sumImag, sumReal);
  }
  
  /**
   * Synchronization measure
   * 0 = no sync, 1 = perfect sync
   */
  synchronization(): f64 {
    return this.orderParameter();
  }
  
  /**
   * Apply phase correction toward target
   */
  correctPhase(targetPhase: f64, strength: f64 = 0.1): void {
    for (let i = 0; i < this.phases.length; i++) {
      const diff = targetPhase - this.phases[i];
      const correction = Math.sin(diff) * strength;
      this.phases[i] = (this.phases[i] + correction) % TWO_PI;
    }
  }
  
  /**
   * Get phases as complex amplitudes
   */
  toComplexAmplitudes(): Array<Complex> {
    const result = new Array<Complex>(this.phases.length);
    for (let i = 0; i < this.phases.length; i++) {
      result[i] = Complex.fromPolar(1.0, this.phases[i]);
    }
    return result;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("size", <f64>this.primes.length)
      .addNumberField("orderParameter", this.orderParameter())
      .addNumberField("meanPhase", this.meanPhase())
      .addNumberField("synchronization", this.synchronization())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

// ============================================================================
// Entangled Node
// ============================================================================

/**
 * Entangled Node (from ResoLang spec)
 * A network node with PRI, phase ring, and entanglement map
 */
export class EntangledNode implements Serializable {
  id: i32;
  pri: PrimeResonanceIdentity;
  phaseRing: PhaseLockedRing;
  entanglementMap: Map<i32, f64>;
  coherence: f64;
  
  constructor(id: i32, pri: PrimeResonanceIdentity | null = null) {
    this.id = id;
    this.pri = pri !== null ? pri : PrimeResonanceIdentity.random();
    this.phaseRing = new PhaseLockedRing(generatePrimes(16), "phi");
    this.entanglementMap = new Map<i32, f64>();
    this.coherence = 1.0;
  }
  
  /**
   * Establish entanglement with another node
   */
  entangleWith(other: EntangledNode): f64 {
    const strength = this.pri.entanglementStrength(other.pri);
    this.entanglementMap.set(other.id, strength);
    other.entanglementMap.set(this.id, strength);
    return strength;
  }
  
  /**
   * Advance node state
   */
  tick(dt: f64 = 0.01): void {
    this.phaseRing.tick(dt);
    
    // Coherence decays slightly over time
    this.coherence *= (1.0 - 0.001 * dt);
    
    // But increases with synchronization
    this.coherence = Math.min(1.0, this.coherence + this.phaseRing.synchronization() * 0.002 * dt);
  }
  
  /**
   * Check if stable (coherent and synchronized)
   */
  isStable(): bool {
    return this.coherence > 0.85 && this.phaseRing.synchronization() > 0.7;
  }
  
  /**
   * Get number of entanglements
   */
  entanglementCount(): i32 {
    return this.entanglementMap.size;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("id", <f64>this.id)
      .addNumberField("coherence", this.coherence)
      .addNumberField("synchronization", this.phaseRing.synchronization())
      .addNumberField("entanglements", <f64>this.entanglementCount())
      .addBooleanField("isStable", this.isStable())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

// ============================================================================
// Resonant Fragment
// ============================================================================

/**
 * Resonant Fragment
 * A portable memory fragment with phase and amplitude
 */
export class ResonantFragment implements Serializable {
  phases: Float64Array;
  amplitudes: Float64Array;
  primes: Array<Prime>;
  entropy: f64;
  createdAt: i64;
  
  constructor(primes: Array<Prime>, phases: Float64Array | null = null, amplitudes: Float64Array | null = null) {
    this.primes = primes;
    const n = primes.length;
    
    if (phases !== null) {
      this.phases = phases;
    } else {
      this.phases = new Float64Array(n);
    }
    
    if (amplitudes !== null) {
      this.amplitudes = amplitudes;
    } else {
      this.amplitudes = new Float64Array(n);
      const norm = 1.0 / Math.sqrt(<f64>n);
      for (let i = 0; i < n; i++) {
        this.amplitudes[i] = norm;
      }
    }
    
    this.entropy = this.computeEntropy();
    this.createdAt = 0;  // No Date.now() in WASM
  }
  
  /**
   * Create from text encoding
   */
  static fromText(text: string, primes: Array<Prime> | null = null): ResonantFragment {
    const ps = primes !== null ? primes : generatePrimes(25);
    const n = ps.length;
    const textLen = text.length;
    
    const phases = new Float64Array(n);
    const amplitudes = new Float64Array(n);
    
    for (let i = 0; i < textLen; i++) {
      const charCode = text.charCodeAt(i);
      const primeIdx = charCode % n;
      
      // Phase encodes position
      const posPhase = TWO_PI * <f64>i / <f64>textLen;
      phases[primeIdx] = (phases[primeIdx] + posPhase) % TWO_PI;
      amplitudes[primeIdx] += 1.0 / <f64>textLen;
    }
    
    // Normalize
    let totalAmp: f64 = 0;
    for (let i = 0; i < n; i++) {
      totalAmp += amplitudes[i] * amplitudes[i];
    }
    totalAmp = Math.sqrt(totalAmp);
    if (totalAmp > 1e-10) {
      for (let i = 0; i < n; i++) {
        amplitudes[i] /= totalAmp;
      }
    }
    
    return new ResonantFragment(ps, phases, amplitudes);
  }
  
  /**
   * Create from prime list with weights
   */
  static fromPrimes(primes: Array<Prime>, weights: Array<f64> | null = null): ResonantFragment {
    const n = primes.length;
    const amplitudes = new Float64Array(n);
    const phases = new Float64Array(n);
    
    let total: f64 = 0;
    for (let i = 0; i < n; i++) {
      const w = weights !== null ? weights[i] : 1.0 / <f64>n;
      amplitudes[i] = w;
      total += w * w;
    }
    
    // Normalize
    total = Math.sqrt(total);
    if (total > 1e-10) {
      for (let i = 0; i < n; i++) {
        amplitudes[i] /= total;
      }
    }
    
    return new ResonantFragment(primes, phases, amplitudes);
  }
  
  /**
   * Compute entropy of the fragment
   */
  computeEntropy(): f64 {
    let total: f64 = 0;
    for (let i = 0; i < this.amplitudes.length; i++) {
      total += this.amplitudes[i] * this.amplitudes[i];
    }
    if (total < 1e-10) return 0;
    
    let h: f64 = 0;
    for (let i = 0; i < this.amplitudes.length; i++) {
      const p = (this.amplitudes[i] * this.amplitudes[i]) / total;
      if (p > 1e-10) {
        h -= p * Math.log2(p);
      }
    }
    return h;
  }
  
  /**
   * Rotate phase of fragment
   */
  rotatePhase(angle: f64): ResonantFragment {
    const newPhases = new Float64Array(this.phases.length);
    for (let i = 0; i < this.phases.length; i++) {
      newPhases[i] = (this.phases[i] + angle) % TWO_PI;
    }
    
    const newAmplitudes = new Float64Array(this.amplitudes.length);
    for (let i = 0; i < this.amplitudes.length; i++) {
      newAmplitudes[i] = this.amplitudes[i];
    }
    
    return new ResonantFragment(this.primes, newPhases, newAmplitudes);
  }
  
  /**
   * Check coherence with another fragment
   */
  coherenceWith(other: ResonantFragment): f64 {
    let dotReal: f64 = 0;
    let dotImag: f64 = 0;
    let norm1: f64 = 0;
    let norm2: f64 = 0;
    
    const n = Math.min(this.amplitudes.length, other.amplitudes.length) as i32;
    
    for (let i = 0; i < n; i++) {
      const a1 = this.amplitudes[i];
      const a2 = other.amplitudes[i];
      const p1 = this.phases[i];
      const p2 = other.phases[i];
      
      // Complex inner product
      dotReal += a1 * a2 * Math.cos(p1 - p2);
      dotImag += a1 * a2 * Math.sin(p1 - p2);
      
      norm1 += a1 * a1;
      norm2 += a2 * a2;
    }
    
    const norms = Math.sqrt(norm1 * norm2);
    if (norms < 1e-10) return 0;
    
    return Math.sqrt(dotReal * dotReal + dotImag * dotImag) / norms;
  }
  
  /**
   * Get dominant primes
   */
  dominant(n: i32 = 5): Array<DominantPrimeInfo> {
    const result = new Array<DominantPrimeInfo>(this.primes.length);
    
    for (let i = 0; i < this.primes.length; i++) {
      result[i] = new DominantPrimeInfo(this.primes[i], this.amplitudes[i], this.phases[i]);
    }
    
    // Sort by amplitude descending
    result.sort((a: DominantPrimeInfo, b: DominantPrimeInfo): i32 => {
      if (b.amplitude > a.amplitude) return 1;
      if (b.amplitude < a.amplitude) return -1;
      return 0;
    });
    
    // Return top n
    const top = new Array<DominantPrimeInfo>(Math.min(n, result.length) as i32);
    for (let i = 0; i < top.length; i++) {
      top[i] = result[i];
    }
    return top;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("size", <f64>this.primes.length)
      .addNumberField("entropy", this.entropy);
    
    const dom = this.dominant(3);
    let domJson = "[";
    for (let i = 0; i < dom.length; i++) {
      if (i > 0) domJson += ",";
      domJson += `{"prime":${dom[i].prime},"amplitude":${toFixed(dom[i].amplitude, 4)}}`;
    }
    domJson += "]";
    builder.addRawField("dominant", domJson);
    
    builder.endObject();
    return builder.build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

/**
 * Helper class for dominant prime info
 */
export class DominantPrimeInfo {
  prime: Prime;
  amplitude: f64;
  phase: f64;
  
  constructor(prime: Prime, amplitude: f64, phase: f64) {
    this.prime = prime;
    this.amplitude = amplitude;
    this.phase = phase;
  }
}