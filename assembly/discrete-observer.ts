
/**
 * Discrete Observer Implementation
 * 
 * Implements the full specification from discrete.pdf including:
 * - Prime-indexed oscillators with MODULAR phase dynamics (Section 3.2)
 * - Discrete coupling: Couple_p(t) = ⌊(K/|N(p)|) · Σ sin_M[(φ_q - φ_p) mod M]⌋
 * - Histogram-based coherence (C_bin) and windowed stability (Var_C)
 * - Auxiliary weight registers (w_p) for Hebbian learning
 * - Endogenous time via coherence-triggered ticks
 * - Sedenion Memory Field (SMF) with composition vectors
 * 
 * This replaces the continuous Kuramoto model in physics.ts with
 * the discrete modular formalism specified in the paper.
 */

import { JSONBuilder } from './core/serialization';

// ============================================================================
// Configuration (matches discrete.pdf Section 3.2)
// ============================================================================

export class DiscreteObserverConfig {
  // Phase space modulus (discrete phase resolution)
  M: i32 = 1000;
  
  // Phase increment formula: ∆_p ≡ (c*p + d) mod M
  c: i32 = 1;
  d: i32 = 3;
  
  // Coupling strength K
  K: i32 = 50;
  
  // Integer trig scale factor
  scale: i32 = 100;
  
  // Amplitude parameters
  A_max: f64 = 100.0;
  delta: f64 = 0.2;  // decay per step (STANDARD - keep for learning)
  
  // Coherence bins (B) - REDUCED for coarser binning, easier coherence
  B: i32 = 12;
  
  // Stability window (H) - SHORTER for faster response
  H: i32 = 15;
  
  // Tick thresholds (Section 5.4) - RELAXED for easier ticks during learning
  C_th: f64 = 0.15;      // coherence threshold (REDUCED - easier ticks)
  epsilon_C: f64 = 0.15; // dC threshold for stability (RELAXED)
  tau_Var: f64 = 0.15;   // variance threshold (RELAXED)
  
  // Lockup detection (Section 6.2) - RELAXED to preserve learning
  C_lock: f64 = 0.9;
  dC_lock: f64 = 0.001;
  tunnelCooldown: i32 = 100;
  
  // Entropy bounds (Section 6.3)
  entropyFloor: f64 = 0.5;
  entropyCeiling: f64 = 2.5;
  
  // Coupling graph bounds - INCREASED for stronger learning
  J_max: i32 = 15;
  
  // Auxiliary weight bounds
  W_max: i32 = 100;
  
  // SMF normalization bound
  L: i32 = 100;
  
  // Learning parameters (NEW - matches JS version)
  learningRate: f64 = 0.5;           // Hebbian learning rate
  learnedCouplingWeight: f64 = 1.5;  // Weight for learned coupling vs base coupling
  learningThreshold: f64 = 0.15;     // Lower threshold for learning (15% of A_max)
  
  // Anti-lockup parameters (RELAXED to preserve learning)
  lockupDetectionWindow: i32 = 15;   // How many ticks to detect repeating pattern
  perturbationStrength: f64 = 0.4;   // How much to perturb phases when stuck
  maxTotalEnergy: f64 = 800.0;       // Maximum total energy cap (8 * A_max)
  targetMaxActive: i32 = 7;          // Target max active primes for stabilization
}

export const DISCRETE_CONFIG: DiscreteObserverConfig = new DiscreteObserverConfig();

// ============================================================================
// Default Primes (first 21 primes for Enochian compatibility)
// ============================================================================

export const DEFAULT_PRIMES: i32[] = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
  31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73
];

// Enochian sacred primes (7 primes per paper10)
export const ENOCHIAN_PRIMES: i32[] = [7, 11, 13, 17, 19, 23, 29];

// ============================================================================
// Integer Trig Tables (precomputed for determinism)
// ============================================================================

let _sinM: Int32Array = new Int32Array(0);
let _cosM: Int32Array = new Int32Array(0);

function ensureTrigTables(): void {
  if (_sinM.length > 0) return;
  
  const M = DISCRETE_CONFIG.M;
  _sinM = new Int32Array(M);
  _cosM = new Int32Array(M);
  
  const twoPi = 2.0 * Math.PI;
  for (let i: i32 = 0; i < M; i++) {
    const angle = twoPi * f64(i) / f64(M);
    _sinM[i] = i32(Math.round(f64(DISCRETE_CONFIG.scale) * Math.sin(angle)));
    _cosM[i] = i32(Math.round(f64(DISCRETE_CONFIG.scale) * Math.cos(angle)));
  }
}

// ============================================================================
// Discrete Observer State
// ============================================================================

