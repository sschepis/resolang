// assembly/runtime.ts
// This file will contain the RISA execution engine.

import {
    ResonantFragment,
    EntangledNode,
    TeleportationChannel,
    Attractor,
    Prime,
    Phase,
    Amplitude,
    Entropy
} from './resolang';
import { ExtendedExecutionContext } from './runtime/execution/context';
import { GlobalState } from './runtime/state/globalState';
import { PrimeStateEngine } from './runtime/state/primeState';
import { RegisterState } from './runtime/state/registerState';
import { HolographicMemory } from './runtime/memory/holographic';
import { CallStackManager } from './runtime/execution/stack';
import { ControlFlowManager, ControlFlowType } from './runtime/execution/controlFlow';
import { IInstructionHandler } from './runtime/instructions/types';
import { Argument } from './runtime/argument';
import instructionHandlers from './runtime/instructions';

export class IRISAInstruction {
    constructor(
        public mnemonic: string,
        public args: Argument[],
        public line: i32 = 0,
        public file: string = ""
    ) {}
}

export class IExecutionResult {
    constructor(
        public success: bool,
        public executionTime: f64,
        public instructionsExecuted: i32,
        public error: string = "",
        public output: string = ""
    ) {}
}

export class RISAEngine {
    // Define engine properties here
    private instructions: IRISAInstruction[] = [];
    private context: ExtendedExecutionContext;
    private stackManager: CallStackManager;
    private controlFlowManager: ControlFlowManager;
    private instructionHandlers: Map<string, IInstructionHandler>;
    private startTime: f64 = 0;

    constructor() {
        this.context = new ExtendedExecutionContext();
        this.stackManager = new CallStackManager();
        this.controlFlowManager = new ControlFlowManager();
        this.instructionHandlers = instructionHandlers;
    }

    loadProgram(instructions: IRISAInstruction[]): void {
        this.instructions = instructions;
        this.reset();
        this.controlFlowManager.buildJumpTable(this.instructions);
        this.parseLabels();
    }

    execute(): IExecutionResult {
        this.startTime = Date.now() as f64;
        this.context.flags.running = true;
        this.context.flags.halted = false;
        this.context.flags.error = false;

        while (this.context.flags.running && !this.context.flags.halted && !this.context.flags.error) {
            const continueExecution = this.step();
            if (!continueExecution) {
                break;
            }
        }

        return new IExecutionResult(
            !this.context.flags.error,
            (Date.now() as f64) - this.startTime,
            this.context.metrics.instructionsExecuted,
            "", // Placeholder for error
            "" // Placeholder for output
        );
    }

    step(): bool {
        if (this.context.instructionPointer >= this.instructions.length) {
            this.context.flags.running = false;
            return false;
        }

        const instruction = this.instructions[this.context.instructionPointer];
        
        if (instruction.mnemonic.toUpperCase() == 'HALT') {
            this.executeInstruction(instruction);
            return false;
        }
        
        const decision = this.controlFlowManager.analyzeInstruction(instruction, this.context);

        if (!decision.shouldContinue) {
            this.context.flags.running = false;
            return false;
        }

        const ipBeforeExecution = this.context.instructionPointer;
        
        const shouldContinue = this.executeInstruction(instruction);
        
        const ipChanged = this.context.instructionPointer != ipBeforeExecution;
        
        if (ipChanged) {
            // Instruction already changed the IP
        } else if (decision.shouldAdvance && shouldContinue) {
            this.context.instructionPointer++;
        }

        return this.context.flags.running;
    }

    reset(): void {
        this.context = new ExtendedExecutionContext();
    }

    getContext(): ExtendedExecutionContext {
        return this.context;
    }

    setContext(context: ExtendedExecutionContext): void {
        this.context = context;
    }

    getStackManager(): CallStackManager {
        return this.stackManager;
    }

    getControlFlowManager(): ControlFlowManager {
        return this.controlFlowManager;
    }

    skipToEndLoop(): void {
        const endLoopIP = this.controlFlowManager.skipToMatching(
            this.context,
            this.instructions,
            'ENDLOOP'
        );
        if (endLoopIP != -1) {
            this.context.instructionPointer = endLoopIP;
        }
    }

    skipToEndIf(): void {
        const endIfIP = this.controlFlowManager.skipToMatching(
            this.context,
            this.instructions,
            'ENDIF'
        );
        if (endIfIP != -1) {
            this.context.instructionPointer = endIfIP;
        }
    }

    skipToElseOrEndIf(): void {
        // First try to find ELSE
        const elseIP = this.controlFlowManager.skipToMatching(
            this.context,
            this.instructions,
            'ELSE'
        );
        
        if (elseIP != -1) {
            this.context.instructionPointer = elseIP;
            return;
        }
        
        // If no ELSE found, skip to ENDIF
        this.skipToEndIf();
    }

    parseValue(arg: Argument): f64 {
        if (arg.isFloat()) {
            return arg.f;
        }
        if (arg.isInt()) {
            return arg.i as f64;
        }
        if (arg.isString()) {
            const s = arg.s!;
            if (this.context.registers.hasRegister(s)) {
                return this.context.registers.getRegister(s);
            }
            const parsed = F64.parseFloat(s);
            if (!isNaN(parsed)) {
                return parsed;
            }
        }
        return 0;
    }

    parsePrime(arg: Argument): i32 {
        const value = this.parseValue(arg);
        if (value < 2 || !this.isPrime(i32(Math.floor(value)))) {
            return 0; // Should throw an error
        }
        return i32(Math.floor(value));
    }

    isPrime(n: i32): bool {
        if (n < 2) return false;
        if (n == 2) return true;
        if (n % 2 == 0) return false;
        for (let i = 3; i * i <= n; i += 2) {
            if (n % i == 0) return false;
        }
        return true;
    }

    getGlobalState(): GlobalState {
        return this.context.state;
    }

    getPrimeEngine(): PrimeStateEngine {
        return this.context.primeEngine;
    }

    getRegisterState(): RegisterState {
        return this.context.registers;
    }

    getMemory(): HolographicMemory {
        return this.context.memory;
    }

    private executeInstruction(instruction: IRISAInstruction): bool {
        this.context.metrics.instructionsExecuted++;
        const handler = this.instructionHandlers.get(instruction.mnemonic.toUpperCase());
        if (handler) {
            return handler.execute(this, instruction.args);
        }
        
        const decision = this.controlFlowManager.analyzeInstruction(instruction, this.context);
        if (decision.type != ControlFlowType.SEQUENTIAL) {
            return !decision.shouldAdvance;
        }

        // Unknown instruction
        this.context.flags.error = true;
        this.context.flags.running = false;
        return false;
    }

    private parseLabels(): void {
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            if (instruction.mnemonic.toUpperCase() == 'LABEL' && instruction.args.length > 0) {
                const labelName = instruction.args[0].toString();
                this.controlFlowManager.getJumpTable().set(labelName, i);
            }
        }
    }
}