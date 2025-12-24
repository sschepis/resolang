/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * assembly/core/math/generatePrimes
 * @param n `i32`
 * @returns `~lib/array/Array<u32>`
 */
export declare function generatePrimes(n: number): Array<number>;
/**
 * assembly/core/serialization/escapeJSON
 * @param str `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function escapeJSON(str: string): string;
/** assembly/core/constants/PHI */
export declare const PHI: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/E */
export declare const E: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/TWO_PI */
export declare const TWO_PI: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/MERSENNE_PRIME_31 */
export declare const MERSENNE_PRIME_31: {
  /** @type `u64` */
  get value(): bigint
};
/**
 * assembly/core/constants/generateUniqueId
 * @param prefix `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function generateUniqueId(prefix: string): string;
/**
 * assembly/core/constants/degreesToRadians
 * @param degrees `f64`
 * @returns `f64`
 */
export declare function degreesToRadians(degrees: number): number;
/**
 * assembly/core/constants/radiansToDegrees
 * @param radians `f64`
 * @returns `f64`
 */
export declare function radiansToDegrees(radians: number): number;
/**
 * assembly/examples/comprehensive-benchmark-suite/runFullValidationSuite
 * @returns `~lib/string/String`
 */
export declare function runFullValidationSuite(): string;
/**
 * assembly/examples/test-comprehensive-benchmark-suite/runBenchmarkTests
 * @returns `assembly/examples/test-comprehensive-benchmark-suite/BenchmarkTestSuite`
 */
export declare function runBenchmarkTests(): __Internref219;
/** assembly/smf/SMF_CONFIG */
export declare const SMF_CONFIG: {
  /** @type `assembly/smf/SMFConfig` */
  get value(): __Record181<never>
};
/** assembly/smf/SEMANTIC_AXES */
export declare const SEMANTIC_AXES: {
  /** @type `~lib/array/Array<~lib/string/String>` */
  get value(): Array<string>
};
/** assembly/smf/AXIS_COHERENCE */
export declare const AXIS_COHERENCE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_IDENTITY */
export declare const AXIS_IDENTITY: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_DUALITY */
export declare const AXIS_DUALITY: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_STRUCTURE */
export declare const AXIS_STRUCTURE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_CHANGE */
export declare const AXIS_CHANGE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_LIFE */
export declare const AXIS_LIFE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_HARMONY */
export declare const AXIS_HARMONY: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_WISDOM */
export declare const AXIS_WISDOM: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_INFINITY */
export declare const AXIS_INFINITY: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_CREATION */
export declare const AXIS_CREATION: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_TRUTH */
export declare const AXIS_TRUTH: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_LOVE */
export declare const AXIS_LOVE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_POWER */
export declare const AXIS_POWER: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_TIME */
export declare const AXIS_TIME: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_SPACE */
export declare const AXIS_SPACE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/smf/AXIS_CONSCIOUSNESS */
export declare const AXIS_CONSCIOUSNESS: {
  /** @type `i32` */
  get value(): number
};
/**
 * assembly/smf/createSMFFromValues
 * @param values `~lib/typedarray/Float64Array`
 * @returns `assembly/smf/SedenionMemoryField`
 */
export declare function createSMFFromValues(values: Float64Array): __Internref183;
/**
 * assembly/smf/createSMFFromText
 * @param text `~lib/string/String`
 * @returns `assembly/smf/SedenionMemoryField`
 */
export declare function createSMFFromText(text: string): __Internref183;
/**
 * assembly/state/createSnapshot
 * @param timestamp `i64`
 * @param coherence `f64`
 * @param entropy `f64`
 * @param numOscillators `i32`
 * @returns `assembly/state/StateSnapshot`
 */
export declare function createSnapshot(timestamp: bigint, coherence: number, entropy: number, numOscillators: number): __Internref193;
/**
 * assembly/sentient/createSentientCore
 * @param numPrimes `i32`
 */
export declare function createSentientCore(numPrimes: number): void;
/**
 * assembly/sentient/startSentientCore
 * @param timestamp `i64`
 */
export declare function startSentientCore(timestamp: bigint): void;
/**
 * assembly/sentient/stopSentientCore
 */
export declare function stopSentientCore(): void;
/**
 * assembly/sentient/tickSentientCore
 * @param dt `f64`
 * @param timestamp `i64`
 * @returns `i32`
 */
export declare function tickSentientCore(dt: number, timestamp: bigint): number;
/**
 * assembly/sentient/getSentientCoherence
 * @returns `f64`
 */
export declare function getSentientCoherence(): number;
/**
 * assembly/sentient/getSentientEntropy
 * @returns `f64`
 */
export declare function getSentientEntropy(): number;
/**
 * assembly/sentient/getSentientSMFAxis
 * @param index `i32`
 * @returns `f64`
 */
export declare function getSentientSMFAxis(index: number): number;
/**
 * assembly/sentient/getSentientPhase
 * @param index `i32`
 * @returns `f64`
 */
export declare function getSentientPhase(index: number): number;
/**
 * assembly/sentient/getSentientAmplitude
 * @param index `i32`
 * @returns `f64`
 */
export declare function getSentientAmplitude(index: number): number;
/**
 * assembly/sentient/exciteSentientOscillator
 * @param index `i32`
 * @param amplitude `f64`
 */
export declare function exciteSentientOscillator(index: number, amplitude: number): void;
/**
 * assembly/sentient/resetSentientCore
 */
export declare function resetSentientCore(): void;
/**
 * assembly/sentient/getSentientState
 * @returns `~lib/string/String`
 */
export declare function getSentientState(): string;
/** assembly/resolang/currentNode */
export declare const currentNode: {
  /** @type `assembly/resolang/EntangledNode | null` */
  get value(): __Internref4 | null;
  set value(value: __Internref4 | null);
};
/**
 * assembly/resolang/setCurrentNode
 * @param node `assembly/resolang/EntangledNode | null`
 */
export declare function setCurrentNode(node: __Internref4 | null): void;
/** assembly/resolang/PI */
export declare const PI: {
  /** @type `f64` */
  get value(): number
};
/**
 * assembly/resolang/createResonantFragment
 * @param pattern `~lib/string/String`
 * @param spatialEntropy `f64`
 * @param angularPosition `f64`
 * @returns `assembly/resolang/ResonantFragment`
 */
export declare function createResonantFragment(pattern: string, spatialEntropy?: number, angularPosition?: number): __Internref86;
/**
 * assembly/resolang/generateEntangledNode
 * @param p1 `u32`
 * @param p2 `u32`
 * @param p3 `u32`
 * @returns `assembly/resolang/EntangledNode`
 */
export declare function generateEntangledNode(p1: number, p2: number, p3: number): __Internref4;
/**
 * assembly/resolang/createAttractor
 * @param symbol `~lib/string/String`
 * @param coherence `f64`
 * @returns `assembly/resolang/Attractor`
 */
export declare function createAttractor(symbol: string, coherence?: number): __Internref227;
/**
 * assembly/resolang/resonantFragmentToJSON
 * @param fragment `assembly/resolang/ResonantFragment`
 * @returns `~lib/string/String`
 */
export declare function resonantFragmentToJSON(fragment: __Internref86): string;
/**
 * assembly/operators/tensor
 * @param fragmentA `assembly/resolang/ResonantFragment`
 * @param fragmentB `assembly/resolang/ResonantFragment`
 * @returns `assembly/resolang/ResonantFragment`
 */
export declare function tensor(fragmentA: __Internref86, fragmentB: __Internref86): __Internref86;
/**
 * assembly/operators/collapse
 * @param fragment `assembly/resolang/ResonantFragment`
 * @returns `assembly/resolang/ResonantFragment`
 */
export declare function collapse(fragment: __Internref86): __Internref86;
/**
 * assembly/operators/rotatePhase
 * @param node `assembly/resolang/EntangledNode`
 * @param phaseShift `f64`
 */
export declare function rotatePhase(node: __Internref4, phaseShift: number): void;
/**
 * assembly/operators/linkEntanglement
 * @param nodeA `assembly/resolang/EntangledNode`
 * @param nodeB `assembly/resolang/EntangledNode`
 */
export declare function linkEntanglement(nodeA: __Internref4, nodeB: __Internref4): void;
/**
 * assembly/operators/route
 * @param source `assembly/resolang/EntangledNode`
 * @param target `assembly/resolang/EntangledNode`
 * @param viaNodes `~lib/array/Array<assembly/resolang/EntangledNode>`
 * @returns `bool`
 */
export declare function route(source: __Internref4, target: __Internref4, viaNodes: Array<__Internref4>): boolean;
/**
 * assembly/operators/coherence
 * @param node `assembly/resolang/EntangledNode`
 * @returns `f64`
 */
export declare function coherence(node: __Internref4): number;
/**
 * assembly/operators/entropy
 * @param fragment `assembly/resolang/ResonantFragment`
 * @returns `f64`
 */
export declare function entropy(fragment: __Internref86): number;
/**
 * assembly/functionalBlocks/stabilize
 * @param node `assembly/resolang/EntangledNode`
 * @returns `bool`
 */
export declare function stabilize(node: __Internref4): boolean;
/**
 * assembly/functionalBlocks/teleport
 * @param mem `assembly/resolang/ResonantFragment`
 * @param to `assembly/resolang/EntangledNode`
 * @returns `bool`
 */
export declare function teleport(mem: __Internref86, to: __Internref4): boolean;
/**
 * assembly/functionalBlocks/entangled
 * @param nodeA `assembly/resolang/EntangledNode`
 * @param nodeB `assembly/resolang/EntangledNode`
 * @returns `bool`
 */
