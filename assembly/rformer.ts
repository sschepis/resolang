/**
 * ResoFormer Implementation - Resonance-Based Transformer Primitives
 * 
 * Port from tinyaleph/core/rformer.js to AssemblyScript
 * 
 * Implements:
 * - SparsePrimeState: Sparse representation using prime-quaternion pairs
 * - Resonant Attention: Phase-coherent attention mechanism
 * - PR-Graph Memory: Hierarchical memory with phase-based retrieval
 * - Entropy-driven collapse dynamics
 */

import { Complex, Prime } from './types';
import { Hypercomplex } from './hypercomplex';
import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';
import { isPrime, generatePrimes } from './core/math';

// ============================================================================
// SparsePrimeState
// ============================================================================

/**
 * Sparse prime-quaternion pair for efficient state representation
 */
export class PrimeQuaternionPair {
  prime: Prime;
  quaternion: Hypercomplex;
  
  constructor(prime: Prime, quaternion: Hypercomplex) {
    this.prime = prime;
    this.quaternion = quaternion;
  }
  
  /**
   * Compute magnitude of this pair
   */
  magnitude(): f64 {
    return this.quaternion.magnitude();
  }
  
  /**
   * Clone this pair
   */
  clone(): PrimeQuaternionPair {
    return new PrimeQuaternionPair(this.prime, this.quaternion.clone());
  }
}

/**
 * SparsePrimeState: Efficient sparse representation using prime-quaternion pairs
 * 
 * |Ψ⟩ = Σ qp|p⟩ where qp ∈ ℍ (quaternions), p ∈ P (primes)
 * 
 * Only non-zero amplitudes are stored.
 */
export class SparsePrimeState implements Serializable {
  /** Map from prime to quaternion amplitude */
  private amplitudes: Map<Prime, Hypercomplex>;
  
  /** Cached norm */
  private cachedNorm: f64;
  private normDirty: bool;
  
  constructor() {
    this.amplitudes = new Map<Prime, Hypercomplex>();
    this.cachedNorm = 0;
    this.normDirty = true;
  }
  
  // ============================================================================
  // Factory Methods
  // ============================================================================
  
  /**
   * Create a basis state |p⟩
   */
  static basis(p: Prime): SparsePrimeState {
    const state = new SparsePrimeState();
    state.set(p, Hypercomplex.fromReal(4, 1.0));
    return state;
  }
  
  /**
   * Create from array of prime-quaternion pairs
   */
  static fromPairs(pairs: Array<PrimeQuaternionPair>): SparsePrimeState {
    const state = new SparsePrimeState();
    for (let i = 0; i < pairs.length; i++) {
      state.set(pairs[i].prime, pairs[i].quaternion);
    }
    return state;
  }
  
  /**
   * Create uniform superposition over first n primes
   */
  static uniform(n: i32): SparsePrimeState {
    const state = new SparsePrimeState();
    const primes = generatePrimes(n);
    const amp = 1.0 / Math.sqrt(<f64>n);
    
    for (let i = 0; i < primes.length; i++) {
      state.set(primes[i], Hypercomplex.fromReal(4, amp));
    }
    return state;
  }
  
  /**
   * Encode a number through its prime factorization
   */
  static fromNumber(n: i32): SparsePrimeState {
    const state = new SparsePrimeState();
    if (n <= 1) return state;
    
    // Factorize and weight by exponent
    let totalWeight: f64 = 0;
    const factors = new Map<Prime, i32>();
    let temp = n;
    let d = 2;
    
    while (temp > 1) {
      while (temp % d == 0) {
        const current = factors.has(<Prime>d) ? factors.get(<Prime>d) : 0;
        factors.set(<Prime>d, current + 1);
        totalWeight += 1;
        temp = temp / d;
      }
      d++;
      if (d * d > temp && temp > 1) {
        const current = factors.has(<Prime>temp) ? factors.get(<Prime>temp) : 0;
        factors.set(<Prime>temp, current + 1);
        totalWeight += 1;
        break;
      }
    }
    
    if (totalWeight == 0) return state;
    
    // Create amplitudes weighted by prime exponent
    const keys = factors.keys();
    for (let i = 0; i < keys.length; i++) {
      const p = keys[i];
      const exp = factors.get(p);
      const weight = <f64>exp / totalWeight;
      state.set(p, Hypercomplex.fromReal(4, weight));
    }
    
    return state.normalize();
  }
  
