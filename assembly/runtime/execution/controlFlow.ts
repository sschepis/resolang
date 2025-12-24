// assembly/runtime/execution/controlFlow.ts
// Control flow management for RISA runtime

import { ExtendedExecutionContext } from './context';
import { IRISAInstruction } from '../../runtime';
import { Argument } from '../argument';

/**
 * Control flow types
 */
export enum ControlFlowType {
  SEQUENTIAL,
  CONDITIONAL,
  LOOP,
  JUMP,
  CALL,
  RETURN,
  BREAK,
  CONTINUE,
  HALT
}

/**
 * Control flow decision
 */
export class IControlFlowDecision {
  constructor(
    public type: ControlFlowType,
    public shouldAdvance: bool,
    public shouldContinue: bool,
    public targetIP: i32 = -1,
    public metadata: string = ""
  ) {}
}

/**
 * Branch condition evaluator
 */
export class IBranchCondition {
    constructor(
        public type: string, // 'arithmetic' | 'coherence' | 'prime' | 'register'
        public left: Argument,
        public operator: string,
        public right: Argument
    ) {}
}

class ConditionBlock {
    constructor(
        public elseIP: i32 = -1,
        public endIP: i32 = -1
    ) {}
}

class StackFrame {
    constructor(
        public type: string,
        public ip: i32
    ) {}
}

/**
 * Control flow manager interface
 */
export interface IControlFlowManager {
  analyzeInstruction(instruction: IRISAInstruction, context: ExtendedExecutionContext): IControlFlowDecision;
  evaluateCondition(condition: IBranchCondition, context: ExtendedExecutionContext): bool;
  findMatchingStructure(context: ExtendedExecutionContext, instructions: IRISAInstruction[], startType: string, endType: string): i32;
  skipToMatching(context: ExtendedExecutionContext, instructions: IRISAInstruction[], targetType: string): i32;
  validateControlFlow(instructions: IRISAInstruction[]): string[];
  buildJumpTable(instructions: IRISAInstruction[]): void;
  getJumpTarget(label: string): i32;
  getJumpTable(): Map<string, i32>;
}

/**
 * Control flow manager implementation
 */
export class ControlFlowManager implements IControlFlowManager {
  private jumpTable: Map<string, i32> = new Map();
  private loopStarts: Map<i32, i32> = new Map();
  private conditionBlocks: Map<i32, ConditionBlock> = new Map();

  analyzeInstruction(instruction: IRISAInstruction, context: ExtendedExecutionContext): IControlFlowDecision {
    const mnemonic = instruction.mnemonic.toUpperCase();

    if (mnemonic == 'IF' || mnemonic == 'IFCOH' || mnemonic == 'IFPRIME') {
        return new IControlFlowDecision(ControlFlowType.CONDITIONAL, true, true, -1, `{ "conditionType": "${mnemonic}" }`);
    } else if (mnemonic == 'ELSE') {
        return new IControlFlowDecision(ControlFlowType.CONDITIONAL, true, true, -1, '{ "isElse": true }');
    } else if (mnemonic == 'ENDIF') {
        return new IControlFlowDecision(ControlFlowType.CONDITIONAL, true, true, -1, '{ "isEnd": true }');
    } else if (mnemonic == 'LOOP') {
        return new IControlFlowDecision(ControlFlowType.LOOP, true, true, -1, '{ "loopType": "counted" }');
    } else if (mnemonic == 'WHILE' || mnemonic == 'WHILECOH') {
        return new IControlFlowDecision(ControlFlowType.LOOP, true, true, -1, `{ "loopType": "conditional", "conditionType": "${mnemonic}" }`);
    } else if (mnemonic == 'ENDLOOP' || mnemonic == 'ENDWHILE') {
        return new IControlFlowDecision(ControlFlowType.LOOP, false, true, -1, '{ "isEnd": true }');
    } else if (mnemonic == 'BREAK') {
        return new IControlFlowDecision(ControlFlowType.BREAK, false, true, -1, '{ "breakType": "loop" }');
    } else if (mnemonic == 'CONTINUE') {
        return new IControlFlowDecision(ControlFlowType.CONTINUE, false, true, -1, '{ "continueType": "loop" }');
    } else if (mnemonic == 'GOTO') {
        const label = instruction.args[0].toString();
        const targetIP = this.jumpTable.has(label) ? this.jumpTable.get(label) : -1;
        return new IControlFlowDecision(ControlFlowType.JUMP, false, true, targetIP, `{ "label": "${label}", "found": ${targetIP != -1} }`);
    } else if (mnemonic == 'CALL') {
        const callLabel = instruction.args[0].toString();
        const callTargetIP = this.jumpTable.has(callLabel) ? this.jumpTable.get(callLabel) : -1;
        return new IControlFlowDecision(ControlFlowType.CALL, false, true, callTargetIP, `{ "label": "${callLabel}", "found": ${callTargetIP != -1} }`);
    } else if (mnemonic == 'RETURN') {
        return new IControlFlowDecision(ControlFlowType.RETURN, false, true);
    } else if (mnemonic == 'WAITCOH') {
        const threshold = F64.parseFloat(instruction.args[0].toString());
        const coherence = context.state.getGlobalCoherence();
        return new IControlFlowDecision(ControlFlowType.SEQUENTIAL, coherence >= threshold, true, -1, `{ "coherence": ${coherence}, "threshold": ${threshold} }`);
    } else if (mnemonic == 'THRESHOLD') {
        const register = instruction.args[0].toString();
        const thresholdValue = F64.parseFloat(instruction.args[1].toString());
        const registerValue = context.registers.getRegister(register);
        return new IControlFlowDecision(ControlFlowType.SEQUENTIAL, registerValue >= thresholdValue, true, -1, `{ "register": "${register}", "registerValue": ${registerValue}, "thresholdValue": ${thresholdValue} }`);
    } else if (mnemonic == 'HALT') {
        return new IControlFlowDecision(ControlFlowType.HALT, false, false);
    } else if (mnemonic == 'LABEL') {
        return new IControlFlowDecision(ControlFlowType.SEQUENTIAL, true, true, -1, `{ "isLabel": true, "labelName": "${instruction.args[0].toString()}" }`);
    } else {
        return new IControlFlowDecision(ControlFlowType.SEQUENTIAL, true, true);
    }
  }

