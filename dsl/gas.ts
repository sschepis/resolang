// ResoLang Gas Metering - Execution cost tracking and limits

/**
 * Gas costs for different operations
 * Calibrated to reflect computational complexity
 */
export const GAS_COSTS = {
  // Basic operations
  STATEMENT: 1,
  VARIABLE_DECLARATION: 3,
  VARIABLE_ASSIGNMENT: 2,
  EXPRESSION_EVAL: 1,
  
  // Control flow
  CONDITION_CHECK: 2,
  LOOP_ITERATION: 3,
  FUNCTION_CALL: 10,
  BLOCK_ENTER: 1,
  
  // Arithmetic
  ADD: 1,
  SUBTRACT: 1,
  MULTIPLY: 2,
  DIVIDE: 3,
  MODULO: 3,
  
  // Comparison
  COMPARE: 1,
  
  // Prime operations (expensive)
  IS_PRIME: 50,
  FACTORIZE: 100,
  GET_PRIMES: 20,
  COMPUTE_RESONANCE: 150,
  
  // State operations
  QUATERNION_CREATE: 25,
  SUPERPOSITION_CREATE: 50,
  ENTROPY_COMPUTE: 30,
  COHERENCE_MEASURE: 30,
  ENERGY_COMPUTE: 20,
  STATE_TRANSFORM: 40,
  VECTOR_OP: 10,
  
  // Economic operations
  PAY: 200,
  STAKE: 250,
  REWARD: 200,
  ACCOUNT_LOOKUP: 10,
  BALANCE_CHECK: 15,
  TRANSFER_RECORD: 50,
  
  // Array/Object operations
  ARRAY_CREATE: 5,
  ARRAY_ACCESS: 2,
  MEMBER_ACCESS: 2,
  
  // I/O
  LOG: 10,
  STORE_RESULT: 15,
} as const;

export type GasOperation = keyof typeof GAS_COSTS;

/**
 * Custom error for gas exhaustion
 */
export class GasExhaustedError extends Error {
  constructor(
    message: string,
    public readonly gasUsed: number,
    public readonly gasLimit: number
  ) {
    super(message);
    this.name = 'GasExhaustedError';
  }
}

/**
 * Gas meter for tracking and limiting gas consumption
 */
export class GasMeter {
  private gasUsed: number = 0;
  private gasLimit: number;
  private operations: Map<GasOperation, number> = new Map();
  private enabled: boolean;

  constructor(gasLimit: number = Infinity, enabled: boolean = true) {
    this.gasLimit = gasLimit;
    this.enabled = enabled;
  }

  /**
   * Consume gas for an operation
   * @throws GasExhaustedError if gas limit is exceeded
   */
  consume(operation: GasOperation, multiplier: number = 1): void {
    if (!this.enabled) return;
    
    const cost = GAS_COSTS[operation] * multiplier;
    this.gasUsed += cost;
    
    // Track operation counts
    const count = this.operations.get(operation) || 0;
    this.operations.set(operation, count + 1);
    
    if (this.gasUsed > this.gasLimit) {
      throw new GasExhaustedError(
        `Gas limit exceeded: used ${this.gasUsed}, limit ${this.gasLimit}`,
        this.gasUsed,
        this.gasLimit
      );
    }
  }

  /** Get total gas used */
  getGasUsed(): number {
    return this.gasUsed;
  }

  /** Get remaining gas */
  getGasRemaining(): number {
    return Math.max(0, this.gasLimit - this.gasUsed);
  }

  /** Get gas limit */
  getGasLimit(): number {
    return this.gasLimit;
  }

  /** Get breakdown of gas by operation */
  getOperationBreakdown(): Record<GasOperation, { count: number; totalCost: number }> {
    const breakdown: Record<string, { count: number; totalCost: number }> = {};
    
    for (const [op, count] of this.operations) {
      breakdown[op] = {
        count,
        totalCost: count * GAS_COSTS[op],
      };
    }
    
    return breakdown as Record<GasOperation, { count: number; totalCost: number }>;
  }

  /** Reset the gas meter */
  reset(): void {
    this.gasUsed = 0;
    this.operations.clear();
  }

  /** Check if gas metering is enabled */
  isEnabled(): boolean {
    return this.enabled;
  }
}
