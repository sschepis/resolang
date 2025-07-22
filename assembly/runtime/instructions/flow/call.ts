// assembly/runtime/instructions/flow/call.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class CallInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        // Cannot throw exceptions in AS, so we'll have to handle this differently.
        // For now, we'll just return false to halt execution.
        return false;
    }

    const label = args[0].toString();
    const context = engine.getContext();
    const target = engine.getControlFlowManager().getJumpTarget(label);

    if (target == -1) {
        return false; // Label not found
    }

    // Push call frame with return address
    engine.getStackManager().pushCall(context, label, context.instructionPointer + 1, new Map<string, f64>());
    
    // Update context with new instruction pointer
    context.instructionPointer = target;
    engine.setContext(context);

    return true;
  }
}

const call = new CallInstruction();
export default call;