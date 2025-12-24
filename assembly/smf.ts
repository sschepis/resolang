/**
 * Sedenion Memory Field (SMF) Implementation
 * 
 * The SMF provides a 16-dimensional semantic space using Sedenions.
 * Each axis represents a fundamental semantic dimension:
 * 
 * e0:  coherence    - Internal consistency
 * e1:  identity     - Self-reference
 * e2:  duality      - Binary distinction  
 * e3:  structure    - Pattern/form
 * e4:  change       - Transformation
 * e5:  life         - Vitality
 * e6:  harmony      - Balance
 * e7:  wisdom       - Integration
 * e8:  infinity     - Unboundedness
 * e9:  creation     - Emergence
 * e10: truth        - Correspondence
 * e11: love         - Attraction
 * e12: power        - Capacity
 * e13: time         - Sequence
 * e14: space        - Extension
 * e15: consciousness - Awareness
 * 
 * Ported from tinyaleph/apps/sentient/lib/smf.js
 */

import { Sedenion } from './sedenion';
import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';

// Semantic axis names
export const SEMANTIC_AXES: string[] = [
  "coherence", "identity", "duality", "structure",
  "change", "life", "harmony", "wisdom",
  "infinity", "creation", "truth", "love",
  "power", "time", "space", "consciousness"
];

// Axis indices for convenient access
export const AXIS_COHERENCE: i32 = 0;
export const AXIS_IDENTITY: i32 = 1;
export const AXIS_DUALITY: i32 = 2;
export const AXIS_STRUCTURE: i32 = 3;
export const AXIS_CHANGE: i32 = 4;
export const AXIS_LIFE: i32 = 5;
export const AXIS_HARMONY: i32 = 6;
export const AXIS_WISDOM: i32 = 7;
export const AXIS_INFINITY: i32 = 8;
export const AXIS_CREATION: i32 = 9;
export const AXIS_TRUTH: i32 = 10;
export const AXIS_LOVE: i32 = 11;
export const AXIS_POWER: i32 = 12;
export const AXIS_TIME: i32 = 13;
export const AXIS_SPACE: i32 = 14;
export const AXIS_CONSCIOUSNESS: i32 = 15;

/**
 * Configuration for SMF evolution
 */
export class SMFConfig {
  decayRate: f64 = 0.001;
  coherenceThreshold: f64 = 0.5;
  resonanceStrength: f64 = 0.1;
  collapseThreshold: f64 = 0.8;
  historyLength: i32 = 100;
}

export const SMF_CONFIG: SMFConfig = new SMFConfig();

/**
 * SedenionMemoryField - Main SMF implementation
 * 
 * Provides semantic state evolution via Sedenion algebra.
 * Tracks coherence, entropy, and collapse probability.
 */
export class SedenionMemoryField implements Serializable {
  state: Sedenion;
  velocity: Sedenion;
  coherenceHistory: Float64Array;
  historyIndex: i32;
  accumulatedEntropy: f64;
  collapseCount: i32;
  startTime: i64;
  lastUpdateTime: i64;

  constructor(historyLength: i32 = 100) {
    // Initialize with unit sedenion (coherent ground state)
    this.state = Sedenion.unit();
    this.velocity = Sedenion.zero();
    this.coherenceHistory = new Float64Array(historyLength);
    this.historyIndex = 0;
    this.accumulatedEntropy = 0.0;
    this.collapseCount = 0;
    this.startTime = 0;
    this.lastUpdateTime = 0;
  }

  /**
   * Get the current coherence value (e0 component)
   */
  getCoherence(): f64 {
    return this.state.c0;
  }

  /**
   * Get a specific semantic axis value
   */
  getAxis(index: i32): f64 {
    return this.state.get(index);
  }

  /**
   * Set a specific semantic axis value
   */
  setAxis(index: i32, value: f64): void {
    this.state.set(index, value);
  }

  /**
   * Get entropy of the current state
   */
  getEntropy(): f64 {
    return this.state.entropy();
  }

