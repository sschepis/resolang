// ResoLang Contract Service
// Handles contract deployment, storage, execution, and consensus

import { tokenize } from './lexer.js';
import { execute, validate, ResoLangInterpreter } from './interpreter.js';
import {
  Token,
  TokenType,
  PrimeValue,
  ResoLangValue,
  ContractState,
  Transfer,
  ExecutionResult,
  ValidationResult,
} from './types.js';
import {
  zeroPrimeValue,
} from './economy.js';

// =============================================================================
// CONTRACT TYPES
// =============================================================================

export interface ContractMethod {
  name: string;
  params: { name: string; paramType?: string }[];
  returnType?: string;
  isSync: boolean;      // Requires consensus
  isConsensus: boolean; // Requires CONSENSUS block
  body: string;         // Source code of the method body
  startLine: number;
  endLine: number;
}

export interface ContractDefinition {
  name: string;
  config: Record<string, ResoLangValue>;
  stateVariables: { name: string; varType: string; initialValue: ResoLangValue }[];
  methods: ContractMethod[];
  sourceCode: string;
  codeHash: string;
}

export interface DeployedContract {
  id: string;
  address: string;           // Hash-based address
  definition: ContractDefinition;
  state: Map<string, ResoLangValue>;
  stateRoot: bigint;
  balance: PrimeValue;
  deployer: string;          // Deployer fingerprint
  deployerSignature: string;
  createdAt: number;
  lastExecutedAt?: number;
  callCount: number;
  totalGasUsed: number;
  version: number;
  status: 'active' | 'paused' | 'deprecated';
}

export interface ContractCallResult {
  success: boolean;
  returnValue?: ResoLangValue;
  gasUsed: number;
  transfers: Transfer[];
  stateChanges: { key: string; oldValue: ResoLangValue; newValue: ResoLangValue }[];
  logs: string[];
  error?: string;
  executionTime: number;
}

export interface ConsensusRequest {
  contractId: string;
  method: string;
  args: ResoLangValue[];
  caller: string;
  proposedStateRoot: bigint;
  proposedTransfers: Transfer[];
  timestamp: number;
}

// =============================================================================
// CONTRACT PARSER
// =============================================================================

/**
 * Parse a ResoLang source file to extract contract definition
 */
