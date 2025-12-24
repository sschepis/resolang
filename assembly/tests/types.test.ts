import {
  Complex,
  ResonantFragment,
  ProtocolType,
  NetworkError,
  ProtocolError,
  EntanglementLink,
  NodeMetadata,
  PrimeFieldElement,
  Prime,
} from "../types";
import { JSONBuilder } from "../core/serialization";

export function testComplexConstructor(): void {
  const c1 = new Complex();
  assert(c1.real == 0, "Default real should be 0");
  assert(c1.imag == 0, "Default imag should be 0");

  const c2 = new Complex(3, 4);
  assert(c2.real == 3, "Real should be 3");
  assert(c2.imag == 4, "Imag should be 4");
}

export function testComplexFromPolar(): void {
  const c = Complex.fromPolar(5, Math.atan2(4, 3));
  assert(Math.abs(c.real - 3) < 0.0001, "Real from polar should be approximately 3");
  assert(Math.abs(c.imag - 4) < 0.0001, "Imag from polar should be approximately 4");
}

export function testComplexAdd(): void {
  const c1 = new Complex(1, 2);
  const c2 = new Complex(3, 4);
  const result = c1.add(c2);
  assert(result.real == 4, "Add real should be 4");
  assert(result.imag == 6, "Add imag should be 6");
}

export function testComplexSubtract(): void {
  const c1 = new Complex(5, 7);
  const c2 = new Complex(3, 2);
  const result = c1.subtract(c2);
  assert(result.real == 2, "Subtract real should be 2");
  assert(result.imag == 5, "Subtract imag should be 5");
}

export function testComplexMultiply(): void {
  const c1 = new Complex(1, 2);
  const c2 = new Complex(3, 4);
  const result = c1.multiply(c2);
  assert(result.real == -5, "Multiply real should be -5");
  assert(result.imag == 10, "Multiply imag should be 10");
}

export function testComplexDivide(): void {
  const c1 = new Complex(1, 2);
  const c2 = new Complex(3, 4);
  const result = c1.divide(c2);
  assert(Math.abs(result.real - 0.44) < 0.0001, "Divide real should be approximately 0.44");
  assert(Math.abs(result.imag - 0.08) < 0.0001, "Divide imag should be approximately 0.08");
}

export function testComplexDivAlias(): void {
  const c1 = new Complex(1, 2);
  const c2 = new Complex(3, 4);
  const result = c1.div(c2);
  assert(Math.abs(result.real - 0.44) < 0.0001, "Div alias real should be approximately 0.44");
  assert(Math.abs(result.imag - 0.08) < 0.0001, "Div alias imag should be approximately 0.08");
}

export function testComplexScale(): void {
  const c = new Complex(3, 4);
  const result = c.scale(2);
  assert(result.real == 6, "Scale real should be 6");
  assert(result.imag == 8, "Scale imag should be 8");
}

export function testComplexConjugate(): void {
  const c = new Complex(3, 4);
  const result = c.conjugate();
  assert(result.real == 3, "Conjugate real should be 3");
  assert(result.imag == -4, "Conjugate imag should be -4");
}

export function testComplexMagnitude(): void {
  const c = new Complex(3, 4);
  assert(c.magnitude() == 5, "Magnitude should be 5");
}

export function testComplexMagnitudeSquared(): void {
  const c = new Complex(3, 4);
  assert(c.magnitudeSquared() == 25, "Magnitude squared should be 25");
}

export function testComplexAbsAlias(): void {
  const c = new Complex(3, 4);
  assert(c.abs() == 5, "Abs alias should be 5");
}

export function testComplexSquaredMagnitude(): void {
  const c = new Complex(3, 4);
  assert(c.squaredMagnitude() == 25, "Squared magnitude should be 25");
}

export function testComplexPhase(): void {
  const c = new Complex(0, 1);
  assert(c.phase() == Math.PI / 2, "Phase of (0,1) should be PI/2");
}