export declare function entangled(nodeA: __Internref4, nodeB: __Internref4): boolean;
/**
 * assembly/functionalBlocks/observe
 * @param remote `assembly/resolang/EntangledNode`
 * @returns `~lib/array/Array<f64>`
 */
export declare function observe(remote: __Internref4): Array<number>;
/**
 * assembly/quaternion-entanglement/transmitQuaternionicMessage
 * @param sender `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param receiver `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param message `~lib/string/String`
 * @param synchronizer `assembly/quaternion-entanglement/QuaternionicSynchronizer`
 * @returns `bool`
 */
export declare function transmitQuaternionicMessage(sender: __Internref230, receiver: __Internref230, message: string, synchronizer: __Internref236): boolean;
/**
 * assembly/utils/entropyRate
 * @param phaseRing `~lib/array/Array<f64>`
 * @returns `f64`
 */
export declare function entropyRate(phaseRing: Array<number>): number;
/**
 * assembly/utils/align
 * @param phaseRing `~lib/array/Array<f64>`
 * @returns `~lib/array/Array<f64>`
 */
export declare function align(phaseRing: Array<number>): Array<number>;
/**
 * assembly/utils/generateSymbol
 * @param primes `~lib/array/Array<u32>`
 * @returns `~lib/string/String`
 */
export declare function generateSymbol(primes: Array<number>): string;
/**
 * assembly/utils/toFixed
 * @param value `f64`
 * @param decimals `i32`
 * @returns `~lib/string/String`
 */
export declare function toFixed(value: number, decimals?: number): string;
/**
 * assembly/entropy-viz/initializeEntropyViz
 */
export declare function initializeEntropyViz(): void;
/**
 * assembly/entropy-viz/getGlobalSampler
 * @returns `assembly/entropy-viz/EntropyFieldSampler`
 */
export declare function getGlobalSampler(): __Internref9;
/**
 * assembly/entropy-viz/getGlobalTracker
 * @returns `assembly/entropy-viz/EntropyEvolutionTracker`
 */
export declare function getGlobalTracker(): __Internref13;
/**
 * assembly/entropy-viz/exportEntropyData
 * @returns `~lib/string/String`
 */
export declare function exportEntropyData(): string;
/**
 * assembly/entropy-viz/exportEntropyHistory
 * @returns `~lib/string/String`
 */
export declare function exportEntropyHistory(): string;
/**
 * assembly/core/validation/validateString
 * @returns `assembly/core/validation/StringValidationBuilder`
 */
export declare function validateString(): __Internref239;
/**
 * assembly/core/validation/validateNumber
 * @returns `assembly/core/validation/NumberValidationBuilder`
 */
export declare function validateNumber(): __Internref243;
/**
 * assembly/core/validation/validateObject
 * @returns `assembly/core/validation/ObjectValidator`
 */
export declare function validateObject(): __Internref247;
/**
 * assembly/core/math-optimized/modExpOptimized
 * @param base `u64`
 * @param exp `u64`
 * @param mod `u64`
 * @returns `u64`
 */
export declare function modExpOptimized(base: bigint, exp: bigint, mod: bigint): bigint;
/**
 * assembly/core/math-optimized/modInverseOptimized
 * @param a `u64`
 * @param m `u64`
 * @returns `u64`
 */
export declare function modInverseOptimized(a: bigint, m: bigint): bigint;
/**
 * assembly/core/math-optimized/simdArrayMul
 * @param a `~lib/typedarray/Float64Array`
 * @param b `~lib/typedarray/Float64Array`
 * @param result `~lib/typedarray/Float64Array`
 */
export declare function simdArrayMul(a: Float64Array, b: Float64Array, result: Float64Array): void;
/**
 * assembly/core/math-optimized/simdArrayAdd
 * @param a `~lib/typedarray/Float64Array`
 * @param b `~lib/typedarray/Float64Array`
 * @param result `~lib/typedarray/Float64Array`
 */
export declare function simdArrayAdd(a: Float64Array, b: Float64Array, result: Float64Array): void;
/**
 * assembly/core/math-optimized/simdDotProduct
 * @param a `~lib/typedarray/Float64Array`
 * @param b `~lib/typedarray/Float64Array`
 * @returns `f64`
 */
export declare function simdDotProduct(a: Float64Array, b: Float64Array): number;
/**
 * assembly/core/math-optimized/getPrimeCacheStats
 * @returns `~lib/string/String`
 */
export declare function getPrimeCacheStats(): string;
/**
 * assembly/core/math-optimized/resetMathOptimizations
 */
export declare function resetMathOptimizations(): void;
/**
 * assembly/core/math-optimized/getMathPerformanceReport
 * @returns `~lib/string/String`
 */
export declare function getMathPerformanceReport(): string;
/**
 * assembly/core/math-optimized/validateMathOperations
 * @returns `bool`
 */
export declare function validateMathOperations(): boolean;
/**
 * assembly/core/math-optimized/benchmarkMathOperations
 * @returns `~lib/string/String`
 */
export declare function benchmarkMathOperations(): string;
/**
 * assembly/core/math-optimized/testMathOperations
 * @returns `bool`
 */
export declare function testMathOperations(): boolean;
/** assembly/core/math-cache/SMALL_PRIMES */
export declare const SMALL_PRIMES: {
  /** @type `~lib/array/Array<u32>` */
  get value(): Array<number>
};
/** assembly/core/math-cache/primeCache */
export declare const primeCache: {
  /** @type `assembly/core/math-cache/PrimeCache` */
  get value(): __Internref30
};
/**
 * assembly/core/math-extended-gcd/extendedGCD
 * @param a `i64`
 * @param b `i64`
 * @returns `assembly/core/math-extended-gcd/ExtendedGCDResult`
 */
export declare function extendedGCD(a: bigint, b: bigint): __Internref250;
/**
 * assembly/core/math-extended-gcd/modInverse
 * @param a `u64`
 * @param m `u64`
 * @returns `u64`
 */
export declare function modInverse(a: bigint, m: bigint): bigint;
/** assembly/core/math-miller-rabin/MILLER_RABIN_WITNESSES_32 */
export declare const MILLER_RABIN_WITNESSES_32: {
  /** @type `~lib/array/Array<u32>` */
  get value(): Array<number>
};
/** assembly/core/math-miller-rabin/MILLER_RABIN_WITNESSES_64 */
export declare const MILLER_RABIN_WITNESSES_64: {
  /** @type `~lib/array/Array<u64>` */
  get value(): Array<bigint>
};
/**
 * assembly/core/math-miller-rabin/millerRabinDeterministic32
 * @param n `u32`
 * @returns `bool`
 */
export declare function millerRabinDeterministic32(n: number): boolean;
/**
 * assembly/core/math-miller-rabin/millerRabinDeterministic64
 * @param n `u64`
 * @returns `bool`
 */
export declare function millerRabinDeterministic64(n: bigint): boolean;
/**
 * assembly/core/math-montgomery/modExpMontgomery
 * @param base `u64`
 * @param exp `u64`
 * @param mod `u64`
 * @returns `u64`
 */
export declare function modExpMontgomery(base: bigint, exp: bigint, mod: bigint): bigint;
/**
 * assembly/core/math-operations/mulMod
 * @param a `u64`
 * @param b `u64`
 * @param mod `u64`
 * @returns `u64`
 */
export declare function mulMod(a: bigint, b: bigint, mod: bigint): bigint;
/**
 * assembly/core/math-operations/addMod
 * @param a `u64`
 * @param b `u64`
 * @param mod `u64`
 * @returns `u64`
 */
export declare function addMod(a: bigint, b: bigint, mod: bigint): bigint;
/**
 * assembly/core/math-operations/modExp
 * @param base `u64`
 * @param exp `u64`
 * @param mod `u64`
 * @returns `u64`
 */
export declare function modExp(base: bigint, exp: bigint, mod: bigint): bigint;
/**
 * assembly/core/math-operations/arrayMul
 * @param a `~lib/typedarray/Float64Array`
 * @param b `~lib/typedarray/Float64Array`
 * @param result `~lib/typedarray/Float64Array`
 */
export declare function arrayMul(a: Float64Array, b: Float64Array, result: Float64Array): void;
/**
 * assembly/core/math-operations/arrayAdd
 * @param a `~lib/typedarray/Float64Array`
 * @param b `~lib/typedarray/Float64Array`
 * @param result `~lib/typedarray/Float64Array`
 */
export declare function arrayAdd(a: Float64Array, b: Float64Array, result: Float64Array): void;
/**
 * assembly/core/math-operations/dotProduct
 * @param a `~lib/typedarray/Float64Array`
 * @param b `~lib/typedarray/Float64Array`
 * @returns `f64`
 */
export declare function dotProduct(a: Float64Array, b: Float64Array): number;
/**
 * assembly/core/math-operations/vectorMagnitude
 * @param v `~lib/typedarray/Float64Array`
 * @returns `f64`
 */
export declare function vectorMagnitude(v: Float64Array): number;
/**
 * assembly/core/math-operations/normalizeVector
 * @param v `~lib/typedarray/Float64Array`
 * @param result `~lib/typedarray/Float64Array`
 */
export declare function normalizeVector(v: Float64Array, result: Float64Array): void;
/**
 * assembly/core/math-operations/lerp
 * @param a `f64`
 * @param b `f64`
 * @param t `f64`
 * @returns `f64`
 */
