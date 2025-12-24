/**
 * Sedenion Memory Field (SMF)
 * 
 * 16-dimensional semantic orientation space for identity continuity
 * and order-sensitive composition. From "A Design for a Sentient Observer"
 * paper, Section 4.
 * 
 * Key features:
 * - 16 semantic axes with interpretations (Table 1)
 * - Non-associative sedenion multiplication via Cayley-Dickson
 * - Zero-divisor detection for "tunneling" transitions
 * - SMF entropy calculation (equation 8)
 * - SLERP interpolation for smooth transitions
 * - Coupling function Γ for prime-mode activity (equation 10)
 */

import { Hypercomplex } from '../hypercomplex';
import { multiplyIndices } from '../fano';
import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';

/**
 * SMF Axis - Semantic axis definition
 */
export class SMFAxis {
  constructor(
    public index: i32,
    public name: string,
    public description: string
  ) {}
}

/**
 * Semantic axis definitions from whitepaper Table 1
 */
export const SMF_AXES: SMFAxis[] = [
  new SMFAxis(0, "coherence", "internal consistency / alignment"),
  new SMFAxis(1, "identity", "self-continuity / individuation"),
  new SMFAxis(2, "duality", "complementarity / opposition"),
  new SMFAxis(3, "structure", "organization / form"),
  new SMFAxis(4, "change", "transformation / dynamics"),
  new SMFAxis(5, "life", "vitality / growth"),
  new SMFAxis(6, "harmony", "balance / resonance"),
  new SMFAxis(7, "wisdom", "insight / understanding"),
  new SMFAxis(8, "infinity", "boundlessness / transcendence"),
  new SMFAxis(9, "creation", "genesis / origination"),
  new SMFAxis(10, "truth", "verity / authenticity"),
  new SMFAxis(11, "love", "connection / care"),
  new SMFAxis(12, "power", "capacity / influence"),
  new SMFAxis(13, "time", "temporality / sequence"),
  new SMFAxis(14, "space", "extension / locality"),
  new SMFAxis(15, "consciousness", "awareness / sentience")
];

/**
 * Get axis index by name
 */
export function getAxisIndex(name: string): i32 {
  for (let i = 0; i < SMF_AXES.length; i++) {
    if (SMF_AXES[i].name == name) return i;
  }
  return -1;
}

/**
 * Get axis name by index
 */
export function getAxisName(index: i32): string {
  if (index >= 0 && index < 16) {
    return SMF_AXES[index].name;
  }
  return "unknown";
}

/**
 * DominantAxisInfo - Information about a dominant SMF axis
 */
export class DominantAxisInfo {
  constructor(
    public index: i32,
    public name: string,
    public value: f64,
    public absValue: f64
  ) {}
}

/**
 * SedenionMemoryField - 16-dimensional semantic orientation space
 * 
 * Implements the SMF from Section 4 of the whitepaper, providing:
 * - 16 semantic axes for identity orientation
 * - Non-associative sedenion multiplication (eq. 9)
 * - Zero-divisor tunneling detection
 * - Entropy-based complexity measure (eq. 8)
 */
export class SedenionMemoryField implements Serializable {
  /** 16 components of the sedenion */
  s: Float64Array;
  
  /** Epsilon for numerical stability */
  private static readonly EPSILON: f64 = 1e-10;
  
  constructor(components: Float64Array | null = null) {
    this.s = new Float64Array(16);
    
    if (components !== null && components.length == 16) {
      for (let i = 0; i < 16; i++) {
        this.s[i] = components[i];
      }
    } else {
      // Initialize with full coherence (axis 0)
      this.s[0] = 1.0;
    }
    
    this.normalize();
  }
  
  // ============================================================================
  // Factory Methods
  // ============================================================================
  
  /**
   * Create a basis SMF (single axis excited)
   */
  static basis(axisOrName: i32, value: f64 = 1.0): SedenionMemoryField {
    const smf = new SedenionMemoryField();
    for (let i = 0; i < 16; i++) {
      smf.s[i] = 0;
    }
    smf.s[axisOrName] = value;
    return smf;
  }
  
