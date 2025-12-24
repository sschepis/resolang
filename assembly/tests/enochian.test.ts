import { parseEnochian, getPreferredLetter, primesToEnochian } from '../enochian';
// @ts-ignore
import { describe, test, expect } from './mocks';

// @ts-ignore
describe("Enochian", () => {
  // @ts-ignore
  test("should parse Enochian text", () => {
    const result = parseEnochian("OL");
    // @ts-ignore
    expect(result.primes.length).toBe(2);
    // @ts-ignore
    expect(result.primes[0]).toBe(19); // O
    // @ts-ignore
    expect(result.primes[1]).toBe(17); // L
  });

  // @ts-ignore
  test("should calculate twist", () => {
    const result = parseEnochian("OL");
    // @ts-ignore
    expect(result.totalTwist).toBeGreaterThan(0.0);
  });

  // @ts-ignore
  test("should convert primes to Enochian", () => {
    // @ts-ignore
    const primes = [19, 17];
    const text = primesToEnochian(primes);
    // @ts-ignore
    expect(text).toBe("OL");
  });

  // @ts-ignore
  test("should get preferred letter", () => {
    // @ts-ignore
    expect(getPreferredLetter(7, 1)).toBe("A");
    // @ts-ignore
    expect(getPreferredLetter(7, 2)).toBe("B");
    // @ts-ignore
    expect(getPreferredLetter(7, 3)).toBe("C");
  });
});