  /**
   * Encode text as a sparse prime state
   */
  static fromText(text: string): SparsePrimeState {
    const state = new SparsePrimeState();
    const n = text.length;
    if (n == 0) return state;
    
    // Use first 100 primes for character mapping
    const primes = generatePrimes(100);
    
    for (let i = 0; i < n; i++) {
      const charCode = text.charCodeAt(i);
      const primeIdx = charCode % primes.length;
      const p = primes[primeIdx];
      
      // Position encodes phase
      const phase = 2.0 * Math.PI * <f64>i / <f64>n;
      const current = state.get(p);
      
      // Add contribution with position-dependent phase
      const contribArr = new Array<f64>(4);
      contribArr[0] = Math.cos(phase) / <f64>n;
      contribArr[1] = Math.sin(phase) / <f64>n;
      contribArr[2] = 0;
      contribArr[3] = 0;
      const contribution = Hypercomplex.fromNumberArray(contribArr);
      
      const newAmp = current.add(contribution);
      state.set(p, newAmp);
    }
    
    return state.normalize();
  }
  
  // ============================================================================
  // Amplitude Access
  // ============================================================================
  
  /**
   * Get quaternion amplitude for prime
   */
  get(p: Prime): Hypercomplex {
    if (this.amplitudes.has(p)) {
      return this.amplitudes.get(p);
    }
    return Hypercomplex.zero(4);
  }
  
  /**
   * Set quaternion amplitude for prime
   */
  set(p: Prime, q: Hypercomplex): SparsePrimeState {
    if (q.magnitude() > 1e-10) {
      this.amplitudes.set(p, q);
    } else if (this.amplitudes.has(p)) {
      this.amplitudes.delete(p);
    }
    this.normDirty = true;
    return this;
  }
  
  /**
   * Check if prime has non-zero amplitude
   */
  has(p: Prime): bool {
    return this.amplitudes.has(p);
  }
  
  /**
   * Get number of non-zero entries
   */
  size(): i32 {
    return this.amplitudes.size;
  }
  
  /**
   * Get all primes with non-zero amplitude
   */
  primes(): Array<Prime> {
    return this.amplitudes.keys();
  }
  
  /**
   * Get all prime-quaternion pairs
   */
  pairs(): Array<PrimeQuaternionPair> {
    const result = new Array<PrimeQuaternionPair>(this.amplitudes.size);
    const keys = this.amplitudes.keys();
    for (let i = 0; i < keys.length; i++) {
      const p = keys[i];
      result[i] = new PrimeQuaternionPair(p, this.amplitudes.get(p));
    }
    return result;
  }
  
  // ============================================================================
  // Arithmetic Operations
  // ============================================================================
  
  /**
   * Add two sparse states
   */
  add(other: SparsePrimeState): SparsePrimeState {
    const result = this.clone();
    const otherPrimes = other.primes();
    
    for (let i = 0; i < otherPrimes.length; i++) {
      const p = otherPrimes[i];
      const current = result.get(p);
      const adding = other.get(p);
      result.set(p, current.add(adding));
    }
    
    return result;
  }
  
  /**
   * Scale by a real number
   */
  scale(k: f64): SparsePrimeState {
    const result = new SparsePrimeState();
    const ps = this.primes();
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      result.set(p, this.get(p).scale(k));
    }
    
