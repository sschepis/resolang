/* eslint-disable @typescript-eslint/no-explicit-any */
// ResoLang Types - Domain-specific language for resonance programming

export type TokenType =
  // Keywords
  | 'PROGRAM' | 'CONFIG' | 'STATE' | 'FUNCTION' | 'EXECUTE'
  | 'IF' | 'ELSE' | 'FOR' | 'WHILE' | 'IN' | 'RETURN' | 'BREAK'
  | 'TRY' | 'CATCH' | 'FINALLY' | 'USING' | 'DEFER'
  | 'DISTRIBUTE' | 'ON' | 'WHERE' | 'SYNC' | 'ACROSS' | 'WITH'
  | 'TOPOLOGY' | 'CONSENSUS' | 'PAY' | 'STAKE' | 'REWARD'
  | 'VAR'
  // Types
  | 'INT' | 'FLOAT' | 'COMPLEX' | 'BOOLEAN' | 'STRING'
  | 'QUATERNION' | 'PRIMES' | 'RESONANCE' | 'SUPERPOSITION'
  | 'REAL' | 'IMAG' | 'MAGNITUDE' | 'PHASE'
  // Built-in functions
  | 'GET_PRIMES' | 'COMPUTE_RESONANCE' | 'FACTORIZE' | 'IS_PRIME'
  | 'COMPUTE_ENTROPY' | 'MEASURE_COHERENCE' | 'COMPUTE_ENERGY'
  | 'CREATE_SUPERPOSITION' | 'APPLY_GATE' | 'MEASURE' | 'COLLAPSE'
  | 'EVOLVE_PHASE' | 'UPDATE_PHASE' | 'ADJUST_PHASE'
  | 'LOG' | 'STORE_RESULT' | 'AGGREGATE_RESULTS'
  | 'VECTOR_ADD' | 'SCALE' | 'DISTANCE' | 'NORMALIZE_TANH' | 'GET_EIGENVECTOR' | 'COPY'
  // Operators
  | 'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE' | 'MODULO' | 'POWER'
  | 'EQ' | 'NEQ' | 'LT' | 'GT' | 'LTE' | 'GTE'
  | 'AND' | 'OR' | 'NOT'
  | 'ASSIGN' | 'ARROW'
  // Delimiters
  | 'LPAREN' | 'RPAREN' | 'LBRACE' | 'RBRACE' | 'LBRACKET' | 'RBRACKET'
  | 'COMMA' | 'COLON' | 'SEMICOLON' | 'DOT'
  // Literals
  | 'NUMBER' | 'STRING_LITERAL' | 'BOOLEAN_LITERAL' | 'COMPLEX_LITERAL'
  | 'IDENTIFIER'
  // Special
  | 'COMMENT' | 'NEWLINE' | 'EOF' | 'ERROR';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export interface Position {
  line: number;
  column: number;
}

// AST Node Types
export type ASTNodeType =
  | 'Program'
  | 'Config'
  | 'StateDeclaration'
  | 'FunctionDeclaration'
  | 'VariableDeclaration'
  | 'Assignment'
  | 'BinaryExpression'
  | 'UnaryExpression'
  | 'CallExpression'
  | 'MemberExpression'
  | 'Identifier'
  | 'Literal'
  | 'ArrayExpression'
  | 'ObjectExpression'
  | 'Property'
  | 'IfStatement'
  | 'ForStatement'
  | 'WhileStatement'
  | 'ReturnStatement'
  | 'BreakStatement'
  | 'TryStatement'
  | 'BlockStatement'
  | 'ExecuteBlock'
  | 'DistributeStatement'
  | 'SyncStatement'
  | 'LogStatement';

export interface ASTNode {
  type: ASTNodeType;
  position: Position;
  [key: string]: any;
}

export interface ProgramNode extends ASTNode {
  type: 'Program';
  name: string;
  config?: ConfigNode;
  body: ASTNode[];
}

export interface ConfigNode extends ASTNode {
  type: 'Config';
  properties: { key: string; value: any }[];
}

export interface FunctionDeclarationNode extends ASTNode {
  type: 'FunctionDeclaration';
  name: string;
  params: { name: string; paramType?: string }[];
  returnType?: string;
  body: ASTNode[];
}

