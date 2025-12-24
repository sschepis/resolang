import { addOscillator, clearOscillators, updatePhysics, CONFIG } from '../physics';
// @ts-ignore
import { describe, test, expect, beforeEach } from './mocks';

// @ts-ignore
describe("Physics Engine", () => {
  // @ts-ignore
  beforeEach(() => {
    clearOscillators();
  });

  // @ts-ignore
  test("should initialize with zero state", () => {
    const state = updatePhysics();
    // @ts-ignore
    expect(state.coherence).toBe(0.0);
    // @ts-ignore
    expect(state.totalEnergy).toBe(0.0);
  });

  // @ts-ignore
  test("should update single oscillator", () => {
    addOscillator(7, 1.0, 0.0);
    const state = updatePhysics();
    // @ts-ignore
    expect(state.totalEnergy).toBeCloseTo(CONFIG.dampening); // Amplitude dampened
    // @ts-ignore
    expect(state.coherence).toBe(1.0); // Single oscillator is always coherent with itself
  });

  // @ts-ignore
  test("should calculate coherence for multiple oscillators", () => {
    addOscillator(7, 1.0, 0.0);
    addOscillator(11, 1.0, 0.0); // In phase
    
    const state = updatePhysics();
    // @ts-ignore
    expect(state.coherence).toBeCloseTo(1.0);
  });

  // @ts-ignore
  test("should detect incoherence", () => {
    addOscillator(7, 1.0, 0.0);
    // @ts-ignore
    addOscillator(11, 1.0, 3.14159); // Out of phase (PI)
    
    const state = updatePhysics();
    // @ts-ignore
    expect(state.coherence).toBeLessThan(0.1);
  });
});