export function parseContract(source: string): ContractDefinition | { error: string } {
  // First validate the source
  const validation = validate(source);
  if (!validation.valid) {
    return { error: validation.errors.map(e => e.message).join('; ') };
  }

  const tokens = tokenize(source);
  let current = 0;

  // Helper functions
  const isAtEnd = () => tokens[current]?.type === 'EOF';
  const peek = () => tokens[current];
  const advance = () => tokens[current++];
  const check = (type: TokenType) => !isAtEnd() && peek().type === type;
  const match = (type: TokenType) => {
    if (check(type)) { advance(); return true; }
    return false;
  };

  // Find PROGRAM
  while (!isAtEnd() && !check('PROGRAM')) advance();
  if (!match('PROGRAM')) {
    return { error: 'No PROGRAM block found' };
  }

  // Get program name
  if (!check('IDENTIFIER')) {
    return { error: 'Expected program name after PROGRAM' };
  }
  const name = advance().value;

  // Parse the program body
  const config: Record<string, ResoLangValue> = {};
  const stateVariables: ContractDefinition['stateVariables'] = [];
  const methods: ContractMethod[] = [];

  // Skip to opening brace
  while (!isAtEnd() && !check('LBRACE')) advance();
  if (!match('LBRACE')) {
    return { error: 'Expected { after program name' };
  }

  let braceDepth = 1;

  while (braceDepth > 0 && !isAtEnd()) {
    const token = peek();

    switch (token.type) {
      case 'CONFIG':
        advance();
        if (match('LBRACE')) {
          // Parse config block
          while (!check('RBRACE') && !isAtEnd()) {
            if (check('IDENTIFIER')) {
              const key = advance().value;
              if (match('COLON')) {
                const value = parseValue();
                config[key] = value;
              }
            }
            if (check('COMMA')) advance();
          }
          match('RBRACE');
        }
        break;

      case 'STATE':
        advance();
        if (match('LBRACE')) {
          // Parse state block
          while (!check('RBRACE') && !isAtEnd()) {
            if (isTypeKeyword(peek().type)) {
              const varType = advance().value;
              if (check('IDENTIFIER')) {
                const varName = advance().value;
                if (match('ASSIGN')) {
                  const initialValue = parseValue();
                  stateVariables.push({ name: varName, varType, initialValue });
                }
              }
            } else {
              advance();
            }
          }
          match('RBRACE');
        }
        break;

      case 'FUNCTION': {
        const method = parseMethod();
        if (method) methods.push(method);
        break;
      }

      case 'LBRACE':
        advance();
        braceDepth++;
        break;

      case 'RBRACE':
        advance();
        braceDepth--;
        break;

      default:
        advance();
    }
  }

  // Compute code hash
  const codeHash = computeCodeHash(source);

  return {
    name,
    config,
    stateVariables,
    methods,
    sourceCode: source,
    codeHash,
  };

  // Helper: check if token is a type keyword
  function isTypeKeyword(type: TokenType): boolean {
    return ['INT', 'FLOAT', 'COMPLEX', 'BOOLEAN', 'STRING', 'QUATERNION', 'PRIMES', 'RESONANCE', 'SUPERPOSITION'].includes(type);
  }

  // Helper: parse a value (simplified)
  function parseValue(): ResoLangValue {
    const token = peek();
    
    if (token.type === 'NUMBER') {
      advance();
      return parseFloat(token.value);
    }
    if (token.type === 'STRING_LITERAL') {
      advance();
      return token.value;
    }
    if (token.type === 'BOOLEAN_LITERAL') {
      advance();
      return token.value === 'true';
    }
    if (token.type === 'LBRACKET') {
      // Array
      advance();
      const items: ResoLangValue[] = [];
      while (!check('RBRACKET') && !isAtEnd()) {
        items.push(parseValue());
        if (check('COMMA')) advance();
      }
      match('RBRACKET');
      return items;
    }
    if (token.type === 'LBRACE') {
      // Object/Map
      advance();
      const obj: Record<string, ResoLangValue> = {};
      while (!check('RBRACE') && !isAtEnd()) {
        if (check('IDENTIFIER') || check('STRING_LITERAL')) {
          const key = advance().value;
          if (match('COLON')) {
            obj[key] = parseValue();
          }
        }
        if (check('COMMA')) advance();
      }
      match('RBRACE');
      return obj;
    }
    if (check('IDENTIFIER')) {
      advance();
      return token.value;
    }
    
    advance();
    return null;
  }

  // Helper: parse a method
  function parseMethod(): ContractMethod | null {
    const startLine = peek().line;
    advance(); // FUNCTION
    
    if (!check('IDENTIFIER')) return null;
    const methodName = advance().value;

    // Parse parameters
    const params: { name: string; paramType?: string }[] = [];
    if (match('LPAREN')) {
      while (!check('RPAREN') && !isAtEnd()) {
        if (check('IDENTIFIER')) {
          const paramName = advance().value;
          let paramType: string | undefined;
          if (match('COLON') && check('IDENTIFIER')) {
            paramType = advance().value;
          }
          params.push({ name: paramName, paramType });
        }
        if (check('COMMA')) advance();
      }
      match('RPAREN');
    }

    // Parse return type
    let returnType: string | undefined;
    if (match('ARROW')) {
      if (check('IDENTIFIER') || isTypeKeyword(peek().type)) {
        returnType = advance().value;
      }
    }

    // Find method body
    let isSync = false;
    let isConsensus = false;
    const bodyStart = current;
    
    // Skip to body
    while (!check('LBRACE') && !isAtEnd()) {
      advance();
    }

    if (!match('LBRACE')) return null;

    // Check for SYNC or CONSENSUS wrapper
    if (check('SYNC')) {
      isSync = true;
      advance();
      if (match('LBRACE')) {
        // Body is inside SYNC block
      }
    } else if (check('CONSENSUS')) {
      isConsensus = true;
      advance();
      // Skip consensus params
      if (match('LPAREN')) {
        while (!check('RPAREN') && !isAtEnd()) advance();
        match('RPAREN');
      }
      if (match('LBRACE')) {
        // Body is inside CONSENSUS block
      }
    }

    // Find end of method body
    let bodyDepth = 1;
    const bodyTokens: Token[] = [];
    while (bodyDepth > 0 && !isAtEnd()) {
      const t = peek();
      if (t.type === 'LBRACE') bodyDepth++;
      if (t.type === 'RBRACE') bodyDepth--;
      if (bodyDepth > 0) bodyTokens.push(t);
      advance();
    }

    const endLine = peek().line;

    // Reconstruct body source (simplified)
    const body = bodyTokens.map(t => t.value).join(' ');

    return {
      name: methodName,
      params,
      returnType,
      isSync,
      isConsensus,
      body,
      startLine,
      endLine,
    };
  }
}

/**
 * Compute hash of contract source code
 */
function computeCodeHash(source: string): string {
  let hash = 0n;
  for (let i = 0; i < source.length; i++) {
    hash = ((hash << 5n) - hash + BigInt(source.charCodeAt(i))) & 0xFFFFFFFFFFFFFFFFn;
  }
  return `CH-${hash.toString(36).toUpperCase()}`;
}

