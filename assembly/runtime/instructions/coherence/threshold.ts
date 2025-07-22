// assembly/runtime/instructions/coherence/threshold.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class ThresholdInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // THRESHOLD requires a register and a threshold value.
    }

    const register = args[0].toString();
    const thresholdValue = engine.parseValue(args[1]);
    const registerValue = engine.getRegisterState().getRegister(register);

    if (registerValue < thresholdValue) {
        // This is a conditional execution gate. For now, we'll just return false
        // to indicate the condition was not met. A more robust implementation
        // would involve the execution loop handling this return value.
        return false;
    }

    return true;
  }
}

const threshold = new ThresholdInstruction();
export default threshold;