export interface VariableDeclarationNode extends ASTNode {
  type: 'VariableDeclaration';
  varType?: string;
  name: string;
  value: ASTNode;
}

// Runtime Types
export interface Complex {
  real: number;
  imag: number;
}

export interface Quaternion {
  position: [number, number, number];
  amplitude: Complex;
  gaussian: [number, number];
  eisenstein: [number, number];
}

export interface ResonanceValue {
  strength: number;
  primes: [number, number];
  phase: number;
}

// =============================================================================
// PRIME-RESONANCE ECONOMY TYPES
// =============================================================================

/**
 * Semantic primes - fundamental concepts mapped to prime numbers
 * Based on holographic memory semantic encoding
 */
export const SEMANTIC_PRIMES = {
  existence: 2,      // The most fundamental - duality, being/non-being
  duality: 2,
  structure: 3,      // Organization, form, space
  space: 3,
  change: 5,         // Transformation, time, evolution
  time: 5,
  identity: 7,       // Self, uniqueness, individuality
  self: 7,
  entropy: 13,       // Chaos, disorder, information
  chaos: 13,
  order: 26,         // 2 × 13 - structure applied to chaos
  harmony: 6,        // 2 × 3 - existence with structure
  growth: 15,        // 3 × 5 - structure over time
  evolution: 35,     // 5 × 7 - change with identity
  consciousness: 91, // 7 × 13 - identity aware of entropy
  value: 11,         // Prime for economic value
  trust: 17,         // Prime for trust relationships
  agreement: 19,     // Prime for contractual agreements
} as const;

/**
 * PrimeValue - Value represented as product of prime factors
 *
 * Example: { 2: 3, 5: 1, 7: 2 } = 2³ × 5¹ × 7² = 1960 units
 *
 * Properties:
 * - Unique factorization guarantees unique representation
 * - Divisibility is semantic (can only split by factors)
 * - Values with shared primes have natural "resonance"
 * - All operations are integer-based (no floating point)
 */
export interface PrimeValue {
  /** Prime factors and their powers: prime → exponent */
  factors: Map<number, number>;
  
  /** Computed numeric value (product of prime powers) */
  readonly value: bigint;
  
  /** Semantic meanings derived from factor primes */
  semantics: string[];
  
  /** Resonance signature for verification */
  signature: number;
  
  /** Creation timestamp */
  createdAt: number;
}

/** Transfer types in the economy */
export type TransferType = 'PAY' | 'STAKE' | 'REWARD' | 'UNSTAKE' | 'BURN' | 'MINT';

/**
 * Transfer - Represents value movement between accounts
 */
export interface Transfer {
  /** Unique transfer ID */
  id: string;
  
  /** Sender fingerprint (or 'SYSTEM' for mints) */
  from: string;
  
  /** Recipient fingerprint (or 'BURN' for burns) */
  to: string;
  
  /** Amount transferred */
  amount: PrimeValue;
  
  /** Type of transfer */
  transferType: TransferType;
  
  /** Reference to triggering contract (if any) */
  contractId?: string;
  
  /** Reference to triggering method */
  method?: string;
  
  /** Timestamp */
  timestamp: number;
  
  /** Signature of the sender */
  signature?: string;
}

/**
 * StakeRecord - Locked value in a contract
 */
export interface StakeRecord {
  /** Staked amount */
  amount: PrimeValue;
  
  /** Contract holding the stake */
  contractId: string;
  
  /** When stake was created */
  stakedAt: number;
  
  /** Optional: minimum lock period end */
  lockedUntil?: number;
  
  /** Staker's coherence at stake time (affects rewards) */
  coherenceAtStake: number;
  
  /** Accumulated rewards (not yet withdrawn) */
  accumulatedRewards: PrimeValue;
}

/**
 * ResonanceAccount - Account in the prime-resonance economy
 */
export interface ResonanceAccount {
  /** Account ID (KeyTriplet fingerprint) */
  id: string;
  
  /** Reference to KeyTriplet */
  keyTripletId: string;
  
  /** Public fingerprint for display */
  fingerprint: string;
  
  /** Primes from KeyTriplet (for resonance calculations) */
  primes: [number, number, number];
  
  /** Balance by token type (primeKey → PrimeValue) */
  balances: Map<bigint, PrimeValue>;
  
  /** Main balance (native token) */
  primaryBalance: PrimeValue;
  