export class DiscreteObserverState {
  // Oscillator registers (n oscillators)
  phi: Int32Array;   // phases (modular integers)
  A: Float64Array;   // amplitudes
  w: Int32Array;     // auxiliary weights
  
  // Coupling graph (n x n) - base coupling
  J: Int8Array;
  
  // Learned coupling weights (n x n) - additive to base J (NEW)
  learnedJ: Float32Array;
  
  // SMF state (16D sedenion memory field)
  s: Int32Array;
  
  // Configuration
  n: i32;
  primes: Int32Array;
  
  // Coherence history
  cohHist: Float64Array;
  cohHistIdx: i32;
  
  // Phase bins for histogram coherence
  phaseBins: Int32Array;
  coarseBins: Int32Array;
  
  // Time counters
  t: i64;
  tickCount: i64;
  
  // Metrics
  lastCoherence: f64;
  lastSmfEntropy: f64;
  lastHqeEntropy: f64;
  
  // Lockup detection
  lockupCounter: i32;
  tunnelCooldownRemaining: i32;
  watchdogNoveltyWindow: Float64Array;
  watchdogIdx: i32;
  watchdogDwellTime: i32;
  
  // Active oscillators from last tick
  lastActive: Int32Array;
  lastActiveCount: i32;
  
  // Anti-lockup pattern tracking (NEW)
  lastActiveSignature: string;
  stuckCounter: i32;
  
  constructor(primes: Int32Array | null = null) {
    ensureTrigTables();
    
    // Determine n first
    let n: i32;
    if (primes == null) {
      n = DEFAULT_PRIMES.length;
    } else {
      n = primes.length;
    }
    this.n = n;
    
    // Initialize ALL typed arrays BEFORE any use of this.n
    this.primes = new Int32Array(n);
    this.phi = new Int32Array(n);
    this.A = new Float64Array(n);
    this.w = new Int32Array(n);
    this.J = new Int8Array(n * n);
    this.learnedJ = new Float32Array(n * n);  // NEW: learned coupling weights
    this.s = new Int32Array(16);
    this.cohHist = new Float64Array(DISCRETE_CONFIG.H);
    this.phaseBins = new Int32Array(DISCRETE_CONFIG.M);
    this.coarseBins = new Int32Array(DISCRETE_CONFIG.B);
    this.watchdogNoveltyWindow = new Float64Array(DISCRETE_CONFIG.H);
    this.lastActive = new Int32Array(n);
    
    // Initialize scalar fields
    this.cohHistIdx = 0;
    this.t = 0;
    this.tickCount = 0;
    this.lastCoherence = 0.0;
    this.lastSmfEntropy = 0.0;
    this.lastHqeEntropy = 0.0;
    this.lockupCounter = 0;
    this.tunnelCooldownRemaining = 0;
    this.watchdogIdx = 0;
    this.watchdogDwellTime = 0;
    this.lastActiveCount = 0;
    this.lastActiveSignature = "";  // NEW
    this.stuckCounter = 0;          // NEW
    
    // Now populate primes
    if (primes == null) {
      for (let i: i32 = 0; i < n; i++) {
        this.primes[i] = DEFAULT_PRIMES[i];
      }
    } else {
      for (let i: i32 = 0; i < n; i++) {
        this.primes[i] = primes[i];
      }
    }
    
    // Initialize oscillator values with sparse active set (first 4 active)
    for (let i: i32 = 0; i < n; i++) {
      // Random initial phase
      this.phi[i] = i32(Math.floor(Math.random() * 300.0));
      
      if (i < 4) {
        this.A[i] = DISCRETE_CONFIG.A_max * 0.6;
      } else {
        this.A[i] = DISCRETE_CONFIG.A_max * 0.2;
      }
      this.w[i] = 0;
    }
    
    // Initialize coupling graph (default all 1)
    for (let i: i32 = 0; i < this.J.length; i++) {
      this.J[i] = 1;
    }
    
    // Initialize SMF (16 axes)
    for (let k: i32 = 0; k < 16; k++) {
      this.s[k] = (k % 5 - 2) * 10;
    }
  }
}

// ============================================================================
// Core Computation Functions
// ============================================================================

/**
 * Compute discrete coupling term for oscillator i
 * Now includes learned coupling weights for Hebbian learning
 * Couple_p(t) = ⌊(K/|N(p)|) · Σ_q∈N(p) (J_pq + learnedJ_pq * weight) · sin_M[(φ_q - φ_p) mod M]⌋
 */
