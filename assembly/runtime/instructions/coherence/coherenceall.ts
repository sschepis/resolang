// assembly/runtime/instructions/coherence/coherenceall.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class CoherenceallInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // COHERENCEALL requires a result register.
    }

    const resultReg = args[0].toString();

    const globalCoherence = engine.getGlobalState().calculateGlobalCoherence();
    engine.getRegisterState().setRegister(resultReg, globalCoherence.average, RegisterType.COHERENCE);

    return true;
  }
}

const coherenceall = new CoherenceallInstruction();
export default coherenceall;