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
/**
 * assembly/quaternion-entanglement/transmitQuaternionicMessage
 * @param sender `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param receiver `assembly/quaternion-entanglement/QuaternionicAgent`
 * @param message `~lib/string/String`
 * @param synchronizer `assembly/quaternion-entanglement/QuaternionicSynchronizer`
 * @returns `bool`
 */
export declare function transmitQuaternionicMessage(sender: __Internref177, receiver: __Internref177, message: string, synchronizer: __Internref184): boolean;
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
 * assembly/core/validation/validateString
 * @returns `assembly/core/validation/StringValidationBuilder`
 */
export declare function validateString(): __Internref187;
/**
 * assembly/core/validation/validateNumber
 * @returns `assembly/core/validation/NumberValidationBuilder`
 */
export declare function validateNumber(): __Internref191;
/**
 * assembly/core/validation/validateObject
 * @returns `assembly/core/validation/ObjectValidator`
 */
export declare function validateObject(): __Internref195;
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
export declare function extendedGCD(a: bigint, b: bigint): __Internref198;
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
export declare function profileMathOperation(name: string, operation: __Internref215): void;
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
/** assembly/runtime/state/registerState/RegisterType */
export declare enum RegisterType {
  /** @type `i32` */
  GENERAL,
  /** @type `i32` */
  COHERENCE,
  /** @type `i32` */
  AMPLITUDE,
  /** @type `i32` */
  PHASE,
  /** @type `i32` */
  ENTROPY,
  /** @type `i32` */
  PROBABILITY,
  /** @type `i32` */
  SUCCESS,
  /** @type `i32` */
  RESONANCE,
  /** @type `i32` */
  COUNT,
  /** @type `i32` */
  RANDOM,
}
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
/** assembly/quaternion-entanglement/QuaternionicAgent */
declare class __Internref177 extends Number {
  private __nominal177: symbol;
  private __nominal0: symbol;
}
/** assembly/quaternion-entanglement/QuaternionicSynchronizer */
declare class __Internref184 extends Number {
  private __nominal184: symbol;
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
declare class __Internref187 extends Number {
  private __nominal187: symbol;
  private __nominal188: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/NumberValidationBuilder */
declare class __Internref191 extends Number {
  private __nominal191: symbol;
  private __nominal192: symbol;
  private __nominal0: symbol;
}
/** assembly/core/validation/ObjectValidator */
declare class __Internref195 extends Number {
  private __nominal195: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-cache/PrimeCache */
declare class __Internref29 extends Number {
  private __nominal29: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-extended-gcd/ExtendedGCDResult */
declare class __Internref198 extends Number {
  private __nominal198: symbol;
  private __nominal0: symbol;
}
/** assembly/core/math-performance/MathProfiler */
declare class __Internref54 extends Number {
  private __nominal54: symbol;
  private __nominal0: symbol;
}
/** ~lib/function/Function<%28%29=>void> */
declare class __Internref215 extends Number {
  private __nominal215: symbol;
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
