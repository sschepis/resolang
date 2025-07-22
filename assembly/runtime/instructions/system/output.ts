// assembly/runtime/instructions/system/output.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class OutputInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // OUTPUT requires a value.
    }

    const value = engine.parseValue(args[0]);
    // AssemblyScript doesn't have a direct equivalent of console.log that works
    // in all environments. We'll need to implement a host binding for this.
    // For now, this is a placeholder.
    
    return true;
  }
}

const output = new OutputInstruction();
export default output;