import { PrimeState } from './quantum/prime-state';
import { Complex } from './types';

export function createPrimeState(): PrimeState {
  return new PrimeState();
}

export function getPrimeStateAmplitudes(state: PrimeState): Map<f64, f64> {
    const newMap = new Map<f64, f64>();
    const keys = state.amplitudes.keys();
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        newMap.set(key, state.amplitudes.get(key));
    }
    return newMap;
}

export function getPrimeStateCoefficients(state: PrimeState): Array<Complex> {
    return state.coefficients;
}

export function setPrimeStateAmplitudes(state: PrimeState, amplitudes: Map<f64, f64>): void {
    const newMap = new Map<u32, f64>();
    const keys = amplitudes.keys();
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        newMap.set(u32(key), amplitudes.get(key));
    }
    state.amplitudes = newMap;
}