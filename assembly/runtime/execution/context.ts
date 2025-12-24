// assembly/runtime/execution/context.ts

import { HolographicMemory } from '../memory/holographic';
import { PrimeStateEngine } from '../state/primeState';
import { RegisterState } from '../state/registerState';
import { GlobalState } from '../state/globalState';

export class ExecutionScope {
  constructor(
    public id: string,
    public type: string, // 'global', 'function', 'loop', 'condition'
    public variables: Map<string, f64> = new Map(),
    public labels: Map<string, i32> = new Map(),
    public created: f64 = Date.now() as f64
  ) {}
}

export class ExecutionFrame {
  constructor(
    public id: string,
    public name: string, // e.g., function name
    public returnAddress: i32,
    public scope: ExecutionScope,
    public parameters: Map<string, f64> = new Map(),
    public created: f64 = Date.now() as f64
  ) {}
}

export class LoopFrame {
    constructor(
        public id: string,
        public start: i32,
        public end: i32,
        public counter: i32,
        public max: i32,
        public scope: ExecutionScope
    ) {}
}

export class ConditionFrame {
    constructor(
        public id: string,
        public inTrueBranch: bool,
        public hasElse: bool,
        public scope: ExecutionScope
    ) {}
}

export class ExecutionFlags {
  constructor(
    public running: bool = false,
    public halted: bool = false,
    public error: bool = false,
    public waiting: bool = false,
    public debug: bool = false
  ) {}

  clear(): void {
    this.running = false;
    this.halted = false;
    this.error = false;
    this.waiting = false;
    this.debug = false;
  }
}

export class ExecutionMetrics {
  constructor(
    public instructionsExecuted: i32 = 0,
    public callsExecuted: i32 = 0,
    public loopsExecuted: i32 = 0,
    public branchesTaken: i32 = 0,
    public branchesNotTaken: i32 = 0
  ) {}
}

export class ExtendedExecutionContext {
  constructor(
    public instructionPointer: i32 = 0,
    public flags: ExecutionFlags = new ExecutionFlags(),
    public metrics: ExecutionMetrics = new ExecutionMetrics(),
    public scopes: Array<ExecutionScope> = [new ExecutionScope('global-scope', 'global')],
    public callStack: Array<ExecutionFrame> = [],
    public loopStack: Array<LoopFrame> = [],
    public conditionStack: Array<ConditionFrame> = [],
    public registers: RegisterState = new RegisterState(),
    public primeEngine: PrimeStateEngine = new PrimeStateEngine(),
    public memory: HolographicMemory = new HolographicMemory(),
    public state: GlobalState = new GlobalState(new PrimeStateEngine(), new RegisterState())
  ) {}
}