/**
 * Compute contract address from code hash and deployer
 */
function computeContractAddress(codeHash: string, deployer: string, nonce: bigint): string {
  const combined = `${codeHash}:${deployer}:${nonce}`;
  let hash = 0n;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5n) - hash + BigInt(combined.charCodeAt(i))) & 0xFFFFFFFFFFFFFFFFn;
  }
  return `CA-${hash.toString(36).toUpperCase().slice(0, 16)}`;
}

// =============================================================================
// CONTRACT DEPLOYMENT
// =============================================================================

export class ContractDeploymentService {
  private contracts: Map<string, DeployedContract> = new Map();
  private interpreter: ResoLangInterpreter;

  constructor() {
    this.interpreter = new ResoLangInterpreter();
  }

  /**
   * Deploy a new contract
   */
  deploy(
    source: string,
    deployer: string,
    deployerSignature: string,
    initialBalance?: PrimeValue,
    deployerNonce: bigint = 0n
  ): DeployedContract | { error: string } {
    // Parse the contract
    const parseResult = parseContract(source);
    if ('error' in parseResult) {
      return { error: `Parse error: ${parseResult.error}` };
    }

    const definition = parseResult;

    // Compute contract address
    const address = computeContractAddress(definition.codeHash, deployer, deployerNonce);

    // Check if address already exists
    if (this.contracts.has(address)) {
      return { error: `Contract already exists at address ${address}` };
    }

    // Initialize state
    const state = new Map<string, ResoLangValue>();
    for (const sv of definition.stateVariables) {
      state.set(sv.name, sv.initialValue);
    }

    // Compute initial state root
    const stateRoot = this.computeStateRoot(state);

    // Create deployed contract
    const contract: DeployedContract = {
      id: `CONTRACT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      address,
      definition,
      state,
      stateRoot,
      balance: initialBalance || zeroPrimeValue(),
      deployer,
      deployerSignature,
      createdAt: Date.now(),
      callCount: 0,
      totalGasUsed: 0,
      version: 1,
      status: 'active',
    };

    this.contracts.set(address, contract);

    return contract;
  }

  /**
   * Get a deployed contract
   */
  getContract(address: string): DeployedContract | undefined {
    return this.contracts.get(address);
  }

  /**
   * List all deployed contracts
   */
  listContracts(): DeployedContract[] {
    return Array.from(this.contracts.values());
  }

  /**
   * Call a contract method
   */
  call(
    contractAddress: string,
    method: string,
    args: ResoLangValue[],
    caller: string,
    value?: PrimeValue,
    gasLimit: number = 100000
  ): ContractCallResult {
    const startTime = performance.now();
    const contract = this.contracts.get(contractAddress);

    if (!contract) {
      return {
        success: false,
        gasUsed: 0,
        transfers: [],
        stateChanges: [],
        logs: [],
        error: `Contract not found: ${contractAddress}`,
        executionTime: 0,
      };
    }

    if (contract.status !== 'active') {
      return {
        success: false,
        gasUsed: 0,
        transfers: [],
        stateChanges: [],
        logs: [],
        error: `Contract is ${contract.status}`,
        executionTime: 0,
      };
    }

    // Find the method
    const methodDef = contract.definition.methods.find(m => m.name === method);
    if (!methodDef) {
      return {
        success: false,
        gasUsed: 0,
        transfers: [],
        stateChanges: [],
        logs: [],
        error: `Method not found: ${method}`,
        executionTime: 0,
      };
    }

    // Build execution context
    const callSource = this.buildCallSource(contract, methodDef, args, value);

    // Set up interpreter with economy context
    this.interpreter.setEconomyContext(caller, contractAddress);

    // Execute with gas limit
    const result = this.interpreter.execute(callSource, { gasLimit });

    // Get transfers from result or interpreter
    const transfers = result.transfers || this.interpreter.getTransfers();

    // Get gas used from the interpreter's gas meter
    const gasUsed = result.gasUsed ?? 0;

    // Collect state changes
    const stateChanges: ContractCallResult['stateChanges'] = [];
    
    // Update contract state from execution results
    for (const [key, values] of Object.entries(result.results)) {
      const oldValue = contract.state.get(key);
      const newValue = values[values.length - 1]; // Take last value
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        stateChanges.push({ key, oldValue: oldValue ?? null, newValue });
        contract.state.set(key, newValue);
      }
    }

    // Update contract metadata
    contract.callCount++;
    contract.totalGasUsed += gasUsed;
    contract.lastExecutedAt = Date.now();
    contract.stateRoot = this.computeStateRoot(contract.state);

    // If value was sent, add to contract balance
    if (value) {
      contract.balance = {
        ...contract.balance,
        factors: new Map([...contract.balance.factors, ...value.factors]),
      };
    }

    return {
      success: result.success,
      returnValue: result.results['return']?.[0],
      gasUsed,
      transfers,
      stateChanges,
      logs: result.output,
      error: result.error,
      executionTime: performance.now() - startTime,
    };
  }

  /**
   * Build ResoLang source for a method call
   */
  private buildCallSource(
    contract: DeployedContract,
    method: ContractMethod,
    args: ResoLangValue[],
    value?: PrimeValue
  ): string {
    const lines: string[] = [];

    // Set up state variables
    lines.push(`PROGRAM ${contract.definition.name}_call {`);
    
    // Config
    lines.push('  CONFIG {');
    for (const [key, val] of Object.entries(contract.definition.config)) {
      lines.push(`    ${key}: ${JSON.stringify(val)},`);
    }
    lines.push('  }');
    
    // State (current values)
    lines.push('  STATE {');
    for (const sv of contract.definition.stateVariables) {
      const currentValue = contract.state.get(sv.name) ?? sv.initialValue;
      lines.push(`    ${sv.varType} ${sv.name} = ${this.valueToSource(currentValue)}`);
    }
    lines.push('  }');

    // Execute block that calls the method
    lines.push('  EXECUTE {');
    
    // Set up arguments as variables
    method.params.forEach((param, i) => {
      const argValue = args[i] ?? null;
      lines.push(`    ${param.paramType || 'INT'} ${param.name} = ${this.valueToSource(argValue)}`);
    });

    // If value was sent
    if (value) {
      lines.push(`    PRIMES _value = ${this.valueToSource(Array.from(value.factors.keys()))}`);
    }

    // Method body
    lines.push(`    // Method: ${method.name}`);
    lines.push(`    ${method.body}`);

    // Store return value if any
    if (method.returnType) {
      lines.push('    STORE_RESULT("return", result)');
    }

    // Store updated state
    for (const sv of contract.definition.stateVariables) {
      lines.push(`    STORE_RESULT("${sv.name}", ${sv.name})`);
    }

    lines.push('  }');
    lines.push('}');

    return lines.join('\n');
  }

  /**
   * Convert a value to ResoLang source
   */
  private valueToSource(value: ResoLangValue): string {
    if (value === null) return 'null';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean') return value.toString();
    if (Array.isArray(value)) {
      return `[${value.map(v => this.valueToSource(v)).join(', ')}]`;
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${this.valueToSource(v as ResoLangValue)}`);
      return `{ ${entries.join(', ')} }`;
    }
    return String(value);
  }

  /**
   * Compute state root (prime product of all state hashes)
   */
  private computeStateRoot(state: Map<string, ResoLangValue>): bigint {
    let root = 1n;
    const primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];
    let primeIndex = 0;

    for (const [key, value] of state) {
      const valueHash = this.hashValue(value);
      const prime = primes[primeIndex % primes.length];
      root *= prime ** (valueHash % 10n + 1n);
      primeIndex++;
    }

    return root;
  }

  /**
   * Hash a value to a bigint
   */
  private hashValue(value: ResoLangValue): bigint {
    const str = JSON.stringify(value);
    let hash = 0n;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5n) - hash + BigInt(str.charCodeAt(i))) & 0xFFFFFFFFn;
    }
    return hash;
  }

  /**
   * Pause a contract
   */
  pause(contractAddress: string, caller: string): boolean {
    const contract = this.contracts.get(contractAddress);
    if (!contract) return false;
    if (contract.deployer !== caller) return false;
    contract.status = 'paused';
    return true;
  }

  /**
   * Resume a paused contract
   */
  resume(contractAddress: string, caller: string): boolean {
    const contract = this.contracts.get(contractAddress);
    if (!contract) return false;
    if (contract.deployer !== caller) return false;
    if (contract.status !== 'paused') return false;
    contract.status = 'active';
    return true;
  }

  /**
   * Get contract statistics
   */
  getStats(): {
    totalContracts: number;
    activeContracts: number;
    totalCalls: number;
    totalGasUsed: number;
  } {
    const contracts = Array.from(this.contracts.values());
    return {
      totalContracts: contracts.length,
      activeContracts: contracts.filter(c => c.status === 'active').length,
      totalCalls: contracts.reduce((sum, c) => sum + c.callCount, 0),
      totalGasUsed: contracts.reduce((sum, c) => sum + c.totalGasUsed, 0),
    };
  }
}

// Export singleton
export const contractService = new ContractDeploymentService();
