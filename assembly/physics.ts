/**
 * Core Physics Engine (WASM Port)
 * 
 * Implements:
 * - Prime Oscillator Dynamics
 * - Sedenion State Evolution
 * - Lyapunov Stability Analysis
 * - Coherence Bifurcation Detection
 */

// @ts-ignore
import { Sedenion } from './sedenion';
// @ts-ignore
import { getTwistAngle, getTwistRate } from './twist';
// @ts-ignore
import { PI } from './core/math';

// Configurable Physics Parameters
export class PhysicsConfig {
  // @ts-ignore
  public resonanceThreshold: f64 = 0.35;
  // @ts-ignore
  public couplingBase: f64 = 0.008;
  // @ts-ignore
  public simulationSpeed: f64 = 0.04;
  // @ts-ignore
  public dampening: f64 = 0.997;
  // @ts-ignore
  public lyapunovStableThreshold: f64 = -0.05;
}

// @ts-ignore
export const CONFIG: PhysicsConfig = new PhysicsConfig();

export class PrimeOscillator {
  // @ts-ignore
  public prime: i32;
  // @ts-ignore
  public frequency: f64;
  // @ts-ignore
  public amplitude: f64;
  // @ts-ignore
  public phase: f64;
  // @ts-ignore
  public twistAngle: f64;
  // @ts-ignore
  public twistRate: f64;
  // @ts-ignore
  public accumulatedTwist: f64;
  // @ts-ignore
  public phaseHistory: Array<f64>;

  // @ts-ignore
  constructor(prime: i32, amplitude: f64, phase: f64) {
    this.prime = prime;
    // PRSC formalism: f = 1 + ln(p)/10 (incommensurate frequencies)
    // @ts-ignore
    this.frequency = 1.0 + Math.log(f64(prime)) / 10.0;
    this.amplitude = amplitude;
    this.phase = phase;
    this.twistAngle = getTwistAngle(prime);
    this.twistRate = getTwistRate(prime, 1.0);
    this.accumulatedTwist = 0.0;
    // @ts-ignore
    this.phaseHistory = new Array<f64>();
  }

  // @ts-ignore
  update(dt: f64, couplingStrength: f64, allOscillators: Array<PrimeOscillator>): void {
    // Record history for Lyapunov
    this.phaseHistory.push(this.phase);
    if (this.phaseHistory.length > 50) {
      this.phaseHistory.shift();
    }

    // Evolve phase
    this.phase += this.frequency * dt;
    this.accumulatedTwist += this.twistRate * dt;

    // PRSC formalism: True Kuramoto coupling with pairwise sin(φⱼ-φᵢ) summation
    // dφᵢ/dt = ωᵢ + (K/N) Σⱼ sin(φⱼ - φᵢ)
    if (allOscillators.length > 1) {
      // @ts-ignore
      let kuramotoSum: f64 = 0.0;
      for (let j = 0; j < allOscillators.length; j++) {
        const other = allOscillators[j];
        if (other.prime != this.prime) {
          kuramotoSum += Math.sin(other.phase - this.phase);
        }
      }
      // @ts-ignore
      this.phase += (couplingStrength / f64(allOscillators.length)) * kuramotoSum;
    }

    // Wrap phase
    // @ts-ignore
    const twoPi = 2.0 * PI;
    if (this.phase > twoPi) this.phase -= twoPi;
    if (this.phase < 0) this.phase += twoPi;

    // Dampen amplitude
    this.amplitude *= CONFIG.dampening;
  }

  // @ts-ignore
  getValue(): f64 {
    return Math.sin(this.phase) * this.amplitude;
  }
}

export class PhysicsState {
  // @ts-ignore
  constructor(
    // @ts-ignore
    public coherence: f64,
    // @ts-ignore
    public totalEnergy: f64,
    // @ts-ignore
    public entropy: f64,
    // @ts-ignore
    public lyapunovExponent: f64,
    public isStable: boolean
  ) {}
}