export function testComplexToString(): void {
  const c1 = new Complex(3, 4);
  const s1 = c1.toString();
  assert(s1.includes("3.0000") && s1.includes("+4.0000i"), "ToString for positive imag should be correct");
  
  const c2 = new Complex(3, -4);
  const s2 = c2.toString();
  assert(s2.includes("3.0000") && s2.includes("-4.0000i"), "ToString for negative imag should be correct");

  const c3 = new Complex(3.123, 4.567);
  const s3 = c3.toString();
  assert(s3.includes("3.1230") && s3.includes("+4.5670i"), "ToString for floating point imag should be correct");

  const c4 = new Complex(0, 0);
  const s4 = c4.toString();
  assert(s4 == "0.0000+0.0000i", "ToString for zero complex number should be correct");
}

export function testComplexToJSON(): void {
  const c = new Complex(3, 4);
  const json = c.toJSON();
  assert(json.includes('"real":3'), "JSON should contain real part");
  assert(json.includes('"imag":4'), "JSON should contain imag part");
}

export function testComplexClone(): void {
  const c1 = new Complex(3, 4);
  const c2 = c1.clone();
  assert(c1.real == c2.real, "Cloned real should be same");
  assert(c1.imag == c2.imag, "Cloned imag should be same");
  assert(c1 != c2, "Cloned object should be different instance");
}

export function testComplexExp(): void {
  const c = new Complex(0, Math.PI / 2); // e^(i*PI/2) = i
  const result = c.exp();
  assert(Math.abs(result.real) < 0.0001, "Exp real should be approximately 0");
  assert(Math.abs(result.imag - 1) < 0.0001, "Exp imag should be approximately 1");
}

export function testResonantFragmentConstructorTypes(): void {
  const data = new Uint8Array(10);
  const primeSignature = new Array<Prime>();
  primeSignature.push(2);
  primeSignature.push(3);
  const fragment = new ResonantFragment(data, 0.5, 123456789, primeSignature);
  assert(fragment.data.byteLength == 10, "Fragment data length should be 10");
  assert(fragment.entropy == 0.5, "Fragment entropy should be 0.5");
  assert(fragment.timestamp == 123456789, "Fragment timestamp should be correct");
  assert(fragment.primeSignature.length == 2, "Fragment prime signature length should be 2");
}

export function testProtocolTypeEnum(): void {
  assert(ProtocolType.EIP == 0, "EIP should be 0");
  assert(ProtocolType.MTP == 1, "MTP should be 1");
  assert(ProtocolType.RRP == 2, "RRP should be 2");
  assert(ProtocolType.PSP == 3, "PSP should be 3");
}

export function testNetworkErrorEnum(): void {
  assert(NetworkError.NODE_NOT_FOUND == 1001, "NODE_NOT_FOUND should be 1001");
  assert(NetworkError.LOW_COHERENCE == 1004, "LOW_COHERENCE should be 1004");
}

export function testProtocolErrorEnum(): void {
  assert(ProtocolError.TIMEOUT == 2001, "TIMEOUT should be 2001");
  assert(ProtocolError.ROUTE_NOT_FOUND == 2005, "ROUTE_NOT_FOUND should be 2005");
}

export function testEntanglementLinkConstructor(): void {
  const link = new EntanglementLink("nodeA", "nodeB", 0.9, 100, 200);
  assert(link.sourceId == "nodeA", "Source ID should be nodeA");
  assert(link.targetId == "nodeB", "Target ID should be nodeB");
  assert(link.strength == 0.9, "Strength should be 0.9");
  assert(link.establishedAt == 100, "EstablishedAt should be 100");
  assert(link.lastSync == 200, "LastSync should be 200");
}

export function testNodeMetadataConstructor(): void {
  const metadata = new NodeMetadata("nodeX", 0.8, 0.1, 50, 300);
  assert(metadata.nodeId == "nodeX", "Node ID should be nodeX");
  assert(metadata.coherence == 0.8, "Coherence should be 0.8");
  assert(metadata.entropy == 0.1, "Entropy should be 0.1");
  assert(metadata.memoryUsage == 50, "Memory usage should be 50");
  assert(metadata.lastHeartbeat == 300, "Last heartbeat should be 300");
}