export function computeDiscreteCoupling(
  state: DiscreteObserverState,
  i: i32
): i32 {
  const M = DISCRETE_CONFIG.M;
  const K = DISCRETE_CONFIG.K;
  const scale = DISCRETE_CONFIG.scale;
  const A_max = DISCRETE_CONFIG.A_max;
  const learnedWeight = DISCRETE_CONFIG.learnedCouplingWeight;
  
  let sum: f64 = 0.0;
  let neighborCount: i32 = 0;
  
  for (let j: i32 = 0; j < state.n; j++) {
    if (i == j) continue;
    
    const idx = i * state.n + j;
    const baseWeight = f64(state.J[idx]);
    const learnedBias = f64(state.learnedJ[idx]) * learnedWeight;
    const effectiveWeight = baseWeight + learnedBias;
    
    if (effectiveWeight != 0.0) {
      neighborCount++;
      
      // Phase difference (modular)
      const diff = (state.phi[j] - state.phi[i] + M) % M;
      
      // Amplitude weighting
      const ampWeight = state.A[j] / A_max;
      
      // Discrete sine coupling with learned weights
      sum += effectiveWeight * f64(_sinM[diff]) * ampWeight;
    }
  }
  
  if (neighborCount == 0) return 0;
  
  // Floor division per spec
  return i32(Math.floor((f64(K) * sum) / (f64(neighborCount) * f64(scale))));
}

/**
 * Compute histogram-based coherence (C_bin)
 * C_bin = max_b(histogram[b]) / n
 */
export function computeHistogramCoherence(state: DiscreteObserverState): f64 {
  const M = DISCRETE_CONFIG.M;
  const B = DISCRETE_CONFIG.B;
  const binSize = M / B;
  
  // Reset bins
  for (let i: i32 = 0; i < B; i++) {
    state.coarseBins[i] = 0;
  }
  
  // Fill coarse bins
  for (let i: i32 = 0; i < state.n; i++) {
    let bin = state.phi[i] / binSize;
    if (bin >= B) bin = B - 1;
    state.coarseBins[bin]++;
  }
  
  // Find max bin
  let maxBin: i32 = 0;
  for (let k: i32 = 0; k < B; k++) {
    if (state.coarseBins[k] > maxBin) {
      maxBin = state.coarseBins[k];
    }
  }
  
  return f64(maxBin) / f64(state.n);
}

/**
 * Compute windowed stability (Var_C)
 */
export function computeWindowedStability(state: DiscreteObserverState): f64 {
  let count: i32 = 0;
  let sum: f64 = 0.0;
  
  for (let i: i32 = 0; i < DISCRETE_CONFIG.H; i++) {
    if (state.cohHist[i] > 0.0) {
      sum += state.cohHist[i];
      count++;
    }
  }
  
  if (count < 2) return 0.0;
  
  const mean = sum / f64(count);
  let variance: f64 = 0.0;
  
  for (let i: i32 = 0; i < DISCRETE_CONFIG.H; i++) {
    if (state.cohHist[i] > 0.0) {
      const diff = state.cohHist[i] - mean;
      variance += diff * diff;
    }
  }
  
  return variance / f64(count);
}

/**
 * Get active oscillator indices (amplitude > A_max/2)
 */
export function getActiveIndices(state: DiscreteObserverState): Int32Array {
  const threshold = DISCRETE_CONFIG.A_max / 2.0;
  let count: i32 = 0;
  
  for (let i: i32 = 0; i < state.n; i++) {
    if (state.A[i] > threshold) {
      state.lastActive[count] = i;
      count++;
    }
  }
  
  state.lastActiveCount = count;
  
  // Return trimmed array
  const result = new Int32Array(count);
  for (let i: i32 = 0; i < count; i++) {
    result[i] = state.lastActive[i];
  }
  return result;
}

/**
 * Get active oscillator indices for learning (lower threshold)
 * Uses learningThreshold (15% of A_max) so learning can occur
 * even when oscillators are decaying after a boost
 */
export function getActiveIndicesForLearning(state: DiscreteObserverState): Int32Array {
  const threshold = DISCRETE_CONFIG.A_max * DISCRETE_CONFIG.learningThreshold;
  let count: i32 = 0;
  
  // Use temporary array for learning-specific indices
  const tempActive = new Int32Array(state.n);
  
  for (let i: i32 = 0; i < state.n; i++) {
    if (state.A[i] > threshold) {
      tempActive[count] = i;
      count++;
    }
  }
  
  // Return trimmed array
  const result = new Int32Array(count);
  for (let i: i32 = 0; i < count; i++) {
    result[i] = tempActive[i];
  }
  return result;
}

/**
 * Map prime to SMF axis (Section 4.3)
 */