export declare function lerp(a: number, b: number, t: number): number;
/**
 * assembly/core/math-operations/clamp
 * @param value `f64`
 * @param min `f64`
 * @param max `f64`
 * @returns `f64`
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * assembly/core/math-operations/fastInvSqrt
 * @param x `f64`
 * @returns `f64`
 */
export declare function fastInvSqrt(x: number): number;
/**
 * assembly/core/math-operations/approxEqual
 * @param a `f64`
 * @param b `f64`
 * @param epsilon `f64`
 * @returns `bool`
 */
export declare function approxEqual(a: number, b: number, epsilon?: number): boolean;
/**
 * assembly/core/math-operations/safeDivide
 * @param a `f64`
 * @param b `f64`
 * @returns `f64`
 */
export declare function safeDivide(a: number, b: number): number;
/**
 * assembly/core/math-operations/gcd
 * @param a `u64`
 * @param b `u64`
 * @returns `u64`
 */
export declare function gcd(a: bigint, b: bigint): bigint;
/**
 * assembly/core/math-operations/lcm
 * @param a `u64`
 * @param b `u64`
 * @returns `u64`
 */
export declare function lcm(a: bigint, b: bigint): bigint;
/**
 * assembly/core/math-operations/isPerfectSquare
 * @param n `u64`
 * @returns `bool`
 */
export declare function isPerfectSquare(n: bigint): boolean;
/**
 * assembly/core/math-operations/isqrt
 * @param n `u64`
 * @returns `u64`
 */
export declare function isqrt(n: bigint): bigint;
/** assembly/core/math-performance/globalMathProfiler */
export declare const globalMathProfiler: {
  /** @type `assembly/core/math-performance/MathProfiler` */
  get value(): __Internref55
};
/**
 * assembly/core/math-performance/profileMathOperation
 * @param name `~lib/string/String`
 * @param operation `() => void`
 */
export declare function profileMathOperation(name: string, operation: __Internref300): void;
/** assembly/core/math-performance/globalMathMemoryTracker */
export declare const globalMathMemoryTracker: {
  /** @type `assembly/core/math-performance/MathMemoryTracker` */
  get value(): __Internref59
};
/**
 * assembly/core/math-primes/isPrimeOptimized
 * @param n `u64`
 * @returns `bool`
 */
export declare function isPrimeOptimized(n: bigint): boolean;
/**
 * assembly/core/math-primes/generatePrimeOptimized
 * @param minBits `i32`
 * @param maxBits `i32`
 * @returns `u64`
 */
export declare function generatePrimeOptimized(minBits: number, maxBits: number): bigint;
/**
 * assembly/core/math-primes/generatePrimesOptimized
 * @param n `i32`
 * @returns `~lib/array/Array<u32>`
 */
export declare function generatePrimesOptimized(n: number): Array<number>;
/**
 * assembly/core/math-primes/isGaussianPrime
 * @param real `f64`
 * @param imag `f64`
 * @returns `bool`
 */
export declare function isGaussianPrime(real: number, imag: number): boolean;
/**
 * assembly/core/math-primes/sieveOfEratosthenes
 * @param n `u32`
 * @returns `~lib/array/Array<u32>`
 */
export declare function sieveOfEratosthenes(n: number): Array<number>;
/**
 * assembly/core/math-primes/nextPrime
 * @param n `u64`
 * @returns `u64`
 */
export declare function nextPrime(n: bigint): bigint;
/**
 * assembly/core/math-primes/previousPrime
 * @param n `u64`
 * @returns `u64`
 */
export declare function previousPrime(n: bigint): bigint;
/**
 * assembly/identity/index/exampleUsage
 */
export declare function exampleUsage(): void;
/** assembly/identity/interfaces/IdentityType */
export declare enum IdentityType {
  /** @type `i32` */
  SELF_SOVEREIGN,
  /** @type `i32` */
  MANAGED,
  /** @type `i32` */
  SYSTEM,
}
/** assembly/identity/interfaces/KYCLevel */
export declare enum KYCLevel {
  /** @type `i32` */
  NONE,
  /** @type `i32` */
  BASIC,
  /** @type `i32` */
  ENHANCED,
  /** @type `i32` */
  FULL,
}
/** assembly/identity/interfaces/KYCVerificationStatus */
export declare enum KYCVerificationStatus {
  /** @type `i32` */
  PENDING,
  /** @type `i32` */
  IN_PROGRESS,
  /** @type `i32` */
  COMPLETED,
  /** @type `i32` */
  FAILED,
  /** @type `i32` */
  EXPIRED,
}
/** assembly/identity/interfaces/PermissionScope */
export declare enum PermissionScope {
  /** @type `i32` */
  GLOBAL,
  /** @type `i32` */
  DOMAIN,
  /** @type `i32` */
  OBJECT,
}
/** assembly/identity/interfaces/AuditAction */
export declare enum AuditAction {
  /** @type `i32` */
  CREATE,
  /** @type `i32` */
  UPDATE,
  /** @type `i32` */
  DELETE,
  /** @type `i32` */
  TRANSFER,
  /** @type `i32` */
  GRANT_PERMISSION,
  /** @type `i32` */
  REVOKE_PERMISSION,
  /** @type `i32` */
  ADD_MEMBER,
  /** @type `i32` */
  REMOVE_MEMBER,
  /** @type `i32` */
  VERIFY_KYC,
  /** @type `i32` */
  AUTHENTICATE,
  /** @type `i32` */
  DEACTIVATE,
  /** @type `i32` */
  REACTIVATE,
}
/** assembly/identity/interfaces/AuditResult */
export declare enum AuditResult {
  /** @type `i32` */
  SUCCESS,
  /** @type `i32` */
  FAILURE,
  /** @type `i32` */
  PARTIAL,
}
/** assembly/identity/interfaces/RecoveryMethod */
export declare enum RecoveryMethod {
  /** @type `i32` */
  MULTI_SIGNATURE,
  /** @type `i32` */
  SOCIAL_RECOVERY,
  /** @type `i32` */
  TIME_LOCKED,
  /** @type `i32` */
  HARDWARE_KEY,
}
/** assembly/identity/prime-mapping/globalPrimeMapper */
export declare const globalPrimeMapper: {
  /** @type `assembly/identity/prime-mapping/IdentityPrimeMapper` */
  get value(): __Internref74
};
/** assembly/identity/ownership-transfer/TransferType */
export declare enum TransferType {
  /** @type `i32` */
  DOMAIN,
  /** @type `i32` */
  OBJECT,
}
/** assembly/identity/ownership-transfer/TransferStatus */
export declare enum TransferStatus {
  /** @type `i32` */
  PENDING,
  /** @type `i32` */
  APPROVED,
  /** @type `i32` */
  REJECTED,
  /** @type `i32` */
  CANCELLED,
  /** @type `i32` */
  EXPIRED,
  /** @type `i32` */
  COMPLETED,
}
/** assembly/identity/ownership-transfer/globalTransferManager */
export declare const globalTransferManager: {
  /** @type `assembly/identity/ownership-transfer/OwnershipTransferManager` */
  get value(): __Internref77
};
/** assembly/identity/audit-trail/AuditEventType */
export declare enum AuditEventType {
  /** @type `i32` */
  IDENTITY_CREATED,
  /** @type `i32` */
  IDENTITY_UPDATED,
  /** @type `i32` */
  IDENTITY_KYC_CHANGED,
  /** @type `i32` */
  IDENTITY_DEACTIVATED,
  /** @type `i32` */
  IDENTITY_REACTIVATED,
  /** @type `i32` */
  DOMAIN_CREATED,
  /** @type `i32` */
  DOMAIN_UPDATED,
  /** @type `i32` */
  DOMAIN_MEMBER_ADDED,
  /** @type `i32` */
  DOMAIN_MEMBER_REMOVED,
  /** @type `i32` */
  DOMAIN_OWNERSHIP_TRANSFERRED,
  /** @type `i32` */
  OBJECT_CREATED,
  /** @type `i32` */
  OBJECT_UPDATED,
  /** @type `i32` */
  OBJECT_TRANSFERRED,
  /** @type `i32` */
  OBJECT_DESTROYED,
  /** @type `i32` */
  PERMISSION_GRANTED,
  /** @type `i32` */
  PERMISSION_REVOKED,
  /** @type `i32` */
  ROLE_ASSIGNED,
  /** @type `i32` */
  ROLE_REMOVED,
  /** @type `i32` */
  AUTH_LOGIN,
  /** @type `i32` */
  AUTH_LOGOUT,
  /** @type `i32` */
  AUTH_FAILED,
  /** @type `i32` */
  AUTH_SESSION_EXPIRED,
  /** @type `i32` */
  NODE_CONNECTED,
  /** @type `i32` */
  NODE_DISCONNECTED,
  /** @type `i32` */
  SYNC_STARTED,
  /** @type `i32` */
  SYNC_COMPLETED,
  /** @type `i32` */
  SYNC_FAILED,
}
/** assembly/identity/audit-trail/AuditSeverity */
export declare enum AuditSeverity {
  /** @type `i32` */
  INFO,
  /** @type `i32` */
  WARNING,
  /** @type `i32` */
  ERROR,
  /** @type `i32` */
  CRITICAL,
}
/** assembly/identity/audit-trail/globalAuditTrail */
export declare const globalAuditTrail: {
  /** @type `assembly/identity/audit-trail/AuditTrailManager` */
  get value(): __Internref60
};
/** assembly/identity/resolang-processor/globalResoLangProcessor */
export declare const globalResoLangProcessor: {
  /** @type `assembly/identity/resolang-processor/IdentityResoLangProcessor` */
  get value(): __Internref84
};
/**
 * assembly/identity/resolang-processor/quantumCheckPermission
 * @param identity `assembly/identity/interfaces/IIdentity`
 * @param permission `~lib/string/String`
 * @param resource `~lib/string/String | null`
 * @returns `bool`
 */
