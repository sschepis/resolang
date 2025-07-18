/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/** assembly/resonlang/currentNode */
export declare const currentNode: {
  /** @type `assembly/resonlang/EntangledNode | null` */
  get value(): __Internref4 | null;
  set value(value: __Internref4 | null);
};
/**
 * assembly/resonlang/setCurrentNode
 * @param node `assembly/resonlang/EntangledNode`
 */
export declare function setCurrentNode(node: __Internref4): void;
/** assembly/resonlang/PI */
export declare const PI: {
  /** @type `f64` */
  get value(): number
};
/** assembly/types/ProtocolType */
export declare enum ProtocolType {
  /** @type `i32` */
  EIP,
  /** @type `i32` */
  MTP,
  /** @type `i32` */
  RRP,
  /** @type `i32` */
  PSP,
}
/** assembly/types/NetworkError */
export declare enum NetworkError {
  /** @type `i32` */
  NODE_NOT_FOUND,
  /** @type `i32` */
  NODE_ALREADY_EXISTS,
  /** @type `i32` */
  ENTANGLEMENT_FAILED,
  /** @type `i32` */
  LOW_COHERENCE,
  /** @type `i32` */
  NOT_ENTANGLED,
  /** @type `i32` */
  MEMORY_FULL,
  /** @type `i32` */
  NETWORK_UNSTABLE,
  /** @type `i32` */
  INVALID_PRIME,
  /** @type `i32` */
  SYNCHRONIZATION_FAILED,
}
/** assembly/types/ProtocolError */
export declare enum ProtocolError {
  /** @type `i32` */
  TIMEOUT,
  /** @type `i32` */
  INVALID_MESSAGE,
  /** @type `i32` */
  NOT_ENTANGLED,
  /** @type `i32` */
  LOW_COHERENCE,
  /** @type `i32` */
  ROUTE_NOT_FOUND,
  /** @type `i32` */
  SYNC_FAILED,
  /** @type `i32` */
  FIDELITY_TOO_LOW,
  /** @type `i32` */
  MESSAGE_TOO_LARGE,
  /** @type `i32` */
  SIGNATURE_INVALID,
}
/**
 * assembly/operators/tensor
 * @param fragmentA `assembly/resonlang/ResonantFragment`
 * @param fragmentB `assembly/resonlang/ResonantFragment`
 * @returns `assembly/resonlang/ResonantFragment`
 */
export declare function tensor(fragmentA: __Internref85, fragmentB: __Internref85): __Internref85;
/**
 * assembly/operators/collapse
 * @param fragment `assembly/resonlang/ResonantFragment`
 * @returns `assembly/resonlang/ResonantFragment`
 */
export declare function collapse(fragment: __Internref85): __Internref85;
/**
 * assembly/operators/rotatePhase
 * @param node `assembly/resonlang/EntangledNode`
 * @param phaseShift `f64`
 */
export declare function rotatePhase(node: __Internref4, phaseShift: number): void;
/**
 * assembly/operators/linkEntanglement
 * @param nodeA `assembly/resonlang/EntangledNode`
 * @param nodeB `assembly/resonlang/EntangledNode`
 */
export declare function linkEntanglement(nodeA: __Internref4, nodeB: __Internref4): void;
/**
 * assembly/operators/route
 * @param source `assembly/resonlang/EntangledNode`
 * @param target `assembly/resonlang/EntangledNode`
 * @param viaNodes `~lib/array/Array<assembly/resonlang/EntangledNode>`
 * @returns `bool`
 */
export declare function route(source: __Internref4, target: __Internref4, viaNodes: Array<__Internref4>): boolean;
/**
 * assembly/operators/coherence
 * @param node `assembly/resonlang/EntangledNode`
 * @returns `f64`
 */
export declare function coherence(node: __Internref4): number;
/**
 * assembly/operators/entropy
 * @param fragment `assembly/resonlang/ResonantFragment`
 * @returns `f64`
 */
export declare function entropy(fragment: __Internref85): number;
/**
 * assembly/functionalBlocks/stabilize
 * @param node `assembly/resonlang/EntangledNode`
 * @returns `bool`
 */
export declare function stabilize(node: __Internref4): boolean;
/**
 * assembly/functionalBlocks/teleport
 * @param mem `assembly/resonlang/ResonantFragment`
 * @param to `assembly/resonlang/EntangledNode`
 * @returns `bool`
 */
