// assembly/runtime/instructions/phase/setphase.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class SetphaseInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // SETPHASE requires a prime and a phase value.
    }

    const prime = engine.parsePrime(args[0]);
    const phase = engine.parseValue(args[1]);

    engine.getPrimeEngine().setPhase(prime, phase);

    return true;
  }
}

const setphase = new SetphaseInstruction();
export default setphase;