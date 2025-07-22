// assembly/runtime/entropy/evolution.ts
// Entropy evolution dynamics for RISA runtime

/**
 * System entropy state
 */
export class IEntropyState {
  constructor(
    public current: f64,
    public initial: f64,
    public lambda: f64,
    public elapsedTime: f64,
    public lastUpdate: f64
  ) {}
}

/**
 * Entropy evolution engine interface
 */
export interface IEntropyEngine {
  getState(): IEntropyState;
  evolve(deltaTime: f64): void;
  setParameters(initial: f64, lambda: f64): void;
  reset(): void;
  getCurrentEntropy(): f64;
}

/**
 * Entropy evolution engine implementation
 */
export class EntropyEngine implements IEntropyEngine {
  private state: IEntropyState;

  constructor(initial: f64 = 1.0, lambda: f64 = 0.1) {
    this.state = new IEntropyState(
      initial,
      initial,
      lambda,
      0,
      Date.now()
    );
  }

  getState(): IEntropyState {
    return this.state;
  }

  evolve(deltaTime: f64): void {
    const now = Date.now();
    
    if (deltaTime <= 0) {
        deltaTime = (now - this.state.lastUpdate) / 1000; // in seconds
    }
      
    this.state.elapsedTime += deltaTime;
    
    this.state.current = this.state.initial * Math.exp(-this.state.lambda * this.state.elapsedTime);
    
    this.state.lastUpdate = now;
  }

  setParameters(initial: f64, lambda: f64): void {
    this.state.initial = initial;
    this.state.lambda = lambda;
    this.reset();
  }

  reset(): void {
    this.state.current = this.state.initial;
    this.state.elapsedTime = 0;
    this.state.lastUpdate = Date.now();
  }

  getCurrentEntropy(): f64 {
    return this.state.current;
  }
}