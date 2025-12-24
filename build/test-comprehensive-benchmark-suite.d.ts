/** Exported memory */
export declare const memory: WebAssembly.Memory;
// Exported runtime interface
export declare function __new(size: number, id: number): number;
export declare function __pin(ptr: number): number;
export declare function __unpin(ptr: number): void;
export declare function __collect(): void;
export declare const __rtti_base: number;
/**
 * assembly/examples/test-comprehensive-benchmark-suite/runBenchmarkTests
 * @returns `assembly/examples/test-comprehensive-benchmark-suite/BenchmarkTestSuite`
 */
export declare function runBenchmarkTests(): __Internref8;
/** assembly/examples/test-comprehensive-benchmark-suite/BenchmarkTestSuite */
declare class __Internref8 extends Number {
  private __nominal8: symbol;
  private __nominal0: symbol;
}