export declare function teleport(mem: __Internref85, to: __Internref4): boolean;
/**
 * assembly/functionalBlocks/entangled
 * @param nodeA `assembly/resonlang/EntangledNode`
 * @param nodeB `assembly/resonlang/EntangledNode`
 * @returns `bool`
 */
export declare function entangled(nodeA: __Internref4, nodeB: __Internref4): boolean;
/**
 * assembly/functionalBlocks/observe
 * @param remote `assembly/resonlang/EntangledNode`
 * @returns `~lib/array/Array<f64>`
 */
export declare function observe(remote: __Internref4): Array<number>;
/** assembly/prime-resonance/PHI */
export declare const PHI: {
  /** @type `f64` */
  get value(): number
};
/** assembly/prime-resonance/DELTA_S */
export declare const DELTA_S: {
  /** @type `f64` */
  get value(): number
};
/**
 * assembly/prime-resonance/primeOperator
 * @param state `assembly/prime-resonance/PrimeState`
 * @returns `~lib/map/Map<i32,f64>`
 */
export declare function primeOperator(state: __Internref127): __Internref11;
/**
 * assembly/prime-resonance/factorizationOperator
 * @param n `u32`
 * @returns `assembly/prime-resonance/PrimeState`
 */
export declare function factorizationOperator(n: number): __Internref127;
/**
 * assembly/prime-resonance/rotationOperator
 * @param n `u32`
 * @param p `i32`
 * @returns `f64`
 */
export declare function rotationOperator(n: number, p: number): number;
/**
 * assembly/prime-resonance/coherenceOperator
 * @param state `assembly/prime-resonance/PrimeState`
 * @param n `u32`
 * @returns `f64`
 */
export declare function coherenceOperator(state: __Internref127, n: number): number;
/**
 * assembly/prime-resonance/primeSpectrum
 * @param state `assembly/prime-resonance/PrimeState`
 * @returns `~lib/map/Map<i32,f64>`
 */
export declare function primeSpectrum(state: __Internref127): __Internref11;
/**
 * assembly/prime-resonance/symbolicCollapse
 * @param initialStates `~lib/array/Array<assembly/prime-resonance/PrimeState>`
 * @param coefficients `~lib/array/Array<f64>`
 * @param maxIterations `i32`
 * @param entropyThreshold `f64`
 * @returns `assembly/prime-resonance/PrimeState`
 */
export declare function symbolicCollapse(initialStates: Array<__Internref127>, coefficients: Array<number>, maxIterations?: number, entropyThreshold?: number): __Internref127;
/**
 * assembly/quaternion-entanglement/transmitQuaternionicMessage
 * @param sender `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param receiver `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param message `~lib/string/String`
 * @param synchronizer `assembly/quaternion-entanglement/QuaternionicSynchronizer`
 * @returns `bool`
 */
export declare function transmitQuaternionicMessage(sender: __Internref131, receiver: __Internref131, message: string, synchronizer: __Internref138): boolean;
/**
 * assembly/quantum-ops-impl/superpose
 * @param states `~lib/array/Array<assembly/prime-resonance/PrimeState>`
 * @returns `assembly/prime-resonance/PrimeState`
 */
export declare function superpose(states: Array<__Internref127>): __Internref127;
/**
 * assembly/quantum-ops-impl/measure
 * @param state `assembly/prime-resonance/PrimeState`
 * @returns `u32`
 */
export declare function measure(state: __Internref127): number;
/**
 * assembly/quantum-ops-impl/collapse
 * @param state `assembly/prime-resonance/PrimeState`
 * @param prime `u32`
 * @returns `assembly/prime-resonance/PrimeState`
 */
export declare function collapse(state: __Internref127, prime: number): __Internref127;
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
export declare function getGlobalSampler(): __Internref8;
/**
 * assembly/entropy-viz/getGlobalTracker
 * @returns `assembly/entropy-viz/EntropyEvolutionTracker`
 */
export declare function getGlobalTracker(): __Internref12;
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
 * assembly/core/serialization/escapeJSON
 * @param str `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function escapeJSON(str: string): string;
/**
 * assembly/core/serialization/toFixed
 * @param value `f64`
 * @param decimals `i32`
 * @returns `~lib/string/String`
 */
export declare function toFixed(value: number, decimals: number): string;
/**
 * assembly/core/serialization/serializeString
 * @param value `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function serializeString(value: string): string;
