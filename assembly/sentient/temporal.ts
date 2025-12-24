/**
 * Temporal Layer - Emergent Time
 * 
 * Implements the emergent time mechanism from "A Design for a Sentient
 * Observer" paper, Section 5.
 * 
 * Key features:
 * - Coherence-based moment detection (equations 18-20)
 * - Entropy conditions for moment triggering
 * - Subjective duration based on processed content (equation 24)
 * - Phase transition rate monitoring
 * - Temporal event logging
 * 
 * Time emerges from coherence events rather than external clock.
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { SedenionMemoryField } from './smf';

/**
 * Moment - A discrete unit of experiential time
 * 
 * Moments are triggered by coherence peaks or entropy conditions,
 * not by external clock time.
 */
export class Moment implements Serializable {
  /** Unique moment ID */
  id: string;
  
  /** Timestamp of creation */
  timestamp: i64;
  
  /** Clock time when created */
  clockTime: i64;
  
  /** Trigger type */
  trigger: string;  // 'coherence' | 'entropy' | 'phase_transition' | 'entropy_extreme' | 'manual'
  
  /** Coherence at moment creation */
  coherence: f64;
  
  /** Entropy at moment creation */
  entropy: f64;
  
  /** Phase transition rate at creation */
  phaseTransitionRate: f64;
  
  /** Active primes at this moment */
  activePrimes: i32[];
  
  /** SMF snapshot components */
  smfSnapshot: Float64Array | null;
  
  /** SMF entropy at creation */
  smfEntropy: f64;
  
  /** Subjective duration (equation 24) */
  subjectiveDuration: f64;
  
  /** Previous moment ID for chaining */
  previousMomentId: string;
  
  /** Notes/metadata */
  notes: string;
  
  /** Moment counter for ID generation */
  static counter: i32 = 0;
  