  /**
   * Excite a semantic axis with given amplitude
   */
  excite(axisIndex: i32, amplitude: f64): void {
    const current = this.state.get(axisIndex);
    this.state.set(axisIndex, current + amplitude);
  }

  /**
   * Apply perturbation to the field
   */
  perturb(perturbation: Sedenion): void {
    this.state = this.state.add(perturbation);
  }

  /**
   * Evolve the field by one timestep
   * 
   * @param dt - Time delta
   * @param timestamp - Current timestamp
   * @returns Current coherence
   */
  evolve(dt: f64, timestamp: i64 = 0): f64 {
    this.lastUpdateTime = timestamp;

    // Apply velocity
    const scaledVelocity = this.velocity.scale(dt);
    this.state = this.state.add(scaledVelocity);

    // Apply damping to velocity
    this.velocity = this.velocity.scale(1.0 - SMF_CONFIG.decayRate);

    // Apply coherence-preserving normalization
    // The e0 component (coherence) tends toward 1 when stable
    const norm = this.state.norm();
    if (norm > 1e-10) {
      // Soft normalization - maintain magnitude close to 1
      const targetNorm = 1.0;
      const normFactor = 1.0 + (targetNorm - norm) * 0.1;
      this.state = this.state.scale(normFactor);
    }

    // Track coherence history
    const coherence = this.getCoherence();
    this.coherenceHistory[this.historyIndex] = coherence;
    this.historyIndex = (this.historyIndex + 1) % i32(this.coherenceHistory.length);

    // Accumulate entropy
    this.accumulatedEntropy += this.getEntropy() * dt;

    // Check for collapse
    if (this.shouldCollapse()) {
      this.collapse();
    }

    return coherence;
  }

  /**
   * Calculate collapse probability
   * P_collapse = 1 - e^(-∫S(t)dt)
   */
  getCollapseProbability(): f64 {
    return 1.0 - Math.exp(-this.accumulatedEntropy);
  }

  /**
   * Check if the field should collapse
   */
  shouldCollapse(): bool {
    return this.getCollapseProbability() > SMF_CONFIG.collapseThreshold;
  }

  /**
   * Perform field collapse - reset to ground state
   */
  collapse(): void {
    // Measure the current state (extract dominant axis)
    const dominantAxis = this.getDominantAxis();
    const dominantValue = this.state.get(dominantAxis);

    // Reset to ground state with residual from dominant axis
    this.state = Sedenion.unit();
    this.state.set(dominantAxis, dominantValue * 0.1);

    // Reset accumulator
    this.accumulatedEntropy = 0.0;
    this.collapseCount++;
  }

  /**
   * Get the dominant (highest magnitude) axis
   */
  getDominantAxis(): i32 {
    let maxVal: f64 = 0.0;
    let maxIdx: i32 = 0;

    for (let i: i32 = 0; i < 16; i++) {
      const val = Math.abs(this.state.get(i));
      if (val > maxVal) {
        maxVal = val;
        maxIdx = i;
      }
    }

    return maxIdx;
  }

  /**
   * Get all axis values as array
   */
  getAllAxes(): Float64Array {
    const result = new Float64Array(16);
    for (let i: i32 = 0; i < 16; i++) {
      result[i] = this.state.get(i);
    }
    return result;
  }

  /**
   * Calculate similarity with another SMF
   */
  similarity(other: SedenionMemoryField): f64 {
    const norm1 = this.state.norm();
    const norm2 = other.state.norm();
    if (norm1 < 1e-10 || norm2 < 1e-10) return 0.0;

    const dot = this.state.dot(other.state);
    return dot / (norm1 * norm2);
  }

  /**
   * Blend with another SMF
   */
  blend(other: SedenionMemoryField, ratio: f64): SedenionMemoryField {
    const result = new SedenionMemoryField(i32(this.coherenceHistory.length));

    const scaled1 = this.state.scale(1.0 - ratio);
    const scaled2 = other.state.scale(ratio);
    result.state = scaled1.add(scaled2);

    return result;
  }