/**
 * assembly/core/serialization/serializeNumber
 * @param value `f64`
 * @returns `~lib/string/String`
 */
export declare function serializeNumber(value: number): string;
/**
 * assembly/core/serialization/serializeBoolean
 * @param value `bool`
 * @returns `~lib/string/String`
 */
export declare function serializeBoolean(value: boolean): string;
/**
 * assembly/core/serialization/serializeInteger
 * @param value `i64`
 * @returns `~lib/string/String`
 */
export declare function serializeInteger(value: bigint): string;
/**
 * assembly/core/validation/validateString
 * @returns `assembly/core/validation/StringValidationBuilder`
 */
export declare function validateString(): __Internref141;
/**
 * assembly/core/validation/validateNumber
 * @returns `assembly/core/validation/NumberValidationBuilder`
 */
export declare function validateNumber(): __Internref145;
/**
 * assembly/core/validation/validateObject
 * @returns `assembly/core/validation/ObjectValidator`
 */
export declare function validateObject(): __Internref149;
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
  get value(): __Internref29
};
/**
 * assembly/core/math-extended-gcd/extendedGCD
 * @param a `i64`
 * @param b `i64`
 * @returns `assembly/core/math-extended-gcd/ExtendedGCDResult`
 */
export declare function extendedGCD(a: bigint, b: bigint): __Internref152;
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
  get value(): __Internref54
};
/**
 * assembly/core/math-performance/profileMathOperation
 * @param name `~lib/string/String`
 * @param operation `() => void`
 */
