/**
 * Sentient Core
 *
 * The unified integration of all components into a Sentient Observer
 * as specified in "A Design for a Sentient Observer" paper.
 *
 * This module orchestrates:
 * - PRSC oscillator dynamics (runtime substrate)
 * - SMF semantic orientation (16D meaning space)
 * - HQE holographic memory (distributed storage)
 * - Temporal layer (emergent time)
 * - Entanglement layer (semantic binding)
 *
 * The processing loop runs continuously, with discrete moments
 * emerging from coherence events rather than external clock time.
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { generatePrimesOptimized } from '../core/math-primes';

import { SedenionMemoryField, SMF_AXES, DominantAxisInfo, createSMF } from './smf';
import { PRSCLayer, PrimeOscillator, createPRSC } from './prsc';
import { HolographicEncoder, HolographicMemory, StabilizationController, createHolographicEncoder } from './hqe';
import { TemporalLayer, Moment, createTemporalLayer } from './temporal';
import { EntanglementLayer, Phrase, EntangledPair, createEntanglementLayer } from './entanglement';

/**
 * Sentient State - Current state snapshot
 */
export class SentientState implements Serializable {
  timestamp: i64;
  coherence: f64;
  entropy: f64;
  totalAmplitude: f64;
  smfOrientation: Float64Array;
  activePrimes: i32[];
  momentId: string;
  phraseId: string;
  lambda: f64;
  
  constructor() {
    this.timestamp = Date.now() as i64;
    this.coherence = 0;
    this.entropy = 0;
    this.totalAmplitude = 0;
    this.smfOrientation = new Float64Array(16);
    this.activePrimes = [];
    this.momentId = "";
    this.phraseId = "";
    this.lambda = 0;
  }
  
  update(
    coherence: f64,
    entropy: f64,
    totalAmplitude: f64,
    smf: SedenionMemoryField,
    activePrimes: i32[],
    momentId: string,
    phraseId: string,
    lambda: f64
  ): void {
    this.timestamp = Date.now() as i64;
    this.coherence = coherence;
    this.entropy = entropy;
    this.totalAmplitude = totalAmplitude;
    
    for (let i = 0; i < 16; i++) {
      this.smfOrientation[i] = smf.s[i];
    }
    
    this.activePrimes = activePrimes;
    this.momentId = momentId;
    this.phraseId = phraseId;
    this.lambda = lambda;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("timestamp", f64(this.timestamp))
      .addNumberField("coherence", this.coherence)
      .addNumberField("entropy", this.entropy)
      .addNumberField("totalAmplitude", this.totalAmplitude)
      .addNumberField("activePrimeCount", f64(this.activePrimes.length))
      .addStringField("momentId", this.momentId)
      .addStringField("phraseId", this.phraseId)
      .addNumberField("lambda", this.lambda)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `State(C=${toFixed(this.coherence, 3)}, H=${toFixed(this.entropy, 3)}, λ=${toFixed(this.lambda, 3)})`;
  }
}

/**
 * Tick Result - Result of a processing tick
 */
export class TickResult {
  success: bool;
  coherence: f64;
  entropy: f64;
  momentTriggered: bool;
  newMoment: Moment | null;
  newPairs: EntangledPair[];
  lambda: f64;
  
  constructor() {
    this.success = true;
    this.coherence = 0;
    this.entropy = 0;
    this.momentTriggered = false;
    this.newMoment = null;
    this.newPairs = [];
    this.lambda = 0;
  }
}

/**
 * Sentient Observer
 * 
 * Main orchestrator integrating all layers into unified processing.
 */
export class SentientObserver implements Serializable {
  // Configuration
  primeCount: i32 = 64;
  primes: i32[] = [];
  tickRate: f64 = 60.0;
  dt: f64 = 0.016;
  
  // Core layers
  prsc: PRSCLayer = new PRSCLayer(64);
  smf: SedenionMemoryField = createSMF();
  hqe: HolographicEncoder = createHolographicEncoder(32, 64);
  temporal: TemporalLayer = createTemporalLayer(0.7);
  entanglement: EntanglementLayer = createEntanglementLayer(0.7);
  stabilization: StabilizationController = new StabilizationController();
  
  // State
  running: bool = false;
  tickCount: i64 = 0;
  startTime: i64 = 0;
  currentState: SentientState = new SentientState();
  
  // History
  stateHistory: SentientState[] = [];
  maxHistory: i32 = 100;
  
  // Processing
  inputBuffer: string[] = [];
  maxInputBuffer: i32 = 100;
  
