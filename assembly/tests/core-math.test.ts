/**
 * Unit tests for the consolidated math module
 */

import {
  isPrime,
  isPrimeLarge,
  nextPrime,
  generatePrimes,
  gcd,
  lcm,
  modExp,
  modInverse,
  extendedGCD,
  generateSecurePrime,
  factorial,
  fibonacci,
  isqrt,
  binomial
} from "../core/math";

// Test isPrime function
export function testIsPrime(): void {
  // Test small primes
  assert(isPrime(2) == true, "2 should be prime");
  assert(isPrime(3) == true, "3 should be prime");
  assert(isPrime(5) == true, "5 should be prime");
  assert(isPrime(7) == true, "7 should be prime");
  assert(isPrime(11) == true, "11 should be prime");
  assert(isPrime(13) == true, "13 should be prime");
  
  // Test non-primes
  assert(isPrime(0) == false, "0 should not be prime");
  assert(isPrime(1) == false, "1 should not be prime");
  assert(isPrime(4) == false, "4 should not be prime");
  assert(isPrime(6) == false, "6 should not be prime");
  assert(isPrime(8) == false, "8 should not be prime");
  assert(isPrime(9) == false, "9 should not be prime");
  assert(isPrime(10) == false, "10 should not be prime");
  
  // Test larger primes
  assert(isPrime(97) == true, "97 should be prime");
  assert(isPrime(101) == true, "101 should be prime");
  assert(isPrime(103) == true, "103 should be prime");
  
  // Test larger non-primes
  assert(isPrime(100) == false, "100 should not be prime");
  assert(isPrime(102) == false, "102 should not be prime");
}

// Test isPrimeLarge function
export function testIsPrimeLarge(): void {
  // Test small primes as u64
  assert(isPrimeLarge(2) == true, "2 should be prime (u64)");
  assert(isPrimeLarge(3) == true, "3 should be prime (u64)");
  assert(isPrimeLarge(5) == true, "5 should be prime (u64)");
  
  // Test larger primes
  assert(isPrimeLarge(1009) == true, "1009 should be prime");
  assert(isPrimeLarge(10007) == true, "10007 should be prime");
  
  // Test non-primes
  assert(isPrimeLarge(1000) == false, "1000 should not be prime");
  assert(isPrimeLarge(10000) == false, "10000 should not be prime");
}

// Test nextPrime function
export function testNextPrime(): void {
  assert(nextPrime(2) == 3, "Next prime after 2 should be 3");
  assert(nextPrime(3) == 5, "Next prime after 3 should be 5");
  assert(nextPrime(4) == 5, "Next prime after 4 should be 5");
  assert(nextPrime(5) == 7, "Next prime after 5 should be 7");
  assert(nextPrime(10) == 11, "Next prime after 10 should be 11");
  assert(nextPrime(100) == 101, "Next prime after 100 should be 101");
}

// Test generatePrimes function
export function testGeneratePrimes(): void {
  const primes5 = generatePrimes(5);
  assert(primes5.length == 5, "Should generate 5 primes");
  assert(primes5[0] == 2, "First prime should be 2");
  assert(primes5[1] == 3, "Second prime should be 3");
  assert(primes5[2] == 5, "Third prime should be 5");
  assert(primes5[3] == 7, "Fourth prime should be 7");
  assert(primes5[4] == 11, "Fifth prime should be 11");
  
  const primes10 = generatePrimes(10);
  assert(primes10.length == 10, "Should generate 10 primes");
  assert(primes10[9] == 29, "Tenth prime should be 29");
}

// Test GCD function
export function testGCD(): void {
  assert(gcd(12, 8) == 4, "GCD of 12 and 8 should be 4");
  assert(gcd(54, 24) == 6, "GCD of 54 and 24 should be 6");
  assert(gcd(17, 13) == 1, "GCD of 17 and 13 should be 1");
  assert(gcd(100, 50) == 50, "GCD of 100 and 50 should be 50");
  assert(gcd(0, 5) == 5, "GCD of 0 and 5 should be 5");
  assert(gcd(5, 0) == 5, "GCD of 5 and 0 should be 5");
}

// Test LCM function
export function testLCM(): void {
  assert(lcm(4, 6) == 12, "LCM of 4 and 6 should be 12");
  assert(lcm(3, 5) == 15, "LCM of 3 and 5 should be 15");
  assert(lcm(12, 18) == 36, "LCM of 12 and 18 should be 36");
  assert(lcm(7, 7) == 7, "LCM of 7 and 7 should be 7");
}

// Test modular exponentiation
export function testModExp(): void {
  assert(modExp(2, 3, 5) == 3, "2^3 mod 5 should be 3");
  assert(modExp(3, 4, 7) == 4, "3^4 mod 7 should be 4");
  assert(modExp(5, 3, 13) == 8, "5^3 mod 13 should be 8");
  assert(modExp(2, 10, 1000) == 24, "2^10 mod 1000 should be 24");
}

