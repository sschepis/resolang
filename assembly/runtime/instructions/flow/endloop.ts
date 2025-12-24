// assembly/runtime/instructions/flow/endloop.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class EndloopInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const context = engine.getContext();
    if (context.loopStack.length === 0) {
        return false; // ENDLOOP without matching LOOP.
    }

    const loop = context.loopStack[context.loopStack.length - 1];
    loop.counter++;

    if (loop.counter < loop.max) {
        // Jump back to loop start
        context.instructionPointer = loop.start;
        engine.setContext(context);
        return true; // Continue execution
    } else {
        // Loop finished, remove from stack
        engine.getStackManager().popLoop(context);
        engine.setContext(context);
        return true; // Continue execution
    }
  }
}

const endloop = new EndloopInstruction();
export default endloop;