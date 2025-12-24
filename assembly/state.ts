/**
 * State Management System
 * 
 * Implements:
 * - StateSnapshot: Immutable point-in-time state
 * - Moment: Discrete observation unit
 * - TemporalLayer: History tracking with decay
 * - MemoryStore: Long-term memory with associative recall
 * 
 * Ported from tinyaleph/apps/sentient/lib/temporal.js
 */

import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';

/**
 * StateSnapshot - Immutable capture of system state
 */
export class StateSnapshot implements Serializable {
  timestamp: i64;
  coherence: f64;
  entropy: f64;
  lyapunovExponent: f64;
  phases: Float64Array;
  amplitudes: Float64Array;
  smfState: Float64Array;
  collapseProbability: f64;

  constructor(
    timestamp: i64,
    coherence: f64,
    entropy: f64,
    lyapunovExponent: f64,
    phases: Float64Array,
    amplitudes: Float64Array,
    smfState: Float64Array,
    collapseProbability: f64
  ) {
    this.timestamp = timestamp;
    this.coherence = coherence;
    this.entropy = entropy;
    this.lyapunovExponent = lyapunovExponent;
    this.phases = phases;
    this.amplitudes = amplitudes;
    this.smfState = smfState;
    this.collapseProbability = collapseProbability;
  }

  /**
   * Calculate distance to another snapshot
   */
  distance(other: StateSnapshot): f64 {
    // Weighted combination of differences
    const coherenceDiff = Math.abs(this.coherence - other.coherence);
    const entropyDiff = Math.abs(this.entropy - other.entropy);

    // Phase difference (circular)
    let phaseDiff: f64 = 0.0;
    const n = Math.min(this.phases.length, other.phases.length) as i32;
    for (let i: i32 = 0; i < n; i++) {
      let diff = Math.abs(this.phases[i] - other.phases[i]);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      phaseDiff += diff;
    }
    phaseDiff = n > 0 ? phaseDiff / f64(n) : 0.0;

    // SMF distance
    let smfDiff: f64 = 0.0;
    const m = Math.min(this.smfState.length, other.smfState.length) as i32;
    for (let i: i32 = 0; i < m; i++) {
      smfDiff += Math.pow(this.smfState[i] - other.smfState[i], 2);
    }
    smfDiff = Math.sqrt(smfDiff);

    return coherenceDiff * 0.3 + entropyDiff * 0.2 + phaseDiff * 0.2 + smfDiff * 0.3;
  }

