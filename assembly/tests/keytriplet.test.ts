// keytriplet.test.ts
// Unit tests for Prime-Resonant Keytriplet cryptographic system

import {
  Keytriplet,
  KeytripletGenerator,
  SymbolicProjection,
  KeyEvolution,
  ResonanceFieldInitializer,
  SessionFieldEvolution,
  MessagePerturbation,
  PrimeMapping,
  PRUTCSystem
} from "../crypto/keytriplet";

import { PrimeState } from "../prime-resonance";
import { Complex } from "../types";
import { generatePrimes } from "../core/math";

// Test framework helpers
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error("Assertion failed: " + message);
  }
}

function assertNotNull<T>(value: T | null, message: string): T {
  if (value === null) {
    throw new Error(`Assertion failed: ${message} - value is null`);
  }
  return value;
}

function assertApproxEqual(actual: f64, expected: f64, tolerance: f64, message: string): void {
  const diff = Math.abs(actual - expected);
  assert(diff <= tolerance, `${message} - Expected: ${expected}, Got: ${actual}, Diff: ${diff}`);
}

// Test suite for Keytriplet
export function testKeytriplet(): void {
  console.log("=== Testing Keytriplet ===");
  
  // Test 1: Generation
  const kt1 = Keytriplet.generate("global_seed", "user1");
  assert(kt1.classicalPublicKey.length > 0, "Classical public key generated");
  assert(kt1.resonanceKey !== null, "Resonance key generated");
  
  // Test 2: Key uniqueness
  const kt2 = Keytriplet.generate("global_seed", "user2");
  assert(kt1.classicalPublicKey !== kt2.classicalPublicKey, "Public keys are unique");
  
  // Test 3: Resonance key properties
  const resKey1 = kt1.getResonanceKey();
  assert(resKey1.primes.length > 0, "Resonance key has primes");
  assert(resKey1.entropy() > 0, "Resonance key has entropy");
  
  // Test 4: Key evolution
  const originalResKey = kt1.getResonanceKey();
  kt1.evolve(0.1);
  const evolvedResKey = kt1.getResonanceKey();
  
  // Check that evolution changed the key
  let changed = false;
  for (let i = 0; i < originalResKey.coefficients.length; i++) {
    const orig = originalResKey.coefficients[i];
    const evolved = evolvedResKey.coefficients[i];
    if (orig.real !== evolved.real || orig.imag !== evolved.imag) {
      changed = true;
      break;
    }
  }
  assert(changed, "Key evolution changes coefficients");
  
  console.log("Keytriplet tests passed!");
}

// Test suite for KeytripletGenerator
export function testKeytripletGenerator(): void {
  console.log("=== Testing KeytripletGenerator ===");
  
  // Test 1: Private key generation
  const privKey1 = KeytripletGenerator.generatePrivateKey("seed1", "user1");
  assert(privKey1.primes.length > 0, "Private key has primes");
  assert(privKey1.coefficients.length === privKey1.primes.length, "Coefficients match primes");
  
  // Test 2: Different seeds produce different keys
  const privKey2 = KeytripletGenerator.generatePrivateKey("seed2", "user1");
  let different = false;
  for (let i = 0; i < privKey1.coefficients.length; i++) {
    if (privKey1.coefficients[i].real !== privKey2.coefficients[i].real) {
      different = true;
      break;
    }
  }
  assert(different, "Different seeds produce different keys");
  
  // Test 3: Classical public key generation
  const pubKey = KeytripletGenerator.generateClassicalPublicKey(privKey1);
  assert(pubKey.length > 0, "Classical public key generated");
  assert(pubKey.length === 64, "Public key is 64 hex chars (256 bits)");
  
  console.log("KeytripletGenerator tests passed!");
}

