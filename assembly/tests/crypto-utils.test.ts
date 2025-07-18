// crypto-utils.test.ts
// Unit tests for cryptographic utility functions

import {
  sha256String,
  sha256,
  hmacSha256,
  pbkdf2,
  generateSecurePrime,
  randomBytes
} from "../core/crypto";

import { isPrime } from "../core/math";

// Test framework helpers
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error("Assertion failed: " + message);
  }
}

function assertEquals(actual: string, expected: string, message: string): void {
  assert(actual === expected, `${message} - Expected: ${expected}, Got: ${actual}`);
}

function assertArrayEquals(actual: Uint8Array, expected: Uint8Array, message: string): void {
  assert(actual.length === expected.length, `${message} - Length mismatch`);
  for (let i = 0; i < actual.length; i++) {
    assert(actual[i] === expected[i], `${message} - Byte ${i} mismatch`);
  }
}

// Test suite for SHA-256
export function testSHA256(): void {
  console.log("=== Testing SHA-256 ===");
  
  // Test 1: Empty string
  const empty = sha256String("");
  assertEquals(
    bytesToHex(empty),
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "SHA-256 empty string"
  );
  
  // Test 2: "abc"
  const abc = sha256String("abc");
  assertEquals(
    bytesToHex(abc),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    "SHA-256 'abc'"
  );
  
  // Test 3: Long message
  const longMsg = "The quick brown fox jumps over the lazy dog";
  const longHash = sha256String(longMsg);
  assertEquals(
    bytesToHex(longHash),
    "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
    "SHA-256 long message"
  );
  
  // Test 4: Byte array input
  const bytes = new Uint8Array(5);
  bytes[0] = 1; bytes[1] = 2; bytes[2] = 3; bytes[3] = 4; bytes[4] = 5;
  const byteHash = sha256(bytes);
  assert(byteHash.length === 32, "SHA-256 output should be 32 bytes");
  
  console.log("SHA-256 tests passed!");
}

// Test suite for HMAC-SHA256
export function testHMACSHA256(): void {
  console.log("=== Testing HMAC-SHA256 ===");
  
  // Test 1: Basic HMAC
  const key1 = new Uint8Array(5);
  key1[0] = 1; key1[1] = 2; key1[2] = 3; key1[3] = 4; key1[4] = 5;
  const msg1 = new Uint8Array(5);
  msg1[0] = 6; msg1[1] = 7; msg1[2] = 8; msg1[3] = 9; msg1[4] = 10;
  const hmac1 = hmacSha256(msg1, key1);
  assert(hmac1.length === 32, "HMAC-SHA256 output should be 32 bytes");
  
  // Test 2: Empty message
  const key2 = stringToBytes("secret");
  const msg2 = new Uint8Array(0);
  const hmac2 = hmacSha256(msg2, key2);
  assert(hmac2.length === 32, "HMAC-SHA256 with empty message");
  
  // Test 3: Long key (> 64 bytes)
  const longKey = new Uint8Array(100);
  for (let i = 0; i < 100; i++) longKey[i] = i as u8;
  const msg3 = stringToBytes("message");
  const hmac3 = hmacSha256(msg3, longKey);
  assert(hmac3.length === 32, "HMAC-SHA256 with long key");
  
  // Test 4: Consistency
  const hmac4a = hmacSha256(msg1, key1);
  const hmac4b = hmacSha256(msg1, key1);
  assertArrayEquals(hmac4a, hmac4b, "HMAC-SHA256 consistency");
  
  console.log("HMAC-SHA256 tests passed!");
}

// Test suite for PBKDF2
export function testPBKDF2(): void {
  console.log("=== Testing PBKDF2 ===");
  
  // Test 1: Basic derivation
  const password1 = stringToBytes("password");
  const salt1 = stringToBytes("salt");
  const key1 = pbkdf2(password1, salt1, 1000, 32);
  assert(key1.length === 32, "PBKDF2 output length");
  
  // Test 2: Different iteration counts
  const key2a = pbkdf2(password1, salt1, 1000, 32);
  const key2b = pbkdf2(password1, salt1, 2000, 32);
  let different = false;
  for (let i = 0; i < 32; i++) {
    if (key2a[i] !== key2b[i]) {
      different = true;
      break;
    }
  }
  assert(different, "PBKDF2 different iterations should produce different keys");
  
  // Test 3: Different salts
  const salt3 = stringToBytes("different_salt");
  const key3a = pbkdf2(password1, salt1, 1000, 32);
  const key3b = pbkdf2(password1, salt3, 1000, 32);
  different = false;
  for (let i = 0; i < 32; i++) {
    if (key3a[i] !== key3b[i]) {
      different = true;
      break;
    }
  }
  assert(different, "PBKDF2 different salts should produce different keys");
  
  // Test 4: Variable output length
  const key4a = pbkdf2(password1, salt1, 1000, 16);
  const key4b = pbkdf2(password1, salt1, 1000, 64);
  assert(key4a.length === 16, "PBKDF2 16-byte output");
  assert(key4b.length === 64, "PBKDF2 64-byte output");
  
  console.log("PBKDF2 tests passed!");
}

