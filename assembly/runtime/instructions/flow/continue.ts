// assembly/runtime/instructions/flow/continue.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class ContinueInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const context = engine.getContext();
    if (context.loopStack.length === 0) {
        return false; // CONTINUE outside of a loop.
    }

    const loop = context.loopStack[context.loopStack.length - 1];
    context.instructionPointer = loop.start;

    return false;
  }
}

const continueInstruction = new ContinueInstruction();
export default continueInstruction;