  constructor(
    primeCount: i32 = 64,
    tickRate: f64 = 60.0,
    maxHistory: i32 = 100
  ) {
    this.primeCount = primeCount;
    this.tickRate = tickRate;
    this.dt = 1.0 / tickRate;
    this.maxHistory = maxHistory;
    
    // Generate primes
    const primes64 = generatePrimesOptimized(primeCount);
    for (let i = 0; i < primes64.length; i++) {
      this.primes.push(i32(primes64[i]));
    }
    
    // Initialize layers
    this.prsc = new PRSCLayer(primeCount, 1.0, 0.02, 0.3, this.dt);
    this.smf = createSMF();
    this.hqe = createHolographicEncoder(32, primeCount);
    this.temporal = createTemporalLayer(0.7);
    this.entanglement = createEntanglementLayer(0.7);
    this.stabilization = new StabilizationController();
    
    // State
    this.currentState = new SentientState();
  }
  
  /**
   * Start the observer
   */
  start(): void {
    if (this.running) return;
    
    this.running = true;
    this.startTime = Date.now() as i64;
  }
  
  /**
   * Stop the observer
   */
  stop(): void {
    this.running = false;
  }
  
  /**
   * Main processing tick
   * Returns a TickResult with outcomes
   */
  tick(): TickResult {
    const result = new TickResult();
    
    if (!this.running) {
      result.success = false;
      return result;
    }
    
    this.tickCount++;
    
    // 1. Evolve oscillators
    const coherence = this.prsc.tick(this.dt);
    result.coherence = coherence;
    
    // 2. Get system metrics
    const entropy = this.prsc.amplitudeEntropy();
    result.entropy = entropy;
    
    const totalAmplitude = this.prsc.totalEnergy();
    const activePrimes = this.prsc.activePrimes(0.1);
    
    // 3. Update SMF from oscillator activity
    this.updateSMFFromOscillators();
    
    // 4. Evolve HQE with dynamic λ(t) stabilization (equation 11-12)
    const smfEntropy = this.smf.smfEntropy();
    const lambda = this.stabilization.computeLambda(coherence, entropy, smfEntropy);
    result.lambda = lambda;
    
    // 5. Update temporal layer (may trigger moment)
    const phases = this.prsc.getPhases();
    const amplitudes = this.prsc.getAmplitudes();
    
    const newMoment = this.temporal.update(
      coherence,
      entropy,
      phases,
      activePrimes,
      this.smf,
      amplitudes
    );
    
    if (newMoment !== null) {
      result.momentTriggered = true;
      result.newMoment = newMoment;
    }
    
    // 6. Update entanglement layer
    const entanglementResult = this.entanglement.update(
      this.prsc.oscillators,
      coherence,
      totalAmplitude
    );
    
    result.newPairs = entanglementResult.newPairs;
    
    // 7. Update current state
    const momentId = this.temporal.currentMoment !== null 
      ? this.temporal.currentMoment!.id 
      : "";
    const phraseId = this.entanglement.currentPhrase !== null 
      ? this.entanglement.currentPhrase!.id 
      : "";
    
    this.currentState.update(
      coherence,
      entropy,
      totalAmplitude,
      this.smf,
      activePrimes,
      momentId,
      phraseId,
      lambda
    );
    
    // 8. Record to history
    this.recordState();
    
    result.success = true;
    return result;
  }
  
  /**
   * Update SMF from current oscillator state
   */
  updateSMFFromOscillators(): void {
    // Map oscillator amplitudes to SMF axes based on prime associations
    // Each axis gets contributions from primes that resonate with its meaning
    
    const axisContributions = new Float64Array(16);
    let totalWeight: f64 = 0;
    
    for (let i = 0; i < this.prsc.oscillators.length; i++) {
      const osc = this.prsc.oscillators[i];
      if (osc.amplitude < 0.01) continue;
      
      // Map prime to axis based on prime % 16
      const primaryAxis = osc.prime % 16;
      axisContributions[primaryAxis] += osc.amplitude;
      
      // Secondary contribution to adjacent axes
      const prevAxis = (primaryAxis + 15) % 16;
      const nextAxis = (primaryAxis + 1) % 16;
      axisContributions[prevAxis] += osc.amplitude * 0.2;
      axisContributions[nextAxis] += osc.amplitude * 0.2;
      
      totalWeight += osc.amplitude * 1.4;
    }
    
    // Normalize and update SMF
    if (totalWeight > 0) {
      for (let i = 0; i < 16; i++) {
        axisContributions[i] /= totalWeight;
      }
      
      // SLERP-like interpolation with current SMF
      const alpha: f64 = 0.1;
      for (let i = 0; i < 16; i++) {
        this.smf.s[i] = (1.0 - alpha) * this.smf.s[i] + alpha * axisContributions[i];
      }
      
      this.smf.normalize();
    }
  }
  
