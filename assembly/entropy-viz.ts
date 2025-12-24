import { ResonantFragment, EntangledNode } from './resolang';
import { PrimeState } from './quantum/prime-state';
import { Quaternion, QuaternionicResonanceField } from './quaternion';

// Data structure for entropy field visualization
export class EntropyFieldData {
  timestamp: f64;
  fragmentEntropies: Map<string, f64>;
  nodeCoherences: Map<string, f64>;
  primeAmplitudes: Map<u32, f64>;
  quaternionPhases: Map<u32, f64>;
  fieldIntensities: Array<f64>;
  
  constructor() {
    this.timestamp = 0;
    this.fragmentEntropies = new Map<string, f64>();
    this.nodeCoherences = new Map<string, f64>();
    this.primeAmplitudes = new Map<u32, f64>();
    this.quaternionPhases = new Map<u32, f64>();
    this.fieldIntensities = new Array<f64>();
  }
}

// Entropy field sampler for visualization
export class EntropyFieldSampler {
  data: EntropyFieldData;
  private sampleRate: f64;
  private _gridSize: i32; // Renamed to avoid conflict with getter
  
  constructor(sampleRate: f64 = 0.1, gridSize: i32 = 50) {
    this.data = new EntropyFieldData();
    this.sampleRate = sampleRate;
    this._gridSize = gridSize;
  }

  get gridSize(): i32 {
    return this._gridSize;
  }
  
  // Sample entropy from a ResonantFragment
  sampleFragment(fragment: ResonantFragment, id: string): void {
    this.data.fragmentEntropies.set(id, fragment.entropy);
  }
  
  // Sample coherence from an EntangledNode
  sampleNode(node: EntangledNode): void {
    this.data.nodeCoherences.set(node.id, node.coherence);
  }
  
  // Sample amplitudes from a PrimeState
  samplePrimeState(state: PrimeState): void {
    const primes = state.amplitudes.keys();
    for (let i = 0; i < primes.length; i++) {
      const p = primes[i];
      if (state.amplitudes.has(p)) {
        this.data.primeAmplitudes.set(p, state.amplitudes.get(p)!);
      }
    }
  }
  
  // Sample phase from a Quaternion
  sampleQuaternion(q: Quaternion, prime: u32): void {
    const phase = Math.atan2(Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z), q.w);
    this.data.quaternionPhases.set(prime, phase);
  }
  
  // Sample 2D entropy field
  sampleField2D(
    field: (x: f64, y: f64) => f64,
    xMin: f64, xMax: f64,
    yMin: f64, yMax: f64
  ): Array<f64> {
    const samples = new Array<f64>();
    const dx = (xMax - xMin) / f64(this.gridSize - 1);
    const dy = (yMax - yMin) / f64(this.gridSize - 1);
    
    for (let j = 0; j < this.gridSize; j++) {
      for (let i = 0; i < this.gridSize; i++) {
        const x = xMin + i * dx;
        const y = yMin + j * dy;
        samples.push(field(x, y));
      }
    }
    
    this.data.fieldIntensities = samples;
    return samples;
  }
  
  // Export data for visualization
  exportData(): string {
    let json = '{';
    json += '"timestamp":' + this.data.timestamp.toString() + ',';
    
    // Export fragment entropies
    json += '"fragments":{';
    const fragKeys = this.data.fragmentEntropies.keys();
    for (let i = 0; i < fragKeys.length; i++) {
      if (i > 0) json += ',';
      const key = fragKeys[i];
      json += '"' + key + '":' + this.data.fragmentEntropies.get(key)!.toString();
    }
    json += '},';
    
    // Export node coherences
    json += '"nodes":{';
    const nodeKeys = this.data.nodeCoherences.keys();
    for (let i = 0; i < nodeKeys.length; i++) {
      if (i > 0) json += ',';
      const key = nodeKeys[i];
      json += '"' + key + '":' + this.data.nodeCoherences.get(key)!.toString();
    }
    json += '},';
    
    // Export prime amplitudes
    json += '"primes":{';
    const primeKeys = this.data.primeAmplitudes.keys();
    for (let i = 0; i < primeKeys.length; i++) {
      if (i > 0) json += ',';
      const key = primeKeys[i];
      json += '"' + key.toString() + '":' + this.data.primeAmplitudes.get(key)!.toString();
    }
    json += '},';
    
    // Export quaternion phases
    json += '"quaternions":{';
    const quatKeys = this.data.quaternionPhases.keys();
    for (let i = 0; i < quatKeys.length; i++) {
      if (i > 0) json += ',';
      const key = quatKeys[i];
      json += '"' + key.toString() + '":' + this.data.quaternionPhases.get(key)!.toString();
    }
    json += '},';
    
    // Export field intensities
    json += '"field":[';
    for (let i = 0; i < this.data.fieldIntensities.length; i++) {
      if (i > 0) json += ',';
      json += this.data.fieldIntensities[i].toString();
    }
    json += ']';
    
    json += '}';
    return json;
  }
  
  // Update timestamp
  updateTime(t: f64): void {
    this.data.timestamp = t;
  }
}