// Test suite for prime generation
export function testPrimeGeneration(): void {
  console.log("=== Testing Prime Generation ===");
  
  // Test 1: Primality test
  assert(isPrime(2), "2 is prime");
  assert(isPrime(3), "3 is prime");
  assert(isPrime(5), "5 is prime");
  assert(isPrime(7), "7 is prime");
  assert(!isPrime(4), "4 is not prime");
  assert(!isPrime(9), "9 is not prime");
  
  // Test 2: Known primes
  const knownPrimes: Array<i64> = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  for (let i = 0; i < knownPrimes.length; i++) {
    assert(isPrime(knownPrimes[i]), `${knownPrimes[i]} is prime`);
  }
  
  // Test 3: Known composites
  const composites: Array<i64> = [15, 21, 25, 27, 33, 35, 39, 45, 49];
  for (let i = 0; i < composites.length; i++) {
    assert(!isPrime(composites[i]), `${composites[i]} is not prime`);
  }
  
  // Test 4: Generate secure prime
  const prime = generateSecurePrime(16); // 16-bit prime
  assert(prime > 0, "Generated prime is positive");
  assert(isPrime(prime), "Generated number is prime");
  assert(prime < 65536, "16-bit prime is within range");
  
  // Test 5: Multiple primes are different
  const prime1 = generateSecurePrime(16);
  const prime2 = generateSecurePrime(16);
  const prime3 = generateSecurePrime(16);
  assert(
    prime1 !== prime2 || prime2 !== prime3 || prime1 !== prime3,
    "Generated primes should be different"
  );
  
  console.log("Prime generation tests passed!");
}

// Test suite for random bytes
export function testRandomBytes(): void {
  console.log("=== Testing Random Bytes ===");
  
  // Test 1: Correct length
  const bytes1 = randomBytes(16);
  assert(bytes1.length === 16, "Random bytes length 16");
  
  const bytes2 = randomBytes(32);
  assert(bytes2.length === 32, "Random bytes length 32");
  
  // Test 2: Non-zero (very high probability)
  let hasNonZero = false;
  for (let i = 0; i < bytes1.length; i++) {
    if (bytes1[i] !== 0) {
      hasNonZero = true;
      break;
    }
  }
  assert(hasNonZero, "Random bytes should contain non-zero values");
  
  // Test 3: Different calls produce different results
  const bytes3 = randomBytes(16);
  const bytes4 = randomBytes(16);
  let isDifferent = false;
  for (let i = 0; i < 16; i++) {
    if (bytes3[i] !== bytes4[i]) {
      isDifferent = true;
      break;
    }
  }
  assert(isDifferent, "Random bytes should be different on each call");
  
  // Test 4: Distribution (basic check)
  const bytes5 = randomBytes(1000);
  let sum: i32 = 0;
  for (let i = 0; i < bytes5.length; i++) {
    sum += bytes5[i];
  }
  const average = sum / bytes5.length;
  assert(average > 100 && average < 155, "Random bytes average should be near 127.5");
  
  console.log("Random bytes tests passed!");
}

// Helper functions
function stringToBytes(str: string): Uint8Array {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i) as u8;
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    const h = byte.toString(16);
    hex += h.length === 1 ? "0" + h : h;
  }
  return hex;
}

// Run all crypto utility tests
export function runAllCryptoUtilTests(): void {
  console.log("\n==== CRYPTO UTILITY TESTS ====\n");
  
  testSHA256();
  testHMACSHA256();
  testPBKDF2();
  testPrimeGeneration();
  testRandomBytes();
  
  console.log("\n✅ All crypto utility tests passed!\n");
}

// Export for test runner
export { runAllCryptoUtilTests as default };