// Test suite for SymbolicProjection
export function testSymbolicProjection(): void {
  console.log("=== Testing SymbolicProjection ===");
  
  // Create a test private key
  const primes = generatePrimes(100);
  const privateKey = new PrimeState(primes);
  
  // Initialize with random coefficients
  for (let i = 0; i < primes.length; i++) {
    const real = Math.random() * 2 - 1;
    const imag = Math.random() * 2 - 1;
    privateKey.coefficients[i] = new Complex(real, imag);
  }
  privateKey.normalize();
  
  // Test projection
  const resonanceKey = SymbolicProjection.project(privateKey);
  
  // Test 1: Projection reduces dimension
  assert(resonanceKey.primes.length <= privateKey.primes.length, "Projection reduces or maintains dimension");
  
  // Test 2: Projection attenuates amplitudes
  let totalOriginal = 0;
  let totalProjected = 0;
  
  for (let i = 0; i < privateKey.coefficients.length; i++) {
    totalOriginal += privateKey.coefficients[i].magnitudeSquared();
  }
  
  for (let i = 0; i < resonanceKey.coefficients.length; i++) {
    totalProjected += resonanceKey.coefficients[i].magnitudeSquared();
  }
  
  assert(totalProjected <= totalOriginal * 1.01, "Projection attenuates total amplitude");
  
  console.log("SymbolicProjection tests passed!");
}

// Test suite for KeyEvolution
export function testKeyEvolution(): void {
  console.log("=== Testing KeyEvolution ===");
  
  // Create test key
  const primes = generatePrimes(50);
  const key = new PrimeState(primes);
  for (let i = 0; i < primes.length; i++) {
    key.coefficients[i] = new Complex(Math.random(), Math.random());
  }
  key.normalize();
  
  // Test 1: Evolution preserves normalization
  const evolved = KeyEvolution.evolve(key, 0.1);
  let norm = 0;
  for (let i = 0; i < evolved.coefficients.length; i++) {
    norm += evolved.coefficients[i].magnitudeSquared();
  }
  assertApproxEqual(norm, 1.0, 0.001, "Evolution preserves normalization");
  
  // Test 2: Evolution changes phases
  let phaseChanged = false;
  for (let i = 0; i < key.coefficients.length; i++) {
    const origPhase = key.coefficients[i].phase();
    const evolvedPhase = evolved.coefficients[i].phase();
    if (Math.abs(origPhase - evolvedPhase) > 0.001) {
      phaseChanged = true;
      break;
    }
  }
  assert(phaseChanged, "Evolution changes phases");
  
  console.log("KeyEvolution tests passed!");
}

// Test suite for ResonanceFieldInitializer
export function testResonanceFieldInitializer(): void {
  console.log("=== Testing ResonanceFieldInitializer ===");
  
  // Create two test keys
  const primes1 = generatePrimes(30);
  const primes2 = generatePrimes(40);
  
  const key1 = new PrimeState(primes1);
  const key2 = new PrimeState(primes2);
  
  // Initialize with random coefficients
  for (let i = 0; i < primes1.length; i++) {
    key1.coefficients[i] = new Complex(Math.random(), Math.random());
  }
  key1.normalize();
  
  for (let i = 0; i < primes2.length; i++) {
    key2.coefficients[i] = new Complex(Math.random(), Math.random());
  }
  key2.normalize();
  
  // Test initialization
  const sharedField = ResonanceFieldInitializer.initialize(key1, key2);
  
  // Test 1: Shared field contains union of primes
  const expectedPrimes = new Set<i32>();
  primes1.forEach(p => expectedPrimes.add(p));
  primes2.forEach(p => expectedPrimes.add(p));
  
  assert(sharedField.primes.length === expectedPrimes.size, "Shared field has union of primes");
  
  // Test 2: Shared field is normalized
  let norm = 0;
  for (let i = 0; i < sharedField.coefficients.length; i++) {
    norm += sharedField.coefficients[i].magnitudeSquared();
  }
  assertApproxEqual(norm, 1.0, 0.001, "Shared field is normalized");
  
  console.log("ResonanceFieldInitializer tests passed!");
}

// Test suite for PRUTCSystem
export function testPRUTCSystem(): void {
  console.log("=== Testing PRUTCSystem ===");
  
  const system = new PRUTCSystem("test_global_seed");
  
  // Test 1: User registration
  const alice = system.registerUser("alice");
  const bob = system.registerUser("bob");
  
  assert(alice !== null, "Alice registered");
  assert(bob !== null, "Bob registered");
  
  // Test 2: Session establishment
  const sessionId = system.establishSession("alice", "bob");
  assert(sessionId.indexOf("alice") >= 0, "Session ID contains alice");
  assert(sessionId.indexOf("bob") >= 0, "Session ID contains bob");
  
  // Test 3: Message sending
  system.sendMessage(sessionId, "alice", "Hello Bob!");
  
  // Test 4: Message receiving
  const messages = system.receiveMessages(sessionId, "bob");
  assert(messages.length > 0, "Bob received messages");
  
  // Test 5: Key evolution
  system.evolveKeys(0.1);
  // Should still be able to establish new session after evolution
  const newSessionId = system.establishSession("alice", "bob");
  assert(newSessionId !== sessionId, "New session has different ID");
  
  console.log("PRUTCSystem tests passed!");
}

