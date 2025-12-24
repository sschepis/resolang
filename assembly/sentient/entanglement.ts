/**
 * Entanglement Layer
 * 
 * Implements semantic entanglement from "A Design for a Sentient Observer"
 * paper, Section 4.3 and equations 16-17.
 * 
 * Key features:
 * - Phrase segmentation via coherence peaks and energy troughs
 * - Intra-phrase entanglement detection
 * - Entanglement graph building and traversal
 * - Persistent conceptual bindings
 * - Associative recall via entanglement chains
 */

import { Serializable } from '../core/interfaces';
import { JSONBuilder } from '../core/serialization';
import { toFixed } from '../utils';
import { PrimeOscillator, PRSCLayer } from './prsc';

/**
 * Entangled Pair - Two primes with strong correlation
 */
export class EntangledPair implements Serializable {
  prime1: i32;
  prime2: i32;
  strength: f64;
  phaseDiff: f64;
  formationTime: i64;
  accessCount: i32;
  context: string;
  
  constructor(
    prime1: i32,
    prime2: i32,
    strength: f64 = 0,
    phaseDiff: f64 = 0,
    context: string = ""
  ) {
    this.prime1 = prime1;
    this.prime2 = prime2;
    this.strength = strength;
    this.phaseDiff = phaseDiff;
    this.formationTime = Date.now() as i64;
    this.accessCount = 0;
    this.context = context;
  }
  
  /**
   * Get pair as sorted tuple [smaller, larger]
   */
  get tuple(): i32[] {
    return this.prime1 < this.prime2 
      ? [this.prime1, this.prime2] 
      : [this.prime2, this.prime1];
  }
  
  /**
   * Get unique key for this pair
   */
  get key(): string {
    const t = this.tuple;
    return `${t[0]}:${t[1]}`;
  }
  
  /**
   * Check if this pair contains a prime
   */
  contains(prime: i32): bool {
    return this.prime1 == prime || this.prime2 == prime;
  }
  
