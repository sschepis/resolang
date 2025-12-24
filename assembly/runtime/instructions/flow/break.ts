// assembly/runtime/instructions/flow/break.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class BreakInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const context = engine.getContext();
    if (context.loopStack.length === 0) {
        return false; // BREAK outside of a loop.
    }

    engine.getStackManager().popLoop(context);
    engine.skipToEndLoop();

    return false;
  }
}

const breakInstruction = new BreakInstruction();
export default breakInstruction;