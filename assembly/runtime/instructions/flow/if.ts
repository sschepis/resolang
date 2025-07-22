// assembly/runtime/instructions/flow/if.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class IfInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 3) {
        return false; // IF requires a register, an operator, and a value.
    }

    const leftValue = engine.parseValue(args[0]);
    const operator = args[1].toString().toUpperCase();
    const rightValue = engine.parseValue(args[2]);

    let condition = false;
    if (operator == "EQ" || operator == "==") {
        condition = leftValue == rightValue;
    } else if (operator == "NE" || operator == "!=") {
        condition = leftValue != rightValue;
    } else if (operator == "LT" || operator == "<") {
        condition = leftValue < rightValue;
    } else if (operator == "LE" || operator == "<=") {
        condition = leftValue <= rightValue;
    } else if (operator == "GT" || operator == ">") {
        condition = leftValue > rightValue;
    } else if (operator == "GE" || operator == ">=") {
        condition = leftValue >= rightValue;
    } else {
        return false; // Unknown operator
    }

    // Store condition in context for ELSE handling
    const context = engine.getContext();
    engine.getStackManager().pushCondition(context, condition);
    
    // Set up the condition properly for ELSE handling
    if (context.conditionStack.length > 0) {
        context.conditionStack[context.conditionStack.length - 1].inTrueBranch = condition;
    }
    
    engine.setContext(context);

    if (!condition) {
        // Skip to ELSE or ENDIF
        engine.skipToElseOrEndIf();
    }

    return true;
  }
}

const ifInstruction = new IfInstruction();
export default ifInstruction;