  /** Stakes in various contracts */
  stakes: Map<string, StakeRecord>;
  
  /** Transaction nonce for replay protection */
  nonce: bigint;
  
  /** Current coherence score (affects priority and rewards) */
  coherence: number;
  
  /** Number of entanglements in mesh */
  entanglementCount: number;
  
  /** Account creation time */
  createdAt: number;
  
  /** Last activity time */
  lastActiveAt: number;
}

/**
 * ResonanceTransaction - Transaction in the economy
 */
export interface ResonanceTransaction {
  /** Transaction ID (hash of contents) */
  txId: string;
  
  /** Sender fingerprint */
  from: string;
  
  /** Sender's primes (for resonance routing) */
  fromPrimes: [number, number, number];
  
  /** Sender's nonce */
  nonce: bigint;
  
  /** Recipient (fingerprint or contract ID) */
  to: string;
  
  /** Value being transferred */
  value: PrimeValue;
  
  /** Transaction type */
  txType: 'TRANSFER' | 'DEPLOY' | 'CALL' | 'STAKE' | 'UNSTAKE';
  
  /** For contract calls: method name */
  method?: string;
  
  /** For contract calls: arguments */
  args?: ResoLangValue[];
  
  /** Gas limit for computation */
  gasLimit: number;
  
  /** Gas price (prime used - smaller primes = higher priority) */
  gasPrime: number;
  
  /** Signature (PrimeSignature serialized) */
  signature: string;
  
  /** Sender's coherence at signing time */
  coherenceAtSign: number;
  
  /** Entangled nodes that witnessed (for faster propagation) */
  witnesses?: string[];
  
  /** Creation timestamp */
  timestamp: number;
  
  /** Optional: transaction invalid after this time */
  deadline?: number;
  
  /** Transaction status */
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  
  /** Error message if failed */
  error?: string;
  
  /** Block/round in which confirmed */
  confirmedIn?: string;
}

/**
 * ContractState - State of a deployed contract
 */
export interface ContractState {
  /** Contract ID */
  id: string;
  
  /** Hash of contract code */
  codeHash: string;
  
  /** Deployer's fingerprint */
  deployer: string;
  
  /** Contract state stored in holographic memory */
  stateRoot: bigint;
  
  /** Contract's balance */
  balance: PrimeValue;
  
  /** Total value staked in contract */
  totalStaked: PrimeValue;
  
  /** Number of unique stakers */
  stakerCount: number;
  
  /** Contract creation time */
  createdAt: number;
  
  /** Last execution time */
  lastExecutedAt: number;
  
  /** Total calls */
  callCount: number;
}

/**
 * EconomyStats - Global economy statistics
 */
export interface EconomyStats {
  /** Total value in circulation */
  totalSupply: PrimeValue;
  
  /** Total value staked */
  totalStaked: PrimeValue;
  
  /** Number of active accounts */
  activeAccounts: number;
  
  /** Number of deployed contracts */
  deployedContracts: number;
  
  /** Transactions in last epoch */
  txLastEpoch: number;
  
  /** Average coherence of participants */
  averageCoherence: number;
  
  /** Current epoch number */
  currentEpoch: number;
}

export type ResoLangValue =
  | number
  | string
  | boolean
  | Complex
  | Quaternion
  | ResonanceValue
  | PrimeValue
  | number[]
  | ResoLangValue[]
  | { [key: string]: ResoLangValue }
  | null;

export interface ExecutionContext {
  variables: Map<string, ResoLangValue>;
  functions: Map<string, FunctionDeclarationNode>;
  config: { [key: string]: ResoLangValue };
  output: string[];
  results: Map<string, ResoLangValue[]>;
  primes: number[];
}

export interface ExecutionResult {
  success: boolean;
  output: string[];
  results: { [key: string]: ResoLangValue[] };
  error?: string;
  executionTime: number;
  stats: {
    resonanceCalculations: number;
    primeOperations: number;
    stateTransforms: number;
    economicOperations?: number;
  };
  /** Gas used during execution */
  gasUsed?: number;
  /** Gas limit for execution */
  gasLimit?: number;
  /** Whether execution stopped due to gas exhaustion */
  gasExhausted?: boolean;
  /** Transfers executed during this run */
  transfers?: Transfer[];
}

export interface ValidationError {
  message: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
