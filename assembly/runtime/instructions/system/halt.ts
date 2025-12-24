// assembly/runtime/instructions/system/halt.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class HaltInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const context = engine.getContext();
    
    context.flags.halted = true;
    context.flags.running = false;
    
    engine.setContext(context);
    return false;
  }
}

const halt = new HaltInstruction();
export default halt;