  /**
   * Create a basis SMF by axis name
   */
  static basisByName(name: string, value: f64 = 1.0): SedenionMemoryField {
    const idx = getAxisIndex(name);
    if (idx < 0) return new SedenionMemoryField();
    return SedenionMemoryField.basis(idx, value);
  }
  
  /**
   * Create a uniform SMF (equal weight on all axes)
   */
  static uniform(): SedenionMemoryField {
    const smf = new SedenionMemoryField();
    const val = 1.0 / Math.sqrt(16.0);
    for (let i = 0; i < 16; i++) {
      smf.s[i] = val;
    }
    return smf;
  }
  
  /**
   * Create from Hypercomplex state
   */
  static fromHypercomplex(h: Hypercomplex): SedenionMemoryField {
    if (h.dim != 16) {
      throw new Error("Hypercomplex state must be 16-dimensional for SMF");
    }
    const components = new Float64Array(16);
    for (let i = 0; i < 16; i++) {
      components[i] = h.c[i];
    }
    return new SedenionMemoryField(components);
  }
  
  // ============================================================================
  // Component Access
  // ============================================================================
  
  /**
   * Get axis value by index
   */
  get(index: i32): f64 {
    if (index >= 0 && index < 16) {
      return this.s[index];
    }
    return 0;
  }
  
  /**
   * Get axis value by name
   */
  getByName(name: string): f64 {
    const idx = getAxisIndex(name);
    return idx >= 0 ? this.s[idx] : 0;
  }
  
  /**
   * Set axis value by index
   */
  set(index: i32, value: f64): SedenionMemoryField {
    if (index >= 0 && index < 16) {
      this.s[index] = value;
    }
    return this;
  }
  
  /**
   * Set axis value by name
   */
  setByName(name: string, value: f64): SedenionMemoryField {
    const idx = getAxisIndex(name);
    if (idx >= 0) {
      this.s[idx] = value;
    }
    return this;
  }
  
  // ============================================================================
  // Metrics
  // ============================================================================
  
  /**
   * Compute the norm (magnitude) of the SMF
   */
  norm(): f64 {
    let sum: f64 = 0;
    for (let i = 0; i < 16; i++) {
      sum += this.s[i] * this.s[i];
    }
    return Math.sqrt(sum);
  }
  
  /**
   * Normalize to unit magnitude (equation 7)
   * s ← s / max(||s||, ε)
   */
  normalize(): SedenionMemoryField {
    const n = this.norm();
    const denom = Math.max(n, SedenionMemoryField.EPSILON);
    for (let i = 0; i < 16; i++) {
      this.s[i] /= denom;
    }
    return this;
  }
  
  /**
   * Compute SMF entropy (equation 8)
   * SSMF(s) = -Σ πk log(πk + ε)
   * where πk = |sk| / Σj|sj|
   */
  entropy(): f64 {
    let normSum: f64 = 0;
    for (let i = 0; i < 16; i++) {
      normSum += Math.abs(this.s[i]);
    }
    
    if (normSum < SedenionMemoryField.EPSILON) return 0;
    
    let H: f64 = 0;
    for (let i = 0; i < 16; i++) {
      const pi = Math.abs(this.s[i]) / normSum;
      if (pi > SedenionMemoryField.EPSILON) {
        H -= pi * Math.log(pi + SedenionMemoryField.EPSILON);
      }
    }
    return H;
  }
  
  /**
   * Alias for entropy (smfEntropy matches JS version)
   */
  smfEntropy(): f64 {
    return this.entropy();
  }
  
  /**
   * Dot product with another SMF
   */
  dot(other: SedenionMemoryField): f64 {
    let sum: f64 = 0;
    for (let i = 0; i < 16; i++) {
      sum += this.s[i] * other.s[i];
    }
    return sum;
  }
  
  /**
   * Cosine similarity (coherence) with another SMF
   */
  coherence(other: SedenionMemoryField): f64 {
    const d = this.dot(other);
    const n1 = this.norm();
    const n2 = other.norm();
    if (n1 < SedenionMemoryField.EPSILON || n2 < SedenionMemoryField.EPSILON) {
      return 0;
    }
    return d / (n1 * n2);
  }
  
