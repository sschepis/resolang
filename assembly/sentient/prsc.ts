/**
 * Prime Resonance Semantic Computation (PRSC) Layer
 * 
 * Implements oscillator physics as the runtime carrier for semantic
 * interference and coherence. From "A Design for a Sentient Observer"
 * paper, Section 3.2.
 * 
 * Key features:
 * - Prime-indexed oscillators with frequency f(p) = 1 + ln(p)/10 (equation 2)
 * - Phase evolution with damping (equation 3)
 * - Kuramoto-style coupling for synchronization (equation 4)
 * - Global and graph-based coherence metrics (equations 5-6)
 * - Entanglement detection (equations 16-17)
 * - Semantic state extraction
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { generatePrimesOptimized } from '../core/math-primes';

/**
 * Single oscillator representing a prime mode
 */
export class PrimeOscillator implements Serializable {
  /** The prime number this oscillator represents */
  readonly prime: i32;
  
  /** Natural frequency (equation 2) */
  frequency: f64;
  
  /** Current phase [0, 2π] */
  phase: f64;
  
  /** Current amplitude [0, 1] */
  amplitude: f64;
  
  /** Natural phase for tracking drift */
  naturalPhase: f64;
  
  constructor(prime: i32, frequency: f64 = 0, phase: f64 = 0, amplitude: f64 = 0) {
    this.prime = prime;
    this.frequency = frequency > 0 ? frequency : PrimeOscillator.primeToFrequency(prime);
    this.phase = phase;
    this.amplitude = amplitude;
    this.naturalPhase = phase;
  }
  
  /**
   * Convert prime to natural frequency (equation 2)
   * f(p) = 1 + ln(p)/10
   */
  static primeToFrequency(p: i32): f64 {
    return 1.0 + Math.log(f64(p)) / 10.0;
  }
  
  /**
   * Excite this oscillator
   */
  excite(amount: f64 = 1.0): void {
    this.amplitude = Math.min(1.0, this.amplitude + amount);
  }
  
  /**
   * Apply damping to amplitude (equation 3)
   * Ap(t + Δt) = Ap(t) * (1 - damp * Δt)
   */
  damp(dampRate: f64, dt: f64): void {
    this.amplitude *= (1.0 - dampRate * dt);
    if (this.amplitude < 1e-10) {
      this.amplitude = 0;
    }
  }
  
  /**
   * Get complex amplitude (amplitude * e^(i*phase))
   * Returns [real, imag]
   */
  complexAmplitude(): f64[] {
    return [
      this.amplitude * Math.cos(this.phase),
      this.amplitude * Math.sin(this.phase)
    ];
  }
  
  /**
   * Get weighted amplitude (amplitude * sin(phase))
   */
  weightedAmplitude(): f64 {
    return this.amplitude * Math.sin(this.phase);
  }
  