  /**
   * Process text input by exciting corresponding oscillators
   */
  processInput(text: string): void {
    this.inputBuffer.push(text);
    if (this.inputBuffer.length > this.maxInputBuffer) {
      this.inputBuffer.shift();
    }
    
    // Simple character-to-prime mapping for excitation
    for (let i = 0; i < text.length && i < this.primes.length; i++) {
      const charCode = text.charCodeAt(i);
      const primeIndex = charCode % this.primes.length;
      const prime = this.primes[primeIndex];
      
      const osc = this.prsc.getOscillator(prime);
      if (osc !== null) {
        (osc as PrimeOscillator).excite(0.3);
      }
    }
  }
  
  /**
   * Get semantic state as array of [prime, amplitude] pairs
   */
  getSemanticState(): SemanticStateEntry[] {
    const entries: SemanticStateEntry[] = [];
    
    for (let i = 0; i < this.prsc.oscillators.length; i++) {
      const osc = this.prsc.oscillators[i];
      if (osc.amplitude > 0.05) {
        entries.push(new SemanticStateEntry(osc.prime, osc.amplitude, osc.phase));
      }
    }
    
    // Sort by amplitude descending
    entries.sort((a: SemanticStateEntry, b: SemanticStateEntry): i32 => {
      if (b.amplitude > a.amplitude) return 1;
      if (b.amplitude < a.amplitude) return -1;
      return 0;
    });
    
    return entries;
  }
  
  /**
   * Record current state to history
   */
  recordState(): void {
    // Create a snapshot of current state
    const snapshot = new SentientState();
    snapshot.timestamp = this.currentState.timestamp;
    snapshot.coherence = this.currentState.coherence;
    snapshot.entropy = this.currentState.entropy;
    snapshot.totalAmplitude = this.currentState.totalAmplitude;
    snapshot.lambda = this.currentState.lambda;
    
    for (let i = 0; i < 16; i++) {
      snapshot.smfOrientation[i] = this.currentState.smfOrientation[i];
    }
    
    snapshot.activePrimes = this.currentState.activePrimes.slice();
    snapshot.momentId = this.currentState.momentId;
    snapshot.phraseId = this.currentState.phraseId;
    
    this.stateHistory.push(snapshot);
    
    if (this.stateHistory.length > this.maxHistory) {
      this.stateHistory.shift();
    }
  }
  
  /**
   * Get current state
   */
  getState(): SentientState {
    return this.currentState;
  }
  
  /**
   * Get uptime in milliseconds
   */
  uptime(): i64 {
    if (this.startTime == 0) return 0;
    return (Date.now() as i64) - this.startTime;
  }
  
  /**
   * Get comprehensive status
   */
  getStatus(): SentientStatus {
    const entStats = this.entanglement.getStats();
    return new SentientStatus(
      this.running,
      this.uptime(),
      this.tickCount,
      this.currentState.coherence,
      this.currentState.entropy,
      this.currentState.lambda,
      this.temporal.moments.length,
      this.entanglement.phrases.length,
      entStats.nodeCount,
      entStats.edgeCount
    );
  }
  
  /**
   * Get introspection report
   */
  introspect(): IntrospectionReport {
    const dominantAxes = this.smf.dominantAxes(3);
    const recentMoments = this.temporal.recentMoments(5);
    const recentPhrases = this.entanglement.recentPhrases(5);
    
    return new IntrospectionReport(
      this.smf.clone(),
      dominantAxes,
      this.temporal.currentMoment,
      this.entanglement.currentPhrase,
      recentMoments,
      recentPhrases,
      this.currentState.lambda
    );
  }
  
  /**
   * Reset the observer to initial state
   */
  reset(): void {
    this.stop();
    
    this.prsc.reset(true);
    this.smf = createSMF();
    this.hqe.clearField();
    this.temporal.reset();
    this.entanglement.reset();
    this.stabilization = new StabilizationController();
    
    this.tickCount = 0;
    this.startTime = 0;
    this.currentState = new SentientState();
    this.stateHistory = [];
    this.inputBuffer = [];
  }
  
