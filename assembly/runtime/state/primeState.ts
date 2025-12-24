// assembly/runtime/state/primeState.ts

import { Complex } from "../../types";

/**
 * Represents the state of a quantum number, which is a superposition of prime states.
 * |n> = Σᵢ√(aᵢ/A)|pᵢ>
 */
export interface IQuantumNumberState {
  number: i32;
  primeAmplitudes: Map<i32, Complex>; // Map of prime -> amplitude
  totalAmplitude: f64;
  getProbability(prime: i32): f64;
  normalize(): void;
}

/**
 * Defines the types of bases available for transformation.
 */
export enum BasisType {
  PRIME,
  FOURIER,
  WAVELET,
  POLYNOMIAL,
  MODULAR
}

/**
 * A placeholder interface for the prime state.
 */
export interface IPrimeState {
  // This would contain properties related to the prime state.
}

export class OscillatorState {
  constructor(public amplitude: f64, public phase: f64) {}
}


/**
 * The prime state engine, extended with quantum-like features,
 * including multi-basis representations and resonance operators.
 */
export interface IPrimeStateEngine {
   /**
   * Creates a quantum number state from a given integer 'n'.
   * @param n The integer to represent as a quantum state.
   * @returns An IQuantumNumberState object.
   */
  createNumberState(n: i32): IQuantumNumberState;

  /**
   * Applies a resonance operator to a prime state.
   * R(n)|p> = e^(2πi log_p(n))|p>
   * @param n The number defining the resonance.
   * @param prime The prime to apply the operator to.
   * @returns The resulting complex number.
   */
  applyResonanceOperator(n: i32, prime: i32): Complex;

  /**
   * Transforms the current prime state to a different basis.
   * @param basis The target basis to transform to.
   * @returns A new IPrimeState in the target basis.
   */
  transformToBasis(basis: BasisType): IPrimeState;

  /**
   * Computes the coherence between two primes in the state.
   * C(p₁,p₂) = cos(φ[p₁] - φ[p₂]) × ψ[p₁] × ψ[p₂]
   * @param p1 The first prime.
   * @param p2 The second prime.
   * @returns The coherence value.
   */
  computePairwiseCoherence(p1: i32, p2: i32): f64;

  /**
   * Gets the state of a single prime oscillator.
   */
  getOscillator(prime: i32): OscillatorState;

  /**
   * Gets a list of all active primes.
   */
  getActivePrimes(): i32[];

  /**
   * Gets a map of all oscillators.
   */
  getAllOscillators(): Map<i32, OscillatorState>;

  /**
   * Resets the prime state.
   */
  reset(): void;

  /**
   * Sets the amplitude of a prime.
   */
  setAmplitude(prime: i32, amplitude: f64): void;

  /**
   * Normalizes the prime state.
   */
  normalize(): void;

  /**
   * Gets the amplitude of a prime.
   */
  getAmplitude(prime: i32): f64;

  /**
   * Gets the phase of a prime.
   */
  getPhase(prime: i32): f64;

  /**
   * Sets the phase of a prime.
   */
  setPhase(prime: i32, phase: f64): void;

  /**
   * Entangles two primes.
   */
  entangle(prime1: i32, prime2: i32): void;
}

export class PrimeStateEngine implements IPrimeStateEngine {
    private primeAmplitudes: Map<i32, Complex> = new Map();
    private phases: Map<i32, f64> = new Map();

    createNumberState(n: i32): IQuantumNumberState {
        // This is a simplified factorization for demonstration.
        // A real implementation would use a more sophisticated algorithm.
        const factors = new Map<i32, i32>();
        let num = n;
        let i = 2;
        while (i * i <= num) {
            if (num % i === 0) {
                factors.set(i, (factors.get(i) || 0) + 1);
                num /= i;
            } else {
                i++;
            }
        }
        if (num > 1) {
            factors.set(num, (factors.get(num) || 0) + 1);
        }

        const primeAmplitudes = new Map<i32, Complex>();
        let totalAmplitude: f64 = 0;
        const keys = factors.keys();
        for(let i = 0; i < keys.length; i++) {
            const prime = keys[i];
            const power = factors.get(prime);
            const amplitude = Math.sqrt(power as f64);
            primeAmplitudes.set(prime, new Complex(amplitude, 0));
            totalAmplitude += power as f64;
        }

        return new QuantumNumberState(n, primeAmplitudes, totalAmplitude);
    }

