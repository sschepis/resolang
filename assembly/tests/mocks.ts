// Mock testing functions for AssemblyScript
// These are used to allow test files to compile, even though the actual
// test runner (JS) will mock them or they won't be called directly.

// @ts-ignore
@external("env", "describe")
export declare function describe(name: string, fn: () => void): void;

// @ts-ignore
@external("env", "test")
export declare function test(name: string, fn: () => void): void;

// @ts-ignore
@external("env", "beforeEach")
export declare function beforeEach(fn: () => void): void;

// @ts-ignore
@external("env", "afterEach")
export declare function afterEach(fn: () => void): void;

// @ts-ignore
@external("env", "expect")
export declare function expect<T>(actual: T): Expectation<T>;

export class Expectation<T> {
  // @ts-ignore
  toBe(expected: T): void {}
  // @ts-ignore
  toBeCloseTo(expected: f64): void {}
  // @ts-ignore
  toBeGreaterThan(expected: T): void {}
  // @ts-ignore
  toBeLessThan(expected: T): void {}
}

export class MockQuantumNode {
  // @ts-ignore
  id: string;
}