  /**
   * Get the other prime in the pair
   */
  other(prime: i32): i32 {
    if (this.prime1 == prime) return this.prime2;
    if (this.prime2 == prime) return this.prime1;
    return -1;
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("prime1", f64(this.prime1))
      .addNumberField("prime2", f64(this.prime2))
      .addNumberField("strength", this.strength)
      .addNumberField("phaseDiff", this.phaseDiff)
      .addNumberField("accessCount", f64(this.accessCount))
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Pair(${this.prime1},${this.prime2},s=${toFixed(this.strength, 3)})`;
  }
}

/**
 * Phrase - A bounded segment of experience
 * 
 * Phrases are delimited by coherence peaks or energy troughs,
 * representing coherent units of meaning.
 */
export class Phrase implements Serializable {
  id: string;
  startTime: i64;
  endTime: i64;
  primes: i32[];
  entangledPairs: EntangledPair[];
  coherencePeak: f64;
  energyAtEnd: f64;
  momentIds: string[];
  semanticContent: string;
  
  static counter: i32 = 0;
  
  constructor(coherencePeak: f64 = 0) {
    Phrase.counter++;
    this.id = `ph_${Phrase.counter}`;
    this.startTime = Date.now() as i64;
    this.endTime = 0;
    this.primes = [];
    this.entangledPairs = [];
    this.coherencePeak = coherencePeak;
    this.energyAtEnd = 0;
    this.momentIds = [];
    this.semanticContent = "";
  }
  
  /**
   * Duration in milliseconds
   */
  duration(): i64 {
    if (this.endTime == 0) return (Date.now() as i64) - this.startTime;
    return this.endTime - this.startTime;
  }
  
  /**
   * Close this phrase
   */
  close(energyAtEnd: f64 = 0): void {
    this.endTime = Date.now() as i64;
    this.energyAtEnd = energyAtEnd;
  }
  
  /**
   * Add a prime to this phrase
   */
  addPrime(prime: i32): void {
    for (let i = 0; i < this.primes.length; i++) {
      if (this.primes[i] == prime) return;
    }
    this.primes.push(prime);
  }
  
  /**
   * Add an entangled pair
   */
  addEntanglement(pair: EntangledPair): void {
    this.entangledPairs.push(pair);
  }
  
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addStringField("id", this.id)
      .addNumberField("startTime", f64(this.startTime))
      .addNumberField("endTime", f64(this.endTime))
      .addNumberField("primeCount", f64(this.primes.length))
      .addNumberField("pairCount", f64(this.entangledPairs.length))
      .addNumberField("coherencePeak", this.coherencePeak)
      .addNumberField("energyAtEnd", this.energyAtEnd)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    return `Phrase(${this.id}, primes=${this.primes.length}, pairs=${this.entangledPairs.length})`;
  }
}

/**
 * Entanglement graph edge
 */
export class EntanglementEdge {
  constructor(
    public targetPrime: i32,
    public strength: f64
  ) {}
}

/**
 * Entanglement Layer
 * 
 * Manages semantic entanglement, phrase segmentation, and
 * associative bindings between primes.
 */
export class EntanglementLayer implements Serializable {
  /** Entanglement strength threshold */
  entanglementThreshold: f64;
  
  /** Coherence peak threshold for phrase segmentation */
  coherencePeakThreshold: f64;
  
  /** Energy trough threshold for phrase segmentation */
  energyTroughThreshold: f64;
  
  /** Strength decay rate */
  strengthDecay: f64;
  
  /** Minimum strength to keep */
  minStrength: f64;
  
  /** Current phrase */
  currentPhrase: Phrase | null;
  
  /** Completed phrases */
  phrases: Phrase[];
  
  /** Entanglement graph: prime -> neighbors */
  entanglementGraph: Map<i32, Map<i32, EntangledPair>>;
  
  /** Coherence history */
  coherenceHistory: f64[];
  
  /** Energy history */
  energyHistory: f64[];
  
  /** Max history length */
  maxHistory: i32;
  
  constructor(
    entanglementThreshold: f64 = 0.7,
    coherencePeakThreshold: f64 = 0.75,
    energyTroughThreshold: f64 = 0.15,
    strengthDecay: f64 = 0.01,
    minStrength: f64 = 0.1,
    maxHistory: i32 = 100
  ) {
    this.entanglementThreshold = entanglementThreshold;
    this.coherencePeakThreshold = coherencePeakThreshold;
    this.energyTroughThreshold = energyTroughThreshold;
    this.strengthDecay = strengthDecay;
    this.minStrength = minStrength;
    this.maxHistory = maxHistory;
    
    this.currentPhrase = null;
    this.phrases = [];
    this.entanglementGraph = new Map<i32, Map<i32, EntangledPair>>();
    this.coherenceHistory = [];
    this.energyHistory = [];
  }
  
  /**
   * Update entanglement layer with current oscillator state
   */
  update(
    oscillators: PrimeOscillator[],
    coherence: f64,
    energy: f64,
    semanticContent: string = ""
  ): EntanglementUpdateResult {
    // Update histories
    this.coherenceHistory.push(coherence);
    this.energyHistory.push(energy);
    
    if (this.coherenceHistory.length > this.maxHistory) {
      this.coherenceHistory.shift();
    }
    if (this.energyHistory.length > this.maxHistory) {
      this.energyHistory.shift();
    }
    
    // Check for phrase boundaries
    const isPeak = this.isCoherencePeak(coherence);
    const isTrough = this.isEnergyTrough(energy);
    
    if ((isPeak || isTrough) && this.currentPhrase !== null) {
      // End current phrase
      this.endPhrase(energy, semanticContent);
      
      // Start new phrase if coherence peak (continuing flow)
      if (isPeak) {
        this.startPhrase(coherence);
      }
    } else if (this.currentPhrase === null && oscillators.length > 0) {
      // Start first phrase
      this.startPhrase(coherence);
    }
    
    // Detect new entanglements
    const newPairs: EntangledPair[] = [];
    if (this.currentPhrase !== null) {
      const detected = this.detectEntanglements(oscillators);
      
      for (let i = 0; i < detected.length; i++) {
        const pair = detected[i];
        this.registerEntanglement(pair);
        this.currentPhrase!.addEntanglement(pair);
        newPairs.push(pair);
      }
      
      // Add active primes to current phrase
      for (let i = 0; i < oscillators.length; i++) {
        if (oscillators[i].amplitude > 0.1) {
          this.currentPhrase!.addPrime(oscillators[i].prime);
        }
      }
    }
    
    // Decay old entanglements
    this.decayEntanglements();
    
    return new EntanglementUpdateResult(
      this.currentPhrase,
      newPairs
    );
  }
  
  /**
   * Start a new phrase
   */
  startPhrase(coherence: f64): void {
    this.currentPhrase = new Phrase(coherence);
  }
  
  /**
   * End current phrase
   */
  endPhrase(energy: f64, semanticContent: string = ""): Phrase | null {
    if (this.currentPhrase === null) return null;
    
    const phrase = this.currentPhrase!;
    phrase.close(energy);
    phrase.semanticContent = semanticContent;
    
    this.phrases.push(phrase);
    this.currentPhrase = null;
    
    return phrase;
  }
  
  /**
   * Check if coherence is a local peak
   */
  isCoherencePeak(coherence: f64): bool {
    if (coherence < this.coherencePeakThreshold) return false;
    if (this.coherenceHistory.length < 3) return false;
    
    const n = this.coherenceHistory.length;
    const start = Math.max(0, n - 5) as i32;
    
    for (let i = start; i < n - 1; i++) {
      if (this.coherenceHistory[i] >= coherence) return false;
    }
    
    return true;
  }
  
  /**
   * Check if energy is at a local trough
   */
  isEnergyTrough(energy: f64): bool {
    return energy < this.energyTroughThreshold;
  }
  
  /**
   * Detect entanglements between oscillators (equation 16-17)
   */
  detectEntanglements(oscillators: PrimeOscillator[]): EntangledPair[] {
    const pairs: EntangledPair[] = [];
    
    for (let i = 0; i < oscillators.length; i++) {
      for (let j = i + 1; j < oscillators.length; j++) {
        const osc1 = oscillators[i];
        const osc2 = oscillators[j];
        
        // Both must be active
        if (osc1.amplitude < 0.1 || osc2.amplitude < 0.1) continue;
        
        // Compute entanglement strength (equation 17)
        const strength = this.computeStrength(osc1, osc2);
        
        if (strength > this.entanglementThreshold) {
          pairs.push(new EntangledPair(
            osc1.prime,
            osc2.prime,
            strength,
            Math.abs(osc1.phase - osc2.phase)
          ));
        }
      }
    }
    
    return pairs;
  }
  
  /**
   * Compute entanglement strength (equation 17)
   * strength(i,j) = ρφ * ρA
   * where ρφ = cos(Δφ) and ρA = min(Ai,Aj) / max(Ai,Aj)
   */
  computeStrength(osc1: PrimeOscillator, osc2: PrimeOscillator): f64 {
    // Phase correlation
    const deltaPhi = Math.abs(osc1.phase - osc2.phase);
    const rhoPhase = Math.cos(deltaPhi);
    
    // Amplitude correlation
    const minA = Math.min(osc1.amplitude, osc2.amplitude);
    const maxA = Math.max(osc1.amplitude, osc2.amplitude);
    const rhoAmplitude = minA / (maxA + 1e-10);
    
    return Math.max(0, rhoPhase * rhoAmplitude);
  }
  
  /**
   * Register an entanglement in the persistent graph
   */
  registerEntanglement(pair: EntangledPair): void {
    // Ensure both primes have entries
    if (!this.entanglementGraph.has(pair.prime1)) {
      this.entanglementGraph.set(pair.prime1, new Map<i32, EntangledPair>());
    }
    if (!this.entanglementGraph.has(pair.prime2)) {
      this.entanglementGraph.set(pair.prime2, new Map<i32, EntangledPair>());
    }
    
    const neighbors1 = this.entanglementGraph.get(pair.prime1);
    const neighbors2 = this.entanglementGraph.get(pair.prime2);
    
    if (neighbors1.has(pair.prime2)) {
      // Strengthen existing entanglement
      const existing = neighbors1.get(pair.prime2);
      existing.strength = Math.min(1.0, existing.strength + pair.strength * 0.1);
      existing.accessCount++;
    } else {
      // Create new entanglement
      neighbors1.set(pair.prime2, pair);
      
      // Create symmetric entry
      const reversePair = new EntangledPair(
        pair.prime2,
        pair.prime1,
        pair.strength,
        pair.phaseDiff
      );
      reversePair.formationTime = pair.formationTime;
      neighbors2.set(pair.prime1, reversePair);
    }
  }
  
  /**
   * Decay old entanglements
   */
  decayEntanglements(): void {
    const primesToCheck = this.entanglementGraph.keys();
    
    for (let i = 0; i < primesToCheck.length; i++) {
      const prime = primesToCheck[i];
      const neighbors = this.entanglementGraph.get(prime);
      const toRemove: i32[] = [];
      
      const neighborPrimes = neighbors.keys();
      for (let j = 0; j < neighborPrimes.length; j++) {
        const otherPrime = neighborPrimes[j];
        const pair = neighbors.get(otherPrime);
        pair.strength *= (1.0 - this.strengthDecay);
        
        if (pair.strength < this.minStrength) {
          toRemove.push(otherPrime);
        }
      }
      
      for (let j = 0; j < toRemove.length; j++) {
        neighbors.delete(toRemove[j]);
      }
    }
  }
  
  /**
   * Get all primes entangled with a given prime
   */
  getEntangled(prime: i32): EntangledPair[] {
    if (!this.entanglementGraph.has(prime)) return [];
    
    const neighbors = this.entanglementGraph.get(prime);
    const result: EntangledPair[] = [];
    
    const neighborPrimes = neighbors.keys();
    for (let i = 0; i < neighborPrimes.length; i++) {
      result.push(neighbors.get(neighborPrimes[i]));
    }
    
    // Sort by strength descending
    result.sort((a: EntangledPair, b: EntangledPair): i32 => {
      if (b.strength > a.strength) return 1;
      if (b.strength < a.strength) return -1;
      return 0;
    });
    
    return result;
  }
  
  /**
   * Find entanglement chain from source to target using BFS
   */
  findChain(sourcePrime: i32, targetPrime: i32, maxDepth: i32 = 5): i32[] | null {
    if (sourcePrime == targetPrime) return [sourcePrime];
    
    const queue: i32[][] = [[sourcePrime]];
    const visited = new Set<i32>();
    visited.add(sourcePrime);
    
    while (queue.length > 0) {
      const path = queue.shift();
      if (path.length > maxDepth) continue;
      
      const current = path[path.length - 1];
      if (!this.entanglementGraph.has(current)) continue;
      
      const neighbors = this.entanglementGraph.get(current);
      const neighborPrimes = neighbors.keys();
      
      for (let i = 0; i < neighborPrimes.length; i++) {
        const neighbor = neighborPrimes[i];
        
        if (neighbor == targetPrime) {
          const result = path.slice();
          result.push(neighbor);
          return result;
        }
        
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          const newPath = path.slice();
          newPath.push(neighbor);
          queue.push(newPath);
        }
      }
    }
    
    return null; // No path found
  }
  
  /**
   * Get strongly connected cluster around a prime
   */
  getCluster(prime: i32, minStrength: f64 = 0.3): i32[] {
    const cluster = new Set<i32>();
    cluster.add(prime);
    const queue: i32[] = [prime];
    
    while (queue.length > 0) {
      const current = queue.shift();
      if (!this.entanglementGraph.has(current)) continue;
      
      const neighbors = this.entanglementGraph.get(current);
      const neighborPrimes = neighbors.keys();
      
      for (let i = 0; i < neighborPrimes.length; i++) {
        const neighbor = neighborPrimes[i];
        const pair = neighbors.get(neighbor);
        
        if (!cluster.has(neighbor) && pair.strength >= minStrength) {
          cluster.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    const result: i32[] = [];
    const values = cluster.values();
    for (let i = 0; i < values.length; i++) {
      result.push(values[i]);
    }
    return result;
  }
  
  /**
   * Get the most strongly entangled prime
   */
  getMostEntangled(): MostEntangledResult {
    let maxPrime: i32 = -1;
    let maxTotal: f64 = 0;
    
    const primes = this.entanglementGraph.keys();
    for (let i = 0; i < primes.length; i++) {
      const prime = primes[i];
      const neighbors = this.entanglementGraph.get(prime);
      
      let total: f64 = 0;
      const neighborPrimes = neighbors.keys();
      for (let j = 0; j < neighborPrimes.length; j++) {
        total += neighbors.get(neighborPrimes[j]).strength;
      }
      
      if (total > maxTotal) {
        maxTotal = total;
        maxPrime = prime;
      }
    }
    
    return new MostEntangledResult(maxPrime, maxTotal);
  }
  
  /**
   * Trigger associative recall from a cue
   */
  associativeRecall(cuePrimes: i32[], depth: i32 = 2): AssociativeRecallResult[] {
    const recalled = new Map<i32, f64>();
    let frontier = new Set<i32>();
    
    for (let i = 0; i < cuePrimes.length; i++) {
      frontier.add(cuePrimes[i]);
    }
    
    for (let d = 0; d < depth; d++) {
      const newFrontier = new Set<i32>();
      const frontierValues = frontier.values();
      
      for (let i = 0; i < frontierValues.length; i++) {
        const prime = frontierValues[i];
        if (!this.entanglementGraph.has(prime)) continue;
        
        const neighbors = this.entanglementGraph.get(prime);
        const neighborPrimes = neighbors.keys();
        
        for (let j = 0; j < neighborPrimes.length; j++) {
          const neighbor = neighborPrimes[j];
          const pair = neighbors.get(neighbor);
          
          // Check if neighbor is in cuePrimes
          let inCue = false;
          for (let k = 0; k < cuePrimes.length; k++) {
            if (cuePrimes[k] == neighbor) {
              inCue = true;
              break;
            }
          }
          
          if (!inCue) {
            const currentStrength = recalled.has(neighbor) ? recalled.get(neighbor) : 0;
            // Decay by depth
            const addedStrength = pair.strength * Math.pow(0.7, f64(d));
            recalled.set(neighbor, currentStrength + addedStrength);
            newFrontier.add(neighbor);
          }
        }
      }
      
      frontier = newFrontier;
    }
    
    // Convert to result array
    const results: AssociativeRecallResult[] = [];
    const recalledPrimes = recalled.keys();
    for (let i = 0; i < recalledPrimes.length; i++) {
      const prime = recalledPrimes[i];
      results.push(new AssociativeRecallResult(prime, recalled.get(prime)));
    }
    
    // Sort by strength descending
    results.sort((a: AssociativeRecallResult, b: AssociativeRecallResult): i32 => {
      if (b.strength > a.strength) return 1;
      if (b.strength < a.strength) return -1;
      return 0;
    });
    
    return results;
  }
  
  /**
   * Get statistics about the entanglement graph
   */
  getStats(): EntanglementStats {
    let totalPairs: i32 = 0;
    let totalStrength: f64 = 0;
    let maxDegree: i32 = 0;
    
    const primes = this.entanglementGraph.keys();
    for (let i = 0; i < primes.length; i++) {
      const neighbors = this.entanglementGraph.get(primes[i]);
      const degree = neighbors.size;
      if (degree > maxDegree) maxDegree = degree;
      
      const neighborPrimes = neighbors.keys();
      for (let j = 0; j < neighborPrimes.length; j++) {
        totalPairs++;
        totalStrength += neighbors.get(neighborPrimes[j]).strength;
      }
    }
    
    // Each pair is counted twice (symmetric)
    totalPairs = totalPairs / 2;
    
    return new EntanglementStats(
      this.entanglementGraph.size,
      totalPairs,
      totalPairs > 0 ? totalStrength / f64(totalPairs * 2) : 0,
      maxDegree,
      this.phrases.length,
      this.currentPhrase !== null
    );
  }
  
  /**
   * Get recent phrases
   */
  recentPhrases(count: i32 = 10): Phrase[] {
    const start = Math.max(0, this.phrases.length - count) as i32;
    const result: Phrase[] = [];
    for (let i = start; i < this.phrases.length; i++) {
      result.push(this.phrases[i]);
    }
    return result;
  }
  
  /**
   * Clear all entanglements and phrases
   */
  reset(): void {
    this.entanglementGraph.clear();
    this.phrases = [];
    this.currentPhrase = null;
    this.coherenceHistory = [];
    this.energyHistory = [];
  }
  
  toJSON(): string {
    const stats = this.getStats();
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("nodeCount", f64(stats.nodeCount))
      .addNumberField("edgeCount", f64(stats.edgeCount))
      .addNumberField("averageStrength", stats.averageStrength)
      .addNumberField("maxDegree", f64(stats.maxDegree))
      .addNumberField("phraseCount", f64(stats.phraseCount))
      .addBooleanField("currentPhraseActive", stats.currentPhraseActive)
      .endObject();
    return builder.build();
  }
  
  toString(): string {
    const stats = this.getStats();
    return `EntanglementLayer(nodes=${stats.nodeCount}, edges=${stats.edgeCount}, phrases=${stats.phraseCount})`;
  }
}

/**
 * Entanglement update result
 */
export class EntanglementUpdateResult {
  constructor(
    public currentPhrase: Phrase | null,
    public newPairs: EntangledPair[]
  ) {}
}

/**
 * Most entangled result
 */
export class MostEntangledResult {
  constructor(
    public prime: i32,
    public totalStrength: f64
  ) {}
}

/**
 * Associative recall result
 */
export class AssociativeRecallResult {
  constructor(
    public prime: i32,
    public strength: f64
  ) {}
}

/**
 * Entanglement statistics
 */
export class EntanglementStats {
  constructor(
    public nodeCount: i32,
    public edgeCount: i32,
    public averageStrength: f64,
    public maxDegree: i32,
    public phraseCount: i32,
    public currentPhraseActive: bool
  ) {}
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create an entanglement layer
 */
export function createEntanglementLayer(
  entanglementThreshold: f64 = 0.7
): EntanglementLayer {
  return new EntanglementLayer(entanglementThreshold);
}