    applyResonanceOperator(n: i32, prime: i32): Complex {
        // R(n)|p> = e^(2πi log_p(n))|p>
        const log_p_n = Math.log(n as f64) / Math.log(prime as f64);
        const exponent = new Complex(0, 2 * Math.PI * log_p_n);
        return exponent.exp();
    }

    transformToBasis(basis: BasisType): IPrimeState {
        // Placeholder for basis transformation logic.
        // console.log(`Transforming to ${basis} basis...`);
        return {};
    }

    computePairwiseCoherence(p1: i32, p2: i32): f64 {
        const phase1 = this.phases.get(p1) || 0;
        const phase2 = this.phases.get(p2) || 0;
        const amp1 = this.primeAmplitudes.has(p1) ? this.primeAmplitudes.get(p1).abs() : 0;
        const amp2 = this.primeAmplitudes.has(p2) ? this.primeAmplitudes.get(p2).abs() : 0;

        return Math.cos(phase1 - phase2) * amp1 * amp2;
    }

    getOscillator(prime: i32): OscillatorState {
        const amp = this.primeAmplitudes.has(prime) ? this.primeAmplitudes.get(prime).abs() : 0;
        const phase = this.phases.get(prime) || 0;
        return new OscillatorState(amp, phase);
    }

    getActivePrimes(): i32[] {
        return this.primeAmplitudes.keys();
    }

    getAllOscillators(): Map<i32, OscillatorState> {
        const oscillators = new Map<i32, OscillatorState>();
        const keys = this.primeAmplitudes.keys();
        for (let i = 0; i < keys.length; i++) {
            const prime = keys[i];
            oscillators.set(prime, this.getOscillator(prime));
        }
        return oscillators;
    }

    reset(): void {
        this.primeAmplitudes.clear();
        this.phases.clear();
    }

    setAmplitude(prime: i32, amplitude: f64): void {
        // This is a simplified implementation. A real implementation would
        // also need to handle the phase component of the complex number.
        this.primeAmplitudes.set(prime, new Complex(amplitude, 0));
    }

    normalize(): void {
        let sumOfSquares: f64 = 0;
        const values = this.primeAmplitudes.values();
        for (let i = 0; i < values.length; i++) {
            sumOfSquares += Math.pow(values[i].abs(), 2);
        }
        const norm = Math.sqrt(sumOfSquares);
        if (norm === 0) return;

        const keys = this.primeAmplitudes.keys();
        for (let i = 0; i < keys.length; i++) {
            const prime = keys[i];
            const amp = this.primeAmplitudes.get(prime);
            this.primeAmplitudes.set(prime, amp.div(new Complex(norm, 0)));
        }
    }

    getAmplitude(prime: i32): f64 {
        if (this.primeAmplitudes.has(prime)) {
            return this.primeAmplitudes.get(prime).abs();
        }
        return 0;
    }

    getPhase(prime: i32): f64 {
        return this.phases.get(prime) || 0;
    }

    setPhase(prime: i32, phase: f64): void {
        this.phases.set(prime, phase);
    }

    entangle(prime1: i32, prime2: i32): void {
        // Simplified entanglement: copy phase from prime1 to prime2
        const phase1 = this.getPhase(prime1);
        this.setPhase(prime2, phase1);
    }
}

class QuantumNumberState implements IQuantumNumberState {
    constructor(
        public number: i32,
        public primeAmplitudes: Map<i32, Complex>,
        public totalAmplitude: f64
    ) {}

    getProbability(prime: i32): f64 {
        if (!this.primeAmplitudes.has(prime)) return 0;
        const amplitude = this.primeAmplitudes.get(prime);
        return Math.pow(amplitude.abs(), 2) / this.totalAmplitude;
    }

    normalize(): void {
        let sumOfSquares: f64 = 0;
        const values = this.primeAmplitudes.values();
        for (let i = 0; i < values.length; i++) {
            sumOfSquares += Math.pow(values[i].abs(), 2);
        }
        const norm = Math.sqrt(sumOfSquares);
        if (norm === 0) return;

        const keys = this.primeAmplitudes.keys();
        for (let i = 0; i < keys.length; i++) {
            const prime = keys[i];
            const amp = this.primeAmplitudes.get(prime);
            this.primeAmplitudes.set(prime, amp.div(new Complex(norm, 0)));
        }
        this.totalAmplitude = 1;
    }
}