    return result;
  }
  
  /**
   * Scale by a quaternion (left multiplication)
   */
  scaleQuaternion(q: Hypercomplex): SparsePrimeState {
    const result = new SparsePrimeState();
    const ps = this.primes();
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      result.set(p, q.mul(this.get(p)));
    }
    
    return result;
  }
  
  // ============================================================================
  // Inner Products and Norms
  // ============================================================================
  
  /**
   * Quaternionic inner product ⟨Ψ|Φ⟩
   * Returns a quaternion
   */
  inner(other: SparsePrimeState): Hypercomplex {
    let sum = Hypercomplex.zero(4);
    const ps = this.primes();
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (other.has(p)) {
        // Quaternionic inner product: q1* · q2
        const q1conj = this.get(p).conjugate();
        const q2 = other.get(p);
        sum = sum.add(q1conj.mul(q2));
      }
    }
    
    return sum;
  }
  
  /**
   * Compute the norm ||Ψ||
   */
  norm(): f64 {
    if (!this.normDirty) return this.cachedNorm;
    
    let sum: f64 = 0;
    const ps = this.primes();
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      sum += this.get(p).magnitudeSquared();
    }
    
    this.cachedNorm = Math.sqrt(sum);
    this.normDirty = false;
    return this.cachedNorm;
  }
  
  /**
   * Normalize to unit state
   */
  normalize(): SparsePrimeState {
    const n = this.norm();
    if (n < 1e-10) return this;
    return this.scale(1.0 / n);
  }
  
  // ============================================================================
  // Information Theory
  // ============================================================================
  
  /**
   * Shannon entropy: S(Ψ) = -Σ |qp|² log |qp|²
   */
  entropy(): f64 {
    const n = this.norm();
    const n2 = n * n;
    if (n2 < 1e-10) return 0;
    
    let h: f64 = 0;
    const ps = this.primes();
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      const prob = this.get(p).magnitudeSquared() / n2;
      if (prob > 1e-10) {
        h -= prob * Math.log2(prob);
      }
    }
    
    return h;
  }
  
  /**
   * Coherence with another state: |⟨Ψ|Φ⟩|²
   */
  coherence(other: SparsePrimeState): f64 {
    return this.inner(other).magnitudeSquared();
  }
  
  // ============================================================================
  // Phase Operations
  // ============================================================================
  
  /**
   * Apply phase rotation to all amplitudes
   */
  rotate(angle: f64): SparsePrimeState {
    const result = new SparsePrimeState();
    const ps = this.primes();
    
    // Rotation quaternion around i-axis
    const rotArr = new Array<f64>(4);
    rotArr[0] = Math.cos(angle / 2);
    rotArr[1] = Math.sin(angle / 2);
    rotArr[2] = 0;
    rotArr[3] = 0;
    const rotation = Hypercomplex.fromNumberArray(rotArr);
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      // q' = rotation * q * rotation^(-1)
      const q = this.get(p);
      const rotated = rotation.mul(q).mul(rotation.conjugate());
      result.set(p, rotated);
    }
    
    return result;
  }
  
  /**
   * Apply prime-dependent phase rotation
   */
  primePhase(n: i32): SparsePrimeState {
    const result = new SparsePrimeState();
    const ps = this.primes();
    const logN = Math.log(<f64>n);
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      const phase = 2.0 * Math.PI * logN / Math.log(<f64>p);
      const pRotArr = new Array<f64>(4);
      pRotArr[0] = Math.cos(phase / 2);
      pRotArr[1] = Math.sin(phase / 2);
      pRotArr[2] = 0;
      pRotArr[3] = 0;
      const rotation = Hypercomplex.fromNumberArray(pRotArr);
      const q = this.get(p);
      result.set(p, rotation.mul(q));
    }
    
    return result;
  }
  
  // ============================================================================
  // Dominant Analysis
  // ============================================================================
  
  /**
   * Get dominant primes (highest magnitude)
   */
  dominant(n: i32 = 5): Array<PrimeQuaternionPair> {
    const pairs = this.pairs();
    
    // Sort by magnitude descending
    pairs.sort((a: PrimeQuaternionPair, b: PrimeQuaternionPair): i32 => {
      const ma = a.magnitude();
      const mb = b.magnitude();
      if (mb > ma) return 1;
      if (mb < ma) return -1;
      return 0;
    });
    
    // Take top n
    const result = new Array<PrimeQuaternionPair>(Math.min(n, pairs.length) as i32);
    for (let i = 0; i < result.length; i++) {
      result[i] = pairs[i];
    }
    
    return result;
  }
  
  // ============================================================================
  // Clone and Serialization
  // ============================================================================
  
  /**
   * Clone this state
   */
  clone(): SparsePrimeState {
    const copy = new SparsePrimeState();
    const ps = this.primes();
    
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      copy.set(p, this.get(p).clone());
    }
    
    return copy;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("size", <f64>this.size())
      .addNumberField("norm", this.norm())
      .addNumberField("entropy", this.entropy());
    
    // Add dominant pairs
    const dom = this.dominant(5);
    let domJson = "[";
    for (let i = 0; i < dom.length; i++) {
      if (i > 0) domJson += ",";
      domJson += `{"prime":${dom[i].prime},"magnitude":${toFixed(dom[i].magnitude(), 4)}}`;
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

// ============================================================================
// Resonant Attention
// ============================================================================

/**
 * Resonance score between two sparse states
 * Measures phase coherence and amplitude alignment
 */
export function resonanceScore(query: SparsePrimeState, key: SparsePrimeState): f64 {
  // Quaternionic inner product
  const innerProd = query.inner(key);
  
  // Take the real part as the score (phase-coherent component)
  const score = innerProd.get(0);
  
  // Normalize by norms
  const qNorm = query.norm();
  const kNorm = key.norm();
  
  if (qNorm < 1e-10 || kNorm < 1e-10) return 0;
  
  return score / (qNorm * kNorm);
}

/**
 * Resonant attention mechanism
 * Computes attention weights based on resonance scores
 */
export function resonantAttention(
  query: SparsePrimeState,
  keys: Array<SparsePrimeState>,
  values: Array<SparsePrimeState>,
  temperature: f64 = 1.0
): SparsePrimeState {
  if (keys.length == 0 || keys.length != values.length) {
    return new SparsePrimeState();
  }
  
  // Compute resonance scores
  const scores = new Array<f64>(keys.length);
  let maxScore: f64 = -1e10;
  
  for (let i = 0; i < keys.length; i++) {
    scores[i] = resonanceScore(query, keys[i]) / temperature;
    if (scores[i] > maxScore) maxScore = scores[i];
  }
  
  // Softmax normalization
  let sumExp: f64 = 0;
  for (let i = 0; i < scores.length; i++) {
    scores[i] = Math.exp(scores[i] - maxScore);
    sumExp += scores[i];
  }
  
  // Weighted sum of values
  let result = new SparsePrimeState();
  for (let i = 0; i < values.length; i++) {
    const weight = scores[i] / sumExp;
    result = result.add(values[i].scale(weight));
  }
  
  return result.normalize();
}

/**
 * Multi-head resonant attention
 */
export function multiHeadResonantAttention(
  query: SparsePrimeState,
  keys: Array<SparsePrimeState>,
  values: Array<SparsePrimeState>,
  numHeads: i32 = 4,
  temperature: f64 = 1.0
): SparsePrimeState {
  if (numHeads <= 1) {
    return resonantAttention(query, keys, values, temperature);
  }
  
  // Each head uses a different phase rotation
  let combined = new SparsePrimeState();
  
  for (let h = 0; h < numHeads; h++) {
    const angle = 2.0 * Math.PI * <f64>h / <f64>numHeads;
    
    // Rotate query for this head
    const rotatedQuery = query.rotate(angle);
    
    // Compute attention
    const headResult = resonantAttention(rotatedQuery, keys, values, temperature);
    
    // Rotate back and accumulate
    combined = combined.add(headResult.rotate(-angle));
  }
  
  return combined.scale(1.0 / <f64>numHeads).normalize();
}

// ============================================================================
// PR-Graph Memory
// ============================================================================

/**
 * Memory entry with sparse state and metadata
 */
export class MemoryEntry {
  state: SparsePrimeState;
  timestamp: f64;
  accessCount: i32;
  decayFactor: f64;
  
  constructor(state: SparsePrimeState, timestamp: f64 = 0) {
    this.state = state;
    this.timestamp = timestamp;
    this.accessCount = 0;
    this.decayFactor = 1.0;
  }
  
  /**
   * Decay the entry over time
   */
  decay(rate: f64, currentTime: f64): void {
    const dt = currentTime - this.timestamp;
    this.decayFactor = Math.exp(-rate * dt);
  }
  
  /**
   * Get effective state with decay applied
   */
  effectiveState(): SparsePrimeState {
    return this.state.scale(this.decayFactor);
  }
}

/**
 * PR-Graph Memory: Hierarchical memory with phase-based retrieval
 * 
 * Uses prime resonance for content-addressable memory.
 */
export class PRGraphMemory implements Serializable {
  /** Memory entries indexed by id */
  private entries: Map<i32, MemoryEntry>;
  
  /** Next entry ID */
  private nextId: i32;
  
  /** Current virtual time */
  private currentTime: f64;
  
  /** Decay rate for temporal forgetting */
  decayRate: f64;
  
  /** Maximum entries (soft limit) */
  maxEntries: i32;
  
  constructor(maxEntries: i32 = 1000, decayRate: f64 = 0.01) {
    this.entries = new Map<i32, MemoryEntry>();
    this.nextId = 0;
    this.currentTime = 0;
    this.decayRate = decayRate;
    this.maxEntries = maxEntries;
  }
  
  // ============================================================================
  // Storage Operations
  // ============================================================================
  
  /**
   * Store a state in memory
   */
  put(state: SparsePrimeState): i32 {
    const id = this.nextId++;
    const entry = new MemoryEntry(state.clone(), this.currentTime);
    this.entries.set(id, entry);
    
    // Prune if over capacity
    if (this.entries.size > this.maxEntries) {
      this.prune();
    }
    
    return id;
  }
  
  /**
   * Retrieve by ID
   */
  getById(id: i32): SparsePrimeState | null {
    if (!this.entries.has(id)) return null;
    
    const entry = this.entries.get(id);
    entry.accessCount++;
    entry.timestamp = this.currentTime;
    
    return entry.effectiveState();
  }
  
  /**
   * Content-addressable retrieval via resonance
   */
  get(query: SparsePrimeState, k: i32 = 1): Array<RetrievalResult> {
    const results = new Array<RetrievalResult>();
    const ids = this.entries.keys();
    
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const entry = this.entries.get(id);
      entry.decay(this.decayRate, this.currentTime);
      
      const effState = entry.effectiveState();
      const score = resonanceScore(query, effState);
      
      results.push(new RetrievalResult(id, score, effState));
    }
    
    // Sort by score descending
    results.sort((a: RetrievalResult, b: RetrievalResult): i32 => {
      if (b.score > a.score) return 1;
      if (b.score < a.score) return -1;
      return 0;
    });
    
    // Return top k
    const topK = new Array<RetrievalResult>(Math.min(k, results.length) as i32);
    for (let i = 0; i < topK.length; i++) {
      topK[i] = results[i];
      
      // Update access stats
      if (this.entries.has(topK[i].id)) {
        const entry = this.entries.get(topK[i].id);
        entry.accessCount++;
        entry.timestamp = this.currentTime;
      }
    }
    
    return topK;
  }
  
  /**
   * Delete an entry
   */
  delete(id: i32): bool {
    if (this.entries.has(id)) {
      this.entries.delete(id);
      return true;
    }
    return false;
  }
  
  // ============================================================================
  // Time and Maintenance
  // ============================================================================
  
  /**
   * Advance virtual time
   */
  tick(dt: f64 = 1.0): void {
    this.currentTime += dt;
  }
  
  /**
   * Prune least useful entries
   */
  prune(): void {
    if (this.entries.size <= this.maxEntries) return;
    
    // Compute utility scores
    const utilities = new Array<PruneCandidate>();
    const ids = this.entries.keys();
    
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const entry = this.entries.get(id);
      entry.decay(this.decayRate, this.currentTime);
      
      // Utility = decay * (1 + log(accessCount + 1))
      const utility = entry.decayFactor * (1.0 + Math.log(<f64>(entry.accessCount + 1)));
      utilities.push(new PruneCandidate(id, utility));
    }
    
    // Sort by utility ascending (lowest first to remove)
    utilities.sort((a: PruneCandidate, b: PruneCandidate): i32 => {
      if (a.utility > b.utility) return 1;
      if (a.utility < b.utility) return -1;
      return 0;
    });
    
    // Remove lowest utility entries
    const toRemove = this.entries.size - this.maxEntries + this.maxEntries / 10; // Remove 10% extra
    for (let i = 0; i < toRemove && i < utilities.length; i++) {
      this.entries.delete(utilities[i].id);
    }
  }
  
  /**
   * Consolidate similar memories
   */
  consolidate(threshold: f64 = 0.95): i32 {
    let consolidated = 0;
    const ids = this.entries.keys();
    const toRemove = new Set<i32>();
    
    for (let i = 0; i < ids.length; i++) {
      const id1 = ids[i];
      if (toRemove.has(id1)) continue;
      
      const entry1 = this.entries.get(id1);
      
      for (let j = i + 1; j < ids.length; j++) {
        const id2 = ids[j];
        if (toRemove.has(id2)) continue;
        
        const entry2 = this.entries.get(id2);
        const similarity = resonanceScore(entry1.state, entry2.state);
        
        if (similarity > threshold) {
          // Merge into entry1
          entry1.state = entry1.state.add(entry2.state).normalize();
          entry1.accessCount += entry2.accessCount;
          toRemove.add(id2);
          consolidated++;
        }
      }
    }
    
    // Remove consolidated entries
    const removeArr = toRemove.values();
    for (let i = 0; i < removeArr.length; i++) {
      this.entries.delete(removeArr[i]);
    }
    
    return consolidated;
  }
  
  // ============================================================================
  // Query Operations
  // ============================================================================
  
  /**
   * Size of memory
   */
  size(): i32 {
    return this.entries.size;
  }
  
  /**
   * Get current time
   */
  time(): f64 {
    return this.currentTime;
  }
  
  // ============================================================================
  // Serialization
  // ============================================================================
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("size", <f64>this.size())
      .addNumberField("time", this.currentTime)
      .addNumberField("decayRate", this.decayRate)
      .addNumberField("maxEntries", <f64>this.maxEntries);
    builder.endObject();
    return builder.build();
  }
  
  toString(): string {
    return this.toJSON();
  }
}