export declare function quantumCheckPermission(identity: __Record101<undefined>, permission: string, resource?: string | null): boolean;
/**
 * assembly/identity/resolang-processor/quantumProcessTransfer
 * @param request `assembly/identity/ownership-transfer/TransferRequest`
 * @param approvers `~lib/array/Array<assembly/identity/interfaces/IIdentity>`
 * @returns `bool`
 */
export declare function quantumProcessTransfer(request: __Internref78, approvers: Array<__Record101<undefined>>): boolean;
/**
 * assembly/identity/resolang-processor/quantumRecoverIdentity
 * @param lostIdentityId `~lib/string/String`
 * @param recoveryIdentities `~lib/array/Array<assembly/identity/interfaces/IIdentity>`
 * @param requiredSignatures `i32`
 * @returns `bool`
 */
export declare function quantumRecoverIdentity(lostIdentityId: string, recoveryIdentities: Array<__Record101<undefined>>, requiredSignatures?: number): boolean;
/**
 * assembly/identity/resolang-processor/quantumCreateAuditEntry
 * @param entry `assembly/identity/audit-trail/AuditEntry`
 */
export declare function quantumCreateAuditEntry(entry: __Internref62): void;
/**
 * assembly/identity/resolang-processor/quantumVerifyAuditIntegrity
 * @returns `bool`
 */
export declare function quantumVerifyAuditIntegrity(): boolean;
/** assembly/identity/identity-recovery/RecoveryStatus */
export declare enum RecoveryStatus {
  /** @type `i32` */
  PENDING,
  /** @type `i32` */
  EXECUTED,
  /** @type `i32` */
  CANCELLED,
  /** @type `i32` */
  EXPIRED,
}
/** assembly/identity/identity-recovery/globalRecoveryManager */
export declare const globalRecoveryManager: {
  /** @type `assembly/identity/identity-recovery/IdentityRecoveryManager` */
  get value(): __Internref94
};
/** assembly/identity/domain-registry/DomainStatus */
export declare enum DomainStatus {
  /** @type `i32` */
  ACTIVE,
  /** @type `i32` */
  SUSPENDED,
  /** @type `i32` */
  EXPIRED,
  /** @type `i32` */
  RESERVED,
}
/** assembly/identity/permission-inheritance/InheritanceMode */
export declare enum InheritanceMode {
  /** @type `i32` */
  NONE,
  /** @type `i32` */
  ADDITIVE,
  /** @type `i32` */
  RESTRICTIVE,
  /** @type `i32` */
  OVERRIDE,
}
/** assembly/identity/permission-inheritance/globalPermissionInheritance */
export declare const globalPermissionInheritance: {
  /** @type `assembly/identity/permission-inheritance/PermissionInheritanceManager` */
  get value(): __Internref103
};
/** assembly/identity/authentication/AuthMethod */
export declare enum AuthMethod {
  /** @type `i32` */
  PASSWORD,
  /** @type `i32` */
  BIOMETRIC,
  /** @type `i32` */
  HARDWARE_KEY,
  /** @type `i32` */
  QUANTUM_SIGNATURE,
  /** @type `i32` */
  MULTI_FACTOR,
}
/** assembly/identity/authentication/SessionStatus */
export declare enum SessionStatus {
  /** @type `i32` */
  ACTIVE,
  /** @type `i32` */
  EXPIRED,
  /** @type `i32` */
  REVOKED,
  /** @type `i32` */
  SUSPENDED,
}
/** assembly/identity/authentication/globalAuthManager */
export declare const globalAuthManager: {
  /** @type `assembly/identity/authentication/AuthenticationManager` */
  get value(): __Internref116
};
/**
 * assembly/quantum/prime-memory/primeSpectrum
 * @param state `assembly/quantum/prime-state/PrimeState`
 * @returns `~lib/map/Map<u32,f64>`
 */
export declare function primeSpectrum(state: __Internref270): __Internref12;
/**
 * assembly/quantum/prime-memory/symbolicCollapse
 * @param state `assembly/quantum/prime-state/PrimeState`
 * @param n `u32`
 * @param resonanceFactor `f64`
 * @returns `assembly/quantum/prime-state/PrimeState`
 */
export declare function symbolicCollapse(state: __Internref270, n: number, resonanceFactor?: number): __Internref270;
/**
 * assembly/quantum/prime-operators/primeOperator
 * @param state `assembly/quantum/prime-state/PrimeState`
 * @returns `~lib/map/Map<u32,f64>`
 */
export declare function primeOperator(state: __Internref270): __Internref12;
/**
 * assembly/quantum/prime-operators/factorizationOperator
 * @param n `u32`
 * @returns `assembly/quantum/prime-state/PrimeState`
 */
export declare function factorizationOperator(n: number): __Internref270;
/**
 * assembly/quantum/prime-operators/rotationOperator
 * @param n `u32`
 * @param p `u32`
 * @returns `f64`
 */
export declare function rotationOperator(n: number, p: number): number;
/** assembly/quantum/prime-state/DELTA_S */
export declare const DELTA_S: {
  /** @type `f64` */
  get value(): number
};
/** assembly/runtime/execution/controlFlow/ControlFlowType */
export declare enum ControlFlowType {
  /** @type `i32` */
  SEQUENTIAL,
  /** @type `i32` */
  CONDITIONAL,
  /** @type `i32` */
  LOOP,
  /** @type `i32` */
  JUMP,
  /** @type `i32` */
  CALL,
  /** @type `i32` */
  RETURN,
  /** @type `i32` */
  BREAK,
  /** @type `i32` */
  CONTINUE,
  /** @type `i32` */
  HALT,
}
/** assembly/runtime/state/primeState/BasisType */
export declare enum BasisType {
  /** @type `i32` */
  PRIME,
  /** @type `i32` */
  FOURIER,
  /** @type `i32` */
  WAVELET,
  /** @type `i32` */
  POLYNOMIAL,
  /** @type `i32` */
  MODULAR,
}
/**
 * assembly/quaternion-exports/createQuaternion
 * @param w `f64`
 * @param x `f64`
 * @param y `f64`
 * @param z `f64`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function createQuaternion(w: number, x: number, y: number, z: number): __Internref231;
/**
 * assembly/quaternion-exports/quaternionMultiply
 * @param q1 `assembly/quaternion/Quaternion`
 * @param q2 `assembly/quaternion/Quaternion`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function quaternionMultiply(q1: __Internref231, q2: __Internref231): __Internref231;
/**
 * assembly/quaternion-exports/quaternionConjugate
 * @param q `assembly/quaternion/Quaternion`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function quaternionConjugate(q: __Internref231): __Internref231;
/**
 * assembly/quaternion-exports/quaternionNorm
 * @param q `assembly/quaternion/Quaternion`
 * @returns `f64`
 */
export declare function quaternionNorm(q: __Internref231): number;
/**
 * assembly/quaternion-exports/quaternionNormalize
 * @param q `assembly/quaternion/Quaternion`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function quaternionNormalize(q: __Internref231): __Internref231;
/**
 * assembly/quaternion-exports/quaternionToBlochVector
 * @param q `assembly/quaternion/Quaternion`
 * @returns `~lib/typedarray/Float64Array`
 */
export declare function quaternionToBlochVector(q: __Internref231): Float64Array;
/**
 * assembly/quaternion-exports/quaternionExp
 * @param q `assembly/quaternion/Quaternion`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function quaternionExp(q: __Internref231): __Internref231;
/**
 * assembly/quaternion-exports/quaternionRotate
 * @param q `assembly/quaternion/Quaternion`
 * @param angle `f64`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function quaternionRotate(q: __Internref231, angle: number): __Internref231;
/**
 * assembly/quaternion-exports/quaternionToString
 * @param q `assembly/quaternion/Quaternion`
 * @returns `~lib/string/String`
 */
export declare function quaternionToString(q: __Internref231): string;
/**
 * assembly/quaternion-exports/quaternionToJSON
 * @param q `assembly/quaternion/Quaternion`
 * @returns `~lib/string/String`
 */
export declare function quaternionToJSON(q: __Internref231): string;
/**
 * assembly/quaternion-exports/isSplitPrime
 * @param p `u32`
 * @returns `bool`
 */
export declare function isSplitPrime(p: number): boolean;
/**
 * assembly/quaternion-exports/createQuaternionFromPrime
 * @param p `u32`
 * @returns `assembly/quaternion/Quaternion | null`
 */
export declare function createQuaternionFromPrime(p: number): __Internref231 | null;
/**
 * assembly/quaternion-exports/createQuaternionicResonanceField
 * @returns `assembly/quaternion/QuaternionicResonanceField`
 */
export declare function createQuaternionicResonanceField(): __Internref232;
/**
 * assembly/quaternion-exports/addPrimeToResonanceField
 * @param field `assembly/quaternion/QuaternionicResonanceField`
 * @param p `u32`
 * @returns `bool`
 */
export declare function addPrimeToResonanceField(field: __Internref232, p: number): boolean;
/**
 * assembly/quaternion-exports/computeResonanceField
 * @param field `assembly/quaternion/QuaternionicResonanceField`
 * @param x `f64`
 * @param t `f64`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function computeResonanceField(field: __Internref232, x: number, t: number): __Internref231;
/**
 * assembly/quaternion-exports/optimizeResonanceFieldParameters
 * @param field `assembly/quaternion/QuaternionicResonanceField`
 * @param target `assembly/quaternion/Quaternion`
 * @param iterations `i32`
 */