export function primeToSMFAxis(prime: i32): i32 {
  // Use prime mod 16 for axis mapping
  // Special cases for Enochian primes
  if (prime == 2) return 0;  // coherence
  if (prime == 3) return 1;  // identity
  if (prime == 5) return 3;  // structure
  if (prime == 7) return 6;  // harmony (Enochian)
  if (prime == 11) return 10; // truth (Enochian)
  if (prime == 13) return 12; // power (Enochian)
  return prime % 16;
}

/**
 * Compute composition vector Comp(u, v) for SMF update
 */
export function compositionVector(u: i32, v: i32): Int8Array {
  const comp = new Int8Array(16);
  const seed = u * 17 + v * 31;
  
  for (let i: i32 = 0; i < 16; i++) {
    const val = ((seed * (i + 1) * 7) % 5) - 2;
    comp[i] = i8(val > 0 ? 1 : (val < 0 ? -1 : 0));
  }
  
  return comp;
}

/**
 * Normalize SMF to bounded norm
 */
export function normalizeSMF(state: DiscreteObserverState): void {
  const L = DISCRETE_CONFIG.L;
  let normSq: i64 = 0;
  
  for (let k: i32 = 0; k < 16; k++) {
    normSq += i64(state.s[k]) * i64(state.s[k]);
  }
  
  const norm = Math.sqrt(f64(normSq));
  
  if (norm > f64(L)) {
    const scale = f64(L) / norm;
    for (let k: i32 = 0; k < 16; k++) {
      state.s[k] = i32(Math.round(f64(state.s[k]) * scale));
      if (state.s[k] > L) state.s[k] = L;
      if (state.s[k] < -L) state.s[k] = -L;
    }
  }
}

/**
 * Compute SMF entropy
 */
export function computeSmfEntropy(state: DiscreteObserverState): f64 {
  let absSum: f64 = 0.0;
  for (let k: i32 = 0; k < 16; k++) {
    absSum += Math.abs(f64(state.s[k]));
  }
  
  if (absSum < 0.001) return 0.0;
  
  let entropy: f64 = 0.0;
  for (let k: i32 = 0; k < 16; k++) {
    const pi_k = Math.abs(f64(state.s[k])) / absSum;
    if (pi_k > 0.0001) {
      entropy -= pi_k * Math.log(pi_k);
    }
  }
  
  return entropy;
}

/**
 * Update SMF with composition vectors from active chord
 */
export function updateSMF(state: DiscreteObserverState, activeIndices: Int32Array): void {
  if (activeIndices.length < 2) return;
  
  const L = DISCRETE_CONFIG.L;
  
  // Map active primes to SMF axes
  const axes = new Int32Array(activeIndices.length);
  for (let i: i32 = 0; i < activeIndices.length; i++) {
    axes[i] = primeToSMFAxis(state.primes[activeIndices[i]]);
  }
  
  // Apply pairwise composition vectors
  for (let i: i32 = 0; i < axes.length - 1; i++) {
    const u = axes[i];
    const v = axes[i + 1];
    const comp = compositionVector(u, v);
    
    for (let k: i32 = 0; k < 16; k++) {
      state.s[k] = state.s[k] + i32(comp[k]);
      if (state.s[k] > L) state.s[k] = L;
      if (state.s[k] < -L) state.s[k] = -L;
    }
  }
  
  normalizeSMF(state);
}

/**
 * Apply Hebbian learning on coupling graph
 * Now updates both base J and learned coupling weights
 * Uses amplitude-weighted learning for stronger patterns
 */
export function applyHebbianLearning(
  state: DiscreteObserverState,
  activeIndices: Int32Array
): bool {
  const J_max = i8(DISCRETE_CONFIG.J_max);
  const eta = DISCRETE_CONFIG.learningRate;
  const A_max = DISCRETE_CONFIG.A_max;
  let updated = false;
  
  // Update base coupling (original behavior)
  for (let ai: i32 = 0; ai < activeIndices.length; ai++) {
    const i = activeIndices[ai];
    for (let aj: i32 = 0; aj < activeIndices.length; aj++) {
      const j = activeIndices[aj];
      if (i == j) continue;
      
      const idx = i * state.n + j;
      if (state.J[idx] < J_max) {
        state.J[idx] = state.J[idx] + 1;
        updated = true;
      }
    }
  }
  
  // Update learned coupling weights (NEW - amplitude-weighted Hebbian learning)
  for (let ai: i32 = 0; ai < activeIndices.length; ai++) {
    const i = activeIndices[ai];
    const amp_i = state.A[i] / A_max;
    
    for (let aj: i32 = ai + 1; aj < activeIndices.length; aj++) {
      const j = activeIndices[aj];
      const amp_j = state.A[j] / A_max;
      
      // Both oscillators are active - strengthen connection
      const delta = f32(eta * amp_i * amp_j);
      const idx_ij = i * state.n + j;
      const idx_ji = j * state.n + i;
      
      // Update symmetric learned coupling (bounded to 5.0)
      state.learnedJ[idx_ij] = f32(Math.min(5.0, f64(state.learnedJ[idx_ij]) + f64(delta)));
      state.learnedJ[idx_ji] = f32(Math.min(5.0, f64(state.learnedJ[idx_ji]) + f64(delta)));
      updated = true;
    }
  }
  
  // Update auxiliary weights for active oscillators
  const W_max = DISCRETE_CONFIG.W_max;
  for (let ai: i32 = 0; ai < activeIndices.length; ai++) {
    const i = activeIndices[ai];
    if (state.w[i] < W_max) {
      state.w[i] = state.w[i] + 1;
    }
  }
  
  return updated;
}