export function testPrimeFieldElementConstructor(): void {
  const pfe = new PrimeFieldElement(10, 3); // 10 % 3 = 1
  assert(pfe.value == 1, "Value should be 1 (10 mod 3)");
  assert(pfe.modulus == 3, "Modulus should be 3");

  const pfeNeg = new PrimeFieldElement(-5, 3); // -5 % 3 = -2, then +3 = 1
  assert(pfeNeg.value == 1, "Value for negative input should be 1");
}

export function testPrimeFieldElementAdd(): void {
  const pfe1 = new PrimeFieldElement(1, 3);
  const pfe2 = new PrimeFieldElement(2, 3);
  const result = pfe1.add(pfe2);
  assert(result.value == 0, "Add result should be 0 (1+2 mod 3)");
}

export function testPrimeFieldElementMultiply(): void {
  const pfe1 = new PrimeFieldElement(2, 5);
  const pfe2 = new PrimeFieldElement(3, 5);
  const result = pfe1.multiply(pfe2);
  assert(result.value == 1, "Multiply result should be 1 (2*3 mod 5)");
}

export function testPrimeFieldElementPower(): void {
  const pfe = new PrimeFieldElement(2, 5);
  const result = pfe.power(3); // 2^3 = 8, 8 mod 5 = 3
  assert(result.value == 3, "Power result should be 3 (2^3 mod 5)");
}

export function testPrimeFieldElementInverse(): void {
  const pfe = new PrimeFieldElement(3, 7); // Inverse of 3 mod 7 is 5 (3*5 = 15 = 1 mod 7)
  const result = pfe.inverse();
  assert(result.value == 5, "Inverse result should be 5");
}

export function runAllTypesTests(): void {
  console.log("Running types tests...");

  testComplexConstructor();
  console.log("✓ testComplexConstructor passed");
  testComplexFromPolar();
  console.log("✓ testComplexFromPolar passed");
  testComplexAdd();
  console.log("✓ testComplexAdd passed");
  testComplexSubtract();
  console.log("✓ testComplexSubtract passed");
  testComplexMultiply();
  console.log("✓ testComplexMultiply passed");
  testComplexDivide();
  console.log("✓ testComplexDivide passed");
  testComplexDivAlias();
  console.log("✓ testComplexDivAlias passed");
  testComplexScale();
  console.log("✓ testComplexScale passed");
  testComplexConjugate();
  console.log("✓ testComplexConjugate passed");
  testComplexMagnitude();
  console.log("✓ testComplexMagnitude passed");
  testComplexMagnitudeSquared();
  console.log("✓ testComplexMagnitudeSquared passed");
  testComplexAbsAlias();
  console.log("✓ testComplexAbsAlias passed");
  testComplexSquaredMagnitude();
  console.log("✓ testComplexSquaredMagnitude passed");
  testComplexPhase();
  console.log("✓ testComplexPhase passed");
  testComplexToString();
  console.log("✓ testComplexToString passed");
  testComplexToJSON();
  console.log("✓ testComplexToJSON passed");
  testComplexClone();
  console.log("✓ testComplexClone passed");
  testComplexExp();
  console.log("✓ testComplexExp passed");

  testResonantFragmentConstructorTypes();
  console.log("✓ testResonantFragmentConstructorTypes passed");

  testProtocolTypeEnum();
  console.log("✓ testProtocolTypeEnum passed");

  testNetworkErrorEnum();
  console.log("✓ testNetworkErrorEnum passed");

  testProtocolErrorEnum();
  console.log("✓ testProtocolErrorEnum passed");

  testEntanglementLinkConstructor();
  console.log("✓ testEntanglementLinkConstructor passed");

  testNodeMetadataConstructor();
  console.log("✓ testNodeMetadataConstructor passed");

  testPrimeFieldElementConstructor();
  console.log("✓ testPrimeFieldElementConstructor passed");
  testPrimeFieldElementAdd();
  console.log("✓ testPrimeFieldElementAdd passed");
  testPrimeFieldElementMultiply();
  console.log("✓ testPrimeFieldElementMultiply passed");
  testPrimeFieldElementPower();
  console.log("✓ testPrimeFieldElementPower passed");
  testPrimeFieldElementInverse();
  console.log("✓ testPrimeFieldElementInverse passed");

  console.log("\nAll types tests passed! ✨");
}