export declare function optimizeResonanceFieldParameters(field: __Internref232, target: __Internref231, iterations?: number): void;
/**
 * assembly/quaternion-exports/createTwistDynamics
 * @returns `assembly/quaternion/TwistDynamics`
 */
export declare function createTwistDynamics(): __Internref234;
/**
 * assembly/quaternion-exports/computeTwistAngleFromQuaternion
 * @param dynamics `assembly/quaternion/TwistDynamics`
 * @param q `assembly/quaternion/Quaternion`
 * @returns `f64`
 */
export declare function computeTwistAngleFromQuaternion(dynamics: __Internref234, q: __Internref231): number;
/**
 * assembly/quaternion-exports/evolveTwistDynamics
 * @param dynamics `assembly/quaternion/TwistDynamics`
 * @param dt `f64`
 */
export declare function evolveTwistDynamics(dynamics: __Internref234, dt: number): void;
/**
 * assembly/quaternion-exports/checkTwistCollapse
 * @param dynamics `assembly/quaternion/TwistDynamics`
 * @param entropy `f64`
 * @param entropyThreshold `f64`
 * @param angleThreshold `f64`
 * @returns `bool`
 */
export declare function checkTwistCollapse(dynamics: __Internref234, entropy: number, entropyThreshold: number, angleThreshold: number): boolean;
/**
 * assembly/quaternion-exports/getDynamicsTwistAngle
 * @param dynamics `assembly/quaternion/TwistDynamics`
 * @returns `f64`
 */
export declare function getDynamicsTwistAngle(dynamics: __Internref234): number;
/**
 * assembly/quaternion-exports/setTwistAngle
 * @param dynamics `assembly/quaternion/TwistDynamics`
 * @param angle `f64`
 */
export declare function setTwistAngle(dynamics: __Internref234, angle: number): void;
/**
 * assembly/quaternion-exports/createQuaternionicProjector
 * @param errorCorrection `f64`
 * @returns `assembly/quaternion/QuaternionicProjector`
 */
export declare function createQuaternionicProjector(errorCorrection?: number): __Internref235;
/**
 * assembly/quaternion-exports/projectQuaternion
 * @param projector `assembly/quaternion/QuaternionicProjector`
 * @param q `assembly/quaternion/Quaternion`
 * @returns `~lib/typedarray/Float64Array`
 */
export declare function projectQuaternion(projector: __Internref235, q: __Internref231): Float64Array;
/**
 * assembly/quaternion-exports/computeQuaternionEigenvalues
 * @param projector `assembly/quaternion/QuaternionicProjector`
 * @param q `assembly/quaternion/Quaternion`
 * @returns `~lib/typedarray/Float64Array`
 */
export declare function computeQuaternionEigenvalues(projector: __Internref235, q: __Internref231): Float64Array;
/**
 * assembly/quaternion-exports/createQuaternionPool
 * @param maxSize `i32`
 * @returns `assembly/quaternion/QuaternionPool`
 */
export declare function createQuaternionPool(maxSize?: number): __Internref273;
/**
 * assembly/quaternion-exports/allocateQuaternionFromPool
 * @param pool `assembly/quaternion/QuaternionPool`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function allocateQuaternionFromPool(pool: __Internref273): __Internref231;
/**
 * assembly/quaternion-exports/deallocateQuaternionToPool
 * @param pool `assembly/quaternion/QuaternionPool`
 * @param q `assembly/quaternion/Quaternion`
 */
export declare function deallocateQuaternionToPool(pool: __Internref273, q: __Internref231): void;
/**
 * assembly/quaternion-exports/createEntangledQuaternionPair
 * @param q1 `assembly/quaternion/Quaternion`
 * @param q2 `assembly/quaternion/Quaternion`
 * @param couplingStrength `f64`
 * @returns `assembly/quaternion-entanglement/EntangledQuaternionPair`
 */
export declare function createEntangledQuaternionPair(q1: __Internref231, q2: __Internref231, couplingStrength?: number): __Internref237;
/**
 * assembly/quaternion-exports/evolveEntangledPair
 * @param pair `assembly/quaternion-entanglement/EntangledQuaternionPair`
 * @param dt `f64`
 */
export declare function evolveEntangledPair(pair: __Internref237, dt: number): void;
/**
 * assembly/quaternion-exports/computeEntangledPairFidelity
 * @param pair `assembly/quaternion-entanglement/EntangledQuaternionPair`
 * @param target `assembly/quaternion-entanglement/EntangledQuaternionPair`
 * @returns `f64`
 */
export declare function computeEntangledPairFidelity(pair: __Internref237, target: __Internref237): number;
/**
 * assembly/quaternion-exports/optimizeEntanglement
 * @param pair `assembly/quaternion-entanglement/EntangledQuaternionPair`
 * @param target `assembly/quaternion-entanglement/EntangledQuaternionPair`
 * @param iterations `i32`
 */
export declare function optimizeEntanglement(pair: __Internref237, target: __Internref237, iterations?: number): void;
/**
 * assembly/quaternion-exports/createQuaternionicSynchronizer
 * @returns `assembly/quaternion-entanglement/QuaternionicSynchronizer`
 */
export declare function createQuaternionicSynchronizer(): __Internref236;
/**
 * assembly/quaternion-exports/measureQuaternionPhaseDifference
 * @param sync `assembly/quaternion-entanglement/QuaternionicSynchronizer`
 * @param q1 `assembly/quaternion/Quaternion`
 * @param q2 `assembly/quaternion/Quaternion`
 * @returns `f64`
 */
export declare function measureQuaternionPhaseDifference(sync: __Internref236, q1: __Internref231, q2: __Internref231): number;
/**
 * assembly/quaternion-exports/synchronizeQuaternions
 * @param sync `assembly/quaternion-entanglement/QuaternionicSynchronizer`
 * @param q1 `assembly/quaternion/Quaternion`
 * @param q2 `assembly/quaternion/Quaternion`
 * @param id1 `~lib/string/String`
 * @param id2 `~lib/string/String`
 * @param targetPhaseDiff `f64`
 * @param tolerance `f64`
 * @returns `bool`
 */
export declare function synchronizeQuaternions(sync: __Internref236, q1: __Internref231, q2: __Internref231, id1: string, id2: string, targetPhaseDiff?: number, tolerance?: number): boolean;
/**
 * assembly/quaternion-exports/runAdaptiveSynchronization
 * @param sync `assembly/quaternion-entanglement/QuaternionicSynchronizer`
 * @param pair `assembly/quaternion-entanglement/EntangledQuaternionPair`
 * @param maxIterations `i32`
 * @param dt `f64`
 * @returns `bool`
 */
export declare function runAdaptiveSynchronization(sync: __Internref236, pair: __Internref237, maxIterations?: number, dt?: number): boolean;
/**
 * assembly/quaternion-exports/createQuaternionicAgent
 * @param q `assembly/quaternion/Quaternion`
 * @returns `assembly/quaternion-entanglement/QuaternionicAgent`
 */
export declare function createQuaternionicAgent(q: __Internref231): __Internref230;
/**
 * assembly/quaternion-exports/encodeQuaternionicMessage
 * @param agent `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param message `~lib/string/String`
 */
export declare function encodeQuaternionicMessage(agent: __Internref230, message: string): void;
/**
 * assembly/quaternion-exports/decodeQuaternionicMessage
 * @param agent `assembly/quaternion-entanglement/QuaternionicAgent`
 * @returns `~lib/string/String`
 */
export declare function decodeQuaternionicMessage(agent: __Internref230): string;
/**
 * assembly/quaternion-exports/entangleQuaternionicAgents
 * @param agent1 `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param agent2 `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param targetFidelity `f64`
 * @returns `assembly/quaternion-entanglement/EntangledQuaternionPair`
 */
export declare function entangleQuaternionicAgents(agent1: __Internref230, agent2: __Internref230, targetFidelity?: number): __Internref237;
/**
 * assembly/quaternion-exports/applyQuaternionicSymbolicCollapse
 * @param agent `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param entropyThreshold `f64`
 * @returns `bool`
 */
export declare function applyQuaternionicSymbolicCollapse(agent: __Internref230, entropyThreshold?: number): boolean;
/**
 * assembly/quaternion-exports/getQuaternionicAgentQuaternion
 * @param agent `assembly/quaternion-entanglement/QuaternionicAgent`
 * @returns `assembly/quaternion/Quaternion`
 */
export declare function getQuaternionicAgentQuaternion(agent: __Internref230): __Internref231;
/**
 * assembly/quaternion-exports/getQuaternionicAgentEntanglementFidelity
 * @param agent `assembly/quaternion-entanglement/QuaternionicAgent`
 * @returns `f64`
 */
export declare function getQuaternionicAgentEntanglementFidelity(agent: __Internref230): number;
/**
 * assembly/quaternion-exports/getQuaternionW
 * @param q `assembly/quaternion/Quaternion`
 * @returns `f64`
 */
export declare function getQuaternionW(q: __Internref231): number;
/**
 * assembly/quaternion-exports/getQuaternionX
 * @param q `assembly/quaternion/Quaternion`
 * @returns `f64`
 */
export declare function getQuaternionX(q: __Internref231): number;
/**
 * assembly/quaternion-exports/getQuaternionY
 * @param q `assembly/quaternion/Quaternion`
 * @returns `f64`
 */