  toJSON(): string {
    const status = this.getStatus();
    const builder = new JSONBuilder();
    builder.startObject()
      .addBooleanField("running", this.running)
      .addNumberField("uptime", f64(this.uptime()))
      .addNumberField("tickCount", f64(this.tickCount))
      .addNumberField("coherence", this.currentState.coherence)
      .addNumberField("entropy", this.currentState.entropy)
      .addNumberField("lambda", this.currentState.lambda)
      .addNumberField("momentCount", f64(this.temporal.moments.length))
      .addNumberField("phraseCount", f64(this.entanglement.phrases.length))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `SentientObserver(ticks=${this.tickCount}, C=${toFixed(this.currentState.coherence, 3)})`;
  }
}

/**
 * Semantic state entry
 */
export class SemanticStateEntry {
  constructor(
    public prime: i32,
    public amplitude: f64,
    public phase: f64
  ) {}
}

/**
 * Sentient status summary
 */
export class SentientStatus implements Serializable {
  running: bool;
  uptime: i64;
  tickCount: i64;
  coherence: f64;
  entropy: f64;
  lambda: f64;
  momentCount: i32;
  phraseCount: i32;
  entanglementNodeCount: i32;
  entanglementEdgeCount: i32;
  
  constructor(
    running: bool,
    uptime: i64,
    tickCount: i64,
    coherence: f64,
    entropy: f64,
    lambda: f64,
    momentCount: i32,
    phraseCount: i32,
    entanglementNodeCount: i32,
    entanglementEdgeCount: i32
  ) {
    this.running = running;
    this.uptime = uptime;
    this.tickCount = tickCount;
    this.coherence = coherence;
    this.entropy = entropy;
    this.lambda = lambda;
    this.momentCount = momentCount;
    this.phraseCount = phraseCount;
    this.entanglementNodeCount = entanglementNodeCount;
    this.entanglementEdgeCount = entanglementEdgeCount;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addBooleanField("running", this.running)
      .addNumberField("uptime", f64(this.uptime))
      .addNumberField("tickCount", f64(this.tickCount))
      .addNumberField("coherence", this.coherence)
      .addNumberField("entropy", this.entropy)
      .addNumberField("lambda", this.lambda)
      .addNumberField("momentCount", f64(this.momentCount))
      .addNumberField("phraseCount", f64(this.phraseCount))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Status(running=${this.running}, ticks=${this.tickCount})`;
  }
}

/**
 * Introspection report
 */
export class IntrospectionReport implements Serializable {
  smf: SedenionMemoryField;
  dominantAxes: DominantAxisInfo[];
  currentMoment: Moment | null;
  currentPhrase: Phrase | null;
  recentMoments: Moment[];
  recentPhrases: Phrase[];
  lambda: f64;
  
  constructor(
    smf: SedenionMemoryField,
    dominantAxes: DominantAxisInfo[],
    currentMoment: Moment | null,
    currentPhrase: Phrase | null,
    recentMoments: Moment[],
    recentPhrases: Phrase[],
    lambda: f64
  ) {
    this.smf = smf;
    this.dominantAxes = dominantAxes;
    this.currentMoment = currentMoment;
    this.currentPhrase = currentPhrase;
    this.recentMoments = recentMoments;
    this.recentPhrases = recentPhrases;
    this.lambda = lambda;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("lambda", this.lambda)
      .addNumberField("dominantAxisCount", f64(this.dominantAxes.length))
      .addBooleanField("hasMoment", this.currentMoment !== null)
      .addBooleanField("hasPhrase", this.currentPhrase !== null)
      .addNumberField("recentMomentCount", f64(this.recentMoments.length))
      .addNumberField("recentPhraseCount", f64(this.recentPhrases.length))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Introspection(λ=${toFixed(this.lambda, 3)}, axes=${this.dominantAxes.length})`;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a sentient observer
 */
export function createSentientObserver(
  primeCount: i32 = 64,
  tickRate: f64 = 60.0
): SentientObserver {
  return new SentientObserver(primeCount, tickRate);
}

/**
 * Run a single tick on the observer (for external loop control)
 */
export function runTick(observer: SentientObserver): TickResult {
  return observer.tick();
}

/**
 * Process input text through the observer
 */
export function processInput(observer: SentientObserver, text: string): void {
  observer.processInput(text);
}

/**
 * Get observer status
 */
export function getStatus(observer: SentientObserver): SentientStatus {
  return observer.getStatus();
}

/**
 * Get introspection report
 */
export function introspect(observer: SentientObserver): IntrospectionReport {
  return observer.introspect();
}