  constructor(
    trigger: string = "coherence",
    coherence: f64 = 0,
    entropy: f64 = 0,
    phaseTransitionRate: f64 = 0,
    activePrimes: i32[] = [],
    smfSnapshot: Float64Array | null = null,
    smfEntropy: f64 = 0,
    subjectiveDuration: f64 = 0,
    previousMomentId: string = ""
  ) {
    Moment.counter++;
    this.id = `m_${Moment.counter}`;
    this.timestamp = Date.now() as i64;
    this.clockTime = Date.now() as i64;
    this.trigger = trigger;
    this.coherence = coherence;
    this.entropy = entropy;
    this.phaseTransitionRate = phaseTransitionRate;
    this.activePrimes = activePrimes;
    this.smfSnapshot = smfSnapshot;
    this.smfEntropy = smfEntropy;
    this.subjectiveDuration = subjectiveDuration;
    this.previousMomentId = previousMomentId;
    this.notes = "";
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("timestamp", f64(this.timestamp))
      .addStringField("trigger", this.trigger)
      .addNumberField("coherence", this.coherence)
      .addNumberField("entropy", this.entropy)
      .addNumberField("phaseTransitionRate", this.phaseTransitionRate)
      .addNumberField("subjectiveDuration", this.subjectiveDuration)
      .addNumberField("activePrimeCount", f64(this.activePrimes.length))
      .addStringField("previousMomentId", this.previousMomentId)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Moment(${this.id}, ${this.trigger}, C=${toFixed(this.coherence, 3)})`;
  }
}

/**
 * Coherence history entry
 */
export class TemporalHistoryEntry {
  constructor(
    public time: i64,
    public value: f64
  ) {}
}

/**
 * Phase history entry
 */
export class PhaseHistoryEntry {
  constructor(
    public time: i64,
    public phases: Float64Array
  ) {}
}

/**
 * Moment trigger result
 */
export class MomentTriggerResult {
  constructor(
    public triggered: bool,
    public trigger: string = ""
  ) {}
}

/**
 * Temporal Layer - Manages emergent time experience
 */
export class TemporalLayer implements Serializable {
  /** Coherence threshold for moment trigger */
  coherenceThreshold: f64;
  
  /** Minimum entropy for valid moment */
  entropyMin: f64;
  
  /** Maximum entropy for valid moment */
  entropyMax: f64;
  
  /** Phase transition rate threshold */
  phaseTransitionThreshold: f64;
  
  /** Duration scaling factor β (equation 24) */
  beta: f64;
  
  /** Minimum interval between moments (ms) */
  minMomentInterval: i64;
  
  /** Last moment creation time */
  lastMomentTime: i64;
  
  /** All moments */
  moments: Moment[];
  
  /** Current moment */
  currentMoment: Moment | null;
  
  /** Accumulated subjective time */
  subjectiveTime: f64;
  
  /** Last clock time */
  lastClockTime: i64;
  
  /** Moment counter */
  momentCounter: i32;
  
  /** Coherence history */
  coherenceHistory: TemporalHistoryEntry[];
  
  /** Entropy history */
  entropyHistory: TemporalHistoryEntry[];
  
  /** Phase history */
  phaseHistory: PhaseHistoryEntry[];
  
  /** Max history length */
  maxHistory: i32;
  
  constructor(
    coherenceThreshold: f64 = 0.7,
    entropyMin: f64 = 0.05,
    entropyMax: f64 = 0.95,
    phaseTransitionThreshold: f64 = 0.3,
    beta: f64 = 1.0,
    minMomentInterval: i64 = 500,
    maxHistory: i32 = 1000
  ) {
    this.coherenceThreshold = coherenceThreshold;
    this.entropyMin = entropyMin;
    this.entropyMax = entropyMax;
    this.phaseTransitionThreshold = phaseTransitionThreshold;
    this.beta = beta;
    this.minMomentInterval = minMomentInterval;
    this.maxHistory = maxHistory;
    
    this.lastMomentTime = 0;
    this.moments = [];
    this.currentMoment = null;
    this.subjectiveTime = 0;
    this.lastClockTime = Date.now() as i64;
    this.momentCounter = 0;
    
    this.coherenceHistory = [];
    this.entropyHistory = [];
    this.phaseHistory = [];
  }
  
  /**
   * Update temporal layer with current system state
   * Returns a new Moment if triggered, null otherwise
   */
  update(
    coherence: f64,
    entropy: f64,
    phases: Float64Array | null,
    activePrimes: i32[],
    smf: SedenionMemoryField | null,
    amplitudes: Float64Array | null
  ): Moment | null {
    const now = Date.now() as i64;
    this.lastClockTime = now;
    
    // Update history
    this.coherenceHistory.push(new TemporalHistoryEntry(now, coherence));
    this.entropyHistory.push(new TemporalHistoryEntry(now, entropy));
    
    if (phases !== null) {
      const phasesCopy = new Float64Array(phases.length);
      for (let i = 0; i < i32(phases.length); i++) {
        phasesCopy[i] = phases[i];
      }
      this.phaseHistory.push(new PhaseHistoryEntry(now, phasesCopy));
    }
    
    // Trim histories
    this.trimHistories();
    
    // Check moment trigger conditions (with debouncing)
    const momentTriggered = this.checkMomentConditions(coherence, entropy);
    
    if (momentTriggered.triggered) {
      // Debounce: don't create moments too frequently
      if (now - this.lastMomentTime >= this.minMomentInterval) {
        this.lastMomentTime = now;
        return this.createMoment(
          momentTriggered.trigger,
          coherence,
          entropy,
          activePrimes,
          smf,
          amplitudes
        );
      }
    }
    
    return null;
  }
  
  /**
   * Check if moment conditions are met (equations 18-20)
   */
  checkMomentConditions(coherence: f64, entropy: f64): MomentTriggerResult {
    // Condition 1: Coherence peak (equation 18)
    const isCoherencePeak = this.isCoherencePeak(coherence);
    
    // Condition 2: Entropy in valid range (equation 19)
    const entropyValid = entropy > this.entropyMin && entropy < this.entropyMax;
    
    // Condition 3: Phase transition (equation 20)
    const phaseTransition = this.phaseTransitionRate() > this.phaseTransitionThreshold;
    
    // Combined conditions
    if (isCoherencePeak && entropyValid) {
      return new MomentTriggerResult(true, "coherence");
    }
    
    if (phaseTransition && entropyValid) {
      return new MomentTriggerResult(true, "phase_transition");
    }
    
    // Emergency moment if entropy at extremes
    if (entropy < this.entropyMin * 0.5 || entropy > this.entropyMax * 1.5) {
      return new MomentTriggerResult(true, "entropy_extreme");
    }
    
    return new MomentTriggerResult(false);
  }
  
  /**
   * Check if current coherence is a local peak
   */
  isCoherencePeak(coherence: f64): bool {
    if (coherence < this.coherenceThreshold) return false;
    if (this.coherenceHistory.length < 3) return false;
    
    const n = this.coherenceHistory.length;
    const start = Math.max(0, n - 5) as i32;
    const current = this.coherenceHistory[n - 1].value;
    
    for (let i = start; i < n - 1; i++) {
      if (this.coherenceHistory[i].value >= current) return false;
    }
    
    return true;
  }
  
  /**
   * Calculate rate of phase transitions
   */
  phaseTransitionRate(): f64 {
    if (this.phaseHistory.length < 2) return 0;
    
    const n = this.phaseHistory.length;
    const start = Math.max(0, n - 10) as i32;
    
    let totalChange: f64 = 0;
    let count: i32 = 0;
    
    for (let i = start + 1; i < n; i++) {
      const prev = this.phaseHistory[i - 1].phases;
      const curr = this.phaseHistory[i].phases;
      
      if (prev.length != curr.length) continue;
      
      for (let j = 0; j < i32(prev.length); j++) {
        let delta = Math.abs(curr[j] - prev[j]);
        // Handle phase wrapping
        if (delta > Math.PI) delta = 2.0 * Math.PI - delta;
        totalChange += delta;
      }
      count++;
    }
    
    if (count == 0) return 0;
    
    const dt = f64(this.phaseHistory[n - 1].time - this.phaseHistory[start].time) / 1000.0;
    return dt > 0 ? totalChange / (f64(count) * dt) : 0;
  }
  
  /**
   * Create a new moment
   */
  createMoment(
    trigger: string,
    coherence: f64,
    entropy: f64,
    activePrimes: i32[],
    smf: SedenionMemoryField | null,
    amplitudes: Float64Array | null
  ): Moment {
    // Calculate subjective duration (equation 24)
    const subjectiveDuration = this.calculateSubjectiveDuration(amplitudes);
    
    // Get SMF snapshot
    let smfSnapshot: Float64Array | null = null;
    let smfEntropy: f64 = 0;
    if (smf !== null) {
      smfSnapshot = new Float64Array(16);
      for (let i = 0; i < 16; i++) {
        smfSnapshot[i] = smf.s[i];
      }
      smfEntropy = smf.entropy();
    }
    
    const prevMomentId = this.currentMoment !== null ? this.currentMoment!.id : "";
    
    const moment = new Moment(
      trigger,
      coherence,
      entropy,
      this.phaseTransitionRate(),
      activePrimes,
      smfSnapshot,
      smfEntropy,
      subjectiveDuration,
      prevMomentId
    );
    
    // Update subjective time
    this.subjectiveTime += subjectiveDuration;
    
    // Store moment
    this.moments.push(moment);
    this.currentMoment = moment;
    this.momentCounter++;
    
    return moment;
  }
  
  /**
   * Calculate subjective duration (equation 24)
   * Δτ = β * Σ Ap log(Ap) (information content)
   */
  calculateSubjectiveDuration(amplitudes: Float64Array | null): f64 {
    if (amplitudes === null || amplitudes.length == 0) return this.beta;
    
    // Sum of Ap * log(Ap) for non-zero amplitudes
    let informationContent: f64 = 0;
    for (let i = 0; i < i32(amplitudes.length); i++) {
      const A = amplitudes[i];
      if (A > 1e-10) {
        informationContent += A * Math.log(A + 1.0);
      }
    }
    
    // Scale by beta, ensure positive
    return Math.max(0.1, this.beta * Math.abs(informationContent) + 0.5);
  }
  
  /**
   * Trim histories to max length
   */
  trimHistories(): void {
    if (this.coherenceHistory.length > this.maxHistory) {
      this.coherenceHistory = this.coherenceHistory.slice(this.coherenceHistory.length - this.maxHistory);
    }
    if (this.entropyHistory.length > this.maxHistory) {
      this.entropyHistory = this.entropyHistory.slice(this.entropyHistory.length - this.maxHistory);
    }
    if (this.phaseHistory.length > this.maxHistory) {
      this.phaseHistory = this.phaseHistory.slice(this.phaseHistory.length - this.maxHistory);
    }
  }
  
  /**
   * Force a moment (manual trigger)
   */
  forceMoment(
    coherence: f64,
    entropy: f64,
    activePrimes: i32[],
    smf: SedenionMemoryField | null,
    amplitudes: Float64Array | null,
    note: string = ""
  ): Moment {
    const moment = this.createMoment(
      "manual",
      coherence,
      entropy,
      activePrimes,
      smf,
      amplitudes
    );
    moment.notes = note;
    return moment;
  }
  
  /**
   * Get recent moments
   */
  recentMoments(count: i32 = 10): Moment[] {
    const start = Math.max(0, this.moments.length - count) as i32;
    const result: Moment[] = [];
    for (let i = start; i < this.moments.length; i++) {
      result.push(this.moments[i]);
    }
    return result;
  }
  
  /**
   * Get moment by ID
   */
  getMoment(id: string): Moment | null {
    for (let i = 0; i < this.moments.length; i++) {
      if (this.moments[i].id == id) {
        return this.moments[i];
      }
    }
    return null;
  }
  
  /**
   * Get moment chain (linked list of previous moments)
   */
  getMomentChain(startId: string, maxDepth: i32 = 10): Moment[] {
    const chain: Moment[] = [];
    let current = this.getMoment(startId);
    
    while (current !== null && chain.length < maxDepth) {
      chain.push(current);
      if (current.previousMomentId.length > 0) {
        current = this.getMoment(current.previousMomentId);
      } else {
        break;
      }
    }
    
    return chain;
  }
  
  /**
   * Get subjective time elapsed
   */
  getSubjectiveTime(): f64 {
    return this.subjectiveTime;
  }
  
  /**
   * Get ratio of subjective to clock time
   */
  timeRatio(): f64 {
    if (this.moments.length == 0) return 1.0;
    const clockElapsed = f64(Date.now() as i64 - this.moments[0].clockTime) / 1000.0;
    if (clockElapsed < 1.0) return 1.0;
    return this.subjectiveTime / clockElapsed;
  }
  
  /**
   * Get average moment duration (clock time between moments)
   */
  averageMomentDuration(): f64 {
    if (this.moments.length < 2) return 0;
    
    let totalDuration: f64 = 0;
    for (let i = 1; i < this.moments.length; i++) {
      totalDuration += f64(this.moments[i].clockTime - this.moments[i - 1].clockTime);
    }
    
    return totalDuration / f64(this.moments.length - 1);
  }
  
  /**
   * Get temporal statistics
   */
  getStats(): TemporalStats {
    const lastCoherence = this.coherenceHistory.length > 0
      ? this.coherenceHistory[this.coherenceHistory.length - 1].value
      : 0;
    const lastEntropy = this.entropyHistory.length > 0
      ? this.entropyHistory[this.entropyHistory.length - 1].value
      : 0;
    
    return new TemporalStats(
      this.moments.length,
      this.subjectiveTime,
      this.averageMomentDuration(),
      this.timeRatio(),
      lastCoherence,
      lastEntropy,
      this.phaseTransitionRate()
    );
  }
  
  /**
   * Reset temporal layer
   */
  reset(): void {
    this.moments = [];
    this.currentMoment = null;
    this.subjectiveTime = 0;
    this.lastClockTime = Date.now() as i64;
    this.momentCounter = 0;
    this.coherenceHistory = [];
    this.entropyHistory = [];
    this.phaseHistory = [];
  }
  
  toJSON(): string {
    const stats = this.getStats();
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("momentCount", f64(stats.momentCount))
      .addNumberField("subjectiveTime", stats.subjectiveTime)
      .addNumberField("averageMomentDuration", stats.averageMomentDuration)
      .addNumberField("timeRatio", stats.timeRatio)
      .addNumberField("lastCoherence", stats.lastCoherence)
      .addNumberField("lastEntropy", stats.lastEntropy)
      .addNumberField("phaseTransitionRate", stats.phaseTransitionRate)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `TemporalLayer(moments=${this.moments.length}, τ=${toFixed(this.subjectiveTime, 2)})`;
  }
}

/**
 * Temporal statistics
 */
export class TemporalStats {
  constructor(
    public momentCount: i32,
    public subjectiveTime: f64,
    public averageMomentDuration: f64,
    public timeRatio: f64,
    public lastCoherence: f64,
    public lastEntropy: f64,
    public phaseTransitionRate: f64
  ) {}
}

/**
 * Temporal Pattern Detector
 * 
 * Detects recurring patterns in temporal sequences,
 * supporting anticipation and prediction.
 */
export class TemporalPatternDetector {
  windowSize: i32;
  minPatternLength: i32;
  maxPatternLength: i32;
  similarityThreshold: f64;
  
  constructor(
    windowSize: i32 = 5,
    minPatternLength: i32 = 2,
    maxPatternLength: i32 = 10,
    similarityThreshold: f64 = 0.8
  ) {
    this.windowSize = windowSize;
    this.minPatternLength = minPatternLength;
    this.maxPatternLength = maxPatternLength;
    this.similarityThreshold = similarityThreshold;
  }
  
  /**
   * Generate signature for a moment
   */
  momentSignature(moment: Moment): MomentSignature {
    return new MomentSignature(
      moment.trigger,
      Math.round(moment.coherence * 10.0) / 10.0,
      Math.round(moment.entropy * 10.0) / 10.0,
      moment.activePrimes.length
    );
  }
  
  /**
   * Check if two signatures match
   */
  signaturesMatch(sig1: MomentSignature, sig2: MomentSignature): bool {
    if (sig1.trigger != sig2.trigger) return false;
    if (Math.abs(sig1.coherenceLevel - sig2.coherenceLevel) > 0.2) return false;
    if (Math.abs(sig1.entropyLevel - sig2.entropyLevel) > 0.2) return false;
    return true;
  }
  
  /**
   * Detect patterns in moment sequence
   */
  detectPatterns(moments: Moment[]): DetectedPattern[] {
    if (moments.length < this.minPatternLength * 2) return [];
    
    const signatures: MomentSignature[] = [];
    for (let i = 0; i < moments.length; i++) {
      signatures.push(this.momentSignature(moments[i]));
    }
    
    const detected: DetectedPattern[] = [];
    
    const maxLen = Math.min(this.maxPatternLength, i32(Math.floor(f64(signatures.length) / 2.0)));
    for (let len = this.minPatternLength; len <= maxLen; len++) {
      for (let i = 0; i <= signatures.length - len * 2; i++) {
        // Check if pattern repeats
        let matches: i32 = 0;
        for (let j = 0; j < len; j++) {
          if (this.signaturesMatch(signatures[i + j], signatures[i + len + j])) {
            matches++;
          }
        }
        
        const matchRatio = f64(matches) / f64(len);
        if (matchRatio >= this.similarityThreshold) {
          detected.push(new DetectedPattern(
            i,
            len,
            matchRatio
          ));
        }
      }
    }
    
    return this.deduplicatePatterns(detected);
  }
  
  /**
   * Remove duplicate/overlapping patterns
   */
  deduplicatePatterns(patterns: DetectedPattern[]): DetectedPattern[] {
    // Sort by strength descending
    patterns.sort((a: DetectedPattern, b: DetectedPattern): i32 => {
      if (b.strength > a.strength) return 1;
      if (b.strength < a.strength) return -1;
      return 0;
    });
    
    const unique: DetectedPattern[] = [];
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      let overlaps = false;
      
      for (let j = 0; j < unique.length; j++) {
        if (Math.abs(unique[j].startIndex - pattern.startIndex) < unique[j].length) {
          overlaps = true;
          break;
        }
      }
      
      if (!overlaps) {
        unique.push(pattern);
      }
    }
    
    return unique;
  }
}

/**
 * Moment signature for pattern detection
 */
export class MomentSignature {
  constructor(
    public trigger: string,
    public coherenceLevel: f64,
    public entropyLevel: f64,
    public primeCount: i32
  ) {}
}

/**
 * Detected pattern
 */
export class DetectedPattern {
  constructor(
    public startIndex: i32,
    public length: i32,
    public strength: f64
  ) {}
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a temporal layer
 */
export function createTemporalLayer(
  coherenceThreshold: f64 = 0.7
): TemporalLayer {
  return new TemporalLayer(coherenceThreshold);
}

/**
 * Create a pattern detector
 */
export function createPatternDetector(): TemporalPatternDetector {
  return new TemporalPatternDetector();
}