/**
 * Decay learned coupling weights (gentle decay to preserve patterns)
 */
export function decayLearnedCoupling(state: DiscreteObserverState, rate: f64 = 0.999): void {
  for (let i: i32 = 0; i < state.learnedJ.length; i++) {
    state.learnedJ[i] = f32(f64(state.learnedJ[i]) * rate);
  }
}

/**
 * Get learned coupling weight between two oscillators
 */
export function getLearnedCoupling(state: DiscreteObserverState, i: i32, j: i32): f32 {
  if (i < 0 || i >= state.n || j < 0 || j >= state.n) return 0.0;
  return state.learnedJ[i * state.n + j];
}

/**
 * Get total learned coupling strength (sum of all positive weights)
 */
export function getLearnedCouplingStrength(state: DiscreteObserverState): f64 {
  let total: f64 = 0.0;
  for (let i: i32 = 0; i < state.learnedJ.length; i++) {
    if (state.learnedJ[i] > 0.0) {
      total += f64(state.learnedJ[i]);
    }
  }
  // Normalize by dividing by max possible (n*n*5)
  const maxPossible = f64(state.n * state.n) * 5.0;
  return total / maxPossible;
}

/**
 * Detect lockup condition
 */
export function detectLockup(state: DiscreteObserverState, dC: f64): bool {
  const highCoherence = state.lastCoherence >= DISCRETE_CONFIG.C_lock;
  
  // Track novelty in window
  state.watchdogNoveltyWindow[state.watchdogIdx] = dC;
  state.watchdogIdx = (state.watchdogIdx + 1) % DISCRETE_CONFIG.H;
  
  // Compute mean dC
  let meanDC: f64 = 0.0;
  for (let i: i32 = 0; i < DISCRETE_CONFIG.H; i++) {
    meanDC += state.watchdogNoveltyWindow[i];
  }
  meanDC /= f64(DISCRETE_CONFIG.H);
  
  const lowNovelty = meanDC <= DISCRETE_CONFIG.dC_lock;
  
  if (highCoherence && lowNovelty) {
    state.lockupCounter++;
  } else {
    if (state.lockupCounter > 0) state.lockupCounter--;
  }
  
  return state.lockupCounter >= 5;
}

/**
 * Apply controlled tunneling to break lockup
 * GENTLER approach to preserve learned patterns
 */
export function applyControlledTunneling(state: DiscreteObserverState): void {
  const M = DISCRETE_CONFIG.M;
  const L = DISCRETE_CONFIG.L;
  const perturbStrength = DISCRETE_CONFIG.perturbationStrength;
  
  // Perturb SMF (gentle)
  for (let k: i32 = 0; k < 16; k++) {
    const eta = i32(Math.floor(Math.random() * 5.0)) - 2;
    state.s[k] = state.s[k] + eta;
    if (state.s[k] > L) state.s[k] = L;
    if (state.s[k] < -L) state.s[k] = -L;
  }
  
  normalizeSMF(state);
  
  // Count active oscillators
  const A_max = DISCRETE_CONFIG.A_max;
  let activeCount: i32 = 0;
  for (let i: i32 = 0; i < state.n; i++) {
    if (state.A[i] > A_max / 2.0) {
      activeCount++;
    }
  }
  
  // GENTLER: Only dampen if we have way too many active
  if (activeCount > 6) {
    for (let i: i32 = 0; i < state.n; i++) {
      if (state.A[i] > A_max / 2.0 && Math.random() < 0.3) {
        state.A[i] *= 0.5;  // Moderate damping
      }
    }
  }
  
  // Smaller phase shifts to avoid disrupting coherent clusters
  for (let i: i32 = 0; i < state.n; i++) {
    if (Math.random() < perturbStrength * 0.5) {
      const direction: i32 = (i % 2 == 0) ? 1 : -1;
      const shift = i32(Math.floor(Math.random() * f64(M / 6))) * direction;
      state.phi[i] = (state.phi[i] + shift + M) % M;
    }
  }
  
  // IMPORTANT: Very gentle decay of learned coupling (0.995 = 0.5% decay)
  // This preserves learned patterns while still allowing escape from lockup
  decayLearnedCoupling(state, 0.995);
  
  state.lockupCounter = 0;
  state.stuckCounter = 0;
}