export declare function getQuaternionY(q: __Internref231): number;
/**
 * assembly/quaternion-exports/getQuaternionZ
 * @param q `assembly/quaternion/Quaternion`
 * @returns `f64`
 */
export declare function getQuaternionZ(q: __Internref231): number;
/**
 * assembly/quaternion-exports/setQuaternionComponents
 * @param q `assembly/quaternion/Quaternion`
 * @param w `f64`
 * @param x `f64`
 * @param y `f64`
 * @param z `f64`
 */
export declare function setQuaternionComponents(q: __Internref231, w: number, x: number, y: number, z: number): void;
/**
 * assembly/quantum-exports/createHolographicEncoding
 * @returns `assembly/quantum/holographic-encoding/HolographicEncoding`
 */
export declare function createHolographicEncoding(): __Internref274;
/**
 * assembly/quantum-exports/holographicEncodingEncode
 * @param encoding `assembly/quantum/holographic-encoding/HolographicEncoding`
 * @param x `f64`
 * @param y `f64`
 * @param entropy `f64`
 * @returns `f64`
 */
export declare function holographicEncodingEncode(encoding: __Internref274, x: number, y: number, entropy: number): number;
/**
 * assembly/quantum-exports/holographicEncodingDecode
 * @param encoding `assembly/quantum/holographic-encoding/HolographicEncoding`
 * @param queryX `f64`
 * @param queryY `f64`
 * @returns `f64`
 */
export declare function holographicEncodingDecode(encoding: __Internref274, queryX: number, queryY: number): number;
/**
 * assembly/quantum-exports/holographicEncodingClear
 * @param encoding `assembly/quantum/holographic-encoding/HolographicEncoding`
 */
export declare function holographicEncodingClear(encoding: __Internref274): void;
/**
 * assembly/quantum-exports/createEntropyEvolution
 * @param S0 `f64`
 * @param lambda `f64`
 * @returns `assembly/quantum/entropy-evolution/EntropyEvolution`
 */
export declare function createEntropyEvolution(S0: number, lambda: number): __Internref275;
/**
 * assembly/quantum-exports/entropyEvolutionEvolve
 * @param evolution `assembly/quantum/entropy-evolution/EntropyEvolution`
 * @param time `f64`
 * @returns `f64`
 */
export declare function entropyEvolutionEvolve(evolution: __Internref275, time: number): number;
/**
 * assembly/quantum-exports/entropyEvolutionCollapseProbability
 * @param evolution `assembly/quantum/entropy-evolution/EntropyEvolution`
 * @param t `f64`
 * @returns `f64`
 */
export declare function entropyEvolutionCollapseProbability(evolution: __Internref275, t: number): number;
/**
 * assembly/complex-exports/createComplex
 * @param real `f64`
 * @param imag `f64`
 * @returns `assembly/types/Complex`
 */
export declare function createComplex(real: number, imag: number): __Internref271;
/**
 * assembly/complex-exports/complexAdd
 * @param a `assembly/types/Complex`
 * @param b `assembly/types/Complex`
 * @returns `assembly/types/Complex`
 */
export declare function complexAdd(a: __Internref271, b: __Internref271): __Internref271;
/**
 * assembly/complex-exports/complexMultiply
 * @param a `assembly/types/Complex`
 * @param b `assembly/types/Complex`
 * @returns `assembly/types/Complex`
 */
export declare function complexMultiply(a: __Internref271, b: __Internref271): __Internref271;
/**
 * assembly/complex-exports/complexMagnitude
 * @param a `assembly/types/Complex`
 * @returns `f64`
 */
export declare function complexMagnitude(a: __Internref271): number;
/**
 * assembly/complex-exports/complexFromPolar
 * @param magnitude `f64`
 * @param phase `f64`
 * @returns `assembly/types/Complex`
 */
export declare function complexFromPolar(magnitude: number, phase: number): __Internref271;
/**
 * assembly/complex-exports/getComplexReal
 * @param a `assembly/types/Complex`
 * @returns `f64`
 */
export declare function getComplexReal(a: __Internref271): number;
/**
 * assembly/complex-exports/getComplexImag
 * @param a `assembly/types/Complex`
 * @returns `f64`
 */
export declare function getComplexImag(a: __Internref271): number;
/**
 * assembly/prime-state-exports/createPrimeState
 * @returns `assembly/quantum/prime-state/PrimeState`
 */
export declare function createPrimeState(): __Internref270;
/**
 * assembly/prime-state-exports/getPrimeStateAmplitudes
 * @param state `assembly/quantum/prime-state/PrimeState`
 * @returns `~lib/map/Map<f64,f64>`
 */
export declare function getPrimeStateAmplitudes(state: __Internref270): __Internref276;
/**
 * assembly/prime-state-exports/getPrimeStateCoefficients
 * @param state `assembly/quantum/prime-state/PrimeState`
 * @returns `~lib/array/Array<assembly/types/Complex>`
 */
export declare function getPrimeStateCoefficients(state: __Internref270): Array<__Internref271>;
/**
 * assembly/prime-state-exports/setPrimeStateAmplitudes
 * @param state `assembly/quantum/prime-state/PrimeState`
 * @param amplitudes `~lib/map/Map<f64,f64>`
 */
export declare function setPrimeStateAmplitudes(state: __Internref270, amplitudes: __Internref276): void;
/**
 * assembly/pnp-exports/createState
 * @param type `i32`
 * @param vars `~lib/array/Array<i32>`
 * @param constraints `~lib/array/Array<assembly/examples/universal-symbolic-transformer/UniversalConstraint>`
 * @returns `assembly/examples/universal-symbolic-transformer/UniversalSymbolicState`
 */
export declare function createState(type: number, vars: Array<number>, constraints: Array<__Internref206>): __Internref205;
/**
 * assembly/pnp-exports/isStateSatisfied
 * @param state `assembly/examples/universal-symbolic-transformer/UniversalSymbolicState`
 * @returns `bool`
 */
export declare function isStateSatisfied(state: __Internref205): boolean;
/**
 * assembly/pnp-exports/getSolutionEncoding
 * @param state `assembly/examples/universal-symbolic-transformer/UniversalSymbolicState`
 * @returns `~lib/array/Array<i32>`
 */
export declare function getSolutionEncoding(state: __Internref205): Array<number>;
/**
 * assembly/pnp-exports/createTransformer
 * @param problem_dimension `i32`
 * @returns `assembly/examples/universal-symbolic-transformer/UniversalSymbolicTransformer`
 */
export declare function createTransformer(problem_dimension: number): __Internref210;
/**
 * assembly/pnp-exports/encodeProblem
 * @param problem_type `i32`
 * @param variables `~lib/array/Array<i32>`
 * @param raw_constraints `~lib/array/Array<~lib/array/Array<i32>>`
 * @param weights `~lib/array/Array<f64>`
 * @returns `assembly/examples/universal-symbolic-transformer/UniversalSymbolicState`
 */
export declare function encodeProblem(problem_type: number, variables: Array<number>, raw_constraints: Array<Array<number>>, weights: Array<number>): __Internref205;
/**
 * assembly/pnp-exports/solveProblem
 * @param transformer `assembly/examples/universal-symbolic-transformer/UniversalSymbolicTransformer`
 * @param problem_state `assembly/examples/universal-symbolic-transformer/UniversalSymbolicState`
 * @returns `assembly/examples/universal-symbolic-transformer/UniversalSymbolicState`
 */
export declare function solveProblem(transformer: __Internref210, problem_state: __Internref205): __Internref205;
/**
 * assembly/pnp-exports/verifyConvergence
 * @param transformer `assembly/examples/universal-symbolic-transformer/UniversalSymbolicTransformer`
 * @returns `bool`
 */
export declare function verifyConvergence(transformer: __Internref210): boolean;
/** assembly/examples/universal-symbolic-transformer/NPProblemType */
export declare enum NPProblemType {
  /** @type `i32` */
  SAT,
  /** @type `i32` */
  VERTEX_COVER,
  /** @type `i32` */
  HAMILTONIAN_PATH,
  /** @type `i32` */
  GRAPH_COLORING,
  /** @type `i32` */
  KNAPSACK,
  /** @type `i32` */
  TSP,
  /** @type `i32` */
  SUBSET_SUM,
  /** @type `i32` */
  CLIQUE,
  /** @type `i32` */
  INDEPENDENT_SET,
  /** @type `i32` */
  PARTITION,
  /** @type `i32` */
  INTEGER_PROGRAMMING,
  /** @type `i32` */
  STEINER_TREE,
  /** @type `i32` */
  SET_COVER,
  /** @type `i32` */
  BIN_PACKING,
  /** @type `i32` */
  SCHEDULING,
}
/**
 * assembly/runtime-exports/createIdentityProcessor
 * @returns `assembly/runtime/processor/IdentityResoLangProcessor`
 */
export declare function createIdentityProcessor(): __Internref172;
/**
 * assembly/runtime-exports/checkPermission
 * @param processor `assembly/runtime/processor/IdentityResoLangProcessor`
 * @param identity `assembly/identity/interfaces/IIdentity`
 * @param permission `~lib/string/String`
 * @param resource `~lib/string/String | null`
 * @returns `bool`
 */
export declare function checkPermission(processor: __Internref172, identity: __Record101<undefined>, permission: string, resource?: string | null): boolean;
/**
 * assembly/runtime-exports/processTransferRequest
 * @param processor `assembly/runtime/processor/IdentityResoLangProcessor`
 * @param request `assembly/identity/ownership-transfer/TransferRequest`
 * @param approvers `~lib/array/Array<assembly/identity/interfaces/IIdentity>`
 * @returns `bool`
 */