  /**
   * Clone this snapshot
   */
  clone(): StateSnapshot {
    const phases = new Float64Array(this.phases.length);
    const amplitudes = new Float64Array(this.amplitudes.length);
    const smfState = new Float64Array(this.smfState.length);

    for (let i: i32 = 0; i < i32(phases.length); i++) phases[i] = this.phases[i];
    for (let i: i32 = 0; i < i32(amplitudes.length); i++) amplitudes[i] = this.amplitudes[i];
    for (let i: i32 = 0; i < i32(smfState.length); i++) smfState[i] = this.smfState[i];

    return new StateSnapshot(
      this.timestamp,
      this.coherence,
      this.entropy,
      this.lyapunovExponent,
      phases,
      amplitudes,
      smfState,
      this.collapseProbability
    );
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("timestamp", f64(this.timestamp))
      .addNumberField("coherence", this.coherence)
      .addNumberField("entropy", this.entropy)
      .addNumberField("lyapunovExponent", this.lyapunovExponent)
      .addNumberField("collapseProbability", this.collapseProbability)
      .endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * Moment - A discrete observation unit with significance
 */
export class Moment implements Serializable {
  id: i32;
  snapshot: StateSnapshot;
  significance: f64;
  category: string;
  collapsed: bool;

  constructor(id: i32, snapshot: StateSnapshot, significance: f64, category: string = "general") {
    this.id = id;
    this.snapshot = snapshot;
    this.significance = significance;
    this.category = category;
    this.collapsed = false;
  }

  /**
   * Check if this moment is significant enough to store
   */
  isSignificant(threshold: f64 = 0.5): bool {
    return this.significance >= threshold;
  }

  /**
   * Calculate resonance with another moment
   */
  resonanceWith(other: Moment): f64 {
    const distance = this.snapshot.distance(other.snapshot);
    // Resonance is inverse of distance
    return Math.exp(-distance);
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("id", f64(this.id))
      .addNumberField("significance", this.significance)
      .addStringField("category", this.category)
      .addBooleanField("collapsed", this.collapsed)
      .addRawField("snapshot", this.snapshot.toJSON())
      .endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * TemporalLayer - History tracking with decay
 */
export class TemporalLayer implements Serializable {
  moments: Array<Moment>;
  maxSize: i32;
  decayRate: f64;
  nextId: i32;
  currentMoment: Moment | null;

  constructor(maxSize: i32 = 1000, decayRate: f64 = 0.01) {
    this.moments = new Array<Moment>();
    this.maxSize = maxSize;
    this.decayRate = decayRate;
    this.nextId = 0;
    this.currentMoment = null;
  }

  /**
   * Record a new moment
   */
  record(snapshot: StateSnapshot, significance: f64, category: string = "general"): Moment {
    const moment = new Moment(this.nextId++, snapshot, significance, category);
    this.moments.push(moment);
    this.currentMoment = moment;

    // Prune if over size
    if (this.moments.length > this.maxSize) {
      this.prune();
    }

    return moment;
  }

  /**
   * Apply decay to all moments
   */
  tick(dt: f64): void {
    const decayFactor = Math.exp(-this.decayRate * dt);

    for (let i: i32 = 0; i < this.moments.length; i++) {
      this.moments[i].significance *= decayFactor;
    }
  }

  /**
   * Prune low-significance moments
   */
  prune(): void {
    const threshold: f64 = 0.1;
    const newMoments = new Array<Moment>();

    for (let i: i32 = 0; i < this.moments.length; i++) {
      if (this.moments[i].significance >= threshold) {
        newMoments.push(this.moments[i]);
      }
    }

    this.moments = newMoments;
  }

  /**
   * Find moments by category
   */
  findByCategory(category: string): Array<Moment> {
    const result = new Array<Moment>();

    for (let i: i32 = 0; i < this.moments.length; i++) {
      if (this.moments[i].category == category) {
        result.push(this.moments[i]);
      }
    }

    return result;
  }

  /**
   * Find similar moments to a given snapshot
   */
  findSimilar(snapshot: StateSnapshot, maxResults: i32 = 10, maxDistance: f64 = 1.0): Array<Moment> {
    // Score all moments
    const scored = new Array<MomentScore>();

    for (let i: i32 = 0; i < this.moments.length; i++) {
      const distance = snapshot.distance(this.moments[i].snapshot);
      if (distance <= maxDistance) {
        scored.push(new MomentScore(this.moments[i], distance));
      }
    }

    // Sort by distance
    scored.sort((a: MomentScore, b: MomentScore): i32 => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    });

    // Return top results
    const result = new Array<Moment>();
    for (let i: i32 = 0; i < Math.min(maxResults, scored.length) as i32; i++) {
      result.push(scored[i].moment);
    }

    return result;
  }

  /**
   * Get recent moments
   */
  getRecent(count: i32): Array<Moment> {
    const result = new Array<Moment>();
    const start = Math.max(0, this.moments.length - count) as i32;

    for (let i: i32 = start; i < this.moments.length; i++) {
      result.push(this.moments[i]);
    }

    return result;
  }

  /**
   * Get the most significant moments
   */
  getMostSignificant(count: i32): Array<Moment> {
    // Copy and sort
    const sorted = new Array<Moment>(this.moments.length);
    for (let i: i32 = 0; i < this.moments.length; i++) {
      sorted[i] = this.moments[i];
    }

    sorted.sort((a: Moment, b: Moment): i32 => {
      if (b.significance > a.significance) return 1;
      if (b.significance < a.significance) return -1;
      return 0;
    });

    const result = new Array<Moment>();
    for (let i: i32 = 0; i < Math.min(count, sorted.length) as i32; i++) {
      result.push(sorted[i]);
    }

    return result;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("momentCount", f64(this.moments.length))
      .addNumberField("maxSize", f64(this.maxSize))
      .addNumberField("decayRate", this.decayRate);

    // Add recent moments preview
    const recent = this.getRecent(5);
    let recentJson = "[";
    for (let i: i32 = 0; i < recent.length; i++) {
      if (i > 0) recentJson += ",";
      recentJson += recent[i].toJSON();
    }
    recentJson += "]";
    builder.addRawField("recent", recentJson);

    builder.endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * Helper class for sorting moments by distance
 */
class MomentScore {
  moment: Moment;
  distance: f64;

  constructor(moment: Moment, distance: f64) {
    this.moment = moment;
    this.distance = distance;
  }
}

/**
 * MemoryTrace - A long-term memory with associative links
 */
export class MemoryTrace implements Serializable {
  id: i32;
  content: StateSnapshot;
  strength: f64;
  createdAt: i64;
  lastAccessedAt: i64;
  accessCount: i32;
  associations: Map<i32, f64>;  // Other trace IDs -> association strength

  constructor(id: i32, content: StateSnapshot, strength: f64, timestamp: i64) {
    this.id = id;
    this.content = content;
    this.strength = strength;
    this.createdAt = timestamp;
    this.lastAccessedAt = timestamp;
    this.accessCount = 1;
    this.associations = new Map<i32, f64>();
  }

  /**
   * Access this trace (updates recency and strength)
   */
  access(timestamp: i64): void {
    this.lastAccessedAt = timestamp;
    this.accessCount++;
    // Strengthen on access
    this.strength = Math.min(1.0, this.strength * 1.1);
  }

  /**
   * Create association with another trace
   */
  associate(otherId: i32, strength: f64): void {
    if (this.associations.has(otherId)) {
      const current = this.associations.get(otherId);
      this.associations.set(otherId, Math.min(1.0, current + strength));
    } else {
      this.associations.set(otherId, strength);
    }
  }

  /**
   * Get association strength with another trace
   */
  getAssociation(otherId: i32): f64 {
    if (this.associations.has(otherId)) {
      return this.associations.get(otherId);
    }
    return 0.0;
  }

  /**
   * Apply decay
   */
  decay(rate: f64, currentTime: i64): void {
    const age = f64(currentTime - this.lastAccessedAt);
    const decayFactor = Math.exp(-rate * age);
    this.strength *= decayFactor;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("id", f64(this.id))
      .addNumberField("strength", this.strength)
      .addNumberField("accessCount", f64(this.accessCount))
      .addNumberField("associationCount", f64(this.associations.size))
      .endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * MemoryStore - Long-term memory with associative recall
 */
export class MemoryStore implements Serializable {
  traces: Map<i32, MemoryTrace>;
  nextId: i32;
  maxSize: i32;
  decayRate: f64;

  constructor(maxSize: i32 = 10000, decayRate: f64 = 0.001) {
    this.traces = new Map<i32, MemoryTrace>();
    this.nextId = 0;
    this.maxSize = maxSize;
    this.decayRate = decayRate;
  }

  /**
   * Store a new memory trace
   */
  store(content: StateSnapshot, strength: f64, timestamp: i64): MemoryTrace {
    const trace = new MemoryTrace(this.nextId++, content, strength, timestamp);
    this.traces.set(trace.id, trace);

    // Create associations with similar traces
    this.createAssociations(trace);

    // Prune if over size
    if (this.traces.size > this.maxSize) {
      this.consolidate();
    }

    return trace;
  }

  /**
   * Recall traces similar to a query
   */
  recall(query: StateSnapshot, maxResults: i32 = 10): Array<MemoryTrace> {
    const scored = new Array<TraceScore>();
    const ids = this.traces.keys();

    for (let i: i32 = 0; i < ids.length; i++) {
      const trace = this.traces.get(ids[i]);
      const distance = query.distance(trace.content);
      const score = trace.strength * Math.exp(-distance);
      scored.push(new TraceScore(trace, score));
    }

    // Sort by score descending
    scored.sort((a: TraceScore, b: TraceScore): i32 => {
      if (b.score > a.score) return 1;
      if (b.score < a.score) return -1;
      return 0;
    });

    const result = new Array<MemoryTrace>();
    for (let i: i32 = 0; i < Math.min(maxResults, scored.length) as i32; i++) {
      const trace = scored[i].trace;
      trace.access(query.timestamp);
      result.push(trace);
    }

    return result;
  }

  /**
   * Spread activation from a trace to associated traces
   */
  spreadActivation(traceId: i32, depth: i32 = 2, decay: f64 = 0.5): Array<MemoryTrace> {
    const activated = new Map<i32, f64>();
    const queue = new Array<ActivationItem>();

    if (!this.traces.has(traceId)) {
      return new Array<MemoryTrace>();
    }

    queue.push(new ActivationItem(traceId, 1.0, 0));

    while (queue.length > 0) {
      const item = queue.shift();
      const id = item.traceId;
      const activation = item.activation;
      const currentDepth = item.depth;

      if (activated.has(id)) continue;
      activated.set(id, activation);

      if (currentDepth >= depth) continue;

      const trace = this.traces.get(id);
      const associationIds = trace.associations.keys();

      for (let i: i32 = 0; i < associationIds.length; i++) {
        const assocId = associationIds[i];
        const assocStrength = trace.getAssociation(assocId);
        const newActivation = activation * assocStrength * decay;

        if (newActivation > 0.1 && !activated.has(assocId)) {
          queue.push(new ActivationItem(assocId, newActivation, currentDepth + 1));
        }
      }
    }

    // Collect results
    const result = new Array<MemoryTrace>();
    const activatedIds = activated.keys();

    for (let i: i32 = 0; i < activatedIds.length; i++) {
      result.push(this.traces.get(activatedIds[i]));
    }

    return result;
  }

  /**
   * Create associations between a new trace and existing similar traces
   */
  private createAssociations(newTrace: MemoryTrace): void {
    const ids = this.traces.keys();

    for (let i: i32 = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id == newTrace.id) continue;

      const existing = this.traces.get(id);
      const distance = newTrace.content.distance(existing.content);

      if (distance < 1.0) {
        const strength = Math.exp(-distance);
        newTrace.associate(id, strength);
        existing.associate(newTrace.id, strength);
      }
    }
  }

  /**
   * Consolidate memory by removing weak traces
   */
  consolidate(): void {
    const threshold: f64 = 0.1;
    const ids = this.traces.keys();
    const toRemove = new Array<i32>();

    for (let i: i32 = 0; i < ids.length; i++) {
      const trace = this.traces.get(ids[i]);
      if (trace.strength < threshold) {
        toRemove.push(ids[i]);
      }
    }

    for (let i: i32 = 0; i < toRemove.length; i++) {
      this.traces.delete(toRemove[i]);
    }
  }

  /**
   * Apply decay to all traces
   */
  tick(currentTime: i64): void {
    const ids = this.traces.keys();

    for (let i: i32 = 0; i < ids.length; i++) {
      const trace = this.traces.get(ids[i]);
      trace.decay(this.decayRate, currentTime);
    }
  }

  /**
   * Get total trace count
   */
  size(): i32 {
    return this.traces.size;
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("traceCount", f64(this.traces.size))
      .addNumberField("maxSize", f64(this.maxSize))
      .addNumberField("decayRate", this.decayRate)
      .endObject();
    return builder.build();
  }

  toString(): string {
    return this.toJSON();
  }
}

/**
 * Helper class for scoring traces during recall
 */
class TraceScore {
  trace: MemoryTrace;
  score: f64;

  constructor(trace: MemoryTrace, score: f64) {
    this.trace = trace;
    this.score = score;
  }
}

/**
 * Helper class for spread activation queue
 */
class ActivationItem {
  traceId: i32;
  activation: f64;
  depth: i32;

  constructor(traceId: i32, activation: f64, depth: i32) {
    this.traceId = traceId;
    this.activation = activation;
    this.depth = depth;
  }
}

/**
 * Create a simple state snapshot
 */
export function createSnapshot(
  timestamp: i64,
  coherence: f64,
  entropy: f64,
  numOscillators: i32
): StateSnapshot {
  const phases = new Float64Array(numOscillators);
  const amplitudes = new Float64Array(numOscillators);
  const smfState = new Float64Array(16);

  for (let i: i32 = 0; i < numOscillators; i++) {
    phases[i] = 0.0;
    amplitudes[i] = 1.0 / f64(numOscillators);
  }

  for (let i: i32 = 0; i < 16; i++) {
    smfState[i] = i == 0 ? 1.0 : 0.0;  // Coherence axis = 1
  }

  return new StateSnapshot(
    timestamp,
    coherence,
    entropy,
    0.0,  // lyapunov
    phases,
    amplitudes,
    smfState,
    0.0   // collapse prob
  );
}