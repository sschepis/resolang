// assembly/runtime/instructions/flow/endif.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class EndifInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const context = engine.getContext();
    if (context.conditionStack.length === 0) {
        return false; // ENDIF without matching IF.
    }

    engine.getStackManager().popCondition(context);
    
    engine.setContext(context);

    return true;
  }
}

const endif = new EndifInstruction();
export default endif;