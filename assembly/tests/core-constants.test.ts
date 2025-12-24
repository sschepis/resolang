import {
  PHI,
  E,
  PI,
  TWO_PI,
  SHA256_H,
  SHA256_K,
  HMAC_IPAD,
  HMAC_OPAD,
  SHA256_BLOCK_SIZE,
  SHA256_OUTPUT_SIZE,
  DEFAULT_PRNG_SEED,
  LCG_MULTIPLIER,
  LCG_INCREMENT,
  LCG_MODULUS,
  MERSENNE_PRIME_31,
  FIELD_GENERATOR,
  MILLER_RABIN_ITERATIONS,
  DEFAULT_PRIME_MIN_BITS,
  DEFAULT_PRIME_MAX_BITS,
  MIN_ENTANGLEMENT_STRENGTH,
  MAX_MESSAGE_SIZE,
  DEFAULT_PROTOCOL_TIMEOUT,
  DEFAULT_CONSENSUS_THRESHOLD,
  MAX_ACTIVE_ROUNDS,
  DEFAULT_CACHE_TIMEOUT,
  DEFAULT_SYNC_INTERVAL,
  DEFAULT_PHASE_TOLERANCE,
  MAX_FRAGMENTS_PER_NODE,
  DEFAULT_DHT_TTL,
  DEFAULT_CHECKPOINT_INTERVAL,
  MAX_CHECKPOINTS,
  BELL_PAIR_MAX_AGE,
  KEYTRIPLET_PRIME_COUNT,
  KEYTRIPLET_NOISE_SCALE,
  DEFAULT_PBKDF2_ITERATIONS,
  DEFAULT_PBKDF2_KEY_LENGTH,
  OPTIMIZATION_INTERVAL,
  MIN_OPTIMIZATION_ENTANGLEMENT,
  MAX_OPTIMIZATION_ENTANGLEMENT,
  ENTANGLEMENT_STEP,
  PATTERN_DECAY_RATE,
  LOAD_BALANCE_WEIGHT,
  DEFAULT_LEARNING_RATE,
  DEFAULT_OPTIMIZATION_ITERATIONS,
  DEFAULT_MONITORING_INTERVAL,
  DEFAULT_HISTORY_SIZE,
  NODE_HEALTH_TIMEOUT,
  NODE_STALE_TIMEOUT,
  CRITICAL_ERROR_THRESHOLD,
  POOR_COHERENCE_THRESHOLD,
  DEFAULT_MAX_ERROR_RATE,
  DEFAULT_MAX_LATENCY_P99,
  MAX_ENTROPY_HISTORY,
  GRADIENT_STEP_SIZE,
  NetworkError,
  ProtocolError,
  generateUniqueId,
  degreesToRadians,
  radiansToDegrees,
  clamp,
  lerp,
  approxEqual,
} from "../core/constants";

export function testGenerateUniqueId(): void {
  const id1 = generateUniqueId("test");
  const id2 = generateUniqueId("test");
  assert(id1.startsWith("test-"), "ID should start with prefix");
  assert(id1 != id2, "IDs should be unique");
}

export function testDegreesToRadians(): void {
  assert(Math.abs(degreesToRadians(180) - PI) < 1e-9, "180 degrees should be PI radians");
  assert(Math.abs(degreesToRadians(90) - PI / 2) < 1e-9, "90 degrees should be PI/2 radians");
}

export function testRadiansToDegrees(): void {
  assert(Math.abs(radiansToDegrees(PI) - 180) < 1e-9, "PI radians should be 180 degrees");
  assert(Math.abs(radiansToDegrees(PI / 2) - 90) < 1e-9, "PI/2 radians should be 90 degrees");
}

export function testClamp(): void {
  assert(clamp(5, 0, 10) == 5, "Value within range should be unchanged");
  assert(clamp(-5, 0, 10) == 0, "Value below min should be clamped to min");
  assert(clamp(15, 0, 10) == 10, "Value above max should be clamped to max");
}

export function testLerp(): void {
  assert(lerp(0, 10, 0.5) == 5, "Lerp should return midpoint");
  assert(lerp(0, 10, 0) == 0, "Lerp should return start at t=0");
  assert(lerp(0, 10, 1) == 10, "Lerp should return end at t=1");
}

export function testApproxEqual(): void {
  assert(approxEqual(1.0, 1.00001), "Should be approximately equal with default epsilon");
  assert(!approxEqual(1.0, 1.1), "Should not be approximately equal");
  assert(approxEqual(1.0, 1.001, 0.01), "Should be approximately equal with custom epsilon");
}

export function runAllConstantsTests(): void {
  console.log("Running constants tests...");

  testGenerateUniqueId();
  console.log("✓ testGenerateUniqueId passed");

  testDegreesToRadians();
  console.log("✓ testDegreesToRadians passed");

  testRadiansToDegrees();
  console.log("✓ testRadiansToDegrees passed");

  testClamp();
  console.log("✓ testClamp passed");

  testLerp();
  console.log("✓ testLerp passed");

  testApproxEqual();
  console.log("✓ testApproxEqual passed");

  console.log("\nAll constants tests passed! ✨");
}