  // ============================================================================
  // Sedenion Arithmetic
  // ============================================================================
  
  /**
   * Add two SMFs
   */
  add(other: SedenionMemoryField): SedenionMemoryField {
    const result = new SedenionMemoryField();
    for (let i = 0; i < 16; i++) {
      result.s[i] = this.s[i] + other.s[i];
    }
    return result;
  }
  
  /**
   * Subtract another SMF
   */
  sub(other: SedenionMemoryField): SedenionMemoryField {
    const result = new SedenionMemoryField();
    for (let i = 0; i < 16; i++) {
      result.s[i] = this.s[i] - other.s[i];
    }
    return result;
  }
  
  /**
   * Scale by a scalar
   */
  scale(k: f64): SedenionMemoryField {
    const result = new SedenionMemoryField();
    for (let i = 0; i < 16; i++) {
      result.s[i] = this.s[i] * k;
    }
    return result;
  }
  
  /**
   * Non-associative sedenion multiplication (equation 9)
   * Uses Cayley-Dickson construction via Fano plane extension
   * (sa * sb) * sc ≠ sa * (sb * sc)
   */
  multiply(other: SedenionMemoryField): SedenionMemoryField {
    const result = new SedenionMemoryField();
    for (let i = 0; i < 16; i++) {
      result.s[i] = 0;
    }
    
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        const mr = multiplyIndices(16, i, j);
        result.s[mr.index] += f64(mr.sign) * this.s[i] * other.s[j];
      }
    }
    
    return result;
  }
  
  /**
   * Sedenion conjugate (negate imaginary parts)
   */
  conjugate(): SedenionMemoryField {
    const result = new SedenionMemoryField();
    result.s[0] = this.s[0];
    for (let i = 1; i < 16; i++) {
      result.s[i] = -this.s[i];
    }
    return result;
  }
  
  /**
   * Sedenion inverse (if it exists)
   * For sedenions, inverse may not exist due to zero divisors
   */
  inverse(): SedenionMemoryField | null {
    const n2 = this.dot(this);
    if (n2 < SedenionMemoryField.EPSILON) {
      return null; // No inverse for zero or near-zero norm
    }
    const conj = this.conjugate();
    const result = new SedenionMemoryField();
    for (let i = 0; i < 16; i++) {
      result.s[i] = conj.s[i] / n2;
    }
    return result;
  }
  
  // ============================================================================
  // Zero-Divisor Tunneling
  // ============================================================================
  
  /**
   * Check for zero-divisor tunneling opportunities (Section 4.4)
   * Two nonzero SMFs where their product is zero
   */
  canTunnelTo(other: SedenionMemoryField, threshold: f64 = 0.01): bool {
    const myNorm = this.norm();
    const otherNorm = other.norm();
    
    if (myNorm < 0.1 || otherNorm < 0.1) {
      return false; // Need substantial non-zero SMFs
    }
    
    const product = this.multiply(other);
    return product.norm() < threshold;
  }
  
  // ============================================================================
  // Interpolation
  // ============================================================================
  
  /**
   * SLERP interpolation for smooth transitions (equation 21)
   * For sedenions, we use normalized linear interpolation due to
   * complexity from non-associativity
   * 
   * @param other Target SMF
   * @param t Interpolation parameter [0, 1]
   */
  slerp(other: SedenionMemoryField, t: f64): SedenionMemoryField {
    const result = new SedenionMemoryField();
    for (let i = 0; i < 16; i++) {
      result.s[i] = (1 - t) * this.s[i] + t * other.s[i];
    }
    return result.normalize();
  }
  
  // ============================================================================
  // Prime Activity Coupling (equation 10)
  // ============================================================================
  
  /**
   * Compute axis deltas from oscillator activity
   * Maps semantic activity to SMF axis updates
   */
  computeAxisDeltas(
    amplitudes: Float64Array,
    phases: Float64Array
  ): Float64Array {
    const delta = new Float64Array(16);
    
    // Default: maintain current orientation with slight drift toward coherence
    delta[0] = 0.1; // Base coherence maintenance
    
    if (amplitudes.length == 0) {
      return delta;
    }
    
    // Compute oscillator statistics
    let totalAmplitude: f64 = 0;
    let activeCount: i32 = 0;
    let amplitudeVariance: f64 = 0;
    
    let meanAmplitude: f64 = 0;
    for (let i = 0; i < i32(amplitudes.length); i++) {
      meanAmplitude += amplitudes[i];
    }
    meanAmplitude /= f64(amplitudes.length);
    
    for (let i = 0; i < i32(amplitudes.length); i++) {
      totalAmplitude += amplitudes[i];
      if (amplitudes[i] > 0.1) activeCount++;
      const diff = amplitudes[i] - meanAmplitude;
      amplitudeVariance += diff * diff;
    }
    amplitudeVariance /= f64(amplitudes.length);
    
    // Phase coherence (Kuramoto order parameter)
    let realSum: f64 = 0;
    let imagSum: f64 = 0;
    for (let i = 0; i < i32(phases.length); i++) {
      if (amplitudes[i] > 0.1) {
        realSum += Math.cos(phases[i]);
        imagSum += Math.sin(phases[i]);
      }
    }
    let phaseCoherence: f64 = 0;
    if (activeCount > 0) {
      phaseCoherence = Math.sqrt(realSum * realSum + imagSum * imagSum) / f64(activeCount);
    }
    
    // Map to SMF axes based on activity patterns
    
    // Axis 0 (coherence): High phase synchronization
    delta[0] = phaseCoherence * 0.3;
    
    // Axis 1 (identity): Stable amplitude pattern
    delta[1] = Math.max(0, 0.2 - amplitudeVariance * 0.5);
    
    // Axis 2 (duality): High variance (opposing forces)
    delta[2] = amplitudeVariance * 0.2;
    
    // Axis 3 (structure): Many active oscillators
    delta[3] = Math.min(0.3, f64(activeCount) / f64(amplitudes.length) * 0.3);
    
    // Axis 4 (change): Recent amplitude changes
    delta[4] = amplitudeVariance * 0.1;
    
    // Axis 5 (life): Total energy (amplitude)
    delta[5] = Math.min(0.3, totalAmplitude * 0.05);
    
    // Axis 6 (harmony): High coherence + structure
    delta[6] = (phaseCoherence + delta[3]) * 0.15;
    
    // Axis 7 (wisdom): Low entropy state (concentrated)
    // (Would need entropy from primeState)
    delta[7] = 0.05;
    
    // Axis 8 (infinity): Very high coherence
    delta[8] = phaseCoherence > 0.9 ? 0.2 : 0;
    
    // Axis 9 (creation): New oscillators excited
    delta[9] = 0.05;
    
    // Axis 10 (truth): Stable, high coherence
    delta[10] = (phaseCoherence > 0.7 && amplitudeVariance < 0.1) ? 0.2 : 0;
    
    // Axis 11 (love): Sustained alignment
    delta[11] = phaseCoherence * 0.1;
    
    // Axis 12 (power): High total amplitude
    delta[12] = totalAmplitude > f64(amplitudes.length) * 0.5 ? 0.2 : 0.05;
    
    // Axis 13 (time): Based on phase progression
    delta[13] = 0.05;
    
    // Axis 14 (space): Distribution across oscillators
    delta[14] = Math.min(0.2, f64(activeCount) / 16.0 * 0.2);
    
    // Axis 15 (consciousness): Combination of coherence, identity, wisdom
    delta[15] = (delta[0] + delta[1] + delta[7]) * 0.2;
    
    return delta;
  }
  
  /**
   * Update SMF from prime activity (equation 10)
   * s(t + Δt) = Norm((1 - η) * s(t) + η * Γ({αp, φp, Ap}))
   */
  updateFromPrimeActivity(
    amplitudes: Float64Array,
    phases: Float64Array,
    couplingRate: f64 = 0.1
  ): SedenionMemoryField {
    const delta = this.computeAxisDeltas(amplitudes, phases);
    
    for (let i = 0; i < 16; i++) {
      this.s[i] = (1 - couplingRate) * this.s[i] + couplingRate * delta[i];
    }
    this.normalize();
    
    return this;
  }
  
  // ============================================================================
  // Analysis
  // ============================================================================
  
  /**
   * Get dominant axes (highest absolute values)
   */
  dominantAxes(n: i32 = 3): DominantAxisInfo[] {
    const indexed: DominantAxisInfo[] = [];
    
    for (let i = 0; i < 16; i++) {
      indexed.push(new DominantAxisInfo(
        i,
        SMF_AXES[i].name,
        this.s[i],
        Math.abs(this.s[i])
      ));
    }
    
    indexed.sort((a: DominantAxisInfo, b: DominantAxisInfo): i32 => {
      if (b.absValue > a.absValue) return 1;
      if (b.absValue < a.absValue) return -1;
      return 0;
    });
    
    const result: DominantAxisInfo[] = [];
    for (let i = 0; i < n && i < 16; i++) {
      result.push(indexed[i]);
    }
    return result;
  }
  
  // ============================================================================
  // Conversion
  // ============================================================================
  
  /**
   * Convert to Hypercomplex (16D)
   */
  toHypercomplex(): Hypercomplex {
    const components = new Float64Array(16);
    for (let i = 0; i < 16; i++) {
      components[i] = this.s[i];
    }
    return new Hypercomplex(16, components);
  }
  
  /**
   * Clone this SMF
   */
  clone(): SedenionMemoryField {
    const components = new Float64Array(16);
    for (let i = 0; i < 16; i++) {
      components[i] = this.s[i];
    }
    return new SedenionMemoryField(components);
  }
  
  /**
   * Convert to regular array
   */
  toArray(): f64[] {
    const arr: f64[] = [];
    for (let i = 0; i < 16; i++) {
      arr.push(this.s[i]);
    }
    return arr;
  }
  
  // ============================================================================
  // Serialization
  // ============================================================================
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    
    // Add axis values as object
    let axesJson = "{";
    for (let i = 0; i < 16; i++) {
      if (i > 0) axesJson += ",";
      axesJson += `"${SMF_AXES[i].name}":${toFixed(this.s[i], 6)}`;
    }
    axesJson += "}";
    builder.addRawField("axes", axesJson);
    
    builder.addNumberField("norm", this.norm());
    builder.addNumberField("entropy", this.entropy());
    
    // Add dominant axes
    const dominant = this.dominantAxes(3);
    let dominantJson = "[";
    for (let i = 0; i < dominant.length; i++) {
      if (i > 0) dominantJson += ",";
      dominantJson += `"${dominant[i].name}"`;
    }
    dominantJson += "]";
    builder.addRawField("dominant", dominantJson);
    
    builder.endObject();
    return builder.build();
  }
  
  toString(): string {
    const dominant = this.dominantAxes(3);
    let parts = "SMF(";
    for (let i = 0; i < dominant.length; i++) {
      if (i > 0) parts += ", ";
      parts += `${dominant[i].name}:${toFixed(dominant[i].value, 3)}`;
    }
    parts += ")";
    return parts;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a new SMF with initial coherence
 */
export function createSMF(): SedenionMemoryField {
  return new SedenionMemoryField();
}

/**
 * Create SMF from text (simplified - would need vocabulary in full implementation)
 */
export function createSMFFromText(text: string): SedenionMemoryField {
  const smf = new SedenionMemoryField();
  
  // Simple heuristic: analyze text for semantic content
  const len = text.length;
  
  // Base coherence depends on text complexity
  smf.s[0] = 0.5;
  
  // Identity stable
  smf.s[1] = 0.3;
  
  // Structure based on length
  smf.s[3] = Math.min(0.5, f64(len) / 200.0);
  
  // Consciousness present when processing text
  smf.s[15] = 0.4;
  
  return smf.normalize();
}