export declare function processTransferRequest(processor: __Internref172, request: __Internref78, approvers: Array<__Record101<undefined>>): boolean;
/**
 * assembly/runtime-exports/recoverIdentity
 * @param processor `assembly/runtime/processor/IdentityResoLangProcessor`
 * @param lostIdentityId `~lib/string/String`
 * @param recoveryIdentities `~lib/array/Array<assembly/identity/interfaces/IIdentity>`
 * @param requiredSignatures `i32`
 * @returns `bool`
 */
export declare function recoverIdentity(processor: __Internref172, lostIdentityId: string, recoveryIdentities: Array<__Record101<undefined>>, requiredSignatures?: number): boolean;
/**
 * assembly/runtime-exports/createAuditEntry
 * @param processor `assembly/runtime/processor/IdentityResoLangProcessor`
 * @param entry `assembly/identity/audit-trail/AuditEntry`
 */
export declare function createAuditEntry(processor: __Internref172, entry: __Internref62): void;
/**
 * assembly/runtime-exports/verifyAuditIntegrity
 * @param processor `assembly/runtime/processor/IdentityResoLangProcessor`
 * @returns `bool`
 */
export declare function verifyAuditIntegrity(processor: __Internref172): boolean;
/**
 * assembly/runtime-exports/syncWithNetwork
 * @param processor `assembly/runtime/processor/IdentityResoLangProcessor`
 * @returns `bool`
 */
export declare function syncWithNetwork(processor: __Internref172): boolean;
/** assembly/twist/FUNDAMENTAL_INVARIANT */
export declare const FUNDAMENTAL_INVARIANT: {
  /** @type `i32` */
  get value(): number
};
/** assembly/twist/PRIMORIAL_BASE */
export declare const PRIMORIAL_BASE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/twist/MASTER_KEY_PRIME */
export declare const MASTER_KEY_PRIME: {
  /** @type `i32` */
  get value(): number
};
/**
 * assembly/twist/getTwistAngle
 * @param prime `i32`
 * @returns `f64`
 */
export declare function getTwistAngle(prime: number): number;
/**
 * assembly/twist/getTwistRate
 * @param prime `i32`
 * @param wavelength `f64`
 * @returns `f64`
 */
export declare function getTwistRate(prime: number, wavelength?: number): number;
/**
 * assembly/twist/composeTwistAngles
 * @param primes `~lib/array/Array<i32>`
 * @returns `f64`
 */
export declare function composeTwistAngles(primes: Array<number>): number;
/**
 * assembly/twist/isTwistClosed
 * @param totalTwist `f64`
 * @param tolerance `f64`
 * @returns `bool`
 */
export declare function isTwistClosed(totalTwist: number, tolerance?: number): boolean;
/**
 * assembly/twist/isCoprimeToThirty
 * @param n `i32`
 * @returns `bool`
 */
export declare function isCoprimeToThirty(n: number): boolean;
/**
 * assembly/twist/getMod30Residue
 * @param n `i32`
 * @returns `i32`
 */
export declare function getMod30Residue(n: number): number;
/**
 * assembly/twist/getCoprimeClassIndex
 * @param n `i32`
 * @returns `i32`
 */
export declare function getCoprimeClassIndex(n: number): number;
/**
 * assembly/twist/residueToSedenionAxis
 * @param residue `i32`
 * @param octave `i32`
 * @returns `i32`
 */
export declare function residueToSedenionAxis(residue: number, octave?: number): number;
/**
 * assembly/twist/needsMasterKey
 * @param primes `~lib/array/Array<i32>`
 * @returns `bool`
 */
export declare function needsMasterKey(primes: Array<number>): boolean;
/**
 * assembly/twist/applyMasterKey
 * @param primes `~lib/array/Array<i32>`
 * @returns `~lib/array/Array<i32>`
 */
export declare function applyMasterKey(primes: Array<number>): Array<number>;
/**
 * assembly/twist/symbolicEntropy
 * @param n `i32`
 * @returns `f64`
 */
export declare function symbolicEntropy(n: number): number;
/**
 * assembly/twist/get108HarmonicOffset
 * @param n `i32`
 * @returns `i32`
 */
export declare function get108HarmonicOffset(n: number): number;
/**
 * assembly/twist/is108Resonant
 * @param n `i32`
 * @returns `bool`
 */
export declare function is108Resonant(n: number): boolean;
/**
 * assembly/enochian/getLetterData
 * @param char `~lib/string/String`
 * @returns `assembly/enochian/EnochianLetter | null`
 */
export declare function getLetterData(char: string): __Internref278 | null;
/**
 * assembly/enochian/parseEnochian
 * @param text `~lib/string/String`
 * @returns `assembly/enochian/EnochianParseResult`
 */
export declare function parseEnochian(text: string): __Internref279;
/**
 * assembly/enochian/getPreferredLetter
 * @param prime `i32`
 * @param mode `i32`
 * @returns `~lib/string/String`
 */
export declare function getPreferredLetter(prime: number, mode: number): string;
/**
 * assembly/enochian/primesToEnochian
 * @param primes `~lib/array/Array<i32>`
 * @param preferredMode `i32`
 * @returns `~lib/string/String`
 */
export declare function primesToEnochian(primes: Array<number>, preferredMode?: number): string;
/** assembly/physics/CONFIG */
export declare const CONFIG: {
  /** @type `assembly/physics/PhysicsConfig` */
  get value(): __Record177<never>
};
/** assembly/physics/oscillators */
export declare const oscillators: {
  /** @type `~lib/array/Array<assembly/physics/PrimeOscillator>` */
  get value(): Array<__Internref178>;
  set value(value: Array<__Internref178>);
};
/**
 * assembly/physics/addOscillator
 * @param prime `i32`
 * @param amplitude `f64`
 * @param phase `f64`
 */
export declare function addOscillator(prime: number, amplitude: number, phase: number): void;
/**
 * assembly/physics/clearOscillators
 */
export declare function clearOscillators(): void;
/**
 * assembly/physics/updatePhysics
 * @returns `assembly/physics/PhysicsState`
 */
export declare function updatePhysics(): __Internref223;
/** assembly/fano/FANO_LINES */
export declare const FANO_LINES: {
  /** @type `~lib/staticarray/StaticArray<~lib/staticarray/StaticArray<i32>>` */
  get value(): ArrayLike<ArrayLike<number>>
};
/**
 * assembly/fano/octonionMultiplyIndex
 * @param i `i32`
 * @param j `i32`
 * @returns `assembly/fano/MultiplicationResult`
 */
export declare function octonionMultiplyIndex(i: number, j: number): __Internref281;
/**
 * assembly/fano/sedenionMultiplyIndex
 * @param i `i32`
 * @param j `i32`
 * @returns `assembly/fano/MultiplicationResult`
 */
export declare function sedenionMultiplyIndex(i: number, j: number): __Internref281;
/**
 * assembly/fano/multiplyIndices
 * @param dim `i32`
 * @param i `i32`
 * @param j `i32`
 * @returns `assembly/fano/MultiplicationResult`
 */
export declare function multiplyIndices(dim: number, i: number, j: number): __Internref281;
/**
 * assembly/fano/buildMultiplicationTable
 * @param dim `i32`
 * @returns `~lib/array/Array<~lib/array/Array<assembly/fano/MultiplicationResult>>`
 */
export declare function buildMultiplicationTable(dim: number): Array<Array<__Internref281>>;
/**
 * assembly/fano/basisName
 * @param dim `i32`
 * @param index `i32`
 * @returns `~lib/string/String`
 */
export declare function basisName(dim: number, index: number): string;
/**
 * assembly/hypercomplex/complex
 * @param real `f64`
 * @param imag `f64`
 * @returns `assembly/hypercomplex/Hypercomplex`
 */
export declare function complex(real: number, imag: number): __Internref284;
/**
 * assembly/hypercomplex/quaternion
 * @param w `f64`
 * @param x `f64`
 * @param y `f64`
 * @param z `f64`
 * @returns `assembly/hypercomplex/Hypercomplex`
 */
export declare function quaternion(w: number, x: number, y: number, z: number): __Internref284;
/**
 * assembly/hypercomplex/octonion
 * @param c0 `f64`
 * @param c1 `f64`
 * @param c2 `f64`
 * @param c3 `f64`
 * @param c4 `f64`
 * @param c5 `f64`
 * @param c6 `f64`
 * @param c7 `f64`
 * @returns `assembly/hypercomplex/Hypercomplex`
 */
export declare function octonion(c0: number, c1: number, c2: number, c3: number, c4: number, c5: number, c6: number, c7: number): __Internref284;
/**
 * assembly/hypercomplex/getDimensionName
 * @param dim `i32`
 * @returns `~lib/string/String`
 */
export declare function getDimensionName(dim: number): string;
/**
 * assembly/hilbert/encodeMemory
 * @param text `~lib/string/String`
 * @param primes `~lib/array/Array<u32> | null`
 * @returns `assembly/hilbert/PrimeHilbertState`
 */
export declare function encodeMemory(text: string, primes?: Array<number> | null): __Internref285;
/**
 * assembly/hilbert/symbolicCompute
 * @param inputStates `~lib/array/Array<assembly/hilbert/PrimeHilbertState>`
 * @param maxIterations `i32`
 * @param coherenceThreshold `f64`
 * @returns `assembly/hilbert/SymbolicComputeResult | null`
 */
export declare function symbolicCompute(inputStates: Array<__Internref285>, maxIterations?: number, coherenceThreshold?: number): __Internref290 | null;
/**
 * assembly/rformer/resonanceScore
 * @param query `assembly/rformer/SparsePrimeState`
 * @param key `assembly/rformer/SparsePrimeState`
 * @returns `f64`
 */
