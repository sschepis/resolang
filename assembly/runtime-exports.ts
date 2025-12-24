import {
  IdentityResoLangProcessor,
  IdentityQuantumState,
  QuantumPermissionEvaluator,
  QuantumTransferProcessor,
  QuantumIdentityRecovery,
  QuantumAuditProcessor,
} from "./runtime/processor";
import { IIdentity, IDomain, IDomainObject, IPermission, IRole } from "./identity/interfaces";
import { IdentityId } from "./identity/types";
import { TransferRequest } from "./identity/ownership-transfer";
import { AuditEntry } from "./identity/audit-trail";
import { NetworkNode } from "./prn-node";

// Mining-specific exports
import { Argument } from "./runtime/argument";
import { PrimeState } from "./quantum/prime-state";
import { EntropyEvolution } from "./quantum/entropy-evolution";

// RISA Engine interfaces and classes
export class IRISAInstruction {
  mnemonic: string;
  args: Argument[];
  lineNumber: i32;

  constructor(mnemonic: string, args: Argument[], lineNumber: i32) {
    this.mnemonic = mnemonic;
    this.args = args;
    this.lineNumber = lineNumber;
  }
}

export class IExecutionResult {
  success: bool;
  result: f64;
  error: string | null;
  instructionsExecuted: i32;
  executionTime: f64;

  constructor(
    success: bool,
    result: f64,
    error: string | null,
    instructionsExecuted: i32,
    executionTime: f64
  ) {
    this.success = success;
    this.result = result;
    this.error = error;
    this.instructionsExecuted = instructionsExecuted;
    this.executionTime = executionTime;
  }
}

// Simple register state for RISA engine
export class RegisterState {
  private registers: Map<string, f64> = new Map();

  setRegister(name: string, value: f64): void {
    this.registers.set(name, value);
  }

  getRegister(name: string): f64 {
    return this.registers.has(name) ? this.registers.get(name) : 0.0;
  }
}

// Simple execution context
export class ExecutionContext {
  flags: Map<string, bool> = new Map();

  constructor() {
    this.flags.set("halted", false);
  }
}

export class RISAEngine {
  private instructions: IRISAInstruction[] = [];
  private registerState: RegisterState = new RegisterState();
  private context: ExecutionContext = new ExecutionContext();
  
  constructor() {}
  
  loadProgram(instructions: IRISAInstruction[]): void {
    this.instructions = instructions;
  }
  
  execute(): IExecutionResult {
    const startTime = Date.now() as f64;
    let instructionsExecuted = 0;
    
    // Simple execution loop - just count instructions for now
    for (let i = 0; i < this.instructions.length; i++) {
      instructionsExecuted++;
      // Check halt flag
      if (this.context.flags.get("halted")) {
        break;
      }
    }
    
    const endTime = Date.now() as f64;
    
    return new IExecutionResult(
      true,
      0.0,
      null,
      instructionsExecuted,
      endTime - startTime
    );
  }
  
  parseValue(arg: Argument): f64 {
    // Simple value parsing - use the f64 field from Argument
    return arg.f;
  }
  
  getRegisterState(): RegisterState {
    return this.registerState;
  }
  
  getContext(): ExecutionContext {
    return this.context;
  }
  
  reset(): void {
    this.instructions = [];
    this.registerState = new RegisterState();
    this.context = new ExecutionContext();
  }
  
  addInstruction(instruction: IRISAInstruction): void {
    this.instructions.push(instruction);
  }
}

// Mining-related classes exported above

// Processor management
export function createIdentityProcessor(): IdentityResoLangProcessor {
  return new IdentityResoLangProcessor();
}

// Method exports for IdentityResoLangProcessor
export function checkPermission(
  processor: IdentityResoLangProcessor,
  identity: IIdentity,
  permission: string,
  resource: string | null = null
): boolean {
  return processor.checkPermission(identity, permission, resource);
}

export function processTransferRequest(
  processor: IdentityResoLangProcessor,
  request: TransferRequest,
  approvers: Array<IIdentity>
): boolean {
  return processor.processTransferRequest(request, approvers);
}

export function recoverIdentity(
  processor: IdentityResoLangProcessor,
  lostIdentityId: IdentityId,
  recoveryIdentities: Array<IIdentity>,
  requiredSignatures: i32 = 3
): boolean {
  return processor.recoverIdentity(lostIdentityId, recoveryIdentities, requiredSignatures);
}

export function createAuditEntry(
  processor: IdentityResoLangProcessor,
  entry: AuditEntry
): void {
  processor.createAuditEntry(entry);
}

export function verifyAuditIntegrity(
  processor: IdentityResoLangProcessor
): boolean {
  return processor.verifyAuditIntegrity();
}

export function syncWithNetwork(
  processor: IdentityResoLangProcessor
): boolean {
  return processor.syncWithNetwork();
}