// Test modular inverse
export function testModInverse(): void {
  assert(modInverse(3, 7) == 5, "Inverse of 3 mod 7 should be 5");
  assert(modInverse(5, 11) == 9, "Inverse of 5 mod 11 should be 9");
  assert(modInverse(7, 13) == 2, "Inverse of 7 mod 13 should be 2");
  
  // Test case where inverse doesn't exist
  assert(modInverse(6, 9) == -1, "Inverse of 6 mod 9 should not exist");
}

// Test extended GCD
export function testExtendedGCD(): void {
  const result1 = extendedGCD(30, 18);
  assert(result1.gcd == 6, "GCD of 30 and 18 should be 6");
  assert(30 * result1.x + 18 * result1.y == 6, "Bezout coefficients should satisfy equation");
  
  const result2 = extendedGCD(35, 15);
  assert(result2.gcd == 5, "GCD of 35 and 15 should be 5");
  assert(35 * result2.x + 15 * result2.y == 5, "Bezout coefficients should satisfy equation");
}

// Test generateSecurePrime
export function testGenerateSecurePrime(): void {
  const prime = generateSecurePrime(8);
  assert(prime >= 128 && prime < 256, "8-bit prime should be in range [128, 256)");
  assert(isPrimeLarge(prime) == true, "Generated number should be prime");
}

// Test factorial
export function testFactorial(): void {
  assert(factorial(0) == 1, "0! should be 1");
  assert(factorial(1) == 1, "1! should be 1");
  assert(factorial(5) == 120, "5! should be 120");
  assert(factorial(6) == 720, "6! should be 720");
  assert(factorial(10) == 3628800, "10! should be 3628800");
}

// Test fibonacci
export function testFibonacci(): void {
  assert(fibonacci(0) == 0, "F(0) should be 0");
  assert(fibonacci(1) == 1, "F(1) should be 1");
  assert(fibonacci(2) == 1, "F(2) should be 1");
  assert(fibonacci(3) == 2, "F(3) should be 2");
  assert(fibonacci(4) == 3, "F(4) should be 3");
  assert(fibonacci(5) == 5, "F(5) should be 5");
  assert(fibonacci(10) == 55, "F(10) should be 55");
}

// Test integer square root
export function testIsqrt(): void {
  assert(isqrt(0) == 0, "isqrt(0) should be 0");
  assert(isqrt(1) == 1, "isqrt(1) should be 1");
  assert(isqrt(4) == 2, "isqrt(4) should be 2");
  assert(isqrt(9) == 3, "isqrt(9) should be 3");
  assert(isqrt(16) == 4, "isqrt(16) should be 4");
  assert(isqrt(15) == 3, "isqrt(15) should be 3");
  assert(isqrt(17) == 4, "isqrt(17) should be 4");
  assert(isqrt(100) == 10, "isqrt(100) should be 10");
}

// Test binomial coefficient
export function testBinomial(): void {
  assert(binomial(5, 0) == 1, "C(5,0) should be 1");
  assert(binomial(5, 1) == 5, "C(5,1) should be 5");
  assert(binomial(5, 2) == 10, "C(5,2) should be 10");
  assert(binomial(5, 3) == 10, "C(5,3) should be 10");
  assert(binomial(5, 4) == 5, "C(5,4) should be 5");
  assert(binomial(5, 5) == 1, "C(5,5) should be 1");
  assert(binomial(10, 3) == 120, "C(10,3) should be 120");
}

// Run all tests
export function runAllTests(): void {
  console.log("Running math module tests...");
  
  testIsPrime();
  console.log("✓ isPrime test passed");
  
  testIsPrimeLarge();
  console.log("✓ isPrimeLarge test passed");
  
  testNextPrime();
  console.log("✓ nextPrime test passed");
  
  testGeneratePrimes();
  console.log("✓ generatePrimes test passed");
  
  testGCD();
  console.log("✓ GCD test passed");
  
  testLCM();
  console.log("✓ LCM test passed");
  
  testModExp();
  console.log("✓ Modular exponentiation test passed");
  
  testModInverse();
  console.log("✓ Modular inverse test passed");
  
  testExtendedGCD();
  console.log("✓ Extended GCD test passed");
  
  testGenerateSecurePrime();
  console.log("✓ Generate secure prime test passed");
  
  testFactorial();
  console.log("✓ Factorial test passed");
  
  testFibonacci();
  console.log("✓ Fibonacci test passed");
  
  testIsqrt();
  console.log("✓ Integer square root test passed");
  
  testBinomial();
  console.log("✓ Binomial coefficient test passed");
  
  console.log("\nAll math module tests passed! ✨");
}