  evaluateCondition(condition: IBranchCondition, context: ExtendedExecutionContext): bool {
    const left = condition.left;
    const operator = condition.operator;
    const right = condition.right;
    const type = condition.type;

    // This will require the engine to be passed in, or for the parseValue logic to be moved here.
    // For now, we'll just compare the raw values.
    const leftVal = F64.parseFloat(left.toString());
    const rightVal = F64.parseFloat(right.toString());

    return this.evaluateArithmeticCondition(leftVal, operator, rightVal);
  }

  private evaluateArithmeticCondition(left: f64, operator: string, right: f64): bool {
    if (operator == "EQ" || operator == "==") {
        return left == right;
    } else if (operator == "NE" || operator == "!=") {
        return left != right;
    } else if (operator == "LT" || operator == "<") {
        return left < right;
    } else if (operator == "LE" || operator == "<=") {
        return left <= right;
    } else if (operator == "GT" || operator == ">") {
        return left > right;
    } else if (operator == "GE" || operator == ">=") {
        return left >= right;
    } else {
        return false;
    }
  }

  findMatchingStructure(context: ExtendedExecutionContext, instructions: IRISAInstruction[], startType: string, endType: string): i32 {
    const startIP = context.instructionPointer;
    
    if (startType.startsWith('IF')) {
      const block = this.conditionBlocks.get(startIP);
      if (block) {
        return endType === 'ELSE' ? block.elseIP : block.endIP;
      }
    } else if (startType === 'LOOP' || startType === 'WHILE') {
        const loopKeys = this.loopStarts.keys();
        for(let i = 0; i < loopKeys.length; i++) {
            if(this.loopStarts.get(loopKeys[i]) == startIP) {
                return loopKeys[i];
            }
        }
    }
    
    let nestLevel = 1;
    let ip = context.instructionPointer + 1;

    while (ip < instructions.length && nestLevel > 0) {
      const instruction = instructions[ip];
      const mnemonic = instruction.mnemonic.toUpperCase();

      if (this.isStartType(mnemonic, startType)) {
        nestLevel++;
      } else if (this.isEndType(mnemonic, endType)) {
        nestLevel--;
      }

      if (nestLevel === 0) {
        return ip;
      }

      ip++;
    }

    return -1;
  }

