// assembly/runtime/instructions/flow/else.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class ElseInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const context = engine.getContext();
    if (context.conditionStack.length === 0) {
        return false; // ELSE without matching IF.
    }

    const condition = context.conditionStack[context.conditionStack.length - 1];
    condition.hasElse = true;

    engine.setContext(context);

    if (condition.inTrueBranch) {
        // We were in the true branch, skip to ENDIF
        engine.skipToEndIf();
    }
    // Otherwise, we're now in the else branch, continue execution

    return true;
  }
}

const elseInstruction = new ElseInstruction();
export default elseInstruction;