/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ResoLang Interpreter - Executes ResoLang programs

import { tokenize } from './lexer.js';
import {
  Token,
  TokenType,
  ExecutionContext,
  ExecutionResult,
  ResoLangValue,
  Quaternion,
  ResonanceValue,
  PrimeValue,
  Transfer,
  ResonanceAccount,
  ValidationResult,
} from './types.js';
import {
  isPrime,
  generatePrimes,
  factorizeToArray as factorize
} from './prime-math.js';
import {
  createPrimeValue,
  createPrimeValueFromPrimes,
  addPrimeValues,
  subtractPrimeValues,
  multiplyPrimeValues,
  gte,
  formatPrimeValue,
  createTransfer,
  zeroPrimeValue,
} from './economy.js';

// Import extracted modules
import {
  createComplex,
  complexMagnitude,
  complexPhase,
  createQuaternion,
  computeResonance,
  computeResonanceVector,
  computeEntropy,
  measureCoherence,
  computeEnergy,
} from './math.js';
import { GasMeter, GasExhaustedError, GAS_COSTS, type GasOperation } from './gas.js';

// Re-export for backward compatibility
export { GasMeter, GasExhaustedError, GAS_COSTS, type GasOperation } from './gas.js';
export { validate } from './validator.js';

// Economy context for tracking accounts and transfers during execution
interface EconomyContext {
  accounts: Map<string, ResonanceAccount>;
  transfers: Transfer[];
  pendingStakes: Map<string, PrimeValue>;
  pendingRewards: Map<string, PrimeValue>;
  currentCaller: string | null;
  currentContract: string | null;
}

// Scope for variable resolution - forms a chain for lexical scoping
interface Scope {
  variables: Map<string, ResoLangValue>;
  parent: Scope | null;
}

// Simple parser that handles basic ResoLang constructs
class ResoLangInterpreter {
  private tokens: Token[] = [];
  private current = 0;
  private context: ExecutionContext;
  private economy: EconomyContext;
  private gasMeter: GasMeter;
  private scopeStack: Scope[] = [];
  private stats = {
    resonanceCalculations: 0,
    primeOperations: 0,
    stateTransforms: 0,
    economicOperations: 0,
  };

  constructor(gasLimit?: number) {
    this.context = this.createContext();
    this.economy = this.createEconomyContext();
    this.gasMeter = new GasMeter(gasLimit ?? Infinity, gasLimit !== undefined);
    this.initializeScopeStack();
  }

  // ==========================================================================
  // SCOPE MANAGEMENT
  // ==========================================================================

  /**
   * Initialize the scope stack with a global scope
   */
  private initializeScopeStack(): void {
    this.scopeStack = [{
      variables: this.context.variables,
      parent: null,
    }];
  }

  /**
   * Get the current (innermost) scope
   */
  private currentScope(): Scope {
    return this.scopeStack[this.scopeStack.length - 1];
  }

  /**
   * Push a new scope onto the stack (for function calls, blocks, etc.)
   */
  private pushScope(): void {
    const newScope: Scope = {
      variables: new Map(),
      parent: this.currentScope(),
    };
    this.scopeStack.push(newScope);
  }

  /**
   * Pop the current scope from the stack
   */
  private popScope(): void {
    if (this.scopeStack.length > 1) {
      this.scopeStack.pop();
    }
  }

  /**
   * Resolve a variable by walking up the scope chain
   * Returns the value if found, null if not found
   */
  private resolveVariable(name: string): ResoLangValue {
    let scope: Scope | null = this.currentScope();
    while (scope !== null) {
      if (scope.variables.has(name)) {
        return scope.variables.get(name)!;
      }
      scope = scope.parent;
    }
    return null;
  }

  /**
   * Check if a variable exists in any scope
   */
  private hasVariable(name: string): boolean {
    let scope: Scope | null = this.currentScope();
    while (scope !== null) {
      if (scope.variables.has(name)) {
        return true;
      }
      scope = scope.parent;
    }
    return false;
  }

  /**
   * Set a variable value
   * @param name - Variable name
   * @param value - Value to set
   * @param forceLocal - If true, always create in current scope (for VAR declarations)
   *                     If false, update existing variable or create in current scope
   */
  private setVariable(name: string, value: ResoLangValue, forceLocal: boolean = false): void {
    if (forceLocal) {
      // Always create in current scope
      this.currentScope().variables.set(name, value);
      // Also update context.variables for compatibility
      if (this.scopeStack.length === 1) {
        this.context.variables.set(name, value);
      }
      return;
    }

    // Try to find existing variable in scope chain and update it
    let scope: Scope | null = this.currentScope();
    while (scope !== null) {
      if (scope.variables.has(name)) {
        scope.variables.set(name, value);
        // Also update context.variables if this is the global scope
        if (scope.parent === null) {
          this.context.variables.set(name, value);
        }
        return;
      }
      scope = scope.parent;
    }

    // Variable doesn't exist anywhere, create in current scope
    this.currentScope().variables.set(name, value);
    // Also update context.variables for compatibility if we're at global scope
    if (this.scopeStack.length === 1) {
      this.context.variables.set(name, value);
    }
  }

  /**
   * Get the scope where a variable is defined (for debugging/introspection)
   */
  private getVariableScope(name: string): Scope | null {
    let scope: Scope | null = this.currentScope();
    while (scope !== null) {
      if (scope.variables.has(name)) {
        return scope;
      }
      scope = scope.parent;
    }
    return null;
  }

  /**
   * Set gas limit for execution
   */
  setGasLimit(limit: number): void {
    this.gasMeter = new GasMeter(limit, true);
  }

  /**
   * Get gas meter for inspection
   */
  getGasMeter(): GasMeter {
    return this.gasMeter;
  }

  private createContext(): ExecutionContext {
    return {
      variables: new Map(),
      functions: new Map(),
      config: {},
      output: [],
      results: new Map(),
      primes: generatePrimes(1000),
    };
  }

  private createEconomyContext(): EconomyContext {
    return {
      accounts: new Map(),
      transfers: [],
      pendingStakes: new Map(),
      pendingRewards: new Map(),
      currentCaller: null,
      currentContract: null,
    };
  }

  /**
   * Set execution context for contract calls
   */
  setEconomyContext(caller: string, contract?: string) {
    this.economy.currentCaller = caller;
    this.economy.currentContract = contract || null;
  }

