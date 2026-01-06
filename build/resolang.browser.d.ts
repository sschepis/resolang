// Browser-compatible TypeScript declarations for resolang

/**
 * Initialize the WASM module. Must be called before using any exports.
 * @param wasmUrl Optional URL to the WASM file. Defaults to resolang.wasm in the same directory.
 * @returns The initialized module exports
 */
export function init(wasmUrl?: string | URL): Promise<ResolangModule>;

/**
 * Check if the module is initialized
 */
export function isInitialized(): boolean;

/**
 * Get the module exports. Throws if not initialized.
 */
export function getModule(): ResolangModule;

export default init;

// Main module interface
export interface ResolangModule {
  // Memory and internals
  memory: WebAssembly.Memory;
  __pin: (ptr: number) => number;
  __unpin: (ptr: number) => void;
  __new: (size: number, id: number) => number;
  
  // Discrete Observer State
  createDiscreteObserverState(primes: number[], config?: DiscreteObserverConfig): DiscreteObserverState;
  discreteStep(state: DiscreteObserverState, driveInput?: Float64Array | null, plasticity?: boolean): DiscreteStepResult;
  getPhases(state: DiscreteObserverState): Int32Array;
  getAmplitudes(state: DiscreteObserverState): Float64Array;
  getSMF(state: DiscreteObserverState): Int32Array;
  getWeights(state: DiscreteObserverState): Int32Array;
  getStateMetrics(state: DiscreteObserverState): Float64Array;
  boostIndex(state: DiscreteObserverState, index: number): void;
  boostPrime(state: DiscreteObserverState, prime: number): void;
  dampenAll(state: DiscreteObserverState): void;
  applyHebbianLearning(state: DiscreteObserverState, activeIndices: Int32Array): boolean;
  updateSMF(state: DiscreteObserverState, activeIndices: Int32Array): void;
  computeHistogramCoherence(state: DiscreteObserverState): number;
  computeSmfEntropy(state: DiscreteObserverState): number;
  isLockedUp(state: DiscreteObserverState): boolean;
  
  // Quaternion functions
  createQuaternion(w: number, x: number, y: number, z: number): Quaternion;
  quaternionMultiply(q1: Quaternion, q2: Quaternion): Quaternion;
  quaternionNormalize(q: Quaternion): Quaternion;
  getQuaternionW(q: Quaternion): number;
  getQuaternionX(q: Quaternion): number;
  getQuaternionY(q: Quaternion): number;
  getQuaternionZ(q: Quaternion): number;
  
  // Pipeline functions
  createDiscretePipeline(): DiscretePipeline;
  createFastDiscretePipeline(): DiscretePipeline;
  
  // Config getters
  readonly DISCRETE_CONFIG: DiscreteObserverConfig;
  readonly DEFAULT_PRIMES: number[];
  readonly ENOCHIAN_PRIMES: number[];
  
  // SMF functions
  createSMFFromValues(values: Float64Array): SedenionMemoryField;
  createSMFFromText(text: string): SedenionMemoryField;
  
  // Math functions
  generatePrimes(n: number): number[];
  isPrimeOptimized(n: number): boolean;
  
  // String utilities
  escapeJSON(str: string): string;
  
  // State functions
  getSentientState(): string;
  discreteObserverGetState(): string;
  
  // Raw exports for advanced usage
  __exports: WebAssembly.Exports;
  __helpers: ResolangHelpers;
}

// Opaque handle types
export interface DiscreteObserverState {
  readonly __brand: 'DiscreteObserverState';
}

export interface DiscreteStepResult {
  readonly __brand: 'DiscreteStepResult';
}

export interface Quaternion {
  readonly __brand: 'Quaternion';
}

export interface DiscretePipeline {
  readonly __brand: 'DiscretePipeline';
}

export interface SedenionMemoryField {
  readonly __brand: 'SedenionMemoryField';
}

export interface DiscreteObserverConfig {
  amplitudeThreshold: number;
  delta: number;
  K: number;
  smfDecay: number;
  learningRate: number;
  stabilityWindow: number;
  lockupThreshold: number;
  tunnelingProbability: number;
}

export interface ResolangHelpers {
  __liftString(pointer: number): string | null;
  __lowerString(value: string | null): number;
  __liftArray<T>(liftElement: (ptr: number) => T, align: number, pointer: number): T[] | null;
  __lowerArray<T>(lowerElement: (ptr: number, value: T) => void, id: number, align: number, values: T[] | null): number;
  __liftTypedArray<T extends ArrayBufferView>(constructor: new (buffer: ArrayBuffer, byteOffset: number, length: number) => T, pointer: number): T | null;
  __lowerTypedArray<T extends ArrayBufferView>(constructor: new (...args: unknown[]) => T, id: number, align: number, values: T | null): number;
  __liftInternref(pointer: number): object | null;
  __lowerInternref(ref: object | null): number;
  __retain(pointer: number): number;
  __release(pointer: number): void;
  __getI32(pointer: number): number;
  __getU32(pointer: number): number;
  __getF64(pointer: number): number;
  __setU32(pointer: number, value: number): void;
  __setF64(pointer: number, value: number): void;
}