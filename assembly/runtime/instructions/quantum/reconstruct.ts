// assembly/runtime/instructions/quantum/reconstruct.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class ReconstructInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // RECONSTRUCT requires a pattern name and a result register.
    }

    const patternName = args[0].toString();
    const resultReg = args[1].toString();

    const pattern = engine.getMemory().retrievePattern(patternName);
    if (pattern) {
        const success = engine.getMemory().reconstruct(pattern.id, engine.getPrimeEngine());
        engine.getRegisterState().setRegister(resultReg, success ? 1.0 : 0.0, RegisterType.SUCCESS);
    } else {
        engine.getRegisterState().setRegister(resultReg, 0.0, RegisterType.SUCCESS);
    }

    return true;
  }
}

const reconstruct = new ReconstructInstruction();
export default reconstruct;