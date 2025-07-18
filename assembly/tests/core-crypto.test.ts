/**
 * Unit tests for the consolidated crypto module
 */

import {
  sha256,
  sha256String,
  hmacSha256,
  pbkdf2,
  constantTimeCompare
} from "../core/crypto";

// Helper function to convert bytes to hex string
function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    const hexByte = byte.toString(16);
    hex += hexByte.length === 1 ? "0" + hexByte : hexByte;
  }
  return hex;
}

// Test SHA-256 with empty string
export function testSha256Empty(): void {
  const result = sha256String("");
  const resultHex = bytesToHex(result);
  const expected = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  
  assert(resultHex == expected, "SHA-256 of empty string should match expected hash");
}

// Test SHA-256 with "abc"
export function testSha256Abc(): void {
  const result = sha256String("abc");
  const resultHex = bytesToHex(result);
  const expected = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
  
  assert(resultHex == expected, "SHA-256 of 'abc' should match expected hash");
}

// Test SHA-256 with byte array
export function testSha256ByteArray(): void {
  const input = new Uint8Array(3);
  input[0] = 97; // 'a'
  input[1] = 98; // 'b'
  input[2] = 99; // 'c'
  
  const result = sha256(input);
  const resultHex = bytesToHex(result);
  const expected = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
  
  assert(resultHex == expected, "SHA-256 of byte array should match expected hash");
}

// Test HMAC-SHA256
export function testHmacSha256(): void {
  const key = new Uint8Array(4);
  key[0] = 0x0b;
  key[1] = 0x0b;
  key[2] = 0x0b;
  key[3] = 0x0b;
  
  const message = new Uint8Array(8);
  // "Hi There"
  message[0] = 72;  // 'H'
  message[1] = 105; // 'i'
  message[2] = 32;  // ' '
  message[3] = 84;  // 'T'
  message[4] = 104; // 'h'
  message[5] = 101; // 'e'
  message[6] = 114; // 'r'
  message[7] = 101; // 'e'
  
  const result = hmacSha256(key, message);
  
  assert(result.length == 32, "HMAC-SHA256 should produce 32 bytes");
}

// Test HMAC-SHA256 with different keys
export function testHmacSha256DifferentKeys(): void {
  const message = new Uint8Array(4);
  message[0] = 116; // 't'
  message[1] = 101; // 'e'
  message[2] = 115; // 's'
  message[3] = 116; // 't'
  
  const key1 = new Uint8Array(4);
  key1[0] = 1;
  key1[1] = 2;
  key1[2] = 3;
  key1[3] = 4;
  
  const key2 = new Uint8Array(4);
  key2[0] = 5;
  key2[1] = 6;
  key2[2] = 7;
  key2[3] = 8;
  
  const result1 = hmacSha256(key1, message);
  const result2 = hmacSha256(key2, message);
  
  assert(bytesToHex(result1) != bytesToHex(result2), "Different keys should produce different HMACs");
}

// Test PBKDF2
export function testPbkdf2(): void {
  const password = new Uint8Array(8);
  // "password"
  password[0] = 112; // 'p'
  password[1] = 97;  // 'a'
  password[2] = 115; // 's'
  password[3] = 115; // 's'
  password[4] = 119; // 'w'
  password[5] = 111; // 'o'
  password[6] = 114; // 'r'
  password[7] = 100; // 'd'
  
  const salt = new Uint8Array(4);
  salt[0] = 115; // 's'
  salt[1] = 97;  // 'a'
  salt[2] = 108; // 'l'
  salt[3] = 116; // 't'
  
  const result = pbkdf2(password, salt, 1000, 32);
  
  assert(result.length == 32, "PBKDF2 should produce key of requested length");
}

// Test PBKDF2 with different salts
export function testPbkdf2DifferentSalts(): void {
  const password = new Uint8Array(4);
  password[0] = 116; // 't'
  password[1] = 101; // 'e'
  password[2] = 115; // 's'
  password[3] = 116; // 't'
  
  const salt1 = new Uint8Array(4);
  salt1[0] = 1;
  salt1[1] = 2;
  salt1[2] = 3;
  salt1[3] = 4;
  
  const salt2 = new Uint8Array(4);
  salt2[0] = 5;
  salt2[1] = 6;
  salt2[2] = 7;
  salt2[3] = 8;
  
  const result1 = pbkdf2(password, salt1, 100, 16);
  const result2 = pbkdf2(password, salt2, 100, 16);
  
  assert(bytesToHex(result1) != bytesToHex(result2), "Different salts should produce different keys");
}

// Test constant time compare with equal arrays
export function testConstantTimeCompareEqual(): void {
  const a = new Uint8Array(4);
  a[0] = 1;
  a[1] = 2;
  a[2] = 3;
  a[3] = 4;
  
  const b = new Uint8Array(4);
  b[0] = 1;
  b[1] = 2;
  b[2] = 3;
  b[3] = 4;
  
  assert(constantTimeCompare(a, b) == true, "Equal arrays should compare as equal");
}

// Test constant time compare with different arrays
export function testConstantTimeCompareDifferent(): void {
  const a = new Uint8Array(4);
  a[0] = 1;
  a[1] = 2;
  a[2] = 3;
  a[3] = 4;
  
  const b = new Uint8Array(4);
  b[0] = 1;
  b[1] = 2;
  b[2] = 3;
  b[3] = 5; // Different
  
  assert(constantTimeCompare(a, b) == false, "Different arrays should compare as not equal");
}

// Test constant time compare with different lengths
export function testConstantTimeCompareDifferentLengths(): void {
  const a = new Uint8Array(4);
  const b = new Uint8Array(5);
  
  assert(constantTimeCompare(a, b) == false, "Arrays of different lengths should compare as not equal");
}

// Test constant time compare with empty arrays
export function testConstantTimeCompareEmpty(): void {
  const a = new Uint8Array(0);
  const b = new Uint8Array(0);
  
  assert(constantTimeCompare(a, b) == true, "Empty arrays should compare as equal");
}

// Run all tests
export function runAllTests(): void {
  console.log("Running crypto module tests...");
  
  testSha256Empty();
  console.log("✓ SHA-256 empty string test passed");
  
  testSha256Abc();
  console.log("✓ SHA-256 'abc' test passed");
  
  testSha256ByteArray();
  console.log("✓ SHA-256 byte array test passed");
  
  testHmacSha256();
  console.log("✓ HMAC-SHA256 test passed");
  
  testHmacSha256DifferentKeys();
  console.log("✓ HMAC-SHA256 different keys test passed");
  
  testPbkdf2();
  console.log("✓ PBKDF2 test passed");
  
  testPbkdf2DifferentSalts();
  console.log("✓ PBKDF2 different salts test passed");
  
  testConstantTimeCompareEqual();
  console.log("✓ Constant time compare equal test passed");
  
  testConstantTimeCompareDifferent();
  console.log("✓ Constant time compare different test passed");
  
  testConstantTimeCompareDifferentLengths();
  console.log("✓ Constant time compare different lengths test passed");
  
  testConstantTimeCompareEmpty();
  console.log("✓ Constant time compare empty test passed");
  
  console.log("\nAll crypto module tests passed! ✨");
}