// assembly/runtime/instructions/system/tick.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class TickInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    engine.getGlobalState().tick();
    return true;
  }
}

const tick = new TickInstruction();
export default tick;