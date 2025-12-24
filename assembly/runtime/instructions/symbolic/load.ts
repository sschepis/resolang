// assembly/runtime/instructions/symbolic/load.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class LoadInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // LOAD requires a prime and an amplitude value.
    }

    const prime = engine.parsePrime(args[0]);
    const amplitude = engine.parseValue(args[1]);

    if (amplitude < 0 || amplitude > 1) {
        return false; // Amplitude must be between 0 and 1.
    }

    engine.getPrimeEngine().setAmplitude(prime, amplitude);

    return true;
  }
}

const load = new LoadInstruction();
export default load;