  /**
   * Clone this oscillator
   */
  clone(): PrimeOscillator {
    return new PrimeOscillator(
      this.prime,
      this.frequency,
      this.phase,
      this.amplitude
    );
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("prime", f64(this.prime))
      .addNumberField("frequency", this.frequency)
      .addNumberField("phase", this.phase)
      .addNumberField("amplitude", this.amplitude)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Osc(p=${this.prime}, f=${toFixed(this.frequency, 3)}, φ=${toFixed(this.phase, 3)}, A=${toFixed(this.amplitude, 3)})`;
  }
}

/**
 * Coherence history entry
 */
export class CoherenceHistoryEntry {
  constructor(
    public time: i64,
    public coherence: f64,
    public activeCount: i32
  ) {}
}

/**
 * PRSC Layer - Prime Resonance Semantic Computation
 * 
 * Manages a bank of prime-indexed oscillators with Kuramoto coupling.
 */
export class PRSCLayer implements Serializable {
  /** Array of oscillators */
  oscillators: PrimeOscillator[] = [];
  
  /** Array of primes used */
  primes: i32[] = [];
  
  /** Prime to index mapping */
  primeToIndex: Map<i32, i32> = new Map<i32, i32>();
  
  /** Speed multiplier */
  speed: f64 = 1.0;
  
  /** Damping rate */
  dampRate: f64 = 0.02;
  
  /** Kuramoto coupling strength K */
  K: f64 = 0.3;
  
  /** Default time step (~60Hz) */
  dt: f64 = 0.016;
  
  /** Coherence history */
  coherenceHistory: CoherenceHistoryEntry[] = [];
  
  /** Max history length */
  maxHistoryLength: i32 = 100;
  
  constructor(
    primeCount: i32 = 64,
    speed: f64 = 1.0,
    dampRate: f64 = 0.02,
    coupling: f64 = 0.3,
    dt: f64 = 0.016,
    randomPhase: bool = true,
    initialAmplitude: f64 = -1 // -1 means use default initialization
  ) {
    this.speed = speed;
    this.dampRate = dampRate;
    this.K = coupling;
    this.dt = dt;
    
    // Generate primes
    const primes64 = generatePrimesOptimized(primeCount);
    for (let i = 0; i < primes64.length; i++) {
      this.primes.push(i32(primes64[i]));
    }
    
    // Create prime to index map
    for (let i = 0; i < this.primes.length; i++) {
      this.primeToIndex.set(this.primes[i], i);
    }
    
    // Initialize oscillators with small baseline activity for entropy
    for (let i = 0; i < this.primes.length; i++) {
      const p = this.primes[i];
      const phase = randomPhase ? Math.random() * 2.0 * Math.PI : 0;
      
      // Default initialization: first few primes get some initial amplitude
      let amp: f64;
      if (initialAmplitude >= 0) {
        amp = initialAmplitude;
      } else {
        amp = i < 8 ? 0.05 + 0.05 * Math.random() : 0.01 * Math.random();
      }
      
      this.oscillators.push(new PrimeOscillator(p, 0, phase, amp));
    }
  }
  
  /**
   * Get oscillator by prime number
   */
  getOscillator(prime: i32): PrimeOscillator | null {
    if (this.primeToIndex.has(prime)) {
      const idx = this.primeToIndex.get(prime);
      return this.oscillators[idx];
    }
    return null;
  }
  
  /**
   * Single time step evolution
   */
  tick(dt: f64 = -1): f64 {
    if (dt < 0) dt = this.dt;
    
    // First pass: compute all couplings
    const couplings = new Float64Array(this.oscillators.length);
    for (let i = 0; i < this.oscillators.length; i++) {
      couplings[i] = this.kuramotoCoupling(this.oscillators[i]);
    }
    
    // Second pass: update phases and amplitudes
    for (let i = 0; i < this.oscillators.length; i++) {
      const osc = this.oscillators[i];
      
      // Phase evolution (equation 2)
      // φp(t + Δt) = φp(t) + 2πf(p)Δt * speed
      osc.phase += 2.0 * Math.PI * osc.frequency * dt * this.speed;
      
      // Kuramoto coupling contribution (equation 4)
      osc.phase += couplings[i] * dt;
      
      // Normalize phase to [0, 2π]
      osc.phase = ((osc.phase % (2.0 * Math.PI)) + 2.0 * Math.PI) % (2.0 * Math.PI);
      
      // Amplitude damping (equation 3)
      osc.damp(this.dampRate, dt);
    }
    
    // Record coherence history
    const coherence = this.globalCoherence();
    this.coherenceHistory.push(new CoherenceHistoryEntry(
      Date.now() as i64,
      coherence,
      this.activeCount()
    ));
    
    if (this.coherenceHistory.length > this.maxHistoryLength) {
      this.coherenceHistory.shift();
    }
    
    return coherence;
  }
  
  /**
   * Kuramoto coupling for an oscillator (equation 4)
   * dφi/dt = ωi + (K/N) Σj sin(φj - φi)
   */
  kuramotoCoupling(osc: PrimeOscillator): f64 {
    let sum: f64 = 0;
    const N = this.oscillators.length;
    
    for (let i = 0; i < N; i++) {
      const other = this.oscillators[i];
      if (other.prime != osc.prime) {
        // Weight by amplitude for amplitude-aware coupling
        const weight = Math.min(1.0, other.amplitude + 0.1);
        sum += weight * Math.sin(other.phase - osc.phase);
      }
    }
    
    return (this.K / f64(N)) * sum;
  }
  
  /**
   * Global coherence / order parameter (equation 5)
   * Cglobal(t) = |1/|P| Σp e^(iφp(t))|
   */
  globalCoherence(): f64 {
    let realSum: f64 = 0;
    let imagSum: f64 = 0;
    let weightSum: f64 = 0;
    
    for (let i = 0; i < this.oscillators.length; i++) {
      const osc = this.oscillators[i];
      // Weight by amplitude for amplitude-aware coherence
      const weight = Math.max(0.1, osc.amplitude);
      realSum += weight * Math.cos(osc.phase);
      imagSum += weight * Math.sin(osc.phase);
      weightSum += weight;
    }
    
    if (weightSum < 1e-10) return 0;
    
    const realAvg = realSum / weightSum;
    const imagAvg = imagSum / weightSum;
    return Math.sqrt(realAvg * realAvg + imagAvg * imagAvg);
  }
  
  /**
   * Graph-based coherence (equation 6)
   * Cgraph(t) = Σi,j wij cos(φi(t) - φj(t))
   */
  graphCoherence(weights: Float64Array | null = null): f64 {
    let sum: f64 = 0;
    const N = this.oscillators.length;
    
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        let w: f64;
        if (weights !== null && i32(weights.length) > i * N + j) {
          w = weights[i * N + j];
        } else {
          w = 1.0 / f64(N); // Default uniform weight
        }
        
        sum += w * Math.cos(this.oscillators[i].phase - this.oscillators[j].phase);
      }
    }
    
    return sum;
  }
  
  /**
   * Mean phase (average direction)
   */
  meanPhase(): f64 {
    let realSum: f64 = 0;
    let imagSum: f64 = 0;
    let weightSum: f64 = 0;
    
    for (let i = 0; i < this.oscillators.length; i++) {
      const osc = this.oscillators[i];
      const weight = Math.max(0.1, osc.amplitude);
      realSum += weight * Math.cos(osc.phase);
      imagSum += weight * Math.sin(osc.phase);
      weightSum += weight;
    }
    
    return Math.atan2(imagSum / weightSum, realSum / weightSum);
  }
  
  /**
   * Excite oscillators for given primes
   */
  excite(primes: i32[], amount: f64 = 0.5): void {
    for (let i = 0; i < primes.length; i++) {
      const p = primes[i];
      if (this.primeToIndex.has(p)) {
        const idx = this.primeToIndex.get(p);
        this.oscillators[idx].excite(amount);
      }
    }
  }
  
  /**
   * Excite oscillators by indices
   */
  exciteByIndex(indices: i32[], amount: f64 = 0.5): void {
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      if (idx >= 0 && idx < this.oscillators.length) {
        this.oscillators[idx].excite(amount);
      }
    }
  }
  
  /**
   * Get count of active oscillators (amplitude > threshold)
   */
  activeCount(threshold: f64 = 0.1): i32 {
    let count: i32 = 0;
    for (let i = 0; i < this.oscillators.length; i++) {
      if (this.oscillators[i].amplitude > threshold) {
        count++;
      }
    }
    return count;
  }
  
  /**
   * Get active primes (amplitude > threshold)
   */
  activePrimes(threshold: f64 = 0.1): i32[] {
    const result: i32[] = [];
    for (let i = 0; i < this.oscillators.length; i++) {
      if (this.oscillators[i].amplitude > threshold) {
        result.push(this.oscillators[i].prime);
      }
    }
    return result;
  }
  
  /**
   * Get all amplitudes as array
   */
  getAmplitudes(): Float64Array {
    const result = new Float64Array(this.oscillators.length);
    for (let i = 0; i < this.oscillators.length; i++) {
      result[i] = this.oscillators[i].amplitude;
    }
    return result;
  }
  
  /**
   * Get all phases as array
   */
  getPhases(): Float64Array {
    const result = new Float64Array(this.oscillators.length);
    for (let i = 0; i < this.oscillators.length; i++) {
      result[i] = this.oscillators[i].phase;
    }
    return result;
  }
  
  /**
   * Get weighted amplitudes (amplitude * sin(phase))
   */
  getWeightedAmplitudes(): Float64Array {
    const result = new Float64Array(this.oscillators.length);
    for (let i = 0; i < this.oscillators.length; i++) {
      result[i] = this.oscillators[i].weightedAmplitude();
    }
    return result;
  }
  
  /**
   * Compute total energy (sum of squared amplitudes)
   */
  totalEnergy(): f64 {
    let sum: f64 = 0;
    for (let i = 0; i < this.oscillators.length; i++) {
      const amp = this.oscillators[i].amplitude;
      sum += amp * amp;
    }
    return sum;
  }
  
  /**
   * Compute amplitude entropy
   */
  amplitudeEntropy(): f64 {
    let total: f64 = 0;
    for (let i = 0; i < this.oscillators.length; i++) {
      total += this.oscillators[i].amplitude;
    }
    if (total < 1e-10) return 0;
    
    let H: f64 = 0;
    for (let i = 0; i < this.oscillators.length; i++) {
      const p = this.oscillators[i].amplitude / total;
      if (p > 1e-10) {
        H -= p * Math.log2(p);
      }
    }
    return H;
  }
  
  /**
   * Reset all oscillators
   */
  reset(randomPhase: bool = true): void {
    for (let i = 0; i < this.oscillators.length; i++) {
      this.oscillators[i].amplitude = 0;
      this.oscillators[i].phase = randomPhase ? Math.random() * 2.0 * Math.PI : 0;
    }
    this.coherenceHistory = [];
  }
  
  /**
   * Get coherence trend (recent change in coherence)
   */
  coherenceTrend(): f64 {
    if (this.coherenceHistory.length < 2) return 0;
    
    const n = this.coherenceHistory.length;
    const start = Math.max(0, n - 10) as i32;
    const mid = (start + n) / 2;
    
    let firstAvg: f64 = 0;
    let firstCount: i32 = 0;
    let secondAvg: f64 = 0;
    let secondCount: i32 = 0;
    
    for (let i = start; i < n; i++) {
      if (i < mid) {
        firstAvg += this.coherenceHistory[i].coherence;
        firstCount++;
      } else {
        secondAvg += this.coherenceHistory[i].coherence;
        secondCount++;
      }
    }
    
    if (firstCount > 0) firstAvg /= f64(firstCount);
    if (secondCount > 0) secondAvg /= f64(secondCount);
    
    return secondAvg - firstAvg;
  }
  
  /**
   * Clone this PRSC layer
   */
  clone(): PRSCLayer {
    const cloned = new PRSCLayer(
      this.primes.length,
      this.speed,
      this.dampRate,
      this.K,
      this.dt,
      false,
      0
    );
    
    for (let i = 0; i < this.oscillators.length; i++) {
      cloned.oscillators[i] = this.oscillators[i].clone();
    }
    
    return cloned;
  }
  
  /**
   * Get state snapshot
   */
  getState(): PRSCState {
    return new PRSCState(
      this.getAmplitudes(),
      this.getPhases(),
      this.globalCoherence(),
      this.meanPhase(),
      this.activeCount(),
      this.totalEnergy(),
      this.amplitudeEntropy()
    );
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("primeCount", f64(this.primes.length))
      .addNumberField("speed", this.speed)
      .addNumberField("dampRate", this.dampRate)
      .addNumberField("coupling", this.K)
      .addNumberField("coherence", this.globalCoherence())
      .addNumberField("activeCount", f64(this.activeCount()))
      .addNumberField("totalEnergy", this.totalEnergy())
      .addNumberField("entropy", this.amplitudeEntropy())
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `PRSC(n=${this.primes.length}, C=${toFixed(this.globalCoherence(), 3)}, active=${this.activeCount()})`;
  }
}

/**
 * PRSC State snapshot
 */
export class PRSCState {
  constructor(
    public amplitudes: Float64Array,
    public phases: Float64Array,
    public coherence: f64,
    public meanPhase: f64,
    public activeCount: i32,
    public totalEnergy: f64,
    public entropy: f64
  ) {}
}

/**
 * Entanglement strength between oscillators (equation 17)
 * strength(i,j) = ρφ * ρA
 * where ρφ = cos(Δφ) and ρA = min(Ai,Aj) / max(Ai,Aj)
 */
export class EntanglementDetector {
  threshold: f64;
  
  constructor(threshold: f64 = 0.7) {
    this.threshold = threshold;
  }
  
  /**
   * Compute entanglement strength between two oscillators
   */
  strength(osc1: PrimeOscillator, osc2: PrimeOscillator): f64 {
    // Phase correlation (equation 16)
    const deltaPhi = Math.abs(osc1.phase - osc2.phase);
    const rhoPhase = Math.cos(deltaPhi);
    
    // Amplitude correlation
    const minA = Math.min(osc1.amplitude, osc2.amplitude);
    const maxA = Math.max(osc1.amplitude, osc2.amplitude);
    const rhoAmplitude = minA / (maxA + 1e-10);
    
    return rhoPhase * rhoAmplitude;
  }
  
  /**
   * Check if two oscillators are entangled
   */
  isEntangled(osc1: PrimeOscillator, osc2: PrimeOscillator): bool {
    return this.strength(osc1, osc2) > this.threshold;
  }
  
  /**
   * Find all entangled pairs in a PRSC layer
   */
  findEntangledPairs(prsc: PRSCLayer): EntangledPair[] {
    const pairs: EntangledPair[] = [];
    const oscillators = prsc.oscillators;
    
    for (let i = 0; i < oscillators.length; i++) {
      for (let j = i + 1; j < oscillators.length; j++) {
        const s = this.strength(oscillators[i], oscillators[j]);
        if (s > this.threshold) {
          pairs.push(new EntangledPair(
            i, j,
            oscillators[i].prime,
            oscillators[j].prime,
            s,
            Math.abs(oscillators[i].phase - oscillators[j].phase)
          ));
        }
      }
    }
    
    // Sort by strength descending
    pairs.sort((a: EntangledPair, b: EntangledPair): i32 => {
      if (b.strength > a.strength) return 1;
      if (b.strength < a.strength) return -1;
      return 0;
    });
    
    return pairs;
  }
  
  /**
   * Detect coherence peaks in history (for phrase segmentation)
   */
  detectCoherencePeaks(history: CoherenceHistoryEntry[], windowSize: i32 = 5): CoherencePeak[] {
    if (history.length < windowSize * 2) return [];
    
    const peaks: CoherencePeak[] = [];
    
    for (let i = windowSize; i < history.length - windowSize; i++) {
      const center = history[i].coherence;
      let isPeak = true;
      
      for (let j = -windowSize; j <= windowSize; j++) {
        if (j != 0 && history[i + j].coherence >= center) {
          isPeak = false;
          break;
        }
      }
      
      if (isPeak) {
        peaks.push(new CoherencePeak(
          i,
          history[i].time,
          center
        ));
      }
    }
    
    return peaks;
  }
  
  /**
   * Detect energy trough (for phrase segmentation)
   */
  detectEnergyTrough(prsc: PRSCLayer, threshold: f64 = 0.1): bool {
    return prsc.totalEnergy() < threshold;
  }
}

/**
 * Entangled pair information
 */
export class EntangledPair {
  constructor(
    public i: i32,
    public j: i32,
    public prime1: i32,
    public prime2: i32,
    public strength: f64,
    public phaseDiff: f64
  ) {}
}

/**
 * Coherence peak information
 */
export class CoherencePeak {
  constructor(
    public index: i32,
    public time: i64,
    public coherence: f64
  ) {}
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a new PRSC layer with default settings
 */
export function createPRSC(primeCount: i32 = 64): PRSCLayer {
  return new PRSCLayer(primeCount);
}

/**
 * Create an entanglement detector
 */
export function createEntanglementDetector(threshold: f64 = 0.7): EntanglementDetector {
  return new EntanglementDetector(threshold);
}