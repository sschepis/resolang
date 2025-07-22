// assembly/runtime/instructions/flow/goto.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class GotoInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // GOTO requires a label.
    }

    const label = args[0].toString();
    const context = engine.getContext();
    const target = engine.getControlFlowManager().getJumpTarget(label);

    if (target == -1) {
        return false; // Label not found
    }

    context.instructionPointer = target;
    engine.setContext(context);

    return true; // Continue execution
  }
}

const gotoInstruction = new GotoInstruction();
export default gotoInstruction;