export declare function profileMathOperation(name: string, operation: __Internref169): void;
/** assembly/core/math-performance/globalMathMemoryTracker */
export declare const globalMathMemoryTracker: {
  /** @type `assembly/core/math-performance/MathMemoryTracker` */
  get value(): __Internref58
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
 * @returns `~lib/array/Array<i32>`
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
/** assembly/core/constants/PI */
export declare const PI: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/TWO_PI */
export declare const TWO_PI: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/SHA256_H */
export declare const SHA256_H: {
  /** @type `~lib/array/Array<u32>` */
  get value(): Array<number>
};
/** assembly/core/constants/SHA256_K */
export declare const SHA256_K: {
  /** @type `~lib/array/Array<u32>` */
  get value(): Array<number>
};
/** assembly/core/constants/HMAC_IPAD */
export declare const HMAC_IPAD: {
  /** @type `u8` */
  get value(): number
};
/** assembly/core/constants/HMAC_OPAD */
export declare const HMAC_OPAD: {
  /** @type `u8` */
  get value(): number
};
/** assembly/core/constants/SHA256_BLOCK_SIZE */
export declare const SHA256_BLOCK_SIZE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/SHA256_OUTPUT_SIZE */
export declare const SHA256_OUTPUT_SIZE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_PRNG_SEED */
export declare const DEFAULT_PRNG_SEED: {
  /** @type `u64` */
  get value(): bigint
};
/** assembly/core/constants/LCG_MULTIPLIER */
export declare const LCG_MULTIPLIER: {
  /** @type `u64` */
  get value(): bigint
};
/** assembly/core/constants/LCG_INCREMENT */
export declare const LCG_INCREMENT: {
  /** @type `u64` */
  get value(): bigint
};
/** assembly/core/constants/LCG_MODULUS */
export declare const LCG_MODULUS: {
  /** @type `i64` */
  get value(): bigint
};
/** assembly/core/constants/MERSENNE_PRIME_31 */
export declare const MERSENNE_PRIME_31: {
  /** @type `u64` */
  get value(): bigint
};
/** assembly/core/constants/FIELD_GENERATOR */
export declare const FIELD_GENERATOR: {
  /** @type `u64` */
  get value(): bigint
};
/** assembly/core/constants/MILLER_RABIN_ITERATIONS */
export declare const MILLER_RABIN_ITERATIONS: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_PRIME_MIN_BITS */
export declare const DEFAULT_PRIME_MIN_BITS: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_PRIME_MAX_BITS */
export declare const DEFAULT_PRIME_MAX_BITS: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/MIN_ENTANGLEMENT_STRENGTH */
export declare const MIN_ENTANGLEMENT_STRENGTH: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/MAX_MESSAGE_SIZE */
export declare const MAX_MESSAGE_SIZE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_PROTOCOL_TIMEOUT */
export declare const DEFAULT_PROTOCOL_TIMEOUT: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_CONSENSUS_THRESHOLD */
export declare const DEFAULT_CONSENSUS_THRESHOLD: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/MAX_ACTIVE_ROUNDS */
export declare const MAX_ACTIVE_ROUNDS: {
  /** @type `u32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_CACHE_TIMEOUT */
export declare const DEFAULT_CACHE_TIMEOUT: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_SYNC_INTERVAL */
export declare const DEFAULT_SYNC_INTERVAL: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_PHASE_TOLERANCE */
export declare const DEFAULT_PHASE_TOLERANCE: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/MAX_FRAGMENTS_PER_NODE */
export declare const MAX_FRAGMENTS_PER_NODE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_DHT_TTL */
export declare const DEFAULT_DHT_TTL: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_CHECKPOINT_INTERVAL */
export declare const DEFAULT_CHECKPOINT_INTERVAL: {
  /** @type `u64` */
  get value(): bigint
};
/** assembly/core/constants/MAX_CHECKPOINTS */
export declare const MAX_CHECKPOINTS: {
  /** @type `u32` */
  get value(): number
};
/** assembly/core/constants/BELL_PAIR_MAX_AGE */
export declare const BELL_PAIR_MAX_AGE: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/KEYTRIPLET_PRIME_COUNT */
export declare const KEYTRIPLET_PRIME_COUNT: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/KEYTRIPLET_NOISE_SCALE */
export declare const KEYTRIPLET_NOISE_SCALE: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_PBKDF2_ITERATIONS */
export declare const DEFAULT_PBKDF2_ITERATIONS: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_PBKDF2_KEY_LENGTH */
export declare const DEFAULT_PBKDF2_KEY_LENGTH: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/OPTIMIZATION_INTERVAL */
export declare const OPTIMIZATION_INTERVAL: {
  /** @type `u64` */
  get value(): bigint
};
/** assembly/core/constants/MIN_OPTIMIZATION_ENTANGLEMENT */
export declare const MIN_OPTIMIZATION_ENTANGLEMENT: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/MAX_OPTIMIZATION_ENTANGLEMENT */
export declare const MAX_OPTIMIZATION_ENTANGLEMENT: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/ENTANGLEMENT_STEP */
export declare const ENTANGLEMENT_STEP: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/PATTERN_DECAY_RATE */
export declare const PATTERN_DECAY_RATE: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/LOAD_BALANCE_WEIGHT */
export declare const LOAD_BALANCE_WEIGHT: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_LEARNING_RATE */
export declare const DEFAULT_LEARNING_RATE: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_OPTIMIZATION_ITERATIONS */
export declare const DEFAULT_OPTIMIZATION_ITERATIONS: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_MONITORING_INTERVAL */
export declare const DEFAULT_MONITORING_INTERVAL: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_HISTORY_SIZE */
export declare const DEFAULT_HISTORY_SIZE: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/NODE_HEALTH_TIMEOUT */
export declare const NODE_HEALTH_TIMEOUT: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/NODE_STALE_TIMEOUT */
export declare const NODE_STALE_TIMEOUT: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/CRITICAL_ERROR_THRESHOLD */
export declare const CRITICAL_ERROR_THRESHOLD: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/POOR_COHERENCE_THRESHOLD */
export declare const POOR_COHERENCE_THRESHOLD: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_MAX_ERROR_RATE */
export declare const DEFAULT_MAX_ERROR_RATE: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/DEFAULT_MAX_LATENCY_P99 */
export declare const DEFAULT_MAX_LATENCY_P99: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/MAX_ENTROPY_HISTORY */
export declare const MAX_ENTROPY_HISTORY: {
  /** @type `i32` */
  get value(): number
};
/** assembly/core/constants/GRADIENT_STEP_SIZE */
export declare const GRADIENT_STEP_SIZE: {
  /** @type `f64` */
  get value(): number
};
/** assembly/core/constants/NetworkError */
export declare enum NetworkError {
  /** @type `i32` */
  NODE_NOT_FOUND,
  /** @type `i32` */
  NODE_ALREADY_EXISTS,
  /** @type `i32` */
  ENTANGLEMENT_FAILED,
  /** @type `i32` */
  LOW_COHERENCE,
  /** @type `i32` */
  NOT_ENTANGLED,
  /** @type `i32` */
  MEMORY_FULL,
  /** @type `i32` */
  NETWORK_UNSTABLE,
  /** @type `i32` */
  INVALID_PRIME,
  /** @type `i32` */
  SYNCHRONIZATION_FAILED,
}
/** assembly/core/constants/ProtocolError */
export declare enum ProtocolError {
  /** @type `i32` */
  TIMEOUT,
  /** @type `i32` */
  INVALID_MESSAGE,
  /** @type `i32` */
  NOT_ENTANGLED,
  /** @type `i32` */
  LOW_COHERENCE,
  /** @type `i32` */
  ROUTE_NOT_FOUND,
  /** @type `i32` */
  SYNC_FAILED,
  /** @type `i32` */
  FIDELITY_TOO_LOW,
  /** @type `i32` */
  MESSAGE_TOO_LARGE,
  /** @type `i32` */
  SIGNATURE_INVALID,
}
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
 * assembly/core/constants/clamp
 * @param value `f64`
 * @param min `f64`
 * @param max `f64`
 * @returns `f64`
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * assembly/core/constants/lerp
 * @param a `f64`
 * @param b `f64`
 * @param t `f64`
 * @returns `f64`
 */
export declare function lerp(a: number, b: number, t: number): number;
/**
 * assembly/core/constants/approxEqual
 * @param a `f64`
 * @param b `f64`
 * @param epsilon `f64`
 * @returns `bool`
 */
export declare function approxEqual(a: number, b: number, epsilon?: number): boolean;
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
  get value(): __Internref73
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
  get value(): __Internref76
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
  get value(): __Internref59
};
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
/** assembly/resonlang/EntangledNode */
declare class __Internref4 extends Number {
  private __nominal4: symbol;
  private __nominal0: symbol;
}
/** assembly/resonlang/ResonantFragment */
declare class __Internref85 extends Number {
  private __nominal85: symbol;
  private __nominal0: symbol;
}
/** assembly/prime-resonance/PrimeState */
declare class __Internref127 extends Number {
  private __nominal127: symbol;
  private __nominal0: symbol;
}
/** ~lib/map/Map<i32,f64> */
declare class __Internref11 extends Number {
  private __nominal11: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion-entanglement/QuaternionicAgent */
declare class __Internref131 extends Number {
  private __nominal131: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion-entanglement/QuaternionicSynchronizer */
declare class __Internref138 extends Number {
  private __nominal138: symbol;
  private __nominal0: symbol;
}
/** assembly/entropy-viz/EntropyFieldSampler */
declare class __Internref8 extends Number {
  private __nominal8: symbol;
  private __nominal0: symbol;
}
/** assembly/entropy-viz/EntropyEvolutionTracker */
declare class __Internref12 extends Number {
  private __nominal12: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/StringValidationBuilder */
declare class __Internref141 extends Number {
  private __nominal141: symbol;
  private __nominal142: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/NumberValidationBuilder */
declare class __Internref145 extends Number {
  private __nominal145: symbol;
  private __nominal146: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/ObjectValidator */
declare class __Internref149 extends Number {
  private __nominal149: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-cache/PrimeCache */
declare class __Internref29 extends Number {
  private __nominal29: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-extended-gcd/ExtendedGCDResult */
declare class __Internref152 extends Number {
  private __nominal152: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-performance/MathProfiler */
declare class __Internref54 extends Number {
  private __nominal54: symbol;
  private __nominal0: symbol;
}
/** ~lib/function/Function<%28%29=>void> */
declare class __Internref169 extends Number {
  private __nominal169: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-performance/MathMemoryTracker */
declare class __Internref58 extends Number {
  private __nominal58: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/prime-mapping/IdentityPrimeMapper */
declare class __Internref73 extends Number {
  private __nominal73: symbol;
  private __nominal60: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/ownership-transfer/OwnershipTransferManager */
declare class __Internref76 extends Number {
  private __nominal76: symbol;
  private __nominal60: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/audit-trail/AuditTrailManager */
declare class __Internref59 extends Number {
  private __nominal59: symbol;
  private __nominal60: symbol;
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
  private __nominal60: symbol;
  private __nominal0: symbol;
}
/** assembly/identity/authentication/AuthenticationManager */
declare class __Internref116 extends Number {
  private __nominal116: symbol;
  private __nominal0: symbol;
}
