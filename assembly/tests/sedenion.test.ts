import { Sedenion } from '../sedenion';
// @ts-ignore
import { describe, test, expect } from './mocks';

// @ts-ignore
describe("Sedenion", () => {
  // @ts-ignore
  test("should create zero sedenion", () => {
    const s = Sedenion.zero();
    // @ts-ignore
    expect(s.c0).toBe(0.0);
    // @ts-ignore
    expect(s.c15).toBe(0.0);
  });

  // @ts-ignore
  test("should create unit sedenion", () => {
    const s = Sedenion.unit();
    // @ts-ignore
    expect(s.c0).toBe(1.0);
    // @ts-ignore
    expect(s.c1).toBe(0.0);
  });

  // @ts-ignore
  test("should add sedenions", () => {
    const s1 = Sedenion.unit();
    const s2 = Sedenion.unit();
    const result = s1.add(s2);
    // @ts-ignore
    expect(result.c0).toBe(2.0);
  });

  // @ts-ignore
  test("should calculate entropy", () => {
    // Uniform distribution should have max entropy
    // But normalized unit vector has 0 entropy (100% certainty)
    const s = Sedenion.unit();
    // @ts-ignore
    expect(s.entropy()).toBe(0.0);
  });
});