// ============================================================================
// Main Step Function
// ============================================================================

export class DiscreteStepResult {
  coherence: f64;
  dC: f64;
  Var_C: f64;
  tick: bool;
  locked: bool;
  activeCount: i32;
  
  constructor(
    coherence: f64,
    dC: f64,
    Var_C: f64,
    tick: bool,
    locked: bool,
    activeCount: i32
  ) {
    this.coherence = coherence;
    this.dC = dC;
    this.Var_C = Var_C;
    this.tick = tick;
    this.locked = locked;
    this.activeCount = activeCount;
  }
}

/**
 * Main discrete step function
 * Implements full discrete.pdf specification
 */
export function discreteStep(
  state: DiscreteObserverState,
  driveInput: Float64Array | null = null,
  plasticity: bool = false
): DiscreteStepResult {
  const M = DISCRETE_CONFIG.M;
  const B = DISCRETE_CONFIG.B;
  const A_max = DISCRETE_CONFIG.A_max;
  const delta = DISCRETE_CONFIG.delta;
  const c = DISCRETE_CONFIG.c;
  const d = DISCRETE_CONFIG.d;
  const W_max = DISCRETE_CONFIG.W_max;
  
  state.t++;
  
  if (state.tunnelCooldownRemaining > 0) {
    state.tunnelCooldownRemaining--;
  }
  
  // ========================================
  // Phase 1: Update oscillators
  // ========================================
  
  const nextPhi = new Int32Array(state.n);
  const binSize = M / B;
  const binCounts = new Int32Array(B);
  const oscillatorBins = new Int32Array(state.n);
  
  // Compute bin memberships
  for (let i: i32 = 0; i < state.n; i++) {
    let bin = state.phi[i] / binSize;
    if (bin >= B) bin = B - 1;
    oscillatorBins[i] = bin;
    binCounts[bin]++;
  }
  
  // Find dominant bin
  let maxBinCount: i32 = 0;
  let dominantBin: i32 = 0;
  for (let b: i32 = 0; b < B; b++) {
    if (binCounts[b] > maxBinCount) {
      maxBinCount = binCounts[b];
      dominantBin = b;
    }
  }
  
  // Update each oscillator
  for (let i: i32 = 0; i < state.n; i++) {
    const p = state.primes[i];
    
    // Discrete phase increment: ∆_p ≡ (c * ln(p) * 10 + d) mod M
    // Using log-scaled version for better frequency distribution
    const logP = Math.log(f64(p));
    const delta_p = (i32(Math.floor(f64(c) * logP * 10.0)) + d) % M;
    
    // Discrete coupling term
    const coupling = computeDiscreteCoupling(state, i);
    
    // Update phase (modular)
    nextPhi[i] = (state.phi[i] + delta_p + coupling + M) % M;
    
    // Compute coherence bonus based on bin membership
    const myBin = oscillatorBins[i];
    const inDominantBin = myBin == dominantBin;
    const samePhaseCount = binCounts[myBin];
    
    let coherenceBonus: f64 = 0.0;
    if (inDominantBin) {
      if (samePhaseCount >= 7) {
        coherenceBonus = 2.5;
      } else if (samePhaseCount >= 5) {
        coherenceBonus = 2.0;
      } else if (samePhaseCount >= 3) {
        coherenceBonus = 1.5;
      } else if (samePhaseCount >= 2) {
        coherenceBonus = 0.8;
      }
    }
    
    // External drive
    let drive: f64 = 0.0;
    if (driveInput != null && i < driveInput.length) {
      drive = driveInput[i];
    }
    
    // Update amplitude with decay, coherence bonus, and drive
    state.A[i] = state.A[i] - delta + coherenceBonus + drive;
    if (state.A[i] < 0.0) state.A[i] = 0.0;
    if (state.A[i] > A_max) state.A[i] = A_max;
    
    // Update auxiliary weight based on amplitude
    if (state.A[i] > A_max / 2.0) {
      if (state.w[i] < W_max) state.w[i]++;
    } else {
      if (state.w[i] > -W_max) state.w[i]--;
    }
  }
  
  // Commit phase updates
  for (let i: i32 = 0; i < state.n; i++) {
    state.phi[i] = nextPhi[i];
  }
  
  // ========================================
  // Phase 2: Compute coherence metrics
  // ========================================
  
  const C_bin = computeHistogramCoherence(state);
  
  // Track in history
  const prevCoherence = state.lastCoherence;
  state.cohHist[state.cohHistIdx] = C_bin;
  state.cohHistIdx = (state.cohHistIdx + 1) % DISCRETE_CONFIG.H;
  state.lastCoherence = C_bin;
  
  const dC = Math.abs(C_bin - prevCoherence);
  const Var_C = computeWindowedStability(state);
  
  // ========================================
  // Phase 3: Learning (uses lower threshold for better learning)
  // ========================================
  
  if (plasticity) {
    // Use lower threshold for learning so it can occur even when oscillators are decaying
    const activeForLearning = getActiveIndicesForLearning(state);
    if (activeForLearning.length >= 2) {
      applyHebbianLearning(state, activeForLearning);
    }
  }
  
  // ========================================
  // Phase 4: Check tick condition
  // ========================================
  
  const tick = C_bin >= DISCRETE_CONFIG.C_th &&
               dC <= DISCRETE_CONFIG.epsilon_C &&
               Var_C <= DISCRETE_CONFIG.tau_Var;
  
  if (tick) {
    state.tickCount++;
    
    const activeIndices = getActiveIndices(state);
    
    // Update SMF with composition vectors
    updateSMF(state, activeIndices);
    
    // Check for lockup
    const locked = detectLockup(state, dC);
    if (locked && state.tunnelCooldownRemaining == 0) {
      applyControlledTunneling(state);
      state.tunnelCooldownRemaining = DISCRETE_CONFIG.tunnelCooldown;
    }
    
    // Update entropy metrics
    state.lastSmfEntropy = computeSmfEntropy(state);
    
    return new DiscreteStepResult(C_bin, dC, Var_C, true, locked, activeIndices.length);
  }
  
  return new DiscreteStepResult(C_bin, dC, Var_C, false, false, 0);
}

