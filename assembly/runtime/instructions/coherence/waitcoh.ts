// assembly/runtime/instructions/coherence/waitcoh.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class WaitcohInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // WAITCOH requires a threshold value.
    }

    const threshold = engine.parseValue(args[0]);
    const globalCoherence = engine.getGlobalState().calculateGlobalCoherence();

    if (globalCoherence.average < threshold) {
        // This instruction should pause execution. For now, we'll just return false
        // to indicate the condition was not met. The execution loop will need to
        // handle this by re-evaluating the instruction.
        return false;
    }

    return true;
  }
}

const waitcoh = new WaitcohInstruction();
export default waitcoh;