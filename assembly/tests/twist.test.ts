import { getTwistAngle, isTwistClosed, getMod30Residue } from '../twist';
// @ts-ignore
import { PI } from '../core/math';
// @ts-ignore
import { describe, test, expect } from './mocks';

// @ts-ignore
describe("Twist Theory", () => {
  // @ts-ignore
  test("should calculate twist angle", () => {
    const angle = getTwistAngle(108);
    // @ts-ignore
    const expected = (2.0 * PI) / 108.0;
    // @ts-ignore
    expect(angle).toBeCloseTo(expected);
  });

  // @ts-ignore
  test("should detect closure", () => {
    // @ts-ignore
    const twoPi = 2.0 * PI;
    // @ts-ignore
    expect(isTwistClosed(twoPi)).toBe(true);
    // @ts-ignore
    expect(isTwistClosed(twoPi + 0.001)).toBe(true);
    // @ts-ignore
    expect(isTwistClosed(twoPi + 0.5)).toBe(false);
  });

  // @ts-ignore
  test("should calculate mod 30 residue", () => {
    // @ts-ignore
    expect(getMod30Residue(31)).toBe(1);
    // @ts-ignore
    expect(getMod30Residue(37)).toBe(7);
    // @ts-ignore
    expect(getMod30Residue(29)).toBe(29);
  });
});