// ============================================================================
// Boost/Control Functions
// ============================================================================

/**
 * Dampen all amplitudes
 */
export function dampenAll(state: DiscreteObserverState): void {
  for (let i: i32 = 0; i < state.n; i++) {
    state.A[i] *= 0.3;
  }
}

/**
 * Randomize coupling graph
 */
export function randomizeCoupling(state: DiscreteObserverState): void {
  for (let i: i32 = 0; i < state.J.length; i++) {
    state.J[i] = i8(i32(Math.floor(Math.random() * 10.0)) - 5);
  }
}

/**
 * Reset coupling graph to default
 */
export function resetCoupling(state: DiscreteObserverState): void {
  for (let i: i32 = 0; i < state.J.length; i++) {
    state.J[i] = 1;
  }
}

/**
 * Get state metrics
 */
export function getStateMetrics(state: DiscreteObserverState): Float64Array {
  const metrics = new Float64Array(8);
  metrics[0] = state.lastCoherence;
  metrics[1] = computeWindowedStability(state);
  metrics[2] = state.lastSmfEntropy;
  metrics[3] = f64(state.tickCount);
  metrics[4] = f64(state.lockupCounter);
  metrics[5] = f64(state.t);
  metrics[6] = f64(state.lastActiveCount);
  metrics[7] = state.lastHqeEntropy;
  return metrics;
}

/**
 * Get phases array
 */
export function getPhases(state: DiscreteObserverState): Int32Array {
  return state.phi;
}

/**
 * Get amplitudes array
 */
export function getAmplitudes(state: DiscreteObserverState): Float64Array {
  return state.A;
}

/**
 * Get SMF state
 */
export function getSMF(state: DiscreteObserverState): Int32Array {
  return state.s;
}

/**
 * Get auxiliary weights
 */
export function getWeights(state: DiscreteObserverState): Int32Array {
  return state.w;
}

/**
 * Check if locked up
 */
export function isLockedUp(state: DiscreteObserverState): bool {
  return state.lockupCounter >= 5;
}

// ============================================================================
// WASM Export Functions (Global state management)
// ============================================================================

let _globalState: DiscreteObserverState = new DiscreteObserverState(null);

/**
 * Create a new discrete observer with given primes
 */
export function createDiscreteObserver(numPrimes: i32): void {
  if (numPrimes <= 0) {
    _globalState = new DiscreteObserverState(null);
    return;
  }
  
  const primes = new Int32Array(numPrimes);
  let candidate: i32 = 2;
  let count: i32 = 0;
  
  while (count < numPrimes) {
    if (isPrime(candidate)) {
      primes[count] = candidate;
      count++;
    }
    candidate++;
  }
  
  _globalState = new DiscreteObserverState(primes);
}