// Entropy evolution tracker
export class EntropyEvolutionTracker {
  private history: Array<EntropyFieldData>;
  private maxHistory: i32;
  private sampler: EntropyFieldSampler;
  
  constructor(maxHistory: i32 = 100) {
    this.history = new Array<EntropyFieldData>();
    this.maxHistory = maxHistory;
    this.sampler = new EntropyFieldSampler();
  }

  getHistory(): Array<EntropyFieldData> {
    return this.history;
  }
  
  // Record current state
  recordState(
    fragments: Map<string, ResonantFragment>,
    nodes: Map<string, EntangledNode>,
    primeStates: Array<PrimeState>
  ): void {
    // Sample all fragments
    const fragKeys = fragments.keys();
    for (let i = 0; i < fragKeys.length; i++) {
      const key = fragKeys[i];
      if (fragments.has(key)) {
        this.sampler.sampleFragment(fragments.get(key)!, key);
      }
    }
    
    // Sample all nodes
    const nodeKeys = nodes.keys();
    for (let i = 0; i < nodeKeys.length; i++) {
      const key = nodeKeys[i];
      if (nodes.has(key)) {
        this.sampler.sampleNode(nodes.get(key)!);
      }
    }
    
    // Sample prime states
    for (let i = 0; i < primeStates.length; i++) {
      this.sampler.samplePrimeState(primeStates[i]);
    }
    
    // Store snapshot
    if (this.history.length >= this.maxHistory) {
      this.history.shift(); // Remove oldest
    }
    this.history.push(this.sampler.data);
    this.sampler = new EntropyFieldSampler(); // Reset for next sample
  }
  
  // Get entropy gradient at a point
  getEntropyGradient(x: f64, y: f64, field: (x: f64, y: f64) => f64): Array<f64> {
    const h = 0.001;
    const dfdx = (field(x + h, y) - field(x - h, y)) / (2 * h);
    const dfdy = (field(x, y + h) - field(x, y - h)) / (2 * h);
    return [dfdx, dfdy];
  }
  
  // Find entropy minima/maxima
  findCriticalPoints(
    field: (x: f64, y: f64) => f64,
    xMin: f64, xMax: f64,
    yMin: f64, yMax: f64,
    resolution: i32 = 20
  ): Array<Array<f64>> {
    const criticalPoints = new Array<Array<f64>>();
    const dx = (xMax - xMin) / f64(resolution - 1);
    const dy = (yMax - yMin) / f64(resolution - 1);
    
    for (let j = 1; j < resolution - 1; j++) {
      for (let i = 1; i < resolution - 1; i++) {
        const x = xMin + i * dx;
        const y = yMin + j * dy;
        
        const grad = this.getEntropyGradient(x, y, field);
        if (Math.abs(grad[0]) < 0.15 && Math.abs(grad[1]) < 0.15) {
          criticalPoints.push([x, y, field(x, y)]);
        }
      }
    }
    
    return criticalPoints;
  }
  
  // Export evolution history
  exportHistory(): string {
    let json = '[';
    for (let i = 0; i < this.history.length; i++) {
      if (i > 0) json += ',';
      // Simplified export for history
      json += '{"index":' + i.toString() + '}';
    }
    json += ']';
    return json;
  }
}

// Global sampler instance for easy access
let globalSampler: EntropyFieldSampler | null = null;
let globalTracker: EntropyEvolutionTracker | null = null;
 
export function initializeEntropyViz(): void {
  globalSampler = new EntropyFieldSampler();
  globalTracker = new EntropyEvolutionTracker();
}
 
export function getGlobalSampler(): EntropyFieldSampler {
  if (!globalSampler) {
    initializeEntropyViz();
  }
  return globalSampler!;
}
 
export function getGlobalTracker(): EntropyEvolutionTracker {
  if (!globalTracker) {
    initializeEntropyViz();
  }
  return globalTracker!;
}
 
// Export function for WebAssembly
export function exportEntropyData(): string {
  return getGlobalSampler().exportData();
}
 
export function exportEntropyHistory(): string {
  return getGlobalTracker().exportHistory();
}