export declare function resonanceScore(query: __Internref297, key: __Internref297): number;
/**
 * assembly/rformer/resonantAttention
 * @param query `assembly/rformer/SparsePrimeState`
 * @param keys `~lib/array/Array<assembly/rformer/SparsePrimeState>`
 * @param values `~lib/array/Array<assembly/rformer/SparsePrimeState>`
 * @param temperature `f64`
 * @returns `assembly/rformer/SparsePrimeState`
 */
export declare function resonantAttention(query: __Internref297, keys: Array<__Internref297>, values: Array<__Internref297>, temperature?: number): __Internref297;
/**
 * assembly/rformer/multiHeadResonantAttention
 * @param query `assembly/rformer/SparsePrimeState`
 * @param keys `~lib/array/Array<assembly/rformer/SparsePrimeState>`
 * @param values `~lib/array/Array<assembly/rformer/SparsePrimeState>`
 * @param numHeads `i32`
 * @param temperature `f64`
 * @returns `assembly/rformer/SparsePrimeState`
 */
export declare function multiHeadResonantAttention(query: __Internref297, keys: Array<__Internref297>, values: Array<__Internref297>, numHeads?: number, temperature?: number): __Internref297;
/** assembly/examples/test-comprehensive-benchmark-suite/BenchmarkTestSuite */
declare class __Internref219 extends Number {
  private __nominal219: symbol;
  private __nominal0: symbol;
}
/** assembly/smf/SMFConfig */
declare interface __Record181<TOmittable> {
  /** @type `f64` */
  decayRate: number | TOmittable;
  /** @type `f64` */
  coherenceThreshold: number | TOmittable;
  /** @type `f64` */
  resonanceStrength: number | TOmittable;
  /** @type `f64` */
  collapseThreshold: number | TOmittable;
  /** @type `i32` */
  historyLength: number | TOmittable;
}
/** assembly/smf/SedenionMemoryField */
declare class __Internref183 extends Number {
  private __nominal183: symbol;
  private __nominal0: symbol;
}
/** assembly/state/StateSnapshot */
declare class __Internref193 extends Number {
  private __nominal193: symbol;
  private __nominal0: symbol;
}
/** assembly/resolang/EntangledNode */
declare class __Internref4 extends Number {
  private __nominal4: symbol;
  private __nominal0: symbol;
}
/** assembly/resolang/ResonantFragment */
declare class __Internref86 extends Number {
  private __nominal86: symbol;
  private __nominal0: symbol;
}
/** assembly/resolang/Attractor */
declare class __Internref227 extends Number {
  private __nominal227: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion-entanglement/QuaternionicAgent */
declare class __Internref230 extends Number {
  private __nominal230: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion-entanglement/QuaternionicSynchronizer */
declare class __Internref236 extends Number {
  private __nominal236: symbol;
  private __nominal0: symbol;
}
/** assembly/entropy-viz/EntropyFieldSampler */
declare class __Internref9 extends Number {
  private __nominal9: symbol;
  private __nominal0: symbol;
}
/** assembly/entropy-viz/EntropyEvolutionTracker */
declare class __Internref13 extends Number {
  private __nominal13: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/StringValidationBuilder */
declare class __Internref239 extends Number {
  private __nominal239: symbol;
  private __nominal240: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/NumberValidationBuilder */
declare class __Internref243 extends Number {
  private __nominal243: symbol;
  private __nominal244: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/ObjectValidator */
declare class __Internref247 extends Number {
  private __nominal247: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-cache/PrimeCache */
declare class __Internref30 extends Number {
  private __nominal30: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-extended-gcd/ExtendedGCDResult */
declare class __Internref250 extends Number {
  private __nominal250: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-performance/MathProfiler */
declare class __Internref55 extends Number {
  private __nominal55: symbol;
  private __nominal0: symbol;
}
/** ~lib/function/Function<%28%29=>void> */
declare class __Internref300 extends Number {
  private __nominal300: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-performance/MathMemoryTracker */
declare class __Internref59 extends Number {
  private __nominal59: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/prime-mapping/IdentityPrimeMapper */
declare class __Internref74 extends Number {
  private __nominal74: symbol;
  private __nominal61: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/ownership-transfer/OwnershipTransferManager */
declare class __Internref77 extends Number {
  private __nominal77: symbol;
  private __nominal61: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/audit-trail/AuditTrailManager */
declare class __Internref60 extends Number {
  private __nominal60: symbol;
  private __nominal61: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/resolang-processor/IdentityResoLangProcessor */
declare class __Internref84 extends Number {
  private __nominal84: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/interfaces/IIdentity */
declare interface __Record101<TOmittable> {
}
/** assembly/identity/ownership-transfer/TransferRequest */
declare class __Internref78 extends Number {
  private __nominal78: symbol;
  private __nominal61: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/audit-trail/AuditEntry */
declare class __Internref62 extends Number {
  private __nominal62: symbol;
  private __nominal61: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/identity-recovery/IdentityRecoveryManager */
declare class __Internref94 extends Number {
  private __nominal94: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/permission-inheritance/PermissionInheritanceManager */
declare class __Internref103 extends Number {
  private __nominal103: symbol;
  private __nominal61: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/authentication/AuthenticationManager */
declare class __Internref116 extends Number {
  private __nominal116: symbol;
  private __nominal0: symbol;
}
/** assembly/quantum/prime-state/PrimeState */
declare class __Internref270 extends Number {
  private __nominal270: symbol;
  private __nominal0: symbol;
}
/** ~lib/map/Map<u32,f64> */
declare class __Internref12 extends Number {
  private __nominal12: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion/Quaternion */
declare class __Internref231 extends Number {
  private __nominal231: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion/QuaternionicResonanceField */
declare class __Internref232 extends Number {
  private __nominal232: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion/TwistDynamics */
declare class __Internref234 extends Number {
  private __nominal234: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion/QuaternionicProjector */
declare class __Internref235 extends Number {
  private __nominal235: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion/QuaternionPool */
declare class __Internref273 extends Number {
  private __nominal273: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion-entanglement/EntangledQuaternionPair */
declare class __Internref237 extends Number {
  private __nominal237: symbol;
  private __nominal0: symbol;
}
/** assembly/quantum/holographic-encoding/HolographicEncoding */
declare class __Internref274 extends Number {
  private __nominal274: symbol;
  private __nominal0: symbol;
}
/** assembly/quantum/entropy-evolution/EntropyEvolution */
declare class __Internref275 extends Number {
  private __nominal275: symbol;
  private __nominal0: symbol;
}
/** assembly/types/Complex */
declare class __Internref271 extends Number {
  private __nominal271: symbol;
  private __nominal0: symbol;
}
/** ~lib/map/Map<f64,f64> */
declare class __Internref276 extends Number {
  private __nominal276: symbol;
  private __nominal0: symbol;
}
/** assembly/examples/universal-symbolic-transformer/UniversalConstraint */
declare class __Internref206 extends Number {
  private __nominal206: symbol;
  private __nominal0: symbol;
}
/** assembly/examples/universal-symbolic-transformer/UniversalSymbolicState */
declare class __Internref205 extends Number {
  private __nominal205: symbol;
  private __nominal0: symbol;
}
/** assembly/examples/universal-symbolic-transformer/UniversalSymbolicTransformer */
declare class __Internref210 extends Number {
  private __nominal210: symbol;
  private __nominal0: symbol;
}
/** assembly/runtime/processor/IdentityResoLangProcessor */
declare class __Internref172 extends Number {
  private __nominal172: symbol;
  private __nominal0: symbol;
}
/** assembly/enochian/EnochianLetter */
declare class __Internref278 extends Number {
  private __nominal278: symbol;
  private __nominal0: symbol;
}
/** assembly/enochian/EnochianParseResult */
declare class __Internref279 extends Number {
  private __nominal279: symbol;
  private __nominal0: symbol;
}
/** assembly/physics/PhysicsConfig */
declare interface __Record177<TOmittable> {
  /** @type `f64` */
  resonanceThreshold: number | TOmittable;
  /** @type `f64` */
  couplingBase: number | TOmittable;
  /** @type `f64` */
  simulationSpeed: number | TOmittable;
  /** @type `f64` */
  dampening: number | TOmittable;
  /** @type `f64` */
  lyapunovStableThreshold: number | TOmittable;
}
/** assembly/physics/PrimeOscillator */
declare class __Internref178 extends Number {
  private __nominal178: symbol;
  private __nominal0: symbol;
}
/** assembly/physics/PhysicsState */
declare class __Internref223 extends Number {
  private __nominal223: symbol;
  private __nominal0: symbol;
}
/** assembly/fano/MultiplicationResult */
declare class __Internref281 extends Number {
  private __nominal281: symbol;
  private __nominal0: symbol;
}
/** assembly/hypercomplex/Hypercomplex */
declare class __Internref284 extends Number {
  private __nominal284: symbol;
  private __nominal0: symbol;
}
/** assembly/hilbert/PrimeHilbertState */
declare class __Internref285 extends Number {
  private __nominal285: symbol;
  private __nominal0: symbol;
}
/** assembly/hilbert/SymbolicComputeResult */
declare class __Internref290 extends Number {
  private __nominal290: symbol;
  private __nominal0: symbol;
}
/** assembly/rformer/SparsePrimeState */
declare class __Internref297 extends Number {
  private __nominal297: symbol;
  private __nominal0: symbol;
}