function isPrime(n: i32): bool {
  if (n < 2) return false;
  if (n == 2) return true;
  if (n % 2 == 0) return false;
  const limit = i32(Math.sqrt(f64(n))) + 1;
  for (let i: i32 = 3; i <= limit; i += 2) {
    if (n % i == 0) return false;
  }
  return true;
}

/**
 * Execute a step
 */
export function discreteObserverStep(plasticity: i32): i32 {
  const result = discreteStep(_globalState, null, plasticity != 0);
  return result.tick ? 1 : 0;
}

/**
 * Boost an oscillator by index
 */
export function discreteObserverBoost(index: i32): void {
  boostIndex(_globalState, index);
}

/**
 * Get coherence
 */
export function discreteObserverGetCoherence(): f64 {
  return _globalState.lastCoherence;
}

/**
 * Get phase of oscillator
 */
export function discreteObserverGetPhase(index: i32): i32 {
  if (index >= 0 && index < _globalState.n) {
    return _globalState.phi[index];
  }
  return 0;
}

/**
 * Get amplitude of oscillator
 */
export function discreteObserverGetAmplitude(index: i32): f64 {
  if (index >= 0 && index < _globalState.n) {
    return _globalState.A[index];
  }
  return 0.0;
}

/**
 * Get SMF axis
 */
export function discreteObserverGetSMFAxis(index: i32): i32 {
  if (index >= 0 && index < 16) {
    return _globalState.s[index];
  }
  return 0;
}

/**
 * Get tick count
 */
export function discreteObserverGetTickCount(): i64 {
  return _globalState.tickCount;
}

/**
 * Get entropy
 */
export function discreteObserverGetEntropy(): f64 {
  return computeSmfEntropy(_globalState);
}

/**
 * Reset the observer
 */
export function discreteObserverReset(): void {
  _globalState = new DiscreteObserverState(null);
}

/**
 * Get number of oscillators
 */
export function discreteObserverGetCount(): i32 {
  return _globalState.n;
}

/**
 * Get state as JSON
 */
export function discreteObserverGetState(): string {
  const builder = new JSONBuilder();
  builder.startObject()
    .addNumberField("coherence", _globalState.lastCoherence)
    .addNumberField("entropy", computeSmfEntropy(_globalState))
    .addNumberField("tickCount", f64(_globalState.tickCount))
    .addNumberField("t", f64(_globalState.t))
    .addNumberField("lockupCounter", f64(_globalState.lockupCounter))
    .addBooleanField("locked", isLockedUp(_globalState))
    .addNumberField("activeCount", f64(_globalState.lastActiveCount))
    .addNumberField("learnedCouplingStrength", getLearnedCouplingStrength(_globalState));
  
  // Add SMF axes
  let smfJson = "[";
  for (let i: i32 = 0; i < 16; i++) {
    if (i > 0) smfJson += ",";
    smfJson += _globalState.s[i].toString();
  }
  smfJson += "]";
  builder.addRawField("smf", smfJson);
  
  builder.endObject();
  return builder.build();
}

/**
 * Get learned coupling strength (WASM export)
 */
export function discreteObserverGetLearnedCouplingStrength(): f64 {
  return getLearnedCouplingStrength(_globalState);
}

/**
 * Get learned coupling between two oscillators (WASM export)
 */
export function discreteObserverGetLearnedCoupling(i: i32, j: i32): f32 {
  return getLearnedCoupling(_globalState, i, j);
}

/**
 * Apply Hebbian learning manually (WASM export)
 */
export function discreteObserverApplyHebbianLearning(): bool {
  const activeForLearning = getActiveIndicesForLearning(_globalState);
  if (activeForLearning.length >= 2) {
    return applyHebbianLearning(_globalState, activeForLearning);
  }
  return false;
}

/**
 * Decay learned coupling (WASM export)
 */
export function discreteObserverDecayLearnedCoupling(rate: f64): void {
  decayLearnedCoupling(_globalState, rate);
}

/**
 * Boost a specific prime's amplitude
 */
export function boostPrime(state: DiscreteObserverState, prime: i32): void {
  for (let i: i32 = 0; i < state.n; i++) {
    if (state.primes[i] == prime) {
      state.A[i] = Math.min(DISCRETE_CONFIG.A_max, state.A[i] + 50.0);
      return;
    }
  }
}

/**
 * Boost by index
 */
export function boostIndex(state: DiscreteObserverState, index: i32): void {
  if (index >= 0 && index < state.n) {
    state.A[index] = Math.min(DISCRETE_CONFIG.A_max, state.A[index] + 50.0);
  }
}