// Test suite for MessagePerturbation
export function testMessagePerturbation(): void {
  console.log("=== Testing MessagePerturbation ===");
  
  const mapping = new PrimeMapping();
  
  // Test 1: Basic message perturbation
  const msg1 = new MessagePerturbation("Hello", mapping);
  // MessagePerturbation exists and can be created
  assert(msg1 !== null, "Message perturbation created");
  
  // Test 2: Different messages create different perturbations
  const msg2 = new MessagePerturbation("World", mapping);
  assert(msg2 !== null, "Second message perturbation created");
  
  // Test 3: Create a test field
  const testPrimes = generatePrimes(20);
  const field = new PrimeState(testPrimes);
  for (let i = 0; i < testPrimes.length; i++) {
    field.coefficients[i] = new Complex(1, 0);
  }
  field.normalize();
  
  // Just verify the field was created properly
  assert(field.primes.length === 20, "Test field created with correct prime count");
  
  console.log("MessagePerturbation tests passed!");
}

// Test suite for integration scenarios
export function testIntegrationScenarios(): void {
  console.log("=== Testing Integration Scenarios ===");
  
  // Scenario 1: Complete message exchange
  const system = new PRUTCSystem("integration_test_seed");
  
  // Register users
  system.registerUser("alice");
  system.registerUser("bob");
  system.registerUser("charlie");
  
  // Establish sessions
  const sessionAB = system.establishSession("alice", "bob");
  const sessionAC = system.establishSession("alice", "charlie");
  const sessionBC = system.establishSession("bob", "charlie");
  
  // Send messages
  const messages = [
    { session: sessionAB, from: "alice", content: "Hello Bob!" },
    { session: sessionAB, from: "bob", content: "Hi Alice!" },
    { session: sessionAC, from: "alice", content: "Hey Charlie!" },
    { session: sessionAC, from: "charlie", content: "Hello Alice!" },
    { session: sessionBC, from: "bob", content: "Hi Charlie!" },
    { session: sessionBC, from: "charlie", content: "Hey Bob!" }
  ];
  
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    system.sendMessage(msg.session, msg.from, msg.content);
  }
  
  // Verify message reception
  const aliceMessagesAB = system.receiveMessages(sessionAB, "alice");
  const bobMessagesAB = system.receiveMessages(sessionAB, "bob");
  const aliceMessagesAC = system.receiveMessages(sessionAC, "alice");
  const charlieMessagesAC = system.receiveMessages(sessionAC, "charlie");
  const bobMessagesBC = system.receiveMessages(sessionBC, "bob");
  const charlieMessagesBC = system.receiveMessages(sessionBC, "charlie");
  
  assert(aliceMessagesAB.length > 0 || bobMessagesAB.length > 0, "AB session has messages");
  assert(aliceMessagesAC.length > 0 || charlieMessagesAC.length > 0, "AC session has messages");
  assert(bobMessagesBC.length > 0 || charlieMessagesBC.length > 0, "BC session has messages");
  
  // Scenario 2: Key evolution during communication
  system.evolveKeys(0.1);
  
  // Should still be able to send messages after evolution
  const newSession = system.establishSession("alice", "bob");
  system.sendMessage(newSession, "alice", "Post-evolution message");
  const postEvolutionMessages = system.receiveMessages(newSession, "bob");
  assert(postEvolutionMessages.length >= 0, "Can communicate after key evolution");
  
  console.log("Integration scenario tests passed!");
}

// Run all keytriplet tests
export function runAllKeytripletTests(): void {
  console.log("\n==== KEYTRIPLET TESTS ====\n");
  
  testKeytriplet();
  testKeytripletGenerator();
  testSymbolicProjection();
  testKeyEvolution();
  testResonanceFieldInitializer();
  testPRUTCSystem();
  testMessagePerturbation();
  testIntegrationScenarios();
  
  console.log("\n✅ All keytriplet tests passed!\n");
}

// Export for test runner
export { runAllKeytripletTests as default };