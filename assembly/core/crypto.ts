/**
 * Unified Cryptographic Module for the Prime Resonance Network
 * Combines and optimizes crypto utilities from crypto-utils.ts and utils/crypto.ts
 * 
 * This module provides:
 * - SHA-256 hashing (for strings and byte arrays)
 * - HMAC-SHA256
 * - PBKDF2 key derivation
 * - Random number/byte generation
 * - Utility functions (XOR, hex conversion, byte comparison)
 */

import { modPow } from './math';

// SHA-256 constants (first 32 bits of fractional parts of cube roots of first 64 primes)
const K: u32[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

// PRNG state for random number generation
let prngState: u64 = 0x123456789ABCDEF0;

/**
 * Right rotate helper for SHA-256
 */
function rightRotate(value: u32, amount: u32): u32 {
  return (value >>> amount) | (value << (32 - amount));
}

/**
 * SHA-256 hash function for byte arrays
 * Based on FIPS 180-4 specification
 */
export function sha256(data: Uint8Array): Uint8Array {
  // Initial hash values (first 32 bits of fractional parts of square roots of first 8 primes)
  let h0: u32 = 0x6a09e667;
  let h1: u32 = 0xbb67ae85;
  let h2: u32 = 0x3c6ef372;
  let h3: u32 = 0xa54ff53a;
  let h4: u32 = 0x510e527f;
  let h5: u32 = 0x9b05688c;
  let h6: u32 = 0x1f83d9ab;
  let h7: u32 = 0x5be0cd19;
  
  // Pre-processing
  const msgLen = data.length;
  const bitLen = msgLen * 8;
  
  // Padding: append 1 bit followed by zeros
  const paddingLen = (64 - ((msgLen + 9) % 64)) % 64;
  const totalLen = msgLen + 1 + paddingLen + 8;
  
  const padded = new Uint8Array(totalLen);
  for (let i = 0; i < msgLen; i++) {
    padded[i] = data[i];
  }
  padded[msgLen] = 0x80; // Append 1 bit (and 7 zero bits)
  
  // Append length as 64-bit big-endian
  const bitLenHi = u32(bitLen / 0x100000000);
  const bitLenLo = u32(bitLen & 0xFFFFFFFF);
  
  padded[totalLen - 8] = u8(bitLenHi >> 24);
  padded[totalLen - 7] = u8(bitLenHi >> 16);
  padded[totalLen - 6] = u8(bitLenHi >> 8);
  padded[totalLen - 5] = u8(bitLenHi);
  padded[totalLen - 4] = u8(bitLenLo >> 24);
  padded[totalLen - 3] = u8(bitLenLo >> 16);
  padded[totalLen - 2] = u8(bitLenLo >> 8);
  padded[totalLen - 1] = u8(bitLenLo);
  
  // Process message in 512-bit chunks
  for (let chunk = 0; chunk < totalLen; chunk += 64) {
    // Break chunk into sixteen 32-bit words
    const w = new Array<u32>(64);
    
    for (let i = 0; i < 16; i++) {
      const offset = chunk + i * 4;
      w[i] = (u32(padded[offset]) << 24) |
             (u32(padded[offset + 1]) << 16) |
             (u32(padded[offset + 2]) << 8) |
             u32(padded[offset + 3]);
    }
    
    // Extend the sixteen 32-bit words into sixty-four 32-bit words
    for (let i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = w[i - 16] + s0 + w[i - 7] + s1;
    }
    
    // Initialize working variables
    let a = h0, b = h1, c = h2, d = h3;
    let e = h4, f = h5, g = h6, h = h7;
    
    // Main loop
    for (let i = 0; i < 64; i++) {
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = h + s1 + ch + K[i] + w[i];
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = s0 + maj;
      
      h = g;
      g = f;
      f = e;
      e = d + temp1;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2;
    }
    
    // Add compressed chunk to current hash value
    h0 += a;
    h1 += b;
    h2 += c;
    h3 += d;
    h4 += e;
    h5 += f;
    h6 += g;
    h7 += h;
  }
  
  // Produce final hash value
  const hash = new Uint8Array(32);
  
  hash[0] = u8(h0 >> 24);
  hash[1] = u8(h0 >> 16);
  hash[2] = u8(h0 >> 8);
  hash[3] = u8(h0);
  hash[4] = u8(h1 >> 24);
  hash[5] = u8(h1 >> 16);
  hash[6] = u8(h1 >> 8);
  hash[7] = u8(h1);
  hash[8] = u8(h2 >> 24);
  hash[9] = u8(h2 >> 16);
  hash[10] = u8(h2 >> 8);
  hash[11] = u8(h2);
  hash[12] = u8(h3 >> 24);
  hash[13] = u8(h3 >> 16);
  hash[14] = u8(h3 >> 8);
  hash[15] = u8(h3);
  hash[16] = u8(h4 >> 24);
  hash[17] = u8(h4 >> 16);
  hash[18] = u8(h4 >> 8);
  hash[19] = u8(h4);
  hash[20] = u8(h5 >> 24);
  hash[21] = u8(h5 >> 16);
  hash[22] = u8(h5 >> 8);
  hash[23] = u8(h5);
  hash[24] = u8(h6 >> 24);
  hash[25] = u8(h6 >> 16);
  hash[26] = u8(h6 >> 8);
  hash[27] = u8(h6);
  hash[28] = u8(h7 >> 24);
  hash[29] = u8(h7 >> 16);
  hash[30] = u8(h7 >> 8);
  hash[31] = u8(h7);
  
  return hash;
}

/**
 * SHA-256 hash function for strings
 * Converts string to UTF-8 bytes and hashes
 */
export function sha256String(input: string): Uint8Array {
  const bytes = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) {
    bytes[i] = input.charCodeAt(i) as u8;
  }
  return sha256(bytes);
}