// ============================================================================
// Helper Classes
// ============================================================================

export class RetrievalResult {
  id: i32;
  score: f64;
  state: SparsePrimeState;
  
  constructor(id: i32, score: f64, state: SparsePrimeState) {
    this.id = id;
    this.score = score;
    this.state = state;
  }
}

class PruneCandidate {
  id: i32;
  utility: f64;
  
  constructor(id: i32, utility: f64) {
    this.id = id;
    this.utility = utility;
  }
}

// ============================================================================
// Entropy-Driven Dynamics
// ============================================================================

/**
 * Evolution step snapshot
 */
export class EvolutionStep {
  time: f64;
  entropy: f64;
  norm: f64;
  
  constructor(time: f64, entropy: f64, norm: f64) {
    this.time = time;
    this.entropy = entropy;
    this.norm = norm;
  }
}

/**
 * Entropy-driven state evolution
 * Evolves a sparse state toward stable resonance configurations
 */
export class SparseEvolution {
  state: SparsePrimeState;
  lambda: f64;
  targetEntropy: f64;
  time: f64;
  history: Array<EvolutionStep>;
  
  constructor(
    initialState: SparsePrimeState,
    lambda: f64 = 0.1,
    targetEntropy: f64 = 1.0
  ) {
    this.state = initialState.clone();
    this.lambda = lambda;
    this.targetEntropy = targetEntropy;
    this.time = 0;
    this.history = new Array<EvolutionStep>();
  }
  
