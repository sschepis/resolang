/**
 * Shared constants and configuration for the Prime Resonance Network
 * Centralizes magic numbers, configuration values, and system-wide constants
 */

// ============================================================================
// Mathematical Constants
// ============================================================================

/** Golden ratio - fundamental to resonance calculations */
export const PHI: f64 = 1.618033988749895;

/** Euler's number - used in entropy and evolution calculations */
export const E: f64 = 2.718281828459045;

/** Pi - for phase and angle calculations */
export const PI: f64 = 3.141592653589793;

/** 2 * Pi - commonly used for full rotation */
export const TWO_PI: f64 = 6.283185307179586;

// ============================================================================
// Cryptographic Constants
// ============================================================================

/** SHA-256 initial hash values (first 32 bits of fractional parts of square roots of first 8 primes) */
export const SHA256_H: u32[] = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
];

/** SHA-256 round constants (first 32 bits of fractional parts of cube roots of first 64 primes) */
export const SHA256_K: u32[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

/** HMAC inner padding byte */
export const HMAC_IPAD: u8 = 0x36;

/** HMAC outer padding byte */
export const HMAC_OPAD: u8 = 0x5c;

/** SHA-256 block size in bytes */
export const SHA256_BLOCK_SIZE: i32 = 64;

/** SHA-256 output size in bytes */
export const SHA256_OUTPUT_SIZE: i32 = 32;

/** Default PRNG seed */
export const DEFAULT_PRNG_SEED: u64 = 0x123456789ABCDEF0;

/** Linear congruential generator multiplier */
export const LCG_MULTIPLIER: u64 = 6364136223846793005;

/** Linear congruential generator increment */
export const LCG_INCREMENT: u64 = 1442695040888963407;

/** Linear congruential generator modulus (2^32) */
export const LCG_MODULUS: i64 = 4294967296;

// ============================================================================
// Prime Number Constants
// ============================================================================

/** Mersenne prime 2^31 - 1 (used as field prime) */
export const MERSENNE_PRIME_31: u64 = 2147483647;

/** Common generator for finite fields */
export const FIELD_GENERATOR: u64 = 3;

/** Default number of Miller-Rabin iterations */
export const MILLER_RABIN_ITERATIONS: i32 = 5;

/** Default minimum bits for prime generation */
export const DEFAULT_PRIME_MIN_BITS: i32 = 20;

/** Default maximum bits for prime generation */
export const DEFAULT_PRIME_MAX_BITS: i32 = 30;

// ============================================================================
// Network Protocol Constants
// ============================================================================

/** Default entanglement minimum strength */
export const MIN_ENTANGLEMENT_STRENGTH: f64 = 0.5;

/** Default maximum message size */
export const MAX_MESSAGE_SIZE: i32 = 1024;

/** Default protocol timeout in milliseconds */
export const DEFAULT_PROTOCOL_TIMEOUT: f64 = 5000.0;

/** Default consensus threshold */
export const DEFAULT_CONSENSUS_THRESHOLD: f64 = 0.85;

/** Maximum active consensus rounds */
export const MAX_ACTIVE_ROUNDS: u32 = 10;

/** Default cache timeout in milliseconds */
export const DEFAULT_CACHE_TIMEOUT: f64 = 60000.0;

/** Default sync interval in milliseconds */
export const DEFAULT_SYNC_INTERVAL: f64 = 1000.0;

/** Default phase tolerance for synchronization */
export const DEFAULT_PHASE_TOLERANCE: f64 = 0.1;

/** Maximum fragments per node */
export const MAX_FRAGMENTS_PER_NODE: i32 = 100;

/** Default TTL for DHT entries (1 hour) */
export const DEFAULT_DHT_TTL: f64 = 3600000.0;

/** Default checkpoint interval */
export const DEFAULT_CHECKPOINT_INTERVAL: u64 = 100;

/** Maximum checkpoints to keep */
export const MAX_CHECKPOINTS: u32 = 10;

// ============================================================================
// Quantum Protocol Constants
// ============================================================================

/** Default Bell pair maximum age in milliseconds */
export const BELL_PAIR_MAX_AGE: f64 = 1000.0;

/** Number of primes in keytriplet */
export const KEYTRIPLET_PRIME_COUNT: i32 = 256;

/** Keytriplet evolution noise scale */
export const KEYTRIPLET_NOISE_SCALE: f64 = 0.01;

/** Default PBKDF2 iterations */
export const DEFAULT_PBKDF2_ITERATIONS: i32 = 1000;

/** Default PBKDF2 key length */
export const DEFAULT_PBKDF2_KEY_LENGTH: i32 = 32;

// ============================================================================
// Optimization Constants
// ============================================================================

/** Optimization interval in milliseconds */
export const OPTIMIZATION_INTERVAL: u64 = 10000;

/** Minimum entanglement for optimization */
export const MIN_OPTIMIZATION_ENTANGLEMENT: f64 = 0.1;

/** Maximum entanglement for optimization */
export const MAX_OPTIMIZATION_ENTANGLEMENT: f64 = 0.9;

/** Entanglement adjustment step */
export const ENTANGLEMENT_STEP: f64 = 0.05;

/** Pattern decay rate */
export const PATTERN_DECAY_RATE: f64 = 0.001;

/** Load balance weight */
export const LOAD_BALANCE_WEIGHT: f64 = 0.3;

/** Default learning rate for optimization */
export const DEFAULT_LEARNING_RATE: f64 = 0.01;

/** Default optimization iterations */
export const DEFAULT_OPTIMIZATION_ITERATIONS: i32 = 100;

// ============================================================================
// Monitoring Constants
// ============================================================================

/** Default monitoring interval in milliseconds */
export const DEFAULT_MONITORING_INTERVAL: f64 = 5000.0;

/** Default history size for monitoring */
export const DEFAULT_HISTORY_SIZE: i32 = 1000;

/** Node health timeout (1 minute) */
export const NODE_HEALTH_TIMEOUT: f64 = 60000.0;

/** Node stale timeout (5 minutes) */
export const NODE_STALE_TIMEOUT: f64 = 300000.0;

/** Critical error threshold */
export const CRITICAL_ERROR_THRESHOLD: i32 = 100;

/** Poor coherence threshold */
export const POOR_COHERENCE_THRESHOLD: f64 = 0.3;

/** Default max error rate */
export const DEFAULT_MAX_ERROR_RATE: f64 = 5.0;

/** Default max latency P99 */
export const DEFAULT_MAX_LATENCY_P99: f64 = 200.0;

// ============================================================================
// Visualization Constants
// ============================================================================

/** Maximum history for entropy visualization */
export const MAX_ENTROPY_HISTORY: i32 = 100;

/** Gradient calculation step size */
export const GRADIENT_STEP_SIZE: f64 = 0.001;

// ============================================================================
// Error Codes
// ============================================================================

/** Network error codes */
export enum NetworkError {
  NODE_NOT_FOUND = 1001,
  NODE_ALREADY_EXISTS = 1002,
  ENTANGLEMENT_FAILED = 1003,
  LOW_COHERENCE = 1004,
  NOT_ENTANGLED = 1005,
  MEMORY_FULL = 1006,
  NETWORK_UNSTABLE = 1007,
  INVALID_PRIME = 1008,
  SYNCHRONIZATION_FAILED = 1009
}

/** Protocol error codes */
export enum ProtocolError {
  TIMEOUT = 2001,
  INVALID_MESSAGE = 2002,
  NOT_ENTANGLED = 2003,
  LOW_COHERENCE = 2004,
  ROUTE_NOT_FOUND = 2005,
  SYNC_FAILED = 2006,
  FIDELITY_TOO_LOW = 2007,
  MESSAGE_TOO_LARGE = 2008,
  SIGNATURE_INVALID = 2009
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a unique ID with timestamp and random component
 * @param prefix The prefix for the ID
 * @returns Unique ID string
 */
export function generateUniqueId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: f64): f64 {
  return degrees * PI / 180.0;
}

/**
 * Convert radians to degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
export function radiansToDegrees(radians: f64): f64 {
  return radians * 180.0 / PI;
}

/**
 * Clamp a value between min and max
 * @param value The value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export function clamp(value: f64, min: f64, max: f64): f64 {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 * @param a Start value
 * @param b End value
 * @param t Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(a: f64, b: f64, t: f64): f64 {
  return a + (b - a) * t;
}

/**
 * Check if two floating point numbers are approximately equal
 * @param a First number
 * @param b Second number
 * @param epsilon Tolerance
 * @returns true if approximately equal
 */
export function approxEqual(a: f64, b: f64, epsilon: f64 = 0.001): boolean {
  return Math.abs(a - b) < epsilon;
}