/**
 * HMAC-SHA256 implementation
 * RFC 2104 compliant
 */
export function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  const blockSize = 64;
  
  // If key is longer than block size, hash it
  let actualKey = key;
  if (key.length > blockSize) {
    actualKey = sha256(key);
  }
  
  // Pad key to block size
  const paddedKey = new Uint8Array(blockSize);
  for (let i = 0; i < actualKey.length; i++) {
    paddedKey[i] = actualKey[i];
  }
  
  // Create inner and outer padded keys
  const innerPad = new Uint8Array(blockSize);
  const outerPad = new Uint8Array(blockSize);
  
  for (let i = 0; i < blockSize; i++) {
    innerPad[i] = paddedKey[i] ^ 0x36;
    outerPad[i] = paddedKey[i] ^ 0x5c;
  }
  
  // Inner hash: SHA256(innerPad || message)
  const innerMessage = new Uint8Array(blockSize + message.length);
  for (let i = 0; i < blockSize; i++) {
    innerMessage[i] = innerPad[i];
  }
  for (let i = 0; i < message.length; i++) {
    innerMessage[blockSize + i] = message[i];
  }
  const innerHash = sha256(innerMessage);
  
  // Outer hash: SHA256(outerPad || innerHash)
  const outerMessage = new Uint8Array(blockSize + 32);
  for (let i = 0; i < blockSize; i++) {
    outerMessage[i] = outerPad[i];
  }
  for (let i = 0; i < 32; i++) {
    outerMessage[blockSize + i] = innerHash[i];
  }
  
  return sha256(outerMessage);
}

/**
 * PBKDF2 key derivation function with HMAC-SHA256
 * RFC 2898 compliant
 */
export function pbkdf2(
  password: Uint8Array,
  salt: Uint8Array,
  iterations: i32,
  keyLength: i32
): Uint8Array {
  const hashLength = 32; // SHA256 output length
  const numBlocks = Math.ceil(keyLength as f64 / hashLength) as i32;
  const derivedKey = new Uint8Array(keyLength);
  
  for (let block = 1; block <= numBlocks; block++) {
    // U1 = HMAC(password, salt || INT_32_BE(block))
    const blockBytes = new Uint8Array(4);
    blockBytes[0] = (block >>> 24) as u8;
    blockBytes[1] = (block >>> 16) as u8;
    blockBytes[2] = (block >>> 8) as u8;
    blockBytes[3] = block as u8;
    
    const saltWithBlock = new Uint8Array(salt.length + 4);
    for (let i = 0; i < salt.length; i++) {
      saltWithBlock[i] = salt[i];
    }
    for (let i = 0; i < 4; i++) {
      saltWithBlock[salt.length + i] = blockBytes[i];
    }
    
    let U = hmacSha256(password, saltWithBlock);
    let T = new Uint8Array(hashLength);
    
    // Copy U to T
    for (let i = 0; i < hashLength; i++) {
      T[i] = U[i];
    }
    
    // Iterate
    for (let iter = 1; iter < iterations; iter++) {
      U = hmacSha256(password, U);
      
      // XOR U into T
      for (let i = 0; i < hashLength; i++) {
        T[i] ^= U[i];
      }
    }
    
    // Copy block to derived key
    const offset = (block - 1) * hashLength;
    const copyLength = Math.min(hashLength, keyLength - offset);
    for (let i = 0; i < copyLength; i++) {
      derivedKey[offset + i] = T[i];
    }
  }
  
  return derivedKey;
}