  /**
   * Register an account for use in execution
   */
  registerAccount(account: ResonanceAccount) {
    this.economy.accounts.set(account.fingerprint, account);
  }

  /**
   * Get all transfers from last execution
   */
  getTransfers(): Transfer[] {
    return [...this.economy.transfers];
  }

  /**
   * Get pending stakes from last execution
   */
  getPendingStakes(): Map<string, PrimeValue> {
    return new Map(this.economy.pendingStakes);
  }

  /**
   * Get pending rewards from last execution
   */
  getPendingRewards(): Map<string, PrimeValue> {
    return new Map(this.economy.pendingRewards);
  }

  execute(source: string, options?: { gasLimit?: number }): ExecutionResult {
    const startTime = performance.now();
    this.tokens = tokenize(source);
    this.current = 0;
    this.context = this.createContext();
    // Reset scope stack with fresh global scope
    this.initializeScopeStack();
    // Reset user-defined functions for fresh execution
    this.userFunctions = new Map();
    // Reset economy context but preserve registered accounts
    const preservedAccounts = this.economy.accounts;
    this.economy = this.createEconomyContext();
    this.economy.accounts = preservedAccounts;
    this.stats = { resonanceCalculations: 0, primeOperations: 0, stateTransforms: 0, economicOperations: 0 };
    
    // Reset or create gas meter
    if (options?.gasLimit !== undefined) {
      this.gasMeter = new GasMeter(options.gasLimit, true);
    } else {
      this.gasMeter.reset();
    }

    try {
      this.parseAndExecute();
      
      const resultObj: { [key: string]: ResoLangValue[] } = {};
      this.context.results.forEach((v, k) => {
        resultObj[k] = v;
      });

      return {
        success: true,
        output: this.context.output,
        results: resultObj,
        executionTime: performance.now() - startTime,
        stats: this.stats,
        gasUsed: this.gasMeter.getGasUsed(),
        gasLimit: this.gasMeter.getGasLimit(),
        // Include economy results
        transfers: this.economy.transfers,
      } as ExecutionResult & { transfers: Transfer[]; gasUsed: number; gasLimit: number };
    } catch (error) {
      const isGasError = error instanceof GasExhaustedError;
      return {
        success: false,
        output: this.context.output,
        results: {},
        error: error instanceof Error ? error.message : String(error),
        executionTime: performance.now() - startTime,
        stats: this.stats,
        gasUsed: this.gasMeter.getGasUsed(),
        gasLimit: this.gasMeter.getGasLimit(),
        gasExhausted: isGasError,
      };
    }
  }

  private parseAndExecute(): void {
    while (!this.isAtEnd()) {
      this.executeStatement();
    }
  }

  private executeStatement(): void {
    // Consume base gas for each statement
    this.gasMeter.consume('STATEMENT');
    
    const token = this.peek();

    switch (token.type) {
      case 'PROGRAM':
        this.executeProgram();
        break;
      case 'CONFIG':
        this.executeConfig();
        break;
      case 'STATE':
      case 'INT':
      case 'FLOAT':
      case 'COMPLEX':
      case 'BOOLEAN':
      case 'STRING':
      case 'QUATERNION':
      case 'PRIMES':
      case 'RESONANCE':
      case 'REAL':
      case 'IMAG':
      case 'SUPERPOSITION':
      case 'VAR':
        this.executeVariableDeclaration();
        break;
      case 'FUNCTION':
        this.executeFunction();
        break;
      case 'EXECUTE':
        this.executeExecuteBlock();
        break;
      case 'IF':
        this.executeIf();
        break;
      case 'FOR':
        this.executeFor();
        break;
      case 'WHILE':
        this.executeWhile();
        break;
      case 'LOG':
        this.executeLog();
        break;
      case 'STORE_RESULT':
        this.executeStoreResult();
        break;
      case 'DISTRIBUTE':
        this.executeDistribute();
        break;
      // Economic operations
      case 'PAY':
        this.executePay();
        break;
      case 'STAKE':
        this.executeStake();
        break;
      case 'REWARD':
        this.executeReward();
        break;
      case 'IDENTIFIER':
        this.executeAssignmentOrCall();
        break;
      case 'RETURN':
        this.advance();
        break;
      case 'LBRACE':
        this.executeBlock();
        break;
      case 'RBRACE':
      case 'EOF':
        this.advance();
        break;
      default:
        this.advance();
    }
  }

  private executeProgram(): void {
    this.advance(); // PROGRAM
    const name = this.consume('IDENTIFIER', 'Expected program name').value;
    this.context.output.push(`[PROGRAM] Starting: ${name}`);
    
    if (this.check('LBRACE')) {
      this.advance();
      while (!this.check('RBRACE') && !this.isAtEnd()) {
        this.executeStatement();
      }
      if (this.check('RBRACE')) this.advance();
    }
  }

  private executeConfig(): void {
    this.advance(); // CONFIG
    this.consume('LBRACE', 'Expected { after CONFIG');
    
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      // Accept either IDENTIFIER or NUMBER as config key
      let key: string;
      if (this.check('IDENTIFIER')) {
        key = this.advance().value;
      } else if (this.check('NUMBER')) {
        key = this.advance().value;
      } else {
        throw new Error(`Expected config key at line ${this.peek().line}, got ${this.peek().type}`);
      }
      this.consume('COLON', 'Expected : after config key');
      const value = this.parseExpression();
      this.context.config[key] = value;
      
      // Skip optional comma or newline
      if (this.check('COMMA')) this.advance();
    }
    