  /**
   * Single evolution step
   */
  step(dt: f64 = 0.01): SparsePrimeState {
    // Current entropy
    const S = this.state.entropy();
    
    // Entropy gradient drives evolution
    const entropyDiff = S - this.targetEntropy;
    
    // Apply phase evolution proportional to entropy difference
    const phaseShift = this.lambda * entropyDiff * dt;
    this.state = this.state.rotate(phaseShift);
    
    // Apply amplitude damping
    const damping = 1.0 - 0.5 * Math.abs(entropyDiff) * dt;
    this.state = this.state.scale(damping).normalize();
    
    // Record history
    this.time += dt;
    this.history.push(new EvolutionStep(this.time, S, this.state.norm()));
    
    return this.state;
  }
  
  /**
   * Evolve for multiple steps
   */
  evolve(steps: i32 = 100, dt: f64 = 0.01): SparsePrimeState {
    for (let i = 0; i < steps; i++) {
      this.step(dt);
    }
    return this.state;
  }
  
  /**
   * Evolve until entropy stabilizes
   */
  evolveUntilStable(maxSteps: i32 = 1000, tolerance: f64 = 0.001, dt: f64 = 0.01): EvolutionResult {
    let prevEntropy = this.state.entropy();
    
    for (let i = 0; i < maxSteps; i++) {
      this.step(dt);
      const currentEntropy = this.state.entropy();
      
      if (Math.abs(currentEntropy - prevEntropy) < tolerance) {
        return new EvolutionResult(
          this.state.clone(),
          i + 1,
          currentEntropy,
          true
        );
      }
      prevEntropy = currentEntropy;
    }
    
    return new EvolutionResult(
      this.state.clone(),
      maxSteps,
      this.state.entropy(),
      false
    );
  }
  
  /**
   * Get evolution history
   */
  getHistory(): Array<EvolutionStep> {
    return this.history;
  }
}

/**
 * Result of entropy-driven evolution
 */
export class EvolutionResult {
  state: SparsePrimeState;
  steps: i32;
  finalEntropy: f64;
  converged: bool;
  
  constructor(state: SparsePrimeState, steps: i32, finalEntropy: f64, converged: bool) {
    this.state = state;
    this.steps = steps;
    this.finalEntropy = finalEntropy;
    this.converged = converged;
  }
}