  skipToMatching(context: ExtendedExecutionContext, instructions: IRISAInstruction[], targetType: string): i32 {
    const startIP = context.instructionPointer;

    if (targetType === 'ELSE' || targetType === 'ENDIF') {
      const block = this.conditionBlocks.get(startIP);
      if (block) {
        return targetType === 'ELSE' ? block.elseIP : block.endIP;
      }
    } else if (targetType === 'ENDLOOP' || targetType === 'ENDWHILE') {
        const loopKeys = this.loopStarts.keys();
        for(let i = 0; i < loopKeys.length; i++) {
            if(this.loopStarts.get(loopKeys[i]) == startIP) {
                return loopKeys[i];
            }
        }
    }

    let nestLevel = 1;
    let ip = context.instructionPointer + 1;

    while (ip < instructions.length && nestLevel > 0) {
      const instruction = instructions[ip];
      const mnemonic = instruction.mnemonic.toUpperCase();

      if (targetType === 'ELSE' || targetType === 'ENDIF') {
        if (mnemonic === 'IF' || mnemonic === 'IFCOH' || mnemonic === 'IFPRIME') {
          nestLevel++;
        } else if (mnemonic === 'ENDIF') {
          nestLevel--;
        } else if (mnemonic === 'ELSE' && nestLevel === 1) {
          return ip;
        }
      } else if (targetType === 'ENDLOOP') {
        if (mnemonic === 'LOOP') {
          nestLevel++;
        } else if (mnemonic === 'ENDLOOP') {
          nestLevel--;
        }
      } else if (targetType === 'ENDWHILE') {
        if (mnemonic === 'WHILE' || mnemonic === 'WHILECOH') {
          nestLevel++;
        } else if (mnemonic === 'ENDWHILE') {
          nestLevel--;
        }
      }

      if (nestLevel === 0) {
        return ip;
      }

      ip++;
    }

    return -1;
  }

  validateControlFlow(instructions: IRISAInstruction[]): string[] {
    return [];
  }

  buildJumpTable(instructions: IRISAInstruction[]): void {
    this.jumpTable.clear();
    this.loopStarts.clear();
    this.conditionBlocks.clear();
    const stack: StackFrame[] = [];

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      const mnemonic = instruction.mnemonic.toUpperCase();

      if (mnemonic == 'LABEL') {
          if (instruction.args.length > 0) {
            this.jumpTable.set(instruction.args[0].toString(), i);
          }
      } else if (mnemonic == 'IF' || mnemonic == 'IFCOH' || mnemonic == 'IFPRIME') {
          stack.push(new StackFrame('IF', i));
          this.conditionBlocks.set(i, new ConditionBlock());
      } else if (mnemonic == 'LOOP' || mnemonic == 'WHILE' || mnemonic == 'WHILECOH') {
          stack.push(new StackFrame('LOOP', i));
          this.loopStarts.set(i, i);
      } else if (mnemonic == 'ELSE') {
          if (stack.length > 0 && stack[stack.length - 1].type === 'IF') {
            const ifBlock = this.conditionBlocks.get(stack[stack.length - 1].ip);
            if (ifBlock) {
              ifBlock.elseIP = i;
            }
          }
      } else if (mnemonic == 'ENDIF') {
          if (stack.length > 0 && stack[stack.length - 1].type === 'IF') {
            const ifIP = stack.pop().ip;
            const ifBlock = this.conditionBlocks.get(ifIP);
            if(ifBlock) {
                ifBlock.endIP = i;
            }
          }
      } else if (mnemonic == 'ENDLOOP' || mnemonic == 'ENDWHILE') {
          if (stack.length > 0 && stack[stack.length - 1].type === 'LOOP') {
            const loopIP = stack.pop().ip;
            this.loopStarts.set(i, loopIP);
          }
      }
    }
  }

  getJumpTarget(label: string): i32 {
    return this.jumpTable.has(label) ? this.jumpTable.get(label) : -1;
  }

  getJumpTable(): Map<string, i32> {
    return this.jumpTable;
  }

  private isStartType(mnemonic: string, startType: string): bool {
    if (startType == 'IF') {
        return mnemonic === 'IF' || mnemonic === 'IFCOH' || mnemonic === 'IFPRIME';
    } else if (startType == 'LOOP') {
        return mnemonic === 'LOOP';
    } else if (startType == 'WHILE') {
        return mnemonic === 'WHILE' || mnemonic === 'WHILECOH';
    } else {
        return mnemonic === startType;
    }
  }

  private isEndType(mnemonic: string, endType: string): bool {
    if (endType == 'ENDIF') {
        return mnemonic === 'ENDIF';
    } else if (endType == 'ENDLOOP') {
        return mnemonic === 'ENDLOOP';
    } else if (endType == 'ENDWHILE') {
        return mnemonic === 'ENDWHILE';
    } else {
        return mnemonic === endType;
    }
  }
}