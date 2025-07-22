// assembly/runtime/instructions/flow/endwhile.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class EndwhileInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const context = engine.getContext();
    if (context.loopStack.length === 0) {
        return false; // ENDWHILE without matching WHILE.
    }

    const loop = context.loopStack[context.loopStack.length - 1];
    context.instructionPointer = loop.start;
    engine.getStackManager().popLoop(context);

    return false;
  }
}

const endwhile = new EndwhileInstruction();
export default endwhile;