// Global state for oscillators
// @ts-ignore
export let oscillators: Array<PrimeOscillator> = new Array<PrimeOscillator>();

// @ts-ignore
export function addOscillator(prime: i32, amplitude: f64, phase: f64): void {
  oscillators.push(new PrimeOscillator(prime, amplitude, phase));
}

export function clearOscillators(): void {
  // @ts-ignore
  oscillators = new Array<PrimeOscillator>();
}

// @ts-ignore
export function updatePhysics(): PhysicsState {
  // Calculate mean phase
  // @ts-ignore
  let sumX: f64 = 0.0;
  // @ts-ignore
  let sumY: f64 = 0.0;
  // @ts-ignore
  let totalEnergy: f64 = 0.0;
  let hasMeanPhase = false;
  // @ts-ignore
  let meanPhase: f64 = 0.0;

  if (oscillators.length > 0) {
    for (let i = 0; i < oscillators.length; i++) {
      const p = oscillators[i];
      sumX += Math.cos(p.phase);
      sumY += Math.sin(p.phase);
      totalEnergy += p.amplitude;
    }
    meanPhase = Math.atan2(sumY, sumX);
    hasMeanPhase = true;
  }

  // Calculate Lyapunov Exponent
  // @ts-ignore
  let totalLyapunov: f64 = 0.0;
  // @ts-ignore
  let validOscillators: i32 = 0;
  // @ts-ignore
  const twoPi = 2.0 * PI;

  for (let i = 0; i < oscillators.length; i++) {
    const p = oscillators[i];
    if (p.phaseHistory.length < 2) continue;

    // @ts-ignore
    let divergenceSum: f64 = 0.0;
    for (let j = 1; j < p.phaseHistory.length; j++) {
      let diff = Math.abs(p.phaseHistory[j] - p.phaseHistory[j - 1]);
      if (diff > PI) diff = twoPi - diff;
      if (diff > 0.001) {
        divergenceSum += Math.log(diff);
      }
    }
    // @ts-ignore
    totalLyapunov += divergenceSum / f64(p.phaseHistory.length);
    validOscillators++;
  }

  // @ts-ignore
  const lyapunovExponent = validOscillators > 0 ? totalLyapunov / f64(validOscillators) : 0.0;
  
  // Adaptive coupling
  let adaptiveCoupling = CONFIG.couplingBase;
  if (lyapunovExponent > CONFIG.lyapunovStableThreshold) {
    const instability = lyapunovExponent - CONFIG.lyapunovStableThreshold;
    adaptiveCoupling = CONFIG.couplingBase * (1.0 + instability * 2.0);
  }

  // Update oscillators with true Kuramoto coupling
  for (let i = 0; i < oscillators.length; i++) {
    oscillators[i].update(CONFIG.simulationSpeed, adaptiveCoupling, oscillators);
  }

  // Calculate Coherence
  // @ts-ignore
  let coherence: f64 = 0.0;
  if (oscillators.length > 0) {
    // @ts-ignore
    let sumCos: f64 = 0.0;
    // @ts-ignore
    let sumSin: f64 = 0.0;
    for (let i = 0; i < oscillators.length; i++) {
      sumCos += Math.cos(oscillators[i].phase);
      sumSin += Math.sin(oscillators[i].phase);
    }
    // @ts-ignore
    coherence = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / f64(oscillators.length);
  }

  // Calculate Entropy
  // @ts-ignore
  let entropy: f64 = 0.0;
  if (totalEnergy > 0) {
    for (let i = 0; i < oscillators.length; i++) {
      const p = oscillators[i];
      const prob = p.amplitude / totalEnergy;
      if (prob > 0) {
        entropy -= prob * Math.log(prob);
      }
    }
  }

  const isStable = lyapunovExponent < CONFIG.lyapunovStableThreshold;

  return new PhysicsState(
    coherence,
    totalEnergy,
    entropy,
    lyapunovExponent,
    isStable
  );
}