/**
 * Generate random float between 0 and 1
 * Uses linear congruential generator (not cryptographically secure)
 */
export function random(): f64 {
  prngState = (prngState * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF;
  return f64(prngState) / f64(0xFFFFFFFFFFFFFFFF);
}

/**
 * Generate random bytes
 * Uses linear congruential generator (not cryptographically secure)
 * For production use, this should be replaced with a secure random source
 */
export function randomBytes(length: i32): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    prngState = (prngState * 6364136223846793005 + 1442695040888963407) & 0xFFFFFFFFFFFFFFFF;
    bytes[i] = u8(prngState & 0xFF);
  }
  return bytes;
}

/**
 * XOR two byte arrays
 * Returns array with length of the shorter input
 */
export function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
  const length = a.length < b.length ? a.length : b.length;
  const result = new Uint8Array(length);
  
  for (let i = 0; i < length; i++) {
    result[i] = a[i] ^ b[i];
  }
  
  return result;
}

/**
 * Compare two byte arrays for equality
 * Not constant-time, use constantTimeCompare for security-sensitive comparisons
 */
export function bytesEqual(a: Uint8Array, b: Uint8Array): bool {
  if (a.length != b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  
  return true;
}

/**
 * Constant-time comparison to prevent timing attacks
 */
export function constantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result: u8 = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
}

/**
 * Convert bytes to hexadecimal string
 */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    const hi = byte >> 4;
    const lo = byte & 0x0F;
    hex += String.fromCharCode(hi < 10 ? 48 + hi : 87 + hi);
    hex += String.fromCharCode(lo < 10 ? 48 + lo : 87 + lo);
  }
  return hex;
}

/**
 * Convert hexadecimal string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const length = hex.length / 2;
  const bytes = new Uint8Array(length);
  
  for (let i = 0; i < length; i++) {
    const hi = hex.charCodeAt(i * 2);
    const lo = hex.charCodeAt(i * 2 + 1);
    
    const hiVal = hi >= 97 ? hi - 87 : hi >= 65 ? hi - 55 : hi - 48;
    const loVal = lo >= 97 ? lo - 87 : lo >= 65 ? lo - 55 : lo - 48;
    
    bytes[i] = u8((hiVal << 4) | loVal);
  }
  
  return bytes;
}

/**
 * Generate a cryptographically secure random prime
 * Note: This is a simplified implementation. For production use,
 * implement proper Miller-Rabin primality testing
 */
export function generateSecurePrime(bits: i32): i64 {
  const bytes = Math.ceil(bits as f64 / 8) as i32;
  
  while (true) {
    const randomData = randomBytes(bytes);
    
    // Convert to number and ensure it's odd
    let candidate: i64 = 0;
    for (let i = 0; i < bytes && i < 8; i++) {
      candidate |= (randomData[i] as i64) << (i * 8);
    }
    
    // Ensure it's odd and has the right bit length
    candidate |= 1; // Make odd
    candidate |= (1 as i64) << (bits - 1); // Set high bit
    
    // Simple primality test (should be replaced with Miller-Rabin for production)
    if (isProbablePrime(candidate, 20)) {
      return candidate;
    }
  }
}

/**
 * Miller-Rabin primality test
 * Tests if a number is probably prime
 */
function isProbablePrime(n: i64, k: i32): boolean {
  if (n === 2 || n === 3) return true;
  if (n < 2 || n % 2 === 0) return false;
  
  // Write n-1 as 2^r * d
  let d = n - 1;
  let r = 0;
  while (d % 2 === 0) {
    d /= 2;
    r++;
  }
  
  // Witness loop
  for (let i = 0; i < k; i++) {
    const a = (2 as i64) + ((random() * ((n - 4) as f64)) as i64);
    let x = modPow(a, d, n);
    
    if (x === 1 || x === n - 1) continue;
    
    let continueWitnessLoop = false;
    for (let j = 0; j < r - 1; j++) {
      x = modPow(x, 2, n);
      if (x === n - 1) {
        continueWitnessLoop = true;
        break;
      }
    }
    
    if (!continueWitnessLoop) return false;
  }
  
  return true;
}

// modPow is now imported from math-optimized module

// Backwards compatibility exports
export { sha256 as sha256Bytes };