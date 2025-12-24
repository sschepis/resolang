// assembly/runtime/instructions/resonance/entropy.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class EntropyInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // ENTROPY requires a result register.
    }

    const resultReg = args[0].toString();
    const entropyValue = engine.getGlobalState().getEntropy();

    engine.getRegisterState().setRegister(resultReg, entropyValue, RegisterType.ENTROPY);

    return true;
  }
}

const entropy = new EntropyInstruction();
export default entropy;