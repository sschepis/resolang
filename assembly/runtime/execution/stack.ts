// assembly/runtime/execution/stack.ts
// Call stack management for RISA runtime

import { ExecutionFrame, ExtendedExecutionContext, LoopFrame, ConditionFrame, ExecutionScope } from './context';

/**
 * Stack overflow protection
 */
export class IStackLimits {
  constructor(
    public maxCallDepth: i32 = 1000,
    public maxLoopDepth: i32 = 100,
    public maxConditionDepth: i32 = 100,
    public maxStackSize: i32 = 10 * 1024 * 1024 // 10MB
  ) {}
}

/**
 * Stack statistics
 */
export class IStackStats {
    constructor(
        public currentCallDepth: i32,
        public maxCallDepthReached: i32,
        public currentLoopDepth: i32,
        public currentConditionDepth: i32,
        public totalOperations: i32,
        public memoryUsage: i32
    ) {}
}

/**
 * Call stack manager interface
 */
export interface ICallStackManager {
  pushCall(context: ExtendedExecutionContext, functionName: string, returnAddress: i32, parameters: Map<string, f64>): bool;
  popCall(context: ExtendedExecutionContext): ExecutionFrame | null;
  pushLoop(context: ExtendedExecutionContext, startAddress: i32, endAddress: i32, maxIterations: i32): bool;
  popLoop(context: ExtendedExecutionContext): LoopFrame | null;
  pushCondition(context: ExtendedExecutionContext, conditionValue: bool): bool;
  popCondition(context: ExtendedExecutionContext): ConditionFrame | null;
  checkLimits(context: ExtendedExecutionContext): bool;
  getStats(context: ExtendedExecutionContext): IStackStats;
  setLimits(limits: IStackLimits): void;
  clearStacks(context: ExtendedExecutionContext): void;
  getStackTrace(context: ExtendedExecutionContext): string[];
}

/**
 * Call stack manager implementation
 */
export class CallStackManager implements ICallStackManager {
  private limits: IStackLimits = new IStackLimits();
  private maxCallDepthReached: i32 = 0;
  private totalOperations: i32 = 0;

  pushCall(context: ExtendedExecutionContext, functionName: string, returnAddress: i32, parameters: Map<string, f64> = new Map()): bool {
    if (context.callStack.length >= this.limits.maxCallDepth) {
      // In AssemblyScript, we can't throw strings, so we'll have to handle this differently.
      // For now, we'll just return false.
      return false;
    }

    const frame = new ExecutionFrame(
      `call-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      functionName,
      returnAddress,
      new ExecutionScope(`scope-call-${functionName}`, 'function'),
      parameters
    );

    context.callStack.push(frame);
    context.metrics.callsExecuted++;
    this.totalOperations++;

    if (context.callStack.length > this.maxCallDepthReached) {
      this.maxCallDepthReached = context.callStack.length;
    }

    return true;
  }

  popCall(context: ExtendedExecutionContext): ExecutionFrame | null {
    if (context.callStack.length === 0) {
      return null;
    }

    const frame = context.callStack.pop();
    this.totalOperations++;
    return frame;
  }

  pushLoop(context: ExtendedExecutionContext, startAddress: i32, endAddress: i32, maxIterations: i32): bool {
    if (context.loopStack.length >= this.limits.maxLoopDepth) {
      return false;
    }

    const loopFrame = new LoopFrame(
      `loop-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      startAddress,
      endAddress,
      0,
      maxIterations,
      new ExecutionScope(`scope-loop-${context.loopStack.length}`, 'loop')
    );

    context.loopStack.push(loopFrame);
    context.metrics.loopsExecuted++;
    this.totalOperations++;

    return true;
  }

  popLoop(context: ExtendedExecutionContext): LoopFrame | null {
    if (context.loopStack.length === 0) {
      return null;
    }

    const loop = context.loopStack.pop();
    this.totalOperations++;
    return loop;
  }

  pushCondition(context: ExtendedExecutionContext, conditionValue: bool): bool {
    if (context.conditionStack.length >= this.limits.maxConditionDepth) {
      return false;
    }

    const conditionFrame = new ConditionFrame(
      `cond-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      conditionValue,
      false,
      new ExecutionScope(`scope-condition-${context.conditionStack.length}`, 'condition')
    );

    context.conditionStack.push(conditionFrame);
    this.totalOperations++;

    return true;
  }

  popCondition(context: ExtendedExecutionContext): ConditionFrame | null {
    if (context.conditionStack.length === 0) {
      return null;
    }

    const condition = context.conditionStack.pop();
    this.totalOperations++;
    return condition;
  }

  checkLimits(context: ExtendedExecutionContext): bool {
    if (context.callStack.length > this.limits.maxCallDepth) return false;
    if (context.loopStack.length > this.limits.maxLoopDepth) return false;
    if (context.conditionStack.length > this.limits.maxConditionDepth) return false;
    if (this.estimateStackSize(context) > this.limits.maxStackSize) return false;
    return true;
  }

  getStats(context: ExtendedExecutionContext): IStackStats {
    return new IStackStats(
      context.callStack.length,
      this.maxCallDepthReached,
      context.loopStack.length,
      context.conditionStack.length,
      this.totalOperations,
      this.estimateStackSize(context)
    );
  }

  setLimits(limits: IStackLimits): void {
    this.limits = limits;
  }

  clearStacks(context: ExtendedExecutionContext): void {
    context.callStack = [];
    context.loopStack = [];
    context.conditionStack = [];
    this.totalOperations++;
  }

  getStackTrace(context: ExtendedExecutionContext): string[] {
    const trace: string[] = [];
    for (let i = context.callStack.length - 1; i >= 0; i--) {
      const frame = context.callStack[i];
      trace.push(`  at ${frame.name} (return: ${frame.returnAddress})`);
    }
    trace.unshift(`  at <current> (IP: ${context.instructionPointer})`);
    return trace;
  }

  private estimateStackSize(context: ExtendedExecutionContext): i32 {
    let size = 0;
    for (let i = 0; i < context.callStack.length; i++) {
      size += 100; // Base frame overhead
      size += context.callStack[i].parameters.size * 50;
      size += context.callStack[i].scope.variables.size * 50;
    }
    size += context.loopStack.length * 200;
    size += context.conditionStack.length * 100;
    return size;
  }
}