  /**
   * Apply resonance with oscillator phases
   * 
   * @param phases - Array of oscillator phases
   * @param amplitudes - Array of oscillator amplitudes
   */
  applyResonance(phases: Float64Array, amplitudes: Float64Array): void {
    const n = Math.min(phases.length, 16) as i32;

    for (let i: i32 = 0; i < n; i++) {
      const phase = phases[i];
      const amplitude = amplitudes[i];

      // Map oscillator to semantic axis
      const axisIdx = i % 16;
      const current = this.state.get(axisIdx);

      // Apply resonant coupling
      const resonance = Math.sin(phase) * amplitude * SMF_CONFIG.resonanceStrength;
      this.state.set(axisIdx, current + resonance);
    }
  }

  /**
   * Reset the field to initial state
   */
  reset(): void {
    this.state = Sedenion.unit();
    this.velocity = Sedenion.zero();
    this.accumulatedEntropy = 0.0;
    this.historyIndex = 0;
    
    for (let i: i32 = 0; i < i32(this.coherenceHistory.length); i++) {
      this.coherenceHistory[i] = 0.0;
    }
  }

  /**
   * Get mean coherence from history
   */
  getMeanCoherence(): f64 {
    let sum: f64 = 0.0;
    let count: i32 = 0;

    for (let i: i32 = 0; i < i32(this.coherenceHistory.length); i++) {
      if (this.coherenceHistory[i] != 0.0) {
        sum += this.coherenceHistory[i];
        count++;
      }
    }

    return count > 0 ? sum / f64(count) : 0.0;
  }

  /**
   * Get coherence variance
   */
  getCoherenceVariance(): f64 {
    const mean = this.getMeanCoherence();
    let variance: f64 = 0.0;
    let count: i32 = 0;

    for (let i: i32 = 0; i < i32(this.coherenceHistory.length); i++) {
      if (this.coherenceHistory[i] != 0.0) {
        const diff = this.coherenceHistory[i] - mean;
        variance += diff * diff;
        count++;
      }
    }

    return count > 1 ? variance / f64(count - 1) : 0.0;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("coherence", this.getCoherence())
      .addNumberField("entropy", this.getEntropy())
      .addNumberField("collapseProbability", this.getCollapseProbability())
      .addNumberField("collapseCount", f64(this.collapseCount))
      .addNumberField("dominantAxis", f64(this.getDominantAxis()));

    // Add semantic axes
    let axesJson = "{";
    for (let i: i32 = 0; i < 16; i++) {
      if (i > 0) axesJson += ",";
      axesJson += `"${SEMANTIC_AXES[i]}":${toFixed(this.state.get(i), 4)}`;
    }
    axesJson += "}";
    builder.addRawField("axes", axesJson);

    builder.endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * Create SMF from semantic values
 */
export function createSMFFromValues(values: Float64Array): SedenionMemoryField {
  const smf = new SedenionMemoryField();
  const n = Math.min(values.length, 16) as i32;

  for (let i: i32 = 0; i < n; i++) {
    smf.state.set(i, values[i]);
  }

  return smf;
}

/**
 * Create SMF from text (using character frequencies)
 */
export function createSMFFromText(text: string): SedenionMemoryField {
  const smf = new SedenionMemoryField();
  const textLen = text.length;

  if (textLen == 0) return smf;

  // Map characters to semantic axes
  for (let i = 0; i < textLen; i++) {
    const charCode = text.charCodeAt(i);
    const axisIdx = charCode % 16;
    const current = smf.state.get(axisIdx);
    smf.state.set(axisIdx, current + 1.0 / f64(textLen));
  }

  // Normalize
  const norm = smf.state.norm();
  if (norm > 1e-10) {
    smf.state = smf.state.scale(1.0 / norm);
  }

  return smf;
}