    this.consume('RBRACE', 'Expected } after CONFIG');
    this.context.output.push(`[CONFIG] Loaded ${Object.keys(this.context.config).length} settings`);
  }

  private executeVariableDeclaration(): void {
    this.gasMeter.consume('VARIABLE_DECLARATION');
    
    const varType = this.advance().value;
    const name = this.consume('IDENTIFIER', 'Expected variable name').value;
    this.consume('ASSIGN', 'Expected = after variable name');
    
    const value = this.parseExpression();
    // Use forceLocal=true for VAR declarations to ensure local scope
    // Other type declarations (STATE, INT, etc.) also create in current scope
    this.setVariable(name, value, true);
    
    if (varType === 'STATE' || varType === 'QUATERNION') {
      this.gasMeter.consume('STATE_TRANSFORM');
      this.stats.stateTransforms++;
    }
  }

  // Internal storage for user-defined functions (separate from context.functions)
  private userFunctions: Map<string, {
    params: string[];
    bodyStart: number;
    bodyEnd: number;
  }> = new Map();

  private executeFunction(): void {
    this.gasMeter.consume('FUNCTION_CALL');
    this.advance(); // FUNCTION
    const name = this.consume('IDENTIFIER', 'Expected function name').value;
    this.consume('LPAREN', 'Expected ( after function name');
    
    const params: string[] = [];
    while (!this.check('RPAREN') && !this.isAtEnd()) {
      const paramName = this.consume('IDENTIFIER', 'Expected parameter name').value;
      // Skip type annotation if present
      if (this.check('COLON')) {
        this.advance();
        this.advance(); // Skip type
      }
      params.push(paramName);
      if (this.check('COMMA')) this.advance();
    }
    this.consume('RPAREN', 'Expected )');

    // Skip return type if present
    if (this.check('ARROW')) {
      this.advance();
      // Skip return type tokens
      while (!this.check('LBRACE') && !this.isAtEnd()) {
        this.advance();
      }
    }

    // Store function definition with its token range
    const bodyStart = this.current;
    let braceCount = 0;
    if (this.check('LBRACE')) {
      braceCount = 1;
      this.advance();
      while (braceCount > 0 && !this.isAtEnd()) {
        if (this.check('LBRACE')) braceCount++;
        if (this.check('RBRACE')) braceCount--;
        this.advance();
      }
    }
    const bodyEnd = this.current;
    
    // Store function definition for later execution
    this.userFunctions.set(name, {
      params,
      bodyStart,
      bodyEnd,
    });
    
    this.context.output.push(`[FUNCTION] Defined: ${name}(${params.join(', ')})`);
  }

  private callUserFunction(name: string, args: ResoLangValue[]): ResoLangValue {
    const func = this.userFunctions.get(name);
    if (!func) {
      return null;
    }
    
    // Save current token position
    const savedCurrent = this.current;
    
    // Push a new scope for the function execution
    this.pushScope();
    
    // Bind arguments to parameters in the new scope (forceLocal=true)
    for (let i = 0; i < func.params.length; i++) {
      this.setVariable(func.params[i], args[i] ?? null, true);
    }
    
    // Execute function body
    this.current = func.bodyStart;
    let returnValue: ResoLangValue = null;
    
    try {
      if (this.check('LBRACE')) {
        this.advance(); // Skip opening brace
        while (!this.check('RBRACE') && !this.isAtEnd()) {
          // Check for RETURN statement
          if (this.check('RETURN')) {
            this.advance(); // Skip RETURN
            returnValue = this.parseExpression();
            break;
          }
          this.executeStatement();
        }
      }
    } finally {
      // Pop the function scope
      this.popScope();
      // Restore token position
      this.current = savedCurrent;
    }
    
    return returnValue;
  }

  private executeExecuteBlock(): void {
    this.advance(); // EXECUTE
    this.context.output.push('[EXECUTE] Starting execution block');
    
    if (this.check('LBRACE')) {
      this.executeBlock();
    }
    
    this.context.output.push('[EXECUTE] Completed');
  }

  private executeBlock(): void {
    this.gasMeter.consume('BLOCK_ENTER');
    this.consume('LBRACE', 'Expected {');
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      this.executeStatement();
    }
    this.consume('RBRACE', 'Expected }');
  }

  private executeIf(): void {
    this.gasMeter.consume('CONDITION_CHECK');
    this.advance(); // IF
    const condition = this.parseExpression();
    
    if (this.check('LBRACE')) {
      if (this.isTruthy(condition)) {
        this.executeBlock();
        // Skip else block if present
        if (this.check('ELSE')) {
          this.advance();
          this.skipBlock();
        }
      } else {
        this.skipBlock();
        if (this.check('ELSE')) {
          this.advance();
          if (this.check('LBRACE')) {
            this.executeBlock();
          }
        }
      }
    }
  }

  private executeFor(): void {
    this.gasMeter.consume('CONDITION_CHECK');
    this.advance(); // FOR
    const varName = this.consume('IDENTIFIER', 'Expected loop variable').value;
    this.consume('IN', 'Expected IN');
    
    // Parse range or collection
    let items: ResoLangValue[] = [];
    if (this.check('IDENTIFIER') && this.peek().value === 'range') {
      this.advance(); // range
      this.consume('LPAREN', 'Expected (');
      const start = this.parseExpression() as number;
      let end = start;
      let step = 1;
      
      if (this.check('COMMA')) {
        this.advance();
        end = this.parseExpression() as number;
      }
      if (this.check('COMMA')) {
        this.advance();
        step = this.parseExpression() as number;
      }
      this.consume('RPAREN', 'Expected )');
      
      // Generate range
      for (let i = typeof end !== 'undefined' && start !== end ? start : 0; i < end; i += step) {
        items.push(i);
      }
    } else {
      const collection = this.parseExpression();
      if (Array.isArray(collection)) {
        items = collection;
      }
    }

    if (this.check('LBRACE')) {
      const blockStart = this.current;
      
      for (const item of items) {
        this.gasMeter.consume('LOOP_ITERATION');
        // Set loop variable in current scope (forceLocal=true to avoid affecting outer scopes)
        this.setVariable(varName, item, true);
        this.current = blockStart;
        this.executeBlock();
      }
    }
  }

  private executeWhile(): void {
    this.gasMeter.consume('CONDITION_CHECK');
    this.advance(); // WHILE
    const conditionStart = this.current;
    
    let iterations = 0;
    const maxIterations = 10000;
    
    while (iterations < maxIterations) {
      this.gasMeter.consume('LOOP_ITERATION');
      this.current = conditionStart;
      const condition = this.parseExpression();
      
      if (!this.isTruthy(condition)) break;
      
      if (this.check('LBRACE')) {
        this.executeBlock();
      }
      iterations++;
    }
    
    if (iterations >= maxIterations) {
      this.context.output.push('[WARNING] Maximum iterations reached in WHILE loop');
    }
  }

  private executeLog(): void {
    this.gasMeter.consume('LOG');
    this.advance(); // LOG
    this.consume('LPAREN', 'Expected (');
    
    const parts: string[] = [];
    while (!this.check('RPAREN') && !this.isAtEnd()) {
      const value = this.parseExpression();
      parts.push(this.stringify(value));
      if (this.check('COMMA')) this.advance();
    }
    this.consume('RPAREN', 'Expected )');
    
    this.context.output.push(`[LOG] ${parts.join(' ')}`);
  }

  private executeStoreResult(): void {
    this.gasMeter.consume('STORE_RESULT');
    this.advance(); // STORE_RESULT
    this.consume('LPAREN', 'Expected (');
    
    const key = this.parseExpression() as string;
    this.consume('COMMA', 'Expected ,');
    const value = this.parseExpression();
    
    this.consume('RPAREN', 'Expected )');
    
    if (!this.context.results.has(key)) {
      this.context.results.set(key, []);
    }
    this.context.results.get(key)!.push(value);
  }

  private executeDistribute(): void {
    this.advance(); // DISTRIBUTE
    this.context.output.push('[DISTRIBUTE] Simulating distributed execution');
    
    // Skip distribution parameters
    while (!this.check('LBRACE') && !this.check('EXECUTE') && !this.isAtEnd()) {
      this.advance();
    }
    
    // Execute the block normally (single-threaded simulation)
    if (this.check('LBRACE')) {
      this.executeBlock();
    }
  }

  // ==========================================================================
  // ECONOMIC OPERATIONS
  // ==========================================================================

  /**
   * PAY(from, to, amount)
   * Transfer value from one account to another
   */
  private executePay(): void {
    this.gasMeter.consume('PAY');
    this.advance(); // PAY
    this.consume('LPAREN', 'Expected ( after PAY');
    
    // Parse from (can be identifier like CALLER, SELF, or a string)
    const fromExpr = this.parseExpression();
    const from = this.resolveAccountIdentifier(fromExpr);
    
    this.consume('COMMA', 'Expected , after from');
    
    // Parse to
    const toExpr = this.parseExpression();
    const to = this.resolveAccountIdentifier(toExpr);
    
    this.consume('COMMA', 'Expected , after to');
    
    // Parse amount (can be number, array of primes, or PrimeValue)
    const amountExpr = this.parseExpression();
    const amount = this.toPrimeValue(amountExpr);
    
    this.consume('RPAREN', 'Expected )');
    
    // Execute the transfer
    this.executeTransfer(from, to, amount, 'PAY');
  }

  /**
   * STAKE(staker, contract, amount)
   * Lock value in a contract
   */
  private executeStake(): void {
    this.gasMeter.consume('STAKE');
    this.advance(); // STAKE
    this.consume('LPAREN', 'Expected ( after STAKE');
    
    // Parse staker
    const stakerExpr = this.parseExpression();
    const staker = this.resolveAccountIdentifier(stakerExpr);
    
    this.consume('COMMA', 'Expected , after staker');
    
    // Parse contract (can be SELF or identifier)
    const contractExpr = this.parseExpression();
    const contract = this.resolveAccountIdentifier(contractExpr);
    
    this.consume('COMMA', 'Expected , after contract');
    
    // Parse amount
    const amountExpr = this.parseExpression();
    const amount = this.toPrimeValue(amountExpr);
    
    this.consume('RPAREN', 'Expected )');
    
    // Execute the stake
    this.executeStakeOperation(staker, contract, amount);
  }

  /**
   * REWARD(recipient, amount)
   * Distribute rewards to an account
   */
  private executeReward(): void {
    this.gasMeter.consume('REWARD');
    this.advance(); // REWARD
    this.consume('LPAREN', 'Expected ( after REWARD');
    
    // Parse recipient
    const recipientExpr = this.parseExpression();
    const recipient = this.resolveAccountIdentifier(recipientExpr);
    
    this.consume('COMMA', 'Expected , after recipient');
    
    // Parse amount
    const amountExpr = this.parseExpression();
    const amount = this.toPrimeValue(amountExpr);
    
    this.consume('RPAREN', 'Expected )');
    
    // Execute the reward
    this.executeRewardOperation(recipient, amount);
  }

  /**
   * Resolve account identifier (CALLER, SELF, string, or variable)
   */
  private resolveAccountIdentifier(expr: ResoLangValue): string {
    this.gasMeter.consume('ACCOUNT_LOOKUP');
    if (typeof expr === 'string') {
      // Check special identifiers
      if (expr === 'CALLER' || expr === 'caller') {
        if (!this.economy.currentCaller) {
          throw new Error('CALLER not set - no caller context');
        }
        return this.economy.currentCaller;
      }
      if (expr === 'SELF' || expr === 'self') {
        if (!this.economy.currentContract) {
          throw new Error('SELF not set - no contract context');
        }
        return this.economy.currentContract;
      }
      return expr;
    }
    
    // If it's a number, invalid
    if (typeof expr === 'number') {
      throw new Error('Account identifier cannot be a number');
    }
    
    // Otherwise try to stringify
    return String(expr);
  }

  /**
   * Convert expression to PrimeValue
   */
  private toPrimeValue(expr: ResoLangValue): PrimeValue {
    if (typeof expr === 'number') {
      return createPrimeValue(Math.floor(expr));
    }
    
    if (Array.isArray(expr)) {
      // Array of primes like [2, 3, 7]
      const primes = expr.filter(x => typeof x === 'number') as number[];
      return createPrimeValueFromPrimes(primes);
    }
    
    if (expr && typeof expr === 'object' && 'factors' in expr) {
      // Already a PrimeValue
      return expr as PrimeValue;
    }
    
    // Default to zero
    return zeroPrimeValue();
  }

  /**
   * Execute a value transfer
   */
  private executeTransfer(from: string, to: string, amount: PrimeValue, type: 'PAY' | 'STAKE' | 'REWARD' | 'UNSTAKE'): void {
    // Get sender account
    const sender = this.economy.accounts.get(from);
    
    // For simulation mode, we may not have real accounts
    if (sender) {
      this.gasMeter.consume('BALANCE_CHECK');
      // Check sufficient balance
      if (!gte(sender.primaryBalance, amount)) {
        throw new Error(`Insufficient balance: ${from} has ${formatPrimeValue(sender.primaryBalance)} but needs ${formatPrimeValue(amount)}`);
      }
      
      // Deduct from sender
      const newBalance = subtractPrimeValues(sender.primaryBalance, amount);
      if (!newBalance) {
        throw new Error('Transfer would result in negative balance');
      }
      sender.primaryBalance = newBalance;
    }
    
    // Get or create recipient account entry
    const recipient = this.economy.accounts.get(to);
    if (recipient) {
      // Add to recipient
      recipient.primaryBalance = addPrimeValues(recipient.primaryBalance, amount);
    }
    
    // Record the transfer
    this.gasMeter.consume('TRANSFER_RECORD');
    const transfer = createTransfer(from, to, amount, type, {
      contractId: this.economy.currentContract || undefined,
    });
    this.economy.transfers.push(transfer);
    
    // Update stats
    this.stats.economicOperations++;
    
    // Log the transfer
    this.context.output.push(`[${type}] ${from} → ${to}: ${formatPrimeValue(amount)}`);
  }

  /**
   * Execute a stake operation
   */
  private executeStakeOperation(staker: string, contract: string, amount: PrimeValue): void {
    // Record in pending stakes
    const existing = this.economy.pendingStakes.get(staker) || zeroPrimeValue();
    this.economy.pendingStakes.set(staker, addPrimeValues(existing, amount));
    
    // Execute as a transfer to the contract
    this.executeTransfer(staker, contract, amount, 'STAKE');
    
    this.context.output.push(`[STAKE] ${staker} staked ${formatPrimeValue(amount)} in ${contract}`);
  }

  /**
   * Execute a reward operation
   */
  private executeRewardOperation(recipient: string, amount: PrimeValue): void {
    // Record in pending rewards
    const existing = this.economy.pendingRewards.get(recipient) || zeroPrimeValue();
    this.economy.pendingRewards.set(recipient, addPrimeValues(existing, amount));
    
    // For rewards, source is typically the contract (minting)
    const source = this.economy.currentContract || 'SYSTEM';
    
    // Create reward transfer (from system/contract)
    const transfer = createTransfer(source, recipient, amount, 'REWARD', {
      contractId: this.economy.currentContract || undefined,
    });
    this.economy.transfers.push(transfer);
    
    // Add to recipient if account exists
    const recipientAccount = this.economy.accounts.get(recipient);
    if (recipientAccount) {
      recipientAccount.primaryBalance = addPrimeValues(recipientAccount.primaryBalance, amount);
    }
    
    this.stats.economicOperations++;
    this.context.output.push(`[REWARD] ${recipient} received ${formatPrimeValue(amount)}`);
  }

  private executeAssignmentOrCall(): void {
    const name = this.advance().value;
    
    if (this.check('ASSIGN')) {
      this.gasMeter.consume('VARIABLE_ASSIGNMENT');
      this.advance();
      const value = this.parseExpression();
      // Use setVariable to properly update in scope chain
      this.setVariable(name, value, false);
    } else if (this.check('LPAREN')) {
      // Function call
      this.current--; // Back up to re-parse as expression
      this.parseExpression();
    } else if (this.check('LBRACKET')) {
      // Array/Object bracket notation assignment: name[key] = value
      this.advance(); // consume [
      const index = this.parseExpression();
      this.consume('RBRACKET', 'Expected ]');
      if (this.check('ASSIGN')) {
        this.gasMeter.consume('VARIABLE_ASSIGNMENT');
        this.advance();
        const value = this.parseExpression();
        const container = this.resolveVariable(name);
        if (container && typeof container === 'object') {
          const key = typeof index === 'number' ? index : String(index);
          (container as { [key: string]: ResoLangValue })[String(key)] = value;
        }
      }
    } else if (this.check('DOT')) {
      // Member access assignment
      this.advance();
      const member = this.consume('IDENTIFIER', 'Expected member name').value;
      if (this.check('ASSIGN')) {
        this.advance();
        const value = this.parseExpression();
        // Handle member assignment
        const obj = this.resolveVariable(name);
        if (obj && typeof obj === 'object') {
          (obj as any)[member] = value;
        }
      }
    }
  }

  private parseExpression(): ResoLangValue {
    this.gasMeter.consume('EXPRESSION_EVAL');
    return this.parseComparison();
  }

  private parseComparison(): ResoLangValue {
    let left = this.parseAddition();

    while (this.check('LT') || this.check('GT') || this.check('LTE') ||
           this.check('GTE') || this.check('EQ') || this.check('NEQ')) {
      this.gasMeter.consume('COMPARE');
      const op = this.advance().type;
      const right = this.parseAddition();
      
      const l = left as number;
      const r = right as number;
      
      switch (op) {
        case 'LT': left = l < r; break;
        case 'GT': left = l > r; break;
        case 'LTE': left = l <= r; break;
        case 'GTE': left = l >= r; break;
        case 'EQ': left = l === r; break;
        case 'NEQ': left = l !== r; break;
      }
    }

    return left;
  }

  private parseAddition(): ResoLangValue {
    let left = this.parseMultiplication();

    while (this.check('PLUS') || this.check('MINUS')) {
      const op = this.advance().type;
      this.gasMeter.consume(op === 'PLUS' ? 'ADD' : 'SUBTRACT');
      const right = this.parseMultiplication();
      
      if (typeof left === 'number' && typeof right === 'number') {
        left = op === 'PLUS' ? left + right : left - right;
      }
    }

    return left;
  }

  private parseMultiplication(): ResoLangValue {
    let left = this.parseUnary();

    while (this.check('MULTIPLY') || this.check('DIVIDE') || this.check('MODULO')) {
      const op = this.advance().type;
      this.gasMeter.consume(op === 'MULTIPLY' ? 'MULTIPLY' : op === 'DIVIDE' ? 'DIVIDE' : 'MODULO');
      const right = this.parseUnary();
      
      if (typeof left === 'number' && typeof right === 'number') {
        switch (op) {
          case 'MULTIPLY': left = left * right; break;
          case 'DIVIDE': left = left / right; break;
          case 'MODULO': left = left % right; break;
        }
      }
    }

    return left;
  }

  private parseUnary(): ResoLangValue {
    if (this.check('MINUS')) {
      this.advance();
      const value = this.parseUnary();
      return typeof value === 'number' ? -value : value;
    }
    if (this.check('NOT')) {
      this.advance();
      const value = this.parseUnary();
      return !this.isTruthy(value);
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ResoLangValue {
    const token = this.peek();

    switch (token.type) {
      case 'NUMBER':
        this.advance();
        return parseFloat(token.value);

      case 'COMPLEX_LITERAL':
        this.advance();
        return createComplex(0, parseFloat(token.value));

      case 'STRING_LITERAL':
        this.advance();
        return token.value;

      case 'BOOLEAN_LITERAL':
        this.advance();
        return token.value === 'true';

      case 'LBRACKET':
        this.gasMeter.consume('ARRAY_CREATE');
        return this.parseArray();

      case 'LBRACE':
        return this.parseObject();

      case 'LPAREN':
        this.advance();
        const expr = this.parseExpression();
        this.consume('RPAREN', 'Expected )');
        return expr;

      // Built-in functions
      case 'GET_PRIMES':
        return this.executeGetPrimes();
      case 'COMPUTE_RESONANCE':
        return this.executeComputeResonance();
      case 'FACTORIZE':
        return this.executeFactorize();
      case 'IS_PRIME':
        return this.executeIsPrime();
      case 'COMPUTE_ENTROPY':
        return this.executeComputeEntropy();
      case 'MEASURE_COHERENCE':
        return this.executeMeasureCoherence();
      case 'COMPUTE_ENERGY':
        return this.executeComputeEnergy();
      case 'QUATERNION':
        return this.parseQuaternion();
      case 'CREATE_SUPERPOSITION':
        return this.executeCreateSuperposition();

      // Vector Math Extensions
      case 'VECTOR_ADD':
        return this.executeVectorAdd();
      case 'SCALE':
        return this.executeScale();
      case 'DISTANCE':
        return this.executeDistance();
      case 'NORMALIZE_TANH':
        return this.executeNormalizeTanh();
      case 'GET_EIGENVECTOR':
        return this.executeGetEigenvector();
      case 'COPY':
        return this.executeCopy();

      // Config access
      case 'CONFIG':
        this.advance();
        if (this.check('DOT')) {
          this.advance();
          const key = this.consume('IDENTIFIER', 'Expected config key').value;
          let configValue = this.context.config[key] ?? null;
          
          // Handle bracket notation: CONFIG.topology[variable]
          while (this.check('LBRACKET')) {
            this.gasMeter.consume('ARRAY_ACCESS');
            this.advance();
            const index = this.parseExpression();
            this.consume('RBRACKET', 'Expected ]');
            
            if (configValue && typeof configValue === 'object') {
              const accessKey = String(index);
              configValue = (configValue as { [key: string]: ResoLangValue })[accessKey] ?? null;
            } else {
              configValue = null;
            }
          }
          
          return configValue;
        }
        return this.context.config;

      case 'IDENTIFIER':
        return this.parseIdentifier();

      default:
        this.advance();
        return null;
    }
  }

  private parseArray(): ResoLangValue[] {
    this.advance(); // [
    const items: ResoLangValue[] = [];
    
    while (!this.check('RBRACKET') && !this.isAtEnd()) {
      items.push(this.parseExpression());
      if (this.check('COMMA')) this.advance();
    }
    
    this.consume('RBRACKET', 'Expected ]');
    return items;
  }

  private parseObject(): { [key: string]: ResoLangValue } {
    this.advance(); // {
    const obj: { [key: string]: ResoLangValue } = {};
    
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      // Accept either IDENTIFIER or NUMBER as key
      let key: string;
      if (this.check('IDENTIFIER')) {
        key = this.advance().value;
      } else if (this.check('NUMBER')) {
        key = this.advance().value;
      } else {
        throw new Error(`Expected object key at line ${this.peek().line}, got ${this.peek().type}`);
      }
      this.consume('COLON', 'Expected : after object key');
      const value = this.parseExpression();
      obj[key] = value;
      
      // Skip optional comma
      if (this.check('COMMA')) this.advance();
    }
    
    this.consume('RBRACE', 'Expected }');
    return obj;
  }

  private parseIdentifier(): ResoLangValue {
    const name = this.advance().value;
    
    // Check for function call
    if (this.check('LPAREN')) {
      this.advance();
      const args: ResoLangValue[] = [];
      while (!this.check('RPAREN') && !this.isAtEnd()) {
        args.push(this.parseExpression());
        if (this.check('COMMA')) this.advance();
      }
      this.consume('RPAREN', 'Expected )');
      
      // Built-in functions by name
      switch (name) {
        case 'range':
          const end = args[0] as number;
          return Array.from({ length: end }, (_, i) => i);
        case 'len':
          return Array.isArray(args[0]) ? args[0].length : 0;
        case 'min':
          return Math.min(...args.flat().map(a => a as number));
        case 'max':
          return Math.max(...args.flat().map(a => a as number));
        case 'abs':
          return Math.abs(args[0] as number);
        case 'sqrt':
          return Math.sqrt(args[0] as number);
        case 'cos':
          return Math.cos(args[0] as number);
        case 'sin':
          return Math.sin(args[0] as number);
        case 'KEYS':
          // Return keys of an object as array of strings (or numbers)
          if (args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) {
            return Object.keys(args[0]);
          }
          return [];
        case 'MAGNITUDE':
          // Compute magnitude of a Quaternion
          if (this.isQuaternion(args[0])) {
            const q = args[0] as Quaternion;
            return Math.sqrt(
              q.position[0] * q.position[0] +
              q.position[1] * q.position[1] +
              q.position[2] * q.position[2] +
              q.amplitude.real * q.amplitude.real +
              q.amplitude.imag * q.amplitude.imag
            );
          }
          return 0;
        case 'NORMALIZE':
          // Normalize a Quaternion
          if (this.isQuaternion(args[0])) {
            const q = args[0] as Quaternion;
            const mag = Math.sqrt(
              q.position[0] * q.position[0] +
              q.position[1] * q.position[1] +
              q.position[2] * q.position[2] +
              q.amplitude.real * q.amplitude.real +
              q.amplitude.imag * q.amplitude.imag
            );
            if (mag === 0) return q;
            return createQuaternion(
              [q.position[0] / mag, q.position[1] / mag, q.position[2] / mag],
              createComplex(q.amplitude.real / mag, q.amplitude.imag / mag),
              q.gaussian,
              q.eisenstein
            );
          }
          return args[0];
      }
      
      // Check for user-defined function
      if (this.userFunctions.has(name)) {
        return this.callUserFunction(name, args);
      }
      
      return null;
    }
    
    // Array/Object access with bracket notation
    if (this.check('LBRACKET')) {
      this.gasMeter.consume('ARRAY_ACCESS');
      this.advance();
      const index = this.parseExpression();
      this.consume('RBRACKET', 'Expected ]');
      
      const container = this.resolveVariable(name);
      if (Array.isArray(container)) {
        return container[index as number];
      }
      // Object access with string/number key
      if (container && typeof container === 'object') {
        const key = String(index);
        return (container as { [key: string]: ResoLangValue })[key] ?? null;
      }
      return null;
    }
    
    // Member access
    if (this.check('DOT')) {
      this.gasMeter.consume('MEMBER_ACCESS');
      this.advance();
      const member = this.consume('IDENTIFIER', 'Expected member name').value;
      const obj = this.resolveVariable(name);
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        return (obj as any)[member] ?? null;
      }
    }
    
    // Variable lookup using scope chain
    if (this.hasVariable(name)) {
      return this.resolveVariable(name);
    }
    
    // Constants
    if (name === 'PI') return Math.PI;
    if (name === 'E') return Math.E;
    
    return null;
  }

  private parseQuaternion(): Quaternion {
    this.gasMeter.consume('QUATERNION_CREATE');
    this.advance(); // QUATERNION
    this.consume('LPAREN', 'Expected (');
    
    const position = this.parseArray() as [number, number, number];
    this.consume('COMMA', 'Expected ,');
    const amplitude = this.parseExpression() as number;
    this.consume('COMMA', 'Expected ,');
    const gaussian = this.parseArray() as [number, number];
    this.consume('COMMA', 'Expected ,');
    const eisenstein = this.parseArray() as [number, number];
    
    this.consume('RPAREN', 'Expected )');
    
    this.stats.stateTransforms++;
    return createQuaternion(position, amplitude, gaussian, eisenstein);
  }

  // Built-in function implementations
  private executeGetPrimes(): number[] {
    this.gasMeter.consume('GET_PRIMES');
    this.advance(); // GET_PRIMES
    this.consume('LPAREN', 'Expected (');
    const count = this.parseExpression() as number;
    this.consume('RPAREN', 'Expected )');
    
    this.stats.primeOperations++;
    return this.context.primes.slice(0, count);
  }

  private executeComputeResonance(): ResonanceValue {
    this.gasMeter.consume('COMPUTE_RESONANCE');
    this.advance(); // COMPUTE_RESONANCE
    this.consume('LPAREN', 'Expected (');
    
    const arg1 = this.parseExpression();
    this.consume('COMMA', 'Expected ,');
    const arg2 = this.parseExpression();
    let strength = 1.0;
    if (this.check('COMMA')) {
      this.advance();
      strength = this.parseExpression() as number;
    }
    
    this.consume('RPAREN', 'Expected )');
    
    this.stats.resonanceCalculations++;
    
    // Handle Quaternion inputs (vector resonance)
    if (this.isQuaternion(arg1) && this.isQuaternion(arg2)) {
      const vectorStrength = computeResonanceVector(arg1 as Quaternion, arg2 as Quaternion);
      return {
        strength: vectorStrength * strength,
        primes: [0, 0], // No prime representation for vector resonance
        phase: 0,
      };
    }
    
    // Handle number inputs (prime resonance)
    return computeResonance(arg1 as number, arg2 as number, strength);
  }

  private executeFactorize(): number[] {
    this.gasMeter.consume('FACTORIZE');
    this.advance(); // FACTORIZE
    this.consume('LPAREN', 'Expected (');
    const num = this.parseExpression() as number;
    this.consume('RPAREN', 'Expected )');
    
    this.stats.primeOperations++;
    return factorize(num);
  }

  private executeIsPrime(): boolean {
    this.gasMeter.consume('IS_PRIME');
    this.advance(); // IS_PRIME
    this.consume('LPAREN', 'Expected (');
    const num = this.parseExpression() as number;
    this.consume('RPAREN', 'Expected )');
    
    this.stats.primeOperations++;
    return isPrime(num);
  }

  private executeComputeEntropy(): number {
    this.gasMeter.consume('ENTROPY_COMPUTE');
    this.advance(); // COMPUTE_ENTROPY
    this.consume('LPAREN', 'Expected (');
    const state = this.parseExpression() as Quaternion;
    this.consume('RPAREN', 'Expected )');
    
    return computeEntropy(state);
  }

  private executeMeasureCoherence(): number {
    this.gasMeter.consume('COHERENCE_MEASURE');
    this.advance(); // MEASURE_COHERENCE
    this.consume('LPAREN', 'Expected (');
    const state = this.parseExpression() as Quaternion;
    this.consume('RPAREN', 'Expected )');
    
    return measureCoherence(state);
  }

  private executeComputeEnergy(): number {
    this.gasMeter.consume('ENERGY_COMPUTE');
    this.advance(); // COMPUTE_ENERGY
    this.consume('LPAREN', 'Expected (');
    const state = this.parseExpression() as Quaternion;
    this.consume('RPAREN', 'Expected )');
    
    return computeEnergy(state);
  }

  private executeCreateSuperposition(): any {
    this.gasMeter.consume('SUPERPOSITION_CREATE');
    this.advance(); // CREATE_SUPERPOSITION
    this.consume('LPAREN', 'Expected (');
    
    // Parse named parameters
    const params: { [key: string]: ResoLangValue } = {};
    while (!this.check('RPAREN') && !this.isAtEnd()) {
      const key = this.consume('IDENTIFIER', 'Expected parameter name').value;
      this.consume('COLON', 'Expected :');
      params[key] = this.parseExpression();
      if (this.check('COMMA')) this.advance();
    }
    
    this.consume('RPAREN', 'Expected )');
    
    this.stats.stateTransforms++;
    return { type: 'superposition', dimension: params.dimension || 256 };
  }

  // Vector Math Implementations
  
  private executeVectorAdd(): Quaternion | number[] {
    this.gasMeter.consume('VECTOR_OP');
    this.advance(); // VECTOR_ADD
    this.consume('LPAREN', 'Expected (');
    
    const v1 = this.parseExpression();
    this.consume('COMMA', 'Expected ,');
    const v2 = this.parseExpression();
    
    this.consume('RPAREN', 'Expected )');
    
    // Handle Quaternion addition
    if (this.isQuaternion(v1) && this.isQuaternion(v2)) {
      const q1 = v1 as Quaternion;
      const q2 = v2 as Quaternion;
      
      return createQuaternion(
        [q1.position[0] + q2.position[0], q1.position[1] + q2.position[1], q1.position[2] + q2.position[2]],
        createComplex(q1.amplitude.real + q2.amplitude.real, q1.amplitude.imag + q2.amplitude.imag),
        [q1.gaussian[0] + q2.gaussian[0], q1.gaussian[1] + q2.gaussian[1]],
        [q1.eisenstein[0] + q2.eisenstein[0], q1.eisenstein[1] + q2.eisenstein[1]]
      );
    }
    
    // Handle Array addition
    if (Array.isArray(v1) && Array.isArray(v2)) {
      if (v1.length !== v2.length) throw new Error('Vector dimension mismatch');
      return v1.map((val, i) => (val as number) + (v2[i] as number));
    }
    
    throw new Error('VECTOR_ADD requires two Quaternions or two Arrays');
  }

  private executeScale(): Quaternion | number[] {
    this.gasMeter.consume('VECTOR_OP');
    this.advance(); // SCALE
    this.consume('LPAREN', 'Expected (');
    
    const v = this.parseExpression();
    this.consume('COMMA', 'Expected ,');
    const scalar = this.parseExpression() as number;
    
    this.consume('RPAREN', 'Expected )');
    
    if (this.isQuaternion(v)) {
      const q = v as Quaternion;
      return createQuaternion(
        [q.position[0] * scalar, q.position[1] * scalar, q.position[2] * scalar],
        createComplex(q.amplitude.real * scalar, q.amplitude.imag * scalar),
        [q.gaussian[0] * scalar, q.gaussian[1] * scalar],
        [q.eisenstein[0] * scalar, q.eisenstein[1] * scalar]
      );
    }
    
    if (Array.isArray(v)) {
      return v.map(val => (val as number) * scalar);
    }
    
    throw new Error('SCALE requires a Quaternion or Array');
  }

  private executeDistance(): number {
    this.gasMeter.consume('VECTOR_OP');
    this.advance(); // DISTANCE
    this.consume('LPAREN', 'Expected (');
    
    const v1 = this.parseExpression();
    this.consume('COMMA', 'Expected ,');
    const v2 = this.parseExpression();
    
    this.consume('RPAREN', 'Expected )');
    
    if (this.isQuaternion(v1) && this.isQuaternion(v2)) {
      const q1 = v1 as Quaternion;
      const q2 = v2 as Quaternion;
      
      const posDist = Math.sqrt(
        Math.pow(q1.position[0] - q2.position[0], 2) +
        Math.pow(q1.position[1] - q2.position[1], 2) +
        Math.pow(q1.position[2] - q2.position[2], 2)
      );
      
      const ampDist = Math.sqrt(
        Math.pow(q1.amplitude.real - q2.amplitude.real, 2) +
        Math.pow(q1.amplitude.imag - q2.amplitude.imag, 2)
      );
      
      return posDist + ampDist;
    }
    
    if (Array.isArray(v1) && Array.isArray(v2)) {
      return Math.sqrt((v1 as ResoLangValue[]).reduce<number>((sum, val, i) => {
        const v2Val = v2[i];
        if (typeof val !== 'number' || typeof v2Val !== 'number') return sum;
        return sum + Math.pow(val - v2Val, 2);
      }, 0));
    }
    
    throw new Error('DISTANCE requires two Quaternions or two Arrays');
  }

  private executeNormalizeTanh(): Quaternion | number[] {
    this.gasMeter.consume('VECTOR_OP');
    this.advance(); // NORMALIZE_TANH
    this.consume('LPAREN', 'Expected (');
    
    const v = this.parseExpression();
    
    this.consume('RPAREN', 'Expected )');
    
    if (this.isQuaternion(v)) {
      const q = v as Quaternion;
      return createQuaternion(
        [Math.tanh(q.position[0]), Math.tanh(q.position[1]), Math.tanh(q.position[2])],
        createComplex(Math.tanh(q.amplitude.real), Math.tanh(q.amplitude.imag)),
        [Math.tanh(q.gaussian[0]), Math.tanh(q.gaussian[1])],
        [Math.tanh(q.eisenstein[0]), Math.tanh(q.eisenstein[1])]
      );
    }
    
    if (Array.isArray(v)) {
      return v.map(val => Math.tanh(val as number));
    }
    
    throw new Error('NORMALIZE_TANH requires a Quaternion or Array');
  }

  private executeGetEigenvector(): Quaternion {
    this.gasMeter.consume('VECTOR_OP');
    this.advance(); // GET_EIGENVECTOR
    this.consume('LPAREN', 'Expected (');
    
    const id = this.parseExpression() as number;
    
    this.consume('RPAREN', 'Expected )');
    
    // Deterministic eigenvector generation based on Prime ID
    // This simulates the "nature" of the node
    const phase = (id % 7) / 7 * Math.PI * 2;
    const x = Math.cos(id);
    const y = Math.sin(id);
    const z = Math.sin(id * 1.618);
    
    return createQuaternion(
      [x, y, z],
      createComplex(Math.cos(phase), Math.sin(phase)),
      [0, 0],
      [0, 0]
    );
  }

  private executeCopy(): any {
    this.gasMeter.consume('VECTOR_OP');
    this.advance(); // COPY
    this.consume('LPAREN', 'Expected (');
    
    const val = this.parseExpression();
    
    this.consume('RPAREN', 'Expected )');
    
    return JSON.parse(JSON.stringify(val));
  }

  private isQuaternion(v: any): boolean {
    return v && typeof v === 'object' && 'position' in v && 'amplitude' in v;
  }

  // Helper methods
  private skipBlock(): void {
    if (!this.check('LBRACE')) return;
    this.advance();
    let depth = 1;
    while (depth > 0 && !this.isAtEnd()) {
      if (this.check('LBRACE')) depth++;
      if (this.check('RBRACE')) depth--;
      this.advance();
    }
  }

  private isTruthy(value: ResoLangValue): boolean {
    if (value === null) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  private stringify(value: ResoLangValue): string {
    if (value === null) return 'null';
    if (typeof value === 'object') {
      if ('strength' in value && 'primes' in value) {
        return `Resonance(${(value as ResonanceValue).primes.join(',')}: ${(value as ResonanceValue).strength.toFixed(4)})`;
      }
      if ('amplitude' in value && 'position' in value) {
        return `Quaternion([${(value as Quaternion).position.join(',')}])`;
      }
      if ('factors' in value && 'signature' in value) {
        return `PrimeValue(${formatPrimeValue(value as PrimeValue, { showFactors: true })})`;
      }
      return JSON.stringify(value);
    }
    return String(value);
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at line ${this.peek().line}, got ${this.peek().type}`);
  }
}

// Export singleton interpreter
const interpreter = new ResoLangInterpreter();

export function execute(source: string): ExecutionResult {
  return interpreter.execute(source);
}

export { ResoLangInterpreter, generatePrimes, isPrime, factorize, computeResonance };
export type { ExecutionResult, ValidationResult };
